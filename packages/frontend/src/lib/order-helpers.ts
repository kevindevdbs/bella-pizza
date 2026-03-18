import { Order, OrderItem } from "@/lib/types";

export type OrderCardItem = {
  id: string;
  name: string;
  amount: number;
  unitPriceInCents: number;
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
    }))
    .filter((item) => Boolean(item.name));
}

export function getStartOfDay(date: Date): Date {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

export function getEndOfDay(date: Date): Date {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
}

export function getStartOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

export function getEndOfMonth(date: Date): Date {
  const newDate = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
    23,
    59,
    59,
    999,
  );
  return newDate;
}

export function getStartOfWeek(date: Date): Date {
  const newDate = new Date(date);
  const dayOfWeek = newDate.getDay();
  const diff = newDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  newDate.setDate(diff);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

export function getEndOfWeek(date: Date): Date {
  const newDate = new Date(date);
  const dayOfWeek = newDate.getDay();
  const diff = newDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? 0 : 7);
  newDate.setDate(diff);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
}

export function getStartOfYear(date: Date): Date {
  return new Date(date.getFullYear(), 0, 1, 0, 0, 0, 0);
}

export function getEndOfYear(date: Date): Date {
  return new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);
}

export function formatDateForAPI(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDateLong(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
