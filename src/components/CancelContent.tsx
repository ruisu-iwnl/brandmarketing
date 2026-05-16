"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, MessageCircle, HelpCircle } from "lucide-react";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

interface CancelContentProps {
  orderId?: string;
  settings: any;
}

export function CancelContent({ orderId, settings }: CancelContentProps) {
  useEffect(() => {
    if (orderId) {
      fetch(`/api/orders/${orderId}/cancel`, { method: 'POST' })
        .catch(err => console.error('Failed to mark order as cancelled:', err));
    }
  }, [orderId]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.2 }}
        className="w-24 h-24 bg-pink-calm/30 rounded-full flex items-center justify-center mb-10"
      >
        <AlertCircle size={48} className="text-foreground/40" />
      </motion.div>

      <motion.header
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h1 className="text-4xl font-light uppercase tracking-[0.3em] mb-6">Payment Cancelled</h1>
        <p className="text-foreground/60 text-sm uppercase tracking-widest leading-relaxed mb-12">
          Your transaction was not completed. Don't worry, your handcrafted selection is still safe in your cart.
        </p>
      </motion.header>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
      >
        <div className="bg-pink-calm/10 border border-pink-calm/30 rounded-3xl p-8 text-left">
          <HelpCircle size={24} className="text-pink-accent/40 mb-4" />
          <h3 className="text-xs uppercase tracking-widest font-semibold mb-2 text-foreground/80">Need Assistance?</h3>
          <p className="text-xs text-foreground/60 leading-relaxed">
            If you experienced an issue with the payment gateway, please try a different payment method.
          </p>
        </div>

        <div className="bg-pink-calm/10 border border-pink-calm/30 rounded-3xl p-8 text-left">
          <MessageCircle size={24} className="text-pink-accent/40 mb-4" />
          <h3 className="text-xs uppercase tracking-widest font-semibold mb-2 text-foreground/80">Contact Artisan</h3>
          <p className="text-xs text-foreground/60 leading-relaxed">
            Reach out to us via <a href={SITE_CONFIG.links.whatsapp} className="underline text-pink-accent">WhatsApp</a> if you need direct help.
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
          href="/checkout" 
          className="flex-1 bg-foreground text-background py-5 uppercase tracking-[0.2em] text-xs hover:bg-pink-accent transition-all flex items-center justify-center gap-3 group"
        >
          Try Again
          <ArrowLeft size={14} className="group-reverse-hover:-translate-x-1 transition-transform" />
        </Link>
        <Link 
          href="/" 
          className="flex-1 border border-pink-calm/50 py-5 uppercase tracking-[0.2em] text-xs hover:bg-pink-calm/20 transition-all flex items-center justify-center gap-3"
        >
          Return to Boutique
        </Link>
      </motion.div>
    </div>
  );
}
