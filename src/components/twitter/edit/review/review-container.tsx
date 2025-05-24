import { PersonalInfoCard } from './information';
import { EducationCard } from './education';
import { WorkExperienceCard } from './experience';
import { ActivitiesCard } from './activity';
import { CurrentLocationCard } from './location';
import { SocialMediaCard } from './social-media';
import { AttachmentsCard } from './attachment';
import { ReviewActions } from './review-action';
import { ReviewContainerProps } from './type';

export function ReviewContainer({ userData, isSubmitting, handleSubmit }: ReviewContainerProps) {
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
        <ReviewActions isSubmitting={isSubmitting} onSubmit={handleSubmit} />
      </div>
    </div>
  );
} 