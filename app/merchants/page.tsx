"use client";

import { useEffect, useState } from "react";
import { fetchMerchants } from "@/lib/api";
import { Merchant } from "@/types";
import { cn } from "@/lib/utils";

export default function MerchantsPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);

  useEffect(() => {
    fetchMerchants().then(setMerchants);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-text-main">
          가맹점 관리
        </h2>
        <p className="text-text-muted mt-1">등록된 가맹점 목록을 관리합니다.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {merchants.map((m) => (
          <div
            key={m.mchtCode}
            className="rounded-3xl border border-border bg-bg-surface p-6 shadow-sm hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex justify-between items-start mb-4">
              <span
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-bold border",
                  m.status === "ACTIVE"
                    ? "bg-blue-50 text-brand border-blue-100"
                    : "bg-gray-100 text-text-sub border-gray-200"
                )}
              >
                {m.status}
              </span>
              <span className="text-xs text-text-muted font-mono bg-bg-sub px-2 py-1 rounded-md">
                {m.bizType}
              </span>
            </div>
            <h3 className="font-bold text-lg text-text-main mb-1 group-hover:text-brand transition-colors">
              {m.mchtName}
            </h3>
            <p className="text-xs text-text-muted mb-6 font-mono">
              {m.mchtCode}
            </p>

            <button className="w-full py-2.5 text-sm font-semibold text-text-sub bg-bg-sub rounded-xl hover:bg-gray-200 transition-colors">
              상세 보기
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
