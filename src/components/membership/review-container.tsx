'use client';

import { PersonalInfoCard } from '@/components/onboarding/review/information';
import { EducationCard } from '@/components/onboarding/review/education';
import { WorkExperienceCard } from '@/components/onboarding/review/experience';
import { ActivitiesCard } from '@/components/onboarding/review/activity';
import { CurrentLocationCard } from '@/components/onboarding/review/location';
import { SocialMediaCard } from '@/components/onboarding/review/social-media';
import { AttachmentsCard } from '@/components/onboarding/review/attachment';
import { ReviewActions } from '@/components/membership/review-action';
import { ReviewContainerProps } from '@/components/onboarding/review/type';

// Modify the userData to include applicationStatus
type ExtendedReviewContainerProps = ReviewContainerProps & {
  userData: (ReviewContainerProps['userData'] & { applicationStatus?: string }) | null;
};

export function ReviewContainer({ userData, isSubmitting, handleSubmit }: ExtendedReviewContainerProps) {
  return (
    <div className="min-h-screen -mt-10">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-14">
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-8">
            <PersonalInfoCard userData={userData} />
            <EducationCard userData={userData} />
            <WorkExperienceCard userData={userData} />
            <ActivitiesCard userData={userData} />
          </div>

          {/* Side Info Column */}
          <div className="space-y-8">
            <CurrentLocationCard userData={userData} />
            <SocialMediaCard userData={userData} />
            <AttachmentsCard userData={userData} />
          </div>
        </div>

        {/* Submit Button */}
        <ReviewActions isSubmitting={isSubmitting} onSubmit={handleSubmit} userId={userData?.id || ''} applicationStatus={userData?.applicationStatus || ''} />
      </div>
    </div>
  );
} 