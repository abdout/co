'use client';

import React from 'react';

export default function SettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-3xl font-bold mb-4">الإعدادات</h1>
      <p className="text-lg text-muted-foreground mb-8">ضبط خيارات المنصة والحساب</p>
      
      <div className="border rounded-lg p-8 max-w-xl w-full shadow-sm">
        <div className="flex flex-col gap-6">
          <div className="grid gap-4 text-start">
            <h3 className="text-lg font-medium">إعدادات الحساب</h3>
            
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">تغيير كلمة المرور</p>
                <p className="text-sm text-muted-foreground">قم بتحديث كلمة المرور الخاصة بك</p>
              </div>
              <button className="px-3 py-1 text-sm bg-muted hover:bg-muted/80 rounded-md transition-colors">
                تعديل
              </button>
            </div>
            
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">إعدادات الإشعارات</p>
                <p className="text-sm text-muted-foreground">تحكم في كيفية تلقي الإشعارات</p>
              </div>
              <button className="px-3 py-1 text-sm bg-muted hover:bg-muted/80 rounded-md transition-colors">
                تعديل
              </button>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="font-medium">الوضع المظلم</p>
                <p className="text-sm text-muted-foreground">تبديل مظهر المنصة</p>
              </div>
              <div className="w-12 h-6 bg-muted rounded-full relative cursor-pointer">
                <div className="w-5 h-5 bg-background rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-start">
            <h3 className="text-lg font-medium mb-4">خيارات أخرى</h3>
            
            <button className="px-4 py-2 text-red-500 hover:bg-red-100 hover:bg-opacity-20 rounded-md transition-colors w-full text-start">
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 