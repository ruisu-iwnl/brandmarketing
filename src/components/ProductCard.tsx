import Image from "next/image";
import FadeIn from "@/components/FadeIn";

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  content: string;
}

export interface Product {
  id: string;
  name: string;
  price: number | string;
  description: string;
  imageStill: string;
  imageWorn: string;
  stock: number;
  reviews?: Review[];
}

export interface CartItem {
  rowId: string;
  product: Product;
  quantity: number;
}

import AddToCartButton from "./AddToCartButton";

interface ProductCardProps {
  product: Product;
  delay?: number;
  onClick?: () => void;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, delay = 0.1, onClick, onAddToCart }: ProductCardProps) {
  return (
    <div className="relative group">
      <div onClick={onClick} className="cursor-pointer">
        <FadeIn delay={delay} className="group">
          <div className="aspect-[4/5] mb-6 overflow-hidden relative">
            <div className="absolute inset-0 z-10 transition-opacity duration-700 group-hover:opacity-0 bg-white-calm/30 overflow-hidden">
              <Image
                src={product.imageWorn}
                alt=""
                fill
                className="object-cover blur-md opacity-30 scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[2px]">
                <Image
                  src={product.imageStill}
                  alt={`${product.name} Still`}
                  fill
                  className="object-contain scale-75 drop-shadow-xl"
                />
              </div>
            </div>
            <div className="absolute inset-0 scale-105 group-hover:scale-100 transition-transform duration-700 bg-pink-calm">
              <Image
                src={product.imageWorn}
                alt={`${product.name} Worn`}
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="flex justify-between items-start text-foreground">
            <div className="flex-1 mr-4">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-light text-sm text-pink-accent">₱{product.price}</span>
                <span className={`text-[10px] uppercase tracking-widest font-medium ${product.stock < 5 ? 'text-red-400' : 'text-foreground/30'}`}>
                  {product.stock} in stock
                </span>
              </div>
              <h3 className="font-medium uppercase tracking-wider text-sm truncate">{product.name}</h3>
              <p className="text-xs text-foreground/70 mt-1 font-light uppercase tracking-widest line-clamp-1">{product.description}</p>
            </div>
            <div className="shrink-0 pt-1">
              <AddToCartButton onClick={() => onAddToCart?.(product)} />
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
