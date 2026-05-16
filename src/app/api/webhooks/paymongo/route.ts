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
          overrideAccess: true,
        });
        if (orders.docs.length > 0) order = orders.docs[0];
      }

      if (order) {
        // Prevent duplicate processing
        if (order.status === 'paid') {
          console.log('[PAYMONGO-WEBHOOK] Order already marked as PAID, skipping.');
          return NextResponse.json({ success: true });
        }

        console.log('[PAYMONGO-WEBHOOK] Updating Order:', order.id, 'to PAID');
        
        // 2. Update Order Status
        await payloadCms.update({
          collection: 'orders',
          id: order.id,
          data: {
            status: 'paid',
          },
          overrideAccess: true,
        });

        // 3. Update Product Inventory & Order Counts
        if (order.items && Array.isArray(order.items)) {
          for (const item of order.items) {
            const productId = typeof item.product === 'object' ? item.product.id : item.product;
            
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
          }
        }

        // 4. Notify Merchant & Customer / Patron
        if (SMTP_USER && SMTP_PASS) {
          try {
            const transporter = nodemailer.createTransport({
              host: 'smtp.gmail.com',
              port: 465,
              secure: true,
              auth: { user: SMTP_USER, pass: SMTP_PASS },
            });

            const isDonation = order.type === 'donation';
            
            // A. Send Merchant Notification
            const merchantSubject = isDonation ? `New Support Gift: PHP ${order.totalAmount}` : `New Order Paid: #${order.id}`;
            const merchantTitle = isDonation ? 'Support Gift!' : 'New Sale!';
            const merchantMessage = isDonation 
              ? 'A patron has just sent a gift to support your craft.' 
              : 'A new order has been paid and is ready for packing.';

            await transporter.sendMail({
              from: `"${process.env.NEXT_PUBLIC_SITE_NAME || "Li'L Caca"}" <${SMTP_USER}>`,
              to: CONTACT_RECEIVER_EMAIL,
              subject: merchantSubject,
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #FDF2F8; border-radius: 24px;">
                  <h1 style="color: #111; font-weight: 300; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 24px;">${merchantTitle}</h1>
                  <p style="color: #555; line-height: 1.6;">${merchantMessage}</p>
                  <div style="background: white; padding: 24px; border-radius: 16px; margin: 24px 0;">
                    <p style="margin: 0; font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 0.1em;">${isDonation ? 'Gift Amount' : 'Order ID'}</p>
                    <p style="margin: 4px 0 16px 0; font-family: monospace; color: #EC4899;">${isDonation ? `PHP ${order.totalAmount}` : order.id}</p>
                    
                    <p style="margin: 0; font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 0.1em;">Patron / Customer</p>
                    <p style="margin: 4px 0 0 0; color: #111;">${order.customerName}</p>
                  </div>
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/collections/orders/${order.id}" 
                     style="display: inline-block; background: #111; color: white; padding: 16px 32px; border-radius: 99px; text-decoration: none; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">
                    View in Admin
                  </a>
                </div>
              `,
            });
            console.log('[PAYMONGO-WEBHOOK] Merchant notified');

            // B. Send Customer / Patron Thank You
            if (order.email) {
              const customerSubject = isDonation ? `Thank you for your support, ${order.customerName}` : `Your ${process.env.NEXT_PUBLIC_SITE_NAME || "Li'L Caca"} treasures are confirmed! (#${order.id})`;
              const customerTitle = isDonation ? 'A Heartfelt Thank You' : 'Order Confirmed';
              const customerMessage = isDonation 
                ? `Hi ${order.customerName}! Thank you so much for your gift. It really helps me keep making art.` 
                : `Hi ${order.customerName}! Thanks for your order. I am so happy you like my work. I will pack it for you now!`;

              await transporter.sendMail({
                from: `"${process.env.NEXT_PUBLIC_SITE_NAME || "Li'L Caca"}" <${SMTP_USER}>`,
                to: order.email,
                subject: customerSubject,
                html: `
                  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #FDF2F8; border-radius: 24px;">
                    <div style="text-align: center; margin-bottom: 32px;">
                      <span style="font-size: 10px; text-transform: uppercase; tracking: 0.2em; color: #EC4899;">${process.env.NEXT_PUBLIC_SITE_NAME || "Li'L Caca"}</span>
                    </div>
                    <h1 style="color: #111; font-weight: 300; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 24px; text-align: center;">${customerTitle}</h1>
                    <p style="color: #555; line-height: 1.8; text-align: center; font-size: 16px;">${customerMessage}</p>
                    
                    <div style="background: white; padding: 32px; border-radius: 24px; margin: 32px 0; border: 1px solid #FBCFE8;">
                      <h2 style="font-size: 10px; uppercase; tracking: 0.2em; color: #999; margin-bottom: 16px; text-align: center;">${isDonation ? 'Gift Summary' : 'Order Summary'}</h2>
                      <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px;">
                        <span style="color: #666;">Identifier</span>
                        <span style="font-family: monospace; color: #EC4899;">#${order.id}</span>
                      </div>
                      <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px;">
                        <span style="color: #666;">Amount</span>
                        <span style="color: #111; font-weight: bold;">PHP ${order.totalAmount}</span>
                      </div>
                      <div style="display: flex; justify-content: space-between; font-size: 14px;">
                        <span style="color: #666;">Status</span>
                        <span style="color: #059669; font-weight: bold; text-transform: uppercase; font-size: 10px; tracking: 0.1em;">Paid & Confirmed</span>
                      </div>
                    </div>

                    <p style="color: #999; font-size: 12px; text-align: center; line-height: 1.6; font-style: italic;">
                      "Every item is special. Thank you for being part of the story."
                    </p>
                    
                    <div style="text-align: center; margin-top: 40px;">
                      <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="color: #EC4899; text-decoration: none; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em; font-weight: bold;">Visit ${process.env.NEXT_PUBLIC_SITE_NAME || "Li'L Caca"}</a>
                    </div>
                  </div>
                `,
              });
              console.log('[PAYMONGO-WEBHOOK] Customer/Patron thanked');
            }
          } catch (emailError) {
            console.error('[PAYMONGO-WEBHOOK] Email failed:', emailError);
          }
        }

        // 5. Force Refresh Storefront (Clear Cache)
        revalidatePath('/', 'layout');
        console.log('[PAYMONGO-WEBHOOK] Storefront cache revalidated');
      } else {
        console.error('[PAYMONGO-WEBHOOK] Order not found for session:', checkoutSessionId);
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
