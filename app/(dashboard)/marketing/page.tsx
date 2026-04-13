import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { campanasMarketing, marketingKpis } from "@/lib/data/sheets-data";
import { Megaphone, TrendingUp, DollarSign, Target } from "lucide-react";

function formatEUR(value: number) {
  return `€ ${value.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function MarketingPage() {
  return (
    <div className="flex flex-col gap-6 p-6 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Marketing</h1>
          <p className="mt-0.5 text-sm text-white/40">
            Campañas y rendimiento publicitario
          </p>
        </div>
        <span className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 px-3 py-1.5 text-xs font-medium text-yellow-400">
          Fase inicial
        </span>
      </div>

      {/* KPI summary */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-4">
          <div className="mb-2 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-orange-400" />
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">
              Total invertido
            </p>
          </div>
          <p className="text-xl font-bold text-white">
            {formatEUR(marketingKpis.totalInvertido)}
          </p>
          <p className="mt-0.5 text-[11px] text-white/35">en campañas activas</p>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-4">
          <div className="mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-white/40" />
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">
              Total ingresos
            </p>
          </div>
          <p className="text-xl font-bold text-white/30">
            {formatEUR(marketingKpis.totalIngresos)}
          </p>
          <p className="mt-0.5 text-[11px] text-white/35">sin retorno registrado</p>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-4">
          <div className="mb-2 flex items-center gap-2">
            <Target className="h-4 w-4 text-white/40" />
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">
              ROAS
            </p>
          </div>
          <p className="text-xl font-bold text-white/30">{marketingKpis.roas}x</p>
          <p className="mt-0.5 text-[11px] text-white/35">retorno sobre inversión</p>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-4">
          <div className="mb-2 flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-white/40" />
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">
              Campañas activas
            </p>
          </div>
          <p className="text-xl font-bold text-white">
            {campanasMarketing.filter((c) => c.estado === "ACTIVA").length}
          </p>
          <p className="mt-0.5 text-[11px] text-white/35">en ejecución ahora</p>
        </div>
      </div>

      {/* Notice banner */}
      <div className="flex items-start gap-3 rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">
        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500/20">
          <Megaphone className="h-3 w-3 text-orange-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-orange-300">
            Marketing en fase inicial
          </p>
          <p className="mt-0.5 text-xs text-white/45">
            Las campañas acaban de comenzar. Twilio está activo desde el 01/04/2026.
            Los primeros datos de conversión estarán disponibles próximamente.
          </p>
        </div>
      </div>

      {/* Campaigns table */}
      <div className="rounded-xl border border-white/[0.06] bg-[#111118] overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <h2 className="text-sm font-semibold text-white">
            Campañas activas
          </h2>
          <span className="text-xs text-white/30">
            {campanasMarketing.length} campaña{campanasMarketing.length !== 1 ? "s" : ""}
          </span>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.06] hover:bg-transparent">
              <TableHead className="text-white/40 text-[11px] font-medium uppercase tracking-wider pl-5">
                Canal
              </TableHead>
              <TableHead className="text-white/40 text-[11px] font-medium uppercase tracking-wider">
                Tipo
              </TableHead>
              <TableHead className="text-white/40 text-[11px] font-medium uppercase tracking-wider">
                Proyecto
              </TableHead>
              <TableHead className="text-white/40 text-[11px] font-medium uppercase tracking-wider">
                Inicio
              </TableHead>
              <TableHead className="text-white/40 text-[11px] font-medium uppercase tracking-wider text-right">
                Costo/mes
              </TableHead>
              <TableHead className="text-white/40 text-[11px] font-medium uppercase tracking-wider text-right">
                Total invertido
              </TableHead>
              <TableHead className="text-white/40 text-[11px] font-medium uppercase tracking-wider text-right">
                Leads
              </TableHead>
              <TableHead className="text-white/40 text-[11px] font-medium uppercase tracking-wider text-right">
                Ventas
              </TableHead>
              <TableHead className="text-white/40 text-[11px] font-medium uppercase tracking-wider text-right">
                Ingresos
              </TableHead>
              <TableHead className="text-white/40 text-[11px] font-medium uppercase tracking-wider pr-5">
                Estado
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campanasMarketing.map((c) => (
              <TableRow key={c.nombre} className="border-white/[0.04]">
                <TableCell className="pl-5">
                  <p className="text-sm font-semibold text-white">{c.nombre}</p>
                </TableCell>
                <TableCell>
                  <span className="rounded bg-sky-500/10 px-1.5 py-0.5 text-[10px] font-medium text-sky-400">
                    {c.tipo}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-white/60">{c.proyecto}</span>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-white/50">{c.fechaInicio}</span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm font-semibold text-white">
                    {formatEUR(c.costoMensual)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm text-white/60">
                    {formatEUR(c.totalInvertido)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm text-white/40">{c.leads}</span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm text-white/40">{c.ventas}</span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm text-white/40">
                    {formatEUR(c.ingresos)}
                  </span>
                </TableCell>
                <TableCell className="pr-5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400 ring-1 ring-emerald-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_#34d399]" />
                    {c.estado}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Metrics target */}
      <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-5">
        <h2 className="mb-4 text-sm font-semibold text-white">
          Métricas objetivo Q2 2026
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: "ROAS objetivo", target: "3x", current: "0x", pct: 0 },
            { label: "Leads objetivo/mes", target: "50", current: "0", pct: 0 },
            { label: "Conversión objetivo", target: "5%", current: "—", pct: 0 },
          ].map((m) => (
            <div key={m.label} className="rounded-lg bg-white/[0.02] p-4">
              <p className="text-[11px] font-medium uppercase tracking-wider text-white/35">
                {m.label}
              </p>
              <div className="mt-2 flex items-end justify-between">
                <span className="text-lg font-bold text-white">{m.current}</span>
                <span className="text-xs text-white/30">de {m.target}</span>
              </div>
              <div className="mt-2 h-1 w-full rounded-full bg-white/[0.06]">
                <div
                  className="h-1 rounded-full bg-orange-500"
                  style={{ width: `${m.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
