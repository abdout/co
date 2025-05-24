'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import path from 'path';
import { useEffect, useState } from 'react';
import { useFormContext } from './form-context';
// import BackButton from './back-button';  // Import the BackButton component

// Define the icons for each step
const StepIcons = {
  attachment: (className: string) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={className}>
      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M6 15V9a6 6 0 1 1 12 0v8a4 4 0 1 1-8 0V9a2 2 0 1 1 4 0v8" strokeWidth="1"/>
    </svg>
  ),
  contact: (className: string) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256" className={className}>
      <g fill="currentColor" stroke="none">
        <path d="M128 206a10 10 0 1 0-10-10a10 10 0 0 0 10 10zm100.27-117.95a170 170 0 0 0-200.54 0a6 6 0 0 0 7.08 9.7a158 158 0 0 1 186.38 0a6 6 0 0 0 7.08-9.7zm-30.03 37.83a122 122 0 0 0-140.48 0a6 6 0 1 0 7 9.76a110 110 0 0 1 126.48 0a6 6 0 0 0 7-9.76zm-30.1 37.85a74 74 0 0 0-80.28 0a6 6 0 1 0 6.9 9.78a62 62 0 0 1 66.48 0a6 6 0 0 0 8.28-1.78a6 6 0 0 0-1.38-8z"/>
      </g>
    </svg>
  ),
  information: (className: string) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={className}>
      <g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1">
        <circle cx="12" cy="12" r="9" strokeLinecap="round"/>
        <path strokeWidth="1.5" d="M12 8h.01v.01H12z"/>
        <path strokeLinecap="round" d="M12 12v4"/>
      </g>
    </svg>
  ),
  education: (className: string) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={className}>
      <path fill="currentColor" fillRule="evenodd" d="M11.3 2.05a4.6 4.6 0 0 1 1.38 0c.515.08 1.01.279 1.84.612l7.19 2.9c.554.224 1 .404 1.33.57c.317.162.634.363.797.68c.111.215.166.45.166.685v8a.5.5 0 0 1-1 0v-6.62c-.324.162-.759.337-1.29.552l-.708.285v5.78c0 1.92-1.24 3.3-2.92 4.18s-3.9 1.32-6.08 1.32s-4.39-.437-6.07-1.32c-1.69-.88-2.93-2.27-2.93-4.18v-5.78l-.709-.286c-.554-.224-1-.404-1.33-.571c-.317-.161-.633-.362-.797-.68a1.5 1.5 0 0 1 0-1.37c.163-.316.48-.517.797-.678c.328-.167.775-.348 1.33-.571l7.18-2.9c.827-.334 1.32-.533 1.84-.613zm1.22.987a3.5 3.5 0 0 0-1.07 0c-.387.06-.768.21-1.68.577l-7.1 2.86c-.583.235-.988.4-1.27.544c-.3.153-.355.233-.362.246a.5.5 0 0 0 0 .457c.007.013.062.094.362.246c.284.145.689.31 1.27.544l7.1 2.86c.907.366 1.29.517 1.68.577a3.5 3.5 0 0 0 1.07 0c.387-.06.768-.21 1.68-.576l7.1-2.86c.583-.235.989-.4 1.27-.544c.3-.153.355-.233.362-.246a.5.5 0 0 0 0-.457c-.007-.013-.062-.093-.362-.246c-.284-.145-.69-.309-1.27-.544l-7.1-2.86c-.907-.366-1.29-.516-1.68-.576zm1.99 9.29l5.48-2.21v5.38c0 1.41-.888 2.52-2.39 3.3c-1.5.784-3.54 1.2-5.61 1.2s-4.11-.419-5.61-1.2c-1.5-.782-2.39-1.89-2.39-3.3v-5.37l5.47 2.21c.827.334 1.32.533 1.84.613c.456.07.921.07 1.38 0c.515-.08 1.01-.279 1.84-.612z" clipRule="evenodd"/>
    </svg>
  ),
  activity: (className: string) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512" className={className}>
      <path fill="currentColor" d="M255 471L91.7 387V41h328.6v346zm-147.3-93.74L255 453l149.3-75.76V57H107.7zm146.43-65.76l98.27-49.89v-49.9l-98.14 49.82l-94.66-48.69v50zm.13 32.66l-94.66-48.69v50l94.54 48.62l98.27-49.89v-49.9z"/>
    </svg>
  ),
  contribute: (className: string) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"><path d="M6 9a3 3 0 1 0 0-6a3 3 0 0 0 0 6m12 12a3 3 0 1 0 0-6a3 3 0 0 0 0 6M6 9v12m12-6V7.5a2 2 0 0 0-2-2h-2.5"/><path d="M14.5 8L12 5.5L14.5 3"/></g></svg>
  ),
};

