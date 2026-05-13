"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

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
      <nav className="w-full py-6 px-8 flex justify-between items-center fixed top-0 bg-white-calm/80 backdrop-blur-md z-[60]">
        <Link href="/" onClick={handleTitleClick} className="text-xl font-medium tracking-widest uppercase text-foreground hover:opacity-70 transition-opacity cursor-pointer">
          MUTYA
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 text-sm uppercase tracking-wide">
          <Link href="/" onClick={(e) => handleScroll(e, "shop")} className="hover:text-pink-accent transition-colors">Shop</Link>
          <Link href="/" onClick={(e) => handleScroll(e, "story")} className="hover:text-pink-accent transition-colors">Story</Link>
          <Link href="/" onClick={(e) => handleScroll(e, "contact")} className="hover:text-pink-accent transition-colors">Contact</Link>
        </div>
        
        {/* Desktop Placeholder for balance */}
        <div className="hidden md:block w-12"></div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={toggleMenu} 
            className="text-foreground hover:text-pink-accent transition-colors"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} className="stroke-[1.5]" /> : <Menu size={24} className="stroke-[1.5]" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-[72px] z-50 bg-white-calm flex flex-col items-center justify-center gap-12 md:hidden"
          >
            <Link href="/" onClick={(e) => handleScroll(e, "shop")} className="text-2xl font-light uppercase tracking-widest text-foreground hover:text-pink-accent transition-colors">Shop</Link>
            <Link href="/" onClick={(e) => handleScroll(e, "story")} className="text-2xl font-light uppercase tracking-widest text-foreground hover:text-pink-accent transition-colors">Story</Link>
            <Link href="/" onClick={(e) => handleScroll(e, "contact")} className="text-2xl font-light uppercase tracking-widest text-foreground hover:text-pink-accent transition-colors">Contact</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
