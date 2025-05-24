export const ATTACHMENT_FIELDS = [
  { name: 'image' as const, label: 'صورة شخصية', type: 'image' },
  { name: 'cv' as const, label: 'سيرة ذاتية', type: 'raw' },
  { name: 'portfolio' as const, label: 'معرض اعمال', type: 'raw' },
  { name: 'additionalFile' as const, label: 'ملف اضافي', type: 'raw' },
] as const; 