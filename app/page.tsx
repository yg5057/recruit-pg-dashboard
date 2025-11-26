"use client";

import { useEffect, useState, useMemo } from "react";
import { fetchPayments } from "@/lib/api";
import { Payment } from "@/types";
import DashboardChart from "./_components/DashboardChart";
import { TrendingUp, Users, CreditCard, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  PAYMENT_STATUS_MAP,
  PAYMENT_TYPE_MAP,
  STATUS_COLOR_MAP,
} from "@/lib/constants";

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

  const recentPayments = useMemo(() => {
    return [...payments]
      .sort(
        (a, b) =>
          new Date(b.paymentAt).getTime() - new Date(a.paymentAt).getTime()
      )
      .slice(0, 5);
  }, [payments]);

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

      {/* 통계 카드 */}
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

      {/* 일별 거래 추이 차트 */}
      <div className="rounded-3xl border border-border bg-bg-surface p-8 shadow-sm">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-text-main">일별 거래 추이</h3>
          <p className="text-text-muted mt-1 text-sm">
            최근 10일간 거래 상태 현황
          </p>
        </div>
        <DashboardChart payments={payments} />
      </div>

      {/* 최근 거래 내역 */}
      <div className="rounded-3xl border border-border bg-bg-surface p-8 shadow-sm">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-text-main">최근 거래 내역</h3>
          <p className="text-text-muted mt-1 text-sm">
            최신 5건의 결제 거래를 확인하세요
          </p>
          <p className="text-text-main mt-3 text-lg">
            총 <span className="font-bold">{totalCount}</span>건의 거래
          </p>
        </div>
        <div className="space-y-4">
          {recentPayments.length === 0 ? (
            <p className="text-text-muted text-sm py-4">
              최근 거래 내역이 없습니다.
            </p>
          ) : (
            recentPayments.map((p) => (
              <div
                key={p.paymentCode}
                className="flex flex-col md:flex-row md:items-center justify-between rounded-2xl border border-border p-5 hover:bg-bg-page transition-colors gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-text-main text-lg">
                      {p.mchtCode}
                    </span>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-md text-xs font-semibold",
                        STATUS_COLOR_MAP[p.status] ||
                          "bg-gray-100 text-gray-600"
                      )}
                    >
                      {PAYMENT_STATUS_MAP[p.status] || p.status}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-text-muted gap-2 flex-wrap">
                    <span className="font-mono">{p.paymentCode}</span>
                    <span>•</span>
                    <span>{PAYMENT_TYPE_MAP[p.payType] || p.payType}</span>
                    <span>•</span>
                    <span>
                      {format(new Date(p.paymentAt), "yyyy. MM. dd. a h:mm:ss")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-1">
                  <span className="font-bold text-xl text-text-main">
                    ₩{parseInt(p.amount).toLocaleString()}
                  </span>
                  {p.currency !== "KRW" && (
                    <span className="text-sm text-text-muted">
                      {p.currency}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
