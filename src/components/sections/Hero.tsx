"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Product } from "@/components/ProductCard";

interface HeroProps {
  products: Product[];
  slides: any[];
  currentHero: number;
  direction: number;
  onNext: () => void;
  onPrev: () => void;
  onSetHero: (index: number) => void;
  onAddToCart: (product: Product) => void;
}

export const heroProductsData = [
  {
    id: 1,
    productId: "aquamarine-silk",
    name: "Aquamarine",
    fullName: "Aquamarine Silk",
    image: "/images/hero3.png",
    color: "#a5d8d9",
    description: "Handmade blue stones.",
    scale: 0.5,
    shadowColor: "rgba(15, 118, 110, 0.4)",
    decor: [
      { type: "droplet", x: "15%", y: "20%", size: 40, delay: 0.1 },
      { type: "droplet", x: "85%", y: "15%", size: 60, delay: 0.3 },
      { type: "droplet", x: "75%", y: "70%", size: 30, delay: 0.5, hideOnMobile: true },
      { type: "droplet", x: "10%", y: "80%", size: 50, delay: 0.2 },
      { type: "droplet", x: "30%", y: "10%", size: 35, delay: 0.6, hideOnMobile: true },
      { type: "droplet", x: "60%", y: "25%", size: 45, delay: 0.4, hideOnMobile: true },
      { type: "droplet", x: "40%", y: "85%", size: 55, delay: 0.7, hideOnMobile: true },
      { type: "droplet", x: "90%", y: "60%", size: 40, delay: 0.8 },
    ]
  },
  {
    id: 2,
    productId: "amethyst-aura",
    name: "Amethyst",
    fullName: "Amethyst Aura",
    image: "/images/ame.png",
    color: "#c4b5fd",
    description: "Deep purple stones.",
    scale: 0.5,
    shadowColor: "rgba(91, 33, 182, 0.4)",
    decor: [
      { type: "shard", x: "20%", y: "25%", size: 50, delay: 0.2 },
      { type: "shard", x: "80%", y: "30%", size: 70, delay: 0.4 },
      { type: "shard", x: "15%", y: "75%", size: 40, delay: 0.1, hideOnMobile: true },
      { type: "shard", x: "70%", y: "85%", size: 60, delay: 0.5, hideOnMobile: true },
      { type: "shard", x: "40%", y: "15%", size: 55, delay: 0.6, hideOnMobile: true },
      { type: "shard", x: "60%", y: "70%", size: 45, delay: 0.3 },
      { type: "shard", x: "10%", y: "40%", size: 50, delay: 0.7, hideOnMobile: true },
      { type: "shard", x: "90%", y: "50%", size: 65, delay: 0.8 },
    ]
  },
  {
    id: 3,
    productId: "obsidian-heart",
    name: "Obsidian",
    fullName: "Obsidian Heart",
    image: "/images/hero2.png",
    color: "#94a3b8",
    description: "Natural black glass.",
    scale: 0.5,
    shadowColor: "rgba(15, 23, 42, 0.5)",
    decor: [
      { type: "fragment", x: "10%", y: "30%", size: 45, delay: 0.3 },
      { type: "fragment", x: "90%", y: "20%", size: 55, delay: 0.1 },
      { type: "fragment", x: "20%", y: "80%", size: 35, delay: 0.4, hideOnMobile: true },
      { type: "fragment", x: "80%", y: "75%", size: 65, delay: 0.2, hideOnMobile: true },
      { type: "fragment", x: "45%", y: "10%", size: 50, delay: 0.6, hideOnMobile: true },
      { type: "fragment", x: "55%", y: "85%", size: 40, delay: 0.5, hideOnMobile: true },
      { type: "fragment", x: "30%", y: "40%", size: 60, delay: 0.7 },
      { type: "fragment", x: "70%", y: "35%", size: 55, delay: 0.8 },
    ]
  },
  {
    id: 4,
    productId: "crystal-white",
    name: "Crystal",
    fullName: "Crystal White",
    image: "/images/hero4.png",
    color: "#cbd5e1",
    description: "Pure clear crystal.",
    scale: 0.5,
    shadowColor: "rgba(71, 85, 105, 0.35)",
    decor: [
      { type: "sparkle", x: "25%", y: "15%", size: 30, delay: 0.1 },
      { type: "sparkle", x: "75%", y: "25%", size: 40, delay: 0.3 },
      { type: "sparkle", x: "15%", y: "65%", size: 25, delay: 0.5, hideOnMobile: true },
      { type: "sparkle", x: "85%", y: "70%", size: 35, delay: 0.2, hideOnMobile: true },
      { type: "sparkle", x: "45%", y: "5%", size: 45, delay: 0.6, hideOnMobile: true },
      { type: "sparkle", x: "55%", y: "80%", size: 30, delay: 0.4, hideOnMobile: true },
      { type: "sparkle", x: "10%", y: "35%", size: 40, delay: 0.7 },
      { type: "sparkle", x: "90%", y: "45%", size: 50, delay: 0.8 },
    ]
  },
];

