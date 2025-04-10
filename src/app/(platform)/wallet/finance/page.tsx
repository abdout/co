import CashFlow from "@/components/finance/cash-flow";
import FinancialHealthRadar from "@/components/finance/financial-radar";
import OverviewCards from "@/components/finance/overveiw-card";
import TreeMap from "@/components/finance/tree-map";
import { Button } from "@/components/ui/button";

export default function FinancialHealth() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        {/* <h1 className="text-3xl font-bold">التقرير المالي للحزب</h1> */}
        <Button variant="ghost" >إنشاء تقرير مفصل</Button>
      </div>
      <OverviewCards />
      <br />
      <div className="grid gap-6 md:grid-cols-2">
        <FinancialHealthRadar />
        <TreeMap />
        <br />
      </div>
      <CashFlow />
      <br />
    </div>
  );
}
