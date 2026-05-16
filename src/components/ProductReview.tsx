"use client";

import { Star } from "lucide-react";
import { Review } from "@/types/product";

interface ProductReviewProps {
  review: Review;
}

export default function ProductReview({ review }: ProductReviewProps) {
  const dateObj = review.date ? new Date(review.date) : null;
  const isValidDate = dateObj && !isNaN(dateObj.getTime());

  const formattedDate = isValidDate 
    ? dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : (typeof review.date === 'string' ? review.date : 'Recently');

  return (
    <div className="bg-pink-calm/10 p-5 rounded-2xl border border-pink-calm/20">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-semibold text-xs uppercase tracking-widest text-foreground/80">{review.author}</h4>
          <p className="text-[10px] text-foreground/40 mt-1">{formattedDate}</p>
        </div>
      </div>
      <div className="flex gap-0.5 mb-1">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={12} 
            className={i < review.rating ? "fill-pink-accent text-pink-accent" : "text-foreground/10"} 
          />
        ))}
      </div>
      <p className="text-sm text-foreground/70 italic font-light leading-relaxed">
        "{review.content}"
      </p>
    </div>
  );
}
