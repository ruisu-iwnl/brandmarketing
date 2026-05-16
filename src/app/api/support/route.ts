import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload.config';
import { SITE_CONFIG } from '@/lib/constants';

const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY;

export async function POST(req: Request) {
  try {
    const { amount, customerName, email } = await req.json();
    console.log('[SUPPORT-API] Received Request:', { amount, customerName, email });

    if (!amount || amount < 100) {
      return NextResponse.json({ error: 'Minimum support amount is ₱100' }, { status: 400 });
    }

    if (!PAYMONGO_SECRET_KEY) {
      return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 500 });
    }

    const payload = await getPayload({ config }) as any;

    // 1. Create Donation Record in Payload
    const donation = await payload.create({
      collection: 'orders',
      data: {
        type: 'donation',
        customerName: customerName || 'Anonymous',
        email: email || 'anonymous@joulery.com',
        totalAmount: amount,
        status: 'pending',
        items: [], // Donations have no product items
      },
    });

    // 2. Create PayMongo Checkout Session
    const authHeader = `Basic ${Buffer.from(PAYMONGO_SECRET_KEY + ':').toString('base64')}`;
    const baseUrl = SITE_CONFIG.url.replace(/\/$/, '');

    console.log('[SUPPORT-API] Creating session for:', amount, 'PHP');

    const paymongoRes = await fetch('https://api.paymongo.com/v1/checkout_sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify({
        data: {
          attributes: {
            line_items: [
              {
                currency: 'PHP',
                amount: Math.round(amount * 100),
                description: 'Artisan Support Gift',
                name: 'Support Joulery',
                quantity: 1,
              },
            ],
            payment_method_types: ['card', 'gcash', 'paymaya', 'grab_pay'],
            success_url: `${baseUrl}/success?orderId=${donation.id}&isDonation=true`,
            cancel_url: `${baseUrl}/cancel?orderId=${donation.id}&isDonation=true`,
            customer_email: email,
            description: `Support Gift from ${customerName || 'Anonymous'}`,
            reference_number: donation.id.toString(),
            billing: {
              name: customerName || 'Anonymous',
              email: email,
            },
            metadata: {
              orderId: donation.id.toString(),
              type: 'donation',
            },
          },
        },
      }),
    });

    const paymongoData = await paymongoRes.json();

    if (!paymongoRes.ok) {
      console.error('[SUPPORT-API] PayMongo Error:', JSON.stringify(paymongoData, null, 2));
      return NextResponse.json({ error: 'Failed to create support session' }, { status: 500 });
    }

    const checkoutUrl = paymongoData.data.attributes.checkout_url;
    const paymentId = paymongoData.data.id;

    // 3. Update Record with PayMongo info
    await payload.update({
      collection: 'orders',
      id: donation.id,
      data: {
        paymentId: paymentId,
        checkoutUrl: checkoutUrl,
      },
    });

    return NextResponse.json({ checkoutUrl });
  } catch (error: any) {
    console.error('Support API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
