import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { nominas, nominasKpis } from "@/lib/data/sheets-data";
import { Users, Wallet, Clock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

function formatEUR(value: number) {
  return `€ ${value.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

const ROL_COLORS: Record<string, string> = {
  OPERACIONES: "bg-amber-500/10 text-amber-400",
  COORDINACION: "bg-violet-500/10 text-violet-400",
  VENTAS: "bg-emerald-500/10 text-emerald-400",
  MARKETING: "bg-pink-500/10 text-pink-400",
};

const INITIALS_COLORS = [
  "from-orange-500 to-orange-600",
  "from-violet-500 to-violet-600",
  "from-emerald-500 to-emerald-600",
  "from-sky-500 to-sky-600",
];

const totalEquipo = nominas.reduce((sum, n) => sum + n.salarioMensual, 0);
const activosCount = nominas.filter((n) => n.fechaInicio !== null).length;

export default function NominasPage() {
  return (
    <div className="flex flex-col gap-6 p-6 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Nóminas</h1>
          <p className="mt-0.5 text-sm text-white/40">
            Gestión del equipo y compensaciones
          </p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-transparent p-4">
          <div className="mb-2 flex items-center gap-2">
            <Wallet className="h-4 w-4 text-orange-400" />
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">
              Pago mensual total
            </p>
          </div>
          <p className="text-xl font-bold text-orange-400">
            {formatEUR(nominasKpis.pagoMensualTotal)}
          </p>
          <p className="mt-0.5 text-[11px] text-white/35">solo miembros activos</p>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-4">
          <div className="mb-2 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">
              Total pagado
            </p>
          </div>
          <p className="text-xl font-bold text-white">
            {formatEUR(nominasKpis.totalPagado)}
          </p>
          <p className="mt-0.5 text-[11px] text-white/35">acumulado histórico</p>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-4">
          <div className="mb-2 flex items-center gap-2">
            <Users className="h-4 w-4 text-white/40" />
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">
              Miembros activos
            </p>
          </div>
          <p className="text-xl font-bold text-white">{activosCount}</p>
          <p className="mt-0.5 text-[11px] text-white/35">
            de {nominas.length} en plantilla
          </p>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-4">
          <div className="mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4 text-white/40" />
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">
              Masa salarial total
            </p>
          </div>
          <p className="text-xl font-bold text-white">{formatEUR(totalEquipo)}</p>
          <p className="mt-0.5 text-[11px] text-white/35">si todos estuvieran activos</p>
        </div>
      </div>

      {/* Team grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {nominas.map((n, i) => {
          const initials = n.nombre.substring(0, 2).toUpperCase();
          const isActive = n.fechaInicio !== null;
          return (
            <div
              key={n.nombre}
              className={cn(
                "rounded-xl border bg-[#111118] p-5 transition-all",
                isActive
                  ? "border-white/[0.08] hover:border-white/[0.12]"
                  : "border-white/[0.04] opacity-60"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white",
                    INITIALS_COLORS[i % INITIALS_COLORS.length]
                  )}
                >
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{n.nombre}</p>
                  <span
                    className={cn(
                      "inline-block rounded px-1.5 py-0.5 text-[10px] font-medium",
                      ROL_COLORS[n.rol] ?? "bg-white/5 text-white/40"
                    )}
                  >
                    {n.rol}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-white/40">Salario/mes</span>
                  <span className="text-sm font-bold text-white">
                    {formatEUR(n.salarioMensual)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-white/40">Inicio</span>
                  <span className="text-xs text-white/60">
                    {n.fechaInicio ?? "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-white/40">Meses pagados</span>
                  <span className="text-xs text-white/60">
                    {n.mesesPagados}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-white/[0.06] pt-2">
                  <span className="text-[11px] text-white/40">Total pagado</span>
                  <span
                    className={cn(
                      "text-sm font-bold",
                      n.totalPagado > 0 ? "text-orange-400" : "text-white/25"
                    )}
                  >
                    {formatEUR(n.totalPagado)}
                  </span>
                </div>
              </div>

              <div className="mt-3">
                {isActive ? (
                  <span className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-emerald-500/10 py-1 text-[11px] font-medium text-emerald-400 ring-1 ring-emerald-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Activo
                  </span>
                ) : (
                  <span className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-white/[0.05] py-1 text-[11px] font-medium text-white/30">
                    Pendiente de inicio
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed table */}
      <div className="rounded-xl border border-white/[0.06] bg-[#111118] overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <h2 className="text-sm font-semibold text-white">
            Detalle de nóminas
          </h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.06] hover:bg-transparent">
              <TableHead className="text-white/40 text-[11px] font-medium uppercase tracking-wider pl-5">
                Nombre
              </TableHead>
              <TableHead className="text-white/40 text-[11px] font-medium uppercase tracking-wider">
                Rol
              </TableHead>
              <TableHead className="text-white/40 text-[11px] font-medium uppercase tracking-wider text-right">
                Salario/mes
              </TableHead>
              <TableHead className="text-white/40 text-[11px] font-medium uppercase tracking-wider">
                Fecha inicio
              </TableHead>
              <TableHead className="text-white/40 text-[11px] font-medium uppercase tracking-wider text-right">
                Meses pagados
              </TableHead>
              <TableHead className="text-white/40 text-[11px] font-medium uppercase tracking-wider text-right pr-5">
                Total pagado
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nominas.map((n) => (
              <TableRow
                key={n.nombre}
                className={cn(
                  "border-white/[0.04]",
                  !n.fechaInicio && "opacity-50"
                )}
              >
                <TableCell className="pl-5">
                  <p className="text-sm font-semibold text-white">{n.nombre}</p>
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[10px] font-medium",
                      ROL_COLORS[n.rol] ?? "bg-white/5 text-white/40"
                    )}
                  >
                    {n.rol}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm font-semibold text-white">
                    {formatEUR(n.salarioMensual)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-white/50">
                    {n.fechaInicio ?? "—"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm text-white/60">{n.mesesPagados}</span>
                </TableCell>
                <TableCell className="text-right pr-5">
                  <span
                    className={cn(
                      "text-sm font-bold",
                      n.totalPagado > 0 ? "text-orange-400" : "text-white/30"
                    )}
                  >
                    {formatEUR(n.totalPagado)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Footer totals */}
        <div className="flex items-center justify-between border-t border-white/[0.06] px-5 py-3">
          <span className="text-xs text-white/40">
            {nominas.length} miembros en plantilla
          </span>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] text-white/35">Pago mensual activos</p>
              <p className="text-sm font-bold text-orange-400">
                {formatEUR(nominasKpis.pagoMensualTotal)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-white/35">Total histórico pagado</p>
              <p className="text-sm font-bold text-white">
                {formatEUR(nominasKpis.totalPagado)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
