import { CollectionConfig } from 'payload';

const Vouchers: CollectionConfig = {
  slug: 'vouchers',
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'type', 'value', 'active', 'usageCount'],
    group: 'Shop',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'The discount code customers enter at checkout.',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'percentage',
      options: [
        { label: 'Percentage (%)', value: 'percentage' },
        { label: 'Fixed Amount (₱)', value: 'fixed' },
      ],
    },
    {
      name: 'value',
      type: 'number',
      required: true,
      admin: {
        description: 'Enter percentage (e.g., 10 for 10%) or fixed amount in PHP.',
      },
    },
    {
      name: 'expirationDate',
      type: 'date',
      admin: {
        description: 'Optional. Voucher will not work after this date.',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'usageLimit',
      type: 'number',
      admin: {
        description: 'Maximum number of times this voucher can be used. Leave blank for unlimited.',
      },
    },
    {
      name: 'usageCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
  ],
};

export default Vouchers;
