"use client";

import Link from "next/link";
import { useEffect, useState, useMemo, ChangeEvent } from "react";
import { fetchMerchants } from "@/lib/api";
import { Merchant } from "@/types";
import { cn } from "@/lib/utils";
import { Store } from "lucide-react";
import {
  MERCHANT_STATUS_MAP,
  BIZ_TYPE_MAP,
  MERCHANT_STATUS_COLOR_MAP,
} from "@/lib/constants";
import SearchFilterSection, {
  FilterConfig,
} from "@/app/_components/SearchFilterSection";

export default function MerchantsPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [bizTypeFilter, setBizTypeFilter] = useState("");

  useEffect(() => {
    fetchMerchants().then(setMerchants);
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleBizTypeFilterChange = (value: string) => {
    setBizTypeFilter(value);
  };

  const filteredMerchants = useMemo(() => {
    return merchants.filter((m) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        searchTerm === "" ||
        m.mchtName.toLowerCase().includes(searchLower) ||
        m.mchtCode.toLowerCase().includes(searchLower);

      const matchesStatus = statusFilter === "" || m.status === statusFilter;
      const matchesBizType =
        bizTypeFilter === "" || m.bizType === bizTypeFilter;

      return matchesSearch && matchesStatus && matchesBizType;
    });
  }, [merchants, searchTerm, statusFilter, bizTypeFilter]);

  const merchantFilters: FilterConfig[] = [
    {
      value: statusFilter,
      onChange: handleStatusFilterChange,
      options: MERCHANT_STATUS_MAP,
      placeholder: "전체 상태",
    },
    {
      value: bizTypeFilter,
      onChange: handleBizTypeFilterChange,
      options: BIZ_TYPE_MAP,
      placeholder: "전체 업종",
    },
  ];

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-text-main">
          가맹점 관리
        </h2>
        <p className="text-text-muted mt-1">등록된 가맹점 목록을 관리합니다.</p>
      </div>

      <SearchFilterSection
        icon={Store}
        title="가맹점 검색"
        description="원하시는 가맹점을 빠르게 찾아보세요."
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        searchPlaceholder="가맹점명 또는 가맹점코드 검색.."
        filters={merchantFilters}
        totalItems={filteredMerchants.length}
      />

      {filteredMerchants.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMerchants.map((m) => (
            <div
              key={m.mchtCode}
              className="rounded-3xl border border-border bg-bg-surface p-6 shadow-sm hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex justify-between items-start mb-4">
                <span
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-bold border",
                    MERCHANT_STATUS_COLOR_MAP[m.status] ||
                      "bg-gray-100 text-gray-600 border-gray-200"
                  )}
                >
                  {MERCHANT_STATUS_MAP[m.status] || m.status}
                </span>
                <span className="text-xs text-text-muted font-mono bg-bg-sub px-2 py-1 rounded-md">
                  {BIZ_TYPE_MAP[m.bizType] || m.bizType}
                </span>
              </div>
              <h3 className="font-bold text-lg text-text-main mb-1 group-hover:text-brand transition-colors">
                {m.mchtName}
              </h3>
              <p className="text-xs text-text-muted mb-6 font-mono">
                {m.mchtCode}
              </p>

              <Link href={`/merchants/${m.mchtCode}`} className="block w-full">
                <button className="w-full py-2.5 text-sm font-semibold text-text-sub bg-bg-sub rounded-lg hover:bg-brand hover:text-white transition-colors cursor-pointer">
                  상세 보기
                </button>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-text-muted bg-bg-surface border border-border rounded-3xl">
          검색 결과가 없습니다.
        </div>
      )}

      {filteredMerchants.length > 0 && (
        <div className="flex flex-col items-center justify-center py-4 text-text-muted text-sm text-center">
          {searchTerm === "" && statusFilter === "" && bizTypeFilter === "" && (
            <p>모든 가맹점을 불러왔습니다.</p>
          )}
          <p>
            (총 <span className="font-medium">{filteredMerchants.length}</span>
            개 가맹점)
          </p>
        </div>
      )}
    </div>
  );
}