const steps = [
  // { title: 'الاحكام', route: 'terms', link: '/onboarding/terms' },
  { title: 'المرفقات', route: 'attachment', link: '/dashboard/profile/edit/attachment', icon: 'attachment' },
  { title: 'الاتصال', route: 'contact', link: '/dashboard/profile/edit/contact', icon: 'contact' },
  { title: 'المعلومات', route: 'information', link: '/dashboard/profile/edit/information', icon: 'information' },
  { title: 'الدراسة', route: 'education', link: '/dashboard/profile/edit/education', icon: 'education' },
  { title: 'المساهمة', route: 'contribute', link: '/dashboard/profile/edit/contribute', icon: 'contribute' },
  { title: 'النشاط', route: 'activity', link: '/dashboard/profile/edit/activity', icon: 'activity' },
];

// Map localStorage keys to form routes
const FORM_STORAGE_KEYS = {
  attachment: 'attachmentFormData',
  contact: 'contactFormData',
  information: 'informationFormData',
  education: 'educationFormData',
  contribute: 'contributeFormData',
  activity: 'activityFormData',
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
    information: 'empty',
    education: 'empty',
    activity: 'empty',
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

    // Check information form - green if name and location are filled
    try {
      const infoData = localStorage.getItem(FORM_STORAGE_KEYS.information);
      if (infoData) {
        const parsedData = JSON.parse(infoData);
        const hasName = parsedData.fullname !== undefined && parsedData.fullname !== '';
        const hasLocation = 
          (parsedData.currentCountry !== undefined && parsedData.currentCountry !== '') ||
          (parsedData.currentState !== undefined && parsedData.currentState !== '') ||
          (parsedData.currentLocality !== undefined && parsedData.currentLocality !== '');
        
        setFormStatus(prev => ({
          ...prev,
          information: (hasName && hasLocation) ? 'complete' : (hasName || hasLocation) ? 'partial' : 'empty'
        }));
      }
    } catch (e) {
      console.error('Error parsing information data:', e);
    }

    // Check education form - green if any education level is filled
    try {
      const educationData = localStorage.getItem(FORM_STORAGE_KEYS.education);
      if (educationData) {
        const parsedData = JSON.parse(educationData);
        const hasEducation = parsedData.educationLevel !== undefined && parsedData.educationLevel !== '';
        
        setFormStatus(prev => ({
          ...prev,
          education: hasEducation ? 'complete' : 'partial'
        }));
      }
    } catch (e) {
      console.error('Error parsing education data:', e);
    }

    // Check contribute form - green if at least 1 field is filled
    try {
      const contributeData = localStorage.getItem(FORM_STORAGE_KEYS.contribute);
      if (contributeData) {
        const parsedData = JSON.parse(contributeData);
        const fieldsWithValue = Object.entries(parsedData)
          .filter(([key, value]) => key !== 'id' && value && value !== '')
          .length;
        setFormStatus(prev => ({
          ...prev,
          contribute: fieldsWithValue > 0 ? 'complete' : 'partial'
        }));
      }
    } catch (e) {
      console.error('Error parsing contribute data:', e);
    }

    // Check activity form - green if at least one skill is filled
    try {
      const activityData = localStorage.getItem(FORM_STORAGE_KEYS.activity);
      if (activityData) {
        const parsedData = JSON.parse(activityData);
        const hasSkill = Array.isArray(parsedData.skills) && parsedData.skills.length > 0;
        
        setFormStatus(prev => ({
          ...prev,
          activity: hasSkill ? 'complete' : 'partial'
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
              (currentPath === 'information' && step.route === 'information') ||
              (currentPath === 'activity' && step.route === 'activity');
            
            const isVisited = visitedSteps[step.route] || 
              (visitedSteps['information'] && currentPath === 'information') ||
              (visitedSteps['activity'] && currentPath === 'activity');
            
            const formState = formStatus[step.route];
            
            // Simplified color logic - only muted-foreground and primary
            const iconColorClass = isActive ? 'text-primary' : 'text-muted-foreground';

            // Get the appropriate icon component for this step
            const IconComponent = StepIcons[step.icon as keyof typeof StepIcons];

            return (
              <Link
                href={step.link}
                key={step.link}
                className={clsx(
                  "group z-20 flex items-center gap-2 p-1 rounded-md",
                  // "transition-all duration-200 focus:outline-none",
                  "hover:text-primary focus:text-primary", 
            
                )}
                prefetch={true}
              >
                <div className={clsx(
                  'flex items-center justify-center transition-colors duration-200',
                  iconColorClass,
                  isActive ? '' : '',
                  'group-hover:text-primary group-focus:text-primary',
                  'transition-all duration-200'
                )}>
                  {IconComponent(clsx('w-6 h-6', 
                    isActive && 'drop-shadow-md'))}
                </div>
              </Link>
            );
          })}
          {/* <div className="absolute top-3 flex h-1 w-full border-b border-dashed " /> */}
        </div>
      </div>
    </div>
  );
}