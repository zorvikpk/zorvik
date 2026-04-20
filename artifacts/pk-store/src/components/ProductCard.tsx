import { Link } from 'wouter';
import { Product } from '../data/products';
import { motion } from 'framer-motion';
import { StockBadge } from './StockBadge';

interface ProductCardProps {
  product: Product;
}

function StarRatingSmall({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 items-center">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill={i <= rating ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className={i <= rating ? 'text-yellow-400' : 'text-muted-foreground/20'}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

const PRODUCT_RATINGS: Record<string, { avg: number; count: number }> = {
  'tshirt-1': { avg: 5, count: 47 },
  'ebook-1': { avg: 4, count: 12 },
  'perfume-1': { avg: 5, count: 31 },
};

export function ProductCard({ product }: ProductCardProps) {
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const rating = PRODUCT_RATINGS[product.id];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col bg-card border border-card-border rounded-xl overflow-hidden shadow-sm hover:shadow-md"
      data-testid={`card-product-${product.id}`}
    >
      <Link href={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-muted">
        {discount > 0 && (
          <div className="absolute top-2 left-2 z-10 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded-md">
            Save {discount}%
          </div>
        )}
        <div className="absolute bottom-2 left-2 z-10 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
          {product.category}
        </div>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <Link href={`/product/${product.id}`} className="hover:underline">
          <h3 className="font-bold text-base leading-tight text-foreground line-clamp-2">{product.name}</h3>
        </Link>

        {rating && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <StarRatingSmall rating={Math.round(rating.avg)} />
            <span className="text-xs text-muted-foreground">({rating.count})</span>
          </div>
        )}

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-xl font-black text-primary">Rs. {product.price}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-muted-foreground line-through">Rs. {product.compareAtPrice}</span>
          )}
        </div>

        <div className="mt-2 mb-3">
          <StockBadge productId={product.id} />
        </div>

        <Link
          href={`/product/${product.id}`}
          className="mt-auto w-full bg-foreground text-background font-semibold py-3 rounded-lg text-center transition-colors hover:bg-primary hover:text-primary-foreground"
          data-testid={`button-order-${product.id}`}
        >
          Order Now
        </Link>
      </div>
    </motion.div>
  );
}
