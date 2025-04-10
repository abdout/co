import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Landmark, Heart, Megaphone, Wallet } from "lucide-react";
import React from "react";

const WalletOverviewCards = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-purple-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">الميزانية السنوية</CardTitle>
          <Landmark className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$1,250,000</div>
          <p className="text-xs text-muted-foreground">للسنة المالية 2025</p>
        </CardContent>
      </Card>
      <Card className="bg-purple-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">التمويل المستلم</CardTitle>
          <Heart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$875,000</div>
          <p className="text-xs text-muted-foreground">70% من الميزانية المخططة</p>
        </CardContent>
      </Card>
      <Card className="bg-purple-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            إجمالي المصروفات
          </CardTitle>
          <Megaphone className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$643,500</div>
          <p className="text-xs text-muted-foreground">51.5% من الميزانية السنوية</p>
        </CardContent>
      </Card>
      <Card className="bg-purple-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">الرصيد المتاح</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$231,500</div>
          <p className="text-xs text-muted-foreground">
            متاح للأنشطة والحملات القادمة
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletOverviewCards;
