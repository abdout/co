import { AttachmentsCard } from './attachment';
import { EligibilityCard } from './eligibility';
import { ContactCard } from './contact';

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
            <ContactCard userData={userData} />
            <EligibilityCard userData={userData} />
          </div>

          {/* Side Info Column */}
          <div className="space-y-8">
            <AttachmentsCard userData={userData} />
          </div>
        </div>

        {/* Submit Button */}
        <ReviewActions isSubmitting={isSubmitting} onSubmit={handleSubmit} />
      </div>
    </div>
  );
} 