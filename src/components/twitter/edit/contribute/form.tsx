"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contributeSchema, type ContributeSchema } from "./validation";
import { createContribute, updateContribute } from "./action";
import { useFormContext } from '@/components/twitter/edit/form-context';
import { useState, useTransition, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getNextRoute } from '../utils';
import { SuccessToast, ErrorToast } from '@/components/atom/toast';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface FormProps {
  type: "create" | "update";
  data?: ContributeSchema;
}

export default function Form({ type, data }: FormProps) {
  const { formRef, setCurrentFormId } = useFormContext();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const [actionState, setActionState] = useState({ success: false, error: false });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ContributeSchema>({
    resolver: zodResolver(contributeSchema),
    defaultValues: data || {
      contribute: ''
    }
  });

  const onSubmit = handleSubmit((formData) => {
    // Save to localStorage for step navigation tracking
    localStorage.setItem('contributeFormData', JSON.stringify(formData));

    startTransition(async () => {
      try {
        const result = await (type === "create" ? createContribute(formData) : updateContribute(formData));
        if (result.success) {
          setActionState({ success: true, error: false });
        } else {
          setActionState({ success: false, error: true });
        }
      } catch (error) {
        console.error("Error saving contribute data:", error);
        setActionState({ success: false, error: true });
      }
    });
  });

  useEffect(() => {
    setCurrentFormId('contribute');
  }, [setCurrentFormId]);

  useEffect(() => {
    if (actionState.success) {
      // Show success toast
      SuccessToast();
      
      // Navigate to next route with slight delay
      setTimeout(() => {
        router.push(getNextRoute(pathname));
      }, 300);
    } else if (actionState.error) {
      ErrorToast("فشل حفظ البيانات");
    }
  }, [actionState, router, pathname]);

  return (
    <form ref={formRef} onSubmit={onSubmit} className="w-full h-fullflex flex-col p-2" dir="rtl">
      {data?.id && (
        <input type="hidden" {...register('id')} defaultValue={data.id} />
      )}
      
      <Card>
        <CardContent className="pt-6">
          <Label className="flex items-center gap-2 py-2">
            الدعوة
          </Label>
          <Textarea
            id="contribute"
            {...register("contribute")}
            placeholder="دعوتك شنو؟ عايز تطوع في شنو؟"
            className="w-full h-28 border rounded-md"
            dir="rtl"
          />
          {errors.contribute && (
            <p className="text-red-500 text-sm mt-1">{errors.contribute.message}</p>
          )}
        </CardContent>
      </Card>
      
      <button id="submit-contribute" type="submit" className="hidden">
        {type === "update" ? "تحديث" : "حفظ"}
      </button>
    </form>
  );
} 