"use client";

import { useEffect, useState } from "react";
import { fetchPayments } from "@/lib/api";
import { Payment } from "@/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// 결제 수단 매핑
const PAYMENT_TYPE_MAP: Record<string, string> = {
  ONLINE: "온라인",
  DEVICE: "단말기",
  MOBILE: "모바일",
  VACT: "가상계좌",
  BILLING: "정기결제",
};

// 결제 상태 매핑
const PAYMENT_STATUS_MAP: Record<string, string> = {
  PENDING: "결제 대기",
  SUCCESS: "결제 완료",
  FAILED: "결제 실패",
  CANCELLED: "환불 완료",
};

export default function TransactionsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    fetchPayments().then(setPayments);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-text-main">
            거래 내역
          </h2>
          <p className="text-text-muted mt-1">
            모든 결제 거래 내역을 조회하고 관리하세요.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-bg-surface shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-bg-sub border-b border-border text-text-sub font-medium">
              <tr>
                <th className="px-6 py-4">결제 코드</th>
                <th className="px-6 py-4">가맹점 코드</th>
                <th className="px-6 py-4">금액</th>
                <th className="px-6 py-4">타입</th>
                <th className="px-6 py-4">상태</th>
                <th className="px-6 py-4">일시</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {payments.map((p) => (
                <tr
                  key={p.paymentCode}
                  className="hover:bg-bg-page transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-text-main">
                    {p.paymentCode}
                  </td>
                  <td className="px-6 py-4 text-text-sub">{p.mchtCode}</td>
                  <td className="px-6 py-4 font-bold text-text-main">
                    {parseInt(p.amount).toLocaleString()}
                    <span className="text-xs text-text-muted ml-1">
                      {p.currency}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-sub">
                    {PAYMENT_TYPE_MAP[p.payType] || p.payType}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-xs font-semibold border",
                        p.status === "SUCCESS" &&
                          "bg-emerald-50 text-emerald-700 border-emerald-100",
                        p.status === "FAILED" &&
                          "bg-rose-50 text-rose-700 border-rose-100",
                        p.status === "CANCELLED" &&
                          "bg-orange-50 text-orange-700 border-orange-100",
                        p.status === "PENDING" &&
                          "bg-gray-50 text-gray-700 border-gray-200"
                      )}
                    >
                      {PAYMENT_STATUS_MAP[p.status] || p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-muted">
                    {format(new Date(p.paymentAt), "yyyy-MM-dd HH:mm")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
