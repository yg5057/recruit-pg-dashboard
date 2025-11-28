"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Payment } from "@/types";
import { useMemo } from "react";

interface DashboardChartProps {
  payments: Payment[];
  isLoading?: boolean;
}

export default function DashboardChart({
  payments,
  isLoading = false,
}: DashboardChartProps) {
  const chartData = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const grouped = payments.reduce((acc: any, curr) => {
      const date = curr.paymentAt.split("T")[0]; // YYYY-MM-DD 추출
      if (curr.status === "SUCCESS") {
        const amount = parseFloat(curr.amount);
        if (!acc[date]) acc[date] = 0;
        acc[date] += amount;
      }
      return acc;
    }, {});

    return Object.keys(grouped)
      .sort()
      .map((date) => ({
        date,
        amount: grouped[date],
      }));
  }, [payments]);

  if (isLoading) {
    return (
      <div className="h-[350px] w-full min-h-[350px] rounded-2xl bg-bg-sub/50 animate-pulse flex items-center justify-center">
        <span className="text-text-muted text-sm">
          차트 데이터를 불러오는 중...
        </span>
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex h-[350px] w-full min-h-[350px] items-center justify-center rounded-2xl border border-dashed border-border bg-bg-page/50 text-sm text-text-muted">
        표시할 거래 데이터가 없습니다.
      </div>
    );
  }

  return (
    <div className="h-[350px] w-full min-h-[350px] min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#E5E8EB"
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "#8B95A1" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#8B95A1" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `₩${(value / 10000).toLocaleString()}만`}
          />
          <Tooltip
            cursor={{ fill: "#F2F4F6" }}
            contentStyle={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              backgroundColor: "#FFFFFF",
              color: "#191F28",
            }}
            formatter={(value: number) => [
              `₩${value.toLocaleString()}`,
              "거래액",
            ]}
          />
          <Bar
            dataKey="amount"
            fill="var(--color-brand)"
            radius={[6, 6, 0, 0]}
            barSize={32}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
