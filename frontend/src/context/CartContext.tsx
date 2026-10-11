import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartSummary } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: CartSummary;
  loading: boolean;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (productId: number, quantity?: number, size?: string, color?: string) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const defaultCart: CartSummary = {
  items: [],
  subtotal: 0,
  shipping_fee: 0,
  total: 0,
  item_count: 0,
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartSummary>(defaultCart);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const { user } = useAuth();

  const refreshCart = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getCart();
      setCart(data);
    } catch (e) {
      console.error('Failed to load cart', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [user, refreshCart]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = async (productId: number, quantity: number = 1, size?: string, color?: string) => {
    try {
      const updated = await api.addToCart(productId, quantity, size, color);
      setCart(updated);
      setIsCartOpen(true);
    } catch (err: any) {
      alert(err.message || 'Could not add to cart');
      throw err;
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      const updated = await api.updateCartItem(itemId, quantity);
      setCart(updated);
    } catch (err: any) {
      alert(err.message || 'Could not update quantity');
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      const updated = await api.removeCartItem(itemId);
      setCart(updated);
    } catch (err: any) {
      alert(err.message || 'Could not remove item');
    }
  };

  const clearCart = async () => {
    try {
      await api.clearCart();
      setCart(defaultCart);
    } catch (err: any) {
      alert(err.message || 'Could not clear cart');
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
