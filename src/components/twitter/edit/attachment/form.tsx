"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { attachmentSchema, AttachmentSchema } from "./validation";
import { createAttachment, updateAttachment } from "./action";
import { useActionState } from "react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import { ATTACHMENT_FIELDS } from "./constant";
import { useTransition } from "react";
import Image from "next/image";
import { useFormContext } from '@/components/twitter/edit/form-context';
import { getNextRoute } from '../utils';
import type { CloudinaryUploadWidgetResults } from "next-cloudinary";
import { getImagePath } from "@/lib/utils";
import { ErrorToast, SuccessToast } from "@/components/atom/toast";

// Helper function to check if URL is a PDF
const isPdfUrl = (url: string) => {
  return url.toLowerCase().endsWith('.pdf') || 
    (url.includes('cloudinary.com') && url.includes('/raw/upload/'));
};

// Simple function to get file type icon or name
const getFileNameFromUrl = (url: string) => {
  if (!url) return '';
  try {
    // For PDF or raw uploads, extract the filename
    if (url.includes('/raw/upload/')) {
      const parts = url.split('/');
      return parts[parts.length - 1] || 'Document';
    }
    return url.split('/').pop() || 'Document';
  } catch (e) {
    console.error('Error getting filename:', e);
    return 'Document';
  }
};

// Helper function to convert PDF URL to preview URL
const getPdfPreviewUrl = (url: string) => {
  console.log('getPdfPreviewUrl called with:', url);
  // No transformation needed anymore - we'll handle PDFs differently
  return url;
};

// Helper function to get PDF thumbnail approaches
const getPdfThumbnailUrls = (url: string) => {
  console.log('Creating PDF thumbnail for:', url);
  if (!url || !url.includes('cloudinary.com')) return { directUrl: '', fetchUrl: '' };
  
  try {
    // For raw uploaded PDFs in Cloudinary
    if (url.includes('/raw/upload/')) {
      // Approach 1: Change resource type from raw to image and add PDF transformation
      const directUrl = url.replace('/raw/upload/', '/upload/w_300,h_400,c_fill,pg_1/');
      console.log('Direct transformed URL:', directUrl);
      
      // Approach 2: Use image/fetch to fetch the PDF and convert it
      const cloudName = url.split('/')[3];
      const fetchUrl = `https://res.cloudinary.com/${cloudName}/image/fetch/w_300,h_400,c_fill,pg_1/${encodeURIComponent(url)}`;
      console.log('Fetch transform URL:', fetchUrl);
      
      return { directUrl, fetchUrl };
    }
  } catch (error) {
    console.error('Error generating PDF thumbnail:', error);
  }
  return { directUrl: '', fetchUrl: '' };
};

