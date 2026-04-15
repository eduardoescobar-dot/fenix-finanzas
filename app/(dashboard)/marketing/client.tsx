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
import { Megaphone, TrendingUp, DollarSign, Target, Plus, Pencil, Trash2 } from "lucide-react";
import {
  addCampana, updateCampana, deleteCampana, type CampanaData,
} from "@/lib/actions";
import type { Campana } from "./page";

const TIPOS = ["ADS", "LLAMADAS", "EMAIL", "ORGANICO", "INFLUENCER", "OTRO"];
const ESTADOS_CAMP = ["ACTIVA", "PAUSADA", "FINALIZADA"];

function fmt(v: number) {
  return `$ ${v.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const EMPTY: CampanaData = {
  nombre: "", tipo: "ADS", proyecto: "FENIX ACADEMY",
  fecha_inicio: "", fecha_fin: "", costo_mensual: 0,
  total_invertido: 0, leads: 0, ventas: 0, ingresos: 0, estado: "ACTIVA",
};

function EstadoBadge({ estado }: { estado: string }) {
  const map: Record<string, string> = {
    ACTIVA: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
    PAUSADA: "bg-yellow-500/10 text-yellow-400 ring-yellow-500/20",
    FINALIZADA: "bg-white/5 text-white/40 ring-white/10",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1", map[estado] ?? map["FINALIZADA"])}>
      {estado}
    </span>
  );
}

function CampanaForm({
  initial, onSubmit, isPending,
}: { initial: CampanaData; onSubmit: (d: CampanaData) => void; isPending: boolean }) {
  const [form, setForm] = useState<CampanaData>(initial);
  const set = (k: keyof CampanaData, v: string | number) => setForm((p) => ({ ...p, [k]: v }));
  const sel = (k: keyof CampanaData) => (e: React.ChangeEvent<HTMLSelectElement>) => set(k, e.target.value);
  const num = (k: keyof CampanaData) => (e: React.ChangeEvent<HTMLInputElement>) => set(k, parseFloat(e.target.value) || 0);
  const selectCls = "h-8 w-full rounded-lg border border-[#24243a] bg-[#1a1a24] px-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500/50";

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs text-slate-400">Nombre *</Label>
          <Input value={form.nombre} onChange={(e) => set("nombre", e.target.value)} required placeholder="META ADS" className="h-8 bg-[#1a1a24] border-[#24243a] text-white text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-slate-400">Tipo</Label>
          <select value={form.tipo} onChange={sel("tipo")} className={selectCls}>
            {TIPOS.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-slate-400">Proyecto</Label>
          <Input value={form.proyecto} onChange={(e) => set("proyecto", e.target.value)} placeholder="FENIX ACADEMY" className="h-8 bg-[#1a1a24] border-[#24243a] text-white text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-slate-400">Estado</Label>
          <select value={form.estado} onChange={sel("estado")} className={selectCls}>
            {ESTADOS_CAMP.map(e => <option key={e}>{e}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-slate-400">Fecha inicio</Label>
          <Input value={form.fecha_inicio} onChange={(e) => set("fecha_inicio", e.target.value)} placeholder="01/04/2026" className="h-8 bg-[#1a1a24] border-[#24243a] text-white text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-slate-400">Fecha fin</Label>
          <Input value={form.fecha_fin} onChange={(e) => set("fecha_fin", e.target.value)} placeholder="Dejar vacío si sigue activa" className="h-8 bg-[#1a1a24] border-[#24243a] text-white text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-slate-400">Costo/mes</Label>
          <Input type="number" step="0.01" value={form.costo_mensual} onChange={num("costo_mensual")} className="h-8 bg-[#1a1a24] border-[#24243a] text-white text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-slate-400">Total invertido</Label>
          <Input type="number" step="0.01" value={form.total_invertido} onChange={num("total_invertido")} className="h-8 bg-[#1a1a24] border-[#24243a] text-white text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-slate-400">Leads</Label>
          <Input type="number" value={form.leads} onChange={(e) => set("leads", parseInt(e.target.value) || 0)} className="h-8 bg-[#1a1a24] border-[#24243a] text-white text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-slate-400">Ventas</Label>
          <Input type="number" value={form.ventas} onChange={(e) => set("ventas", parseInt(e.target.value) || 0)} className="h-8 bg-[#1a1a24] border-[#24243a] text-white text-sm" />
        </div>
        <div className="space-y-1 col-span-2">
          <Label className="text-xs text-slate-400">Ingresos generados</Label>
          <Input type="number" step="0.01" value={form.ingresos} onChange={num("ingresos")} className="h-8 bg-[#1a1a24] border-[#24243a] text-white text-sm" />
        </div>
      </div>
      <Button type="submit" disabled={isPending} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold">
        {isPending ? "Guardando..." : "Guardar"}
      </Button>
    </form>
  );
}

export function MarketingClient({ data }: { data: Campana[] }) {
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<Campana | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const activas = data.filter(c => c.estado === "ACTIVA");
  const totalInvertido = data.reduce((s, c) => s + c.total_invertido, 0);
  const totalIngresos = data.reduce((s, c) => s + c.ingresos, 0);
  const roas = totalInvertido > 0 ? (totalIngresos / totalInvertido).toFixed(2) : "0.00";

  function handleAdd(formData: CampanaData) {
    startTransition(async () => {
      const res = await addCampana(formData);
      if (res.error) { toast.error(res.error); return; }
      toast.success("Campaña agregada");
      setAddOpen(false);
    });
  }

  function handleEdit(formData: CampanaData) {
    if (!editItem) return;
    startTransition(async () => {
      const res = await updateCampana(editItem.id, formData);
      if (res.error) { toast.error(res.error); return; }
      toast.success("Campaña actualizada");
      setEditItem(null);
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const res = await deleteCampana(id);
      if (res.error) { toast.error(res.error); return; }
      toast.success("Campaña eliminada");
      setDeleteId(null);
    });
  }

  return (
    <div className="flex flex-col gap-6 p-6 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Marketing</h1>
          <p className="mt-0.5 text-sm text-white/40">Campañas y rendimiento publicitario</p>
        </div>
        <Button onClick={() => setAddOpen(true)} className="gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm">
          <Plus className="h-4 w-4" /> Nueva campaña
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-4">
          <div className="mb-2 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-orange-400" />
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">Total invertido</p>
          </div>
          <p className="text-xl font-bold text-white">{fmt(totalInvertido)}</p>
          <p className="mt-0.5 text-[11px] text-white/35">en todas las campañas</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-4">
          <div className="mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-white/40" />
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">Total ingresos</p>
          </div>
          <p className={cn("text-xl font-bold", totalIngresos > 0 ? "text-emerald-400" : "text-white/30")}>{fmt(totalIngresos)}</p>
          <p className="mt-0.5 text-[11px] text-white/35">atribuidos a campañas</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-4">
          <div className="mb-2 flex items-center gap-2">
            <Target className="h-4 w-4 text-white/40" />
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">ROAS</p>
          </div>
          <p className={cn("text-xl font-bold", parseFloat(roas) >= 2 ? "text-emerald-400" : "text-white/30")}>{roas}x</p>
          <p className="mt-0.5 text-[11px] text-white/35">retorno sobre inversión</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-4">
          <div className="mb-2 flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-white/40" />
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">Campañas activas</p>
          </div>
          <p className="text-xl font-bold text-white">{activas.length}</p>
          <p className="mt-0.5 text-[11px] text-white/35">de {data.length} total</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/[0.06] bg-[#111118] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.06] hover:bg-transparent">
              {["Campaña","Tipo","Proyecto","Fecha inicio","Invertido","Leads","Ventas","Ingresos","ROAS","Estado",""].map((h, i) => (
                <TableHead key={i} className={cn("text-white/40 text-[11px] font-medium uppercase tracking-wider", i === 0 && "pl-4", i === 10 && "pr-4 w-16")}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={11} className="py-12 text-center">
                  <Megaphone className="mx-auto mb-3 h-8 w-8 text-white/20" />
                  <p className="text-sm text-white/40">Sin campañas registradas</p>
                </TableCell>
              </TableRow>
            )}
            {data.map((c) => {
              const campRoas = c.total_invertido > 0 ? (c.ingresos / c.total_invertido).toFixed(2) : "—";
              return (
                <TableRow key={c.id} className="border-white/[0.04]">
                  <TableCell className="pl-4 font-semibold text-sm text-white">{c.nombre}</TableCell>
                  <TableCell><span className="rounded bg-orange-500/10 px-1.5 py-0.5 text-[10px] font-medium text-orange-400">{c.tipo}</span></TableCell>
                  <TableCell><span className="text-xs text-white/50">{c.proyecto}</span></TableCell>
                  <TableCell><span className="text-xs text-white/50">{c.fecha_inicio}</span></TableCell>
                  <TableCell><span className="text-sm font-semibold text-white">{fmt(c.total_invertido)}</span></TableCell>
                  <TableCell><span className="text-sm text-white/70">{c.leads}</span></TableCell>
                  <TableCell><span className="text-sm text-white/70">{c.ventas}</span></TableCell>
                  <TableCell><span className={cn("text-sm font-semibold", c.ingresos > 0 ? "text-emerald-400" : "text-white/30")}>{fmt(c.ingresos)}</span></TableCell>
                  <TableCell><span className={cn("text-sm font-bold", campRoas !== "—" && parseFloat(campRoas) >= 2 ? "text-emerald-400" : "text-white/40")}>{campRoas === "—" ? "—" : `${campRoas}x`}</span></TableCell>
                  <TableCell><EstadoBadge estado={c.estado} /></TableCell>
                  <TableCell className="pr-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setEditItem(c)} className="rounded p-1 text-white/30 hover:bg-white/[0.06] hover:text-white/70 transition-colors"><Pencil className="h-3.5 w-3.5" /></button>
                      <button onClick={() => setDeleteId(c.id)} className="rounded p-1 text-white/30 hover:bg-red-500/10 hover:text-red-400 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {data.length > 0 && (
          <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-3">
            <span className="text-xs text-white/40">{activas.length} activa{activas.length !== 1 ? "s" : ""} · {data.length - activas.length} inactiva{data.length - activas.length !== 1 ? "s" : ""}</span>
            <span className="text-xs text-white/40">Total leads: <span className="text-white font-semibold">{data.reduce((s, c) => s + c.leads, 0)}</span></span>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Dialog open={addOpen} onOpenChange={(o) => !o && setAddOpen(false)}>
        <DialogContent className="border-[#24243a] bg-[#111118] text-white max-w-lg">
          <DialogHeader><DialogTitle className="text-white">Nueva campaña</DialogTitle></DialogHeader>
          <CampanaForm initial={EMPTY} onSubmit={handleAdd} isPending={isPending} />
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)}>
        <DialogContent className="border-[#24243a] bg-[#111118] text-white max-w-lg">
          <DialogHeader><DialogTitle className="text-white">Editar campaña</DialogTitle></DialogHeader>
          {editItem && (
            <CampanaForm
              initial={{ nombre: editItem.nombre, tipo: editItem.tipo, proyecto: editItem.proyecto, fecha_inicio: editItem.fecha_inicio ?? "", fecha_fin: editItem.fecha_fin ?? "", costo_mensual: editItem.costo_mensual, total_invertido: editItem.total_invertido, leads: editItem.leads, ventas: editItem.ventas, ingresos: editItem.ingresos, estado: editItem.estado }}
              onSubmit={handleEdit}
              isPending={isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="border-[#24243a] bg-[#111118] text-white max-w-sm">
          <DialogHeader><DialogTitle className="text-white">¿Eliminar campaña?</DialogTitle></DialogHeader>
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
