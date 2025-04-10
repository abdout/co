import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const monthlySpendinData = [
  { month: "يناير", amount: 6800 },
  { month: "فبراير", amount: 7100 },
  { month: "مارس", amount: 6950 },
  { month: "أبريل", amount: 7200 },
  { month: "مايو", amount: 7500 },
  { month: "يونيو", amount: 7000 },
];
const WalletSpendingTrends = () => {
  return (
    <Card className="bg-purple-50">
      <CardHeader>
        <CardTitle>اتجاه الإنفاق الشهري</CardTitle>
        <CardDescription>إنفاقك خلال الأشهر الستة الماضية</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlySpendinData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default WalletSpendingTrends;
