export type Frecuencia =
  | "MENSUAL"
  | "ANUAL"
  | "CADA 6 MESES"
  | "ONE-TIME";

export type EstadoSuscripcion = "ACTIVO" | "CANCELADO";

export type NivelUso = "ALTO" | "MEDIO" | "BAJO";

export type Necesidad =
  | "NECESARIO"
  | "SOPORTE OPERATIVO"
  | "PRESCINDIBLE"
  | "INECESARIO"
  | "EN EVALUACION";

export type CategoriaSuscripcion =
  | "IA"
  | "MARKETING"
  | "COMUNICACION"
  | "VENTAS"
  | "OPERACIONES"
  | "DISEÑO";

export interface Suscripcion {
  nombre: string;
  categoria: CategoriaSuscripcion;
  frecuencia: Frecuencia;
  costoMensual: number;
  moneda: "USD";
  fechaPago: string;
  tarjeta: string;
  proximoPago: string;
  mesesActivo: number;
  totalPagado: number;
  responsable: string;
  estado: EstadoSuscripcion;
  uso: NivelUso;
  necesidad: Necesidad;
  notas?: string;
}

export interface CampanaMarketing {
  nombre: string;
  tipo: string;
  proyecto: string;
  fechaInicio: string;
  fechaFin: string | null;
  costoMensual: number;
  totalInvertido: number;
  leads: number;
  ventas: number;
  ingresos: number;
  estado: "ACTIVA" | "PAUSADA" | "FINALIZADA";
}

export interface Nomina {
  nombre: string;
  rol: string;
  salarioMensual: number;
  fechaInicio: string | null;
  mesesPagados: number;
  totalPagado: number;
}

