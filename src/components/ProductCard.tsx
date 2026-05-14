import Image from "next/image";
import FadeIn from "@/components/FadeIn";

export interface Product {
  id: string;
  name: string;
  price: number | string;
  description: string;
  imageStill: string;
  imageWorn: string;
}

interface ProductCardProps {
  product: Product;
  delay?: number;
}

export default function ProductCard({ product, delay = 0.1 }: ProductCardProps) {
  return (
    <FadeIn delay={delay} className="group cursor-pointer">
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
      <div className="flex justify-between items-center text-foreground">
        <h3 className="font-medium uppercase tracking-wider text-sm">{product.name}</h3>
        <span className="font-light">₱{product.price}</span>
      </div>
      <p className="text-xs text-foreground/70 mt-2 font-light uppercase tracking-widest">{product.description}</p>
    </FadeIn>
  );
}
