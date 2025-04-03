// 'use client';
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { useFormState } from "react-dom";
// import { useTransition, useEffect } from "react";
// import { contactSchema } from "@/components/onboarding/schemas";
// import type { z } from "zod";
// import { submitContact } from "@/components/onboarding/actions";
// import { useFormContext } from '@/components/onboarding/form-context';

// type ContactFormData = z.infer<typeof contactSchema>;

// interface ContactFormProps {
//   user: {
//     id: string;
//     phone?: string | null;
//     whatsapp?: string | null;
//     twitter?: string | null;
//     facebook?: string | null;
//     linkedin?: string | null;
//     telegram?: string | null;
//     instagram?: string | null;
//     tiktok?: string | null;
//   };
// }

// const fields = [
//   { name: 'phone' as const, label: 'رقم الهاتف', type: 'tel', required: true },
//   { name: 'whatsapp' as const, label: 'واتساب', type: 'tel', required: false },
//   { name: 'twitter' as const, label: 'تويتر', type: 'text', required: false },
//   { name: 'facebook' as const, label: 'فيسبوك', type: 'text', required: false },
//   { name: 'linkedin' as const, label: 'لينكد إن', type: 'text', required: false },
//   { name: 'telegram' as const, label: 'تليجرام', type: 'text', required: false },
//   { name: 'instagram' as const, label: 'انستجرام', type: 'text', required: false },
//   { name: 'tiktok' as const, label: 'تيك توك', type: 'text', required: false },
// ] as const;

// export default function ContactForm({ user }: ContactFormProps) {
//   const router = useRouter();
//   const [isPending, startTransition] = useTransition();
//   const { formRef, setIsSubmitting } = useFormContext();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<ContactFormData>({
//     resolver: zodResolver(contactSchema),
//     defaultValues: {
//       phone: user.phone || '',
//       whatsapp: user.whatsapp || '',
//       twitter: user.twitter || '',
//       facebook: user.facebook || '',
//       linkedin: user.linkedin || '',
//       telegram: user.telegram || '',
//       instagram: user.instagram || '',
//       tiktok: user.tiktok || '',
//     }
//   });

//   const [state, formAction] = useFormState(submitContact, {
//     success: false,
//     error: false,
//   });

//   const onSubmit = handleSubmit((data) => {
//     console.log('Form data being submitted:', data);
//     formAction(data);
//   });

//   useEffect(() => {
//     console.log('Form state changed:', state);
//     if (state.success) {
//       toast.success("تم حفظ البيانات بنجاح");
//       startTransition(() => {
//         router.push('/onboarding/basic-info');
//       });
//     }
//     if (state.error) {
//       console.error('Form submission error:', state.message);
//     }
//   }, [state, router]);

//   return (
//     <form ref={formRef} action={async (formData) => {
//       setIsSubmitting(true);
//       try {
//         await submitContact({ success: false, error: false }, formData);
//       } finally {
//         setIsSubmitting(false);
//       }
//     }} className="space-y-4">
//       {fields.map(({ name, label, type, required }) => (
//         <div key={name}>
//           <Label htmlFor={name}>{label} {required && '*'}</Label>
//           <Input
//             id={name}
//             type={type}
//             {...register(name)}
//             aria-invalid={errors[name] ? "true" : "false"}
//           />
//           {errors[name] && (
//             <span className="text-sm text-red-500">
//               {errors[name]?.message}
//             </span>
//           )}
//         </div>
//       ))}

//       <Button 
//         type="submit" 
//         className="w-full"
//         disabled={isPending}
//       >
//         {isPending ? "جاري الحفظ..." : "حفظ"}
//       </Button>

//       {state.error && (
//         <p className="text-sm text-red-500">
//           حدث خطأ أثناء حفظ البيانات
//         </p>
//       )}
//     </form>
//   );
// } 