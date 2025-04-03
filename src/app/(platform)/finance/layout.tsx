import type { Metadata } from "next";
import Sidebar from "@/components/finance/sidebar";

export const metadata: Metadata = {
  title: "مال",
  description: "اقتصاد الحركة",
};

export default function FinanceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1 -mx-10">
      <Sidebar />
      <div className="flex-1 px-4">
        {children}
      </div>
    </div>
  );
}


     
      
