import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  accent?: boolean;
  className?: string;
}

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accent = false,
  className,
}: KPICardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#111118] p-5 transition-all duration-200 hover:border-white/[0.1] hover:bg-[#14141d]",
        accent &&
          "border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-transparent",
        className
      )}
    >
      {/* Background glow for accent cards */}
      {accent && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent" />
      )}

      <div className="relative flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-white/40">
            {title}
          </p>
          <p
            className={cn(
              "mt-2 text-2xl font-bold tracking-tight",
              accent ? "text-orange-400" : "text-white"
            )}
          >
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-white/40">{subtitle}</p>
          )}
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className={cn(
                  "text-xs font-medium",
                  trend.positive ? "text-emerald-400" : "text-red-400"
                )}
              >
                {trend.value}
              </span>
            </div>
          )}
        </div>

        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            accent
              ? "bg-orange-500/20 ring-1 ring-orange-500/30"
              : "bg-white/[0.06] ring-1 ring-white/[0.06]"
          )}
        >
          <Icon
            className={cn(
              "h-5 w-5",
              accent ? "text-orange-400" : "text-white/50"
            )}
          />
        </div>
      </div>
    </div>
  );
}
