import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Building,
  Calendar,
  Users,
  DollarSign,
  Heart,
  Briefcase,
  Camera,
  Landmark,
  Megaphone,
} from "lucide-react";

const transactions = [
  {
    id: 1,
    date: "2025-02-28",
    description: "تبرع من شركة الاتحاد",
    category: "التبرعات",
    amount: 15000,
  },
  {
    id: 2,
    date: "2025-02-27",
    description: "دفع إيجار المقر الرئيسي",
    category: "المقرات",
    amount: -8500,
  },
  {
    id: 3,
    date: "2025-02-26",
    description: "طباعة منشورات الحملة",
    category: "الحملات",
    amount: -12500,
  },
  {
    id: 4,
    date: "2025-02-25",
    description: "رسوم العضوية الشهرية",
    category: "العضوية",
    amount: 7800,
  },
  {
    id: 5,
    date: "2025-02-24",
    description: "تنظيم مؤتمر صحفي",
    category: "الفعاليات",
    amount: -6200,
  },
];
const categoryIcons = {
  التبرعات: Heart,
  المقرات: Building,
  الحملات: Megaphone,
  العضوية: Users,
  الفعاليات: Calendar,
  "المصاريف الإدارية": Briefcase,
  "التواصل الإعلامي": Camera,
  "المنح الحكومية": Landmark,
  "رواتب الموظفين": DollarSign,
};
const WalletTransactions = () => {
  return (
    <Card className="bg-purple-50">
      <CardHeader>
        <CardTitle>المعاملات المالية الأخيرة</CardTitle>
        <CardDescription>
          الأنشطة المالية للحزب خلال الأسبوع الماضي
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => {
            const IconComponent =
              categoryIcons[
                transaction.category as keyof typeof categoryIcons
              ] || DollarSign;

            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-medium ${
                      transaction.amount > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {transaction.amount > 0 ? "+" : "-"}$
                    {Math.abs(transaction.amount).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {transaction.category}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletTransactions;
