import { getPayload } from 'payload';
import config from '@/payload.config';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const payload = await getPayload({ config });
    
    // 1. Clear the Homepage Global
    await (payload as any).updateGlobal({
      slug: 'homepage',
      data: {
        heroSlides: []
      }
    });

    // 2. Delete all Products
    await (payload as any).delete({
      collection: 'products',
      where: { id: { exists: true } }
    });

    // 3. Delete all Media (This should also trigger file deletion in public/media)
    await (payload as any).delete({
      collection: 'media',
      where: { id: { exists: true } }
    });

    return NextResponse.json({ 
      message: "Cleanup Successful", 
      details: "Homepage cleared, Products and Media deleted. You are now ready for a fresh migration." 
    });
    
  } catch (error: any) {
    console.error("Cleanup Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
