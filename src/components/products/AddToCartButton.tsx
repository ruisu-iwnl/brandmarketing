"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { trackEvent } from "@/lib/analytics";

interface AddToCartButtonProps {
  onClick: (e: React.MouseEvent) => void;
  className?: string;
  disabled?: boolean;
}

export default function AddToCartButton({ onClick, className = "", disabled = false }: AddToCartButtonProps) {
  const [isAdded, setIsAdded] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening modal
    onClick(e);
    setIsAdded(true);
    trackEvent("add_to_cart", "engagement", "Product added from list");
    setTimeout(() => setIsAdded(false), 2000);
  };

  const baseStyles = "relative h-10 px-4 rounded-full overflow-hidden transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-default";
  const stateStyles = isAdded 
    ? "bg-white border border-pink-accent text-pink-accent w-28" 
    : "bg-pink-accent text-foreground hover:shadow-lg hover:shadow-pink-accent/20 w-10 md:w-auto";

  const disabledStyles = (disabled && !isAdded) ? "opacity-30 cursor-not-allowed grayscale" : "";

  return (
    <button
      onClick={handleClick}
      disabled={isAdded || disabled}
      className={`${baseStyles} ${stateStyles} ${disabledStyles} ${className}`.trim()}
    >
      <AnimatePresence mode="wait">
        {isAdded ? (
          <motion.div
            key="added"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <Check size={16} />
            <span className="text-[10px] uppercase tracking-widest font-bold">Added</span>
          </motion.div>
        ) : (
          <motion.div
            key="add"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2"
          >
            <ShoppingCart size={16} />
            <span className="hidden md:inline text-[10px] uppercase tracking-widest font-bold">Add</span>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
