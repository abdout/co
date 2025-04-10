"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const cashFlowData = [
  { month: "يناير", income: 85000, expenses: 62000, balance: 23000 },
  { month: "فبراير", income: 78000, expenses: 59000, balance: 19000 },
  { month: "مارس", income: 92000, expenses: 68000, balance: 24000 },
  { month: "أبريل", income: 103000, expenses: 75000, balance: 28000 },
  { month: "مايو", income: 112000, expenses: 82000, balance: 30000 },
  { month: "يونيو", income: 125000, expenses: 95000, balance: 30000 },
];
const CashFlow = () => {
  return (
    <Card className="bg-neutral-100 rounded-lg">
      <CardHeader>
        <CardTitle>التدفقات المالية </CardTitle>
      </CardHeader>
      <CardDescription className="mx-6 -mt-3">
        تصور الإيرادات والنفقات والرصيد على مدار الوقت
      </CardDescription>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            data={cashFlowData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis 
              dx={-50} 
              tickFormatter={(value) => `${value.toLocaleString()}`}
              tickCount={6}
              width={100}
              tick={{ fontSize: 12, fill: "#666" }}
            />
            <Tooltip formatter={(value) => value.toLocaleString()} />
            <Legend />
            <Area
              type="monotone"
              dataKey="income"
              stackId="1"
              stroke="#8884d8"
              fill="#8884d8"
              name="الإيرادات"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stackId="1"
              stroke="#82ca9d"
              fill="#82ca9d"
              name="النفقات"
            />
            <Area
              type="monotone"
              dataKey="balance"
              stackId="1"
              stroke="#ffc658"
              fill="#ffc658"
              name="الرصيد"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CashFlow;
