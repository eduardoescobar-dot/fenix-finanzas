import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { es } from "date-fns/locale";

export function formatDate(date: string | Date): string {
  return format(new Date(date), "dd/MM/yyyy");
}

export function formatMonth(date: string | Date): string {
  return format(new Date(date), "MMMM yyyy", { locale: es });
}

export function formatMonthShort(date: string | Date): string {
  return format(new Date(date), "MMM", { locale: es });
}

export function currentMonthRange(): { from: Date; to: Date } {
  const now = new Date();
  return { from: startOfMonth(now), to: endOfMonth(now) };
}

export function last6Months(): Date[] {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => subMonths(now, 5 - i));
}

export function monthLabel(date: Date): string {
  return format(date, "MMM", { locale: es });
}
