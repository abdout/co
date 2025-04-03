"use client";
import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
// import { useMember } from "@/components/platform/member/context";

// Chart configuration for different ranks
const chartConfig = {
  engineer: {
    label: "Engineer",
    color: "hsl(var(--chart-1))",
  },
  doctor: {
    label: "Doctor",
    color: "hsl(var(--chart-2))",
  },
  teacher: {
    label: "Teacher",
    color: "hsl(var(--chart-3))",
  },
  accountant: {
    label: "Accountant",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export function RankChart() {
  // Replace with actual member data if needed
  // const { members } = useMember();

  // Static fake data for ranks
  const engineerCount = 3;  // Example number for engineers
  const doctorCount = 2;    // Example number for doctors
  const teacherCount = 4;   // Example number for teachers
  const accountantCount = 1; // Example number for accountants

  // Prepare the chart data
  const chartData = [
    { rank: "Engineer", count: engineerCount, fill: "var(--color-engineer)" },
    { rank: "Doctor", count: doctorCount, fill: "var(--color-doctor)" },
    { rank: "Teacher", count: teacherCount, fill: "var(--color-teacher)" },
    { rank: "Accountant", count: accountantCount, fill: "var(--color-accountant)" },
  ];

  // Calculate the total number of members
  const totalMembers = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Member Ranks</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="rank"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  // Display the total number of members in the center of the chart
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalMembers.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Members
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 3.5% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing member ranks
        </div>
      </CardFooter>
    </Card>
  );
}
