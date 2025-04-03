'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import path from 'path';
import { useEffect, useState } from 'react';
import { useFormContext } from './form-context';
// import BackButton from './back-button';  // Import the BackButton component

const steps = [
  // { title: 'الاحكام', route: 'terms', link: '/onboarding/terms' },
  { title: 'Attachments', route: 'attachment', link: '/onboarding/attachment' },
  { title: 'Contact', route: 'contact', link: '/onboarding/contact' },
  { title: 'Activities', route: 'activity', link: '/onboarding/activity' },
];

// Map localStorage keys to form routes
const FORM_STORAGE_KEYS = {
  attachment: 'attachmentFormData',
  contact: 'contactFormData',
  'basic-info': 'informationFormData',
  address: 'activityFormData',
};

export default function StepNavigation() {
  const pathname = usePathname();
  const currentPath = path.basename(pathname);
  const { currentFormId } = useFormContext();

  // Track visited steps
  const [visitedSteps, setVisitedSteps] = useState<{ [key: string]: boolean }>({});
  // Track form completion status
  const [formStatus, setFormStatus] = useState<{ [key: string]: 'empty' | 'partial' | 'complete' }>({
    attachment: 'empty',
    contact: 'empty',
    'basic-info': 'empty',
    address: 'empty',
  });

  // Function to check form completion status
  const checkFormStatus = () => {
    console.log("Checking form status...");
    
    // Check attachment form
    try {
      const attachmentData = localStorage.getItem(FORM_STORAGE_KEYS.attachment);
      if (attachmentData) {
        const parsedData = JSON.parse(attachmentData);
        const fieldsWithValue = Object.entries(parsedData)
          .filter(([key, value]) => key !== 'id' && value && value !== '')
          .length;
        
        setFormStatus(prev => ({
          ...prev,
          attachment: fieldsWithValue > 0 ? 'complete' : 'partial'
        }));
      }
    } catch (e) {
      console.error('Error parsing attachment data:', e);
    }

    // Check contact form - green if at least 2 fields are filled
    try {
      const contactData = localStorage.getItem(FORM_STORAGE_KEYS.contact);
      if (contactData) {
        const parsedData = JSON.parse(contactData);
        const fieldsWithValue = Object.entries(parsedData)
          .filter(([key, value]) => key !== 'id' && value && value !== '')
          .length;
        
        setFormStatus(prev => ({
          ...prev,
          contact: fieldsWithValue >= 2 ? 'complete' : fieldsWithValue > 0 ? 'partial' : 'empty'
        }));
      }
    } catch (e) {
      console.error('Error parsing contact data:', e);
    }

    // Check information form - green if any degree is filled
    try {
      const infoData = localStorage.getItem(FORM_STORAGE_KEYS['basic-info']);
      if (infoData) {
        const parsedData = JSON.parse(infoData);
        const hasDegree = parsedData.degreeLevel !== undefined && parsedData.degreeLevel !== '';
        
        setFormStatus(prev => ({
          ...prev,
          'basic-info': hasDegree ? 'complete' : 'partial'
        }));
      }
    } catch (e) {
      console.error('Error parsing information data:', e);
    }

    // Check activity form - green if at least one skill is filled
    try {
      const activityData = localStorage.getItem(FORM_STORAGE_KEYS.address);
      if (activityData) {
        const parsedData = JSON.parse(activityData);
        const hasSkill = Array.isArray(parsedData.skills) && parsedData.skills.length > 0;
        
        setFormStatus(prev => ({
          ...prev,
          address: hasSkill ? 'complete' : 'partial'
        }));
      }
    } catch (e) {
      console.error('Error parsing activity data:', e);
    }
  };

  // Check form status initially and whenever localStorage changes
  useEffect(() => {
    // Initial check
    checkFormStatus();
    
    // Create a storage event listener
    const handleStorageChange = (e: StorageEvent) => {
      // Only check if the change is to one of our form data keys
      const isFormDataKey = Object.values(FORM_STORAGE_KEYS).includes(e.key || '');
      if (isFormDataKey) {
        checkFormStatus();
      }
    };
    
    // Listen for changes to localStorage from other tabs/windows
    window.addEventListener('storage', handleStorageChange);
    
    // We also need to periodically check for changes that happen in the same tab
    // since those don't trigger the storage event
    const interval = setInterval(checkFormStatus, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Update visited steps when path changes
  useEffect(() => {
    // Map the current path to a route key
    let routeKey = currentPath;
    if (currentPath === 'information') routeKey = 'information';
    if (currentPath === 'activity') routeKey = 'activity';
    
    // Mark the current step as visited
    setVisitedSteps(prev => ({
      ...prev,
      [routeKey]: true
    }));
    
    // Re-check form status when path changes
    checkFormStatus();
  }, [currentPath]);

  // Update form status when the form changes (via currentFormId)
  useEffect(() => {
    checkFormStatus();
  }, [currentFormId]);

  return (
    <div className='flex flex-col'>
      {/* <BackButton currentStep={currentStep} /> */}
      <div className=" ">
        <div className="relative flex flex-row justify-between  gap-2 lg:gap-3">
          {steps.map((step) => {
            const isActive = currentPath === step.route || 
              (currentPath === 'information' && step.route === 'basic-info') ||
              (currentPath === 'activity' && step.route === 'address');
            
            const isVisited = visitedSteps[step.route] || 
              (visitedSteps['basic-info'] && currentPath === 'information') ||
              (visitedSteps['address'] && currentPath === 'activity');
            
            const formState = formStatus[step.route];
            
            // Determine dot color based on status
            let dotColor = 'bg-neutral-200'; // Default unvisited
            
            if (isActive) {
              dotColor = 'bg-yellow-400 text-black border border-black'; // Current step - yellow
            } else if (isVisited || formState !== 'empty') {
              if (formState === 'complete') {
                dotColor = 'bg-green-500 text-white border-none'; // Complete - green
              } else if (formState === 'partial') {
                dotColor = 'bg-orange-400 text-white border-none'; // Partial - orange
              }
            }

            return (
              <Link
                href={step.link}
                key={step.link}
                className="group z-20 flex items-center gap-2"
                prefetch={true}
              >
                <span
                  className={clsx(
                    'flex h-4 w-4 items-center justify-center rounded-full text-sm transition-colors duration-200 lg:h-[18px] lg:w-[18px]',
                    dotColor
                  )}
                >
                  {/* {i + 1} */}
                </span>
                {/* <span
                  className={clsx(
                    'hidden transition-colors duration-200 reveal lg:block',
                    {
                      'font-light': !isActive,
                      'font-medium': isActive,
                    }
                  )}
                >
                  {step.title}
                </span> */}
              </Link>
            );
          })}
          {/* <div className="absolute top-3 flex h-1 w-full border-b border-dashed " /> */}
        </div>
      </div>
    </div>
  );
}