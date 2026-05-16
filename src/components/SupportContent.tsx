"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CreditCard, ShieldCheck } from "lucide-react";
import FadeIn from "./FadeIn";

const SUPPORT_TIERS = [
  {
    id: "coffee",
    amount: 100,
    label: "Artisan Coffee",
    description: "Fuel a session of intricate weaving and design.",
  },
  {
    id: "materials",
    amount: 500,
    label: "Material Gift",
    description: "Help source the finest crystals and silk cords.",
  },
  {
    id: "studio",
    amount: 1000,
    label: "Studio Support",
    description: "Sustain the handcrafted tradition and studio space.",
  },
];

export function SupportContent({ settings }: { settings: any }) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(100);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const finalAmount = customAmount ? parseInt(customAmount) : (selectedAmount || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (finalAmount < 100) {
      setError("Minimum support amount is ₱100");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalAmount,
          customerName: formData.name,
          email: formData.email,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to connect to gateway');

      window.location.href = data.checkoutUrl;
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-40 pb-24 px-8 relative overflow-hidden">
      {/* Background Aesthetics */}
      <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-pink-accent/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          
          {/* Left: Content */}
          <div>
            <FadeIn>
              <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-pink-accent font-bold mb-6">
                Support the Craft
              </span>
              <h1 className="text-5xl md:text-7xl font-light text-foreground mb-8 leading-[1.1] tracking-tight">
                Gift the <span className="italic font-serif">Artisan</span>
              </h1>
              <p className="text-foreground/60 text-lg font-light leading-relaxed mb-12 max-w-lg">
                Li'L Caca is more than a boutique—it is a dedication to the slow, handcrafted tradition. Your support helps us source ethical materials and maintain the artistry behind every piece.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-foreground/40 font-medium">
                  <span className="w-12 h-px bg-pink-accent/30" />
                  Select your Gift Tier
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {SUPPORT_TIERS.map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => {
                        setSelectedAmount(tier.amount);
                        setCustomAmount("");
                      }}
                      className={`group p-6 text-left rounded-3xl transition-all duration-500 border ${
                        selectedAmount === tier.amount && !customAmount
                          ? "bg-foreground text-background border-foreground shadow-xl shadow-foreground/10"
                          : "bg-white border-pink-calm/30 text-foreground hover:border-pink-accent/50"
                      }`}
                    >
                      <div className={`mb-4 transition-colors ${selectedAmount === tier.amount && !customAmount ? "text-pink-accent" : "text-pink-accent/40"}`}>
                        {/* Tier identifier */}
                      </div>
                      <h3 className="text-lg font-medium mb-1 tracking-tight">₱{tier.amount}</h3>
                      <p className={`text-[10px] uppercase tracking-widest leading-relaxed opacity-60`}>
                        {tier.label}
                      </p>
                    </button>
                  ))}
                </div>
                
                <div className="relative mt-8 group">
                  <input 
                    type="number"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(null);
                    }}
                    placeholder="Enter Custom Amount (₱)"
                    className="w-full bg-white border border-pink-calm/30 rounded-3xl px-8 py-6 text-sm focus:ring-1 focus:ring-pink-accent/30 outline-none transition-all placeholder:text-foreground/20"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-pink-accent/40 group-focus-within:text-pink-accent transition-colors text-[10px] uppercase tracking-widest font-bold">
                    Gift
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right: Form */}
          <FadeIn delay={0.3}>
            <div className="bg-white p-10 md:p-16 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.03)] border border-pink-calm/20">
              <h2 className="text-xs uppercase tracking-[0.3em] font-semibold text-foreground/40 mb-10 pb-6 border-b border-pink-calm/30 flex items-center justify-between">
                Patron Details
                {finalAmount > 0 && (
                  <span className="text-pink-accent animate-pulse">₱{finalAmount}</span>
                )}
              </h2>

              {error && (
                <div className="mb-8 p-6 bg-red-50 border border-red-100 text-red-500 text-[10px] uppercase tracking-widest rounded-2xl">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-foreground/40 ml-1 font-bold">Your Name</label>
                  <input 
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Optional / Anonymous"
                    className="w-full bg-pink-calm/10 border-none px-6 py-5 rounded-2xl text-sm focus:ring-1 focus:ring-pink-accent/30 outline-none transition-all placeholder:text-foreground/20"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-foreground/40 ml-1 font-bold">Email Address</label>
                  <input 
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="For your receipt"
                    className="w-full bg-pink-calm/10 border-none px-6 py-5 rounded-2xl text-sm focus:ring-1 focus:ring-pink-accent/30 outline-none transition-all placeholder:text-foreground/20"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting || finalAmount < 100}
                  className="w-full bg-foreground text-background py-6 rounded-2xl uppercase tracking-[0.3em] text-xs hover:bg-pink-accent transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group shadow-xl shadow-foreground/10"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Preparing Gift...
                    </span>
                  ) : (
                    <>
                      Gift with PayMongo
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <div className="flex flex-col gap-4 pt-6 border-t border-pink-calm/30">
                  <div className="flex items-center justify-center gap-6 text-[9px] uppercase tracking-widest text-foreground/30 font-medium">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={12} className="text-pink-accent/50" />
                      Secure Gift
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard size={12} className="text-pink-accent/50" />
                      Global Cards & GCash
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </FadeIn>

        </div>
      </div>
    </div>
  );
}
