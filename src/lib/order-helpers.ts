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
