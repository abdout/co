"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  // CardDescription,
  CardFooter,
  // CardHeader,
  // CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A mixed bar chart for professions";

const chartData = [
  { profession: "Engineer", visitors: 275, fill: "var(--color-doctor)" },
  { profession: "Doctor", visitors: 200, fill: "var(--color-engineer)" },
  { profession: "Accountant", visitors: 187, fill: "var(--color-accountant)" },
  { profession: "Designer", visitors: 173, fill: "var(--color-designer)" },
  { profession: "Other", visitors: 90, fill: "var(--color-other)" },
];

const chartConfig = {
  visitors: {
    label: "عضو",
  },
  doctor: {
    label: "المجتمع",
    color: "hsl(var(--chart-1))",
  },
  engineer: {
    label: "الفكر",
    color: "hsl(var(--chart-2))",
  },
  accountant: {
    label: "الثقافة",
    color: "hsl(var(--chart-3))",
  },
  designer: {
    label: "السياسية",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "اخرى",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function ChartInterst () {
  return (
    <Card>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="profession"
              type="category"
              tickLine={false}
              tickMargin={50}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value.toLowerCase() as keyof typeof chartConfig]?.label
              }
            />
            <XAxis dataKey="visitors" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="visitors" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          توزيع الاهتمامات
        </div>
      </CardFooter>
    </Card>
  );
}