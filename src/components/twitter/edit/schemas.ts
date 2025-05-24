import { z } from 'zod';

export const stepOneSchema = z.object({
  name: z.string().min(1, 'Please enter a name for the product.'),
  link: z
    .string()
    .url('Please enter a valid URL including starting with https://'),
});

export const stepTwoSchema = z.object({
  coupon: z.string().min(5, 'Coupon code must be at least 5 characters long'),
  discount: z.coerce
    .number()
    .min(1, 'Discount must be at least 1%')
    .max(100, 'Discount must be at most 100%'),
});

export const stepThreeSchema = z.object({
  contactName: z
    .string()
    .min(5, 'Please enter a contact name of at least 5 characters long'),
  contactEmail: z.string().email('Please enter a valid email'),
});

export const newDealSchema = z.object({
  ...stepOneSchema.shape,
  ...stepTwoSchema.shape,
  ...stepThreeSchema.shape,
});

export const newDealInitialValuesSchema = z.object({
  name: z.string().optional(),
  link: z.string().optional(),
  coupon: z.string().optional(),
  discount: z.coerce.number().optional(),
  contactName: z.string().optional(),
  contactEmail: z.string().optional(),
});

export type NewDealType = z.infer<typeof newDealSchema>;
export type NewDealInitialValuesType = z.infer<
  typeof newDealInitialValuesSchema
>;

export const termsSchema = z.object({
  oathAcknowledged: z.boolean().refine(val => val === true, {
    message: "يجب الموافقة على الشروط للمتابعة"
  })
});

export const attachmentSchema = z.object({
  image: z.string().optional(),
  cv: z.string().optional(),
  additionalFile: z.string().optional()
});

export const contactSchema = z.object({
  phone: z.string()
    .min(10, "رقم الهاتف يجب أن يكون 10 أرقام على الأقل")
    .max(15, "رقم الهاتف لا يمكن أن يتجاوز 15 رقم"),
  whatsapp: z.string().optional(),
  twitter: z.string()
    .startsWith('@', 'يجب أن يبدأ بـ @')
    .optional()
    .or(z.literal('')),
  facebook: z.string()
    .url('يجب أن يكون رابط صحيح')
    .optional()
    .or(z.literal('')),
  linkedin: z.string()
    .url('يجب أن يكون رابط صحيح')
    .optional()
    .or(z.literal('')),
  telegram: z.string()
    .startsWith('@', 'يجب أن يبدأ بـ @')
    .optional()
    .or(z.literal('')),
  instagram: z.string()
    .startsWith('@', 'يجب أن يبدأ بـ @')
    .optional()
    .or(z.literal('')),
  tiktok: z.string()
    .startsWith('@', 'يجب أن يبدأ بـ @')
    .optional()
    .or(z.literal(''))
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const addressSchema = z.object({
  currentCountry: z.string(),
  currentState: z.string(),
  currentLocality: z.string(),
  currentAdminUnit: z.string().optional(),
  currentNeighborhood: z.string().optional(),
  // ... other address fields
});

export const birthdateSchema = z.object({
  birthCountry: z.string(),
  birthLocality: z.string(),
  birthYear: z.number().int().min(1940).max(new Date().getFullYear()),
  birthMonth: z.number().int().min(1).max(12)
});
