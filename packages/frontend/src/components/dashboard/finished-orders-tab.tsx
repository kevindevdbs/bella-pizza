"use client";

import { useEffect, useState } from "react";
import OrderCard from "@/components/dashboard/order-card";
import OrderDetails from "@/components/dashboard/order-details";
import OrderSkeleton from "@/components/dashboard/order-skeleton";
import { apiClient } from "@/lib/api";
import {
  calculateOrderTotalInCents,
  formatDateTime,
  formatPriceInCents,
  toOrderCardItems,
  formatDateForAPI,
  getStartOfWeek,
  getEndOfWeek,
  getStartOfMonth,
  getEndOfMonth,
  getStartOfYear,
  getEndOfYear,
  getStartOfDay,
  getEndOfDay,
} from "@/lib/order-helpers";
import { Order, OrderStatistics } from "@/lib/types";
import { Card } from "../ui/card";

type PeriodType = "day" | "week" | "month" | "year";

interface FinishedOrdersTabProps {
  token: string;
}

export default function FinishedOrdersTab({ token }: FinishedOrdersTabProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statistics, setStatistics] = useState<OrderStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [detailsRefreshTick, setDetailsRefreshTick] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("month");

  const getDateRangeForPeriod = (period: PeriodType) => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (period) {
      case "day":
        startDate = getStartOfDay(now);
        endDate = getEndOfDay(now);
        break;
      case "week":
        startDate = getStartOfWeek(now);
        endDate = getEndOfWeek(now);
        break;
      case "month":
        startDate = getStartOfMonth(now);
        endDate = getEndOfMonth(now);
        break;
      case "year":
        startDate = getStartOfYear(now);
        endDate = getEndOfYear(now);
        break;
    }

    return { startDate, endDate };
  };

  const fetchFinishedOrders = async () => {
    setLoading(true);
    try {
      const { startDate, endDate } = getDateRangeForPeriod(selectedPeriod);

      const params = new URLSearchParams({
        startDate: formatDateForAPI(startDate),
        endDate: formatDateForAPI(endDate),
      });

      const fetchedOrders = await apiClient<Order[]>(
        `orders/finished?${params.toString()}`,
        { token, cache: "no-store" },
      );

      setOrders(fetchedOrders || []);


      if (fetchedOrders && fetchedOrders.length > 0) {
        const totalCount = fetchedOrders.length;
        const totalValue = fetchedOrders.reduce((sum, order) => {
          return sum + calculateOrderTotalInCents(order.items);
        }, 0);

        setStatistics({
          daily: { count: totalCount, total: totalValue },
          monthly: { count: totalCount, total: totalValue },
          yearly: { count: totalCount, total: totalValue },
        });
      } else {
        setStatistics({
          daily: { count: 0, total: 0 },
          monthly: { count: 0, total: 0 },
          yearly: { count: 0, total: 0 },
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    if (!token) return;

    fetchFinishedOrders();
  }, [token, selectedPeriod]);

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
        <label
          htmlFor="period-select"
          className="text-sm font-medium text-foreground"
        >
          Período:
        </label>
        <select
          id="period-select"
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value as PeriodType)}
          className="rounded border border-border bg-background px-3 py-2 text-sm text-foreground"
        >
          <option value="day">Dia</option>
          <option value="week">Semana</option>
          <option value="month">Mês</option>
          <option value="year">Ano</option>
        </select>
      </div>

      {statistics ? (
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
          <Card className="border border-border">
            <div className="space-y-2 p-6">
              <div className="text-sm font-medium text-muted-foreground">
                {selectedPeriod === "day"
                  ? "Pedidos Hoje"
                  : selectedPeriod === "week"
                    ? "Pedidos esta Semana"
                    : selectedPeriod === "month"
                      ? "Pedidos este Mês"
                      : "Pedidos este Ano"}
              </div>
              <div className="text-3xl font-bold text-foreground">
                {statistics.daily.count}
              </div>
            </div>
          </Card>

          <Card className="border border-border">
            <div className="space-y-2 p-6">
              <div className="text-sm font-medium text-muted-foreground">
                Faturamento
              </div>
              <div className="text-3xl font-bold text-primary">
                {formatPriceInCents(statistics.daily.total)}
              </div>
            </div>
          </Card>
        </div>
      ) : null}

      <div>
        <h2 className="mb-4 text-lg font-semibold">Pedidos Finalizados</h2>
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
                  statusLabel={"Finalizado"}
                  totalLabel={formatPriceInCents(totalInCents)}
                  createdAtLabel={formatDateTime(order.createdAt)}
                  onOpenDetails={setSelectedOrder}
                  items={cardItems}
                  highlightedItemIds={[]}
                  isRecentlyUpdated={false}
                  hideActions={true}
                />
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card/60 p-6 text-sm text-muted-foreground">
            Nenhum pedido finalizado encontrado.
          </div>
        )}
      </div>

      <OrderDetails
        orderId={selectedOrder}
        token={token}
        refreshTick={detailsRefreshTick}
        highlightedItemIds={[]}
        onClose={async () => {
          setSelectedOrder(null);
          await fetchFinishedOrders();
        }}
      />
    </section>
  );
}
