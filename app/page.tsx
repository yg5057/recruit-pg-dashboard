"use client";

import { useEffect, useState } from "react";
import { fetchPayments } from "@/lib/api";
import { Payment } from "@/types";
import DashboardChart from "./_components/DashboardChart";
import { TrendingUp, Users, CreditCard, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPayments()
      .then(setPayments)
      .catch((e) => console.error(e))
      .finally(() => setIsLoading(false));
  }, []);

  const totalAmount = payments
    .filter((p) => p.status === "SUCCESS")
    .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  const totalCount = payments.length;
  const successCount = payments.filter((p) => p.status === "SUCCESS").length;
  const failRate =
    totalCount > 0
      ? (
          (payments.filter((p) => p.status === "FAILED").length / totalCount) *
          100
        ).toFixed(1)
      : "0";

  const stats = [
    {
      title: "총 거래액",
      value: `₩${totalAmount.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-brand bg-blue-50",
    },
    {
      title: "전체 거래수",
      value: `${totalCount}건`,
      icon: CreditCard,
      color: "text-text-sub bg-slate-100",
    },
    {
      title: "성공 건수",
      value: `${successCount}건`,
      icon: Users,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "실패율",
      value: `${failRate}%`,
      icon: AlertCircle,
      color: "text-rose-600 bg-rose-50",
    },
  ];

  if (isLoading)
    return (
      <div className="p-10 flex justify-center text-brand">Loading...</div>
    );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-text-main">
          대시보드
        </h2>
        <p className="text-text-muted mt-2">결제 현황을 한눈에 확인하세요.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="rounded-3xl border border-border bg-bg-surface p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center gap-4">
              <div className={cn("p-3.5 rounded-2xl", stat.color)}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-text-muted mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-text-main">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-border bg-bg-surface p-8 shadow-sm">
        <h3 className="text-xl font-bold text-text-main mb-8">
          일별 거래 추이
        </h3>
        <DashboardChart payments={payments} />
      </div>
    </div>
  );
}
