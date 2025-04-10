import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import React from "react";

interface Investments {
  id: number;
  name: string;
  symbol: string;
  amount: number;
  change: number;
  sector: string;
}
interface InterfaceHoldingProps {
  investments: Investments[];
}
const InvestmentHoldings = ({ investments }: InterfaceHoldingProps) => {
  return (
    <Card className="bg-purple-50">
      <CardHeader>
        <CardTitle>Investment Holding</CardTitle>
        <CardDescription>
          Detailed view of your current investments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {investments.map((investment) => (
            <div
              key={investment.id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="font-medium">{investment.name}</p>
                <p className="text-sm text-gray-500">
                  {investment.symbol}-{investment.sector}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">$ {investment.amount.toFixed(2)}</p>
                <p
                  className={`text-sm flex items-center ${
                    investment.change > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {investment.change > 0 ? (
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 mr-1" />
                  )}
                  {Math.abs(investment.change)}$
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentHoldings;
