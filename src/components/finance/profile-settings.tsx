import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React from "react";

const ProfileSettings = () => {
  return (
    <Card className="bg-purple-50">
      <CardHeader>
        <CardTitle>معلومات الملف الشخصي</CardTitle>
        <CardDescription>قم بتحديث بياناتك الشخصية هنا</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="firstName">الاسم الأول</label>
            <Input id="firstName" placeholder="علي" />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName">اسم العائلة</label>
            <Input id="lasttName" placeholder="أحمد" />
          </div>

          <div className="space-y-2">
            <label htmlFor="email">البريد الإلكتروني</label>
            <Input id="email" placeholder="ali.ahmed@example.com" />
          </div>
          <div className="space-y-2">
            <label htmlFor="phoneNumber">رقم الهاتف</label>
            <Input id="phoneNumber" placeholder="+249-{123}-1231231" />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="bio">نبذة شخصية</label>
          <Input id="bio" placeholder="أخبرنا عن نفسك" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
