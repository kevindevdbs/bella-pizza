"use client";

import { RefreshCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import OrderCard from "@/components/dashboard/order-card";
import OrderDetails from "@/components/dashboard/order-details";
import OrderSkeleton from "@/components/dashboard/order-skeleton";
import FinishedOrdersTab from "@/components/dashboard/finished-orders-tab";
import { useOrderSpeechAlert } from "@/hooks/useOrderSpeechAlert";
import {
  OrderRealtimeEvent,
  useOrdersRealtime,
} from "@/hooks/useOrdersRealtime";
import { apiClient } from "@/lib/api";
import {
  calculateOrderTotalInCents,
  formatDateTime,
  formatPriceInCents,
  toOrderCardItems,
} from "@/lib/order-helpers";
import { Order } from "@/lib/types";

interface ContentOderProps {
  token: string;
}

type OrderTab = "pending" | "finished";

export default function ContentOrder({ token }: ContentOderProps) {
  const [activeTab, setActiveTab] = useState<OrderTab>("pending");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [detailsRefreshTick, setDetailsRefreshTick] = useState(0);
  const [highlightedItemsByOrder, setHighlightedItemsByOrder] = useState<
    Record<string, string[]>
  >({});
  const [recentlyUpdatedOrders, setRecentlyUpdatedOrders] = useState<
    Record<string, true>
  >({});
  const selectedOrderRef = useRef<string | null>(null);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { speakNewOrderAlert, speakUpdatedOrderAlert, speakDeletedOrderAlert } =
    useOrderSpeechAlert();

  const getOrders = useCallback(
    async (showPageLoading = false) => {
      if (showPageLoading) {
        setLoading(true);
      } else {
        setIsRefreshing(true);
      }

      try {
        const fetchedOrders = await apiClient<Order[]>("orders?draft=false", {
          token,
          cache: "no-store",
        });

        const productionOrders = fetchedOrders.filter((order) => !order.status);
        setOrders(productionOrders);
      } catch (error) {
        console.log(error);
      } finally {
        if (showPageLoading) {
          setLoading(false);
        }

        setIsRefreshing(false);
      }
    },
    [token],
  );

  const scheduleOrdersRefresh = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    refreshTimerRef.current = setTimeout(() => {
      void getOrders(false);
    }, 150);
  }, [getOrders]);

  useEffect(() => {
    selectedOrderRef.current = selectedOrder;
  }, [selectedOrder]);

  useEffect(() => {
    void getOrders(true);
  }, [getOrders]);

  const handleOrderEvent = useCallback(
    (event: OrderRealtimeEvent) => {
      scheduleOrdersRefresh();

      if (event.type === "order:sent") {
        speakNewOrderAlert();
      }

      if (
        event.type === "order:deleted" &&
        event.draft === false &&
        event.status === false &&
        typeof event.table === "number"
      ) {
        speakDeletedOrderAlert(event.table);
      }

      const isItemChangeEvent =
        event.type === "order:item-added" ||
        event.type === "order:item-removed" ||
        event.type === "order:item-updated";

      if (isItemChangeEvent) {
        const shouldAnnounceUpdatedOrder =
          event.draft === false && event.status === false;

        if (shouldAnnounceUpdatedOrder && typeof event.table === "number") {
          speakUpdatedOrderAlert(event.table);
        }

        if (shouldAnnounceUpdatedOrder) {
          setRecentlyUpdatedOrders((previous) => ({
            ...previous,
            [event.orderId]: true,
          }));
        }

        if (shouldAnnounceUpdatedOrder && event.itemId) {
          setHighlightedItemsByOrder((previous) => {
            const currentIds = previous[event.orderId] ?? [];

            if (currentIds.includes(event.itemId!)) {
              return previous;
            }

            return {
              ...previous,
              [event.orderId]: [...currentIds, event.itemId!],
            };
          });
        }
      }

      if (
        selectedOrderRef.current &&
        selectedOrderRef.current === event.orderId
      ) {
        setDetailsRefreshTick((previous) => previous + 1);
      }
    },
    [
      scheduleOrdersRefresh,
      speakDeletedOrderAlert,
      speakNewOrderAlert,
      speakUpdatedOrderAlert,
    ],
  );

  const handleSocketConnected = useCallback(() => {
    void getOrders(false);
  }, [getOrders]);

  const { isSocketConnected } = useOrdersRealtime({
    token,
    onOrderEvent: handleOrderEvent,
    onConnected: handleSocketConnected,
  });

  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, []);

  return (
    <section className="space-y-6">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              {activeTab === "pending"
                ? "Visualize os pedidos ativos em tempo real"
                : "Acompanhe o histórico de pedidos finalizados"}
            </span>
          </div>
        </div>
        {activeTab === "pending" && (
          <Button
            className="cursor-pointer"
            onClick={() => void getOrders(false)}
            disabled={loading || isRefreshing}
          >
            {isRefreshing ? <Spinner /> : <RefreshCcw />}
          </Button>
        )}
      </header>

      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-3 font-medium transition-colors ${
            activeTab === "pending"
              ? "border-b-2 border-primary text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Pendentes
        </button>
        <button
          onClick={() => setActiveTab("finished")}
          className={`px-4 py-3 font-medium transition-colors ${
            activeTab === "finished"
              ? "border-b-2 border-primary text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Finalizados
        </button>
      </div>

      {activeTab === "pending" ? (
        <div className="space-y-6">
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
                    highlightedItemIds={highlightedItemsByOrder[order.id] ?? []}
                    isRecentlyUpdated={Boolean(recentlyUpdatedOrders[order.id])}
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
            refreshTick={detailsRefreshTick}
            highlightedItemIds={
              selectedOrder
                ? (highlightedItemsByOrder[selectedOrder] ?? [])
                : []
            }
            onClose={async () => {
              setSelectedOrder(null);
              await getOrders();
            }}
          />
        </div>
      ) : (
        <FinishedOrdersTab token={token} />
      )}
    </section>
  );
}
