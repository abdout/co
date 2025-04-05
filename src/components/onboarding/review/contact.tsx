import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReviewCardProps } from "./type";

export function ContactCard({ teamData }: ReviewCardProps) {
  if (!teamData) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Full Name</p>
            <p className="font-medium">{teamData.fullname}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{teamData.user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            <p className="font-medium">{teamData.phone}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">WhatsApp</p>
            <p className="font-medium">{teamData.whatsapp}</p>
          </div>
          {teamData.twitter && (
            <div>
              <p className="text-sm text-muted-foreground">Twitter</p>
              <p className="font-medium">{teamData.twitter}</p>
            </div>
          )}
          {teamData.facebook && (
            <div>
              <p className="text-sm text-muted-foreground">Facebook</p>
              <p className="font-medium">{teamData.facebook}</p>
            </div>
          )}
          {teamData.linkedin && (
            <div>
              <p className="text-sm text-muted-foreground">LinkedIn</p>
              <p className="font-medium">{teamData.linkedin}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 