export const suscripciones: Suscripcion[] = [
  {
    nombre: "ELEVENLABS",
    categoria: "IA",
    frecuencia: "MENSUAL",
    costoMensual: 22.0,
    moneda: "USD",
    fechaPago: "Cada 1ro",
    tarjeta: "6170",
    proximoPago: "31/05/2025",
    mesesActivo: 10,
    totalPagado: 220.0,
    responsable: "CESAR",
    estado: "ACTIVO",
    uso: "MEDIO",
    necesidad: "NECESARIO",
  },
  {
    nombre: "HEYGEN",
    categoria: "MARKETING",
    frecuencia: "MENSUAL",
    costoMensual: 29.0,
    moneda: "USD",
    fechaPago: "Cada 15",
    tarjeta: "6170",
    proximoPago: "07/07/2025",
    mesesActivo: 9,
    totalPagado: 261.0,
    responsable: "CESAR",
    estado: "ACTIVO",
    uso: "MEDIO",
    necesidad: "NECESARIO",
  },
  {
    nombre: "CAPTIONS",
    categoria: "MARKETING",
    frecuencia: "MENSUAL",
    costoMensual: 24.99,
    moneda: "USD",
    fechaPago: "Cada 27",
    tarjeta: "6170",
    proximoPago: "27/01/2026",
    mesesActivo: 2,
    totalPagado: 49.98,
    responsable: "CESAR",
    estado: "ACTIVO",
    uso: "BAJO",
    necesidad: "PRESCINDIBLE",
  },
  {
    nombre: "OPENPHONE",
    categoria: "COMUNICACION",
    frecuencia: "MENSUAL",
    costoMensual: 20.5,
    moneda: "USD",
    fechaPago: "Cada 17",
    tarjeta: "6170",
    proximoPago: "21/05/2025",
    mesesActivo: 10,
    totalPagado: 205.0,
    responsable: "CESAR",
    estado: "ACTIVO",
    uso: "ALTO",
    necesidad: "SOPORTE OPERATIVO",
  },
  {
    nombre: "KOMMO",
    categoria: "VENTAS",
    frecuencia: "CADA 6 MESES",
    costoMensual: 75.0,
    moneda: "USD",
    fechaPago: "Julio 08",
    tarjeta: "4191",
    proximoPago: "07/01/2026",
    mesesActivo: 3,
    totalPagado: 225.0,
    responsable: "CESAR",
    estado: "ACTIVO",
    uso: "ALTO",
    necesidad: "SOPORTE OPERATIVO",
  },
  {
    nombre: "2CLICKS",
    categoria: "MARKETING",
    frecuencia: "MENSUAL",
    costoMensual: 26.99,
    moneda: "USD",
    fechaPago: "Cada 14",
    tarjeta: "6170",
    proximoPago: "30/11/2025",
    mesesActivo: 4,
    totalPagado: 107.96,
    responsable: "CESAR",
    estado: "ACTIVO",
    uso: "ALTO",
    necesidad: "SOPORTE OPERATIVO",
  },
  {
    nombre: "LOVABLE",
    categoria: "IA",
    frecuencia: "MENSUAL",
    costoMensual: 25.0,
    moneda: "USD",
    fechaPago: "Cada 20",
    tarjeta: "6170",
    proximoPago: "20/10/2025",
    mesesActivo: 5,
    totalPagado: 125.0,
    responsable: "CESAR",
    estado: "ACTIVO",
    uso: "ALTO",
    necesidad: "SOPORTE OPERATIVO",
  },
  {
    nombre: "ZOOM",
    categoria: "COMUNICACION",
    frecuencia: "MENSUAL",
    costoMensual: 139.97,
    moneda: "USD",
    fechaPago: "Cada 14",
    tarjeta: "6170",
    proximoPago: "14/12/2025",
    mesesActivo: 3,
    totalPagado: 419.91,
    responsable: "CESAR",
    estado: "ACTIVO",
    uso: "ALTO",
    necesidad: "SOPORTE OPERATIVO",
  },
  {
    nombre: "SKOOL",
    categoria: "OPERACIONES",
    frecuencia: "MENSUAL",
    costoMensual: 9.0,
    moneda: "USD",
    fechaPago: "Cada 26",
    tarjeta: "6170",
    proximoPago: "26/02/2026",
    mesesActivo: 1,
    totalPagado: 9.0,
    responsable: "EDUARDO",
    estado: "ACTIVO",
    uso: "BAJO",
    necesidad: "PRESCINDIBLE",
  },
  {
    nombre: "VIMEO",
    categoria: "MARKETING",
    frecuencia: "ANUAL",
    costoMensual: 25.0,
    moneda: "USD",
    fechaPago: "2 Junio",
    tarjeta: "6170",
    proximoPago: "02/06/2025",
    mesesActivo: 10,
    totalPagado: 300.0,
    responsable: "CESAR",
    estado: "ACTIVO",
    uso: "ALTO",
    necesidad: "NECESARIO",
  },
  {
    nombre: "GAMMA",
    categoria: "DISEÑO",
    frecuencia: "ANUAL",
    costoMensual: 17.92,
    moneda: "USD",
    fechaPago: "10 Marzo",
    tarjeta: "6170",
    proximoPago: "10/03/2025",
    mesesActivo: 13,
    totalPagado: 215.0,
    responsable: "CESAR",
    estado: "ACTIVO",
    uso: "ALTO",
    necesidad: "SOPORTE OPERATIVO",
  },
  {
    nombre: "SIGNNOW",
    categoria: "OPERACIONES",
    frecuencia: "ANUAL",
    costoMensual: 15.0,
    moneda: "USD",
    fechaPago: "23 Marzo",
    tarjeta: "6170",
    proximoPago: "23/03/2026",
    mesesActivo: 0,
    totalPagado: 180.0,
    responsable: "CESAR",
    estado: "ACTIVO",
    uso: "ALTO",
    necesidad: "SOPORTE OPERATIVO",
  },
  {
    nombre: "HOSTINGUER",
    categoria: "OPERACIONES",
    frecuencia: "ANUAL",
    costoMensual: 8.93,
    moneda: "USD",
    fechaPago: "16 Mayo",
    tarjeta: "4191",
    proximoPago: "16/05/2025",
    mesesActivo: 10,
    totalPagado: 107.16,
    responsable: "CESAR",
    estado: "ACTIVO",
    uso: "ALTO",
    necesidad: "SOPORTE OPERATIVO",
  },
  {
    nombre: "EASYPANEL",
    categoria: "OPERACIONES",
    frecuencia: "MENSUAL",
    costoMensual: 24.49,
    moneda: "USD",
    fechaPago: "Cada 21",
    tarjeta: "4191",
    proximoPago: "21/02/2026",
    mesesActivo: 1,
    totalPagado: 24.49,
    responsable: "CESAR",
    estado: "ACTIVO",
    uso: "ALTO",
    necesidad: "NECESARIO",
    notas: "N8N y Chatwoot",
  },
  {
    nombre: "CLAUDE",
    categoria: "IA",
    frecuencia: "MENSUAL",
    costoMensual: 20.0,
    moneda: "USD",
    fechaPago: "Cada 2",
    tarjeta: "5416",
    proximoPago: "02/03/2026",
    mesesActivo: 1,
    totalPagado: 20.0,
    responsable: "EDUARDO",
    estado: "CANCELADO",
    uso: "ALTO",
    necesidad: "EN EVALUACION",
  },
  {
    nombre: "STREAMYARD",
    categoria: "COMUNICACION",
    frecuencia: "ONE-TIME",
    costoMensual: 89.0,
    moneda: "USD",
    fechaPago: "Cada 1ro",
    tarjeta: "4191",
    proximoPago: "01/03/2026",
    mesesActivo: 1,
    totalPagado: 89.0,
    responsable: "CESAR",
    estado: "CANCELADO",
    uso: "BAJO",
    necesidad: "INECESARIO",
  },
  {
    nombre: "ENVATO",
    categoria: "DISEÑO",
    frecuencia: "MENSUAL",
    costoMensual: 41.34,
    moneda: "USD",
    fechaPago: "Cada 4",
    tarjeta: "4191",
    proximoPago: "04/10/2025",
    mesesActivo: 6,
    totalPagado: 248.04,
    responsable: "CESAR",
    estado: "CANCELADO",
    uso: "BAJO",
    necesidad: "INECESARIO",
  },
];

