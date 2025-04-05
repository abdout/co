export const ATTACHMENT_FIELDS = [
  { name: 'image' as const, label: 'Profile Picture', type: 'image' },
  { name: 'resume' as const, label: 'Resume File', type: 'raw' },
  { name: 'iqama' as const, label: 'Iqama No.', type: 'image' },
  { name: 'sce' as const, label: 'SCE Cert.', type: 'image' },
  { name: 'passport' as const, label: 'Passport Image', type: 'image' },
  { name: 'drivingLicense' as const, label: 'Driving License', type: 'image' },
] as const; 