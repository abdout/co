'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

const steps = [
  { title: 'الاحكام', route: 'terms', link: '/onboarding/terms' },
  { title: 'المرفقات', route: 'attachment', link: '/onboarding/attachment' },
  { title: 'الاتصال', route: 'contact', link: '/onboarding/contact' },
  { title: 'المعلومات', route: 'basic-info', link: '/onboarding/basic-info' },
  { title: 'العنوان', route: 'address', link: '/onboarding/address' },
];

interface BackButtonProps {
  currentStep: number;
}

export default function BackButton({ currentStep }: BackButtonProps) {
  return (
    <Link
      href={steps[currentStep - 1]?.link || steps[0].link}
      className={cn(
        buttonVariants({ variant: "ghost", size: "sm" }),
        "mb-2 flex gap-2 disabled:text-white/50 lg:mb-4 lg:gap-3 w-20"
      )}
    >
      السابق
    </Link>
  );
}