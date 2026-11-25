import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach JWT — prefer yel_aura_token, fall back to Zustand-persisted token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      // yel_aura_token is the raw key; yel-aura-auth is Zustand persist (JSON with token field)
      const raw = localStorage.getItem('yel_aura_token');
      const persisted = (() => {
        try { return JSON.parse(localStorage.getItem('yel-aura-auth') || '{}')?.state?.token; } catch { return null; }
      })();
      const token = raw || persisted;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        // Re-sync the raw key so future calls don't re-read persisted JSON
        if (!raw && persisted) localStorage.setItem('yel_aura_token', persisted);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: on 401 from auth endpoints, clear stored tokens.
// Do NOT do any redirect here — components (AdminShell, ShellLayout) handle redirects
// themselves so we avoid hard-navigation race conditions during Next.js route transitions.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url: string = error.config?.url ?? '';
    const status: number = error.response?.status;

    if (status === 401 && url.includes('/auth/')) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('yel_aura_token');
        try {
          const raw = localStorage.getItem('yel-aura-auth');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed?.state) {
              parsed.state.user = null;
              parsed.state.token = null;
              parsed.state.isAuthenticated = false;
              localStorage.setItem('yel-aura-auth', JSON.stringify(parsed));
            }
          }
        } catch {}
      }
    }

    return Promise.reject(error);
  }
);

export default api;
