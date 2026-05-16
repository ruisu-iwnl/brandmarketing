import { getPayload } from 'payload';
import config from '@/payload.config';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const payload = await getPayload({ config }) as any;
    
    // 1. Find product
    let product;
    try {
      product = await payload.findByID({ collection: 'products', id });
    } catch (e) {
      const search = await payload.find({
        collection: 'products',
        where: { slug: { equals: id } },
        limit: 1,
      });
      product = search.docs[0];
    }

    if (!product) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }

    const nextViews = (Number(product.viewsCount) || 0) + 1;

    // 2. Perform Update
    try {
      await payload.update({
        collection: 'products',
        id: product.id,
        data: { viewsCount: nextViews },
        overrideAccess: true,
      });
    } catch (updateErr: any) {
      throw updateErr;
    }

    return NextResponse.json({ success: true, newCount: nextViews });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
