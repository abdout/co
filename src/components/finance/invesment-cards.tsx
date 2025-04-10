import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, DollarSign, Minus, Plus } from "lucide-react";

const InvesmentOverviewCards = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-purple-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">قيمة المحفظة</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$945,000.00</div>
          <p className="text-xs text-muted-foreground">محدثة في الوقت الحقيقي</p>
        </CardContent>
      </Card>
      <Card className="bg-purple-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">عائد الاستثمار</CardTitle>
          <Plus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12.7%</div>
          <p className="text-xs text-muted-foreground">
            عائد على الاستثمار
          </p>
        </CardContent>
      </Card>
      <Card className="bg-purple-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">مستوى المخاطرة</CardTitle>
          <Minus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">63%</div>
          <p className="text-xs text-muted-foreground">مخاطرة متوسطة</p>
        </CardContent>
      </Card>
      <Card className="bg-purple-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            درجة التنويع
          </CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">82%</div>
          <p className="text-xs text-muted-foreground">
            محفظة متنوعة جيدًا
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvesmentOverviewCards;
