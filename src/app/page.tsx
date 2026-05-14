"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useSpring, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ProvenanceMap from "@/components/ProvenanceMap";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import FadeIn from "@/components/FadeIn";
import { MessageCircle, Mail, ChevronLeft, ChevronRight, Star } from "lucide-react";

const FacebookIcon = ({ size = 22, strokeWidth = 1.5 }: { size?: number; strokeWidth?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
);

import { SITE_CONFIG } from "@/lib/constants";
import ProductCard, { Product, CartItem } from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import CartDrawer from "@/components/CartDrawer";

const productsData: Product[] = [
  {
    id: "aquamarine-silk",
    name: "Aquamarine Silk",
    price: 120,
    description: "Handwoven Blue Aquamarine",
    imageStill: "/images/products/stills/aquamarine-nobg.png",
    imageWorn: "/images/products/worn/aquamarine.png",
    stock: 8,
    reviews: Array.from({ length: 50 }).map((_, i) => ({
      id: `r-aqua-${i}`,
      author: ["Maria C.", "Sophia L.", "Emma R.", "Olivia W.", "Isabella K."][i % 5],
      rating: 5,
      date: `${i + 1} days ago`,
      content: [
        "Absolutely stunning craftsmanship. I wear it everywhere.",
        "The detail is incredible. You can really feel the artisan's touch.",
        "A true masterpiece of Philippine artistry.",
        "Elegant, simple, and exactly what I was looking for.",
        "The quality of the stones is top-notch. Highly recommend!"
      ][i % 5]
    }))
  },
  {
    id: "obsidian-heart",
    name: "Obsidian Heart",
    price: 150,
    description: "Handcrafted Volcanic Glass",
    imageStill: "/images/products/stills/obsidian.png",
    imageWorn: "/images/products/worn/obsidian.png",
    stock: 5,
    reviews: [
      { id: "r3", author: "Elena R.", rating: 4, date: "3 days ago", content: "Beautiful weight and finish. A true statement piece." }
    ]
  },
  {
    id: "crystal-white",
    name: "Crystal White",
    price: 180,
    description: "Handwoven Clear Quartz",
    imageStill: "/images/products/stills/crystalwhite.png",
    imageWorn: "/images/products/worn/crystalwhite.png",
    stock: 12,
    reviews: [
      { id: "r4", author: "Isabella G.", rating: 5, date: "5 days ago", content: "Pure elegance. Goes with everything." }
    ]
  },
  {
    id: "amethyst-aura",
    name: "Amethyst Aura",
    price: 140,
    description: "Handwoven Royal Purple Amethyst",
    imageStill: "/images/products/stills/amethyst.png",
    imageWorn: "/images/products/worn/amethyst.png",
    stock: 3,
    reviews: [
      { id: "r5", author: "Clara S.", rating: 5, date: "1 day ago", content: "The purple is so deep and royal. Love it!" }
    ]
  },
];

const InstagramIcon = ({ size = 22, strokeWidth = 1.5 }: { size?: number; strokeWidth?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
);

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [currentHero, setCurrentHero] = useState(0);
  const [direction, setDirection] = useState(0);

  const heroProducts = [
    {
      id: 1,
      productId: "aquamarine-silk",
      name: "Aquamarine",
      fullName: "Aquamarine Silk",
      image: "/images/hero3.png",
      color: "#a5d8d9",
      description: "Handcrafted with premium blue aquamarine stones, reflecting the serene crystal waters of Cabanatuan.",
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
      description: "Deep royal purple amethyst stones, meticulously woven to capture a sense of timeless Philippine royalty.",
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
      description: "Carved from natural volcanic glass, this piece embodies the raw, powerful beauty of our island's terrain.",
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
      description: "Pure clear quartz crystal, hand-selected for its clarity and woven into a masterpiece of light and form.",
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

  const nextHero = () => {
    setDirection(1);
    setCurrentHero((prev: number) => (prev + 1) % heroProducts.length);
  };
  const prevHero = () => {
    setDirection(-1);
    setCurrentHero((prev: number) => (prev - 1 + heroProducts.length) % heroProducts.length);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(SITE_CONFIG.links.email);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      // Find a row for this product that has < 10 items
      const existingItemIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.quantity < 10
      );

      if (existingItemIndex > -1) {
        const newItems = [...prev];
        const item = newItems[existingItemIndex];
        newItems[existingItemIndex] = { ...item, quantity: item.quantity + 1 };
        return newItems;
      }

      return [...prev, { rowId: Math.random().toString(36).substr(2, 9), product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (index: number, delta: number) => {
    setCartItems((prev) => {
      if (!prev[index]) return prev;

      const newQuantity = prev[index].quantity + delta;

      if (newQuantity <= 0) {
        return prev.filter((_, i) => i !== index);
      }

      if (newQuantity > 10) return prev;

      const newItems = [...prev];
      newItems[index] = { ...newItems[index], quantity: newQuantity };
      return newItems;
    });
  };

  const handleRemoveFromCart = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };



  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);



  useEffect(() => {
    const targetId = sessionStorage.getItem("scrollTarget");
    if (targetId) {
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
        sessionStorage.removeItem("scrollTarget");
      }, 100);
    }

    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col selection:bg-pink-accent selection:text-foreground">
      <Navbar
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onRemoveFromCart={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
      />

      <div className="relative w-full">
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
              style={{ backgroundColor: heroProducts[currentHero].color }}
            >
              {/* Falling Decorative Elements Layer - Inside sliding div but before text */}
              <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden hidden md:block">
                <AnimatePresence>
                  {heroProducts[currentHero].decor.map((item, idx) => (
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

              {/* Background Text - Slides with background */}
              <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none select-none -translate-y-[8vh]">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
                  className="text-[12vw] font-black text-white leading-none tracking-tighter uppercase whitespace-nowrap will-change-transform transform-gpu"
                  style={{ transform: "translateZ(0)" }}
                >
                  {heroProducts[currentHero].name}
                </motion.h1>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Fixed Product Image Container - Vertical 'Pop' transition */}
          <div className="absolute inset-0 flex justify-center items-center z-20 pointer-events-none -translate-y-[8vh]">
            <AnimatePresence>
              <motion.div
                key={currentHero}
                initial={{ opacity: 0, scale: 0.2, y: 500, rotate: -5 }}
                animate={{ opacity: 1, scale: heroProducts[currentHero].scale || 1, y: 0 }}
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
                  {/* Soft Radial Glow - Lightweight replacement for drop-shadow */}
                  <div 
                    className="absolute inset-0 opacity-40 blur-3xl rounded-full"
                    style={{ 
                      background: `radial-gradient(circle, ${heroProducts[currentHero].shadowColor || "rgba(0,0,0,0.3)"} 0%, transparent 70%)`,
                      transform: "scale(0.8) translateZ(0)"
                    }}
                  />
                  <Image
                    src={heroProducts[currentHero].image}
                    alt={heroProducts[currentHero].name}
                    fill
                    priority
                    className="object-contain object-center"
                    style={{ transform: "translateZ(0)" }}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Product Info Overlay - Decoupled and elevated to z-50 */}
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
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={14} fill="#FFD700" color="#FFD700" />
                      ))}
                    </div>

                    <div className="flex flex-col gap-2">
                      <motion.h2 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tighter uppercase drop-shadow-md"
                      >
                        {heroProducts[currentHero].fullName}
                      </motion.h2>
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-white/80 text-sm md:text-base font-medium max-w-sm leading-relaxed drop-shadow-sm"
                      >
                        {heroProducts[currentHero].description}
                      </motion.p>
                    </div>

                    <div className="flex items-center gap-6 pt-2">
                      <button 
                        onClick={() => {
                          const product = productsData.find(p => p.id === heroProducts[currentHero].productId);
                          if (product) {
                            handleAddToCart(product);
                            setIsCartOpen(true);
                          }
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

          {/* Slider Controls - Sides */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            onClick={prevHero}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full text-white/40 hover:text-white transition-all hover:scale-110 active:scale-95 cursor-pointer group"
            aria-label="Previous Hero"
          >
            <ChevronLeft size={48} strokeWidth={1} className="transition-transform group-hover:-translate-x-1" />
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            onClick={nextHero}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full text-white/40 hover:text-white transition-all hover:scale-110 active:scale-95 cursor-pointer group"
            aria-label="Next Hero"
          >
            <ChevronRight size={48} strokeWidth={1} className="transition-transform group-hover:translate-x-1" />
          </motion.button>

          {/* Progress Indicators - Bottom */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-3"
          >
            {heroProducts.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentHero(i)}
                className={`h-[3px] transition-all duration-500 rounded-full ${i === currentHero ? "w-12 bg-white" : "w-4 bg-white/20 hover:bg-white/40"}`}
              />
            ))}
          </motion.div>
        </section>

        <div className="relative">

          <section id="story" className="scroll-mt-[72px] min-h-screen flex items-center pointer-events-auto relative overflow-hidden">
            {/* Gradient wash — blends the hero into the narrative */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white-calm/95 to-white-calm z-0 pointer-events-none" />

            <div className="relative z-20 max-w-7xl mx-auto w-full px-8 py-32 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 items-center">

              {/* Left — Brand manifesto */}
              <div className="flex flex-col gap-10">
                <FadeIn delay={0.1}>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-pink-accent">Cabanatuan, Nueva Ecija — Philippines</span>
                </FadeIn>

                <FadeIn delay={0.2}>
                  <h2 className="text-4xl md:text-6xl font-light leading-[1.15] text-foreground">
                    One pair<br />
                    of hands.<br />
                    <em className="italic text-pink-accent not-italic" style={{ fontStyle: 'italic' }}>Every piece.</em>
                  </h2>
                </FadeIn>

                <FadeIn delay={0.35}>
                  <p className="text-base font-light leading-relaxed text-foreground/60 max-w-sm">
                    Every Joulery piece begins as an idea and ends as something you can hold. No factories. No assembly lines. Just one artisan, one vision, and an unwavering commitment to the craft.
                  </p>
                </FadeIn>

                <FadeIn delay={0.45}>
                  <button
                    onClick={() => document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" })}
                    className="self-start text-xs uppercase tracking-[0.2em] border-b border-foreground pb-1 hover:text-pink-accent hover:border-pink-accent transition-all"
                  >
                    Explore the Collection →
                  </button>
                </FadeIn>
              </div>

              {/* Right — Three brand pillars as an editorial list */}
              <div className="flex flex-col divide-y divide-pink-accent/20">
                {[
                  {
                    num: "01",
                    title: "Handcrafted",
                    body: "Each bracelet and necklace is woven by a single pair of hands. No two pieces are ever perfectly identical — that's the point."
                  },
                  {
                    num: "02",
                    title: "Purposeful",
                    body: "Only materials that earn their place are used. Sourced from across the Philippine archipelago for their beauty and story."
                  },
                  {
                    num: "03",
                    title: "Timeless",
                    body: "Designed to be worn for years, not seasons. Joulery resists trends in favour of pieces that grow more personal with time."
                  }
                ].map((pillar, i) => (
                  <FadeIn key={pillar.num} delay={0.2 + i * 0.15}>
                    <div className="py-8 flex gap-6 items-start group cursor-default">
                      <span className="text-[10px] text-pink-accent/60 font-light tracking-widest mt-1 shrink-0">{pillar.num}</span>
                      <div>
                        <h3 className="text-sm uppercase tracking-[0.2em] font-medium text-foreground mb-2 group-hover:text-pink-accent transition-colors">{pillar.title}</h3>
                        <p className="text-sm font-light leading-relaxed text-foreground/50">{pillar.body}</p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>

            </div>
          </section>

        </div>
      </div>

      <FadeIn delay={0.1}>
        <ProvenanceMap />
      </FadeIn>

      <section id="shop" className="scroll-mt-[72px] py-24 px-8 bg-background">
        <FadeIn className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-3xl font-light text-foreground">The Collection</h2>
            <button className="text-sm uppercase tracking-wider border-b border-foreground pb-1 hover:text-pink-accent hover:border-pink-accent transition-all">
              Filter / Sort
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
            {productsData.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                delay={0.1 * (index + 1)}
                onClick={() => setSelectedProduct(product)}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </FadeIn>
      </section>

      <section id="contact" className="scroll-mt-[72px] py-32 px-4 bg-white-calm border-t border-pink-accent/30">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-16">
          <FadeIn className="flex-1">
            <h2 className="text-3xl font-light mb-8 text-foreground">Inquiries</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="px-6 py-4 bg-pink-calm/30 border-none outline-none focus:ring-1 focus:ring-pink-accent w-full font-light text-foreground"
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="px-6 py-4 bg-pink-calm/30 border-none outline-none focus:ring-1 focus:ring-pink-accent w-full font-light text-foreground"
                  required
                />
              </div>
              <textarea
                placeholder="How can we help you?"
                rows={5}
                className="px-6 py-4 bg-pink-calm/30 border-none outline-none focus:ring-1 focus:ring-pink-accent w-full font-light text-foreground resize-none"
                required
              />
              <button
                type="submit"
                className="bg-foreground text-white-calm px-10 py-4 uppercase tracking-widest text-sm hover:bg-foreground/90 transition-all w-full md:w-auto"
              >
                Send Message
              </button>
            </form>
          </FadeIn>

          <FadeIn delay={0.2} className="w-full md:w-72 flex flex-col justify-center items-center md:items-start text-center md:text-left border-t md:border-t-0 md:border-l border-pink-accent/20 pt-12 md:pt-0 md:pl-12">
            <h3 className="text-xs uppercase tracking-[0.2em] mb-6 text-pink-accent font-medium">Connect With Us</h3>
            <div className="flex gap-8 mb-8">
              <a href={SITE_CONFIG.links.facebook} className="text-foreground/60 hover:text-pink-accent transition-colors" aria-label="Facebook">
                <FacebookIcon size={22} strokeWidth={1.5} />
              </a>
              <a href={SITE_CONFIG.links.instagram} className="text-foreground/60 hover:text-pink-accent transition-colors" aria-label="Instagram">
                <InstagramIcon size={22} strokeWidth={1.5} />
              </a>
              <a href={SITE_CONFIG.links.whatsapp} target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-pink-accent transition-colors" aria-label="WhatsApp">
                <MessageCircle size={22} strokeWidth={1.5} />
              </a>
              <div className="relative">
                <button
                  onClick={copyEmail}
                  className="text-foreground/60 hover:text-pink-accent transition-colors cursor-pointer"
                  aria-label="Copy Email"
                >
                  <Mail size={22} strokeWidth={1.5} />
                </button>
                <AnimatePresence>
                  {isCopied && (
                    <motion.span
                      initial={{ opacity: 0, y: 10, x: "-50%" }}
                      animate={{ opacity: 1, y: 0, x: "-50%" }}
                      exit={{ opacity: 0, y: 10, x: "-50%" }}
                      className="absolute -top-10 left-1/2 bg-foreground text-white-calm text-[10px] px-3 py-1.5 rounded uppercase tracking-widest font-bold whitespace-nowrap shadow-xl z-50"
                    >
                      Copied!
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <p className="text-sm text-foreground/50 font-light leading-relaxed">
              For custom commissions, artisan collaborations, or private collection previews.
            </p>

            <div className="mt-12 pt-12 border-t border-pink-accent/20 w-full">
              <h3 className="text-xs uppercase tracking-[0.2em] mb-4 text-pink-accent font-medium">Support My Craft</h3>
              <p className="text-sm text-foreground/60 font-light leading-relaxed mb-6">
                If you appreciate the solo artistry and want to support this journey, consider making a small donation. Your support keeps the game alive.
              </p>
              <a
                href="#"
                className="inline-block bg-foreground text-white-calm px-8 py-3 uppercase tracking-widest text-[10px] hover:bg-foreground/90 transition-all shadow-sm"
              >
                Support via Stripe
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
      <ScrollToTop />

      <ProductModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemove={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
      />
    </div>
  );
}
