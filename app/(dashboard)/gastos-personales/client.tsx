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
import { Wallet, TrendingUp, Plus, Pencil, Trash2, Filter } from "lucide-react";
import {
  addGastoPersonal, updateGastoPersonal, deleteGastoPersonal, type GastoPersonalData,
} from "@/lib/actions";
import type { GastoPersonal } from "./page";

// Categorías alineadas con lo que hay en DB + las que se pueden agregar
const CATEGORIAS = [
  "VIVIENDA",
  "TELECOM",
  "SEGURO",
  "INVERSION",
  "COMIDAS",
  "VIAJE",
  "COMPRA",
  "MENTORIA",
  "OTRO",
] as const;
type Categoria = typeof CATEGORIAS[number];
const TODAS_CATS = ["TODAS", ...CATEGORIAS] as const;
const MONEDAS = ["USD", "MXN"];

const CAT_STYLE: Record<Categoria, string> = {
  VIVIENDA:  "bg-sky-500/10 text-sky-400 ring-sky-500/20",
  TELECOM:   "bg-violet-500/10 text-violet-400 ring-violet-500/20",
  SEGURO:    "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
  INVERSION: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
  COMIDAS:   "bg-orange-500/10 text-orange-400 ring-orange-500/20",
  VIAJE:     "bg-cyan-500/10 text-cyan-400 ring-cyan-500/20",
  COMPRA:    "bg-pink-500/10 text-pink-400 ring-pink-500/20",
  MENTORIA:  "bg-purple-500/10 text-purple-400 ring-purple-500/20",
  OTRO:      "bg-white/5 text-white/40 ring-white/10",
};

const CAT_ICON: Record<Categoria, string> = {
  VIVIENDA:  "🏠",
  TELECOM:   "📱",
  SEGURO:    "🛡️",
  INVERSION: "📈",
  COMIDAS:   "🍽️",
  VIAJE:     "✈️",
  COMPRA:    "🛒",
  MENTORIA:  "🎓",
  OTRO:      "💸",
};

