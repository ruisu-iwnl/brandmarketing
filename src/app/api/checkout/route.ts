import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload.config';
import { SITE_CONFIG } from '@/lib/constants';

const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY;

export async function POST(req: Request) {
  try {
    const { items, customerDetails } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    if (!PAYMONGO_SECRET_KEY) {
      console.error('PAYMONGO_SECRET_KEY is not defined');
      return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 500 });
    }

    const payload = await getPayload({ config }) as any;

    // 1. Verify products and calculate total
    const lineItems = [];
    let totalAmountCentavos = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await payload.findByID({
        collection: 'products',
        id: item.product.id,
      });

      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.product.id}` }, { status: 404 });
      }

      // Check Stock Availability (Final Sentinel Check)
      const availableStock = product.stock || 0;
      if (product.isSoldOut || availableStock <= 0) {
        return NextResponse.json({ error: `${product.name} is now sold out.` }, { status: 400 });
      }
      
      if (availableStock < item.quantity) {
        return NextResponse.json({ 
          error: `Only ${availableStock} ${availableStock === 1 ? 'piece' : 'pieces'} of ${product.name} are available.` 
        }, { status: 400 });
      }

      const price = Number(product.price);
      const amountCentavos = Math.round(price * 100);
      
      lineItems.push({
        currency: 'PHP',
        amount: amountCentavos,
        description: product.description || product.name,
        name: product.name,
        quantity: item.quantity,
      });

      orderItems.push({
        product: product.id,
        quantity: item.quantity,
        priceAtTime: price,
      });

      totalAmountCentavos += amountCentavos * item.quantity;
    }

    // 2. Create Order in Payload (Status: Pending)
    const order = await payload.create({
      collection: 'orders',
      data: {
        customerName: customerDetails.name,
        email: customerDetails.email,
        phoneNumber: customerDetails.phone,
        shippingAddress: {
          street: customerDetails.address,
          city: customerDetails.city,
          province: customerDetails.province,
          zip: customerDetails.zip,
        },
        items: orderItems,
        totalAmount: totalAmountCentavos / 100,
        status: 'pending',
      },
    });

    // 3. Create PayMongo Checkout Session
    const authHeader = `Basic ${Buffer.from(PAYMONGO_SECRET_KEY + ':').toString('base64')}`;
    
    const baseUrl = SITE_CONFIG.url.replace(/\/$/, '');
    
    const paymongoRes = await fetch('https://api.paymongo.com/v1/checkout_sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify({
        data: {
          attributes: {
            send_email_receipt: true,
            show_description: true,
            show_line_items: true,
            line_items: lineItems,
            payment_method_types: ['card', 'gcash', 'paymaya', 'grab_pay'],
            success_url: `${baseUrl}/success?orderId=${order.id}`,
            cancel_url: `${baseUrl}/cancel?orderId=${order.id}`,
            description: `Order #${order.id} for ${customerDetails.name}`,
            reference_number: order.id.toString(),
            billing: {
              name: customerDetails.name,
              email: customerDetails.email,
              phone: customerDetails.phone,
              address: {
                line1: customerDetails.address,
                city: customerDetails.city,
                state: customerDetails.province,
                postal_code: customerDetails.zip,
                country: 'PH',
              },
            },
            customer_email: customerDetails.email,
            billing_information_fields_editable: 'enabled',
            metadata: {
              orderId: order.id.toString(),
            },
          },
        },
      }),
    });

    const paymongoData = await paymongoRes.json();

    if (!paymongoRes.ok) {
      console.error('PayMongo Error:', paymongoData);
      return NextResponse.json({ error: 'Failed to create payment session' }, { status: 500 });
    }

    const checkoutUrl = paymongoData.data.attributes.checkout_url;
    const paymentId = paymongoData.data.id;

    // 4. Update Order with PayMongo info
    await payload.update({
      collection: 'orders',
      id: order.id,
      data: {
        paymentId: paymentId,
        checkoutUrl: checkoutUrl,
      },
    });

    return NextResponse.json({ checkoutUrl });
  } catch (error: any) {
    console.error('Checkout API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
