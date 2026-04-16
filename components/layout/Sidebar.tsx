"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  Megaphone,
  Users,
  FileBarChart,
  Flame,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  TrendingUp,
  Plane,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard",    href: "/",                  icon: LayoutDashboard },
  { label: "Ingresos",     href: "/ingresos",           icon: TrendingUp      },
  { label: "Suscripciones",href: "/suscripciones",      icon: CreditCard      },
  { label: "Marketing",    href: "/marketing",          icon: Megaphone       },
  { label: "Nóminas",      href: "/nominas",            icon: Users           },
  { label: "G. Personales",href: "/gastos-personales",  icon: ShoppingBag     },
  { label: "Vuelos",       href: "/vuelos",             icon: Plane           },
  { label: "Reportes",     href: "/reportes",           icon: FileBarChart    },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "relative flex h-screen flex-col border-r border-white/[0.06] bg-[#0d0d14] transition-all duration-300 ease-in-out",
        collapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex h-16 items-center border-b border-white/[0.06] px-4",
          collapsed ? "justify-center" : "gap-3"
        )}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/20 ring-1 ring-orange-500/40">
          <Flame className="h-4 w-4 text-orange-500" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="truncate text-sm font-semibold text-white">Fénix Finanzas</p>
            <p className="truncate text-[10px] text-white/40">Fénix Academy</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-all duration-150",
                collapsed ? "justify-center px-2" : "",
                isActive
                  ? "bg-orange-500/15 text-orange-400 ring-1 ring-orange-500/20"
                  : "text-white/50 hover:bg-white/[0.04] hover:text-white/80"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive ? "text-orange-400" : "text-white/40 group-hover:text-white/70"
                )}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="border-t border-white/[0.06] p-4">
          <div className="rounded-lg bg-orange-500/10 p-3 ring-1 ring-orange-500/20">
            <p className="text-[11px] font-medium text-orange-400">Inversión mensual</p>
            <p className="mt-0.5 text-base font-bold text-white">€ 383,28</p>
            <p className="mt-1 text-[10px] text-white/40">14 herramientas activas</p>
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[72px] flex h-6 w-6 items-center justify-center rounded-full border border-white/[0.08] bg-[#0d0d14] text-white/40 shadow-lg transition-colors hover:text-white/80"
        aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </aside>
  );
}
