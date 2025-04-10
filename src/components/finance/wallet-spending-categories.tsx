import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const spendingData = [
  { category: "السكن", amount: 2500 },
  { category: "المواصلات", amount: 800 },
  { category: "الطعام", amount: 1000 },
  { category: "المرافق", amount: 500 },
  { category: "الرعاية الصحية", amount: 600 },
  { category: "الترفيه", amount: 400 },
  { category: "الملابس", amount: 200 },
  { category: "المدخرات", amount: 3000 },
];
const WalletSpendingCategories = () => {
  return (
    <Card className="w-full max-w-3xl mx-auto bg-purple-50">
      <CardHeader>
        <CardTitle>الإنفاق حسب الفئة</CardTitle>
        <CardDescription>تفصيل النفقات الشهرية</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={spendingData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis />
            <YAxis />
            <Tooltip
              formatter={(value) => [`$${value}`, "المبلغ"]}
              labelStyle={{ color: "black" }}
            />
            <Legend />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default WalletSpendingCategories;
