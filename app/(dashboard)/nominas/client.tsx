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
import { Users, Wallet, CheckCircle, Clock, Plus, Pencil, Trash2, Gift } from "lucide-react";
import {
  addIntegrante, updateIntegrante, deleteIntegrante,
  addPago, deletePago,
  type IntegranteData, type PagoData,
} from "@/lib/actions";
import type { Integrante, PagoNomina } from "./page";

const ROLES = ["OPERACIONES", "COORDINACION", "VENTAS", "MARKETING", "TECNOLOGIA", "OTRO"];
const TIPOS_PAGO = ["SALARIO", "BONO"];
const ROL_COLORS: Record<string, string> = {
  OPERACIONES: "bg-amber-500/10 text-amber-400",
  COORDINACION: "bg-violet-500/10 text-violet-400",
  VENTAS: "bg-emerald-500/10 text-emerald-400",
  MARKETING: "bg-pink-500/10 text-pink-400",
  TECNOLOGIA: "bg-sky-500/10 text-sky-400",
};
const AVATAR_GRADIENTS = [
  "from-orange-500 to-orange-600", "from-violet-500 to-violet-600",
  "from-emerald-500 to-emerald-600", "from-sky-500 to-sky-600",
  "from-pink-500 to-pink-600", "from-amber-500 to-amber-600",
];

