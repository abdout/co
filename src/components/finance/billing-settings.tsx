import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React from "react";
import { Label } from "recharts";

const BillingSettings = () => {
  return (
    <Card className="bg-purple-50">
      <CardHeader>
        <CardTitle>معلومات الفواتير</CardTitle>
        <CardDescription>
          إدارة تفاصيل الفواتير والاشتراك
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>الخطة الحالية</Label>
          <p className="text-sm font-medium">الخطة المتقدمة [19.99$ شهريًا]</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="cardNumber">رقم البطاقة</label>
          <Input id="card-number" placeholder="**** **** **** 1234" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="expiryDate">تاريخ الانتهاء</label>
            <Input id="expiry-date" placeholder="MM/YY" />
          </div>
          <div className="space-y-2">
            <label htmlFor="cvv">رمز التحقق</label>
            <Input id="cvv" placeholder="***" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant={"outline"}>إلغاء الاشتراك</Button>
        <Button>تحديث معلومات الفواتير</Button>
      </CardFooter>
    </Card>
  );
};

export default BillingSettings;
