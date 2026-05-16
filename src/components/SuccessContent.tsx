"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { Heart, Sparkles, Mail, ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";

interface SuccessContentProps {
  orderId?: string;
  settings: any;
  isDonation?: boolean;
}

export function SuccessContent({ orderId, settings, isDonation = false }: SuccessContentProps) {
  const { cartItems, clearCart } = useCart();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Clear cart immediately on mount to ensure no race conditions
    clearCart();
    setIsLoaded(true);
  }, [clearCart]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto">
      <div className="w-24 h-24 bg-pink-accent/10 rounded-full flex items-center justify-center mb-10">
        <Sparkles size={48} className="text-pink-accent" />
      </div>

      <motion.header
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h1 className="text-4xl font-light uppercase tracking-[0.3em] mb-6">
          {isDonation ? "Support Received" : "Payment Received"}
        </h1>
        <p className="text-foreground/60 text-sm uppercase tracking-widest leading-relaxed mb-12">
          {isDonation 
            ? "Thank you for your gift! It helps me keep making art."
            : "Thanks for your order! I am packing it for you now."
          }
        </p>
      </motion.header>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="w-full bg-pink-calm/10 border border-pink-calm/30 rounded-3xl p-8 md:p-12 mb-12 text-left"
      >
        <div className="space-y-8">
          <div className="flex items-start gap-5">
            <div className="w-10 h-10 rounded-full bg-white-calm flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles size={18} className="text-pink-accent/60" />
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-widest font-semibold mb-1 text-foreground/80">
                {isDonation ? "Gift Identifier" : "Order Number"}
              </h3>
              <p className="text-sm font-mono text-pink-accent">{orderId || "Pending Sync"}</p>
            </div>
          </div>

          <div className="flex items-start gap-5">
            <div className="w-10 h-10 rounded-full bg-white-calm flex items-center justify-center shrink-0 shadow-sm">
              <Mail size={18} className="text-pink-accent/60" />
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-widest font-semibold mb-1 text-foreground/80">Confirmation</h3>
              <p className="text-sm text-foreground/60">
                {isDonation 
                  ? "A formal receipt of your support has been sent to your inbox."
                  : "We've sent a detailed receipt and tracking info to your inbox."
                }
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-pink-calm/30">
          <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/30 leading-relaxed italic">
            {isDonation 
              ? "Thanks again for your help! It really means a lot to me."
              : "Every item is special. I will send your tracking number soon!"
            }
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="flex flex-col sm:flex-row gap-4 w-full"
      >
        <Link 
          href="/" 
          className="flex-1 bg-foreground text-background py-5 uppercase tracking-[0.2em] text-xs hover:bg-pink-accent transition-all flex items-center justify-center gap-3 group"
        >
          Return to Boutique
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
        <button 
          onClick={() => window.print()}
          className="flex-1 border border-pink-calm/50 py-5 uppercase tracking-[0.2em] text-xs hover:bg-pink-calm/20 transition-all flex items-center justify-center gap-3"
        >
          Print Receipt
          <ExternalLink size={14} />
        </button>
      </motion.div>
    </div>
  );
}
