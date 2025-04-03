import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserReviewData } from "./type";

interface EligibilityCardProps {
  userData: UserReviewData | null;
}

export function EligibilityCard({ userData }: EligibilityCardProps) {
  if (!userData) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Eligibility Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Nationality</p>
            <p className="font-medium">{userData.nationalityId}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Marital Status</p>
            <p className="font-medium">{userData.maritalStatus}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Gender</p>
            <p className="font-medium">{userData.gender}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Religion</p>
            <p className="font-medium">{userData.religion}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Date of Birth</p>
            <p className="font-medium">
              {userData.birthDate ? new Date(userData.birthDate).toLocaleDateString('en-US') : ''}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Place of Birth</p>
            <p className="font-medium">
              {[userData.birthCountry, userData.birthState, userData.birthLocality]
                .filter(Boolean)
                .join(', ')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 