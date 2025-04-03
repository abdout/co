"use client";
import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
    Card,
    CardContent,
    CardFooter,
    // CardHeader,
    // CardTitle,
} from "@/components/ui/card";
import {
    // ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";


// const chartConfig = {
//     male: {
//         label: "خامل",
//         color: "hsl(var(--chart-1))",
//     },
//     female: {
//         label: "نشط",
//         color: "hsl(var(--chart-2))",
//     },
// } satisfies ChartConfig;

// ChartActive
export function ChartActive() {
    const maleCount = 680;
    const femaleCount = 20;
    const chartData = [
        { gender: "ذكر", count: maleCount, fill: "var(--color-male)" },
        { gender: "أنثى", count: femaleCount, fill: "var(--color-female)" },
    ];
    const totalMembers = 700;
    const chartConfig = {
        male: {
            label: "ذكر",
            color: "hsl(var(--chart-1))",
        },
        female: {
            label: "أنثى",
            color: "hsl(var(--chart-2))",
        },
    };

    return (
        <Card className="flex flex-col">
            <CardContent className="w-60 h-60">
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
                            nameKey="gender"
                            innerRadius={50}
                            strokeWidth={10}
                        >
                            <Label
                                content={({ viewBox }) => {
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
                                                    className="fill-foreground text-2xl font-bold"
                                                >
                                                    {totalMembers.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    عضو
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
            <CardFooter className="flex-col gap-2 text-sm -mt-12">
                <div className="flex items-center gap-2 font-medium leading-none">
                      الاعضاء النشطين 5%   <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                     حالة العضوية
                </div>
            </CardFooter>
        </Card>
    );
}

