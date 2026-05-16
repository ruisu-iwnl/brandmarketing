"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Product, CartItem } from "@/types/product";
import Image from "next/image";
import { SITE_CONFIG } from "@/lib/constants";

import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { cartItems, toggleCart, removeFromCart, updateQuantity } = useCart();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isCartHovered, setIsCartHovered] = useState(false);
  
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const toggleMenu = () => setIsOpen(!isOpen);
  
  const closeMenu = () => setIsOpen(false);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) => {
    if (pathname === "/") {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      sessionStorage.setItem("scrollTarget", id);
    }
    closeMenu();
  };

  const handleTitleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      closeMenu();
    }
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
        className="w-full py-6 px-8 flex justify-between items-center fixed top-0 bg-transparent backdrop-blur-[2px] z-[60]"
      >
        <Link href="/" onClick={handleTitleClick} className="text-xl font-medium tracking-widest uppercase text-foreground hover:opacity-70 transition-opacity cursor-pointer">
          {SITE_CONFIG.name}
        </Link>
        
        <div className="hidden md:flex gap-8 text-sm uppercase tracking-wide">
          <Link href="/" onClick={handleTitleClick} className="hover:text-pink-accent transition-colors">Featured</Link>
          <Link href="/" onClick={(e) => handleScroll(e, "shop")} className="hover:text-pink-accent transition-colors">Shop</Link>
          <Link href="/" onClick={(e) => handleScroll(e, "gettoknowus")} className="hover:text-pink-accent transition-colors">Story</Link>
          <Link href="/" onClick={(e) => handleScroll(e, "contact")} className="hover:text-pink-accent transition-colors">Contact</Link>
        </div>
        
        <div className="flex items-center gap-6">
          <div 
            className="relative"
            onMouseEnter={() => setIsCartHovered(true)}
            onMouseLeave={() => setIsCartHovered(false)}
          >
            <button 
              onClick={() => toggleCart(true)}
              className="relative text-foreground hover:text-pink-accent transition-colors p-2 cursor-pointer" 
              aria-label="Cart"
            >
              <ShoppingCart size={22} className="stroke-[1.5]" />
              <AnimatePresence mode="popLayout">
                {cartCount > 0 && (
                  <motion.span 
                    key={cartCount}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="absolute top-0 right-0 bg-pink-accent text-foreground text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Hover Preview — Desktop Only */}
            <AnimatePresence>
              {isCartHovered && cartCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="hidden md:block absolute right-0 top-full mt-2 w-80 bg-white-calm shadow-xl border border-pink-calm p-6 z-[70] rounded-xl"
                >
                  <div className="space-y-4 max-h-[300px] overflow-y-auto modal-scroll pr-2">
                    <AnimatePresence initial={false}>
                      {cartItems.map((item, index) => (
                        <motion.div 
                          key={item.rowId}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2 }}
                          className="flex gap-4 items-center group"
                        >
                          <div className="relative w-12 h-12 bg-pink-calm/20 rounded overflow-hidden shrink-0">
                            <Image src={item.product.imageStill} alt={item.product.name} fill className="object-contain p-1" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground uppercase tracking-wider truncate">{item.product.name}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <div className="flex items-center border border-pink-calm rounded-md overflow-hidden bg-white-calm">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); updateQuantity(index, -1); }}
                                  className="p-1 hover:bg-pink-calm transition-colors text-foreground/60 cursor-pointer"
                                >
                                  <Minus size={10} />
                                </button>
                                <span className="w-6 text-center text-[10px] font-medium text-foreground">{item.quantity}</span>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); updateQuantity(index, 1); }}
                                  disabled={item.quantity >= 10}
                                  className="p-1 hover:bg-pink-calm transition-colors text-foreground/60 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
                                >
                                  <Plus size={10} />
                                </button>
                              </div>
                              <p className="text-[10px] text-foreground/50">₱{Number(item.product.price) * item.quantity}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => removeFromCart(index)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-foreground/30 hover:text-red-400 transition-all cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  <div className="mt-6 pt-4 border-t border-pink-calm flex flex-col gap-3">
                    <div className="flex justify-between text-xs uppercase tracking-widest text-foreground/60">
                      <span>Total</span>
                      <span>₱{cartItems.reduce((acc, item) => acc + (Number(item.product.price) * item.quantity), 0)}</span>
                    </div>
                    <button 
                      onClick={() => toggleCart(true)}
                      className="w-full bg-pink-accent text-foreground py-3 text-[10px] uppercase tracking-widest hover:shadow-lg hover:shadow-pink-accent/20 transition-all cursor-pointer font-bold"
                    >
                      View Cart
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMenu} 
              className="text-foreground hover:text-pink-accent transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={24} className="stroke-[1.5]" /> : <Menu size={24} className="stroke-[1.5]" />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-[72px] z-[150] bg-white-calm/90 backdrop-blur-md flex flex-col items-center justify-center gap-12 md:hidden"
          >
            <Link href="/" onClick={handleTitleClick} className="text-2xl font-light uppercase tracking-widest text-foreground hover:text-pink-accent transition-colors">Featured</Link>
            <Link href="/" onClick={(e) => handleScroll(e, "shop")} className="text-2xl font-light uppercase tracking-widest text-foreground hover:text-pink-accent transition-colors">Shop</Link>
            <Link href="/" onClick={(e) => handleScroll(e, "gettoknowus")} className="text-2xl font-light uppercase tracking-widest text-foreground hover:text-pink-accent transition-colors">Story</Link>
            <Link href="/" onClick={(e) => handleScroll(e, "contact")} className="text-2xl font-light uppercase tracking-widest text-foreground hover:text-pink-accent transition-colors">Contact</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
