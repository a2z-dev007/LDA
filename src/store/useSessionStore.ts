import { create } from 'zustand';

// In-memory only — not persisted
interface SessionState {
  currentDay: number;
  currentScreen: string;
  sessionStartTime: string | null;

  setCurrentDay: (day: number) => void;
  setCurrentScreen: (screen: string) => void;
  startSession: () => void;
  endSession: () => void;
}

export const useSessionStore = create<SessionState>()((set) => ({
  currentDay: 1,
  currentScreen: 'Splash',
  sessionStartTime: null,

  setCurrentDay: (day) => set({ currentDay: day }),
  setCurrentScreen: (screen) => set({ currentScreen: screen }),
  startSession: () => set({ sessionStartTime: new Date().toISOString() }),
  endSession: () => set({ sessionStartTime: null }),
}));
