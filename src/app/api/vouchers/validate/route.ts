import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload.config';

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Please enter a voucher code' }, { status: 400 });
    }

    const payload = await getPayload({ config }) as any;

    const vouchers = await payload.find({
      collection: 'vouchers',
      where: {
        code: {
          equals: code.toUpperCase(),
        },
        active: {
          equals: true,
        },
      },
      overrideAccess: true,
    });

    if (vouchers.docs.length === 0) {
      return NextResponse.json({ error: 'Invalid or inactive voucher code' }, { status: 404 });
    }

    const voucher = vouchers.docs[0];

    // Check expiration
    if (voucher.expirationDate) {
      const expDate = new Date(voucher.expirationDate);
      if (expDate < new Date()) {
        return NextResponse.json({ error: 'This voucher has expired' }, { status: 400 });
      }
    }

    // Check usage limit
    if (voucher.usageLimit && voucher.usageCount >= voucher.usageLimit) {
      return NextResponse.json({ error: 'This voucher has reached its usage limit' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      voucher: {
        id: voucher.id,
        code: voucher.code,
        type: voucher.type,
        value: voucher.value,
      },
    });
  } catch (error: any) {
    console.error('Voucher Validation Error:', error);
    return NextResponse.json({ error: 'Failed to validate voucher' }, { status: 500 });
  }
}
