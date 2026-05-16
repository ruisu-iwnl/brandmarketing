"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '@/types/product';

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, delta: number) => void;
  toggleCart: (open?: boolean) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Persistence: Save cart to localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to load cart");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Synchronize cart with latest stock from server when drawer opens
  useEffect(() => {
    if (isCartOpen && cartItems.length > 0) {
      const syncCart = async () => {
        try {
          // Fetch latest product data for all items currently in cart
          const ids = cartItems.map(item => item.product.id).join(',');
          const res = await fetch(`/api/products?where[id][in]=${ids}&limit=100`);
          const data = await res.json();
          
          if (data && data.docs) {
            setCartItems(prev => prev.map(item => {
              const latestProduct = data.docs.find((p: any) => p.id === item.product.id);
              if (latestProduct) {
                // Update the product info while preserving quantity and rowId
                return { ...item, product: latestProduct };
              }
              return item;
            }));
          }
        } catch (error) {
          console.error("Cart Sync Error:", error);
        }
      };
      
      syncCart();
    }
  }, [isCartOpen]); // Only trigger when opening/closing

  const lastActionTime = React.useRef(0);

  const addToCart = React.useCallback((product: Product) => {
    const now = Date.now();
    if (now - lastActionTime.current < 100) return;
    lastActionTime.current = now;

    setCartItems((prev) => {
      const existingItemIndex = prev.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingItemIndex > -1) {
        const existingItem = prev[existingItemIndex];
        const stockLimit = product.stock || 0;
        
        // Don't exceed stock or the hard limit of 10
        if (existingItem.quantity >= Math.min(stockLimit, 10)) {
          return prev;
        }

        const newItems = [...prev];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + 1
        };
        return newItems;
      }

      // If no row exists, create a new one (if stock > 0)
      if ((product.stock || 0) <= 0) return prev;

      return [...prev, { 
        rowId: `${product.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`, 
        product, 
        quantity: 1 
      }];
    });
  }, []);

  const removeFromCart = React.useCallback((index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateQuantity = React.useCallback((index: number, delta: number) => {
    setCartItems((prev) => {
      if (!prev[index]) return prev;
      const product = prev[index].product;
      const newQuantity = prev[index].quantity + delta;
      const stockLimit = product.stock || 0;

      if (newQuantity <= 0) return prev.filter((_, i) => i !== index);
      if (newQuantity > Math.min(stockLimit, 10)) return prev;
      
      const newItems = [...prev];
      newItems[index] = {
        ...newItems[index],
        quantity: newQuantity
      };
      return newItems;
    });
  }, []);

  const toggleCart = React.useCallback((open?: boolean) => {
    setIsCartOpen((prev) => (open !== undefined ? open : !prev));
  }, []);

  const clearCart = React.useCallback(() => {
    setCartItems([]);
    localStorage.removeItem('cart');
  }, []);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      isCartOpen, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      toggleCart,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
