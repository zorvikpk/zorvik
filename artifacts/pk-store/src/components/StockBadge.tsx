import { Flame } from 'lucide-react';

const PRODUCT_STOCK: Record<string, number> = {
  'tshirt-1': 7,
  'ebook-1': 999,
  'perfume-1': 4,
};

interface StockBadgeProps {
  productId: string;
  className?: string;
}

export function StockBadge({ productId, className = '' }: StockBadgeProps) {
  const stock = PRODUCT_STOCK[productId];
  if (!stock || stock > 20) return null;

  const isLow = stock <= 5;

  return (
    <div className={`flex items-center gap-1.5 text-xs font-bold ${isLow ? 'text-destructive' : 'text-orange-500'} ${className}`}>
      <Flame size={12} className={isLow ? 'animate-pulse' : ''} />
      {isLow ? `Only ${stock} left — Order fast!` : `${stock} in stock`}
    </div>
  );
}

export function getProductStock(productId: string): number {
  return PRODUCT_STOCK[productId] ?? 99;
}
