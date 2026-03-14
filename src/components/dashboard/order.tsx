"use client";

import { RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";
import { apiClient } from "@/lib/api";
import { useEffect, useState } from "react";
import { Order } from "@/lib/types";
import OrderCard from "@/components/dashboard/order-card";
import OrderDetails from "@/components/dashboard/order-details";
import OrderSkeleton from "@/components/dashboard/order-skeleton";
import {
  calculateOrderTotalInCents,
  formatDateTime,
  formatPriceInCents,
  toOrderCardItems,
} from "@/lib/order-helpers";
import { Spinner } from "../ui/spinner";

interface ContentOderProps {
  token: string;
}

export default function ContentOrder({ token }: ContentOderProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const getOrders = async (showPageLoading = false) => {
    if (showPageLoading) {
      setLoading(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      const orders = await apiClient<Order[]>("orders?draft=false", {
        token,
        cache: "no-store",
      });

      const productionOrders = orders.filter((order) => !order.status);
      setOrders(productionOrders);
    } catch (error) {
      console.log(error);
    } finally {
      if (showPageLoading) {
        setLoading(false);
      }

      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      await getOrders(true);
    };

    fetchOrders();
  }, []);

  return (
    <section className="space-y-6">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
          <p className="text-sm text-muted-foreground">
            Visualize os pedidos ativos em tempo real
          </p>
        </div>
        <Button
          className="cursor-pointer"
          onClick={() => void getOrders(false)}
          disabled={loading || isRefreshing}
        >
          {isRefreshing ? <Spinner /> : <RefreshCcw />}
        </Button>
      </header>

      {loading ? (
        <OrderSkeleton />
      ) : orders.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {orders.map((order) => {
            const totalInCents = calculateOrderTotalInCents(order.items);
            const cardItems = toOrderCardItems(order);

            return (
              <OrderCard
                key={order.id}
                orderId={order.id}
                customerName={order.name ?? "Sem nome"}
                tableNumber={order.table}
                statusLabel={"Em produção"}
                totalLabel={formatPriceInCents(totalInCents)}
                createdAtLabel={formatDateTime(order.createdAt)}
                onOpenDetails={setSelectedOrder}
                items={cardItems}
              />
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card/60 p-6 text-sm text-muted-foreground">
          Nenhum pedido encontrado.
        </div>
      )}

      <OrderDetails
        orderId={selectedOrder}
        token={token}
        onClose={async () => {
          setSelectedOrder(null);
          await getOrders();
        }}
      />
    </section>
  );
}
