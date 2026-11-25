import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import api from '@/lib/axios';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<User>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  fetchProfile: () => Promise<void>;
  setToken: (token: string | null) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setToken: (token) => {
        if (typeof window !== 'undefined') {
          if (token) localStorage.setItem('yel_aura_token', token);
          else localStorage.removeItem('yel_aura_token');
        }
        set({ token });
      },

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/login', { email, password });
          const { user, token } = data;
          if (typeof window !== 'undefined') localStorage.setItem('yel_aura_token', token);
          set({ user, token, isAuthenticated: true, isLoading: false });
          return user as import('@/types').User;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (formData) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/register', formData);
          const { user, token } = data;
          if (typeof window !== 'undefined') localStorage.setItem('yel_aura_token', token);
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        await api.post('/auth/logout').catch(() => {});
        if (typeof window !== 'undefined') localStorage.removeItem('yel_aura_token');
        set({ user: null, token: null, isAuthenticated: false });
      },

      fetchProfile: async () => {
        // Read token from: raw key → in-memory Zustand state → Zustand persist blob
        // This order handles: normal, post-rehydration, and pre-rehydration timing gaps.
        const token = typeof window !== 'undefined'
          ? (localStorage.getItem('yel_aura_token') || get().token || (() => {
              try { return JSON.parse(localStorage.getItem('yel-aura-auth') || '{}')?.state?.token ?? null; } catch { return null; }
            })())
          : get().token;
        if (!token) return;
        try {
          const { data } = await api.get('/auth/profile');
          // Re-sync raw key in case it was cleared
          if (typeof window !== 'undefined') localStorage.setItem('yel_aura_token', token);
          set({ user: data, token, isAuthenticated: true });
        } catch (err: any) {
          // Only invalidate session on explicit auth rejection — not on 500 or network errors
          if (err?.response?.status === 401 || err?.response?.status === 403) {
            if (typeof window !== 'undefined') localStorage.removeItem('yel_aura_token');
            set({ user: null, token: null, isAuthenticated: false });
          }
        }
      },
    }),
    {
      name: 'yel-aura-auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);
