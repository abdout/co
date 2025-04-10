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
  CartesianGrid,
  Legend,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from "recharts";

interface PerformanceData {
  name: string;
  stocks: number;
  bonds: number;
  realstate: number;
}

interface PortfolioPerformanceProps {
  data: PerformanceData[];
}

const PortfolioPerformance = ({ data }: PortfolioPerformanceProps) => {
  return (
    <Card className="bg-purple-50">
      <CardHeader>
        <CardTitle>أداء المحفظة</CardTitle>
        <CardDescription>
          تتبع استثماراتك عبر فئات الأصول المختلفة
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="stocks" stroke="#0088FE" name="الأسهم" />
            <Line type="monotone" dataKey="bonds" stroke="#00C49E" name="السندات" />
            <Line type="monotone" dataKey="realstate" stroke="#FFBB28" name="العقارات" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PortfolioPerformance;
