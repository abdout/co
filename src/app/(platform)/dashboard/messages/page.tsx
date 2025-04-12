'use client';

import React from 'react';

export default function MessagesPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-3xl font-bold mb-4">الرسائل</h1>
      <p className="text-lg text-muted-foreground mb-8">مساحة الرسائل الخاصة بك</p>
      
      <div className="border rounded-lg p-8 max-w-md w-full shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="text-start">
            <p className="text-muted-foreground">لا توجد رسائل حاليًا</p>
            <p className="text-sm text-muted-foreground mt-2">ستظهر هنا الرسائل الجديدة عند وصولها</p>
          </div>
        </div>
      </div>
    </div>
  );
} 