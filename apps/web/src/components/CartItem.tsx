import { Button } from "@/components/ui/button";
import type { CartItem as Item } from "@/types";
import { formatCurrency } from "@/lib/utils";

export function CartItem({ item, onPlus, onMinus, onRemove }: { item: Item; onPlus: () => void; onMinus: () => void; onRemove: () => void }) {
  return (
    <div className="flex items-center justify-between rounded border p-3">
      <div>
        <p className="font-medium">{item.name}</p>
        <p className="text-sm text-gray-500">{formatCurrency(item.price)}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={onMinus}>-</Button>
        <span>{item.qty}</span>
        <Button onClick={onPlus}>+</Button>
        <Button className="bg-red-600" onClick={onRemove}>Remove</Button>
      </div>
    </div>
  );
}
