"use client";
import { Button } from "@/components/ui/button";
import WalletFinancialGoals from "@/components/finance/wallet-goals";
import WalletOverviewCards from "@/components/finance/wallet-cards";
import WalletSpendingCategories from "@/components/finance/wallet-spending-categories";
import WalletSpendingTrends from "@/components/finance/wallet-spending-trends";
import WalletTransactions from "@/components/finance/wallet-transactions";
import React from "react";

const Wallet = () => {
  return (
    <div className="space y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">محفظتي</h1>
        <Button>تصدير التقرير المالي</Button>
      </div>
      <WalletOverviewCards />
      <br />
      <div className="grid gap-6 md:grid-cols-2">
        <WalletSpendingCategories />
        <WalletSpendingTrends />
      </div>
      <br />
      <WalletTransactions />
      <br />
      <WalletFinancialGoals />
    </div>
  );
};

export default Wallet;
