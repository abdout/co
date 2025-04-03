import { onboardingRoutes } from '@/components/onboarding/type';
import { redirect } from 'next/navigation';
// import React from 'react';

export default function AddPage() {
  redirect(onboardingRoutes.ATTACHMENT);
}
