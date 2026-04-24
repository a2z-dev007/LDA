import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface JournalEntry {
  id: string;
  day: number;
  type: 'followup' | 'appreciation' | 'certainty' | 'daily2' | 'promise';
  content: string;
  intentionWord?: string;
  createdAt: string;
}

export type MemoryType = 'text' | 'photo' | 'emoji' | 'skipped';

export interface JarMemory {
  id: string;
  content: string | null;
  type: MemoryType;
  tinyCompliment: string | null;
  dayColor: string;
  createdAt: string;
}

interface JournalState {
  entries: JournalEntry[];
  jarMemories: JarMemory[];
  jarFillLevel: number; // 0–100

  addEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
  addJarMemory: (memory: Omit<JarMemory, 'id' | 'createdAt'>) => void;
  setJarFillLevel: (level: number) => void;
  clearAll: () => void;
}

const asyncStorageAdapter = {
  getItem: async (name: string) => {
    const value = await AsyncStorage.getItem(name);
    return value ?? null;
  },
  setItem: async (name: string, value: string) => {
    await AsyncStorage.setItem(name, value);
  },
  removeItem: async (name: string) => {
    await AsyncStorage.removeItem(name);
  },
};

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      entries: [],
      jarMemories: [],
      jarFillLevel: 0,

      addEntry: (entry) => {
        const newEntry: JournalEntry = {
          ...entry,
          id: `entry_${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set({ entries: [...get().entries, newEntry] });
      },

      addJarMemory: (memory) => {
        const newMemory: JarMemory = {
          ...memory,
          id: `jar_${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set({ jarMemories: [...get().jarMemories, newMemory] });
      },

      setJarFillLevel: (level) => set({ jarFillLevel: level }),

      clearAll: () => set({ entries: [], jarMemories: [], jarFillLevel: 0 }),
    }),
    {
      name: 'lda-journal-entries',
      storage: createJSONStorage(() => asyncStorageAdapter),
    }
  )
);
