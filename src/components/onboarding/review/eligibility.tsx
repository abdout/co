import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReviewCardProps } from "./type";
import { Badge } from "@/components/ui/badge";

export function EligibilityCard({ teamData }: ReviewCardProps) {
  if (!teamData) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Eligibility Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {teamData.eligibility && teamData.eligibility.length > 0 ? (
          <div>
            <p className="text-sm text-muted-foreground mb-2">Selected Eligibility Categories</p>
            <div className="flex flex-wrap gap-2">
              {teamData.eligibility.map((item, index) => (
                <Badge key={index} variant="outline" className="px-3 py-1">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">No eligibility information</p>
        )}
      </CardContent>
    </Card>
  );
} 