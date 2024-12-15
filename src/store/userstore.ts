import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  username: string | null;
  setUsername: (username: string) => void;
  clearUsername: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      username: null,
      setUsername: (username) => set({ username }),
      clearUsername: () => set({ username: null }),
    }),
    {
      name: 'auth-storage', // localStorage 키 이름
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
