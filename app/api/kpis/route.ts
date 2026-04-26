import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://amyzbfafqdbmoyhvrkxm.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFteXpiZmFmcWRibW95aHZya3htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNzI3OTIsImV4cCI6MjA5MTg0ODc5Mn0.lfnjVn2ebylPV50ZuUThbqIfWespYnLb-FZT8o2hbeM"
);

export async function GET() {
  const { data } = await supabase
    .from("suscripciones")
    .select("costo_mensual,estado");

  const activas = (data ?? []).filter(
    (s: { estado: string }) => s.estado === "ACTIVA"
  );
  const total = activas.reduce(
    (sum: number, s: { costo_mensual: number }) => sum + s.costo_mensual,
    0
  );

  return NextResponse.json({
    inversionMensual: Math.round(total * 100) / 100,
    herramientasActivas: activas.length,
  });
}
