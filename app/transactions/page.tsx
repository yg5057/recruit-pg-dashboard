"use client";

import { useEffect, useState, useMemo, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { fetchPayments } from "@/lib/api";
import { Payment } from "@/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CreditCard } from "lucide-react";
import {
  PAYMENT_STATUS_MAP,
  PAYMENT_TYPE_MAP,
  STATUS_COLOR_MAP,
} from "@/lib/constants";
import SearchFilterSection, {
  FilterConfig,
} from "@/app/_components/SearchFilterSection";
import Pagination from "@/app/_components/Pagination";

const ITEMS_PER_PAGE = 10;

export default function TransactionsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchPayments().then(setPayments);
  }, []);

  const handleRowClick = (mchtCode: string) => {
    router.push(`/merchants/${mchtCode}`);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchesSearch =
        searchTerm === "" ||
        p.paymentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.mchtCode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "" || p.status === statusFilter;
      const matchesType = typeFilter === "" || p.payType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [payments, searchTerm, statusFilter, typeFilter]);

  const totalItems = filteredPayments.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const currentPayments = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredPayments.slice(startIndex, endIndex);
  }, [filteredPayments, currentPage]);

  const transactionFilters: FilterConfig[] = [
    {
      value: statusFilter,
      onChange: handleStatusFilterChange,
      options: PAYMENT_STATUS_MAP,
      placeholder: "전체 상태",
    },
    {
      value: typeFilter,
      onChange: handleTypeFilterChange,
      options: PAYMENT_TYPE_MAP,
      placeholder: "전체 수단",
    },
  ];

  return (
    <div className="space-y-6 pb-10">
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

      <SearchFilterSection
        title="거래 내역 검색"
        icon={CreditCard}
        description="원하시는 거래 내역을 빠르게 찾아보세요."
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        searchPlaceholder="거래코드 또는 가맹점코드 검색..."
        filters={transactionFilters}
        totalItems={totalItems}
      />

      <div className="rounded-3xl border border-border bg-bg-surface shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left table-fixed">
            <thead className="bg-bg-sub border-b border-border text-text-sub font-medium">
              <tr>
                <th className="px-6 py-4 w-[20%]">결제 코드</th>
                <th className="px-6 py-4 w-[15%]">가맹점 코드</th>
                <th className="px-6 py-4 w-[15%]">결제 금액</th>
                <th className="px-6 py-4 w-[15%]">결제 타입</th>
                <th className="px-6 py-4 w-[15%]">결제 상태</th>
                <th className="px-6 py-4 w-[20%]">결제 일시</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {currentPayments.length > 0 ? (
                currentPayments.map((p) => (
                  <tr
                    key={p.paymentCode}
                    onClick={() => handleRowClick(p.mchtCode)}
                    className="hover:bg-bg-page transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 font-medium text-text-main truncate">
                      {p.paymentCode}
                    </td>
                    <td className="px-6 py-4 text-text-sub truncate">
                      {p.mchtCode}
                    </td>
                    <td className="px-6 py-4 font-bold text-text-main truncate">
                      {parseInt(p.amount).toLocaleString()}
                      <span className="text-xs text-text-muted ml-1">
                        {p.currency}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text-sub truncate">
                      {PAYMENT_TYPE_MAP[p.payType] || p.payType}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-lg text-xs font-semibold border inline-block truncate max-w-full",
                          STATUS_COLOR_MAP[p.status] ||
                            "bg-gray-100 text-text-sub border-gray-200"
                        )}
                      >
                        {PAYMENT_STATUS_MAP[p.status] || p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text-muted truncate">
                      {format(new Date(p.paymentAt), "yyyy-MM-dd HH:mm")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-text-muted"
                  >
                    검색 결과가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
