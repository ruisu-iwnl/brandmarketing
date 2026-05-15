import { getPayload } from 'payload';
import config from '@/payload.config';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const payload = await getPayload({ config });
    
    // Try finding by ID first (including drafts)
    let product;
    try {
      product = await (payload as any).findByID({
        collection: 'products',
        id,
        overrideAccess: true,
        draft: true,
      });
    } catch (e) {
      // Fallback to slug search
      const search = await (payload as any).find({
        collection: 'products',
        where: { slug: { equals: id } },
        overrideAccess: true,
        draft: true,
        limit: 1,
      });
      if (search.docs.length > 0) product = search.docs[0];
    }

    if (!product) return NextResponse.json({ error: 'Not Found' }, { status: 404 });

    const currentViews = typeof product.viewsCount === 'number' ? product.viewsCount : 0;

    await (payload as any).update({
      collection: 'products',
      id: product.id,
      data: { viewsCount: currentViews + 1 },
      overrideAccess: true,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
