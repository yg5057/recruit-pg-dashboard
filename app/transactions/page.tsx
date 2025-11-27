"use client";

import { useEffect, useState, useMemo, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { fetchPayments } from "@/lib/api";
import { Payment } from "@/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  PAYMENT_STATUS_MAP,
  PAYMENT_TYPE_MAP,
  STATUS_COLOR_MAP,
} from "@/lib/constants";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";

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

  const handleStatusFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleTypeFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(e.target.value);
    setCurrentPage(1);
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

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

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

      <div className="rounded-3xl border border-border bg-bg-surface p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Filter size={20} className="text-text-sub" />
          <h3 className="text-lg font-bold text-text-main">필터 및 검색</h3>
        </div>
        <p className="text-sm text-text-muted mb-6">
          거래 내역을 검색하고 필터링하세요.
        </p>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-text-muted" />
            </div>
            <input
              type="text"
              placeholder="거래코드 또는 가맹점코드 검색..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2.5 bg-bg-page border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 transition-shadow"
            />
          </div>

          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="px-4 py-2.5 bg-bg-page border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 transition-shadow cursor-pointer text-text-main"
          >
            <option value="">전체 상태</option>
            {Object.entries(PAYMENT_STATUS_MAP).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={handleTypeFilterChange}
            className="px-4 py-2.5 bg-bg-page border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 transition-shadow cursor-pointer text-text-main"
          >
            <option value="">전체 수단</option>
            {Object.entries(PAYMENT_TYPE_MAP).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <p className="text-text-main font-medium">
          총 <span className="font-bold">{totalItems}</span>건의 거래
        </p>
      </div>

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

      {totalPages > 0 && (
        <div className="flex items-center justify-center pt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-border bg-bg-surface text-text-sub hover:bg-bg-sub disabled:opacity-50 disabled:hover:bg-bg-surface transition-colors cursor-pointer disabled:cursor-default shrink-0"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-1 overflow-x-auto max-w-[calc(100vw-160px)] md:max-w-none scrollbar-hide">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={cn(
                      "min-w-9 h-9 px-2 rounded-lg text-sm font-medium transition-colors shrink-0 cursor-pointer",
                      currentPage === page
                        ? "bg-brand text-white"
                        : "text-text-sub hover:bg-bg-sub"
                    )}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-border bg-bg-surface text-text-sub hover:bg-bg-sub disabled:opacity-50 disabled:hover:bg-bg-surface transition-colors cursor-pointer disabled:cursor-default shrink-0"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
