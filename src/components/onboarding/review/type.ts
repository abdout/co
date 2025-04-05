// Types for review components
import { TeamReviewData } from '@/app/onboarding/review/action';

export type ReviewCardProps = {
  teamData: TeamReviewData | null;
};

export interface ReviewContainerProps {
  teamData: TeamReviewData | null;
  isSubmitting: boolean;
  handleSubmit: () => Promise<void>;
}

export type ReviewDialogProps = {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  onClose: () => void;
};

export type UserReviewData = {
  // Contact Information
  fullname?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;

  // Eligibility Information
  nationalityId?: string;
  maritalStatus?: string;
  gender?: string;
  religion?: string;
  birthDate?: Date;
  birthCountry?: string;
  birthState?: string;
  birthLocality?: string;

  // Attachment Information
  image?: string;
  cv?: string;
  portfolio?: string;
  additionalFile?: string;

  // System fields
  id?: string;
  role?: string;
  onboardingStatus?: string;
  onboardingStep?: number;
  createdAt?: Date;
  updatedAt?: Date;
}; 