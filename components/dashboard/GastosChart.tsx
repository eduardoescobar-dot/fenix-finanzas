"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { gastosMensuales, gastosPorCategoria } from "@/lib/data/sheets-data";

function formatEUR(value: number) {
  return `€ ${value.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

const PIE_COLORS = [
  "#f97316",
  "#fb923c",
  "#fdba74",
  "#c2410c",
  "#ea580c",
  "#9a3412",
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name?: string }>;
  label?: string;
}

function AreaTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-white/[0.08] bg-[#1a1a25] px-3 py-2 shadow-xl">
        <p className="text-xs font-medium text-white/60">{label}</p>
        <p className="mt-0.5 text-sm font-bold text-orange-400">
          {formatEUR(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
}

function PieTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-white/[0.08] bg-[#1a1a25] px-3 py-2 shadow-xl">
        <p className="text-xs font-medium text-white/60">{payload[0].name}</p>
        <p className="mt-0.5 text-sm font-bold text-orange-400">
          {formatEUR(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
}

export function GastosTrendChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={gastosMensuales}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="gastoGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.04)"
          vertical={false}
        />
        <XAxis
          dataKey="mes"
          tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          dy={8}
        />
        <YAxis
          tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `€${v}`}
          width={52}
        />
        <Tooltip content={<AreaTooltip />} />
        <Area
          type="monotone"
          dataKey="total"
          stroke="#f97316"
          strokeWidth={2}
          fill="url(#gastoGradient)"
          dot={false}
          activeDot={{ r: 4, fill: "#f97316", strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function CategoriasPieChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={gastosPorCategoria}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={3}
          dataKey="total"
          nameKey="categoria"
        >
          {gastosPorCategoria.map((entry, index) => (
            <Cell
              key={entry.categoria}
              fill={PIE_COLORS[index % PIE_COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip content={<PieTooltip />} />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => (
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px" }}>
              {value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
