import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '../services/mmkvStorage';

interface UserState {
  userId: string;
  name: string;
  onboardingComplete: boolean;
  createdAt: string | null;

  setName: (name: string) => void;
  setOnboardingComplete: (status: boolean) => void;
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      userId: generateUUID(),
      name: '',
      onboardingComplete: false,
      createdAt: null,

      setName: (name) => set({ name }),

      setOnboardingComplete: (status) =>
        set({
          onboardingComplete: status,
          createdAt: get().createdAt ?? new Date().toISOString(),
        }),
    }),
    {
      name: 'lda-user-store',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
