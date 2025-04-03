'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchUserForReview, completeOnboarding, type UserReviewData } from '../../../components/onboarding/review/action';
import { 
  LoadingState, 
  ErrorState, 
  SuccessDialog,
  ReviewContainer
} from '@/components/onboarding/review';

export default function ReviewPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserReviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        const result = await fetchUserForReview();

        if (result.error) {
          setError(result.error);
        } else if (result.data) {
          setUserData(result.data);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        setError("حدث خطأ أثناء تحميل البيانات");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await completeOnboarding();

      if (result.success) {
        setShowDialog(true);
      } else {
        setError(result.error || "حدث خطأ أثناء إكمال عملية التسجيل");
      }
    } catch (error) {
      console.error("Error completing onboarding:", error);
      setError("حدث خطأ أثناء إكمال عملية التسجيل");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    router.push('/');
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <>
      <ReviewContainer 
        userData={userData}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit}
      />
      
      <SuccessDialog 
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        onClose={handleCloseDialog}
      />
    </>
  );
} 