const uploadToCloudinary = async (file: File, fieldType: string): Promise<string> => {
  console.log('uploadToCloudinary called with file:', file.name, 'type:', file.type, 'fieldType:', fieldType);
  const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${fieldType === 'raw' ? 'raw' : 'image'}/upload`;
  console.log('Uploading to Cloudinary URL:', url);
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "social");
  try {
    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });
    console.log('Cloudinary response status:', res.status);
    if (!res.ok) {
      console.error('Cloudinary upload failed with status:', res.status);
      throw new Error("Upload failed");
    }
    const data = await res.json();
    console.log('Cloudinary upload success, URL:', data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

const AttachmentForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: AttachmentSchema;
}) => {
  // Get form context separately
  const { formRef, setCurrentFormId } = useFormContext();

  const {
    setValue,
    handleSubmit,
    watch,
    formState: { errors }
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

  // For each field, keep a ref to its file input
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const onSubmitSuccess = () => {
    SuccessToast();
    router.push(getNextRoute(pathname));
  };

  const onSubmit = handleSubmit((data) => {
    // Save form data to localStorage for step navigation tracking
    localStorage.setItem('attachmentFormData', JSON.stringify(data));

    startTransition(() => {
      formAction(data);
    });
  }, (validationErrors) => {
    // Show toast for validation errors instead of inline errors
    if (validationErrors.image) {
      ErrorToast(validationErrors.image.message || "الصورة الشخصية مطلوبة");
    }
    return false;
  });

  useEffect(() => {
    setCurrentFormId('attachment');
  }, [setCurrentFormId]);

  useEffect(() => {
    if (state.success) {
      onSubmitSuccess();
    } else if (state.error) {
      ErrorToast("حدث خطأ ما!");
    }
  }, [state, onSubmitSuccess]);

  return (
    <form 
      ref={formRef} 
      onSubmit={onSubmit}
    >
      {/* <h1 className="text-xl font-semibold">
        {type === "create" ? "Upload Files" : "Update Files"}
      </h1> */}

      <div className="grid grid-cols-2 md:grid-cols-4 md:gap-6 gap-8">
        {ATTACHMENT_FIELDS.map(({ name, label, type: fieldType }, index) => {
          const isFirst = index === 0;
          return (
            <div
              key={name}
              onClick={() => fileInputRefs.current[name]?.click()}
              className={`relative flex items-center justify-center w-28 h-28 md:w-40 md:h-40 cursor-pointer overflow-hidden border border-neutral-500 hover:bg-neutral-100 ${isFirst ? 'rounded-full' : 'rounded-sm'}`}
              style={{ position: 'relative' }}
            >
              <input
                type="file"
                accept={fieldType === 'image' ? 'image/*' : fieldType === 'raw' ? '.pdf,.doc,.docx,.txt,.rtf' : '*'}
                style={{ display: 'none' }}
                ref={el => { fileInputRefs.current[name] = el; }}
                onClick={e => e.stopPropagation()}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const url = await uploadToCloudinary(file, fieldType);
                    setValue(name, url);
                  } catch (err) {
                    ErrorToast("فشل رفع الملف. حاول مرة أخرى.");
                    console.error('Cloudinary upload error:', err);
                  }
                }}
              />
              {formValues[name] ? (
                fieldType === 'image' ? (
                  <>
                    <Image
                      src={formValues[name] && formValues[name].startsWith('http') ? formValues[name] : getImagePath('/placeholder-profile.png')}
                      alt={label}
                      width={160}
                      height={160}
                      className={`absolute inset-0 w-full h-full object-cover ${isFirst ? 'rounded-full' : ''}`}
                      loading="lazy"
                      sizes="160px"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = getImagePath('/placeholder-profile.png');
                        console.error('Image failed to load:', formValues[name]);
                      }}
                    />
                    <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-xs text-center py-1">
                      صورة شخصية
                    </div>
                  </>
                ) : (
                  <>
                    {formValues[name] && formValues[name].includes('cloudinary.com') ? (
                      <div className="relative w-full h-full">
                        {(() => { console.log('Rendering file for URL:', formValues[name]); return null; })()}
                        {isPdfUrl(formValues[name] || '') ? (
                          // Custom PDF preview approach with iframe and scaling
                          <div className="relative w-full h-full overflow-hidden bg-white">
                            {/* Create negative margin and scale up to eliminate scrollbars and zoom in */}
                            <div 
                              className="absolute inset-[-25%] w-[150%] h-[150%]" 
                            >
                              <iframe
                                src={formValues[name] || ''}
                                width="100%"
                                height="100%"
                                className="w-full h-full pointer-events-none"
                                title="PDF Preview"
                                frameBorder="0"
                                scrolling="no"
                              />
                            </div>
                            <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-xs text-center py-1 z-10">
                              {label}
                            </div>
                          </div>
                        ) : (
                          // Normal image display
                          <Image
                            src={formValues[name] || ''}
                            alt={label}
                            width={160}
                            height={160}
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="lazy"
                            sizes="160px"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              console.error('Image failed to load:', formValues[name]);
                              
                              // Create a fallback UI for image errors
                              if (target.parentElement) {
                                target.style.display = 'none';
                                
                                // Create a div with error indicator
                                const errorIndicator = document.createElement('div');
                                errorIndicator.className = 'absolute inset-0 flex items-center justify-center bg-gray-100';
                                errorIndicator.innerHTML = `
                                  <div class="text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <p class="text-xs mt-1">Image Error</p>
                                  </div>
                                `;
                                target.parentElement.appendChild(errorIndicator);
                              }
                            }}
                          />
                        )}
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
          );
        })}
      </div>

      <button
        id="submit-attachment"
        type="submit"
        disabled={isPending}
        className="hidden w-full bg-neutral-900 text-white p-2 rounded-md hover:bg-neutral-800 disabled:bg-neutral-400"
      >
        {isPending ? "Saving..." : type === "create" ? "Upload" : "Update"}
      </button>
    </form>
  );
};

export default AttachmentForm; 