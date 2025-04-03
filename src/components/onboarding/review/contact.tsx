import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserReviewData } from "./type";

interface ContactCardProps {
  userData: UserReviewData | null;
}

export function ContactCard({ userData }: ContactCardProps) {
  if (!userData) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Full Name</p>
            <p className="font-medium">{userData.fullname}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{userData.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            <p className="font-medium">{userData.phone}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">WhatsApp</p>
            <p className="font-medium">{userData.whatsapp}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 