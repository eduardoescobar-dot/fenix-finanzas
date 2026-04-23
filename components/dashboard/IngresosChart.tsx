"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function fmtK(value: number) {
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
  return `$${value}`;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name?: string; color?: string }>;
  label?: string;
}

function DarkTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/[0.08] bg-[#1a1a25] px-3 py-2 shadow-xl">
      <p className="mb-1.5 text-xs font-medium text-white/50">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs font-semibold" style={{ color: p.color }}>
          {p.name}: ${Number(p.value).toLocaleString("es-ES", { minimumFractionDigits: 0 })}
        </p>
      ))}
    </div>
  );
}

type TendenciaRow = { mes: string; "2024": number; "2025": number };
type AnioRow = { año: string; comisiones: number; zelle: number; stripe: number };

export function IngresosTendenciaChart({ data }: { data: TendenciaRow[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="grad2024" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="grad2025" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis
          dataKey="mes"
          tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          dy={6}
        />
        <YAxis
          tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={fmtK}
          width={46}
        />
        <Tooltip content={<DarkTooltip />} />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(v) => (
            <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "11px" }}>{v}</span>
          )}
        />
        <Area
          type="monotone"
          dataKey="2024"
          stroke="#a855f7"
          strokeWidth={2}
          fill="url(#grad2024)"
          dot={false}
          activeDot={{ r: 3, strokeWidth: 0 }}
        />
        <Area
          type="monotone"
          dataKey="2025"
          stroke="#22c55e"
          strokeWidth={2}
          fill="url(#grad2025)"
          dot={false}
          activeDot={{ r: 3, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function IngresosAnioChart({ data }: { data: AnioRow[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barSize={40}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis
          dataKey="año"
          tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={fmtK}
          width={46}
        />
        <Tooltip content={<DarkTooltip />} />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(v) => (
            <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "11px" }}>{v}</span>
          )}
        />
        <Bar dataKey="comisiones" name="Comisiones RL" stackId="a" fill="#a855f7" radius={[0, 0, 0, 0]} />
        <Bar dataKey="zelle" name="Zelle Spartans" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
        <Bar dataKey="stripe" name="Stripe Payouts" stackId="a" fill="#22c55e" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
