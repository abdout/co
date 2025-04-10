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
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface InvestmentData {
  sector: string;
  amount: number;
}
interface SectorAnalysisProps {
  data: InvestmentData[];
}
const SectorAnalysis = ({ data }: SectorAnalysisProps) => {
  return (
    <Card className="bg-purple-50">
      <CardHeader>
        <CardTitle>Sector Analysis</CardTitle>
        <CardDescription>Investments description acros sectors</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SectorAnalysis;
