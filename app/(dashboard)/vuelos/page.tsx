import { createClient } from "@/lib/supabase/server";

export type Vuelo = {
  id: string;
  fecha: string;
  año: number;
  aerolinea: string;
  confirmacion: string;
  ruta: string | null;
  monto: number;
  moneda: string;
  tipo_viaje: string;
  deducible: boolean;
  pasajero: string;
  notas: string | null;
  created_at: string;
};

export default async function VuelosPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("vuelos")
    .select("*")
    .order("fecha", { ascending: false });

  const vuelos = (data ?? []) as Vuelo[];

  function fmt(v: number) {
    return `$ ${v.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  const total2024 = vuelos.filter(v => v.año === 2024 && v.deducible).reduce((s, v) => s + v.monto, 0);
  const total2025 = vuelos.filter(v => v.año === 2025 && v.deducible).reduce((s, v) => s + v.monto, 0);
  const totalDeducible = total2024 + total2025;
  const _noDeducible = vuelos.filter(v => !v.deducible).reduce((s, v) => s + v.monto, 0);
  const sinPrecio = vuelos.filter(v => v.monto === 0 && v.deducible).length;

  const AEROL_STYLE: Record<string, string> = {
    'Delta Air Lines':   'bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/20',
    'Spirit Airlines':   'bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/20',
    'Frontier Airlines': 'bg-green-500/10 text-green-400 ring-1 ring-green-500/20',
    'American Airlines': 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20',
  };

  const byYear = [2025, 2024].map(year => ({
    year,
    items: vuelos.filter(v => v.año === year),
    totalDeducible: vuelos.filter(v => v.año === year && v.deducible).reduce((s, v) => s + v.monto, 0),
  }));

  return (
    <div className="flex flex-col gap-6 p-6 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Vuelos</h1>
          <p className="mt-0.5 text-sm text-white/40">Historial de vuelos 2024–2025 · Auditoría fiscal</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-sky-500/20 bg-sky-500/5 px-3 py-1.5">
          <span className="text-sm">✈️</span>
          <span className="text-xs text-sky-400 font-medium">{vuelos.length} vuelos registrados</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border border-sky-500/20 bg-gradient-to-br from-sky-500/10 to-transparent p-5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">Total Deducible</p>
          <p className="mt-2 text-2xl font-bold text-sky-400">{fmt(totalDeducible)}</p>
          <p className="mt-1 text-xs text-white/35">2024 + 2025 (sujeto a propósito)</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">Deducible 2024</p>
          <p className="mt-2 text-2xl font-bold text-white">{fmt(total2024)}</p>
          <p className="mt-1 text-xs text-white/35">{vuelos.filter(v => v.año === 2024 && v.deducible).length} vuelos Delta</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">Deducible 2025</p>
          <p className="mt-2 text-2xl font-bold text-white">{fmt(total2025)}</p>
          <p className="mt-1 text-xs text-white/35">{vuelos.filter(v => v.año === 2025 && v.deducible).length} vuelos</p>
        </div>
        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">Pendientes</p>
          <p className="mt-2 text-2xl font-bold text-yellow-400">{sinPrecio}</p>
          <p className="mt-1 text-xs text-white/35">vuelos sin precio confirmado</p>
        </div>
      </div>

      {/* Alerta precio pendiente */}
      {sinPrecio > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
          <span className="text-lg mt-0.5">⚠️</span>
          <div>
            <p className="text-sm font-medium text-yellow-300">{sinPrecio} vuelo(s) sin precio confirmado</p>
            <p className="mt-0.5 text-xs text-white/45">
              Spirit RM4SNW (ATL→LAS Abr 2025) y American UEJSKB (May 2025) — buscar confirmaciones originales en Expedia/aerolinea.
            </p>
          </div>
        </div>
      )}

      {/* Tables by year */}
      {byYear.map(({ year, items, totalDeducible: ytd }) => (
        <div key={year} className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white/70">{year}</h2>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-white/40">Deducible:</span>
              <span className="font-bold text-sky-400">{fmt(ytd)}</span>
            </div>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-[#111118] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {["Fecha","Aerolínea","Confm.","Ruta","Pasajero","Deducible","Monto"].map((h, i) => (
                    <th key={i} className={`py-3 text-left text-[11px] font-medium uppercase tracking-wider text-white/40 ${i === 0 ? 'pl-4' : 'px-3'} ${i === 6 ? 'pr-4 text-right' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((v) => (
                  <tr key={v.id} className={`border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors ${!v.deducible ? 'opacity-50' : ''}`}>
                    <td className="pl-4 py-3 font-mono text-xs text-white/60">{v.fecha}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${AEROL_STYLE[v.aerolinea] ?? 'bg-white/5 text-white/50 ring-1 ring-white/10'}`}>
                        {v.aerolinea.replace(' Air Lines','').replace(' Airlines','')}
                      </span>
                    </td>
                    <td className="px-3 py-3 font-mono text-xs font-semibold text-white/70">{v.confirmacion}</td>
                    <td className="px-3 py-3 text-xs text-white/60 max-w-[160px] truncate">{v.ruta ?? '—'}</td>
                    <td className="px-3 py-3 text-xs text-white/50">{v.pasajero}</td>
                    <td className="px-3 py-3">
                      {v.deducible
                        ? <span className="inline-flex rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400 ring-1 ring-emerald-500/20">✓ Sí</span>
                        : <span className="inline-flex rounded-full bg-red-500/10 px-2.5 py-0.5 text-[11px] font-medium text-red-400 ring-1 ring-red-500/20">✗ No</span>
                      }
                    </td>
                    <td className="pr-4 py-3 text-right">
                      {v.monto === 0
                        ? <span className="text-xs text-yellow-400/70">N/D</span>
                        : <span className="font-bold text-white">$ {v.monto.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-white/[0.06]">
                  <td colSpan={6} className="pl-4 py-3 text-xs font-semibold text-white/50">{items.length} vuelos</td>
                  <td className="pr-4 py-3 text-right text-sm font-bold text-sky-400">{fmt(ytd)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ))}

      {/* Nota legal */}
      <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-5">
        <h2 className="mb-3 text-sm font-semibold text-white">Notas para el contador</h2>
        <ul className="space-y-2 text-xs text-white/50">
          <li>• Para que un vuelo sea deducible se requiere documentar el <strong className="text-white/70">propósito de negocio</strong> de cada viaje.</li>
          <li>• El boleto de <strong className="text-yellow-400">MARIA REINA HERNANDEZ</strong> ($598.48) está marcado como NO DEDUCIBLE — es gasto familiar.</li>
          <li>• Spirit ONHDPD (cancelado): verificar si fue reembolsado. Si no, puede ser deducible.</li>
          <li>• Spirit RM4SNW y AA UEJSKB: precios pendientes de confirmación — buscar en Expedia o email original.</li>
        </ul>
      </div>
    </div>
  );
}
