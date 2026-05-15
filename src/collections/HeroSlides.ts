import { CollectionConfig } from 'payload';

export const HeroSlides: CollectionConfig = {
  slug: 'hero-slides',
  admin: {
    useAsTitle: 'product',
    defaultColumns: ['order', 'product', 'aesthetic'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 1,
      admin: {
        description: 'Lower numbers appear first (e.g., 1, 2, 3)',
      },
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products' as any,
      required: true,
      hasMany: false,
    },
    {
      name: 'aesthetic',
      type: 'select',
      required: true,
      defaultValue: 'droplet',
      options: [
        { label: 'Droplets (Water/Silk)', value: 'droplet' },
        { label: 'Shards (Crystals)', value: 'shard' },
        { label: 'Fragments (Stone/Glass)', value: 'fragment' },
        { label: 'Sparkles (Diamond/Star)', value: 'sparkle' },
      ],
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional: Use a different image for the Hero than the product default (e.g. hero3.png)',
      },
    },
    {
      name: 'backgroundColor',
      type: 'text',
      required: true,
      admin: {
        description: 'Hex code for the slide background (e.g., #a5d8d9)',
      },
    },
    {
      name: 'shadowColor',
      type: 'text',
      required: true,
      admin: {
        description: 'RGBA color for the product shadow (e.g., rgba(15, 118, 110, 0.4))',
      },
    },
    {
      name: 'scale',
      type: 'number',
      required: true,
      defaultValue: 0.5,
      admin: {
        description: 'Image scale (0.5 is recommended)',
      },
    },
  ],
};
