import { createClient } from "@/lib/supabase/server";
import { MarketingClient } from "./client";

export type Campana = {
  id: string;
  nombre: string;
  tipo: string;
  proyecto: string;
  fecha_inicio: string;
  fecha_fin: string | null;
  costo_mensual: number;
  total_invertido: number;
  leads: number;
  ventas: number;
  ingresos: number;
  estado: string;
  created_at: string;
};

export default async function MarketingPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("campanas_marketing")
    .select("*")
    .order("created_at", { ascending: true });

  return <MarketingClient data={(data ?? []) as Campana[]} />;
}
