"use client";

import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { contactSchema, ContactSchema } from "./validation";
import { createContact, updateContact } from "./action";
import { useActionState } from "react";
import { useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { FaPhoneSquare, FaWhatsapp, FaTwitter, FaFacebook, FaLinkedin } from 'react-icons/fa';
import { useFormContext } from '@/components/onboarding/form-context';
import { getNextRoute } from '../utils';
import PageHeading from '../page-heading';

type ContactField = keyof Omit<ContactSchema, 'id'>;

const tabsData: Array<{icon: React.ReactNode, name: ContactField, label: string, placeholder: string}> = [
  
  { icon: <FaLinkedin size={32} />, name: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
  { icon: <FaFacebook size={32} />, name: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/username' },
  { icon: <FaTwitter size={32} />, name: 'twitter', label: 'Twitter', placeholder: 'https://twitter.com/username' },
  { icon: <FaWhatsapp size={32} />, name: 'whatsapp', label: 'WhatsApp', placeholder: '+1234567890' },
{ icon: <FaPhoneSquare size={32} style={{ transform: 'rotate(90deg)' }} />, name: 'phone', label: 'Phone', placeholder: '+1234567890' },
];

const ContactForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: ContactSchema;
}) => {
  const { formRef, setCurrentFormId } = useFormContext();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactSchema>({
    resolver: zodResolver(contactSchema),
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
    // Get the original data for comparison
    const originalData = data || {};
    
    // Only update fields that have been changed or were already set
    // This prevents sending empty/null values for fields that weren't changed
    const submissionData = {
      phone: formData.phone || '', // Phone is required or empty string
      // For social media fields, preserve original data if not changed
      whatsapp: formData.whatsapp !== undefined && formData.whatsapp !== '' ? formData.whatsapp : originalData.whatsapp || '',
      twitter: formData.twitter !== undefined && formData.twitter !== '' ? formData.twitter : originalData.twitter || '',
      facebook: formData.facebook !== undefined && formData.facebook !== '' ? formData.facebook : originalData.facebook || '',
      linkedin: formData.linkedin !== undefined && formData.linkedin !== '' ? formData.linkedin : originalData.linkedin || '',
      id: formData.id
    };

    // Save to localStorage for step navigation tracking
    localStorage.setItem('contactFormData', JSON.stringify(submissionData));

    startTransition(() => {
      formAction(submissionData);
    });
  });

  const router = useRouter();
  const pathname = usePathname();

  const onSubmitSuccess = useCallback(() => {
    toast.success(`Contact ${type === "create" ? "created" : "updated"}!`);
    router.push(getNextRoute(pathname));
  }, [router, pathname, type]);

  useEffect(() => {
    if (state.success) {
      toast.success("Data save success");
      onSubmitSuccess();
    } else if (state.error) {
      toast.error("Data save faild");
    }
  }, [state, onSubmitSuccess]);

  useEffect(() => {
    setCurrentFormId('contact');
  }, [setCurrentFormId]);

  return (
    <form 
      ref={formRef} 
      className="w-full flex flex-col p-2"
      
      onSubmit={onSubmit}
    >
      <PageHeading title="Contacts"/>
      
      {data?.id && (
        <input type="hidden" {...register('id')} defaultValue={data.id} />
      )}

      <Tabs defaultValue="phone" className="w-full flex flex-col items-center justify-center">
        {tabsData.map(({ name, label, placeholder }) => (
          <TabsContent key={name} value={name}>
            <Card className="w-full border-none shadow-none">
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
                  className="h-10 w-80 items-center justify-center  border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors[name] && (
                  <span className="text-sm text-red-500">
                    {errors[name]?.message}
                  </span>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
        <div className="flex items-center justify-center mb-4">
          <TabsList className="grid grid-cols-4 md:grid-cols-5 items-center justify-center gap-4 md:gap-4 bg-background">
            {tabsData.slice().reverse().map(({ icon, name }) => (
              <TabsTrigger key={name} value={name} className="p-1 flex justify-center text-neutral-600 hover:bg-neutral-200 focus:bg-neutral-200 focus:text-black">
                {icon}
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