export interface FormErrors {
  [key: string]: string | undefined;
}

export const onboardingRoutes = {
  
  ATTACHMENT: "/onboarding/attachment",
  CONTACT: "/onboarding/contact",
  ELIGIBILITY: "/onboarding/eligibility",
  REVIEW: "/onboarding/review"
} as const;

export enum editRoutes {
  TERMS = '/x/profile/edit/terms',
  ATTACHMENT = '/x/profile/edit/attachment',
  CONTACT = '/x/profile/edit/contact',
  BASIC_INFO = '/x/profile/edit/basic-info',
  ADDRESS = '/x/profile/edit/address',
  EDUCATION = '/x/profile/edit/education',
}
