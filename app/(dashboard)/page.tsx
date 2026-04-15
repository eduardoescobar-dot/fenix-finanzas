import {
  CreditCard,
  TrendingUp,
  BarChart3,
  Layers,
  Users,
  Megaphone,
  AlertCircle,
  ShoppingBag,
} from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import {
  GastosTrendChart,
  CategoriasPieChart,
} from "@/components/dashboard/GastosChart";
import { createClient } from "@/lib/supabase/server";

function fmt(value: number) {
  return `$ ${value.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const [
    { data: suscs },
    { data: campanas },
    { data: integrantes },
    { data: pagos },
    { data: gastosPersonales },
  ] = await Promise.all([
    supabase.from("suscripciones").select("nombre,costo_mensual,estado,necesidad,categoria"),
    supabase.from("campanas_marketing").select("total_invertido,ingresos"),
    supabase.from("integrantes").select("salario_mensual,activo"),
    supabase.from("pagos_nomina").select("monto"),
    supabase.from("gastos_personales").select("monto,fecha"),
  ]);

  // ── Suscripciones KPIs ──────────────────────────────────────
  const allSuscs = suscs ?? [];
  const activas = allSuscs.filter((s) => s.estado === "ACTIVO");
  const canceladas = allSuscs.filter((s) => s.estado === "CANCELADO");
  const inversionMensual = activas.reduce((s, x) => s + x.costo_mensual, 0);
  const prescindibles = activas.filter(
    (s) => s.necesidad === "PRESCINDIBLE" || s.necesidad === "INECESARIO"
  );

  // Top 5 por costo mensual
  const topHerramientas = [...activas]
    .sort((a, b) => b.costo_mensual - a.costo_mensual)
    .slice(0, 5);

  // Gasto por categoría
  const categorias = ["Comunicación", "Marketing", "IA", "Operaciones", "Ventas", "Diseño"];
  const catMap: Record<string, string> = {
    COMUNICACION: "Comunicación", MARKETING: "Marketing", IA: "IA",
    OPERACIONES: "Operaciones", VENTAS: "Ventas", DISEÑO: "Diseño",
  };
  const catColors: Record<string, string> = {
    Comunicación: "#f97316", Marketing: "#fb923c", IA: "#fdba74",
    Operaciones: "#fed7aa", Ventas: "#ffedd5", Diseño: "#fff7ed",
  };
  const gastosPorCategoria = categorias.map((cat) => ({
    categoria: cat,
    color: catColors[cat],
    total: activas.filter((s) => catMap[s.categoria] === cat).reduce((s, x) => s + x.costo_mensual, 0),
  }));

  // ── Marketing KPIs ───────────────────────────────────────────
  const allCampanas = campanas ?? [];
  const totalInvertidoMkt = allCampanas.reduce((s, c) => s + c.total_invertido, 0);
  const totalIngresosMkt = allCampanas.reduce((s, c) => s + c.ingresos, 0);
  const roas = totalInvertidoMkt > 0 ? (totalIngresosMkt / totalInvertidoMkt).toFixed(2) : "0.00";

  // ── Nóminas KPIs ────────────────────────────────────────────
  const allIntegrantes = integrantes ?? [];
  const activosEquipo = allIntegrantes.filter((i) => i.activo);
  const pagoMensualNominas = activosEquipo.reduce((s, i) => s + i.salario_mensual, 0);
  const totalPagadoNominas = (pagos ?? []).reduce((s, p) => s + p.monto, 0);

  // ── Gastos Personales KPIs ───────────────────────────────────
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const gpMes = (gastosPersonales ?? []).filter((g) => {
    if (g.fecha.includes("/")) {
      const parts = g.fecha.split("/");
      return `${parts[2]}-${parts[1].padStart(2, "0")}` === currentMonth;
    }
    return g.fecha.substring(0, 7) === currentMonth;
  });
  const totalGastoPersonalMes = gpMes.reduce((s, g) => s + g.monto, 0);

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
          <span className="text-xs text-white/50">Datos en tiempo real</span>
        </div>
      </div>

      {/* KPI Grid — Suscripciones */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KPICard
          title="Inversión Mensual"
          value={fmt(inversionMensual)}
          subtitle="Herramientas activas"
          icon={CreditCard}
          accent
        />
        <KPICard
          title="Total Histórico Pagado"
          value={fmt(totalPagadoNominas)}
          subtitle="Nóminas acumuladas"
          icon={BarChart3}
        />
        <KPICard
          title="Total Herramientas"
          value={`${allSuscs.length}`}
          subtitle={`${activas.length} activas · ${canceladas.length} canceladas`}
          icon={Layers}
        />
        <KPICard
          title="Prescindibles"
          value={`${prescindibles.length}`}
          subtitle="Candidatas a cancelar"
          icon={AlertCircle}
        />
      </div>

      {/* Second row KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KPICard
          title="Nóminas Mensuales"
          value={fmt(pagoMensualNominas)}
          subtitle={`${activosEquipo.length} miembros activos`}
          icon={Users}
        />
        <KPICard
          title="Marketing Invertido"
          value={fmt(totalInvertidoMkt)}
          subtitle={`ROAS: ${roas}x`}
          icon={Megaphone}
        />
        <KPICard
          title="G. Personales este mes"
          value={fmt(totalGastoPersonalMes)}
          subtitle={`${gpMes.length} gasto${gpMes.length !== 1 ? "s" : ""} registrados`}
          icon={ShoppingBag}
        />
        <KPICard
          title="Total Ingresos Mkt"
          value={fmt(totalIngresosMkt)}
          subtitle="Atribuidos a campañas"
          icon={TrendingUp}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
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

        <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-white">
              Gasto por categoría
            </h2>
            <p className="text-xs text-white/40">Distribución mensual activas</p>
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
            {topHerramientas.length === 0 && (
              <p className="text-sm text-white/30">Sin datos aún</p>
            )}
            {topHerramientas.map((h, i) => {
              const maxCosto = topHerramientas[0].costo_mensual;
              const pct = Math.round((h.costo_mensual / maxCosto) * 100);
              return (
                <div key={h.nombre} className="flex items-center gap-3">
                  <span className="w-4 text-right text-[10px] font-medium text-white/30">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-white/80 truncate">{h.nombre}</span>
                      <span className="ml-2 shrink-0 text-xs font-semibold text-white">{fmt(h.costo_mensual)}</span>
                    </div>
                    <div className="h-1 w-full rounded-full bg-white/[0.06]">
                      <div className="h-1 rounded-full bg-orange-500 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desglose por categoría */}
        <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">
            Desglose mensual por categoría
          </h2>
          <div className="flex flex-col gap-1">
            {gastosPorCategoria.filter(c => c.total > 0).map((cat) => (
              <div key={cat.categoria} className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-white/[0.03] transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-sm text-white/70">{cat.categoria}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/30">
                    {inversionMensual > 0 ? Math.round((cat.total / inversionMensual) * 100) : 0}%
                  </span>
                  <span className="w-20 text-right text-sm font-semibold text-white">{fmt(cat.total)}</span>
                </div>
              </div>
            ))}
            {inversionMensual > 0 && (
              <div className="mt-2 flex items-center justify-between rounded-lg border-t border-white/[0.06] px-3 pt-3">
                <span className="text-sm font-semibold text-white/60">Total</span>
                <span className="text-sm font-bold text-orange-400">{fmt(inversionMensual)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
