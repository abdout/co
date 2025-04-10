"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Legend, Radar } from "recharts";
import React from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

// Simplified data with single words for better display
const financialHealthData = [
  { Subject: "التبرعات", A: 120, B: 110, fullMark: 150 },
  { Subject: "العضوية", A: 98, B: 130, fullMark: 150 },
  { Subject: "الإعانات", A: 86, B: 130, fullMark: 150 },
  { Subject: "الأنشطة", A: 99, B: 100, fullMark: 150 },
  { Subject: "الحملات", A: 85, B: 90, fullMark: 150 },
  { Subject: "الإدارية", A: 65, B: 85, fullMark: 150 },
];

const FinancialHealthRadar = () => {
  return (
    <Card className="border border-neutral-300 rounded-lg">
      <CardHeader className="pb-2">
        <CardTitle>مؤشرات الأداء</CardTitle>
        <CardDescription>
          مقارنة المؤشرات المالية مع المعايير القياسية
        </CardDescription>
      </CardHeader>
      <CardContent className="">
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart
            cx="50%"
            cy="50%"
            outerRadius="65%"
            data={financialHealthData}
          >
            <PolarGrid strokeDasharray="4 4" />
            <PolarAngleAxis 
              dataKey="Subject" 
              tick={{ 
                fill: "#111111", 
                fontSize: 12, 
                fontWeight: 500
              }} 
              tickLine={false}
              style={{ fontWeight: 'bold' }}
            />
            <PolarRadiusAxis angle={0} domain={[0, 150]} />
            <Radar
              name="الحركة"
              dataKey="A"
              stroke="#EAB308"
              fill="#EAB308"
              fillOpacity={0.7}
            />
            <Radar
              name="المعيار القياسي"
              dataKey="B"
              stroke="#F97316"
              fill="#F97316"
              fillOpacity={0.4}
            />
            <Legend 
              iconSize={10}
              wrapperStyle={{
                paddingTop: "2px",
                fontSize: "12px",
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default FinancialHealthRadar;
