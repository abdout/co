import { Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ReviewDialogProps } from './type';
import { useEffect, useState } from 'react';

export function LoadingState() {
  return (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
    </div>
  );
}

type ErrorStateProps = {
  error: string;
};

export function ErrorState({ error }: ErrorStateProps) {
  const router = useRouter();
  
  return (
    <div className="w-full max-w-4xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-8">حدث خطأ</h1>
      <p className="text-red-500 mb-4">{error}</p>
      <Button onClick={() => router.push('/onboarding')}>
        العودة إلى التسجيل
      </Button>
    </div>
  );
}

export function SuccessDialog({ showDialog, setShowDialog, onClose }: ReviewDialogProps) {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    if (showDialog) {
      // Start animation once dialog is shown
      setTimeout(() => {
        setAnimate(true);
      }, 100);
      
      // Automatically navigate after 3 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      setAnimate(false);
    }
  }, [showDialog, onClose]);
  
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:max-w-md h-60">
        <div className="flex flex-col items-center justify-center">
          <div className={`relative mb-4 flex items-center justify-center transition-all duration-500 ease-in-out ${animate ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
            {/* Pulsing effect */}
            <div className={`absolute h-16 w-16 rounded-full bg-green-500 opacity-20`}></div>
            
            {/* Green circle background with check inside */}
            <div className="relative h-16 w-16 rounded-full bg-green-500 flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="white" 
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <DialogHeader className={`transition-all duration-500 delay-300 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <DialogTitle className="font-heading text-center text-2xl"></DialogTitle>
            <DialogDescription className="text-center text-xl pt-4">
            <strong>شكرا على اتمام الطلب</strong> <br /> 
            سيتم مراجعة طلبك خلال 7 أيام
            </DialogDescription>
          </DialogHeader>
          
          
        </div>
      </DialogContent>
    </Dialog>
  );
} 