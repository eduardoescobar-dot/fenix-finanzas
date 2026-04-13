import {
  CreditCard,
  TrendingUp,
  BarChart3,
  Layers,
  Users,
  Megaphone,
  AlertCircle,
} from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import {
  GastosTrendChart,
  CategoriasPieChart,
} from "@/components/dashboard/GastosChart";
import {
  kpis,
  marketingKpis,
  nominasKpis,
  suscripciones,
  gastosPorCategoria,
} from "@/lib/data/sheets-data";

function formatEUR(value: number) {
  return `€ ${value.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

const prescindibles = suscripciones.filter(
  (s) =>
    s.estado === "ACTIVO" &&
    (s.necesidad === "PRESCINDIBLE" || s.necesidad === "INECESARIO")
);

const topHerramientas = suscripciones
  .filter((s) => s.estado === "ACTIVO")
  .sort((a, b) => b.costoMensual - a.costoMensual)
  .slice(0, 5);

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-6 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          <p className="mt-0.5 text-sm text-white/40">
            Resumen financiero · Fénix Academy
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-[#111118] px-3 py-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
          <span className="text-xs text-white/50">Actualizado hoy</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KPICard
          title="Inversión Mensual"
          value={formatEUR(kpis.inversionMensual)}
          subtitle="Herramientas activas"
          icon={CreditCard}
          accent
        />
        <KPICard
          title="Inversión General"
          value={formatEUR(kpis.inversionGeneral)}
          subtitle="Pagos periódicos totales"
          icon={BarChart3}
        />
        <KPICard
          title="Total Histórico"
          value={formatEUR(kpis.inversionTotalHistorica)}
          subtitle="Desde el inicio"
          icon={TrendingUp}
        />
        <KPICard
          title="Herramientas"
          value={`${kpis.totalAplicaciones}`}
          subtitle={`${kpis.totalAplicacionesActivas} activas · ${kpis.totalAplicacionesCanceladas} canceladas`}
          icon={Layers}
        />
      </div>

      {/* Second row KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <KPICard
          title="Nóminas Mensuales"
          value={formatEUR(nominasKpis.pagoMensualTotal)}
          subtitle="Total equipo"
          icon={Users}
        />
        <KPICard
          title="Invertido en Marketing"
          value={formatEUR(marketingKpis.totalInvertido)}
          subtitle="ROAS: 0x — sin retorno aún"
          icon={Megaphone}
        />
        <KPICard
          title="Herramientas Prescindibles"
          value={`${prescindibles.length}`}
          subtitle="Candidatas a cancelar"
          icon={AlertCircle}
          className="lg:col-span-1"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Area chart — spans 2 cols */}
        <div className="lg:col-span-2 rounded-xl border border-white/[0.06] bg-[#111118] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Tendencia de gastos mensuales
              </h2>
              <p className="text-xs text-white/40">
                Últimos 10 meses · Herramientas SaaS
              </p>
            </div>
            <span className="rounded-md bg-orange-500/10 px-2 py-0.5 text-[11px] font-medium text-orange-400 ring-1 ring-orange-500/20">
              SaaS
            </span>
          </div>
          <div className="h-52">
            <GastosTrendChart />
          </div>
        </div>

        {/* Pie chart */}
        <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-white">
              Gasto por categoría
            </h2>
            <p className="text-xs text-white/40">Distribución mensual</p>
          </div>
          <div className="h-52">
            <CategoriasPieChart />
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Top herramientas */}
        <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">
            Top herramientas por costo
          </h2>
          <div className="flex flex-col gap-2">
            {topHerramientas.map((h, i) => {
              const maxCosto = topHerramientas[0].costoMensual;
              const pct = Math.round((h.costoMensual / maxCosto) * 100);
              return (
                <div key={h.nombre} className="flex items-center gap-3">
                  <span className="w-4 text-right text-[10px] font-medium text-white/30">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-white/80 truncate">
                        {h.nombre}
                      </span>
                      <span className="ml-2 shrink-0 text-xs font-semibold text-white">
                        {formatEUR(h.costoMensual)}
                      </span>
                    </div>
                    <div className="h-1 w-full rounded-full bg-white/[0.06]">
                      <div
                        className="h-1 rounded-full bg-orange-500 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desglose por categoría tabla */}
        <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">
            Desglose mensual por categoría
          </h2>
          <div className="flex flex-col gap-1">
            {gastosPorCategoria.map((cat) => (
              <div
                key={cat.categoria}
                className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-white/[0.03] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-sm text-white/70">{cat.categoria}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/30">
                    {Math.round((cat.total / kpis.inversionMensual) * 100)}%
                  </span>
                  <span className="w-20 text-right text-sm font-semibold text-white">
                    {formatEUR(cat.total)}
                  </span>
                </div>
              </div>
            ))}
            <div className="mt-2 flex items-center justify-between rounded-lg border-t border-white/[0.06] px-3 pt-3">
              <span className="text-sm font-semibold text-white/60">Total</span>
              <span className="text-sm font-bold text-orange-400">
                {formatEUR(kpis.inversionMensual)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
