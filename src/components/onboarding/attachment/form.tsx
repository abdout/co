"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { attachmentSchema, AttachmentSchema } from "./validation";
import { createAttachment, updateAttachment } from "./action";
import { useActionState } from "react";
import { useEffect } from "react";
import { SuccessToast, ErrorToast } from "@/components/atom/toast";
import { useRouter, usePathname } from "next/navigation";
import { ATTACHMENT_FIELDS } from "./constant";
import { useTransition } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useFormContext } from '@/components/onboarding/form-context';
import { getNextRoute } from '../utils';
import type { CloudinaryUploadWidgetResults } from "next-cloudinary";
import PageHeading from "../page-heading";

// Helper function to convert PDF URL to preview URL
const getPdfPreviewUrl = (url: string) => {
  if (!url.includes('cloudinary.com')) return url;
  
  // Extract the base URL and file path
  const baseUrl = url.substring(0, url.indexOf('/upload/') + 8);
  const filePath = url.substring(url.indexOf('/upload/') + 8);
  
  // Generate preview URL with transformation
  return `${baseUrl}q_auto,f_jpg,pg_1/${filePath}`;
};

const AttachmentForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: AttachmentSchema;
}) => {
  // Get form context separately
  const { formRef, setCurrentFormId, setIsLoading, isLoading } = useFormContext();

  const {
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AttachmentSchema>({
    resolver: zodResolver(attachmentSchema),
    defaultValues: data,
  });

  const formValues = watch();
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState(
    type === "create" ? createAttachment : updateAttachment,
    {
      success: false,
      error: false,
    }
  );

  const router = useRouter();
  const pathname = usePathname();

  const onSubmitSuccess = () => {
    SuccessToast();
    setIsLoading(false);
    if (pathname) {
      const nextRoute = getNextRoute(pathname);
      if (nextRoute) {
        router.push(nextRoute);
      }
    }
  };

  const onSubmit = handleSubmit((data) => {
    // Show loading spinner
    setIsLoading(true);
    
    // Check for validation errors and show them via toast instead of inline
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0]?.message;
      if (firstError) {
        ErrorToast(firstError);
      }
      setIsLoading(false);
      return;
    }

    // Save form data to localStorage for step navigation tracking
    localStorage.setItem('attachmentFormData', JSON.stringify(data));

    startTransition(() => {
      formAction(data);
    });
  });

  useEffect(() => {
    setCurrentFormId('attachment');
  }, [setCurrentFormId]);

  useEffect(() => {
    if (state.success) {
      onSubmitSuccess();
    } else if (state.error) {
      ErrorToast("فشل في رفع الملفات");
      setIsLoading(false);
    }
  }, [state, setIsLoading]);

  return (
    <form 
      ref={formRef} 
      onSubmit={onSubmit}
    >
      <PageHeading title="Attachments"/>
      <div className="grid grid-cols-3 gap-4 pt-10">
        {ATTACHMENT_FIELDS.map(({ name, label, type: fieldType }, index) => {
          const isProfilePicture = name === 'image';
          return (
            <CldUploadWidget
              key={name}
              uploadPreset="social"
              options={{
                resourceType: fieldType === 'raw' ? 'auto' : 'image',
                folder: fieldType === 'raw' ? 'pdfs' : 'images',
                // Only allow image upload for image type fields
                sources: fieldType === 'image' 
                  ? ['local', 'camera'] 
                  : ['local', 'camera', 'url', 'dropbox', 'google_drive'],
                // For image types, apply more restrictive formats
                clientAllowedFormats: fieldType === 'image' 
                  ? ['png', 'jpeg', 'jpg'] 
                  : undefined,
              }}
              onSuccess={(result: CloudinaryUploadWidgetResults, { widget }) => {
                if (result.info && typeof result.info === 'object' && 'secure_url' in result.info) {
                  const url = result.info.secure_url as string;
                  console.log(`Setting ${name} field to:`, url);
                  setValue(name, url);
                }
                widget.close();
              }}
            >
              {({ open }: { open: () => void }) => (
                <div
                  onClick={() => open()}
                  className={`relative flex items-center justify-center w-32 ${
                    isProfilePicture ? 'h-32' : ''
                  } cursor-pointer overflow-hidden border border-neutral-500 hover:bg-neutral-100 ${
                    isProfilePicture ? 'rounded-full' : 'rounded-sm'
                  }`}
                  style={!isProfilePicture ? { height: '120px' } : {}}
                >
                  {formValues[name] ? (
                    // Only image types should be displayed as images
                    fieldType === 'image' ? (
                      <>
                        <Image
                          src={formValues[name] && formValues[name].startsWith('http') ? formValues[name] : '/placeholder-profile.png'}
                          alt={label}
                          width={128}
                          height={isProfilePicture ? 128 : 120}
                          className="absolute inset-0 w-full h-full object-cover"
                          unoptimized
                          onError={(e) => {
                            // Handle image loading errors
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-profile.png'; // Fallback to a placeholder
                            console.error('Image failed to load:', formValues[name]);
                          }}
                        />
                        <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-xs text-center py-1">
                          {label}
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Display PDF preview for CV */}
                        {formValues[name] && formValues[name].includes('cloudinary.com') ? (
                          <div className="relative w-full h-full">
                            <Image
                              src={getPdfPreviewUrl(formValues[name])}
                              alt={label}
                              width={128}
                              height={isProfilePicture ? 128 : 120}
                              className="absolute inset-0 w-full h-full object-cover"
                              unoptimized
                            />
                            <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-xs text-center py-1">
                              {label}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center text-gray-700 text-sm">
                            <span>File Uploaded</span>
                            <br />
                            <span className="text-xs">(Click to change)</span>
                          </div>
                        )}
                      </>
                    )
                  ) : (
                    <span className="text-center text-gray-700 text-sm z-10 flex flex-col items-center">
                      {label.split(' ').map((word, index) => (
                        <span key={index}>{word}</span>
                      ))}
                    </span>
                  )}
                </div>
              )}
            </CldUploadWidget>
          );
        })}
      </div>

      <button
        id="submit-attachment"
        type="submit"
        disabled={isPending || isLoading}
        className="hidden w-full bg-neutral-900 text-white p-2 rounded-md hover:bg-neutral-800 disabled:bg-neutral-400"
      >
        {isPending || isLoading ? "Saving..." : type === "create" ? "Upload" : "Update"}
      </button>
    </form>
  );
};

export default AttachmentForm; 