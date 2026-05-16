import Image from "next/image";
import FadeIn from "@/components/ui/FadeIn";
import { Review, Product, CartItem } from "@/types/product";


import AddToCartButton from "./AddToCartButton";

interface ProductCardProps {
  product: Product;
  delay?: number;
  onClick?: () => void;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, delay = 0.1, onClick, onAddToCart }: ProductCardProps) {
  const isSoldOut = product.isSoldOut || (product.stock || 0) <= 0;

  return (
    <div className="relative group">
      <FadeIn delay={delay} className="h-full">
        <div className="relative flex flex-col h-full bg-white p-3 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-2xl group/card">
          {/* Image Container */}
          <div 
            onClick={onClick} 
            className="aspect-[4/5] mb-6 overflow-hidden relative cursor-pointer rounded-xl bg-pink-calm/10 group-hover:bg-pink-calm/20 transition-colors duration-500"
          >
            {/* Badges */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
              {isSoldOut ? (
                <span className="bg-foreground text-white text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-lg">
                  Sold Out
                </span>
              ) : product.newArrival && (
                <span className="bg-pink-accent text-foreground text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-lg">
                  New Collection
                </span>
              )}
            </div>

            {/* Worn Image (Hover) */}
            <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700">
              <Image
                src={product.imageWorn}
                alt={`${product.name} Worn`}
                fill
                className="object-cover scale-105 group-hover/card:scale-100 transition-transform duration-1000"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>

            {/* Still Image (Default) */}
            <div className="absolute inset-0 flex items-center justify-center p-8 group-hover/card:opacity-0 transition-opacity duration-500">
              <div className="relative w-full h-full">
                <Image
                  src={product.imageStill}
                  alt={`${product.name} Still`}
                  fill
                  className="object-contain drop-shadow-2xl scale-90 group-hover/card:scale-110 transition-transform duration-1000"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>
          </div>
          
          {/* Info Section */}
          <div className="flex flex-col flex-1 px-2 pb-2">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold uppercase tracking-[0.15em] text-xs text-foreground/90 group-hover/card:text-pink-accent transition-colors duration-300">
                  {product.name}
                </h3>
                <p className="text-[10px] text-foreground/40 mt-1 font-light uppercase tracking-widest line-clamp-1 pr-12">
                  {product.description}
                </p>
              </div>
              <span className="font-bold text-xs text-foreground">₱{product.price}</span>
            </div>

            <div className="mt-auto flex items-center justify-between gap-4">
              <span className={`text-[9px] uppercase tracking-widest font-medium ${product.stock < 5 ? 'text-red-400' : 'text-foreground/30'}`}>
                {product.stock} pieces left
              </span>
              
              <div className="shrink-0">
                <AddToCartButton 
                  onClick={() => onAddToCart?.(product)} 
                  disabled={isSoldOut} 
                />
              </div>
            </div>
          </div>
          
          {/* Card Click Overlay (Transparent) */}
          <div 
            onClick={onClick}
            className="absolute inset-0 z-10 cursor-pointer rounded-2xl"
            style={{ height: 'calc(100% - 60px)' }}
          />
        </div>
      </FadeIn>
    </div>
  );
}
