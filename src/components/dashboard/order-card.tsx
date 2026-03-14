import { Clock3, Eye, Receipt, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type OrderCardProps = {
  orderId: string;
  customerName: string;
  tableNumber: number;
  statusLabel: string;
  totalLabel: string;
  createdAtLabel: string;
  onOpenDetails: (orderId: string) => void;
  items: Array<{
    id: string;
    name: string;
    amount: number;
    unitPriceInCents: number;
  }>;
};

export default function OrderCard({
  orderId,
  customerName,
  tableNumber,
  statusLabel,
  totalLabel,
  createdAtLabel,
  onOpenDetails,
  items,
}: OrderCardProps) {
  return (
    <Card className="border border-border bg-card/95 py-0 shadow-sm">
      <CardHeader className="border-b border-border/60 px-4 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold text-card-foreground">
              Pedido #{orderId.slice(0, 8)}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{customerName}</p>
          </div>

          <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {statusLabel}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-4 py-4">
        <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="size-4 text-primary" />
            <span>Mesa {tableNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock3 className="size-4 text-primary" />
            <span>{createdAtLabel}</span>
          </div>
        </div>

        <div className="rounded-lg border border-border/70 bg-muted/25 p-3">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Itens do pedido
          </p>
          {items.length > 0 ? (
            <ul className="space-y-1 text-sm text-card-foreground">
              {items.slice(0, 3).map((item) => (
                <li key={item.id} className="truncate">
                  {item.amount}x - {item.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Sem itens no pedido.
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-border/60 bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Receipt className="size-4 text-primary" />
          <span>Total</span>
          <strong className="text-base font-semibold text-primary">
            {totalLabel}
          </strong>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="cursor-pointer"
          onClick={() => onOpenDetails(orderId)}
        >
          <Eye className="size-3.5" />
          Detalhes
        </Button>
      </CardFooter>
    </Card>
  );
}
