'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getTeamData, type TeamData } from './teamData';
import { completeOnboarding } from '@/app/onboarding/review/action';
import { LoadingState } from '@/components/onboarding/review';
import Image from 'next/image';
import { AnimatePresence, motion } from "framer-motion";

// Minimal data to use when no data is available
const DEFAULT_DATA: TeamData = {
  fullname: "New Registration",
  eligibility: [],
  user: {
    id: "",
    name: "",
    email: ""
  }
};

// Helper function to convert PDF URL to preview URL like in the attachment form
const getPdfPreviewUrl = (url: string) => {
  if (!url.includes('cloudinary.com')) return url;
  
  // Extract the base URL and file path
  const baseUrl = url.substring(0, url.indexOf('/upload/') + 8);
  const filePath = url.substring(url.indexOf('/upload/') + 8);
  
  // Generate preview URL with transformation
  return `${baseUrl}q_auto,f_jpg,pg_1/${filePath}`;
};

// Helper for outside click detection
const useOutsideClick = (ref: React.RefObject<HTMLDivElement | null>, callback: Function) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      callback(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]);
};

// Modal animation variants
const fadeInOut = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] } 
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1.0] }
  }
};

export default function ReviewPage() {
  const router = useRouter();
  const [teamData, setTeamData] = useState<TeamData>(DEFAULT_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [activeAttachment, setActiveAttachment] = useState<{
    label: string;
    url: string;
    type: 'image' | 'document';
  } | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const successDialogRef = useRef<HTMLDivElement>(null);

  useOutsideClick(modalRef, () => setActiveAttachment(null));
  useOutsideClick(successDialogRef, () => setShowSuccessDialog(false));

  useEffect(() => {
    const loadTeamData = async () => {
      try {
        setIsLoading(true);

        const result = await getTeamData();

        if (result?.error) {
          setError(result.error);
        }

        if (result?.data) {
          setTeamData(result.data);
        }
      } catch (err) {
        setError('Failed to load team data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadTeamData();
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveAttachment(null);
      }
    }

    if (activeAttachment) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeAttachment]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const result = await completeOnboarding();

      if (result.error) {
        setError(result.error);
        return;
      }
      
      setShowSuccessDialog(true);
      // Delay navigation to show the success message
      setTimeout(() => router.push('/'), 3000);
    } catch (err) {
      setError('Failed to complete onboarding. Please try again.');
      // Still navigate away after a brief delay
      setTimeout(() => router.push('/'), 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = () => {
    router.push('/onboarding');
  };

  const handleCloseAttachment = () => {
    setActiveAttachment(null);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="max-h-[90vh] overflow-auto p-0 w-full -mt-8">
      {error && (
        <div className="bg-red-50 p-2 mb-2">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <AnimatePresence>
        {activeAttachment && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeInOut}
            ref={modalRef}
            onClick={handleCloseAttachment}
          >
            <motion.div 
              layoutId={`card-${activeAttachment.label}`}
              className="relative w-auto h-auto overflow-hidden"
              style={{ transformOrigin: 'center' }}
              onClick={(e) => e.stopPropagation()}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <motion.div 
                layoutId={`image-${activeAttachment.label}`}
                className="relative w-[480px] h-[352px]"
                style={{ scale: 1.5 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {activeAttachment.type === 'image' || 
                 ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(activeAttachment.url.split('.').pop()?.toLowerCase() || '') ? (
                  <div className="w-full h-full relative">
                    <Image 
                      src={activeAttachment.url}
                      alt={activeAttachment.label}
                      fill
                      className="object-cover"
                      unoptimized={activeAttachment.url.includes('cloudinary.com')}
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  </div>
                ) : activeAttachment.url.split('.').pop()?.toLowerCase() === 'pdf' ? (
                  <div className="w-full h-full relative">
                    <Image 
                      src={getPdfPreviewUrl(activeAttachment.url)}
                      alt={activeAttachment.label}
                      fill
                      className="object-cover"
                      unoptimized
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  </div>
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  </div>
                )}
                
                <motion.div 
                  layoutId={`label-${activeAttachment.label}`}
                  className="absolute bottom-2 right-2 z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <span className="text-white text-sm font-medium drop-shadow-md">
                    {activeAttachment.label}
                  </span>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {showSuccessDialog && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeInOut}
          >
            <motion.div 
              className="bg-white rounded-lg p-6 max-w-md w-full"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              ref={successDialogRef}
            >
              <div className="flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-center mb-2">Request Submitted</h3>
              <p className="text-center text-gray-600">Your request is under process. We will notify you soon.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex flex-col md:flex-row gap-10">
        {/* Left column - smaller */}
        <div className="md:w-1/3 px-2 space-y-6">
          {/* Eligibility */}
          {teamData?.eligibility && teamData.eligibility.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Eligibility</h2>
              <hr className="mb-6 border-gray-200" />
              <div className="flex flex-wrap gap-2">
                {teamData.eligibility.map((item, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Contact Info with Icons */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Contact</h2>
            <hr className="mb-4 border-gray-200" />
            
            {teamData?.fullname && <p className="py-0.5 font-medium">{teamData.fullname}</p>}
            {teamData?.user?.email && <p className="py-0.5">{teamData.user.email}</p>}
            {teamData?.phone && <p className="py-0.5">{teamData.phone}</p>}
            
            <div className="flex gap-4 mt-2">
              {teamData?.whatsapp && (
                <a href={`https://wa.me/${teamData.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </a>
              )}
              {teamData?.twitter && (
                <a href={`https://twitter.com/${teamData.twitter}`} target="_blank" rel="noopener noreferrer" className="text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.016 10.016 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z" />
                  </svg>
                </a>
              )}
              {teamData?.facebook && (
                <a href={`https://facebook.com/${teamData.facebook}`} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              )}
              {teamData?.linkedin && (
                <a href={`https://linkedin.com/in/${teamData.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
        
        {/* Right column - larger */}
        <div className="md:w-2/3 px-2 space-y-3">
          <div>
            <h2 className="text-xl font-semibold mb-2">Attachments</h2>
            <hr className="mb-6 border-gray-200" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Profile Image as first item */}
              {(teamData?.image || teamData?.src || teamData?.user?.image) && (
                <ExpandableFilePreview 
                  label="Profile Picture" 
                  url={(teamData?.image || teamData?.src || teamData?.user?.image || '/placeholder-profile.png')} 
                  type="image"
                  onExpand={setActiveAttachment}
                  isActive={activeAttachment?.label === "Profile Picture"}
                />
              )}
              {teamData?.resume && teamData.resume.trim() !== '' && (
                <ExpandableFilePreview 
                  label="Resume" 
                  url={teamData.resume} 
                  type={teamData.resume.endsWith('.pdf') ? 'document' : 'image'}
                  onExpand={setActiveAttachment}
                  isActive={activeAttachment?.label === "Resume"}
                />
              )}
              {teamData?.iqama && teamData.iqama.trim() !== '' && (
                <ExpandableFilePreview 
                  label="Iqama" 
                  url={teamData.iqama} 
                  type="image"
                  onExpand={setActiveAttachment}
                  isActive={activeAttachment?.label === "Iqama"}
                />
              )}
              {teamData?.passport && teamData.passport.trim() !== '' && (
                <ExpandableFilePreview 
                  label="Passport" 
                  url={teamData.passport} 
                  type="image"
                  onExpand={setActiveAttachment}
                  isActive={activeAttachment?.label === "Passport"}
                />
              )}
              {teamData?.drivingLicense && teamData.drivingLicense.trim() !== '' && (
                <ExpandableFilePreview 
                  label="License" 
                  url={teamData.drivingLicense} 
                  type="image"
                  onExpand={setActiveAttachment}
                  isActive={activeAttachment?.label === "License"}
                />
              )}
              {teamData?.sce && teamData.sce.trim() !== '' && (
                <ExpandableFilePreview 
                  label="SCE" 
                  url={teamData.sce} 
                  type="image"
                  onExpand={setActiveAttachment}
                  isActive={activeAttachment?.label === "SCE"}
                />
              )}
            </div>
          </div>
          
          <div className="absolute bottom-6 right-20 flex gap-4">
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-5 py-1.5 bg-blue-600 text-white text-base font-medium rounded-full hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
            
            <button 
              onClick={handleEdit}
              className="px-5 py-1.5 bg-gray-200 text-gray-800 text-base font-medium rounded-full hover:bg-gray-300 transition-colors"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Expandable file preview component
function ExpandableFilePreview({ 
  label, 
  url, 
  type,
  onExpand,
  isActive
}: { 
  label: string;
  url: string;
  type: 'image' | 'document';
  onExpand: (details: { label: string; url: string; type: 'image' | 'document' }) => void;
  isActive: boolean;
}) {
  const [imageError, setImageError] = useState(false);
  
  const fileExtension = url.split('.').pop()?.toLowerCase() || '';
  const isImage = type === 'image' || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension);
  const isPdf = fileExtension === 'pdf';

  const handleClick = () => {
    onExpand({ label, url, type });
  };

  return (
    <motion.div 
      layoutId={isActive ? `card-${label}` : undefined}
      className="bg-gray-50 cursor-pointer overflow-hidden shadow-md" 
      onClick={handleClick}
      transition={{ type: "spring", stiffness: 350, damping: 30 }}
    >
      <div className="relative h-32 flex flex-col">
        <motion.div 
          layoutId={isActive ? `image-${label}` : undefined}
          className="relative h-full w-full"
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        >
          {isImage ? (
            <div className="relative h-full w-full">
              {!imageError ? (
                <Image 
                  src={url || '/placeholder-profile.png'} 
                  alt={label}
                  fill
                  className="object-cover"
                  unoptimized={url.includes('cloudinary.com')}
                  onError={() => setImageError(true)}
                />
              ) : (
                <img 
                  src="/placeholder-profile.png" 
                  alt={label}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            </div>
          ) : isPdf ? (
            <div className="relative h-full w-full">
              <Image 
                src={getPdfPreviewUrl(url)}
                alt={label}
                fill
                className="object-cover"
                unoptimized
                onError={() => setImageError(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            </div>
          )}
          <motion.div 
            layoutId={isActive ? `label-${label}` : undefined}
            className="absolute bottom-2 right-2 z-10"
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          >
            <span className="text-white text-sm font-medium drop-shadow-md">
              {label}
            </span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
} 