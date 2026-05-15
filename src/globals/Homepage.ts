import { GlobalConfig } from 'payload';

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'heroSlides',
      type: 'array',
      minRows: 1,
      maxRows: 10,
      admin: {
        description: 'Drag and drop to reorder your homepage hero slides.',
      },
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products' as any,
          required: true,
          hasMany: false,
        },
        {
          name: 'heroImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Optional: Use a different image for the Hero than the product default.',
          },
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
          name: 'backgroundColor',
          type: 'text',
          required: true,
          defaultValue: '#a5d8d9',
          admin: {
            components: {
              Field: '@/components/admin/ColorPicker',
            },
          },
        },
        {
          name: 'shadowColor',
          type: 'text',
          required: true,
          defaultValue: 'rgba(15, 118, 110, 0.4)',
          admin: {
            components: {
              Field: '@/components/admin/ColorPicker',
            },
          },
        },
        {
          name: 'scale',
          type: 'number',
          required: true,
          defaultValue: 0.5,
        },
      ],
    },
  ],
};
