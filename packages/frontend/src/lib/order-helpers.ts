import { Order, OrderItem } from "@/lib/types";

export type OrderCardItem = {
  id: string;
  name: string;
  amount: number;
  unitPriceInCents: number;
  note?: string | null;
};

export function formatPriceInCents(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100);
}

export function formatDateTime(value: string) {
  const date = new Date(value);

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function calculateOrderTotalInCents(items: OrderItem[] | undefined) {
  if (!items?.length) {
    return 0;
  }

  return items.reduce((sum, item) => {
    const price = Number(item?.product?.price ?? 0);
    const amount = Number(item?.amount ?? 0);
    const safePrice = Number.isFinite(price) ? price : 0;
    const safeAmount = Number.isFinite(amount) && amount > 0 ? amount : 0;

    return sum + safePrice * safeAmount;
  }, 0);
}

export function toOrderCardItems(order: Order): OrderCardItem[] {
  const orderItems = Array.isArray(order.items) ? order.items : [];

  return orderItems
    .map((item, index) => ({
      id: item?.id ?? `${order.id}-${index}`,
      name: item?.product?.name ?? "Item sem nome",
      amount: Number(item.amount),
      unitPriceInCents: Number(item?.product?.price ?? 0),
      note: item?.note ?? null,
    }))
    .filter((item) => Boolean(item.name));
}

export function getStartOfDay(date: Date): Date {
  const newDate = new Date(date);
  newDate.setUTCHours(0, 0, 0, 0);
  return newDate;
}

export function getEndOfDay(date: Date): Date {
  const newDate = new Date(date);
  newDate.setUTCHours(23, 59, 59, 999);
  return newDate;
}

export function getStartOfMonth(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1, 0, 0, 0, 0)
  );
}

export function getEndOfMonth(date: Date): Date {
  const lastDay = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0, 23, 59, 59, 999)
  );
  return lastDay;
}

export function getStartOfWeek(date: Date): Date {
  const newDate = new Date(date);
  const dayOfWeek = newDate.getUTCDay();
  const diff = newDate.getUTCDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  newDate.setUTCDate(diff);
  newDate.setUTCHours(0, 0, 0, 0);
  return newDate;
}

export function getEndOfWeek(date: Date): Date {
  const newDate = new Date(date);
  const dayOfWeek = newDate.getUTCDay();
  const diff = newDate.getUTCDate() - dayOfWeek + (dayOfWeek === 0 ? 0 : 7);
  newDate.setUTCDate(diff);
  newDate.setUTCHours(23, 59, 59, 999);
  return newDate;
}

export function getStartOfYear(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0));
}

export function getEndOfYear(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), 11, 31, 23, 59, 59, 999)
  );
}

export function formatDateForAPI(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDateLong(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
