"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Filter, CreditCard, CheckCircle2, PauseCircle, Plus, Pencil, Trash2 } from "lucide-react";
import {
  addSuscripcion, updateSuscripcion, deleteSuscripcion, type SuscripcionData,
} from "@/lib/actions";
import type { Suscripcion } from "./page";

const CATEGORIAS_FILTRO = ["TODAS", "IA", "MARKETING", "COMUNICACION", "VENTAS", "OPERACIONES", "DISEÑO", "TECH"] as const;
const CATEGORIAS_FORM = ["IA", "MARKETING", "COMUNICACION", "VENTAS", "OPERACIONES", "DISEÑO", "TECH"];
const ESTADOS = ["TODOS", "ACTIVA", "PAUSADA"] as const;
const FRECUENCIAS = ["MENSUAL", "ANUAL", "CADA 6 MESES", "ONE-TIME"];
const USOS = ["ALTO", "MEDIO", "BAJO"];
const NECESIDADES = ["NECESARIO", "SOPORTE OPERATIVO", "PRESCINDIBLE", "INECESARIO", "EN EVALUACION"];
const MONEDAS = ["USD", "MXN"];
const METODOS_PAGO = ["TARJETA", "PAYPAL", "TRANSFERENCIA", "OTRO"];

function fmt(v: number) {
  return `$ ${v.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const EMPTY: SuscripcionData = {
  nombre: "", categoria: "OPERACIONES", frecuencia: "MENSUAL", costo_mensual: 0,
  moneda: "USD", fecha_pago: "", tarjeta: "", proximo_pago: "", responsable: "",
  estado: "ACTIVA", uso: "MEDIO", necesidad: "NECESARIO", notas: "",
  correo_asociado: "", metodo_pago: "TARJETA", meses_activo: 0, costo_acumulado: 0,
};

function EstadoBadge({ estado }: { estado: string }) {
  if (estado === "ACTIVA")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400 ring-1 ring-emerald-500/20">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />ACTIVA
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/10 px-2.5 py-0.5 text-[11px] font-medium text-yellow-400 ring-1 ring-yellow-500/20">
      <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />PAUSADA
    </span>
  );
}

function UsoBadge({ uso }: { uso: string }) {
  const map: Record<string, string> = {
    ALTO: "bg-orange-500/10 text-orange-400 ring-orange-500/20",
    MEDIO: "bg-yellow-500/10 text-yellow-400 ring-yellow-500/20",
    BAJO: "bg-white/5 text-white/40 ring-white/10",
  };
  return <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1", map[uso] ?? "bg-white/5 text-white/40 ring-white/10")}>{uso}</span>;
}

function CategoriaBadge({ cat }: { cat: string }) {
  const map: Record<string, string> = {
    IA: "bg-purple-500/10 text-purple-400",
    MARKETING: "bg-pink-500/10 text-pink-400",
    COMUNICACION: "bg-sky-500/10 text-sky-400",
    VENTAS: "bg-emerald-500/10 text-emerald-400",
    OPERACIONES: "bg-amber-500/10 text-amber-400",
    DISEÑO: "bg-rose-500/10 text-rose-400",
    TECH: "bg-cyan-500/10 text-cyan-400",
  };
  return <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium", map[cat] ?? "bg-white/5 text-white/40")}>{cat}</span>;
}

function SuscripcionForm({
  initial, onSubmit, isPending,
}: { initial: SuscripcionData; onSubmit: (d: SuscripcionData) => void; isPending: boolean }) {
  const [form, setForm] = useState<SuscripcionData>(initial);
  const set = (k: keyof SuscripcionData, v: string | number) => setForm((p) => ({ ...p, [k]: v }));
  const sel = (k: keyof SuscripcionData) => (e: React.ChangeEvent<HTMLSelectElement>) => set(k, e.target.value);
  const selectCls = "h-8 w-full rounded-lg border border-[#24243a] bg-[#1a1a24] px-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500/50";

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs text-slate-400">Nombre *</Label>
          <Input value={form.nombre} onChange={(e) => set("nombre", e.target.value)} required placeholder="NOMBRE APP" className="h-8 bg-[#1a1a24] border-[#24243a] text-white text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-slate-400">Categoría</Label>
          <select value={form.categoria} onChange={sel("categoria")} className={selectCls}>
            {CATEGORIAS_FORM.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-slate-400">Frecuencia</Label>
          <select value={form.frecuencia} onChange={sel("frecuencia")} className={selectCls}>
            {FRECUENCIAS.map(f => <option key={f}>{f}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-slate-400">Costo/mes *</Label>
          <Input type="number" step="0.01" value={form.costo_mensual} onChange={(e) => set("costo_mensual", parseFloat(e.target.value) || 0)} required className="h-8 bg-[#1a1a24] border-[#24243a] text-white text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-slate-400">Moneda</Label>
          <select value={form.moneda} onChange={sel("moneda")} className={selectCls}>
            {MONEDAS.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-slate-400">Responsable</Label>
          <Input value={form.responsable} onChange={(e) => set("responsable", e.target.value)} placeholder="CESAR" className="h-8 bg-[#1a1a24] border-[#24243a] text-white text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-slate-400">Tarjeta (últimos 4)</Label>
          <Input value={form.tarjeta} onChange={(e) => set("tarjeta", e.target.value)} placeholder="6170" maxLength={4} className="h-8 bg-[#1a1a24] border-[#24243a] text-white text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-slate-400">Fecha de pago</Label>
          <Input value={form.fecha_pago} onChange={(e) => set("fecha_pago", e.target.value)} placeholder="Cada 1ro" className="h-8 bg-[#1a1a24] border-[#24243a] text-white text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-slate-400">Próximo pago</Label>
          <Input value={form.proximo_pago} onChange={(e) => set("proximo_pago", e.target.value)} placeholder="01/06/2026" className="h-8 bg-[#1a1a24] border-[#24243a] text-white text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-slate-400">Estado</Label>
          <select value={form.estado} onChange={sel("estado")} className={selectCls}>
            <option value="ACTIVA">ACTIVA</option>
            <option value="PAUSADA">PAUSADA</option>
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-slate-400">Uso</Label>
          <select value={form.uso} onChange={sel("uso")} className={selectCls}>
            {USOS.map(u => <option key={u}>{u}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-slate-400">Necesidad</Label>
          <select value={form.necesidad} onChange={sel("necesidad")} className={selectCls}>
            {NECESIDADES.map(n => <option key={n}>{n}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-slate-400">Meses activo</Label>
          <Input type="number" min="0" value={form.meses_activo} onChange={(e) => set("meses_activo", parseInt(e.target.value) || 0)} className="h-8 bg-[#1a1a24] border-[#24243a] text-white text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-slate-400">Método de pago</Label>
          <select value={form.metodo_pago} onChange={sel("metodo_pago")} className={selectCls}>
            {METODOS_PAGO.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-slate-400">Correo asociado</Label>
        <Input value={form.correo_asociado} onChange={(e) => set("correo_asociado", e.target.value)} placeholder="cesar@academyfenix.com" className="h-8 bg-[#1a1a24] border-[#24243a] text-white text-sm" />
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-slate-400">Notas</Label>
        <Input value={form.notas} onChange={(e) => set("notas", e.target.value)} placeholder="Opcional" className="h-8 bg-[#1a1a24] border-[#24243a] text-white text-sm" />
      </div>
      <Button type="submit" disabled={isPending} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold">
        {isPending ? "Guardando..." : "Guardar"}
      </Button>
    </form>
  );
}

export function SuscripcionesClient({ data }: { data: Suscripcion[] }) {
  const [catFiltro, setCatFiltro] = useState<string>("TODAS");
  const [estFiltro, setEstFiltro] = useState<string>("TODOS");
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<Suscripcion | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const activas = data.filter((s) => s.estado === "ACTIVA");
  const pausadas = data.filter((s) => s.estado === "PAUSADA");
  const totalMensual = activas.reduce((sum, s) => sum + s.costo_mensual, 0);
  const totalAcumulado = data.reduce((sum, s) => {
    const acum = s.costo_acumulado ?? (s.meses_activo ?? 0) * s.costo_mensual;
    return sum + acum;
  }, 0);

  const filtradas = data.filter((s) => {
    const catOk = catFiltro === "TODAS" || s.categoria === catFiltro;
    const estOk = estFiltro === "TODOS" || s.estado === estFiltro;
    return catOk && estOk;
  });

  const totalFiltradoMes = filtradas.filter(s => s.estado === "ACTIVA").reduce((sum, s) => sum + s.costo_mensual, 0);

  function handleAdd(formData: SuscripcionData) {
    startTransition(async () => {
      const d = { ...formData, costo_acumulado: (formData.meses_activo || 0) * formData.costo_mensual };
      const res = await addSuscripcion(d);
      if (res.error) { toast.error(res.error); return; }
      toast.success("Suscripción agregada");
      setAddOpen(false);
    });
  }

  function handleEdit(formData: SuscripcionData) {
    if (!editItem) return;
    startTransition(async () => {
      const d = { ...formData, costo_acumulado: (formData.meses_activo || 0) * formData.costo_mensual };
      const res = await updateSuscripcion(editItem.id, d);
      if (res.error) { toast.error(res.error); return; }
      toast.success("Suscripción actualizada");
      setEditItem(null);
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const res = await deleteSuscripcion(id);
      if (res.error) { toast.error(res.error); return; }
      toast.success("Suscripción eliminada");
      setDeleteId(null);
    });
  }

  return (
    <div className="flex flex-col gap-6 p-6 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Suscripciones</h1>
          <p className="mt-0.5 text-sm text-white/40">Stack SaaS de Fénix Academy · Acumulado automático por meses activo</p>
        </div>
        <Button onClick={() => setAddOpen(true)} className="gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm">
          <Plus className="h-4 w-4" /> Nueva
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-transparent p-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">Inversión / mes</p>
          <p className="mt-1.5 text-xl font-bold text-orange-400">{fmt(totalMensual)}</p>
          <p className="mt-0.5 text-[11px] text-white/40">{activas.length} herramientas activas</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">Acumulado histórico</p>
          <p className="mt-1.5 text-xl font-bold text-white">{fmt(totalAcumulado)}</p>
          <p className="mt-0.5 text-[11px] text-white/40">{data.length} herramientas totales</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-4">
          <div className="mb-1 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">Activas</p>
          </div>
          <p className="mt-1 text-xl font-bold text-emerald-400">{activas.length}</p>
          <p className="mt-0.5 text-[11px] text-white/40">en uso actualmente</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-4">
          <div className="mb-1 flex items-center gap-2">
            <PauseCircle className="h-4 w-4 text-yellow-400" />
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">Pausadas</p>
          </div>
          <p className="mt-1 text-xl font-bold text-yellow-400">{pausadas.length}</p>
          <p className="mt-0.5 text-[11px] text-white/40">suspendidas temporalmente</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-3.5 w-3.5 text-white/30" />
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIAS_FILTRO.map((cat) => (
            <button
              key={cat}
              onClick={() => setCatFiltro(cat)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-all",
                catFiltro === cat ? "bg-orange-500 text-white" : "bg-white/[0.05] text-white/50 hover:bg-white/[0.08] hover:text-white/80"
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
              onClick={() => setEstFiltro(est)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-all",
                estFiltro === est ? "bg-white/15 text-white" : "bg-white/[0.05] text-white/50 hover:bg-white/[0.08] hover:text-white/80"
              )}
            >
              {est}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs text-white/30">{filtradas.length} resultado{filtradas.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/[0.06] bg-[#111118] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.06] hover:bg-transparent">
              {["Herramienta", "Cat.", "Frecuencia", "Costo/mes", "Meses", "Acumulado", "Tarjeta", "Próx. pago", "Responsable", "Estado", "Uso", "Necesidad", ""].map((h, i) => (
                <TableHead
                  key={i}
                  className={cn("text-white/40 text-[11px] font-medium uppercase tracking-wider whitespace-nowrap", i === 0 && "pl-4", i === 12 && "pr-4 w-16")}
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtradas.map((s) => {
              const acumulado = s.costo_acumulado ?? ((s.meses_activo ?? 0) * s.costo_mensual);
              return (
                <TableRow key={s.id} className={cn("border-white/[0.04] transition-colors", s.estado !== "ACTIVA" && "opacity-50")}>
                  <TableCell className="pl-4">
                    <div>
                      <p className="text-sm font-semibold text-white">{s.nombre}</p>
                      {s.correo_asociado
                        ? <p className="text-[10px] text-white/30">{s.correo_asociado}</p>
                        : s.notas && <p className="text-[10px] text-white/35">{s.notas}</p>
                      }
                    </div>
                  </TableCell>
                  <TableCell><CategoriaBadge cat={s.categoria} /></TableCell>
                  <TableCell><span className="text-xs text-white/50">{s.frecuencia}</span></TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm font-semibold text-white">{fmt(s.costo_mensual)}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="rounded bg-white/[0.06] px-2 py-0.5 text-[11px] font-mono text-white/60">
                      {s.meses_activo ?? 0}m
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm font-semibold text-orange-400/80">{fmt(acumulado)}</span>
                  </TableCell>
                  <TableCell>
                    <span className="rounded bg-white/[0.06] px-2 py-0.5 text-[11px] font-mono text-white/50">
                      •••• {s.tarjeta}
                    </span>
                  </TableCell>
                  <TableCell><span className="text-xs text-white/50 whitespace-nowrap">{s.proximo_pago}</span></TableCell>
                  <TableCell><span className="text-xs text-white/60">{s.responsable}</span></TableCell>
                  <TableCell><EstadoBadge estado={s.estado} /></TableCell>
                  <TableCell><UsoBadge uso={s.uso} /></TableCell>
                  <TableCell>
                    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 whitespace-nowrap", {
                      "bg-blue-500/10 text-blue-400 ring-blue-500/20": s.necesidad === "NECESARIO",
                      "bg-violet-500/10 text-violet-400 ring-violet-500/20": s.necesidad === "SOPORTE OPERATIVO",
                      "bg-yellow-500/10 text-yellow-400 ring-yellow-500/20": s.necesidad === "PRESCINDIBLE",
                      "bg-red-500/10 text-red-400 ring-red-500/20": s.necesidad === "INECESARIO",
                      "bg-orange-500/10 text-orange-400 ring-orange-500/20": s.necesidad === "EN EVALUACION",
                    })}>{s.necesidad}</span>
                  </TableCell>
                  <TableCell className="pr-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setEditItem(s)} className="rounded p-1 text-white/30 hover:bg-white/[0.06] hover:text-white/70 transition-colors">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => setDeleteId(s.id)} className="rounded p-1 text-white/30 hover:bg-red-500/10 hover:text-red-400 transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {filtradas.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CreditCard className="mb-3 h-8 w-8 text-white/20" />
            <p className="text-sm text-white/40">No se encontraron suscripciones</p>
          </div>
        )}
        {filtradas.length > 0 && (
          <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-3">
            <span className="text-xs text-white/40">{activas.length} activas · {pausadas.length} pausadas</span>
            <div className="flex items-center gap-4">
              <span className="text-xs text-white/40">Total filtrado/mes:</span>
              <span className="text-sm font-bold text-orange-400">{fmt(totalFiltradoMes)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Dialog open={addOpen} onOpenChange={(o) => !o && setAddOpen(false)}>
        <DialogContent className="border-[#24243a] bg-[#111118] text-white max-w-lg">
          <DialogHeader><DialogTitle className="text-white">Nueva suscripción</DialogTitle></DialogHeader>
          <SuscripcionForm initial={EMPTY} onSubmit={handleAdd} isPending={isPending} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)}>
        <DialogContent className="border-[#24243a] bg-[#111118] text-white max-w-lg">
          <DialogHeader><DialogTitle className="text-white">Editar suscripción</DialogTitle></DialogHeader>
          {editItem && (
            <SuscripcionForm
              initial={{
                nombre: editItem.nombre, categoria: editItem.categoria, frecuencia: editItem.frecuencia,
                costo_mensual: editItem.costo_mensual, moneda: editItem.moneda, fecha_pago: editItem.fecha_pago ?? "",
                tarjeta: editItem.tarjeta ?? "", proximo_pago: editItem.proximo_pago ?? "", responsable: editItem.responsable ?? "",
                estado: editItem.estado, uso: editItem.uso, necesidad: editItem.necesidad, notas: editItem.notas ?? "",
                correo_asociado: editItem.correo_asociado ?? "", metodo_pago: editItem.metodo_pago ?? "TARJETA",
                meses_activo: editItem.meses_activo ?? 0, costo_acumulado: editItem.costo_acumulado ?? 0,
              }}
              onSubmit={handleEdit}
              isPending={isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="border-[#24243a] bg-[#111118] text-white max-w-sm">
          <DialogHeader><DialogTitle className="text-white">¿Eliminar suscripción?</DialogTitle></DialogHeader>
          <p className="text-sm text-white/50">Esta acción no se puede deshacer.</p>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setDeleteId(null)} className="flex-1 border-white/10 text-white/70 hover:bg-white/[0.05]">Cancelar</Button>
            <Button onClick={() => deleteId && handleDelete(deleteId)} disabled={isPending} className="flex-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20">
              {isPending ? "Eliminando..." : "Eliminar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
