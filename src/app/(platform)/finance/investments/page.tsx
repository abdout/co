import AssetAllocation from "@/components/finance/asset-allocation";
import InvesmentOverviewCards from "@/components/finance/invesment-cards";
import InvestmentHoldings from "@/components/finance/investment-holdings";
import PortfolioPerformance from "@/components/finance/portfolio-performance";
import SectorAnalysis from "@/components/finance/sector-analysis";
import { Button } from "@/components/ui/button";
import React from "react";

const performanceData = [
  { name: "يناير", stocks: 40000, bonds: 24000, realstate: 24000 },
  { name: "فبراير", stocks: 30000, bonds: 13980, realstate: 22100 },
  { name: "مارس", stocks: 50000, bonds: 38000, realstate: 22900 },
  { name: "أبريل", stocks: 48000, bonds: 39080, realstate: 20000 },
  { name: "مايو", stocks: 60000, bonds: 48000, realstate: 21810 },
  { name: "يونيو", stocks: 580000, bonds: 38000, realstate: 25000 },
];
const allocationData = [
  { name: "الأسهم", value: 400000, color: "#0088FE" },
  { name: "السندات", value: 380000, color: "#00C49F" },
  { name: "العقارات", value: 200000, color: "#FF8828" },
  { name: "السلع", value: 100000, color: "#FF8842" },
  { name: "العملات المشفرة", value: 50000, color: "#8884D8" },
];

const investments = [
  {
    id: 1,
    name: "آبل",
    symbol: "AAPL",
    amount: 150000,
    change: 2.5,
    sector: "التكنولوجيا",
  },
  {
    id: 2,
    name: "مايكروسوفت",
    symbol: "MSFT",
    amount: 135000,
    change: -1.2,
    sector: "التكنولوجيا",
  },
  {
    id: 3,
    name: "أمازون",
    symbol: "AMZN",
    amount: 114000,
    change: 1.8,
    sector: "المستهلك الدوري",
  },
  {
    id: 4,
    name: "تسلا",
    symbol: "TSLA",
    amount: 96000,
    change: -2.7,
    sector: "المستهلك الدوري",
  },
  {
    id: 5,
    name: "ألفابيت",
    symbol: "GOOGLE",
    amount: 126000,
    change: 0.9,
    sector: "خدمات الاتصالات",
  },
  {
    id: 6,
    name: "جونسون آند جونسون",
    symbol: "JNJ",
    amount: 108000,
    change: 0.5,
    sector: "الرعاية الصحية",
  },
  {
    id: 7,
    name: "جي بي مورغان تشيس",
    symbol: "JPM",
    amount: 117000,
    change: -0.8,
    sector: "الخدمات المالية",
  },
  {
    id: 8,
    name: "فيزا",
    symbol: "V",
    amount: 99000,
    change: 1.2,
    sector: "المالية",
  },
];

const Investments = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">محفظة الاستثمارات</h1>
        <Button>إنشاء تقرير</Button>
      </div>
      <InvesmentOverviewCards />
      <PortfolioPerformance data={performanceData} />
      <div className="grid gap-6 md:grid-cols-2">
        <AssetAllocation data={allocationData} />
        <SectorAnalysis data={investments} />
      </div>
      <InvestmentHoldings investments={investments} />
    </div>
  );
};

export default Investments;