function fmt(v: number, moneda = "USD") {
  const sym = moneda === "MXN" ? "MX$" : "$";
  return `${sym} ${v.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getCatStyle(cat: string): string {
  return CAT_STYLE[cat as Categoria] ?? CAT_STYLE.OTRO;
}
function getCatIcon(cat: string): string {
  return CAT_ICON[cat as Categoria] ?? CAT_ICON.OTRO;
}

const EMPTY: GastoPersonalData = {
  fecha: "", categoria: "OTRO", descripcion: "", monto: 0, moneda: "USD", notas: "",
};

function GastoForm({
  initial, onSubmit, isPending,
}: { initial: GastoPersonalData; onSubmit: (d: GastoPersonalData) => void; isPending: boolean }) {
  const [form, setForm] = useState<GastoPersonalData>(initial);
  const set = (k: keyof GastoPersonalData, v: string | number) => setForm((p) => ({ ...p, [k]: v }));
  const selectCls = "h-8 w-full rounded-lg border border-[#24243a] bg-[#1a1a24] px-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500/50";

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1 col-span-2">
          <Label className="text-xs text-slate-400">Descripción *</Label>
          <Input
            value={form.descripcion}
            onChange={(e) => set("descripcion", e.target.value)}
            required
            placeholder="Ej: Renta, Cricket, Vuelo ATL→MIA..."
            className="h-8 bg-[#1a1a24] border-[#24243a] text-white text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-slate-400">Categoría</Label>
          <select value={form.categoria} onChange={(e) => set("categoria", e.target.value)} className={selectCls}>
            {CATEGORIAS.map(c => (
              <option key={c} value={c}>{getCatIcon(c)} {c}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-slate-400">Fecha *</Label>
          <Input
            value={form.fecha}
            onChange={(e) => set("fecha", e.target.value)}
            required
            placeholder="2026-04-15"
            className="h-8 bg-[#1a1a24] border-[#24243a] text-white text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-slate-400">Monto *</Label>
          <Input
            type="number"
            step="0.01"
            value={form.monto}
            onChange={(e) => set("monto", parseFloat(e.target.value) || 0)}
            required
            className="h-8 bg-[#1a1a24] border-[#24243a] text-white text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-slate-400">Moneda</Label>
          <select value={form.moneda} onChange={(e) => set("moneda", e.target.value)} className={selectCls}>
            {MONEDAS.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div className="space-y-1 col-span-2">
          <Label className="text-xs text-slate-400">Notas</Label>
          <Input
            value={form.notas}
            onChange={(e) => set("notas", e.target.value)}
            placeholder="Opcional"
            className="h-8 bg-[#1a1a24] border-[#24243a] text-white text-sm"
          />
        </div>
      </div>
      <Button type="submit" disabled={isPending} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold">
        {isPending ? "Guardando..." : "Guardar gasto"}
      </Button>
    </form>
  );
}

export function GastosPersonalesClient({ data }: { data: GastoPersonal[] }) {
  const [catFiltro, setCatFiltro] = useState<string>("TODAS");
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<GastoPersonal | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const estesMes = data.filter(g => g.fecha?.substring(0, 7) === currentMonth);
  const totalMes = estesMes.reduce((s, g) => s + g.monto, 0);
  const totalHistorico = data.reduce((s, g) => s + g.monto, 0);

  // Breakdown by category (only categories that have data)
  const porCategoria = CATEGORIAS
    .map(cat => ({
      cat,
      total: data.filter(g => g.categoria === cat).reduce((s, g) => s + g.monto, 0),
      count: data.filter(g => g.categoria === cat).length,
    }))
    .filter(x => x.count > 0)
    .sort((a, b) => b.total - a.total);

  // Apply category filter
  const filtered = catFiltro === "TODAS"
    ? data
    : data.filter(g => g.categoria === catFiltro);

  const totalFiltrado = filtered.reduce((s, g) => s + g.monto, 0);

  function handleAdd(formData: GastoPersonalData) {
    startTransition(async () => {
      const res = await addGastoPersonal(formData);
      if (res.error) { toast.error(res.error); return; }
      toast.success("Gasto registrado");
      setAddOpen(false);
    });
  }

  function handleEdit(formData: GastoPersonalData) {
    if (!editItem) return;
    startTransition(async () => {
      const res = await updateGastoPersonal(editItem.id, formData);
      if (res.error) { toast.error(res.error); return; }
      toast.success("Gasto actualizado");
      setEditItem(null);
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const res = await deleteGastoPersonal(id);
      if (res.error) { toast.error(res.error); return; }
      toast.success("Gasto eliminado");
      setDeleteId(null);
    });
  }

  return (
    <div className="flex flex-col gap-6 p-6 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Gastos Personales</h1>
          <p className="mt-0.5 text-sm text-white/40">Vivienda, telecom, seguros, comidas, viajes y más</p>
        </div>
        <Button onClick={() => setAddOpen(true)} className="gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm">
          <Plus className="h-4 w-4" /> Nuevo gasto
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-transparent p-4">
          <div className="mb-2 flex items-center gap-2">
            <Wallet className="h-4 w-4 text-orange-400" />
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">Este mes</p>
          </div>
          <p className="text-xl font-bold text-orange-400">{fmt(totalMes)}</p>
          <p className="mt-0.5 text-[11px] text-white/35">{estesMes.length} gasto{estesMes.length !== 1 ? "s" : ""} registrados</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-4">
          <div className="mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-white/40" />
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">Total histórico</p>
          </div>
          <p className="text-xl font-bold text-white">{fmt(totalHistorico)}</p>
          <p className="mt-0.5 text-[11px] text-white/35">{data.length} registros totales</p>
        </div>
        {porCategoria.slice(0, 2).map(({ cat, total, count }) => (
          <button
            key={cat}
            onClick={() => setCatFiltro(catFiltro === cat ? "TODAS" : cat)}
            className={cn(
              "rounded-xl border p-4 text-left transition-all",
              catFiltro === cat
                ? "border-orange-500/40 bg-orange-500/10"
                : "border-white/[0.06] bg-[#111118] hover:border-white/[0.12]"
            )}
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm">{getCatIcon(cat)}</span>
              <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">{cat}</p>
            </div>
            <p className="text-xl font-bold text-white">{fmt(total)}</p>
            <p className="mt-0.5 text-[11px] text-white/35">{count} registro{count !== 1 ? "s" : ""}</p>
          </button>
        ))}
      </div>

      {/* Category breakdown cards */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {porCategoria.map(({ cat, total, count }) => (
          <button
            key={cat}
            onClick={() => setCatFiltro(catFiltro === cat ? "TODAS" : cat)}
            className={cn(
              "flex items-center justify-between rounded-lg border px-3 py-2.5 transition-all text-left",
              catFiltro === cat
                ? "border-orange-500/40 bg-orange-500/10"
                : "border-white/[0.06] bg-[#111118] hover:border-white/[0.12] hover:bg-white/[0.03]"
            )}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">{getCatIcon(cat)}</span>
              <div>
                <p className="text-[10px] font-medium text-white/50">{cat}</p>
                <p className="text-xs font-bold text-white">{fmt(total)}</p>
              </div>
            </div>
            <span className="text-[10px] text-white/30">{count}</span>
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-3.5 w-3.5 text-white/30" />
        <div className="flex flex-wrap gap-1.5">
          {TODAS_CATS.filter(cat => cat === "TODAS" || data.some(g => g.categoria === cat)).map((cat) => (
            <button
              key={cat}
              onClick={() => setCatFiltro(cat)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-all",
                catFiltro === cat
                  ? "bg-orange-500 text-white shadow-[0_0_10px_rgba(249,115,22,0.3)]"
                  : "bg-white/[0.05] text-white/50 hover:bg-white/[0.08] hover:text-white/80"
              )}
            >
              {cat !== "TODAS" && <span className="mr-1">{getCatIcon(cat)}</span>}
              {cat}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs text-white/30">
          {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
          {catFiltro !== "TODAS" && ` · ${fmt(totalFiltrado)}`}
        </span>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/[0.06] bg-[#111118] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.06] hover:bg-transparent">
              {["Fecha", "Categoría", "Descripción", "Monto", "Moneda", "Notas", ""].map((h, i) => (
                <TableHead
                  key={i}
                  className={cn(
                    "text-white/40 text-[11px] font-medium uppercase tracking-wider",
                    i === 0 && "pl-4",
                    i === 6 && "pr-4 w-16"
                  )}
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center">
                  <Wallet className="mx-auto mb-3 h-8 w-8 text-white/20" />
                  <p className="text-sm text-white/40">
                    {catFiltro === "TODAS"
                      ? "Sin gastos personales registrados"
                      : `Sin gastos en categoría ${catFiltro}`}
                  </p>
                  <p className="text-xs text-white/25 mt-1">
                    Agrega vivienda, telecom, comidas, viajes…
                  </p>
                </TableCell>
              </TableRow>
            )}
            {filtered.map((g) => (
              <TableRow key={g.id} className="border-white/[0.04] hover:bg-white/[0.015] transition-colors">
                <TableCell className="pl-4">
                  <span className="text-xs text-white/60 font-mono">{g.fecha}</span>
                </TableCell>
                <TableCell>
                  <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1", getCatStyle(g.categoria))}>
                    <span>{getCatIcon(g.categoria)}</span>
                    {g.categoria}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-white">{g.descripcion}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-bold text-white">{fmt(g.monto, g.moneda)}</span>
                </TableCell>
                <TableCell>
                  <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-mono text-white/50">{g.moneda}</span>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-white/40">{g.notas ?? "—"}</span>
                </TableCell>
                <TableCell className="pr-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => setEditItem(g)}
                      className="rounded p-1 text-white/30 hover:bg-white/[0.06] hover:text-white/70 transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteId(g.id)}
                      className="rounded p-1 text-white/30 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filtered.length > 0 && (
          <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-3">
            <span className="text-xs text-white/40">
              {filtered.length} gasto{filtered.length !== 1 ? "s" : ""}
              {catFiltro !== "TODAS" && ` · ${catFiltro}`}
            </span>
            <span className="text-sm font-bold text-orange-400">{fmt(totalFiltrado)}</span>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Dialog open={addOpen} onOpenChange={(o) => !o && setAddOpen(false)}>
        <DialogContent className="border-[#24243a] bg-[#111118] text-white max-w-md">
          <DialogHeader><DialogTitle className="text-white">Nuevo gasto personal</DialogTitle></DialogHeader>
          <GastoForm initial={EMPTY} onSubmit={handleAdd} isPending={isPending} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)}>
        <DialogContent className="border-[#24243a] bg-[#111118] text-white max-w-md">
          <DialogHeader><DialogTitle className="text-white">Editar gasto</DialogTitle></DialogHeader>
          {editItem && (
            <GastoForm
              initial={{
                fecha: editItem.fecha,
                categoria: editItem.categoria,
                descripcion: editItem.descripcion,
                monto: editItem.monto,
                moneda: editItem.moneda,
                notas: editItem.notas ?? "",
              }}
              onSubmit={handleEdit}
              isPending={isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="border-[#24243a] bg-[#111118] text-white max-w-sm">
          <DialogHeader><DialogTitle className="text-white">¿Eliminar gasto?</DialogTitle></DialogHeader>
          <p className="text-sm text-white/50">Esta acción no se puede deshacer.</p>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setDeleteId(null)} className="flex-1 border-white/10 text-white/70 hover:bg-white/[0.05]">Cancelar</Button>
            <Button
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={isPending}
              className="flex-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20"
            >
              {isPending ? "Eliminando..." : "Eliminar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
