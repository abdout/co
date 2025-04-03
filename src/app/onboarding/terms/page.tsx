'use client';
import { Checkbox } from '@/components/ui/checkbox'
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { toast } from 'sonner';

const TermsPage = () => {
    const [accepted, setAccepted] = useState(false);
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);

    const handleCheckboxChange = (checked: boolean) => {
        setAccepted(checked);
        if (checked) {
            toast.success("تم قبول الشروط");
            router.push('/onboarding/attachment');
        }
    };

    // Export the form submission handler for the navigation system
    useEffect(() => {
        // Define a type for the window with our custom property
        interface CustomWindow extends Window {
            submitTermsForm?: () => void;
        }
        
        // Assign the function to the window object
        (window as CustomWindow).submitTermsForm = () => {
            if (!accepted) {
                toast.error("يجب قبول الشروط للمتابعة", {
                    style: {
                        background: 'rgb(239 68 68)',
                        color: 'white',
                        border: 'none'
                    }
                });
                return false;
            }
            return true;
        };
        
        // Cleanup function
        return () => {
            delete (window as CustomWindow).submitTermsForm;
        };
    }, [accepted]);

    return (
        <form ref={formRef} className='w-[74%] md:w-[50%] overflow-hidden flex flex-col items-center justify-center'>
            <p className='text-center justify-center'>
                لا تستثني الحركة احداَ من عامة السودانين الصالحين في ان تتقدم لهم بدعوتها، وهي كذلك تحرص على أن ينتمي لقياداتها وصفها من عرف عنه نظافة اليد، وصالح المسعى، ومن يتقي معوج المسلك وفاسد العمل.
            </p>
            <div className="flex items-center gap-2 pt-8">
                <Checkbox
                    id="terms"
                    checked={accepted}
                    onCheckedChange={handleCheckboxChange}
                />
                <label
                    htmlFor="terms"
                    className="text-[13px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    اقرأ <Link href="#" className='text-blue-600'>الارشادات</Link> و <Link href="#" className='text-blue-600'>الاوراق</Link> <span className='hidden md:inline'> قبل البدء</span> 
                </label>
            </div>
            <button id="submit-terms" type="submit" className="hidden" />
        </form>
    )
}

export default TermsPage;