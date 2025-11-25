"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "대시보드" },
  { href: "/transactions", label: "거래 내역" },
  { href: "/merchants", label: "가맹점" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-60 border-r bg-white px-4 py-6 md:flex md:flex-col">
      <div className="mb-6">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Allphaze PG
        </span>
        <h1 className="mt-1 text-lg font-bold">Payment Dashboard</h1>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-gray-900 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 text-xs text-gray-400">
        <p>㈜올페이즈 프론트엔드 채용 과제</p>
      </div>
    </aside>
  );
}
