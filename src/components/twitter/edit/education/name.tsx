import { Input } from "@/components/ui/input";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { InformationSchema } from "./validation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { FocusContainer } from "@/components/twitter/edit/focus-container";

interface NameProps {
  register: UseFormRegister<InformationSchema>;
  errors: FieldErrors<InformationSchema>;
}

const Name = ({ register, errors }: NameProps) => {
  // Add ref for scrolling to the name section
  const nameRef = useRef<HTMLDivElement>(null);

  // Watch for validation errors
  useEffect(() => {
    if (errors.fullname) {
      // Show error in toast
      toast.error(errors.fullname.message?.toString() || "يرجى إدخال الاسم الكامل", {
        style: {
          background: 'rgb(239 68 68)',
          color: 'white',
          border: 'none',
          textAlign: 'right',
          direction: 'rtl'
        }
      });
      
      // Scroll to name section
      if (nameRef.current) {
        nameRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  }, [errors.fullname]);

  return (
    <FocusContainer
      shrunkWidth="55%" 
      expandedWidth="45%"
    >
      {({ getClassName, handleFocus, handleBlur }) => (
        <>
          <div 
            className={getClassName('fullname', 'mb-6 md:mb-0')} 
            ref={nameRef}
            data-name-field="true"
          >
            <label htmlFor="fullname" className="block mb-2 text-sm font-medium">
              الاسم الكامل
            </label>
            <Input
              id="fullname"
              placeholder="الاسم الكامل"
              dir="rtl"
              className="text-right"
              {...register('fullname')}
              onFocus={handleFocus('fullname')}
              onBlur={handleBlur}
              data-name-field="true"
            />
            {/* Removed inline error display */}
          </div>
          <div 
            className={getClassName('name')}
            data-name-field="true"
          >
            <label htmlFor="name" className="block mb-2 text-sm font-medium">
              اسم المستخدم
            </label>
            <Input
              id="name"
              placeholder="اسم المستخدم"
              dir="rtl"
              className="text-right"
              {...register('name')}
              onFocus={handleFocus('name')}
              onBlur={handleBlur}
              data-name-field="true"
            />
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name.message}</span>
            )}
          </div>
        </>
      )}
    </FocusContainer>
  );
};

export default Name; 