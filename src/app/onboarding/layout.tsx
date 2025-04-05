'use client';
import PageHeading from '@/components/onboarding/page-heading';
import StepNavigation from '@/components/onboarding/step-nav';
import ButtonNavigation from '@/components/onboarding/button-nav';
import { FormProvider } from '@/components/onboarding/form-context';
import { Toaster } from 'sonner';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isReviewPage = pathname === '/onboarding/review';
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup event listener
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
    <FormProvider>
      <div className={`${isReviewPage ? "py-0 px-2 md:px-14 min-h-screen " : "px-0 md:px-20 py-8 h-screen overflow-hidden"} flex flex-col`}>
        <Toaster 
          position={isMobile ? "top-center" : "bottom-right"}
          toastOptions={{
            style: {
              maxWidth: isMobile ? '96%' : '270px',
              minWidth: isMobile ? '100px' : '200px',
              padding: '16px',
              fontSize: '13px'
            },
            duration: 3000,
            className: isMobile ? 'w-full' : ''
          }}
        />
        {/* {!isReviewPage && (
          <div className="flex-none mt-4 md:mt-0">
            <PageHeading
              title="حبابك عشرة"
              description="سيكون لنا متسع من الموت للنوم"
            />
          </div>
        )} */}

        <div className={`${isReviewPage ? "flex-grow" : "flex-1"} flex flex-col items-center justify-center`}>
          <div className={`w-full flex flex-col items-center justify-center ${isReviewPage ? "" : "max-h-full overflow-auto"}`}>
            {children}
          </div>
        </div>
        
        {!isReviewPage && (
          <div className="flex-none w-full mt-auto flex flex-col gap-6 items-center justify-center">
            <StepNavigation />
            <ButtonNavigation />
          </div>
        )}
      </div>
    </FormProvider>
  );
}
