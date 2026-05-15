import { getPayload } from 'payload';
import configPromise from '@/payload.config';

export async function getProducts() {
  try {
    const payload = await getPayload({ config: configPromise });
    const data = await (payload as any).find({
      collection: 'products',
      limit: 100,
      depth: 2,
    });
    
    return data.docs.map((doc: any) => ({
      id: doc.id,
      name: doc.name,
      slug: doc.slug,
      price: doc.price,
      description: doc.description,
      category: doc.category,
      ordersCount: doc.ordersCount || 0,
      stock: doc.stock || 0,
      imageStill: doc.imageStill?.url || '/images/hero2.png',
      imageWorn: doc.imageWorn?.url || '/images/hero2.png',
      gallery: (doc.gallery || []).map((g: any) => g.image?.url).filter(Boolean),
      video: doc.video?.url || null,
      reviews: doc.reviews || [],
    }));
  } catch (error) {
    console.error('Payload Fetch Error:', error);
    return [];
  }
}

export async function getHeroSlides() {
  try {
    const payload = await getPayload({ config: configPromise });
    const data = await (payload as any).findGlobal({
      slug: 'homepage',
      depth: 2,
    });
    
    const slides = (data as any).heroSlides || [];
    
    const defaultDecor = [
      { x: "15%", y: "20%", size: 40, delay: 0.1 },
      { x: "85%", y: "15%", size: 60, delay: 0.3 },
      { x: "75%", y: "70%", size: 30, delay: 0.5 },
      { x: "10%", y: "80%", size: 50, delay: 0.2 },
      { x: "30%", y: "10%", size: 35, delay: 0.6 },
      { x: "60%", y: "25%", size: 45, delay: 0.4 },
      { x: "40%", y: "85%", size: 55, delay: 0.7 },
      { x: "90%", y: "60%", size: 40, delay: 0.8 },
    ];

    return slides.map((slide: any) => {
      const reviews = slide.product?.reviews || [];
      const averageRating = reviews.length > 0 
        ? Math.round(reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length) 
        : 0;

      return {
        id: slide.id,
        productId: slide.product?.id,
        name: slide.product?.name?.split(' ')[0] || "Jewelry",
        fullName: slide.product?.name || "Featured Piece",
        image: slide.heroImage?.url || slide.product?.imageStill?.url || '/images/hero2.png',
        color: slide.backgroundColor,
        shadowColor: slide.shadowColor,
        description: slide.product?.description || "",
        scale: slide.scale || 0.5,
        averageRating: averageRating,
        decor: defaultDecor.map(d => ({ ...d, type: slide.aesthetic }))
      };
    });
  } catch (error) {
    console.error('Payload Global Fetch Error:', error);
    return [];
  }
}
