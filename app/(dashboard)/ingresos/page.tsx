import { createClient } from "@/lib/supabase/server";
import {
  IngresosAnioChart,
  IngresosTendenciaChart,
} from "@/components/dashboard/IngresosChart";

function fmt(v: number) {
  return `$ ${v.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

type CampanaRow = {
  id: string;
  nombre: string;
  tipo: string;
  fecha_inicio: string;
  ingresos: number;
};

type Ingreso = {
  id: string;
  fecha_inicio: string;
  año: number;
  fuente: string;
  descripcion: string;
  monto: number;
  tipo: "COMISION" | "ZELLE" | "STRIPE" | "OTRO";
  estado: "CONFIRMADO" | "PENDIENTE" | "ANULADO";
};

function mapTipo(tipo: string): Ingreso["tipo"] {
  if (tipo === "COMISION_2024") return "COMISION";
  if (tipo === "ZELLE_SPARTANS_2024") return "ZELLE";
  if (tipo === "STRIPE_PAYOUT") return "STRIPE";
  return "OTRO";
}

function mapFuente(tipo: string): string {
  if (tipo === "COMISION_2024") return "RAUL LUNA ACADEMY, LLC";
  if (tipo === "ZELLE_SPARTANS_2024") return "SPARTANS PROGRAM — ZELLE";
  if (tipo === "STRIPE_PAYOUT") return "STRIPE / FÉNIX ACADEMY LLC";
  return "OTRO";
}

const TIPO_STYLE: Record<string, string> = {
  COMISION: "bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20",
  STRIPE:   "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20",
  ZELLE:    "bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/20",
  OTRO:     "bg-white/5 text-white/40 ring-1 ring-white/10",
};

const ESTADO_STYLE: Record<string, string> = {
  CONFIRMADO: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20",
  PENDIENTE:  "bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/20",
  ANULADO:    "bg-red-500/10 text-red-400 ring-1 ring-red-500/20",
};

export default async function IngresosPage() {
  const supabase = await createClient();

  const { data: campanas } = await supabase
    .from("campanas_marketing")
    .select("id,nombre,tipo,fecha_inicio,ingresos")
    .in("tipo", ["COMISION_2024", "ZELLE_SPARTANS_2024", "STRIPE_PAYOUT"])
    .gt("ingresos", 0)
    .order("fecha_inicio", { ascending: false });

  const rows = (campanas ?? []) as CampanaRow[];

  const ingresos: Ingreso[] = rows.map((r) => ({
    id: r.id,
    fecha: r.fecha_inicio ?? "",
    año: r.fecha_inicio ? new Date(r.fecha_inicio).getFullYear() : 0,
    fuente: mapFuente(r.tipo),
    descripcion: r.nombre,
    monto: r.ingresos,
    tipo: mapTipo(r.tipo),
    estado: "CONFIRMADO",
  }));

  const total2024 = ingresos.filter((i) => i.año === 2024).reduce((s, i) => s + i.monto, 0);
  const total2025 = ingresos.filter((i) => i.año === 2025).reduce((s, i) => s + i.monto, 0);
  const totalGeneral = total2024 + total2025;
  const comisiones2024 = ingresos.filter((i) => i.año === 2024 && i.tipo === "COMISION").reduce((s, i) => s + i.monto, 0);
  const zelle2024 = ingresos.filter((i) => i.año === 2024 && i.tipo === "ZELLE").reduce((s, i) => s + i.monto, 0);
  const stripe2025 = ingresos.filter((i) => i.año === 2025 && i.tipo === "STRIPE").reduce((s, i) => s + i.monto, 0);
  const growth = total2024 > 0 ? ((total2025 - total2024) / total2024 * 100).toFixed(1) : "0";

  // Chart data: monthly by year
  const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  const monthly2024 = Array(12).fill(0);
  const monthly2025 = Array(12).fill(0);
  ingresos.forEach((i) => {
    const m = new Date(i.fecha).getMonth();
    if (i.año === 2024) monthly2024[m] += i.monto;
    if (i.año === 2025) monthly2025[m] += i.monto;
  });

  const tendenciaData = meses.map((mes, idx) => ({
    mes,
    "2024": Math.round(monthly2024[idx]),
    "2025": Math.round(monthly2025[idx]),
  }));

  const anioData = [
    { año: "2024", comisiones: Math.round(comisiones2024), zelle: Math.round(zelle2024), stripe: 0 },
    { año: "2025", comisiones: 0, zelle: 0, stripe: Math.round(stripe2025) },
  ];

  const byYear = [2025, 2024]
    .map((year) => ({
      year,
      items: ingresos.filter((i) => i.año === year),
      total: ingresos.filter((i) => i.año === year).reduce((s, i) => s + i.monto, 0),
    }))
    .filter((y) => y.items.length > 0);

  return (
    <div className="flex flex-col gap-6 p-6 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Ingresos</h1>
          <p className="mt-0.5 text-sm text-white/40">Historial completo 2024–2025 · Auditoría fiscal</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="text-xs text-emerald-400 font-medium">{ingresos.length} registros</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="col-span-2 rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">Total General</p>
          <p className="mt-2 text-3xl font-bold text-emerald-400">{fmt(totalGeneral)}</p>
          <p className="mt-1 text-xs text-white/35">2024 + 2025 combinado · {ingresos.length} transacciones</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">Total 2024</p>
          <p className="mt-2 text-2xl font-bold text-white">{fmt(total2024)}</p>
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-white/40">Comisiones RL</span>
              <span className="text-violet-400">{fmt(comisiones2024)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/40">Zelle Spartans</span>
              <span className="text-sky-400">{fmt(zelle2024)}</span>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">Total 2025</p>
          <p className="mt-2 text-2xl font-bold text-white">{fmt(total2025)}</p>
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-white/40">Stripe Payouts</span>
              <span className="text-emerald-400">{fmt(stripe2025)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/40">Crecimiento vs 2024</span>
              <span className="text-emerald-400">+{growth}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-5">
          <div className="mb-1">
            <h2 className="text-sm font-semibold text-white">Tendencia mensual</h2>
            <p className="text-xs text-white/40">Comparativa 2024 vs 2025 mes a mes</p>
          </div>
          <div className="h-52 mt-4">
            <IngresosTendenciaChart data={tendenciaData} />
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-5">
          <div className="mb-1">
            <h2 className="text-sm font-semibold text-white">Ingresos por año y fuente</h2>
            <p className="text-xs text-white/40">Desglose por tipo de ingreso</p>
          </div>
          <div className="h-52 mt-4">
            <IngresosAnioChart data={anioData} />
          </div>
        </div>
      </div>

      {/* Tables by year */}
      {byYear.map(({ year, items, total }) => (
        <div key={year} className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white/70">{year}</h2>
            <span className="text-sm font-bold text-white">{fmt(total)}</span>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-[#111118] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {["Fecha","Fuente","Descripción","Tipo","Estado","Monto"].map((h, i) => (
                    <th
                      key={i}
                      className={`py-3 text-left text-[11px] font-medium uppercase tracking-wider text-white/40 ${i === 0 ? "pl-4" : "px-3"} ${i === 5 ? "pr-4 text-right" : ""}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-sm text-white/30">Sin registros</td>
                  </tr>
                )}
                {items.map((ing) => (
                  <tr key={ing.id} className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="pl-4 py-3 font-mono text-xs text-white/60">{ing.fecha}</td>
                    <td className="px-3 py-3 text-xs text-white/70 max-w-[180px] truncate">{ing.fuente}</td>
                    <td className="px-3 py-3 text-xs text-white/50 max-w-[200px] truncate">{ing.descripcion}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${TIPO_STYLE[ing.tipo] ?? TIPO_STYLE.OTRO}`}>
                        {ing.tipo}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${ESTADO_STYLE[ing.estado]}`}>
                        {ing.estado}
                      </span>
                    </td>
                    <td className="pr-4 py-3 text-right font-bold text-white">
                      $ {ing.monto.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-white/[0.06]">
                  <td colSpan={5} className="pl-4 py-3 text-xs font-semibold text-white/50">
                    {items.length} registros
                  </td>
                  <td className="pr-4 py-3 text-right text-sm font-bold text-emerald-400">{fmt(total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
