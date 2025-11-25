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

export default function DashboardChart({ payments }: { payments: Payment[] }) {
  const chartData = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const grouped = payments.reduce((acc: any, curr) => {
      const date = curr.paymentAt.split("T")[0];
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

  return (
    <div className="h-[350px] w-full">
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
