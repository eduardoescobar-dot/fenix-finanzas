"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type ActionResult = { error?: string };

// ============================================================
// SUSCRIPCIONES
// ============================================================

export interface SuscripcionData {
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
  notas: string;
}

export async function addSuscripcion(data: SuscripcionData): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("suscripciones").insert(data);
  if (error) return { error: error.message };
  revalidatePath("/suscripciones");
  revalidatePath("/");
  return {};
}

export async function updateSuscripcion(id: string, data: SuscripcionData): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("suscripciones").update(data).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/suscripciones");
  revalidatePath("/");
  return {};
}

export async function deleteSuscripcion(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("suscripciones").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/suscripciones");
  revalidatePath("/");
  return {};
}

// ============================================================
// CAMPAÑAS DE MARKETING
// ============================================================

export interface CampanaData {
  nombre: string;
  tipo: string;
  proyecto: string;
  fecha_inicio: string;
  fecha_fin: string;
  costo_mensual: number;
  total_invertido: number;
  leads: number;
  ventas: number;
  ingresos: number;
  estado: string;
}

export async function addCampana(data: CampanaData): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("campanas_marketing").insert(data);
  if (error) return { error: error.message };
  revalidatePath("/marketing");
  return {};
}

export async function updateCampana(id: string, data: CampanaData): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("campanas_marketing").update(data).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/marketing");
  return {};
}

export async function deleteCampana(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("campanas_marketing").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/marketing");
  return {};
}

// ============================================================
// INTEGRANTES (Nóminas)
// ============================================================

export interface IntegranteData {
  nombre: string;
  rol: string;
  salario_mensual: number;
  fecha_inicio: string;
  activo: boolean;
}

export async function addIntegrante(data: IntegranteData): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("integrantes").insert(data);
  if (error) return { error: error.message };
  revalidatePath("/nominas");
  return {};
}

export async function updateIntegrante(id: string, data: IntegranteData): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("integrantes").update(data).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/nominas");
  return {};
}

export async function deleteIntegrante(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("integrantes").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/nominas");
  return {};
}

// ============================================================
// PAGOS DE NÓMINA (salarios + bonos)
// ============================================================

export interface PagoData {
  integrante_id: string;
  integrante_nombre: string;
  mes: string;
  tipo: string;
  monto: number;
  descripcion: string;
  fecha_pago: string;
}

export async function addPago(data: PagoData): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("pagos_nomina").insert(data);
  if (error) return { error: error.message };
  revalidatePath("/nominas");
  return {};
}

export async function deletePago(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("pagos_nomina").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/nominas");
  return {};
}

// ============================================================
// GASTOS PERSONALES
// ============================================================

export interface GastoPersonalData {
  fecha: string;
  categoria: string;
  descripcion: string;
  monto: number;
  moneda: string;
  notas: string;
}

export async function addGastoPersonal(data: GastoPersonalData): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("gastos_personales").insert(data);
  if (error) return { error: error.message };
  revalidatePath("/gastos-personales");
  return {};
}

export async function updateGastoPersonal(id: string, data: GastoPersonalData): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("gastos_personales").update(data).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/gastos-personales");
  return {};
}

export async function deleteGastoPersonal(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("gastos_personales").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/gastos-personales");
  return {};
}
