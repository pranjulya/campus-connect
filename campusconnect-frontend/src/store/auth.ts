import { create } from 'zustand';
import { clearTokenCookie, readTokenCookie, writeTokenCookie } from '@/lib/auth/token-cookie';

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Rehydrate from the auth cookie on the client so a reload keeps the session.
  token: readTokenCookie(),
  setToken: (token) => {
    writeTokenCookie(token);
    set({ token });
  },
  logout: () => {
    clearTokenCookie();
    set({ token: null });
  },
}));
