"use client";

import { Star } from "lucide-react";
import { Review } from "./ProductCard";

interface ProductReviewProps {
  review: Review;
}

export default function ProductReview({ review }: ProductReviewProps) {
  return (
    <div className="border-b border-pink-calm/30 pb-5 last:border-0">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-foreground">{review.author}</span>
        <span className="text-xs text-foreground/50">{review.date}</span>
      </div>
      <div className="flex gap-0.5 mb-1">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={10} 
            className={i < review.rating ? "fill-pink-accent text-pink-accent" : "text-pink-calm"} 
          />
        ))}
      </div>
      <p className="text-sm text-foreground/70 italic font-light leading-relaxed">
        "{review.content}"
      </p>
    </div>
  );
}
