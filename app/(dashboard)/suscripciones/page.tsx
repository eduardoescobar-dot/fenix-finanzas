import { createClient } from "@/lib/supabase/server";
import { SuscripcionesClient } from "./client";

export type Suscripcion = {
  id: string;
  nombre: string;
  categoria: string;
  frecuencia: string;
  costo_mensual: number;
  moneda: string;
  fecha_pago: string;
  tarjeta: string;
  proximo_pago: string;
  responsable: string;
  estado: string;
  uso: string;
  necesidad: string;
  notas: string | null;
  correo_asociado: string | null;
  metodo_pago: string | null;
  meses_activo: number | null;
  costo_acumulado: number | null;
  created_at: string;
};

export default async function SuscripcionesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("suscripciones")
    .select("*")
    .order("created_at", { ascending: true });

  return <SuscripcionesClient data={(data ?? []) as Suscripcion[]} />;
}
