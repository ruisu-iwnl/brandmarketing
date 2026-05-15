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
import { Product, CartItem } from "@/components/ProductCard";

interface HomeContentProps {
  products: Product[];
  slides: any[];
}

export default function HomeContent({ products, slides }: HomeContentProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
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

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existingItemIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.quantity < 10
      );

      if (existingItemIndex > -1) {
        const newItems = [...prev];
        newItems[existingItemIndex].quantity += 1;
        return newItems;
      }

      return [...prev, { rowId: Math.random().toString(36).substr(2, 9), product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (index: number, delta: number) => {
    setCartItems((prev) => {
      if (!prev[index]) return prev;
      const newQuantity = prev[index].quantity + delta;
      if (newQuantity <= 0) return prev.filter((_, i) => i !== index);
      if (newQuantity > 10) return prev;
      const newItems = [...prev];
      newItems[index].quantity = newQuantity;
      return newItems;
    });
  };

  const handleRemoveFromCart = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
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
      <Navbar
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onRemoveFromCart={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
      />

      <Hero 
        products={products}
        slides={slides}
        currentHero={currentHero}
        direction={direction}
        onNext={nextHero}
        onPrev={prevHero}
        onSetHero={setCurrentHero}
        onAddToCart={handleAddToCart}
      />

      <Shop 
        products={products}
        onSelectProduct={setSelectedProduct}
        onAddToCart={handleAddToCart}
      />

      <GetToKnowUsTeaser />
      <Contact />
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
