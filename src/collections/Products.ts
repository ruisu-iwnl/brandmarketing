import { CollectionConfig } from 'payload';
import path from 'path';
import fs from 'fs';
import { productsData } from '@/data/products';

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'category', 'stock', 'ordersCount', 'viewsCount', 'totalRevenue', 'conversionRate', 'inventoryValue', 'averageRating'],
  },
  access: {
    read: () => true, // Anyone can see products
  },
  hooks: {
    beforeChange: [
      async ({ data, req, originalDoc }) => {
        const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Joulery';
        if (!data.meta) data.meta = {};
        
        // 0. Auto-generate Slug from Name if missing
        if (data.name && !data.slug) {
          data.slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
        }

        // 0.5 Auto-calculate Sold Out status
        const currentStock = data.stock ?? originalDoc?.stock ?? 0;
        data.isSoldOut = currentStock <= 0;

        if (data.name && !data.meta.title) {
          data.meta.title = `${data.name} | ${siteName}`;
        }
        
        if (data.description && !data.meta.description) {
          data.meta.description = data.description.substring(0, 155) + (data.description.length > 155 ? '...' : '');
        }

        if (data.imageStill && !data.meta.image) {
          data.meta.image = data.imageStill;
        }

        // 1. Calculate Revenue & Inventory Value
        const price = data.price ?? originalDoc?.price ?? 0;
        const orders = data.ordersCount ?? originalDoc?.ordersCount ?? 0;
        const stock = data.stock ?? originalDoc?.stock ?? 0;
        const views = data.viewsCount ?? originalDoc?.viewsCount ?? 0;

        data.totalRevenue = price * orders;
        data.inventoryValue = price * stock;

        // 2. Calculate Conversion Rate (capped at 100%, 2 decimal places)
        if (views > 0) {
          const rawRate = (orders / views) * 100;
          const rate = Math.min(100, rawRate).toFixed(2);
          (data as any).conversionRate = `${rate}%`;
        } else {
          (data as any).conversionRate = "0.00%";
        }

        // 3. Calculate Average Rating from embedded reviews array
        const reviewsList = data.reviews ?? (originalDoc as any)?.reviews ?? [];
        if (reviewsList.length > 0) {
          const sum = reviewsList.reduce((acc: number, rev: any) => acc + (Number(rev.rating) || 0), 0);
          data.averageRating = Number((sum / reviewsList.length).toFixed(1));
        } else {
          data.averageRating = 0;
        }

        return data;
      },
    ],
  },
  endpoints: [
    {
      path: '/reset-analytics',
      method: 'post',
      handler: async (req) => {
        if (!req.user) return new Response('Unauthorized', { status: 401 });
        
        const payload = req.payload as any;
        const products = await payload.find({
          collection: 'products',
          limit: 100,
        });

        for (const doc of products.docs) {
          await payload.update({
            collection: 'products',
            id: doc.id,
            data: {
              viewsCount: 0,
              ordersCount: 0,
              reviews: [],
              averageRating: 0,
              newArrival: true,
              isArchived: false,
            },
          });
        }

        return new Response(JSON.stringify({ message: 'Analytics Reset Successful' }), { status: 200 });
      },
    },
    {
      path: '/migrate',
      method: 'post',
      handler: async (req) => {
        if (!req.user) return new Response('Unauthorized', { status: 401 });
        
        const payload = req.payload as any;
        const results = [];
        const realProducts = productsData.filter(p => p.imageStill && !p.imageStill.includes('placeholder.png'));

        for (const p of realProducts) {
          const existing = await payload.find({
            collection: 'products',
            where: { name: { equals: p.name } }
          });

          if (existing.docs.length === 0) {
            // Logic for uploading media would go here, 
            // but for simplicity in this endpoint, we'll assume media exists 
            // or just create the product record if it's new.
            // Actually, we'll just log that it needs full migration if media missing.
            results.push(`Skipped ${p.name}: Use full /api/migrate for media uploads.`);
          } else {
            await payload.update({
              collection: 'products',
              id: existing.docs[0].id,
              data: {
                newArrival: true,
                isArchived: false,
                viewsCount: 0,
                ordersCount: 0,
              }
            });
            results.push(`Updated ${p.name}`);
          }
        }

        return new Response(JSON.stringify({ message: 'Migration/Sync Complete', details: results }), { status: 200 });
      },
    },
    {
      path: '/cleanup',
      method: 'post',
      handler: async (req) => {
        if (!req.user) return new Response('Unauthorized', { status: 401 });
        
        const payload = req.payload as any;
        const allMedia = await payload.find({ collection: 'media', limit: 1000 });
        const allProducts = await payload.find({ collection: 'products', limit: 1000 });
        
        const usedMediaIds = new Set();
        allProducts.docs.forEach((p: any) => {
          if (p.imageStill?.id) usedMediaIds.add(p.imageStill.id);
          if (p.imageWorn?.id) usedMediaIds.add(p.imageWorn.id);
          (p.gallery || []).forEach((g: any) => {
            if (g.image?.id) usedMediaIds.add(g.image.id);
          });
        });

        let deletedCount = 0;
        for (const media of allMedia.docs) {
          if (!usedMediaIds.has(media.id)) {
            await payload.delete({
              collection: 'media',
              id: media.id,
            });
            deletedCount++;
          }
        }

        return new Response(JSON.stringify({ message: `Cleanup Complete. Removed ${deletedCount} unused media files.` }), { status: 200 });
      },
    },
  ],
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: false,
      unique: true,
      index: true,
      admin: {
        description: 'Auto-generated from name if left blank. Used for SEO-friendly URLs.',
        position: 'sidebar',
      },
    },
    {
      name: 'newArrival',
      type: 'checkbox',
      label: 'New Arrival',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Shows a "New Collection" badge on the storefront.',
      },
    },
    {
      name: 'isSoldOut',
      type: 'checkbox',
      label: 'Sold Out',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Automatically set when stock reaches 0.',
      },
    },
    {
      name: 'isArchived',
      type: 'checkbox',
      label: 'Archive Product',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Archived products are hidden from the store but kept for analytics.',
      },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Necklace', value: 'necklace' },
        { label: 'Bracelet', value: 'bracelet' },
      ],
    },
    {
      name: 'stock',
      type: 'number',
      required: true,
      defaultValue: 10,
      min: 0,
    },
    {
      name: 'ordersCount',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Used for sorting by "Best Selling"',
        readOnly: true,
      },
    },
    {
      name: 'viewsCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Total number of times this product was viewed.',
        readOnly: true,
      },
    },
    {
      name: 'totalRevenue',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Total revenue generated by this product (Price x Orders).',
        readOnly: true,
      },
    },
    {
      name: 'conversionRate',
      type: 'text',
      defaultValue: '0%',
      admin: {
        description: 'Percentage of views that turned into orders.',
        readOnly: true,
      },
    },
    {
      name: 'inventoryValue',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Current market value of remaining stock (Price x Stock).',
        readOnly: true,
      },
    },
    {
      name: 'averageRating',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Average customer rating based on reviews.',
        readOnly: true,
      },
    },
    {
      name: 'imageStill',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Product still shot (usually no-bg)',
      },
    },
    {
      name: 'imageWorn',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Lifestyle or worn shot',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Extra Photos (Optional)',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
      admin: {
        description: 'Add more detail shots to show off the craftsmanship.',
      },
    },
    {
      name: 'video',
      type: 'upload',
      relationTo: 'media',
      label: 'Product Video (Optional)',
      admin: {
        description: 'Upload a short video or cinemagraph of the piece.',
      },
    },
    {
      name: 'meta',
      type: 'group',
      label: 'SEO / Meta Data',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Meta Title',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Meta Description',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Meta Preview Image (OG Image)',
        },
      ],
    },
    {
      name: 'reviews',
      type: 'array',
      fields: [
        {
          name: 'author',
          type: 'text',
          required: true,
        },
        {
          name: 'rating',
          type: 'number',
          required: true,
          min: 1,
          max: 5,
          admin: {
            description: 'Enter a rating between 1 and 5.',
          },
        },
        {
          name: 'date',
          type: 'date',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: 'MMM d, yyyy',
            },
          },
        },
        {
          name: 'content',
          type: 'textarea',
          required: true,
        },
      ],
    },
  ],
};
