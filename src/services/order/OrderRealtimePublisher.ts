import { getOrdersNamespace } from "../../lib/socket";

type OrderEventType =
  | "order:created"
  | "order:item-added"
  | "order:item-updated"
  | "order:item-removed"
  | "order:sent"
  | "order:finished"
  | "order:deleted";

interface OrderEventPayload {
  type: OrderEventType;
  orderId: string;
  itemId?: string;
  table?: number;
  status?: boolean;
  draft?: boolean;
  changedAt: string;
}

export class OrderRealtimePublisher {
  private static emit(payload: OrderEventPayload) {
    const ordersNamespace = getOrdersNamespace();

    if (!ordersNamespace) {
      return;
    }

    ordersNamespace.emit("orders:event", payload);
  }

  static emitCreated(order: {
    id: string;
    table: number;
    status: boolean;
    draft: boolean;
  }) {
    this.emit({
      type: "order:created",
      orderId: order.id,
      table: order.table,
      status: order.status,
      draft: order.draft,
      changedAt: new Date().toISOString(),
    });
  }

  static emitItemAdded(payload: {
    orderId: string;
    table: number;
    itemId: string;
    draft: boolean;
    status: boolean;
  }) {
    this.emit({
      type: "order:item-added",
      orderId: payload.orderId,
      table: payload.table,
      itemId: payload.itemId,
      draft: payload.draft,
      status: payload.status,
      changedAt: new Date().toISOString(),
    });
  }

  static emitItemRemoved(payload: {
    orderId: string;
    table: number;
    itemId: string;
    draft: boolean;
    status: boolean;
  }) {
    this.emit({
      type: "order:item-removed",
      orderId: payload.orderId,
      table: payload.table,
      itemId: payload.itemId,
      draft: payload.draft,
      status: payload.status,
      changedAt: new Date().toISOString(),
    });
  }

  static emitItemUpdated(payload: {
    orderId: string;
    table: number;
    itemId: string;
    draft: boolean;
    status: boolean;
  }) {
    this.emit({
      type: "order:item-updated",
      orderId: payload.orderId,
      table: payload.table,
      itemId: payload.itemId,
      draft: payload.draft,
      status: payload.status,
      changedAt: new Date().toISOString(),
    });
  }

  static emitSent(order: {
    id: string;
    table: number;
    status: boolean;
    draft: boolean;
  }) {
    this.emit({
      type: "order:sent",
      orderId: order.id,
      table: order.table,
      status: order.status,
      draft: order.draft,
      changedAt: new Date().toISOString(),
    });
  }

  static emitFinished(order: {
    id: string;
    table: number;
    status: boolean;
    draft: boolean;
  }) {
    this.emit({
      type: "order:finished",
      orderId: order.id,
      table: order.table,
      status: order.status,
      draft: order.draft,
      changedAt: new Date().toISOString(),
    });
  }

  static emitDeleted(payload: {
    orderId: string;
    table: number;
    draft: boolean;
    status: boolean;
  }) {
    this.emit({
      type: "order:deleted",
      orderId: payload.orderId,
      table: payload.table,
      draft: payload.draft,
      status: payload.status,
      changedAt: new Date().toISOString(),
    });
  }
}
