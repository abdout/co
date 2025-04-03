export const CONTACT_FIELDS = [
  { name: 'phone' as const, label: 'Phone', type: 'tel' },
  { name: 'whatsapp' as const, label: 'WhatsApp', type: 'tel' },
  { name: 'twitter' as const, label: 'Twitter', type: 'text', prefix: '@' },
  { name: 'facebook' as const, label: 'Facebook', type: 'url' },
  { name: 'linkedin' as const, label: 'LinkedIn', type: 'url' },
  { name: 'telegram' as const, label: 'Telegram', type: 'text', prefix: '@' },
  { name: 'instagram' as const, label: 'Instagram', type: 'text', prefix: '@' },
  { name: 'tiktok' as const, label: 'TikTok', type: 'text', prefix: '@' },
] as const; 