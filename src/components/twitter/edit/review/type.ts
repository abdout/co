// Types for review components
import { UserReviewData } from '@/components/onboarding/review/action';

export type ReviewCardProps = {
  userData: UserReviewData | null;
};

export type ReviewContainerProps = {
  userData: UserReviewData | null;
  isSubmitting: boolean;
  handleSubmit: () => Promise<void>;
};

export type ReviewDialogProps = {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  onClose: () => void;
}; 