import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload.config';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload = await getPayload({ config }) as any;

    // Only cancel if it's currently pending
    const order = await payload.findByID({
      collection: 'orders',
      id,
      overrideAccess: true,
    });

    if (order && order.status === 'pending') {
      await payload.update({
        collection: 'orders',
        id,
        data: {
          status: 'cancelled',
        },
        overrideAccess: true,
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ message: 'Order not in pending status or not found' });
  } catch (error: any) {
    console.error('[CANCEL-ORDER-API] Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
