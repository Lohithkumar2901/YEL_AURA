import { create } from 'zustand';
import type { WishlistItem, Product } from '@/types';
import api from '@/lib/axios';

interface WishlistState {
  items: WishlistItem[];
  itemCount: number;
  isLoading: boolean;
}

interface WishlistActions {
  fetchWishlist: () => Promise<void>;
  toggleItem: (product: Product) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  setWishlist: (items: WishlistItem[]) => void;
  addItem: (product: Product) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
}

type WishlistStore = WishlistState & WishlistActions;

export const useWishlistStore = create<WishlistStore>()((set, get) => ({
  items: [],
  itemCount: 0,
  isLoading: false,

  setWishlist: (items) => set({ items, itemCount: items.length }),

  fetchWishlist: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/wishlist');
      const items: WishlistItem[] = Array.isArray(data) ? data : [];
      set({ items, itemCount: items.length });
    } catch {
      // Not logged in
    } finally {
      set({ isLoading: false });
    }
  },

  isInWishlist: (productId) => get().items.some((i) => i.productId === productId),

  toggleItem: async (product) => {
    const inWishlist = get().isInWishlist(product.id);
    if (inWishlist) {
      await get().removeItem(product.id);
    } else {
      await get().addItem(product);
    }
  },

  addItem: async (product) => {
    const optimistic: WishlistItem = { id: 'temp', productId: product.id, product, addedAt: new Date().toISOString() };
    set((state) => ({ items: [...state.items, optimistic], itemCount: state.itemCount + 1 }));
    try {
      await api.post('/wishlist/toggle', { productId: product.id });
      await get().fetchWishlist();
    } catch {
      set((state) => ({ items: state.items.filter((i) => i.productId !== product.id), itemCount: Math.max(0, state.itemCount - 1) }));
    }
  },

  removeItem: async (productId) => {
    const prev = get().items;
    set((state) => ({ items: state.items.filter((i) => i.productId !== productId), itemCount: Math.max(0, state.itemCount - 1) }));
    try {
      await api.post('/wishlist/toggle', { productId });
    } catch {
      set({ items: prev, itemCount: prev.length });
    }
  },
}));
