"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AddToCartButtonProps {
  onClick: (e: React.MouseEvent) => void;
  className?: string;
}

export default function AddToCartButton({ onClick, className = "" }: AddToCartButtonProps) {
  const [isAdded, setIsAdded] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening modal
    onClick(e);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isAdded}
      className={`relative h-10 px-4 rounded-full overflow-hidden transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-default ${
        isAdded 
        ? "bg-pink-accent text-foreground w-28" 
        : "bg-foreground text-white-calm hover:bg-foreground/90 w-10 md:w-auto"
      } ${className}`}
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
