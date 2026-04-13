export type Programa =
  | "elite"
  | "comunidad"
  | "libertad_12_semanas"
  | "mentoria_privada"
  | "otro";

export type MetodoPago =
  | "transferencia"
  | "tarjeta"
  | "paypal"
  | "stripe"
  | "efectivo"
  | "otro";

export type CategoriaGasto =
  | "herramientas_saas"
  | "publicidad_meta"
  | "publicidad_google"
  | "publicidad_otro"
  | "personal"
  | "operaciones"
  | "impuestos"
  | "otro";

export type Moneda = "MXN" | "USD";

export interface Ingreso {
  id: string;
  fecha: string;
  programa: Programa;
  descripcion?: string;
  monto: number;
  moneda: Moneda;
  tipo_cambio: number;
  metodo_pago: MetodoPago;
  cliente_nombre?: string;
  cliente_email?: string;
  notas?: string;
  created_at: string;
}

export interface Gasto {
  id: string;
  fecha: string;
  categoria: CategoriaGasto;
  proveedor?: string;
  descripcion: string;
  monto: number;
  moneda: Moneda;
  tipo_cambio: number;
  comprobante?: string;
  es_recurrente: boolean;
  notas?: string;
  created_at: string;
}

export interface MetaFinanciera {
  id: string;
  año: number;
  mes?: number;
  tipo: "ingresos" | "gastos" | "utilidad";
  programa?: Programa;
  monto_meta: number;
  descripcion?: string;
  created_at: string;
}

export interface ResumenMensual {
  mes: string;
  total_ingresos: number;
  total_gastos: number;
  utilidad: number;
}

export const PROGRAMA_LABELS: Record<Programa, string> = {
  elite: "Élite Community",
  comunidad: "Comunidad",
  libertad_12_semanas: "Libertad 12 Semanas",
  mentoria_privada: "Mentoría Privada",
  otro: "Otro",
};

export const METODO_PAGO_LABELS: Record<MetodoPago, string> = {
  transferencia: "Transferencia",
  tarjeta: "Tarjeta",
  paypal: "PayPal",
  stripe: "Stripe",
  efectivo: "Efectivo",
  otro: "Otro",
};

export const CATEGORIA_LABELS: Record<CategoriaGasto, string> = {
  herramientas_saas: "Herramientas / SaaS",
  publicidad_meta: "Publicidad Meta",
  publicidad_google: "Publicidad Google",
  publicidad_otro: "Publicidad Otro",
  personal: "Personal",
  operaciones: "Operaciones",
  impuestos: "Impuestos",
  otro: "Otro",
};
