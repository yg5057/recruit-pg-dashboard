"use client";

import { ChangeEvent } from "react";
import { Search, LucideIcon, Filter } from "lucide-react";
import CustomDropdown from "./CustomDropdown";

export interface FilterConfig {
  value: string;
  onChange: (value: string) => void;
  options: Record<string, string>;
  placeholder: string;
}

interface SearchFilterSectionProps {
  searchTerm: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  searchPlaceholder: string;
  filters: FilterConfig[];
  totalItems: number;
  title?: string;
  description?: string;
  icon?: LucideIcon;
}

export default function SearchFilterSection({
  searchTerm,
  onSearchChange,
  searchPlaceholder,
  filters,
  totalItems,
  title = "필터 및 검색",
  description = "목록을 검색하고 필터링하세요.",
  icon: Icon = Filter,
}: SearchFilterSectionProps) {
  return (
    <div className="rounded-3xl border border-border bg-bg-surface p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={20} className="text-text-sub" />
        <h3 className="text-lg font-bold text-text-main">{title}</h3>
      </div>
      <p className="text-sm text-text-muted mb-6">{description}</p>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-text-muted" />
          </div>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={onSearchChange}
            className="w-full pl-10 pr-4 py-2.5 bg-bg-page border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 transition-shadow"
          />
        </div>

        {filters.map((filter, index) => (
          <CustomDropdown
            key={index}
            value={filter.value}
            onChange={filter.onChange}
            options={filter.options}
            placeholder={filter.placeholder}
          />
        ))}
      </div>

      <p className="text-text-main font-medium">
        총 <span className="font-bold">{totalItems}</span>건의 항목
      </p>
    </div>
  );
}
