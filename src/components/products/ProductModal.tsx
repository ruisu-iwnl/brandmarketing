"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, ShoppingCart, ChevronLeft, ChevronRight, MessageCircle, Link2 } from "lucide-react";
import Image from "next/image";
import { Product, Review } from "@/types/product";
import ProductReview from "./ProductReview";
import { trackEvent } from "@/lib/analytics";

import { useCart } from "@/context/CartContext";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  settings?: {
    analyticsResetAt: string | null;
  };
}

const REVIEWS_PER_PAGE = 3;

export default function ProductModal({ isOpen, onClose, product, settings }: ProductModalProps) {
  const { addToCart } = useCart();
  const [activeProduct, setActiveProduct] = useState<Product | null>(product);
  const [reviewPage, setReviewPage] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

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

  // Sync active product state when product prop changes
  useEffect(() => {
    if (product) {
      setActiveProduct(product);
      setReviewPage(0);
      setCurrentImageIndex(0);
      setIsAdded(false);
    }
  }, [product]);

  // Handle view tracking with Grand Opening Reset Awareness
  useEffect(() => {
    if (product) {
      trackEvent("view_item", "engagement", product.name);

      const viewKey = `viewed_${product.id}`;
      const alreadyViewed = localStorage.getItem(viewKey);
      const resetAt = settings?.analyticsResetAt;
      
      let shouldCountView = !alreadyViewed;
      
      if (alreadyViewed && resetAt) {
        const lastViewedTime = parseInt(alreadyViewed);
        const resetTime = new Date(resetAt).getTime();
        if (resetTime > lastViewedTime) {
          shouldCountView = true;
        }
      }

      if (shouldCountView) {
        fetch(`/api/products/${product.id}/view`, { method: 'POST' })
          .then(async (res) => {
            if (res.ok) {
              localStorage.setItem(viewKey, Date.now().toString());
            }
          })
          .catch(err => console.error('Failed to increment view count:', err));
      }
    }
  }, [product?.id, settings?.analyticsResetAt]);

  const handleAddClick = () => {
    if (activeProduct) {
      addToCart(activeProduct);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  const productImages = activeProduct ? [
    activeProduct.imageWorn,
    activeProduct.imageStill,
    ...(activeProduct.gallery || []),
  ].filter(Boolean) : [];

  const mediaItems = [
    ...productImages.map(url => ({ type: 'image' as const, url })),
    ...(activeProduct?.video && typeof activeProduct.video === 'string' ? [{ type: 'video' as const, url: activeProduct.video }] : [])
  ].filter(item => item.url); // Ensure no empty URLs get through

  const reviews = activeProduct?.reviews ?? [];
  const averageRating = reviews.length > 0 
    ? Math.round(reviews.reduce((acc: number, r: Review) => acc + r.rating, 0) / reviews.length) 
    : 0;

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
              md:flex-row overflow-x-hidden overscroll-none touch-pan-y
            "
          >
            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-5 right-5 p-2 bg-pink-calm/60 rounded-full hover:bg-pink-calm transition-colors z-[102]"
            >
              <X size={18} className="text-foreground" />
            </motion.button>

            {/* Left — product media carousel (desktop only) */}
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
                      setCurrentImageIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
                    } else if (info.offset.x < -swipeThreshold) {
                      setCurrentImageIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
                    }
                  }}
                  className="relative w-full h-full cursor-grab active:cursor-grabbing touch-none"
                >
                  {mediaItems[currentImageIndex]?.type === 'video' ? (
                    <video 
                      src={mediaItems[currentImageIndex].url}
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    <Image
                      src={mediaItems[currentImageIndex]?.url}
                      alt={activeProduct.name}
                      fill
                      className={mediaItems[currentImageIndex]?.url === activeProduct.imageStill ? "object-contain p-20" : "object-cover"}
                      draggable={false}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Chevrons */}
              {mediaItems.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <button 
                    onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1))}
                    className="p-2 bg-white/50 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm pointer-events-auto"
                  >
                    <ChevronLeft size={24} className="text-foreground" />
                  </button>
                  <button 
                    onClick={() => setCurrentImageIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1))}
                    className="p-2 bg-white/50 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm pointer-events-auto"
                  >
                    <ChevronRight size={24} className="text-foreground" />
                  </button>
                </div>
              )}

              {/* Bullets */}
              {mediaItems.length > 1 && (
                <div className="absolute bottom-6 left-0 w-full flex justify-center gap-2">
                  {mediaItems.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImageIndex(i)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentImageIndex ? "bg-foreground w-6" : "bg-foreground/20 hover:bg-foreground/40"}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right — scrollable content panel */}
            <div className="modal-scroll flex flex-col flex-1 overflow-y-auto md:w-[45%] p-8 md:p-10">

              {/* Mobile-only media carousel */}
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
                        setCurrentImageIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
                      } else if (info.offset.x < -swipeThreshold) {
                        setCurrentImageIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
                      }
                    }}
                    className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
                  >
                    {mediaItems[currentImageIndex]?.type === 'video' ? (
                      <video 
                        src={mediaItems[currentImageIndex].url}
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    ) : (
                      <Image
                        src={mediaItems[currentImageIndex]?.url}
                        alt={activeProduct.name}
                        fill
                        className={mediaItems[currentImageIndex]?.url === activeProduct.imageStill ? "object-contain p-16" : "object-cover"}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        draggable={false}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Bullets Mobile */}
                {mediaItems.length > 1 && (
                  <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2 pointer-events-none">
                    {mediaItems.map((_, i) => (
                      <button
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentImageIndex ? "bg-foreground w-4" : "bg-foreground/20"}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <h2 className="text-3xl md:text-4xl font-light text-foreground mb-1">{activeProduct.name}</h2>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-2xl font-light text-foreground">₱{product?.price}</span>
                <div className={`px-2 py-1 rounded text-[10px] uppercase tracking-widest font-bold ${product && product.stock < 5 ? 'bg-red-50 text-red-400' : 'bg-pink-calm/30 text-foreground/40'}`}>
                  {product?.stock} Units Available
                </div>
              </div>

              {reviews.length > 0 ? (
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={i < averageRating ? "fill-pink-accent text-pink-accent" : "text-foreground/10"} 
                    />
                  ))}
                  <span className="text-sm text-foreground/50 ml-2">({reviews.length} Reviews)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-xs uppercase tracking-widest font-bold text-pink-accent bg-pink-accent/10 px-2 py-1 rounded">New Collection</span>
                  <span className="text-xs text-foreground/40">No reviews yet</span>
                </div>
              )}

              <p className="text-sm text-foreground/70 leading-relaxed mb-8 font-light">
                {activeProduct.description}
              </p>

              <button 
                onClick={handleAddClick}
                disabled={isAdded || activeProduct?.isSoldOut || (activeProduct?.stock || 0) <= 0}
                className={`w-full py-4 uppercase tracking-widest text-sm transition-all duration-300 flex items-center justify-center gap-2 mb-8 shrink-0 cursor-pointer disabled:cursor-default ${
                  isAdded 
                  ? "bg-white border border-pink-accent text-pink-accent shadow-lg shadow-pink-accent/10" 
                  : (activeProduct?.isSoldOut || (activeProduct?.stock || 0) <= 0)
                    ? "bg-foreground/5 text-foreground/20 border border-foreground/10"
                    : "bg-pink-accent text-foreground hover:shadow-lg hover:shadow-pink-accent/20"
                }`}
              >
                {isAdded ? (
                  <>
                    <ShoppingCart size={18} />
                    Added!
                  </>
                ) : (activeProduct?.isSoldOut || (activeProduct?.stock || 0) <= 0) ? (
                  <>
                    <X size={18} />
                    Sold Out
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} />
                    Add to Cart
                  </>
                )}
              </button>
              
              {/* Social Share Section */}
              <div className="mb-8 p-6 bg-pink-calm/10 border border-pink-calm/20">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/40">Share this piece</p>
                  <button 
                    onClick={() => {
                      const url = `${window.location.origin}?product=${activeProduct.slug}`;
                      navigator.clipboard.writeText(url);
                      setCopySuccess(true);
                      setTimeout(() => setCopySuccess(false), 2000);
                    }}
                    className="text-[10px] uppercase tracking-widest font-bold text-pink-accent flex items-center gap-2 hover:opacity-70 transition-opacity"
                  >
                    {copySuccess ? "Link Copied!" : <><Link2 size={12} /> Copy Link</>}
                  </button>
                </div>
                <div className="flex flex-wrap gap-4">
                  {[
                    { 
                      name: 'WhatsApp', 
                      icon: <MessageCircle size={18} />, 
                      color: '#25D366', 
                      url: `https://wa.me/?text=${encodeURIComponent(`Look at this beautiful ${activeProduct.name} I found at ${process.env.NEXT_PUBLIC_SITE_NAME || 'Li\'L Caca'}!\n\n` + (process.env.NEXT_PUBLIC_SITE_URL || window.location.origin) + '?product=' + activeProduct.slug)}` 
                    },
                    { 
                      name: 'Facebook', 
                      icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>, 
                      color: '#1877F2', 
                      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent((process.env.NEXT_PUBLIC_SITE_URL || window.location.origin) + '?product=' + activeProduct.slug)}&quote=${encodeURIComponent(`Check out this beautiful ${activeProduct.name} at ${process.env.NEXT_PUBLIC_SITE_NAME || 'Li\'L Caca'}!`)}` 
                    },
                    { 
                      name: 'Pinterest', 
                      icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.72-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.261 7.929-7.261 4.162 0 7.398 2.966 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.607 0 11.985-5.36 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/></svg>, 
                      color: '#BD081C', 
                      url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent((process.env.NEXT_PUBLIC_SITE_URL || window.location.origin) + '?product=' + activeProduct.slug)}&media=${encodeURIComponent((process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || window.location.origin) + activeProduct.imageStill)}&description=${encodeURIComponent(`Check out the ${activeProduct.name} from ${process.env.NEXT_PUBLIC_SITE_NAME || 'Li\'L Caca'}!`)}` 
                    },
                    { 
                      name: 'X', 
                      icon: <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.494h2.039L6.486 3.24H4.298l13.311 17.407z"/></svg>, 
                      color: '#000000', 
                      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`In love with this ${activeProduct.name} from ${process.env.NEXT_PUBLIC_SITE_NAME || 'Li\'L Caca'}!`)}&url=${encodeURIComponent((process.env.NEXT_PUBLIC_SITE_URL || window.location.origin) + '?product=' + activeProduct.slug)}` 
                    },
                    { 
                      name: 'Reddit', 
                      icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.056 1.597.04.21.06.42.06.635 0 2.271-2.574 4.113-5.75 4.113-3.176 0-5.75-1.842-5.75-4.113 0-.21.019-.42.059-.635-.62-.264-1.056-.881-1.056-1.597 0-.968.786-1.754 1.754-1.754.483 0 .903.19 1.213.501 1.191-.854 2.84-1.411 4.656-1.485l.858-4.048 2.843.595a1.25 1.25 0 0 1 1.247 1.249zm-8.635 8.134c-.603 0-1.089.486-1.089 1.089 0 .602.486 1.089 1.089 1.089.602 0 1.088-.487 1.088-1.089 0-.603-.486-1.089-1.088-1.089zm6.111 2.25c-.23 0-.445-.017-.637-.05-.325.235-.772.399-1.289.399-.515 0-.962-.164-1.287-.399a3.834 3.834 0 0 1-.639.051c-1.393 0-2.525-.767-2.525-1.71 0-.943 1.132-1.71 2.525-1.71.23 0 .445.017.637.05.325-.235.772-.4 1.289-.4.515 0 .962.165 1.287.4.2-.033.41-.05.639-.05 1.393 0 2.525.767 2.525 1.71 0 .943-1.132 1.71-2.525 1.71zm-2.022-2.25c-.602 0-1.088.486-1.088 1.089 0 .602.486 1.089 1.088 1.089.603 0 1.089-.487 1.089-1.089 0-.603-.486-1.089-1.089-1.089z"/></svg>, 
                      color: '#FF4500', 
                      url: `https://www.reddit.com/submit?url=${encodeURIComponent((process.env.NEXT_PUBLIC_SITE_URL || window.location.origin) + '?product=' + activeProduct.slug)}&title=${encodeURIComponent(`Found this amazing ${activeProduct.name} at ${process.env.NEXT_PUBLIC_SITE_NAME || 'Li\'L Caca'}!`)}` 
                    }
                  ].map((platform) => (
                    <button
                      key={platform.name}
                      onClick={() => {
                        const width = 600;
                        const height = 450;
                        const left = (window.innerWidth - width) / 2;
                        const top = (window.innerHeight - height) / 2;
                        window.open(
                          platform.url,
                          `share-${platform.name}`,
                          `width=${width},height=${height},left=${left},top=${top},location=no,toolbar=no,menubar=no,status=no`
                        );
                      }}
                      className="w-10 h-10 rounded-full border border-pink-calm flex items-center justify-center text-foreground/40 hover:text-white hover:border-transparent transition-all duration-300 group overflow-hidden relative cursor-pointer"
                      title={`Share on ${platform.name}`}
                    >
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                        style={{ backgroundColor: platform.color }}
                      />
                      <span className="relative z-10 transition-transform duration-300 group-hover:scale-110">
                        {platform.icon}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

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
                        {visibleReviews.map((review: Review) => (
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
