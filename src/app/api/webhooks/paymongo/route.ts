import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getPayload } from 'payload';
import config from '@/payload.config';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const PAYMONGO_WEBHOOK_SECRET = process.env.PAYMONGO_WEBHOOK_SECRET;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const CONTACT_RECEIVER_EMAIL = process.env.CONTACT_RECEIVER_EMAIL || 'abrerajuliecca@gmail.com';

export async function POST(req: Request) {
  console.log('[PAYMONGO-WEBHOOK] Request received from PayMongo');
  try {
    const payload = await req.text();
    const signature = req.headers.get('paymongo-signature');

    if (!signature || !PAYMONGO_WEBHOOK_SECRET) {
      console.error('Webhook signature or secret missing');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Verify PayMongo Signature
    const [tPart, v1Part] = signature.split(',');
    const timestamp = tPart.split('=')[1];
    const signatureV1 = v1Part.split('=')[1];

    const baseString = timestamp + '.' + payload;
    const expectedSignature = crypto
      .createHmac('sha256', PAYMONGO_WEBHOOK_SECRET)
      .update(baseString)
      .digest('hex');

    if (signatureV1 !== expectedSignature) {
      console.error('[PAYMONGO-WEBHOOK] Signature Mismatch!');
      console.error('[PAYMONGO-WEBHOOK] Received:', signatureV1);
      console.error('[PAYMONGO-WEBHOOK] Expected:', expectedSignature);
      return NextResponse.json({ error: 'Invalid Signature' }, { status: 401 });
    }

    // 2. Process Event
    const event = JSON.parse(payload);
    const eventType = event.data.attributes.type;

    console.log('[PAYMONGO-WEBHOOK] Full Event Object:', JSON.stringify(event, null, 2));
    console.log('[PAYMONGO-WEBHOOK] Event Type:', eventType);

    if (eventType === 'checkout_session.payment.paid') {
      const checkoutSession = event.data.attributes.data;
      const checkoutSessionId = checkoutSession.id;
      const orderId = checkoutSession.attributes?.metadata?.orderId;
      
      console.log('[PAYMONGO-WEBHOOK] Metadata received:', checkoutSession.attributes?.metadata);
      
      const payloadCms = await getPayload({ config }) as any;

      console.log('[PAYMONGO-WEBHOOK] Processing Paid Session:', checkoutSessionId, 'for Order:', orderId);

      // 1. Find the Order (Prefer metadata ID, fallback to searching by paymentId)
      let order = null;
      if (orderId) {
        try {
          order = await payloadCms.findByID({
            collection: 'orders',
            id: orderId,
            depth: 0,
            overrideAccess: true,
          });
        } catch (e) {
          console.warn('[PAYMONGO-WEBHOOK] Order ID in metadata not found, falling back to paymentId search');
        }
      }

      if (!order) {
        const orders = await payloadCms.find({
          collection: 'orders',
          where: {
            paymentId: {
              equals: checkoutSessionId,
            },
          },
          depth: 0,
          overrideAccess: true,
        });
        if (orders.docs.length > 0) order = orders.docs[0];
      }

      if (order) {
        // Prevent duplicate processing
        if (order.status === 'paid') {
          console.log('[PAYMONGO-WEBHOOK] Order already marked as PAID, but checking for other updates...');
        }

        // 3. Update Order Status
        console.log('[PAYMONGO-WEBHOOK] Updating Order:', order.id, 'to PAID');
        await payloadCms.update({
          collection: 'orders',
          id: order.id,
          data: {
            status: 'paid',
          },
          overrideAccess: true,
        });

        // 4. Side Effects (Vouchers, Inventory, Emails)
        if (!order.processedByWebhook) {
          console.log('[PAYMONGO-WEBHOOK] Processing side effects for order:', order.id);

          // 4.1 Increment Voucher Usage
          if (order.voucher) {
            const voucherId = typeof order.voucher === 'object' ? order.voucher.id : order.voucher;
            try {
              const voucher = await payloadCms.findByID({
                collection: 'vouchers',
                id: voucherId,
                overrideAccess: true,
              });

              if (voucher) {
                await payloadCms.update({
                  collection: 'vouchers',
                  id: voucherId,
                  data: {
                    usageCount: (voucher.usageCount || 0) + 1,
                  },
                  overrideAccess: true,
                });
                console.log(`[PAYMONGO-WEBHOOK] Voucher usage incremented: ${voucherId}`);
              }
            } catch (vError) {
              console.error(`[PAYMONGO-WEBHOOK] Failed to update voucher: ${voucherId}`, vError);
            }
          }

          // 4.2 Update Product Inventory
          if (order.items && Array.isArray(order.items)) {
            for (const item of order.items) {
              const productId = typeof item.product === 'object' ? item.product.id : item.product;
              try {
                const product = await payloadCms.findByID({
                  collection: 'products',
                  id: productId,
                  overrideAccess: true,
                });

                if (product) {
                  await payloadCms.update({
                    collection: 'products',
                    id: productId,
                    data: {
                      stock: Math.max(0, (product.stock || 0) - item.quantity),
                      ordersCount: (product.ordersCount || 0) + item.quantity,
                    },
                    overrideAccess: true,
                  });
                  console.log(`[PAYMONGO-WEBHOOK] Inventory synced for: ${productId}`);
                }
              } catch (pError) {
                console.error(`[PAYMONGO-WEBHOOK] Failed to update inventory for: ${productId}`, pError);
              }
            }
          }

          // 4.3 Notify Merchant & Customer
          if (SMTP_USER && SMTP_PASS) {
            try {
              // Fetch full order with items populated for the email
              const fullOrder = await payloadCms.findByID({
                collection: 'orders',
                id: order.id,
                depth: 2, // Get product details
                overrideAccess: true,
              });

              const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: { user: SMTP_USER, pass: SMTP_PASS },
              });

              const { getMerchantEmail, getCustomerEmail } = await import('@/lib/email-templates');
              
              // A. Send Merchant Notification
              const merchantSubject = fullOrder.type === 'donation' 
                ? `New Support Gift: PHP ${fullOrder.totalAmount}` 
                : `New Order Paid: #${fullOrder.id}`;
                
              await transporter.sendMail({
                from: `"${process.env.NEXT_PUBLIC_SITE_NAME || "Li'L Caca"}" <${SMTP_USER}>`,
                to: CONTACT_RECEIVER_EMAIL,
                subject: merchantSubject,
                html: getMerchantEmail(fullOrder),
              });

              // B. Send Customer Thank You
              if (fullOrder.email) {
                const customerSubject = fullOrder.type === 'donation' 
                  ? `Thank you for your support!` 
                  : `Your order is confirmed! (#${fullOrder.id})`;
                  
                await transporter.sendMail({
                  from: `"${process.env.NEXT_PUBLIC_SITE_NAME || "Li'L Caca"}" <${SMTP_USER}>`,
                  to: fullOrder.email,
                  subject: customerSubject,
                  html: getCustomerEmail(fullOrder),
                });
              }
              console.log('[PAYMONGO-WEBHOOK] Premium emails sent');
            } catch (eError) {
              console.error('[PAYMONGO-WEBHOOK] Email failed:', eError);
            }
          }

          // 4.4 Mark as PROCESSED
          await payloadCms.update({
            collection: 'orders',
            id: order.id,
            data: {
              processedByWebhook: true,
            },
            overrideAccess: true,
          });
          console.log('[PAYMONGO-WEBHOOK] Side effects completed for order:', order.id);

          // 5. Force Refresh Storefront
          revalidatePath('/', 'layout');
          console.log('[PAYMONGO-WEBHOOK] Storefront cache revalidated');
        }
      }
    } 
    else if (eventType === 'checkout_session.expired' || eventType === 'payment.failed') {
      const dataObject = event.data.attributes.data;
      const checkoutSessionId = dataObject.id;
      // For payment.failed, the orderId might be in different places, 
      // but PayMongo usually maps metadata from checkout session to payment
      const orderId = dataObject.attributes?.metadata?.orderId;
      
      const payloadCms = await getPayload({ config }) as any;
      console.log(`[PAYMONGO-WEBHOOK] Session ${eventType}:`, checkoutSessionId);

      // Find the order
      let order = null;
      if (orderId) {
        try {
          order = await payloadCms.findByID({
            collection: 'orders',
            id: orderId,
            overrideAccess: true,
          });
        } catch (e) {}
      }

      if (!order) {
        const orders = await payloadCms.find({
          collection: 'orders',
          where: {
            or: [
              { paymentId: { equals: checkoutSessionId } },
              { 'metadata.orderId': { equals: orderId } } // Fallback check
            ]
          },
          overrideAccess: true,
        });
        if (orders.docs.length > 0) order = orders.docs[0];
      }

      if (order && order.status === 'pending') {
        await payloadCms.update({
          collection: 'orders',
          id: order.id,
          data: { status: 'cancelled' },
          overrideAccess: true,
        });
        console.log(`[PAYMONGO-WEBHOOK] Order marked as CANCELLED due to ${eventType}`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Webhook Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
// End of Webhook
