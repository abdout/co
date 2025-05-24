"use client";

import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { contactSchema, ContactSchema } from "./validation";
import { createContact, updateContact } from "./action";
import { useActionState } from "react";
import { useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { FaPhone, FaWhatsapp, FaTwitter, FaFacebook, FaLinkedin, FaTelegram, FaInstagram, FaTiktok, FaLink } from 'react-icons/fa';
import { useFormContext } from '@/components/twitter/edit/form-context';
import { getNextRoute } from '../utils';
import { SuccessToast, ErrorToast, showValidationErrorToast } from '@/components/atom/toast';

type ContactField = keyof Omit<ContactSchema, 'id'>;

const tabsData: Array<{icon: React.ReactElement, name: ContactField, label: string, placeholder: string, showOnMobile?: boolean}> = [
  // { icon: <FaTiktok size={26} />, name: 'tiktok', label: 'تيك توك', placeholder: '@username' },
  { icon: <FaLink size={24} />, name: 'link', label: 'رابط شخصي', placeholder: 'https://yourwebsite.com', showOnMobile: true },
  { icon: <FaInstagram size={28} />, name: 'instagram', label: 'انستجرام', placeholder: '@username', showOnMobile: true },
  { icon: <FaLinkedin size={28} />, name: 'linkedin', label: 'لينكدان', placeholder: 'https://linkedin.com/in/username', showOnMobile: true },
  { icon: <FaFacebook size={28} />, name: 'facebook', label: 'فيسبوك', placeholder: 'https://facebook.com/username', showOnMobile: true },
  { icon: <FaTwitter size={28} />, name: 'twitter', label: 'تويتر', placeholder: 'https://twitter.com/username', showOnMobile: true },
  { icon: <FaTelegram size={28} />, name: 'telegram', label: 'تيليجرام', placeholder: '@username', showOnMobile: true },
  { icon: <FaWhatsapp size={28} />, name: 'whatsapp', label: 'واتساب', placeholder: '+1234567890', showOnMobile: true },
  { icon: <FaPhone size={24} />, name: 'phone', label: 'الهاتف', placeholder: '+1234567890', showOnMobile: true },
];

const ContactForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: ContactSchema;
}) => {
  const { formRef, setCurrentFormId } = useFormContext();
  const [activeTab, setActiveTab] = useState<string>("phone");
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ContactSchema>({
    resolver: zodResolver(contactSchema),
    defaultValues: data || {
      phone: '',
      whatsapp: '',
      twitter: '',
      facebook: '',
      linkedin: '',
      link: '',
      telegram: '',
      instagram: '',
      tiktok: '',
    }
  });

  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState(
    type === "create" ? createContact : updateContact,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((formData) => {
    // Ensure all fields have at least empty string values
    const data = {
      phone: formData.phone || '',
      whatsapp: formData.whatsapp || '',
      twitter: formData.twitter || '',
      facebook: formData.facebook || '',
      linkedin: formData.linkedin || '',
      link: formData.link || '',
      telegram: formData.telegram || '',
      instagram: formData.instagram || '',
      tiktok: formData.tiktok || '',
      id: formData.id
    };

    // Save to localStorage for step navigation tracking
    localStorage.setItem('contactFormData', JSON.stringify(data));

    startTransition(() => {
      formAction(data);
    });
  }, (errors) => {
    // Show error toast for validation errors
    if (errors.phone) {
      showValidationErrorToast(errors.phone.message || "رقم الهاتف مطلوب");
    } else if (errors.whatsapp) {
      showValidationErrorToast(errors.whatsapp.message || "طريقة اتصال اضافية مطلوبة");
    }
  });

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (state.success) {
      // Show success toast using the centralized component
      SuccessToast();
      
      // Navigate to next route with slight delay
      setTimeout(() => {
        router.push(getNextRoute(pathname));
      }, 300);
    } else if (state.error) {
      ErrorToast("فشل حفظ البيانات");
    }
  }, [state, router, pathname]);

  useEffect(() => {
    setCurrentFormId('contact');
  }, [setCurrentFormId]);

  return (
    <form 
      ref={formRef} 
      className="w-full h-fullflex flex-col p-2"
      
      onSubmit={onSubmit}
    >
      {data?.id && (
        <input type="hidden" {...register('id')} defaultValue={data.id} />
      )}

      <Tabs 
        defaultValue="phone" 
        dir="rtl"
        onValueChange={(value) => setActiveTab(value)}
      >
        {tabsData.map(({ name, label, placeholder }) => (
          <TabsContent key={name} value={name}>
            <Card>
              <CardContent>
                <Label className="flex items-center gap-2 py-2">
                  {label}
                </Label>
                <Input
                  id={name}
                  {...register(name)}
                  defaultValue={data?.[name] || ''}
                  placeholder={placeholder}
                  aria-invalid={errors[name] ? "true" : "false"}
                  className="w-full items-center justify-center border rounded-md"
                />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
        <div className="flex items-center justify-center mb-4">
          <TabsList className="grid grid-cols-4 md:grid-cols-8 items-center justify-center gap-2 md:gap-2 bg-background">
            {tabsData.slice().reverse().map(({ icon, name, showOnMobile }) => (
              <TabsTrigger 
                key={name} 
                value={name} 
                className={`p-1 flex justify-center hover:bg-transparent focus:bg-transparent data-[state=active]:bg-transparent focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none ${!showOnMobile ? 'hidden md:flex' : ''}`}
              >
                {React.cloneElement(icon as React.ReactElement<{className?: string}>, {
                  className: `transition-colors ${activeTab === name ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`
                })}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>
      
      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      
      <Button type="submit" className="hidden w-full mt-8" disabled={isPending}>
        {isPending ? "Saving..." : type === "create" ? "Create" : "Update"}
      </Button>

      <button 
        id="submit-contact" 
        type="submit" 
        className="hidden"
      />
    </form>
  );
};

export default ContactForm;