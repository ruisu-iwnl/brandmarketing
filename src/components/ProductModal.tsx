"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Product } from "./ProductCard";
import ProductReview from "./ProductReview";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart?: (product: Product) => void;
}

const REVIEWS_PER_PAGE = 3;

export default function ProductModal({ isOpen, onClose, product, onAddToCart }: ProductModalProps) {
  const [activeProduct, setActiveProduct] = useState<Product | null>(product);
  const [reviewPage, setReviewPage] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (product) {
      setActiveProduct(product);
      setReviewPage(0);
      setCurrentImageIndex(0);
      setIsAdded(false);
    }
  }, [product]);

  const handleAddClick = () => {
    if (activeProduct && onAddToCart) {
      onAddToCart(activeProduct);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  const productImages = activeProduct ? [activeProduct.imageWorn, activeProduct.imageStill] : [];

  const reviews = activeProduct?.reviews ?? [];
  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
  const visibleReviews = reviews.slice(
    reviewPage * REVIEWS_PER_PAGE,
    reviewPage * REVIEWS_PER_PAGE + REVIEWS_PER_PAGE
  );

  return (
    <AnimatePresence>
      {isOpen && activeProduct && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/90 z-[100]"
          />

          {/* Modal — mobile: bottom sheet, desktop: centered fixed box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="
              fixed z-[101] bg-white-calm shadow-2xl
              inset-x-0 bottom-0 rounded-t-3xl max-h-[92vh] flex flex-col
              md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2
              md:rounded-none md:w-[min(1100px,95vw)] md:h-[min(700px,90vh)]
              md:flex-row md:overflow-hidden overscroll-none
            "
          >
            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-5 right-5 p-2 bg-pink-calm/60 rounded-full hover:bg-pink-calm transition-colors z-10"
            >
              <X size={18} className="text-foreground" />
            </motion.button>

            {/* Left — product image carousel (desktop only) */}
            <div className="hidden md:block relative bg-pink-calm/20 h-full w-[55%] shrink-0 overflow-hidden group">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    const swipeThreshold = 50;
                    if (info.offset.x > swipeThreshold) {
                      setCurrentImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
                    } else if (info.offset.x < -swipeThreshold) {
                      setCurrentImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
                    }
                  }}
                  className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
                >
                  <Image
                    src={productImages[currentImageIndex]}
                    alt={activeProduct.name}
                    fill
                    className={currentImageIndex === 1 ? "object-contain p-20" : "object-cover"}
                    draggable={false}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Chevrons */}
              <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <button 
                  onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1))}
                  className="p-2 bg-white/50 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm pointer-events-auto"
                >
                  <ChevronLeft size={24} className="text-foreground" />
                </button>
                <button 
                  onClick={() => setCurrentImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1))}
                  className="p-2 bg-white/50 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm pointer-events-auto"
                >
                  <ChevronRight size={24} className="text-foreground" />
                </button>
              </div>

              {/* Bullets */}
              <div className="absolute bottom-6 left-0 w-full flex justify-center gap-2">
                {productImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentImageIndex ? "bg-foreground w-6" : "bg-foreground/20 hover:bg-foreground/40"}`}
                  />
                ))}
              </div>
            </div>

            {/* Right — scrollable content panel */}
            <div className="modal-scroll flex flex-col flex-1 overflow-y-auto md:w-[45%] p-8 md:p-10">

              {/* Mobile-only image carousel (scrolls with content) */}
              <div className="md:hidden relative h-[450px] -mx-8 -mt-8 mb-8 shrink-0 overflow-hidden group" style={{ width: 'calc(100% + 4rem)' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(_, info) => {
                      const swipeThreshold = 50;
                      if (info.offset.x > swipeThreshold) {
                        setCurrentImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
                      } else if (info.offset.x < -swipeThreshold) {
                        setCurrentImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
                      }
                    }}
                    className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
                  >
                    <Image
                      src={productImages[currentImageIndex]}
                      alt={activeProduct.name}
                      fill
                      className={currentImageIndex === 1 ? "object-contain p-16" : "object-cover"}
                      draggable={false}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Bullets Mobile */}
                <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2 pointer-events-none">
                  {productImages.map((_, i) => (
                    <button
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentImageIndex ? "bg-foreground w-4" : "bg-foreground/20"}`}
                    />
                  ))}
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-light text-foreground mb-1">{activeProduct.name}</h2>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-2xl font-light text-foreground">₱{product?.price}</span>
                <div className={`px-2 py-1 rounded text-[10px] uppercase tracking-widest font-bold ${product && product.stock < 5 ? 'bg-red-50 text-red-400' : 'bg-pink-calm/30 text-foreground/40'}`}>
                  {product?.stock} Units Available
                </div>
              </div>

              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-pink-accent text-pink-accent" />
                ))}
                <span className="text-sm text-foreground/50 ml-2">({reviews.length} Reviews)</span>
              </div>

              <p className="text-sm text-foreground/70 leading-relaxed mb-8 font-light">
                {activeProduct.description}. Meticulously handcrafted by a single artisan in the Philippines. This piece embodies timeless elegance and delicate artistry, perfect for your everyday journey.
              </p>

              <button 
                onClick={handleAddClick}
                disabled={isAdded}
                className={`w-full py-4 uppercase tracking-widest text-sm transition-all duration-300 flex items-center justify-center gap-2 mb-8 shrink-0 cursor-pointer disabled:cursor-default ${
                  isAdded 
                  ? "bg-pink-accent text-foreground" 
                  : "bg-foreground text-white-calm hover:bg-foreground/90"
                }`}
              >
                {isAdded ? (
                  <>
                    <ShoppingCart size={18} />
                    Added!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} />
                    Add to Cart
                  </>
                )}
              </button>

              {/* Reviews */}
              <div className="border-t border-pink-calm pt-8">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-xs uppercase tracking-widest text-foreground/50">Reviews</h3>
                  {totalPages > 1 && (
                    <span className="text-xs text-foreground/40">Page {reviewPage + 1} of {totalPages}</span>
                  )}
                </div>

                {reviews.length > 0 ? (
                  <>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={reviewPage}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-5"
                      >
                        {visibleReviews.map((review) => (
                          <ProductReview key={review.id} review={review} />
                        ))}
                      </motion.div>
                    </AnimatePresence>

                    {totalPages > 1 && (
                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-pink-calm/30">
                        <button
                          onClick={() => setReviewPage((p) => Math.max(0, p - 1))}
                          disabled={reviewPage === 0}
                          className="flex items-center gap-1 text-xs uppercase tracking-widest text-foreground/60 hover:text-foreground disabled:opacity-25 transition-colors"
                        >
                          <ChevronLeft size={14} /> Prev
                        </button>

                        <div className="flex gap-1.5">
                          {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setReviewPage(i)}
                              className={`w-1.5 h-1.5 rounded-full transition-colors ${i === reviewPage ? "bg-foreground" : "bg-pink-calm hover:bg-foreground/30"}`}
                            />
                          ))}
                        </div>

                        <button
                          onClick={() => setReviewPage((p) => Math.min(totalPages - 1, p + 1))}
                          disabled={reviewPage === totalPages - 1}
                          className="flex items-center gap-1 text-xs uppercase tracking-widest text-foreground/60 hover:text-foreground disabled:opacity-25 transition-colors"
                        >
                          Next <ChevronRight size={14} />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-foreground/40 italic">No reviews yet.</p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
