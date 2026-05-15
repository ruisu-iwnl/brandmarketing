"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "@/components/FadeIn";
import ProductCard, { Product } from "@/components/ProductCard";

interface ShopProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function Shop({ products, onSelectProduct, onAddToCart }: ShopProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'necklace' | 'bracelet'>('all');
  const [sortBy, setBy] = useState<'best-selling' | 'price-low' | 'price-high'>('best-selling');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredProducts = products
    .filter(p => activeCategory === 'all' || p.category === activeCategory)
    .sort((a, b) => {
      if (sortBy === 'best-selling') return b.ordersCount - a.ordersCount;
      if (sortBy === 'price-low') return (Number(a.price) - Number(b.price));
      if (sortBy === 'price-high') return (Number(b.price) - Number(a.price));
      return 0;
    });

  return (
    <section id="shop" className="scroll-mt-[72px] py-24 px-8 bg-pink-calm/10 relative z-10">
      <FadeIn className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-light text-foreground">The Collection</h2>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`text-sm uppercase tracking-wider border-b pb-1 transition-all ${isFilterOpen ? 'text-pink-accent border-pink-accent' : 'text-foreground border-foreground hover:text-pink-accent hover:border-pink-accent'}`}
          >
            {isFilterOpen ? 'Close Menu' : 'Filter / Sort'}
          </button>
        </div>

        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-16"
            >
              <div className="flex flex-col md:flex-row gap-12 py-8 border-t border-pink-accent/10">
                {/* Category Filter */}
                <div className="flex flex-col gap-4">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-pink-accent font-medium">Category</span>
                  <div className="flex gap-6">
                    {(['all', 'necklace', 'bracelet'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`text-xs uppercase tracking-widest transition-all ${activeCategory === cat ? 'text-foreground font-bold' : 'text-foreground/40 hover:text-foreground'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Filter */}
                <div className="flex flex-col gap-4">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-pink-accent font-medium">Sort By</span>
                  <div className="flex gap-6">
                    {[
                      { id: 'best-selling', label: 'Best Selling' },
                      { id: 'price-low', label: 'Price: Low-High' },
                      { id: 'price-high', label: 'Price: High-Low' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setBy(opt.id as any)}
                        className={`text-xs uppercase tracking-widest transition-all ${sortBy === opt.id ? 'text-foreground font-bold' : 'text-foreground/40 hover:text-foreground'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16"
        >
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              delay={0.1 * (index + 1)}
              onClick={() => onSelectProduct(product)}
              onAddToCart={onAddToCart}
            />
          ))}
        </motion.div>
      </FadeIn>
    </section>
  );
}
