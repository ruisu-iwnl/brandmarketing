import { getPayload } from 'payload';
import config from '@/payload.config';
import { productsData } from '@/data/products';
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET() {
  try {
    const payload = await getPayload({ config });
    
    const results = [];
    
    // 1. Filter out mock products (those with placeholder images)
    const realProducts = productsData.filter(p => 
      p.imageStill && 
      !p.imageStill.includes('placeholder.png')
    );
    
    const heroSlides: any[] = [];

    const findMediaByFilename = async (filename: string, size: number) => {
      const existing = await (payload as any).find({
        collection: 'media',
        where: { 
          and: [
            { filename: { equals: filename } },
            { filesize: { equals: size } }
          ]
        }
      });
      return existing.docs[0]?.id || null;
    };

    for (const p of realProducts) {
      console.log(`Migrating: ${p.name}`);
      
      // 2. Upload Still Image
      const cleanStillPath = p.imageStill.replace(/^\//, '');
      const stillPath = path.join(process.cwd(), 'public', cleanStillPath);
      const stillFilename = path.basename(stillPath);
      const stillSize = fs.existsSync(stillPath) ? fs.statSync(stillPath).size : 0;
      let stillId = await findMediaByFilename(stillFilename, stillSize);
      
      if (!stillId && fs.existsSync(stillPath)) {
        const stillMedia = await (payload as any).create({
          collection: 'media',
          data: { alt: p.name + ' Still' },
          file: {
            data: fs.readFileSync(stillPath),
            name: stillFilename,
            mimetype: stillPath.endsWith('.png') ? 'image/png' : 'image/jpeg',
            size: stillSize,
          }
        });
        stillId = stillMedia.id;
      }

      // 3. Upload Worn Image
      const cleanWornPath = p.imageWorn.replace(/^\//, '');
      const wornPath = path.join(process.cwd(), 'public', cleanWornPath);
      const wornFilename = path.basename(wornPath);
      const wornSize = fs.existsSync(wornPath) ? fs.statSync(wornPath).size : 0;
      let wornId = await findMediaByFilename(wornFilename, wornSize);
      
      if (!wornId && fs.existsSync(wornPath)) {
        const wornMedia = await (payload as any).create({
          collection: 'media',
          data: { alt: p.name + ' Lifestyle' },
          file: {
            data: fs.readFileSync(wornPath),
            name: wornFilename,
            mimetype: wornPath.endsWith('.png') ? 'image/png' : 'image/jpeg',
            size: wornSize,
          }
        });
        wornId = wornMedia.id;
      }

      // 4. Create Product in Payload
      if (stillId && wornId) {
        const existing = await (payload as any).find({
          collection: 'products',
          where: { name: { equals: p.name } }
        });

        let productId = existing.docs[0]?.id;

        if (!productId) {
          const product = await (payload as any).create({
            collection: 'products',
            data: {
              name: p.name,
              slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
              price: Number(p.price),
              description: p.description,
              category: p.category,
              stock: p.stock || 10,
              ordersCount: p.ordersCount || 0,
              imageStill: stillId,
              imageWorn: wornId,
              reviews: (p.reviews || []).map(r => ({
                author: r.author,
                rating: r.rating,
                date: new Date().toISOString(),
                content: r.content
              }))
            }
          });
          productId = product.id;
        }

        // 5. Collect Hero Slides data
        const heroPresets: Record<string, any> = {
          'Aquamarine Silk': { aesthetic: 'droplet', color: '#a5d8d9', shadow: 'rgba(15, 118, 110, 0.4)', image: 'images/hero3.png' },
          'Amethyst Aura': { aesthetic: 'shard', color: '#c4b5fd', shadow: 'rgba(91, 33, 182, 0.4)', image: 'images/ame.png' },
          'Obsidian Heart': { aesthetic: 'fragment', color: '#94a3b8', shadow: 'rgba(15, 23, 42, 0.5)', image: 'images/hero2.png' },
          'Crystal White': { aesthetic: 'sparkle', color: '#cbd5e1', shadow: 'rgba(71, 85, 105, 0.35)', image: 'images/hero4.png' },
        };

        if (heroPresets[p.name]) {
          const preset = heroPresets[p.name];
          const heroFilename = path.basename(preset.image);
          const heroPath = path.join(process.cwd(), 'public', preset.image);
          const heroSize = fs.existsSync(heroPath) ? fs.statSync(heroPath).size : 0;
          let heroImageId = await findMediaByFilename(heroFilename, heroSize);
          
          if (!heroImageId && fs.existsSync(heroPath)) {
             const heroMedia = await (payload as any).create({
              collection: 'media',
              data: { alt: p.name + ' Hero' },
              file: {
                data: fs.readFileSync(heroPath),
                name: heroFilename,
                mimetype: 'image/png',
                size: heroSize,
              }
            });
            heroImageId = heroMedia.id;
          }

          heroSlides.push({
            product: productId,
            heroImage: heroImageId,
            aesthetic: preset.aesthetic,
            backgroundColor: preset.color,
            shadowColor: preset.shadow,
            scale: 0.5
          });
          results.push(`Slide Prepared: ${p.name}`);
        }
        results.push(`Success: ${p.name}`);
      }
    }

    // 6. Update the Homepage Global
    if (heroSlides.length > 0) {
      await (payload as any).updateGlobal({
        slug: 'homepage',
        data: {
          heroSlides: heroSlides
        }
      });
      results.push(`Homepage Global Updated with ${heroSlides.length} slides.`);
    }
    
    return NextResponse.json({ 
      message: "Migration Complete", 
      processed: realProducts.length,
      details: results 
    });
    
  } catch (error: any) {
    console.error("Migration Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
