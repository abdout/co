import { editRoutes } from '@/components/onboarding/type';
import { redirect } from 'next/navigation';
// import React from 'react';

export default function EditPage() {
  redirect(editRoutes.ATTACHMENT);
}
