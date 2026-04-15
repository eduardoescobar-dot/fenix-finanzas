import { createClient } from "@/lib/supabase/server";
import { NominasClient } from "./client";

export type Integrante = {
  id: string;
  nombre: string;
  rol: string;
  salario_mensual: number;
  fecha_inicio: string | null;
  activo: boolean;
  created_at: string;
};

export type PagoNomina = {
  id: string;
  integrante_id: string;
  integrante_nombre: string;
  mes: string;
  tipo: string;
  monto: number;
  descripcion: string | null;
  fecha_pago: string | null;
  created_at: string;
};

export default async function NominasPage() {
  const supabase = await createClient();

  const [{ data: integrantes }, { data: pagos }] = await Promise.all([
    supabase.from("integrantes").select("*").order("nombre"),
    supabase.from("pagos_nomina").select("*").order("created_at", { ascending: false }),
  ]);

  return (
    <NominasClient
      integrantes={(integrantes ?? []) as Integrante[]}
      pagos={(pagos ?? []) as PagoNomina[]}
    />
  );
}
