import {
  kpis,
  marketingKpis,
  nominasKpis,
  suscripciones,
  gastosPorCategoria,
  nominas,
} from "@/lib/data/sheets-data";
import { FileBarChart, Download, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

function formatEUR(value: number) {
  return `€ ${value.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

const prescindibles = suscripciones.filter(
  (s) => s.estado === "ACTIVO" && s.necesidad === "PRESCINDIBLE"
);
const inecesarias = suscripciones.filter(
  (s) => s.estado === "ACTIVO" && s.necesidad === "INECESARIO"
);
const enEvaluacion = suscripciones.filter(
  (s) => s.estado === "ACTIVO" && s.necesidad === "EN EVALUACION"
);

const ahorrosPotenciales =
  prescindibles.reduce((s, h) => s + h.costoMensual, 0) +
  inecesarias.reduce((s, h) => s + h.costoMensual, 0);

const gastoTotalMensual =
  kpis.inversionMensual + nominasKpis.pagoMensualTotal + marketingKpis.totalInvertido;

export default function ReportesPage() {
  return (
    <div className="flex flex-col gap-6 p-6 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Reportes</h1>
          <p className="mt-0.5 text-sm text-white/40">
            Resumen financiero y análisis de la operación
          </p>
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
          <span className="font-semibold text-white">
            Julio 2025 – Abril 2026
          </span>
        </p>
        <span className="ml-auto rounded-full bg-orange-500/10 px-2 py-0.5 text-[11px] font-medium text-orange-400 ring-1 ring-orange-500/20">
          10 meses
        </span>
      </div>

      {/* Top-level summary */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Gasto total mensual */}
        <div className="rounded-xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-transparent p-5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">
            Gasto operativo mensual total
          </p>
          <p className="mt-2 text-3xl font-bold text-orange-400">
            {formatEUR(gastoTotalMensual)}
          </p>
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-white/40">Herramientas SaaS</span>
              <span className="text-white/70">{formatEUR(kpis.inversionMensual)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/40">Nóminas</span>
              <span className="text-white/70">{formatEUR(nominasKpis.pagoMensualTotal)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/40">Marketing</span>
              <span className="text-white/70">{formatEUR(marketingKpis.totalInvertido)}</span>
            </div>
          </div>
        </div>

        {/* Inversión histórica */}
        <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">
            Inversión histórica total
          </p>
          <p className="mt-2 text-3xl font-bold text-white">
            {formatEUR(kpis.inversionTotalHistorica + nominasKpis.totalPagado)}
          </p>
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-white/40">SaaS histórico</span>
              <span className="text-white/70">{formatEUR(kpis.inversionTotalHistorica)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/40">Nóminas históricas</span>
              <span className="text-white/70">{formatEUR(nominasKpis.totalPagado)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/40">Marketing histórico</span>
              <span className="text-white/70">{formatEUR(marketingKpis.totalInvertido)}</span>
            </div>
          </div>
        </div>

        {/* Ahorros potenciales */}
        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">
            Ahorros potenciales/mes
          </p>
          <p className="mt-2 text-3xl font-bold text-yellow-400">
            {formatEUR(ahorrosPotenciales)}
          </p>
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-white/40">Prescindibles ({prescindibles.length})</span>
              <span className="text-yellow-400/70">
                {formatEUR(prescindibles.reduce((s, h) => s + h.costoMensual, 0))}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/40">Inecesarias ({inecesarias.length})</span>
              <span className="text-yellow-400/70">
                {formatEUR(inecesarias.reduce((s, h) => s + h.costoMensual, 0))}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/40">En evaluación ({enEvaluacion.length})</span>
              <span className="text-white/40">
                {formatEUR(enEvaluacion.reduce((s, h) => s + h.costoMensual, 0))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Two-column section */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Stack análisis */}
        <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">
            Análisis del stack de herramientas
          </h2>
          <div className="space-y-3">
            {gastosPorCategoria.map((cat) => {
              const pct = Math.round((cat.total / kpis.inversionMensual) * 100);
              return (
                <div key={cat.categoria}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-white/60">{cat.categoria}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white/35">{pct}%</span>
                      <span className="font-semibold text-white">
                        {formatEUR(cat.total)}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/[0.06]">
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Equipo status */}
        <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">
            Estado del equipo
          </h2>
          <div className="space-y-3">
            {nominas.map((n) => {
              const isActive = n.fechaInicio !== null;
              return (
                <div
                  key={n.nombre}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-2.5",
                    isActive ? "bg-white/[0.03]" : "bg-white/[0.01] opacity-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {isActive ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <div className="h-3.5 w-3.5 rounded-full border border-white/20" />
                    )}
                    <div>
                      <p className="text-xs font-semibold text-white">{n.nombre}</p>
                      <p className="text-[10px] text-white/40">{n.rol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-white">
                      {formatEUR(n.salarioMensual)}
                      <span className="font-normal text-white/30">/mes</span>
                    </p>
                    {n.totalPagado > 0 && (
                      <p className="text-[10px] text-orange-400">
                        {formatEUR(n.totalPagado)} pagado
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Alerts & recommendations */}
      <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-5">
        <h2 className="mb-4 text-sm font-semibold text-white">
          Alertas y recomendaciones
        </h2>
        <div className="space-y-3">
          {prescindibles.length > 0 && (
            <div className="flex items-start gap-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-400" />
              <div>
                <p className="text-sm font-medium text-yellow-300">
                  {prescindibles.length} herramienta{prescindibles.length > 1 ? "s" : ""} marcada{prescindibles.length > 1 ? "s" : ""} como PRESCINDIBLE
                </p>
                <p className="mt-0.5 text-xs text-white/45">
                  {prescindibles.map((h) => h.nombre).join(", ")} —
                  ahorro potencial de {formatEUR(prescindibles.reduce((s, h) => s + h.costoMensual, 0))}/mes
                </p>
              </div>
            </div>
          )}

          {enEvaluacion.length > 0 && (
            <div className="flex items-start gap-3 rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
              <div>
                <p className="text-sm font-medium text-orange-300">
                  {enEvaluacion.length} herramienta{enEvaluacion.length > 1 ? "s" : ""} en evaluación
                </p>
                <p className="mt-0.5 text-xs text-white/45">
                  {enEvaluacion.map((h) => h.nombre).join(", ")} — pendiente de decisión
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3 rounded-lg border border-sky-500/20 bg-sky-500/5 p-4">
            <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
            <div>
              <p className="text-sm font-medium text-sky-300">
                Marketing sin retorno registrado aún
              </p>
              <p className="mt-0.5 text-xs text-white/45">
                Twilio activo desde 01/04/2026. Monitorizar leads y conversiones
                en las próximas semanas para evaluar el ROAS.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            <div>
              <p className="text-sm font-medium text-emerald-300">
                Stack de alto uso bien justificado
              </p>
              <p className="mt-0.5 text-xs text-white/45">
                {suscripciones.filter((s) => s.estado === "ACTIVO" && s.uso === "ALTO").length} herramientas
                con uso ALTO y clasificadas como necesarias o soporte operativo.
                Inversión justificada.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed breakdown table */}
      <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-5">
        <h2 className="mb-4 text-sm font-semibold text-white">
          Resumen financiero consolidado
        </h2>
        <div className="space-y-0">
          {[
            {
              label: "Herramientas SaaS activas",
              mensual: kpis.inversionMensual,
              historico: kpis.inversionTotalHistorica,
              note: `${kpis.totalAplicacionesActivas} herramientas`,
            },
            {
              label: "Nóminas del equipo",
              mensual: nominasKpis.pagoMensualTotal,
              historico: nominasKpis.totalPagado,
              note: `${nominas.filter((n) => n.fechaInicio).length} personas activas`,
            },
            {
              label: "Inversión en marketing",
              mensual: marketingKpis.totalInvertido,
              historico: marketingKpis.totalInvertido,
              note: "Twilio · campañas",
            },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between border-b border-white/[0.04] py-3 last:border-0"
            >
              <div>
                <p className="text-sm text-white/80">{row.label}</p>
                <p className="text-[11px] text-white/35">{row.note}</p>
              </div>
              <div className="flex items-center gap-8 text-right">
                <div>
                  <p className="text-[10px] text-white/30">Mensual</p>
                  <p className="text-sm font-semibold text-white">
                    {formatEUR(row.mensual)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-white/30">Histórico</p>
                  <p className="text-sm font-semibold text-orange-400">
                    {formatEUR(row.historico)}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between pt-3">
            <p className="text-sm font-bold text-white">Total operativo mensual</p>
            <p className="text-lg font-bold text-orange-400">
              {formatEUR(gastoTotalMensual)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
