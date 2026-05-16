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

  const lastActionTime = React.useRef(0);

  const addToCart = (product: Product) => {
    const now = Date.now();
    if (now - lastActionTime.current < 100) return; // Prevent double/triple fires
    lastActionTime.current = now;

    setCartItems((prev) => {
      // Find an existing row for this product that isn't full (less than 10)
      const existingItemIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.quantity < 10
      );

      if (existingItemIndex > -1) {
        const newItems = [...prev];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + 1
        };
        return newItems;
      }

      // If no room in existing rows (or no row exists), create a new one
      return [...prev, { 
        rowId: `${product.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`, 
        product, 
        quantity: 1 
      }];
    });
  };

  const removeFromCart = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, delta: number) => {
    setCartItems((prev) => {
      if (!prev[index]) return prev;
      const newQuantity = prev[index].quantity + delta;
      if (newQuantity <= 0) return prev.filter((_, i) => i !== index);
      if (newQuantity > 10) return prev;
      
      const newItems = [...prev];
      newItems[index] = {
        ...newItems[index],
        quantity: newQuantity
      };
      return newItems;
    });
  };

  const toggleCart = (open?: boolean) => {
    setIsCartOpen((prev) => (open !== undefined ? open : !prev));
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      isCartOpen, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      toggleCart 
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
