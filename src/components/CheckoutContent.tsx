"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ShoppingBag, CreditCard, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CheckoutContentProps {
  settings: any;
}

export function CheckoutContent({ settings }: CheckoutContentProps) {
  const { cartItems, toggleCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    zip: "",
  });

  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.product.price) * item.quantity), 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          customerDetails: formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      // Redirect to PayMongo
      window.location.href = data.checkoutUrl;
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0 && !isSubmitting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <ShoppingBag size={48} className="mb-6 text-pink-accent/40" />
        <h1 className="text-2xl font-medium uppercase tracking-widest mb-4">Your cart is empty</h1>
        <p className="text-foreground/60 mb-8 max-w-md">Add some of our handcrafted pieces to your cart before checking out.</p>
        <Link 
          href="/" 
          className="bg-foreground text-background px-8 py-4 uppercase tracking-widest text-sm hover:bg-pink-accent transition-colors"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto min-h-screen flex flex-col md:flex-row">
      {/* Form Section */}
      <div className="flex-1 p-8 md:p-16 lg:p-24 border-r border-pink-calm/30 bg-white-calm">
        <div className="max-w-xl ml-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-foreground/40 hover:text-foreground transition-colors mb-12">
            <ChevronLeft size={14} />
            Back to Shop
          </Link>

          <header className="mb-12">
            <h1 className="text-3xl font-light uppercase tracking-[0.2em] mb-2">Checkout</h1>
            <p className="text-foreground/40 text-sm uppercase tracking-widest">Shipping & Information</p>
          </header>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-10 overflow-hidden"
            >
              <div className="p-6 bg-pink-calm/30 border border-pink-accent/20 text-foreground/80 text-[11px] uppercase tracking-widest rounded-2xl flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0"></span>
                {error}
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <section>
              <h2 className="text-xs uppercase tracking-[0.3em] font-semibold text-foreground/30 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-accent"></span>
                Contact Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-foreground/40 ml-1">Full Name</label>
                  <input 
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="w-full bg-pink-calm/20 border-none px-5 py-4 text-sm focus:ring-1 focus:ring-pink-accent/30 outline-none transition-all placeholder:text-foreground/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-foreground/40 ml-1">Email Address</label>
                  <input 
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                    className="w-full bg-pink-calm/20 border-none px-5 py-4 text-sm focus:ring-1 focus:ring-pink-accent/30 outline-none transition-all placeholder:text-foreground/20"
                  />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-foreground/40 ml-1">Phone Number</label>
                  <input 
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+63 9xx xxx xxxx"
                    className="w-full bg-pink-calm/20 border-none px-5 py-4 text-sm focus:ring-1 focus:ring-pink-accent/30 outline-none transition-all placeholder:text-foreground/20"
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xs uppercase tracking-[0.3em] font-semibold text-foreground/30 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-accent"></span>
                Shipping Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-foreground/40 ml-1">Street Address</label>
                  <input 
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="House number, street, barangay"
                    className="w-full bg-pink-calm/20 border-none px-5 py-4 text-sm focus:ring-1 focus:ring-pink-accent/30 outline-none transition-all placeholder:text-foreground/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-foreground/40 ml-1">City</label>
                  <input 
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Metro Manila"
                    className="w-full bg-pink-calm/20 border-none px-5 py-4 text-sm focus:ring-1 focus:ring-pink-accent/30 outline-none transition-all placeholder:text-foreground/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-foreground/40 ml-1">Province / Region</label>
                  <input 
                    required
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    placeholder="NCR"
                    className="w-full bg-pink-calm/20 border-none px-5 py-4 text-sm focus:ring-1 focus:ring-pink-accent/30 outline-none transition-all placeholder:text-foreground/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-foreground/40 ml-1">Postal Code</label>
                  <input 
                    required
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    placeholder="1000"
                    className="w-full bg-pink-calm/20 border-none px-5 py-4 text-sm focus:ring-1 focus:ring-pink-accent/30 outline-none transition-all placeholder:text-foreground/20"
                  />
                </div>
              </div>
            </section>

            <div className="pt-8">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-foreground text-background py-6 uppercase tracking-[0.3em] text-sm hover:bg-pink-accent transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Processing...
                  </span>
                ) : (
                  <>
                    Continue to Payment
                    <CreditCard size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              <div className="mt-6 flex items-center justify-center gap-8 text-[10px] uppercase tracking-widest text-foreground/30">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-pink-accent/50" />
                  Secure Payment
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={14} className="text-pink-accent/50" />
                  Insured Shipping
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Summary Section */}
      <div className="w-full md:w-[400px] lg:w-[500px] bg-pink-calm/10 p-8 md:p-16 lg:p-20 relative">
        <div className="sticky top-12">
          <h2 className="text-xs uppercase tracking-[0.3em] font-semibold text-foreground/40 mb-10 pb-6 border-b border-pink-calm/30 flex items-center justify-between">
            Your Selection
            <span className="text-[10px] font-normal text-foreground/30">({cartItems.length} items)</span>
          </h2>

          <div className="space-y-8 max-h-[50vh] overflow-y-auto mb-10 pr-4 modal-scroll">
            {cartItems.map((item) => (
              <div key={item.rowId} className="flex gap-6 items-center">
                <div className="relative w-20 h-20 bg-white-calm overflow-hidden rounded-lg border border-pink-calm/20 shrink-0">
                  <Image 
                    src={item.product.imageStill} 
                    alt={item.product.name} 
                    fill 
                    className="object-contain p-2"
                  />
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-foreground text-background text-[10px] flex items-center justify-center rounded-full border-2 border-white-calm">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xs uppercase tracking-widest font-medium mb-1">{item.product.name}</h3>
                  <p className="text-[10px] text-foreground/40 uppercase tracking-widest">{item.product.category}</p>
                </div>
                <p className="text-sm font-medium">₱{Number(item.product.price) * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-10 border-t border-pink-calm/30">
            <div className="flex justify-between items-center text-xs uppercase tracking-widest text-foreground/40">
              <span>Subtotal</span>
              <span>₱{subtotal}</span>
            </div>
            <div className="flex justify-between items-center text-xs uppercase tracking-widest text-foreground/40">
              <span>Shipping</span>
              <span className="text-pink-accent font-medium">Complimentary</span>
            </div>
            <div className="flex justify-between items-center pt-6 text-foreground">
              <span className="text-sm uppercase tracking-[0.3em] font-bold">Total</span>
              <span className="text-2xl font-light">₱{subtotal}</span>
            </div>
          </div>

          <div className="mt-12 p-6 bg-white-calm/50 border border-pink-calm/30 rounded-xl">
             <p className="text-[10px] uppercase tracking-widest text-foreground/40 leading-relaxed italic text-center">
               "Each piece is handcrafted specifically for you. Shipping within Metro Manila takes 2-3 business days."
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
