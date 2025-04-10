import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Calendar, Heart } from "lucide-react";
import React from "react";

const OverviewCards = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-neutral-100 rounded-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">إجمالي التمويل</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$1,320,800</div>
          <p className="text-xs text-muted-foreground">
            +5.2% مقارنة بالربع السابق
          </p>
        </CardContent>
      </Card>
      <Card className="bg-neutral-100 rounded-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            رسوم العضوية
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$245,500</div>
          <p className="text-xs text-muted-foreground">
            من 4,910 عضو نشط
          </p>
        </CardContent>
      </Card>
      <Card className="bg-neutral-100 rounded-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            نفقات الحملات
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$368,200</div>
          <p className="text-xs text-muted-foreground">
            لـ 5 حملات نشطة
          </p>
        </CardContent>
      </Card>
      <Card className="bg-neutral-100 rounded-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            التبرعات
          </CardTitle>
          <Heart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$542,800</div>
          <p className="text-xs text-muted-foreground">
            +12% مقارنة بالعام السابق
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewCards;
