'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { updateProfile } from '@/lib/action';

// Define the form schema
const profileFormSchema = z.object({
  name: z.string().optional().nullable(),
  fullname: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  currentCountry: z.string().optional().nullable(),
  currentState: z.string().optional().nullable(),
  currentLocality: z.string().optional().nullable(),
  twitter: z.string().optional().nullable(),
  facebook: z.string().optional().nullable(),
  linkedin: z.string().optional().nullable(),
  telegram: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  tiktok: z.string().optional().nullable(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Function to fetch user profile data
async function fetchUserProfile() {
  try {
    const user = await currentUser();
    if (!user?.id) return null;
    
    const userData = await db.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        fullname: true,
        email: true,
        phone: true,
        whatsapp: true,
        bio: true,
        currentCountry: true,
        currentState: true,
        currentLocality: true,
        twitter: true,
        facebook: true,
        linkedin: true,
        telegram: true,
        instagram: true,
        tiktok: true,
      }
    });
    
    return userData;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize form with react-hook-form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      fullname: '',
      email: '',
      phone: '',
      whatsapp: '',
      bio: '',
      currentCountry: '',
      currentState: '',
      currentLocality: '',
      twitter: '',
      facebook: '',
      linkedin: '',
      telegram: '',
      instagram: '',
      tiktok: '',
    },
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true);
        const profile = await fetchUserProfile();
        
        if (!profile) {
          setError("لم نتمكن من العثور على بيانات الملف الشخصي");
          return;
        }
        
        // Set form values from profile data
        form.reset({
          name: profile.name || '',
          fullname: profile.fullname || '',
          email: profile.email || '',
          phone: profile.phone || '',
          whatsapp: profile.whatsapp || '',
          bio: profile.bio || '',
          currentCountry: profile.currentCountry || '',
          currentState: profile.currentState || '',
          currentLocality: profile.currentLocality || '',
          twitter: profile.twitter || '',
          facebook: profile.facebook || '',
          linkedin: profile.linkedin || '',
          telegram: profile.telegram || '',
          instagram: profile.instagram || '',
          tiktok: profile.tiktok || '',
        });
      } catch (err) {
        console.error(err);
        setError("حدث خطأ أثناء تحميل بيانات الملف الشخصي");
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [form]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setSubmitting(true);
      
      // Use the updateProfile server action
      const result = await updateProfile({ success: false, error: false }, data);
      
      if (result.success) {
        toast.success("تم تحديث الملف الشخصي بنجاح");
        router.push('/platform/profile');
      } else {
        setError(result.message || "حدث خطأ أثناء تحديث الملف الشخصي");
        toast.error("فشل تحديث الملف الشخصي");
      }
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء تحديث الملف الشخصي");
      toast.error("فشل تحديث الملف الشخصي");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mr-2 text-lg">جاري تحميل الملف الشخصي...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="text-destructive text-xl mb-4">{error}</div>
        <Button onClick={() => router.push('/platform/profile')}>العودة للملف الشخصي</Button>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-8">
      <h1 className="text-3xl font-bold mb-4 text-center">تعديل الملف الشخصي</h1>
      <p className="text-lg text-muted-foreground mb-8 text-center">تعديل معلوماتك الشخصية وبياناتك</p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>المعلومات الشخصية</CardTitle>
              <CardDescription>البيانات الأساسية للملف الشخصي</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الاسم الكامل</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="أدخل اسمك الكامل" value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>البريد الإلكتروني</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="أدخل بريدك الإلكتروني" value={field.value || ''} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رقم الهاتف</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="أدخل رقم هاتفك" value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رقم الواتساب</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="أدخل رقم الواتساب" value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نبذة عنك</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="أدخل نبذة مختصرة عن نفسك" 
                        value={field.value || ''}
                        className="min-h-24"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          {/* Location Card */}
          <Card>
            <CardHeader>
              <CardTitle>الموقع الحالي</CardTitle>
              <CardDescription>معلومات عن مكان إقامتك الحالي</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="currentCountry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الدولة</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="الدولة" value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="currentState"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>المحافظة / الولاية</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="المحافظة أو الولاية" value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="currentLocality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>المدينة / البلدة</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="المدينة أو البلدة" value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Social Media Card */}
          <Card>
            <CardHeader>
              <CardTitle>وسائل التواصل الاجتماعي</CardTitle>
              <CardDescription>روابط حساباتك على وسائل التواصل الاجتماعي</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>تويتر</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="رابط حساب تويتر" value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="facebook"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>فيسبوك</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="رابط حساب فيسبوك" value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>انستجرام</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="رابط حساب انستجرام" value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>لينكد إن</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="رابط حساب لينكد إن" value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="telegram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>تلجرام</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="معرّف تلجرام" value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tiktok"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>تيك توك</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="رابط حساب تيك توك" value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push('/platform/profile')}
            >
              إلغاء
            </Button>
            
            <Button 
              type="submit" 
              disabled={submitting}
            >
              {submitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              حفظ التغييرات
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
} 