import { useState } from 'react';
import { ThumbsUp } from 'lucide-react';

type Review = {
  id: string;
  name: string;
  city: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  helpful: number;
};

const PRODUCT_REVIEWS: Record<string, Review[]> = {
  'tshirt-1': [
    { id: 'r1', name: 'Ali Hassan', city: 'Lahore', rating: 5, date: '2 days ago', comment: 'Bohot acha quality hai! Exactly jaisi description mein thi. Size M bilkul perfect fit tha. Fast delivery bhi mili. Recommended!', verified: true, helpful: 14 },
    { id: 'r2', name: 'Zara K.', city: 'Karachi', rating: 5, date: '5 days ago', comment: 'Great fabric, soft and comfortable. Definitely buying more colors.', verified: true, helpful: 8 },
    { id: 'r3', name: 'Usman Raza', city: 'Islamabad', rating: 4, date: '1 week ago', comment: 'Good product, packaging was neat. Color is exactly as shown in the photo.', verified: true, helpful: 5 },
    { id: 'r4', name: 'Fatima N.', city: 'Peshawar', rating: 5, date: '2 weeks ago', comment: 'COD was easy, delivery in 3 days. T-shirt quality bohot acha hai.', verified: true, helpful: 11 },
  ],
  'ebook-1': [
    { id: 'r5', name: 'Bilal Sheikh', city: 'Rawalpindi', rating: 5, date: '3 days ago', comment: 'Excellent content! Instantly got the PDF on WhatsApp. Very detailed guide for rock music lovers.', verified: true, helpful: 7 },
    { id: 'r6', name: 'Hira M.', city: 'Lahore', rating: 4, date: '1 week ago', comment: 'Good value for money. Learned a lot about music theory.', verified: true, helpful: 3 },
  ],
  'perfume-1': [
    { id: 'r7', name: 'Ahmed Malik', city: 'Karachi', rating: 5, date: '1 day ago', comment: 'Fragrance lasts all day! Original smell, bohot acha imported product. Packing bhi premium thi.', verified: true, helpful: 22 },
    { id: 'r8', name: 'Sara Qureshi', city: 'Lahore', rating: 5, date: '4 days ago', comment: 'Received in perfect condition. Smell is luxurious and long-lasting. Will order again!', verified: true, helpful: 17 },
    { id: 'r9', name: 'Kamran B.', city: 'Multan', rating: 4, date: '1 week ago', comment: 'Good product but delivery took 4 days. Overall satisfied.', verified: true, helpful: 6 },
  ],
};

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= rating ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className={i <= rating ? 'text-yellow-400' : 'text-muted-foreground/30'}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

interface ReviewsSectionProps {
  productId: string;
}

export function ReviewsSection({ productId }: ReviewsSectionProps) {
  const reviews = PRODUCT_REVIEWS[productId] || [];
  const [helpfulClicked, setHelpfulClicked] = useState<Set<string>>(new Set());

  if (reviews.length === 0) return null;

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const fiveStarCount = reviews.filter(r => r.rating === 5).length;

  const handleHelpful = (id: string) => {
    setHelpfulClicked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="mt-12 border-t border-border pt-10">
      <div className="flex flex-col sm:flex-row gap-8 items-start mb-8">
        <div className="flex flex-col items-center bg-muted/40 rounded-2xl p-6 min-w-[140px] text-center">
          <span className="text-6xl font-black text-primary">{avgRating.toFixed(1)}</span>
          <StarRating rating={Math.round(avgRating)} size={18} />
          <span className="text-xs text-muted-foreground mt-2">{reviews.length} reviews</span>
          <div className="mt-3 text-xs font-bold text-green-600 bg-green-500/10 px-2 py-1 rounded-full">
            {Math.round((fiveStarCount / reviews.length) * 100)}% 5-Star
          </div>
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-black mb-1 uppercase tracking-tight">Customer Reviews</h2>
          <p className="text-muted-foreground text-sm mb-4">Verified purchases from real customers across Pakistan</p>
          <div className="space-y-1.5">
            {[5, 4, 3, 2, 1].map(star => {
              const count = reviews.filter(r => r.rating === star).length;
              const pct = reviews.length ? (count / reviews.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="w-8 text-right font-medium text-muted-foreground">{star}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400 flex-shrink-0"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-6 text-xs text-muted-foreground">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map(review => (
          <div key={review.id} className="bg-card border border-border rounded-xl p-5">
            <div className="flex justify-between items-start gap-2 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-black flex items-center justify-center text-sm flex-shrink-0">
                  {review.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm">{review.name}</span>
                    {review.verified && (
                      <span className="text-[10px] bg-green-500/10 text-green-600 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        Verified
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{review.city} · {review.date}</span>
                </div>
              </div>
              <StarRating rating={review.rating} size={13} />
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed mb-3">{review.comment}</p>
            <button
              onClick={() => handleHelpful(review.id)}
              className={`flex items-center gap-1.5 text-xs transition-colors ${helpfulClicked.has(review.id) ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <ThumbsUp size={12} />
              Helpful ({review.helpful + (helpfulClicked.has(review.id) ? 1 : 0)})
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
