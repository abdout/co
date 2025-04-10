"use client";
import BillingSettings from "@/components/finance/billing-settings";
import ProfileSettings from "@/components/finance/profile-settings";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">الإعدادات</h1>
        <Button>حفظ التغييرات</Button>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">الملف الشخصي</TabsTrigger>
          <TabsTrigger value="billing">الفواتير</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">{<ProfileSettings />}</TabsContent>
        <TabsContent value="billing">{<BillingSettings />}</TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
