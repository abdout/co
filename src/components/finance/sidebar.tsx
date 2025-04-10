import {
  Settings,
  TrendingUp,
  Wallet,
  BarChart,
} from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import Link from "next/link";

const Sidebar = () => {
  return (
    <aside className="w-32">
      <div className="flex item-center ">
        
        
      </div>
      <nav>
        <Link href={"/finance"} passHref>
          <Button variant="ghost" className="w-full justify-start mb-2">
            <BarChart className="mr-2 h-4 w-4" />
             المالية
          </Button>
        </Link>
        <Link href={"/finance/wallet"} passHref>
          <Button variant="ghost" className="w-full justify-start mb-2">
            <Wallet className="mr-2 h-4 w-4" />
            الميزانية
          </Button>
        </Link>
        <Link href={"/finance/investments"} passHref>
          <Button variant="ghost" className="w-full justify-start mb-2">
            <TrendingUp className="mr-2 h-4 w-4" />
            التمويل
          </Button>
        </Link>
        <Link href={"/finance/settings"} passHref>
          <Button variant="ghost" className="w-full justify-start mb-2">
            <Settings className="mr-2 h-4 w-4" />
            الإعدادات
          </Button>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
