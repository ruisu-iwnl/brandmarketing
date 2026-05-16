"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ProductModal from "@/components/ProductModal";
import CartDrawer from "@/components/CartDrawer";
import Hero from "@/components/sections/Hero";
import Shop from "@/components/sections/Shop";
import GetToKnowUsTeaser from "@/components/sections/GetToKnowUsTeaser";
import Contact from "@/components/sections/Contact";
import { Product } from "@/types/product";

interface HomeContentProps {
  products: Product[];
  slides: any[];
  settings: {
    analyticsResetAt: string | null;
  };
}

export default function HomeContent({ products, slides, settings }: HomeContentProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentHero, setCurrentHero] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    // Force scroll to top on refresh
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  const nextHero = () => {
    if (slides.length === 0) return;
    setDirection(1);
    setCurrentHero((prev) => (prev + 1) % slides.length);
  };
  
  const prevHero = () => {
    if (slides.length === 0) return;
    setDirection(-1);
    setCurrentHero((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const targetId = sessionStorage.getItem("scrollTarget");
    if (targetId) {
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) element.scrollIntoView({ behavior: "smooth" });
        sessionStorage.removeItem("scrollTarget");
      }, 100);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col selection:bg-pink-accent selection:text-foreground">
      <Navbar />

      <Hero 
        products={products}
        slides={slides}
        currentHero={currentHero}
        direction={direction}
        onNext={nextHero}
        onPrev={prevHero}
        onSetHero={setCurrentHero}
      />

      <Shop 
        products={products}
        onSelectProduct={setSelectedProduct}
      />

      <GetToKnowUsTeaser />
      <Contact />
      <Footer />
      <ScrollToTop />

      <ProductModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
        settings={settings}
      />

      <CartDrawer />
    </div>
  );
}
