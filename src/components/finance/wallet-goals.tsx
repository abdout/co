import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const WalletFinancialGoals = () => {
  return (
    <Card className="bg-purple-50">
      <CardHeader>
        <CardTitle>الأهداف المالية للحزب</CardTitle>
        <CardDescription>
          تتبع تقدم الحزب نحو تحقيق أهدافه المالية
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">هدف جمع التبرعات السنوي</span>
              <span className="text-sm font-medium">70% ($700,000 / $1,000,000)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: "70%" }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">ميزانية الحملة الانتخابية</span>
              <span className="text-sm font-medium">85% ($425,000 / $500,000)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-green-600 h-2.5 rounded-full"
                style={{ width: "85%" }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">هدف العضويات الجديدة</span>
              <span className="text-sm font-medium">62% (3,100 / 5,000)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-purple-600 h-2.5 rounded-full"
                style={{ width: "62%" }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">احتياطي الطوارئ</span>
              <span className="text-sm font-medium">40% ($80,000 / $200,000)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-yellow-600 h-2.5 rounded-full"
                style={{ width: "40%" }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletFinancialGoals;