export const campanasMarketing: CampanaMarketing[] = [
  {
    nombre: "TWILIO",
    tipo: "LLAMADAS",
    proyecto: "FENIX ACADEMY",
    fechaInicio: "01/04/2026",
    fechaFin: null,
    costoMensual: 20.0,
    totalInvertido: 20.0,
    leads: 0,
    ventas: 0,
    ingresos: 0,
    estado: "ACTIVA",
  },
];

export const nominas: Nomina[] = [
  {
    nombre: "JUNIOR",
    rol: "OPERACIONES",
    salarioMensual: 700.0,
    fechaInicio: null,
    mesesPagados: 0,
    totalPagado: 0.0,
  },
  {
    nombre: "AGNY",
    rol: "COORDINACION",
    salarioMensual: 400.0,
    fechaInicio: null,
    mesesPagados: 0,
    totalPagado: 0.0,
  },
  {
    nombre: "EDUARDO",
    rol: "OPERACIONES",
    salarioMensual: 500.0,
    fechaInicio: "01/12/2025",
    mesesPagados: 4,
    totalPagado: 2000.0,
  },
  {
    nombre: "YEIMI",
    rol: "VENTAS",
    salarioMensual: 400.0,
    fechaInicio: null,
    mesesPagados: 0,
    totalPagado: 0.0,
  },
];

export const kpis = {
  inversionMensual: 383.28,
  inversionGeneral: 1724.44,
  inversionTotalHistorica: 2806.54,
  totalAplicaciones: 17,
  totalAplicacionesActivas: 14,
  totalAplicacionesCanceladas: 3,
};

export const marketingKpis = {
  totalInvertido: 20.0,
  totalIngresos: 0.0,
  roas: 0,
};

export const nominasKpis = {
  pagoMensualTotal: 2000.0,
  totalPagado: 2000.0,
};

export const gastosPorCategoria = [
  { categoria: "Comunicación", total: 249.47, color: "#f97316" },
  { categoria: "Marketing", total: 105.98, color: "#fb923c" },
  { categoria: "IA", total: 47.0, color: "#fdba74" },
  { categoria: "Operaciones", total: 57.42, color: "#fed7aa" },
  { categoria: "Ventas", total: 75.0, color: "#ffedd5" },
  { categoria: "Diseño", total: 17.92, color: "#fff7ed" },
];

export const gastosMensuales = [
  { mes: "Jul 2025", total: 268.45 },
  { mes: "Ago 2025", total: 285.2 },
  { mes: "Sep 2025", total: 292.8 },
  { mes: "Oct 2025", total: 315.4 },
  { mes: "Nov 2025", total: 341.27 },
  { mes: "Dic 2025", total: 358.9 },
  { mes: "Ene 2026", total: 371.15 },
  { mes: "Feb 2026", total: 376.84 },
  { mes: "Mar 2026", total: 380.1 },
  { mes: "Abr 2026", total: 383.28 },
];
