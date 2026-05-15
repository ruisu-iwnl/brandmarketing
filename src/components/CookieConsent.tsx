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
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:w-[400px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl z-[200] border border-pink-calm/30 overflow-hidden"
        >
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-pink-accent/20 flex items-center justify-center text-pink-accent">
                <ShieldCheck size={18} />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Cookie Policy</h3>
            </div>
            
            <p className="text-xs text-foreground/60 leading-relaxed mb-8 font-light">
              We use small data files to understand how you interact with our collection and to provide a more personalized artisanal experience. By continuing, you agree to our use of these.
            </p>

            <div className="flex items-center gap-4">
              <button
                onClick={handleAccept}
                className="flex-1 bg-pink-accent text-foreground py-3 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:shadow-lg hover:shadow-pink-accent/20 transition-all cursor-pointer"
              >
                Accept All
              </button>
              <button
                onClick={handleDecline}
                className="text-[10px] text-foreground/40 uppercase tracking-widest font-bold hover:text-foreground transition-colors px-4 py-3"
              >
                Decline
              </button>
            </div>
          </div>
          
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 text-foreground/20 hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
