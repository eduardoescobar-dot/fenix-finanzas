import {
  CreditCard,
  TrendingUp,
  BarChart3,
  Layers,
  Users,
  Megaphone,
  AlertCircle,
  ShoppingBag,
  ArrowUpRight,
} from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import {
  GastosTrendChart,
  CategoriasPieChart,
} from "@/components/dashboard/GastosChart";
import {
  IngresosTendenciaChart,
  IngresosAnioChart,
} from "@/components/dashboard/IngresosChart";
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
    supabase.from("campanas_marketing").select("total_invertido,ingresos,tipo,fecha,nombre"),
    supabase.from("integrantes").select("salario_mensual,activo"),
    supabase.from("pagos_nomina").select("monto"),
    supabase.from("gastos_personales").select("monto,fecha"),
  ]);

  // ── Suscripciones KPIs ──────────────────────────────────────
  const allSuscs = suscs ?? [];
  const activas = allSuscs.filter((s) => s.estado === "ACTIVA");
  const canceladas = allSuscs.filter((s) => s.estado === "PAUSADA");
  const inversionMensual = activas.reduce((s, x) => s + x.costo_mensual, 0);
  const prescindibles = activas.filter(
    (s) => s.necesidad === "PRESCINDIBLE" || s.necesidad === "INECESARIO"
  );

  const topHerramientas = [...activas]
    .sort((a, b) => b.costo_mensual - a.costo_mensual)
    .slice(0, 5);

  const categorias = ["Comunicación", "Marketing", "IA", "Operaciones", "Ventas", "Diseño", "Tech"];
  const catMap: Record<string, string> = {
    COMUNICACION: "Comunicación", MARKETING: "Marketing", IA: "IA",
    OPERACIONES: "Operaciones", VENTAS: "Ventas", DISEÑO: "Diseño", TECH: "Tech",
  };
  const catColors: Record<string, string> = {
    Comunicación: "#f97316", Marketing: "#fb923c", IA: "#fdba74",
    Operaciones: "#fed7aa", Ventas: "#fcd34d", Diseño: "#f0abfc", Tech: "#38bdf8",
  };
  const gastosPorCategoria = categorias.map((cat) => ({
    categoria: cat,
    color: catColors[cat],
    total: activas.filter((s) => catMap[s.categoria] === cat).reduce((s, x) => s + x.costo_mensual, 0),
  }));

  // ── Ingresos (from campanas_marketing income rows) ───────────
  const allCampanas = campanas ?? [];
  const ingresoRows = allCampanas.filter(
    (c) => ["COMISION_2024", "ZELLE_SPARTANS_2024", "STRIPE_PAYOUT"].includes(c.tipo) && c.ingresos > 0
  );
  const total2024 = ingresoRows
    .filter((r) => r.fecha && new Date(r.fecha).getFullYear() === 2024)
    .reduce((s, r) => s + r.ingresos, 0);
  const total2025 = ingresoRows
    .filter((r) => r.fecha && new Date(r.fecha).getFullYear() === 2025)
    .reduce((s, r) => s + r.ingresos, 0);
  const totalIngresos = total2024 + total2025;
  const growth = total2024 > 0 ? ((total2025 - total2024) / total2024 * 100).toFixed(1) : "0";

  // Monthly income chart data
  const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  const monthly2024 = Array(12).fill(0);
  const monthly2025 = Array(12).fill(0);
  ingresoRows.forEach((r) => {
    if (!r.fecha) return;
    const d = new Date(r.fecha);
    const m = d.getMonth();
    if (d.getFullYear() === 2024) monthly2024[m] += r.ingresos;
    if (d.getFullYear() === 2025) monthly2025[m] += r.ingresos;
  });
  const tendenciaData = meses.map((mes, idx) => ({
    mes,
    "2024": Math.round(monthly2024[idx]),
    "2025": Math.round(monthly2025[idx]),
  }));
  const comisiones2024 = ingresoRows.filter((r) => r.tipo === "COMISION_2024").reduce((s, r) => s + r.ingresos, 0);
  const zelle2024 = ingresoRows.filter((r) => r.tipo === "ZELLE_SPARTANS_2024").reduce((s, r) => s + r.ingresos, 0);
  const stripe2025 = ingresoRows.filter((r) => r.tipo === "STRIPE_PAYOUT").reduce((s, r) => s + r.ingresos, 0);
  const anioData = [
    { año: "2024", comisiones: Math.round(comisiones2024), zelle: Math.round(zelle2024), stripe: 0 },
    { año: "2025", comisiones: 0, zelle: 0, stripe: Math.round(stripe2025) },
  ];

  // ── Marketing KPIs ───────────────────────────────────────────
  const mktCampanas = allCampanas.filter(
    (c) => !["COMISION_2024", "ZELLE_SPARTANS_2024", "STRIPE_PAYOUT"].includes(c.tipo)
  );
  const totalInvertidoMkt = mktCampanas.reduce((s, c) => s + c.total_invertido, 0);

  // ── Nóminas KPIs ────────────────────────────────────────────
  const allIntegrantes = integrantes ?? [];
  const activosEquipo = allIntegrantes.filter((i) => i.activo);
  const pagoMensualNominas = activosEquipo.reduce((s, i) => s + i.salario_mensual, 0);
  const totalPagadoNominas = (pagos ?? []).reduce((s, p) => s + p.monto, 0);

  // ── Gastos Personales ────────────────────────────────────────
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const gpAll = gastosPersonales ?? [];
  const gpMes = gpAll.filter((g) => g.fecha?.substring(0, 7) === currentMonth);
  const totalGastoPersonalMes = gpMes.reduce((s, g) => s + g.monto, 0);

  // Monthly trend for GastosTrendChart (gastos personales grouped by month)
  const MESES_LABELS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  const monthlyMap: Record<string, number> = {};
  gpAll.forEach((g) => {
    if (g.fecha) {
      const key = g.fecha.substring(0, 7);
      monthlyMap[key] = (monthlyMap[key] ?? 0) + g.monto;
    }
  });
  const gastosTrendData = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-10)
    .map(([month, total]) => {
      const [year, m] = month.split("-");
      return { mes: `${MESES_LABELS[parseInt(m) - 1]} ${year}`, total: Math.round(total) };
    });

  return (
    <div className="flex flex-col gap-6 p-6 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          <p className="mt-0.5 text-sm text-white/40">Resumen financiero · Fénix Academy</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-[#111118] px-3 py-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
          <span className="text-xs text-white/50">Datos en tiempo real</span>
        </div>
      </div>

      {/* ── INGRESOS SECTION ──────────────────────────────────── */}
      <div className="rounded-xl border border-emerald-500/10 bg-gradient-to-br from-emerald-500/5 to-transparent p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">Ingresos Totales</h2>
            <p className="text-xs text-white/40">2024 + 2025 · Auditoría fiscal Fénix Academy</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2.5 py-1 ring-1 ring-emerald-500/20">
            <ArrowUpRight className="h-3 w-3 text-emerald-400" />
            <span className="text-[11px] font-semibold text-emerald-400">+{growth}% vs 2024</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
            <p className="text-[10px] font-medium uppercase tracking-wider text-white/40">Total General</p>
            <p className="mt-1.5 text-2xl font-bold text-emerald-400">{fmt(totalIngresos)}</p>
            <p className="mt-1 text-[11px] text-white/30">{ingresoRows.length} transacciones</p>
          </div>
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="text-[10px] font-medium uppercase tracking-wider text-white/40">2024</p>
            <p className="mt-1.5 text-2xl font-bold text-white">{fmt(total2024)}</p>
            <p className="mt-1 text-[11px] text-white/30">Raúl Luna + Spartans</p>
          </div>
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="text-[10px] font-medium uppercase tracking-wider text-white/40">2025</p>
            <p className="mt-1.5 text-2xl font-bold text-white">{fmt(total2025)}</p>
            <p className="mt-1 text-[11px] text-white/30">Stripe · Fénix Academy</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-medium text-white/40">Tendencia mensual 2024 vs 2025</p>
            <div className="h-44">
              <IngresosTendenciaChart data={tendenciaData} />
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-white/40">Ingresos por año y fuente</p>
            <div className="h-44">
              <IngresosAnioChart data={anioData} />
            </div>
          </div>
        </div>
      </div>

      {/* ── GASTOS KPIs ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KPICard
          title="Inversión SaaS/mes"
          value={fmt(inversionMensual)}
          subtitle={`${activas.length} activas · ${canceladas.length} pausadas`}
          icon={CreditCard}
          accent
        />
        <KPICard
          title="Nómina Mensual"
          value={fmt(pagoMensualNominas)}
          subtitle={`${activosEquipo.length} miembros activos`}
          icon={Users}
        />
        <KPICard
          title="Nómina Total Pagada"
          value={fmt(totalPagadoNominas)}
          subtitle="Histórico acumulado"
          icon={BarChart3}
        />
        <KPICard
          title="Prescindibles"
          value={`${prescindibles.length}`}
          subtitle="Candidatas a cancelar"
          icon={AlertCircle}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KPICard
          title="Total Herramientas"
          value={`${allSuscs.length}`}
          subtitle={`${activas.length} activas`}
          icon={Layers}
        />
        <KPICard
          title="Marketing Invertido"
          value={fmt(totalInvertidoMkt)}
          subtitle="Campañas activas"
          icon={Megaphone}
        />
        <KPICard
          title="G. Personales este mes"
          value={fmt(totalGastoPersonalMes)}
          subtitle={`${gpMes.length} gastos registrados`}
          icon={ShoppingBag}
        />
        <KPICard
          title="Ingresos 2025"
          value={fmt(total2025)}
          subtitle={`↑${growth}% vs año anterior`}
          icon={TrendingUp}
          accent
        />
      </div>

      {/* ── GASTOS CHARTS ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-white/[0.06] bg-[#111118] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">Tendencia de gastos mensuales</h2>
              <p className="text-xs text-white/40">Últimos 10 meses · Herramientas SaaS</p>
            </div>
            <span className="rounded-md bg-orange-500/10 px-2 py-0.5 text-[11px] font-medium text-orange-400 ring-1 ring-orange-500/20">
              SaaS
            </span>
          </div>
          <div className="h-52">
            <GastosTrendChart data={gastosTrendData} />
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-white">Gasto por categoría</h2>
            <p className="text-xs text-white/40">Distribución mensual activas</p>
          </div>
          <div className="h-52">
            <CategoriasPieChart data={gastosPorCategoria} />
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">Top herramientas por costo</h2>
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

        <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">Desglose mensual por categoría</h2>
          <div className="flex flex-col gap-1">
            {gastosPorCategoria.filter((c) => c.total > 0).map((cat) => (
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
