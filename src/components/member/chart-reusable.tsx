// import * as React from "react";
// import { TrendingUp } from "lucide-react";
// import { Label, Pie, PieChart } from "recharts";

// import {
//     Card,
//     CardContent,
//     CardFooter,
//     // CardHeader,
//     // CardTitle,
// } from "@/components/ui/card";
// import {
//     ChartConfig,
//     ChartContainer,
//     ChartTooltip,
//     ChartTooltipContent,
// } from "@/components/ui/chart";

// interface ChartProps {
//     chartData: any[];
//     chartConfig: ChartConfig;
//     totalMembers: number;
//     title: string;
//     subtitle: string;
//     percentage: string;
// }

// export function Chart({ chartData, chartConfig, totalMembers, title, subtitle, percentage }: ChartProps) {
//     return (
//         <Card className="flex flex-col">
//             <CardContent className="w-60 h-60">
//                 <ChartContainer
//                     config={chartConfig}
//                     className="mx-auto aspect-square max-h-[250px]"
//                 >
//                     <PieChart>
//                         <ChartTooltip
//                             cursor={false}
//                             content={<ChartTooltipContent hideLabel />}
//                         />
//                         <Pie
//                             data={chartData}
//                             dataKey="count"
//                             nameKey="label"
//                             innerRadius={50}
//                             strokeWidth={40}
//                         >
//                             <Label
//                                 content={({ viewBox }) => {
//                                     if (viewBox && "cx" in viewBox && "cy" in viewBox) {
//                                         return (
//                                             <text
//                                                 x={viewBox.cx}
//                                                 y={viewBox.cy}
//                                                 textAnchor="middle"
//                                                 dominantBaseline="middle"
//                                             >
//                                                 <tspan
//                                                     x={viewBox.cx}
//                                                     y={viewBox.cy}
//                                                     className="fill-foreground text-3xl font-bold"
//                                                 >
//                                                     {totalMembers.toLocaleString()}
//                                                 </tspan>
//                                                 <tspan
//                                                     x={viewBox.cx}
//                                                     y={(viewBox.cy || 0) + 24}
//                                                     className="fill-muted-foreground"
//                                                 >
//                                                     {title}
//                                                 </tspan>
//                                             </text>
//                                         );
//                                     }
//                                 }}
//                             />
//                         </Pie>
//                     </PieChart>
//                 </ChartContainer>
//             </CardContent>
//             <CardFooter className="flex-col gap-2 text-sm">
//                 <div className="flex items-center gap-2 font-medium leading-none">
//                     {percentage} <TrendingUp className="h-4 w-4" />
//                 </div>
//                 <div className="leading-none text-muted-foreground">
//                     {subtitle}
//                 </div>
//             </CardFooter>
//         </Card>
//     );
// }