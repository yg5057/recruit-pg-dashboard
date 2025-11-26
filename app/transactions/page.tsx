"use client";

import { useEffect, useState } from "react";
import { fetchPayments } from "@/lib/api";
import { Payment } from "@/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  PAYMENT_STATUS_MAP,
  PAYMENT_TYPE_MAP,
  STATUS_COLOR_MAP,
} from "@/lib/constants";

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
                        STATUS_COLOR_MAP[p.status] ||
                          "bg-gray-100 text-gray-700 border-gray-200"
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
