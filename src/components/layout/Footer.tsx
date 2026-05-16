"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SITE_CONFIG } from "@/lib/constants";

const FacebookIcon = ({ size = 16, strokeWidth = 1.5 }: { size?: number; strokeWidth?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
);

const InstagramIcon = ({ size = 16, strokeWidth = 1.5 }: { size?: number; strokeWidth?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
);

export default function Footer() {
  const [isCopied, setIsCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(SITE_CONFIG.links.email);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <footer className="py-8 px-8 bg-white-calm border-t border-pink-calm flex flex-col md:flex-row justify-between items-center text-xs uppercase tracking-widest text-foreground/50">
      <div>&copy; 2026 {SITE_CONFIG.name}. All rights reserved.</div>
      <div className="flex gap-6 mt-4 md:mt-0 items-center">
        <a href={SITE_CONFIG.links.facebook} className="hover:text-foreground transition-colors" aria-label="Facebook">
          <FacebookIcon size={16} strokeWidth={1.5} />
        </a>
        <a href={SITE_CONFIG.links.instagram} className="hover:text-foreground transition-colors" aria-label="Instagram">
          <InstagramIcon size={16} strokeWidth={1.5} />
        </a>
        <a href={SITE_CONFIG.links.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors" aria-label="WhatsApp">
          <MessageCircle size={16} strokeWidth={1.5} />
        </a>
        <div className="relative flex items-center">
          <button 
            onClick={copyEmail}
            className="hover:text-foreground transition-colors cursor-pointer" 
            aria-label="Copy Email"
          >
            <Mail size={16} strokeWidth={1.5} />
          </button>
          <AnimatePresence>
            {isCopied && (
              <motion.span
                initial={{ opacity: 0, y: 10, x: "-50%" }}
                animate={{ opacity: 1, y: 0, x: "-50%" }}
                exit={{ opacity: 0, y: 10, x: "-50%" }}
                className="absolute -top-10 left-1/2 bg-foreground text-white-calm text-[8px] px-2 py-1 rounded uppercase tracking-widest font-bold whitespace-nowrap shadow-xl z-50"
              >
                Copied!
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <Link href="/terms" className="hover:text-foreground transition-colors ml-4">Terms</Link>
        <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
      </div>
    </footer>
  );
}
