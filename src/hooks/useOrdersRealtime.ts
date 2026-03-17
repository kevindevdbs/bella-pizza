"use client";

import { getApiUrl } from "@/lib/api";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export type OrderRealtimeEvent = {
  type:
    | "order:created"
    | "order:item-added"
    | "order:item-updated"
    | "order:item-removed"
    | "order:sent"
    | "order:finished"
    | "order:deleted";
  orderId: string;
  itemId?: string;
  table?: number;
  draft?: boolean;
  status?: boolean;
  changedAt: string;
};

type UseOrdersRealtimeProps = {
  token: string;
  onOrderEvent: (event: OrderRealtimeEvent) => void;
  onConnected?: () => void;
};

export function useOrdersRealtime({
  token,
  onOrderEvent,
  onConnected,
}: UseOrdersRealtimeProps) {
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const onOrderEventRef = useRef(onOrderEvent);
  const onConnectedRef = useRef(onConnected);

  useEffect(() => {
    onOrderEventRef.current = onOrderEvent;
  }, [onOrderEvent]);

  useEffect(() => {
    onConnectedRef.current = onConnected;
  }, [onConnected]);

  useEffect(() => {
    const socket: Socket = io(`${getApiUrl()}/orders`, {
      transports: ["websocket", "polling"],
      auth: {
        token: `Bearer ${token}`,
      },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socket.on("connect", () => {
      setIsSocketConnected(true);
      onConnectedRef.current?.();
    });

    socket.on("disconnect", () => {
      setIsSocketConnected(false);
    });

    socket.on("connect_error", (error) => {
      setIsSocketConnected(false);
      console.error("Falha ao conectar no realtime de pedidos:", error.message);
    });

    socket.on("orders:event", (event: OrderRealtimeEvent) => {
      onOrderEventRef.current(event);
    });

    return () => {
      socket.off("orders:event");
      socket.disconnect();
    };
  }, [token]);

  return { isSocketConnected };
}
