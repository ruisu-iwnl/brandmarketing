"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";
import { CartItem } from "./ProductCard";

import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { cartItems: items, isCartOpen: isOpen, toggleCart, removeFromCart: onRemove, updateQuantity: onUpdateQuantity } = useCart();
  const onClose = () => toggleCart(false);
  const subtotal = items.reduce((acc, item) => acc + (Number(item.product.price) * item.quantity), 0);
  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full md:w-[450px] bg-white-calm shadow-2xl z-[101] flex flex-col"
          >
            <div className="p-8 flex justify-between items-center border-b border-pink-calm">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-foreground" />
                <h2 className="text-lg font-medium uppercase tracking-widest text-foreground">Your Cart</h2>
                <span className="text-xs text-foreground/40">({totalCount} items)</span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-pink-calm rounded-full transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 modal-scroll relative">
              <AnimatePresence initial={false}>
                {items.length > 0 && (
                  <motion.div 
                    key="cart-items-list"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-8"
                  >
                    <AnimatePresence initial={false} mode="popLayout">
                      {items.map((item, index) => (
                        <motion.div 
                          key={item.rowId}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2 }}
                          className="flex gap-6 group"
                        >
                          <div className="relative w-24 h-24 bg-pink-calm/20 overflow-hidden rounded-lg shrink-0">
                            <Image
                              src={item.product.imageStill}
                              alt={item.product.name}
                              fill
                              className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div className="flex-1 flex flex-col justify-center">
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">{item.product.name}</h3>
                              <button 
                                onClick={() => onRemove(index)}
                                className="text-foreground/30 hover:text-red-400 transition-colors cursor-pointer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <p className="text-xs text-foreground/50 mb-3 font-light line-clamp-1">{item.product.description}</p>
                            
                            <div className="flex justify-between items-end">
                              <div className="flex items-center border border-pink-calm rounded-lg overflow-hidden">
                                <button 
                                  onClick={() => onUpdateQuantity(index, -1)}
                                  className="p-1.5 hover:bg-pink-calm transition-colors text-foreground/60 cursor-pointer"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="w-8 text-center text-xs font-medium text-foreground">{item.quantity}</span>
                                <button 
                                  onClick={() => onUpdateQuantity(index, 1)}
                                  disabled={item.quantity >= 10}
                                  className="p-1.5 hover:bg-pink-calm transition-colors text-foreground/60 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                              <p className="text-sm font-medium text-foreground/80">₱{Number(item.product.price) * item.quantity}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {items.length === 0 && (
                  <motion.div 
                    key="empty-cart-msg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-center opacity-40 px-8"
                  >
                    <ShoppingBag size={48} className="mb-4 stroke-[1]" />
                    <p className="text-sm uppercase tracking-widest font-light">Your cart is empty</p>
                    <button 
                      onClick={onClose}
                      className="mt-6 text-xs underline underline-offset-4 hover:text-pink-accent transition-colors cursor-pointer"
                    >
                      Continue Shopping
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {items.length > 0 && (
              <div className="p-8 border-t border-pink-calm bg-pink-calm/10">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-sm uppercase tracking-widest text-foreground/60">Subtotal</span>
                  <span className="text-xl font-medium text-foreground">₱{subtotal}</span>
                </div>
                 <button className="w-full bg-pink-accent text-foreground py-5 uppercase tracking-widest text-sm hover:shadow-lg hover:shadow-pink-accent/20 transition-all cursor-pointer font-bold">
                  Checkout
                </button>
                <p className="text-[10px] text-center text-foreground/40 mt-4 uppercase tracking-[0.2em]">
                  Free shipping on all orders
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
