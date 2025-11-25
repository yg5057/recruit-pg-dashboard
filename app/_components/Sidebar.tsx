"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CreditCard, Store, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "대시보드", href: "/", icon: LayoutDashboard },
    { name: "거래 내역", href: "/transactions", icon: CreditCard },
    { name: "가맹점 관리", href: "/merchants", icon: Store },
  ];

  return (
    <aside className="w-64 bg-bg-surface border-r border-border h-screen fixed left-0 top-0 flex flex-col z-50 shadow-sm">
      <div className="p-8 pb-4">
        <h1 className="text-2xl font-bold text-text-main tracking-tight">
          PG Dashboard<span className="text-brand">.</span>
        </h1>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-md text-[15px] font-medium transition-all duration-200",
                isActive
                  ? "bg-brand text-white shadow-md shadow-blue-100"
                  : "text-text-sub hover:bg-bg-sub hover:text-text-main"
              )}
            >
              <item.icon
                size={20}
                className={isActive ? "opacity-100" : "opacity-70"}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
