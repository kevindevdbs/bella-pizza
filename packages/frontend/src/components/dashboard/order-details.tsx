"use client";

import { apiClient } from "@/lib/api";
import { Order } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useMemo, useState } from "react";
import {
  calculateOrderTotalInCents,
  formatPriceInCents,
} from "@/lib/order-helpers";

type OrderDetailsProps = {
  orderId: string | null;
  token: string;
  refreshTick: number;
  highlightedItemIds?: string[];
  onClose: () => Promise<void> | void;
};

export default function OrderDetails({
  orderId,
  token,
  refreshTick,
  highlightedItemIds = [],
  onClose,
}: OrderDetailsProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [error, setError] = useState("");

  const totalLabel = useMemo(() => {
    return formatPriceInCents(calculateOrderTotalInCents(order?.items));
  }, [order]);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        setOrder(null);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await apiClient<Order>(
          `order/detail?order_id=${orderId}`,
          {
            method: "GET",
            token,
            cache: "no-store",
          },
        );

        setOrder(response);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Nao foi possivel carregar pedido.",
        );
      } finally {
        setLoading(false);
      }
    }

    void fetchOrder();
  }, [orderId, refreshTick, token]);

  async function handleFinishOrder() {
    if (!orderId) {
      return;
    }

    try {
      setIsFinishing(true);
      setError("");

      await apiClient("order/finish", {
        method: "PUT",
        token,
        body: JSON.stringify({ order_id: orderId }),
      });

      await onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Nao foi possivel finalizar pedido.",
      );
    } finally {
      setIsFinishing(false);
    }
  }

  return (
    <Dialog open={orderId !== null} onOpenChange={() => void onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[calc(100%-2rem)] border border-border bg-card text-card-foreground sm:max-w-2xl"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Detalhe do pedido
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex min-h-40 items-center justify-center">
            <Spinner />
          </div>
        ) : order ? (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">Pedido</p>
                <p className="text-sm font-semibold">Mesa {order.table}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Cliente</p>
                <p className="text-sm font-semibold">
                  {order.name ?? "Sem nome"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="text-sm font-semibold">
                  {order.status ? "Concluido" : "Em producao"}
                </p>
              </div>
            </div>

            <div className="space-y-3 rounded-lg border border-border/70 bg-muted/25 p-4">
              <p className="text-sm font-semibold">Itens do pedido</p>

              {order.items?.length ? (
                <ul className="space-y-3">
                  {order.items.map((item) => {
                    const subtotalInCents = item.product.price * item.amount;

                    return (
                      <li
                        key={item.id}
                        className={`space-y-1 rounded border-b border-border/50 pb-3 last:border-0 last:pb-0 ${
                          highlightedItemIds.includes(item.id)
                            ? "bg-amber-500/10 px-2"
                            : ""
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-card-foreground">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {item.product.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Quantidade: {item.amount}
                            </p>
                            {item.note ? (
                              <p className="text-xs font-medium text-amber-700">
                                Observação: {item.note}
                              </p>
                            ) : null}
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold">
                              {formatPriceInCents(item.product.price)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Subtotal: {formatPriceInCents(subtotalInCents)}
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Sem itens no pedido.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <p className="text-base font-semibold">Total</p>
              <p className="text-3xl font-bold text-primary">{totalLabel}</p>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Pedido nao encontrado.
          </p>
        )}

        {error ? (
          <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <DialogFooter className="-mx-4 -mb-4 border-t border-border bg-muted/30 p-4">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={() => void onClose()}
          >
            Fechar
          </Button>
          <Button
            type="button"
            className="cursor-pointer"
            disabled={isFinishing || !orderId}
            onClick={handleFinishOrder}
          >
            {isFinishing ? <Spinner /> : "Finalizar pedido"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