function fmt(v: number) {
  return `$ ${v.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const EMPTY_INT: IntegranteData = {
  nombre: "", rol: "OPERACIONES", salario_mensual: 0, fecha_inicio: "", activo: false,
};

// ─── Integrante Form ──────────────────────────────────────────
function IntegranteForm({
  initial, onSubmit, isPending,
}: { initial: IntegranteData; onSubmit: (d: IntegranteData) => void; isPending: boolean }) {
  const [form, setForm] = useState<IntegranteData>(initial);
  const set = (k: keyof IntegranteData, v: string | number | boolean) =>
    setForm((p) => ({ ...p, [k]: v }));
  const selectCls = "h-8 w-full rounded-lg border border-[#24243a] bg-[#1a1a24] px-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500/50";

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs text-slate-400">Nombre *</Label>
          <Input value={form.nombre} onChange={(e) => set("nombre", e.target.value)} required placeholder="NOMBRE" className="h-8 bg-[#1a1a24] border-[#24243a] text-white text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-slate-400">Rol</Label>
          <select value={form.rol} onChange={(e) => set("rol", e.target.value)} className={selectCls}>
            {ROLES.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-slate-400">Salario mensual *</Label>
          <Input type="number" step="0.01" value={form.salario_mensual}
            onChange={(e) => set("salario_mensual", parseFloat(e.target.value) || 0)}
            required className="h-8 bg-[#1a1a24] border-[#24243a] text-white text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-slate-400">Fecha inicio</Label>
          <Input value={form.fecha_inicio ?? ""} onChange={(e) => set("fecha_inicio", e.target.value)}
            placeholder="01/12/2025" className="h-8 bg-[#1a1a24] border-[#24243a] text-white text-sm" />
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-lg border border-[#24243a] bg-[#1a1a24] px-3 py-2">
        <input type="checkbox" id="activo" checked={form.activo}
          onChange={(e) => set("activo", e.target.checked)}
          className="h-4 w-4 rounded accent-orange-500" />
        <Label htmlFor="activo" className="text-sm text-slate-300 cursor-pointer">Miembro activo (recibiendo pagos)</Label>
      </div>
      <Button type="submit" disabled={isPending} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold">
        {isPending ? "Guardando..." : "Guardar"}
      </Button>
    </form>
  );
}

// ─── Pago Form ────────────────────────────────────────────────
function PagoForm({
  integrantes, onSubmit, isPending, defaultIntegranteId,
}: {
  integrantes: Integrante[];
  onSubmit: (d: PagoData) => void;
  isPending: boolean;
  defaultIntegranteId?: string;
}) {
  const first = integrantes.find(i => i.id === defaultIntegranteId) ?? integrantes[0];
  const [integranteId, setIntegranteId] = useState(first?.id ?? "");
  const [mes, setMes] = useState("");
  const [tipo, setTipo] = useState("SALARIO");
  const [monto, setMonto] = useState(first?.salario_mensual ?? 0);
  const [descripcion, setDescripcion] = useState("");
  const [fechaPago, setFechaPago] = useState("");

  const selectCls = "h-8 w-full rounded-lg border border-[#24243a] bg-[#1a1a24] px-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500/50";

  function handleIntegranteChange(id: string) {
    setIntegranteId(id);
    const found = integrantes.find(i => i.id === id);
    if (found && tipo === "SALARIO") setMonto(found.salario_mensual);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const integrante = integrantes.find(i => i.id === integranteId);
    if (!integrante) return;
    onSubmit({
      integrante_id: integranteId,
      integrante_nombre: integrante.nombre,
      mes, tipo, monto,
      descripcion: descripcion || (tipo === "SALARIO" ? `Salario ${mes}` : descripcion),
      fecha_pago: fechaPago,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1 col-span-2">
          <Label className="text-xs text-slate-400">Integrante *</Label>
          <select value={integranteId} onChange={(e) => handleIntegranteChange(e.target.value)} className={selectCls} required>
            {integrantes.map(i => <option key={i.id} value={i.id}>{i.nombre} — {i.rol}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-slate-400">Tipo de pago</Label>
          <select value={tipo} onChange={(e) => { setTipo(e.target.value); if (e.target.value === "BONO") setMonto(0); }} className={selectCls}>
            {TIPOS_PAGO.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-slate-400">Monto *</Label>
          <Input type="number" step="0.01" value={monto}
            onChange={(e) => setMonto(parseFloat(e.target.value) || 0)}
            required className="h-8 bg-[#1a1a24] border-[#24243a] text-white text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-slate-400">Mes *</Label>
          <Input value={mes} onChange={(e) => setMes(e.target.value)} required
            placeholder="Abril 2026" className="h-8 bg-[#1a1a24] border-[#24243a] text-white text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-slate-400">Fecha de pago</Label>
          <Input value={fechaPago} onChange={(e) => setFechaPago(e.target.value)}
            placeholder="15/04/2026" className="h-8 bg-[#1a1a24] border-[#24243a] text-white text-sm" />
        </div>
        <div className="space-y-1 col-span-2">
          <Label className="text-xs text-slate-400">Descripción {tipo === "BONO" && <span className="text-orange-400">*</span>}</Label>
          <Input value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
            required={tipo === "BONO"}
            placeholder={tipo === "BONO" ? "Motivo del bono..." : "Salario Abril 2026"}
            className="h-8 bg-[#1a1a24] border-[#24243a] text-white text-sm" />
        </div>
      </div>
      <Button type="submit" disabled={isPending} className={cn("w-full text-white font-semibold", tipo === "BONO" ? "bg-violet-500 hover:bg-violet-600" : "bg-orange-500 hover:bg-orange-600")}>
        {isPending ? "Registrando..." : `Registrar ${tipo === "BONO" ? "bono" : "salario"}`}
      </Button>
    </form>
  );
}

// ─── Main Client ──────────────────────────────────────────────
export function NominasClient({ integrantes, pagos }: { integrantes: Integrante[]; pagos: PagoNomina[] }) {
  const [addIntOpen, setAddIntOpen] = useState(false);
  const [editInt, setEditInt] = useState<Integrante | null>(null);
  const [deleteIntId, setDeleteIntId] = useState<string | null>(null);
  const [pagoOpen, setPagoOpen] = useState<string | null>(null); // integranteId
  const [deletePagoId, setDeletePagoId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const activos = integrantes.filter(i => i.activo);
  const pagoMensualActivos = activos.reduce((s, i) => s + i.salario_mensual, 0);
  const totalPagado = pagos.reduce((s, p) => s + p.monto, 0);
  const totalSalarios = pagos.filter(p => p.tipo === "SALARIO").reduce((s, p) => s + p.monto, 0);
  const totalBonos = pagos.filter(p => p.tipo === "BONO").reduce((s, p) => s + p.monto, 0);

  function getPagosIntegrante(id: string) {
    return pagos.filter(p => p.integrante_id === id);
  }

  function handleAddInt(data: IntegranteData) {
    startTransition(async () => {
      const res = await addIntegrante(data);
      if (res.error) { toast.error(res.error); return; }
      toast.success("Integrante agregado");
      setAddIntOpen(false);
    });
  }

  function handleEditInt(data: IntegranteData) {
    if (!editInt) return;
    startTransition(async () => {
      const res = await updateIntegrante(editInt.id, data);
      if (res.error) { toast.error(res.error); return; }
      toast.success("Integrante actualizado");
      setEditInt(null);
    });
  }

  function handleDeleteInt(id: string) {
    startTransition(async () => {
      const res = await deleteIntegrante(id);
      if (res.error) { toast.error(res.error); return; }
      toast.success("Integrante eliminado");
      setDeleteIntId(null);
    });
  }

  function handleAddPago(data: PagoData) {
    startTransition(async () => {
      const res = await addPago(data);
      if (res.error) { toast.error(res.error); return; }
      toast.success(data.tipo === "BONO" ? "Bono registrado" : "Pago registrado");
      setPagoOpen(null);
    });
  }

  function handleDeletePago(id: string) {
    startTransition(async () => {
      const res = await deletePago(id);
      if (res.error) { toast.error(res.error); return; }
      toast.success("Pago eliminado");
      setDeletePagoId(null);
    });
  }

  return (
    <div className="flex flex-col gap-6 p-6 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Nóminas</h1>
          <p className="mt-0.5 text-sm text-white/40">Gestión del equipo y compensaciones</p>
        </div>
        <Button onClick={() => setAddIntOpen(true)} className="gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm">
          <Plus className="h-4 w-4" /> Nuevo integrante
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-transparent p-4">
          <div className="mb-2 flex items-center gap-2">
            <Wallet className="h-4 w-4 text-orange-400" />
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">Pago mensual</p>
          </div>
          <p className="text-xl font-bold text-orange-400">{fmt(pagoMensualActivos)}</p>
          <p className="mt-0.5 text-[11px] text-white/35">solo activos</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-4">
          <div className="mb-2 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">Total pagado</p>
          </div>
          <p className="text-xl font-bold text-white">{fmt(totalPagado)}</p>
          <p className="mt-0.5 text-[11px] text-white/35">acumulado histórico</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-4">
          <div className="mb-2 flex items-center gap-2">
            <Users className="h-4 w-4 text-white/40" />
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">Activos</p>
          </div>
          <p className="text-xl font-bold text-white">{activos.length}</p>
          <p className="mt-0.5 text-[11px] text-white/35">de {integrantes.length} en plantilla</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-4">
          <div className="mb-2 flex items-center gap-2">
            <Gift className="h-4 w-4 text-violet-400" />
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">Total bonos</p>
          </div>
          <p className="text-xl font-bold text-violet-400">{fmt(totalBonos)}</p>
          <p className="mt-0.5 text-[11px] text-white/35">pagados en bonos</p>
        </div>
      </div>

      {/* Team cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {integrantes.map((n, i) => {
          const misPayments = getPagosIntegrante(n.id);
          const totalPagadoInt = misPayments.reduce((s, p) => s + p.monto, 0);
          const salarios = misPayments.filter(p => p.tipo === "SALARIO").length;
          const bonos = misPayments.filter(p => p.tipo === "BONO").length;
          return (
            <div key={n.id} className={cn("rounded-xl border bg-[#111118] p-5 transition-all", n.activo ? "border-white/[0.08]" : "border-white/[0.04] opacity-60")}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white shrink-0", AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length])}>
                    {n.nombre.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">{n.nombre}</p>
                    <span className={cn("inline-block rounded px-1.5 py-0.5 text-[10px] font-medium", ROL_COLORS[n.rol] ?? "bg-white/5 text-white/40")}>{n.rol}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditInt(n)} className="rounded p-1 text-white/30 hover:bg-white/[0.06] hover:text-white/70 transition-colors"><Pencil className="h-3 w-3" /></button>
                  <button onClick={() => setDeleteIntId(n.id)} className="rounded p-1 text-white/30 hover:bg-red-500/10 hover:text-red-400 transition-colors"><Trash2 className="h-3 w-3" /></button>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-white/40">Salario/mes</span>
                  <span className="text-sm font-bold text-white">{fmt(n.salario_mensual)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-white/40">Inicio</span>
                  <span className="text-xs text-white/60">{n.fecha_inicio ?? "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-white/40">Pagos / Bonos</span>
                  <span className="text-xs text-white/60">{salarios} salarios · {bonos} bonos</span>
                </div>
                <div className="flex items-center justify-between border-t border-white/[0.06] pt-2">
                  <span className="text-[11px] text-white/40">Total pagado</span>
                  <span className={cn("text-sm font-bold", totalPagadoInt > 0 ? "text-orange-400" : "text-white/25")}>{fmt(totalPagadoInt)}</span>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                {n.activo
                  ? <span className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-emerald-500/10 py-1 text-[11px] font-medium text-emerald-400 ring-1 ring-emerald-500/20"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Activo</span>
                  : <span className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-white/[0.05] py-1 text-[11px] font-medium text-white/30">Pendiente</span>
                }
                <button
                  onClick={() => setPagoOpen(n.id)}
                  className="flex items-center justify-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1 text-[11px] font-medium text-orange-400 ring-1 ring-orange-500/20 hover:bg-orange-500/20 transition-colors"
                >
                  <Plus className="h-3 w-3" /> Pago
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment history */}
      <div className="rounded-xl border border-white/[0.06] bg-[#111118] overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-white">Historial de pagos</h2>
            <p className="text-xs text-white/40 mt-0.5">{pagos.length} registros · Salarios: {fmt(totalSalarios)} · Bonos: {fmt(totalBonos)}</p>
          </div>
          <Button onClick={() => setPagoOpen("__any__")} variant="outline" className="gap-2 border-white/10 text-white/60 hover:bg-white/[0.05] text-xs h-8">
            <Plus className="h-3.5 w-3.5" /> Registrar pago
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.06] hover:bg-transparent">
              {["Integrante","Mes","Tipo","Monto","Descripción","Fecha pago",""].map((h, i) => (
                <TableHead key={i} className={cn("text-white/40 text-[11px] font-medium uppercase tracking-wider", i === 0 && "pl-5", i === 6 && "pr-5 w-12")}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagos.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center">
                  <Clock className="mx-auto mb-3 h-8 w-8 text-white/20" />
                  <p className="text-sm text-white/40">Sin pagos registrados</p>
                </TableCell>
              </TableRow>
            )}
            {pagos.map((p) => (
              <TableRow key={p.id} className="border-white/[0.04]">
                <TableCell className="pl-5">
                  <span className="text-sm font-semibold text-white">{p.integrante_nombre}</span>
                </TableCell>
                <TableCell><span className="text-xs text-white/60">{p.mes}</span></TableCell>
                <TableCell>
                  {p.tipo === "BONO"
                    ? <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/10 px-2.5 py-0.5 text-[11px] font-medium text-violet-400 ring-1 ring-violet-500/20"><Gift className="h-3 w-3" />BONO</span>
                    : <span className="inline-flex items-center rounded-full bg-orange-500/10 px-2.5 py-0.5 text-[11px] font-medium text-orange-400 ring-1 ring-orange-500/20">SALARIO</span>
                  }
                </TableCell>
                <TableCell><span className="text-sm font-bold text-white">{fmt(p.monto)}</span></TableCell>
                <TableCell><span className="text-xs text-white/50">{p.descripcion ?? "—"}</span></TableCell>
                <TableCell><span className="text-xs text-white/50">{p.fecha_pago ?? "—"}</span></TableCell>
                <TableCell className="pr-5">
                  <button onClick={() => setDeletePagoId(p.id)} className="rounded p-1 text-white/30 hover:bg-red-500/10 hover:text-red-400 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {pagos.length > 0 && (
          <div className="flex items-center justify-between border-t border-white/[0.06] px-5 py-3">
            <span className="text-xs text-white/40">{integrantes.length} miembros en plantilla</span>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-[10px] text-white/35">Pago mensual activos</p>
                <p className="text-sm font-bold text-orange-400">{fmt(pagoMensualActivos)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/35">Total histórico pagado</p>
                <p className="text-sm font-bold text-white">{fmt(totalPagado)}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Integrante Modal */}
      <Dialog open={addIntOpen} onOpenChange={(o) => !o && setAddIntOpen(false)}>
        <DialogContent className="border-[#24243a] bg-[#111118] text-white max-w-md">
          <DialogHeader><DialogTitle className="text-white">Nuevo integrante</DialogTitle></DialogHeader>
          <IntegranteForm initial={EMPTY_INT} onSubmit={handleAddInt} isPending={isPending} />
        </DialogContent>
      </Dialog>

      {/* Edit Integrante Modal */}
      <Dialog open={!!editInt} onOpenChange={(o) => !o && setEditInt(null)}>
        <DialogContent className="border-[#24243a] bg-[#111118] text-white max-w-md">
          <DialogHeader><DialogTitle className="text-white">Editar integrante</DialogTitle></DialogHeader>
          {editInt && (
            <IntegranteForm
              initial={{ nombre: editInt.nombre, rol: editInt.rol, salario_mensual: editInt.salario_mensual, fecha_inicio: editInt.fecha_inicio ?? "", activo: editInt.activo }}
              onSubmit={handleEditInt}
              isPending={isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Integrante Modal */}
      <Dialog open={!!deleteIntId} onOpenChange={(o) => !o && setDeleteIntId(null)}>
        <DialogContent className="border-[#24243a] bg-[#111118] text-white max-w-sm">
          <DialogHeader><DialogTitle className="text-white">¿Eliminar integrante?</DialogTitle></DialogHeader>
          <p className="text-sm text-white/50">Se eliminarán también todos sus pagos registrados.</p>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setDeleteIntId(null)} className="flex-1 border-white/10 text-white/70 hover:bg-white/[0.05]">Cancelar</Button>
            <Button onClick={() => deleteIntId && handleDeleteInt(deleteIntId)} disabled={isPending} className="flex-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20">
              {isPending ? "Eliminando..." : "Eliminar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Registrar Pago Modal */}
      <Dialog open={!!pagoOpen} onOpenChange={(o) => !o && setPagoOpen(null)}>
        <DialogContent className="border-[#24243a] bg-[#111118] text-white max-w-md">
          <DialogHeader><DialogTitle className="text-white">Registrar pago</DialogTitle></DialogHeader>
          {integrantes.length === 0
            ? <p className="text-sm text-white/50">Primero agrega un integrante al equipo.</p>
            : <PagoForm integrantes={integrantes} onSubmit={handleAddPago} isPending={isPending} defaultIntegranteId={pagoOpen !== "__any__" ? (pagoOpen ?? undefined) : undefined} />
          }
        </DialogContent>
      </Dialog>

      {/* Delete Pago Modal */}
      <Dialog open={!!deletePagoId} onOpenChange={(o) => !o && setDeletePagoId(null)}>
        <DialogContent className="border-[#24243a] bg-[#111118] text-white max-w-sm">
          <DialogHeader><DialogTitle className="text-white">¿Eliminar pago?</DialogTitle></DialogHeader>
          <p className="text-sm text-white/50">Esta acción no se puede deshacer.</p>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setDeletePagoId(null)} className="flex-1 border-white/10 text-white/70 hover:bg-white/[0.05]">Cancelar</Button>
            <Button onClick={() => deletePagoId && handleDeletePago(deletePagoId)} disabled={isPending} className="flex-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20">
              {isPending ? "Eliminando..." : "Eliminar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
