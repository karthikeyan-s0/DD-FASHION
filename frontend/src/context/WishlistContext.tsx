import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { WishlistItem, Product } from '../types';
import { api, getToken } from '../services/api';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: WishlistItem[];
  loading: boolean;
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (product: Product) => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();

  // Load guest wishlist from localStorage
  const loadGuestWishlist = (): WishlistItem[] => {
    try {
      const stored = localStorage.getItem('ddfashion_guest_wishlist');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore JSON parse error
    }
    return [];
  };

  const saveGuestWishlist = (items: WishlistItem[]) => {
    try {
      localStorage.setItem('ddfashion_guest_wishlist', JSON.stringify(items));
    } catch {
      // ignore
    }
  };

  const refreshWishlist = useCallback(async () => {
    if (!getToken() || !user) {
      setWishlist(loadGuestWishlist());
      return;
    }
    try {
      setLoading(true);
      const items = await api.getWishlist();
      
      // If there were guest wishlist items in localStorage, merge them into the server account
      const guestItems = loadGuestWishlist();
      if (guestItems.length > 0) {
        const existingIds = new Set(items.map(i => i.product_id));
        for (const gi of guestItems) {
          if (!existingIds.has(gi.product_id)) {
            try {
              const added = await api.addToWishlist(gi.product_id);
              items.unshift(added);
            } catch {
              // ignore duplicate
            }
          }
        }
        localStorage.removeItem('ddfashion_guest_wishlist');
      }

      setWishlist(items);
    } catch {
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshWishlist();
  }, [user, refreshWishlist]);

  const isInWishlist = (productId: number): boolean => {
    return wishlist.some((item) => item.product_id === productId);
  };

  const toggleWishlist = async (product: Product) => {
    const exists = isInWishlist(product.id);

    if (!user) {
      // Anonymous session persistence
      if (exists) {
        const next = wishlist.filter((item) => item.product_id !== product.id);
        setWishlist(next);
        saveGuestWishlist(next);
      } else {
        const guestItem: WishlistItem = {
          id: Date.now(),
          product_id: product.id,
          product,
          created_at: new Date().toISOString(),
        };
        const next = [guestItem, ...wishlist];
        setWishlist(next);
        saveGuestWishlist(next);
      }
      return;
    }

    // Authenticated user API persistence
    if (exists) {
      await api.removeFromWishlist(product.id);
      setWishlist((prev) => prev.filter((item) => item.product_id !== product.id));
    } else {
      const newItem = await api.addToWishlist(product.id);
      setWishlist((prev) => [newItem, ...prev]);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        isInWishlist,
        toggleWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
