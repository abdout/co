export interface FormErrors {
  [key: string]: string | undefined;
}

export const onboardingRoutes = {
  TERMS: "/onboarding/terms",
  ATTACHMENT: "/onboarding/attachment",
  CONTACT: "/onboarding/contact",
  INFORMATION: "/onboarding/information",
  EDUCATION: "/onboarding/education",
  ACTIVITY: "/onboarding/activity",
  REVIEW: "/onboarding/review"
} as const;

export const editRoutes = {
  ATTACHMENT: '/dashboard/profile/edit/attachment',
  CONTACT: '/dashboard/profile/edit/contact',
  INFORMATION: '/dashboard/profile/edit/information',
  EDUCATION: '/dashboard/profile/edit/education',
  ACTIVITY: '/dashboard/profile/edit/activity'
} as const;
