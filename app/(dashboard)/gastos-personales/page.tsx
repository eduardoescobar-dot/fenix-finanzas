import { createClient } from "@/lib/supabase/server";
import { GastosPersonalesClient } from "./client";

export type GastoPersonal = {
  id: string;
  fecha: string;
  categoria: string;
  descripcion: string;
  monto: number;
  moneda: string;
  notas: string | null;
  created_at: string;
};

export default async function GastosPersonalesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("gastos_personales")
    .select("*")
    .order("fecha", { ascending: false });

  return <GastosPersonalesClient data={(data ?? []) as GastoPersonal[]} />;
}
