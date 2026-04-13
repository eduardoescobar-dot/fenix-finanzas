"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  suscripciones,
  kpis,
  type Suscripcion,
  type EstadoSuscripcion,
  type CategoriaSuscripcion,
} from "@/lib/data/sheets-data";
import { cn } from "@/lib/utils";
import { Filter, CreditCard, CheckCircle2, XCircle } from "lucide-react";

function formatEUR(value: number) {
  return `€ ${value.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

const CATEGORIAS: Array<CategoriaSuscripcion | "TODAS"> = [
  "TODAS",
  "IA",
  "MARKETING",
  "COMUNICACION",
  "VENTAS",
  "OPERACIONES",
  "DISEÑO",
];

const ESTADOS: Array<EstadoSuscripcion | "TODOS"> = [
  "TODOS",
  "ACTIVO",
  "CANCELADO",
];

function EstadoBadge({ estado }: { estado: EstadoSuscripcion }) {
  if (estado === "ACTIVO") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400 ring-1 ring-emerald-500/20">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        ACTIVO
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-0.5 text-[11px] font-medium text-red-400 ring-1 ring-red-500/20">
      <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
      CANCELADO
    </span>
  );
}

function UsoBadge({ uso }: { uso: Suscripcion["uso"] }) {
  const map = {
    ALTO: "bg-orange-500/10 text-orange-400 ring-orange-500/20",
    MEDIO: "bg-yellow-500/10 text-yellow-400 ring-yellow-500/20",
    BAJO: "bg-white/5 text-white/40 ring-white/10",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1",
        map[uso]
      )}
    >
      {uso}
    </span>
  );
}

function NecesidadBadge({ necesidad }: { necesidad: Suscripcion["necesidad"] }) {
  const map: Record<Suscripcion["necesidad"], string> = {
    NECESARIO: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
    "SOPORTE OPERATIVO": "bg-violet-500/10 text-violet-400 ring-violet-500/20",
    PRESCINDIBLE: "bg-yellow-500/10 text-yellow-400 ring-yellow-500/20",
    INECESARIO: "bg-red-500/10 text-red-400 ring-red-500/20",
    "EN EVALUACION": "bg-orange-500/10 text-orange-400 ring-orange-500/20",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 whitespace-nowrap",
        map[necesidad]
      )}
    >
      {necesidad}
    </span>
  );
}

function CategoriaBadge({ cat }: { cat: CategoriaSuscripcion }) {
  const map: Record<CategoriaSuscripcion, string> = {
    IA: "bg-purple-500/10 text-purple-400",
    MARKETING: "bg-pink-500/10 text-pink-400",
    COMUNICACION: "bg-sky-500/10 text-sky-400",
    VENTAS: "bg-emerald-500/10 text-emerald-400",
    OPERACIONES: "bg-amber-500/10 text-amber-400",
    DISEÑO: "bg-rose-500/10 text-rose-400",
  };
  return (
    <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium", map[cat])}>
      {cat}
    </span>
  );
}

export default function SuscripcionesPage() {
  const [categoriaFiltro, setCategoriaFiltro] = useState<CategoriaSuscripcion | "TODAS">("TODAS");
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoSuscripcion | "TODOS">("TODOS");

  const filtradas = suscripciones.filter((s) => {
    const catOk = categoriaFiltro === "TODAS" || s.categoria === categoriaFiltro;
    const estOk = estadoFiltro === "TODOS" || s.estado === estadoFiltro;
    return catOk && estOk;
  });

  const activas = filtradas.filter((s) => s.estado === "ACTIVO");
  const canceladas = filtradas.filter((s) => s.estado === "CANCELADO");
  const totalMensual = activas.reduce((sum, s) => sum + s.costoMensual, 0);

  return (
    <div className="flex flex-col gap-6 p-6 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Suscripciones</h1>
          <p className="mt-0.5 text-sm text-white/40">
            Gestión de herramientas y servicios SaaS
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-transparent p-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">
            Inversión mensual
          </p>
          <p className="mt-1.5 text-xl font-bold text-orange-400">
            {formatEUR(kpis.inversionMensual)}
          </p>
          <p className="mt-0.5 text-[11px] text-white/40">herramientas activas</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">
            Total aplicaciones
          </p>
          <p className="mt-1.5 text-xl font-bold text-white">{kpis.totalAplicaciones}</p>
          <p className="mt-0.5 text-[11px] text-white/40">en el stack</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">
              Activas
            </p>
          </div>
          <p className="mt-1.5 text-xl font-bold text-white">{kpis.totalAplicacionesActivas}</p>
          <p className="mt-0.5 text-[11px] text-white/40">herramientas en uso</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-4">
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-400" />
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">
              Canceladas
            </p>
          </div>
          <p className="mt-1.5 text-xl font-bold text-white">{kpis.totalAplicacionesCanceladas}</p>
          <p className="mt-0.5 text-[11px] text-white/40">dadas de baja</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-3.5 w-3.5 text-white/30" />
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaFiltro(cat)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-all",
                categoriaFiltro === cat
                  ? "bg-orange-500 text-white"
                  : "bg-white/[0.05] text-white/50 hover:bg-white/[0.08] hover:text-white/80"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="mx-2 h-4 w-px bg-white/[0.08]" />
        <div className="flex flex-wrap gap-1.5">
          {ESTADOS.map((est) => (
            <button
              key={est}
              onClick={() => setEstadoFiltro(est)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-all",
                estadoFiltro === est
                  ? "bg-white/15 text-white"
                  : "bg-white/[0.05] text-white/50 hover:bg-white/[0.08] hover:text-white/80"
              )}
            >
              {est}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs text-white/30">
          {filtradas.length} resultado{filtradas.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/[0.06] bg-[#111118] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.06] hover:bg-transparent">
              <TableHead className="text-white/40 text-[11px] font-medium uppercase tracking-wider pl-4">
                Herramienta
              </TableHead>
              <TableHead className="text-white/40 text-[11px] font-medium uppercase tracking-wider">
                Categoría
              </TableHead>
              <TableHead className="text-white/40 text-[11px] font-medium uppercase tracking-wider">
                Frecuencia
              </TableHead>
              <TableHead className="text-white/40 text-[11px] font-medium uppercase tracking-wider text-right">
                Costo/mes
              </TableHead>
              <TableHead className="text-white/40 text-[11px] font-medium uppercase tracking-wider text-right">
                Total pagado
              </TableHead>
              <TableHead className="text-white/40 text-[11px] font-medium uppercase tracking-wider">
                Tarjeta
              </TableHead>
              <TableHead className="text-white/40 text-[11px] font-medium uppercase tracking-wider">
                Próximo pago
              </TableHead>
              <TableHead className="text-white/40 text-[11px] font-medium uppercase tracking-wider">
                Responsable
              </TableHead>
              <TableHead className="text-white/40 text-[11px] font-medium uppercase tracking-wider">
                Estado
              </TableHead>
              <TableHead className="text-white/40 text-[11px] font-medium uppercase tracking-wider">
                Uso
              </TableHead>
              <TableHead className="text-white/40 text-[11px] font-medium uppercase tracking-wider pr-4">
                Necesidad
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtradas.map((s) => (
              <TableRow
                key={s.nombre}
                className={cn(
                  "border-white/[0.04] transition-colors",
                  s.estado === "CANCELADO" && "opacity-50"
                )}
              >
                <TableCell className="pl-4">
                  <div>
                    <p className="text-sm font-semibold text-white">{s.nombre}</p>
                    {s.notas && (
                      <p className="text-[10px] text-white/35">{s.notas}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <CategoriaBadge cat={s.categoria} />
                </TableCell>
                <TableCell>
                  <span className="text-xs text-white/50">{s.frecuencia}</span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm font-semibold text-white">
                    {formatEUR(s.costoMensual)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm text-white/60">
                    {formatEUR(s.totalPagado)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="rounded bg-white/[0.06] px-2 py-0.5 text-[11px] font-mono text-white/50">
                    •••• {s.tarjeta}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-white/50">{s.proximoPago}</span>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-white/60">{s.responsable}</span>
                </TableCell>
                <TableCell>
                  <EstadoBadge estado={s.estado} />
                </TableCell>
                <TableCell>
                  <UsoBadge uso={s.uso} />
                </TableCell>
                <TableCell className="pr-4">
                  <NecesidadBadge necesidad={s.necesidad} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filtradas.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CreditCard className="mb-3 h-8 w-8 text-white/20" />
            <p className="text-sm text-white/40">No se encontraron suscripciones</p>
            <p className="text-xs text-white/25">
              Prueba cambiando los filtros
            </p>
          </div>
        )}

        {/* Table footer totals */}
        {filtradas.length > 0 && (
          <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-3">
            <span className="text-xs text-white/40">
              {activas.length} activas · {canceladas.length} canceladas
            </span>
            <div className="flex items-center gap-4">
              <span className="text-xs text-white/40">
                Total filtrado/mes:
              </span>
              <span className="text-sm font-bold text-orange-400">
                {formatEUR(totalMensual)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
