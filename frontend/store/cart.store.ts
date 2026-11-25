import { create } from 'zustand';
import type { CartItem } from '@/types';
import api from '@/lib/axios';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  subtotal: number;
  isLoading: boolean;
}

interface CartActions {
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity?: number, size?: string, color?: string) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleCart: () => void;
}

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()((set, get) => ({
  items: [],
  isOpen: false,
  itemCount: 0,
  subtotal: 0,
  isLoading: false,

  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/cart');
      set({
        items: data.items || [],
        itemCount: data.count || 0,
        subtotal: data.subtotal || 0,
      });
    } catch {
      // Not logged in or empty
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (productId, quantity = 1, size, color) => {
    set({ isLoading: true });
    try {
      await api.post('/cart', { productId, quantity, size, color });
      await get().fetchCart();
    } finally {
      set({ isLoading: false });
    }
  },

  updateQuantity: async (cartItemId, quantity) => {
    if (quantity <= 0) return get().removeItem(cartItemId);
    set({ isLoading: true });
    try {
      await api.put(`/cart/${cartItemId}`, { quantity });
      await get().fetchCart();
    } finally {
      set({ isLoading: false });
    }
  },

  removeItem: async (cartItemId) => {
    set({ isLoading: true });
    try {
      await api.delete(`/cart/${cartItemId}`);
      await get().fetchCart();
    } finally {
      set({ isLoading: false });
    }
  },

  clearCart: async () => {
    set({ isLoading: true });
    try {
      await api.delete('/cart/clear');
    } catch {}
    set({ items: [], itemCount: 0, subtotal: 0, isLoading: false });
  },
}));