export default function Hero({ products, slides, currentHero, direction, onNext, onPrev, onSetHero, onAddToCart }: HeroProps) {
  if (!slides || slides.length === 0) return <section className="h-screen w-full bg-background" />;
  
  const current = slides[currentHero];

  if (!current) return null;

  return (
    <section className="relative h-screen w-full overflow-hidden flex flex-col justify-center items-center bg-background">
      {/* Sliding Background Layer */}
      <AnimatePresence initial={true} custom={direction}>
        <motion.div
          key={currentHero}
          custom={direction}
          variants={{
            enter: (dir: number) => ({
              x: dir === 0 ? 0 : (dir > 0 ? "100%" : "-100%"),
              opacity: dir === 0 ? 0 : 1,
              scale: dir === 0 ? 1.1 : 1
            }),
            center: { x: 0, opacity: 1, scale: 1 },
            exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 1 })
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 flex flex-col justify-center items-center overflow-hidden will-change-transform"
          style={{ backgroundColor: current.color }}
        >
          {/* Falling Decorative Elements Layer */}
          <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden hidden md:block">
            <AnimatePresence>
              {current.decor.map((item: any, idx: number) => (
                <motion.div
                  key={`${currentHero}-${idx}`}
                  initial={{ y: -300, opacity: 0, rotate: -45 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 600, opacity: 0, rotate: 45 }}
                  transition={{
                    duration: 1.5,
                    delay: item.delay,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className={`absolute will-change-transform ${item.hideOnMobile ? "hidden md:block" : "block"}`}
                  style={{
                    left: item.x,
                    top: item.y,
                    width: item.size,
                    height: item.size
                  }}
                >
                  {item.type === "droplet" && (
                    <div className="w-full h-full rounded-full bg-white/40 md:bg-white/60 border border-white/40 shadow-lg" />
                  )}
                  {item.type === "shard" && (
                    <div className="w-full h-full rotate-45 bg-white/30 md:bg-white/50 border border-white/50 shadow-2xl" />
                  )}
                  {item.type === "fragment" && (
                    <div className="w-full h-full bg-black/40 md:bg-black/60 border border-white/20 shadow-xl" style={{ clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)" }} />
                  )}
                  {item.type === "sparkle" && (
                    <div className="w-full h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] flex items-center justify-center" style={{ clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" }} />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Background Text */}
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none select-none -translate-y-[8vh]">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
              className="text-[12vw] font-black text-white leading-none tracking-tighter uppercase whitespace-nowrap will-change-transform transform-gpu"
              style={{ transform: "translateZ(0)" }}
            >
              {current.name}
            </motion.h1>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Fixed Product Image Container */}
      <div className="absolute inset-0 flex justify-center items-center z-20 pointer-events-none -translate-y-[8vh]">
        <AnimatePresence>
          <motion.div
            key={currentHero}
            initial={{ opacity: 0, scale: 0.2, y: 500, rotate: -5 }}
            animate={{ opacity: 1, scale: current.scale || 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.2, y: 200 }}
            transition={{
              duration: 0.8,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="absolute w-[90vw] h-[50vh] md:w-[70vw] md:h-[70vh] max-w-[1000px] max-h-[700px] flex justify-center items-center will-change-transform transform-gpu"
            style={{ transform: "translateZ(0)" }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <div
                className="absolute inset-0 opacity-40 blur-3xl rounded-full"
                style={{
                  background: `radial-gradient(circle, ${current.shadowColor || "rgba(0,0,0,0.3)"} 0%, transparent 70%)`,
                  transform: "scale(0.8) translateZ(0)"
                }}
              />
              <Image
                src={current.image}
                alt={current.name}
                fill
                priority
                className="object-contain object-center"
                style={{ transform: "translateZ(0)" }}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Product Info Overlay */}
      <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentHero}
            custom={direction}
            variants={{
              enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 })
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0"
          >
            <div className="max-w-7xl mx-auto h-full w-full px-8 md:px-16 flex items-end justify-start pb-24 md:pb-32">
              <div className="max-w-md pointer-events-auto flex flex-col gap-4">
                {current.averageRating > 0 ? (
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        fill={i < current.averageRating ? "#FFD700" : "transparent"} 
                        stroke={i < current.averageRating ? "#FFD700" : "rgba(255,255,255,0.2)"} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-[10px] uppercase tracking-widest font-bold text-white/60 bg-white/10 px-2 py-1 rounded w-fit">
                    New Piece
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tighter uppercase drop-shadow-md"
                  >
                    {current.fullName}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-white/80 text-sm md:text-base font-medium max-w-sm leading-relaxed drop-shadow-sm"
                  >
                    {current.description}
                  </motion.p>
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <button
                    onClick={() => {
                      const product = products.find(p => p.id === current.productId);
                      if (product) onAddToCart(product);
                    }}
                    className="bg-white text-foreground px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl cursor-pointer"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => {
                      const shopSection = document.getElementById("shop");
                      if (shopSection) shopSection.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer group"
                  >
                    See All Pieces
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slider Controls */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        onClick={onPrev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 p-4 rounded-full text-white/80 hover:text-white transition-all hover:scale-110 active:scale-95 cursor-pointer group"
      >
        <ChevronLeft size={48} strokeWidth={1.5} className="transition-transform group-hover:-translate-x-1" />
      </motion.button>

      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        onClick={onNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 p-4 rounded-full text-white/80 hover:text-white transition-all hover:scale-110 active:scale-95 cursor-pointer group"
      >
        <ChevronRight size={48} strokeWidth={1.5} className="transition-transform group-hover:translate-x-1" />
      </motion.button>

      {/* Progress Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-3"
      >
        {slides.map((_: any, i: number) => (
          <button
            key={i}
            onClick={() => onSetHero(i)}
            className={`h-[3px] transition-all duration-500 rounded-full ${i === currentHero ? "w-12 bg-white" : "w-4 bg-white/20 hover:bg-white/40"}`}
          />
        ))}
      </motion.div>
    </section>
  );
}
