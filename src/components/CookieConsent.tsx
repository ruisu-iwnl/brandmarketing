"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck } from "lucide-react";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
    // Here you could also trigger GA consent signals
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 right-6 md:right-8 bg-white/90 backdrop-blur-md shadow-lg rounded-xl z-[200] border border-pink-accent/10 overflow-hidden"
        >
          <div className="px-5 py-4 flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-foreground mb-1">Cookies</span>
              <p className="text-[10px] text-foreground/50 font-light whitespace-nowrap">
                We use cookies for a better experience.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleAccept}
                className="bg-pink-accent text-foreground px-4 py-2 text-[9px] font-bold uppercase tracking-widest rounded-lg hover:shadow-md transition-all cursor-pointer"
              >
                Okay
              </button>
              <button
                onClick={handleDecline}
                className="text-[9px] text-foreground/30 uppercase tracking-widest font-bold hover:text-foreground transition-colors p-2"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
