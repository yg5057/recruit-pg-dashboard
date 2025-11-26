"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  CreditCard,
  Store,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: "대시보드", href: "/", icon: LayoutDashboard },
    { name: "거래 내역", href: "/transactions", icon: CreditCard },
    { name: "가맹점 관리", href: "/merchants", icon: Store },
  ];

  return (
    <aside
      data-collapsed={isCollapsed}
      className={cn(
        "peer bg-bg-surface border-r border-border h-screen fixed left-0 top-0 flex flex-col z-50 shadow-sm transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div
        className={cn(
          "flex h-20 items-center transition-all",
          isCollapsed ? "justify-center px-0" : "gap-3 px-8"
        )}
      >
        <Image
          src="/logo.svg"
          alt="PG Dashboard Logo"
          width={32}
          height={32}
          className="shrink-0"
        />
        {!isCollapsed && (
          <h1 className="whitespace-nowrap text-xl font-bold tracking-tight text-text-main overflow-hidden">
            PG Dashboard<span className="text-brand">.</span>
          </h1>
        )}
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 py-3.5 rounded-md text-[15px] font-medium transition-all duration-200",
                isCollapsed
                  ? "justify-center w-full px-0"
                  : "justify-start w-full px-4",
                isActive
                  ? "bg-brand text-white shadow-md shadow-blue-100"
                  : "text-text-sub hover:bg-bg-sub hover:text-text-main"
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon
                size={20}
                className={cn(
                  "shrink-0",
                  isActive ? "opacity-100" : "opacity-70"
                )}
              />

              {!isCollapsed && (
                <span className="whitespace-nowrap overflow-hidden transition-opacity duration-200">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border flex justify-end">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "flex items-center justify-center rounded-lg text-text-sub hover:bg-bg-sub hover:text-text-main transition-colors cursor-pointer",
            isCollapsed ? "w-full py-3" : "p-2"
          )}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </aside>
  );
}
