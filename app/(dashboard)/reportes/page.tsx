import { createClient } from "@/lib/supabase/server";
import { FileBarChart, Download, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

function fmt(value: number) {
  return `$ ${value.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default async function ReportesPage() {
  const supabase = await createClient();

  const [
    { data: suscs },
    { data: campanas },
    { data: integrantes },
    { data: pagos },
  ] = await Promise.all([
    supabase.from("suscripciones").select("*"),
    supabase.from("campanas_marketing").select("*"),
    supabase.from("integrantes").select("*"),
    supabase.from("pagos_nomina").select("monto"),
  ]);

  const allSuscs = suscs ?? [];
  const activas = allSuscs.filter((s) => s.estado === "ACTIVA");

  const inversionMensual = activas.reduce((s, x) => s + x.costo_mensual, 0);
  const inversionHistorica = allSuscs.reduce((s, x) => s + (x.costo_acumulado ?? 0), 0);

  const prescindibles = activas.filter((s) => s.necesidad === "PRESCINDIBLE");
  const inecesarias = activas.filter((s) => s.necesidad === "INECESARIO");
  const enEvaluacion = activas.filter((s) => s.necesidad === "EN EVALUACION");
  const ahorrosPotenciales =
    prescindibles.reduce((s, x) => s + x.costo_mensual, 0) +
    inecesarias.reduce((s, x) => s + x.costo_mensual, 0);

  const allCampanas = campanas ?? [];
  const totalInvertidoMkt = allCampanas.reduce((s, c) => s + c.total_invertido, 0);

  const allIntegrantes = integrantes ?? [];
  const activosEquipo = allIntegrantes.filter((i) => i.activo);
  const pagoMensualNominas = activosEquipo.reduce((s, i) => s + i.salario_mensual, 0);
  const totalPagadoNominas = (pagos ?? []).reduce((s, p) => s + p.monto, 0);

  const gastoTotalMensual = inversionMensual + pagoMensualNominas + totalInvertidoMkt;

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
  })).filter((c) => c.total > 0);

  return (
    <div className="flex flex-col gap-6 p-6 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Reportes</h1>
          <p className="mt-0.5 text-sm text-white/40">Resumen financiero y análisis de la operación</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/60 transition-all hover:bg-white/[0.07] hover:text-white/80">
          <Download className="h-3.5 w-3.5" />
          Exportar PDF
        </button>
      </div>

      {/* Period badge */}
      <div className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-[#111118] px-4 py-3">
        <FileBarChart className="h-4 w-4 text-orange-400" />
        <p className="text-sm text-white/70">
          Reporte del período:{" "}
          <span className="font-semibold text-white">Jul 2025 – Abr 2026</span>
        </p>
        <span className="ml-auto rounded-full bg-orange-500/10 px-2 py-0.5 text-[11px] font-medium text-orange-400 ring-1 ring-orange-500/20">
          10 meses
        </span>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-transparent p-5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">Gasto operativo mensual</p>
          <p className="mt-2 text-3xl font-bold text-orange-400">{fmt(gastoTotalMensual)}</p>
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-white/40">Herramientas SaaS</span>
              <span className="text-white/70">{fmt(inversionMensual)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/40">Nóminas</span>
              <span className="text-white/70">{fmt(pagoMensualNominas)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/40">Marketing</span>
              <span className="text-white/70">{fmt(totalInvertidoMkt)}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">Inversión histórica total</p>
          <p className="mt-2 text-3xl font-bold text-white">{fmt(inversionHistorica + totalPagadoNominas)}</p>
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-white/40">SaaS histórico</span>
              <span className="text-white/70">{fmt(inversionHistorica)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/40">Nóminas históricas</span>
              <span className="text-white/70">{fmt(totalPagadoNominas)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/40">Marketing histórico</span>
              <span className="text-white/70">{fmt(totalInvertidoMkt)}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">Ahorros potenciales/mes</p>
          <p className="mt-2 text-3xl font-bold text-yellow-400">{fmt(ahorrosPotenciales)}</p>
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-white/40">Prescindibles ({prescindibles.length})</span>
              <span className="text-yellow-400/70">{fmt(prescindibles.reduce((s, h) => s + h.costo_mensual, 0))}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/40">Inecesarias ({inecesarias.length})</span>
              <span className="text-yellow-400/70">{fmt(inecesarias.reduce((s, h) => s + h.costo_mensual, 0))}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/40">En evaluación ({enEvaluacion.length})</span>
              <span className="text-white/40">{fmt(enEvaluacion.reduce((s, h) => s + h.costo_mensual, 0))}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two-column */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Stack análisis */}
        <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">Análisis del stack de herramientas</h2>
          <div className="space-y-3">
            {gastosPorCategoria.map((cat) => {
              const pct = inversionMensual > 0 ? Math.round((cat.total / inversionMensual) * 100) : 0;
              return (
                <div key={cat.categoria}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-white/60">{cat.categoria}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white/35">{pct}%</span>
                      <span className="font-semibold text-white">{fmt(cat.total)}</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/[0.06]">
                    <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: cat.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Equipo */}
        <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">Estado del equipo</h2>
          <div className="space-y-3">
            {allIntegrantes.map((n) => (
              <div key={n.nombre} className={cn("flex items-center justify-between rounded-lg px-3 py-2.5", n.activo ? "bg-white/[0.03]" : "bg-white/[0.01] opacity-50")}>
                <div className="flex items-center gap-3">
                  {n.activo ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <div className="h-3.5 w-3.5 rounded-full border border-white/20" />}
                  <div>
                    <p className="text-xs font-semibold text-white">{n.nombre}</p>
                    <p className="text-[10px] text-white/40">{n.rol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-white">{fmt(n.salario_mensual)}<span className="font-normal text-white/30">/mes</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alertas */}
      <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-5">
        <h2 className="mb-4 text-sm font-semibold text-white">Alertas y recomendaciones</h2>
        <div className="space-y-3">
          {prescindibles.length > 0 && (
            <div className="flex items-start gap-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-400" />
              <div>
                <p className="text-sm font-medium text-yellow-300">{prescindibles.length} herramienta{prescindibles.length > 1 ? "s" : ""} marcada{prescindibles.length > 1 ? "s" : ""} como PRESCINDIBLE</p>
                <p className="mt-0.5 text-xs text-white/45">{prescindibles.map((h) => h.nombre).join(", ")} — ahorro potencial de {fmt(prescindibles.reduce((s, h) => s + h.costo_mensual, 0))}/mes</p>
              </div>
            </div>
          )}
          {enEvaluacion.length > 0 && (
            <div className="flex items-start gap-3 rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
              <div>
                <p className="text-sm font-medium text-orange-300">{enEvaluacion.length} herramienta{enEvaluacion.length > 1 ? "s" : ""} en evaluación</p>
                <p className="mt-0.5 text-xs text-white/45">{enEvaluacion.map((h) => h.nombre).join(", ")} — pendiente de decisión</p>
              </div>
            </div>
          )}
          <div className="flex items-start gap-3 rounded-lg border border-sky-500/20 bg-sky-500/5 p-4">
            <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
            <div>
              <p className="text-sm font-medium text-sky-300">Marketing sin retorno registrado aún</p>
              <p className="mt-0.5 text-xs text-white/45">Twilio activo desde 01/04/2026. Monitorizar leads y conversiones.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            <div>
              <p className="text-sm font-medium text-emerald-300">Stack de alto uso bien justificado</p>
              <p className="mt-0.5 text-xs text-white/45">{activas.filter((s) => s.uso === "ALTO").length} herramientas con uso ALTO clasificadas como necesarias o soporte operativo.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla consolidada */}
      <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-5">
        <h2 className="mb-4 text-sm font-semibold text-white">Resumen financiero consolidado</h2>
        <div className="space-y-0">
          {[
            { label: "Herramientas SaaS activas", mensual: inversionMensual, historico: inversionHistorica, note: `${activas.length} herramientas activas` },
            { label: "Nóminas del equipo", mensual: pagoMensualNominas, historico: totalPagadoNominas, note: `${activosEquipo.length} personas activas` },
            { label: "Inversión en marketing", mensual: totalInvertidoMkt, historico: totalInvertidoMkt, note: `${allCampanas.length} campaña${allCampanas.length !== 1 ? "s" : ""}` },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between border-b border-white/[0.04] py-3 last:border-0">
              <div>
                <p className="text-sm text-white/80">{row.label}</p>
                <p className="text-[11px] text-white/35">{row.note}</p>
              </div>
              <div className="flex items-center gap-8 text-right">
                <div>
                  <p className="text-[10px] text-white/30">Mensual</p>
                  <p className="text-sm font-semibold text-white">{fmt(row.mensual)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/30">Histórico</p>
                  <p className="text-sm font-semibold text-orange-400">{fmt(row.historico)}</p>
                </div>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between pt-3">
            <p className="text-sm font-bold text-white">Total operativo mensual</p>
            <p className="text-lg font-bold text-orange-400">{fmt(gastoTotalMensual)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
