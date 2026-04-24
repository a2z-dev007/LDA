import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '../services/mmkvStorage';

interface StreakState {
  streakCount: number;
  shieldAvailable: boolean;
  shieldUsed: boolean;
  lastActiveDate: string | null;
  repeatMoodStreak: number;
  lastMoodId: string | null;

  // Actions
  recordActivity: () => void;
  checkAndApplyShield: () => boolean; // returns true if shield was applied
  recordMood: (moodId: string) => void;
  resetStreak: () => void;
}

export const useStreakStore = create<StreakState>()(
  persist(
    (set, get) => ({
      streakCount: 0,
      shieldAvailable: true,
      shieldUsed: false,
      lastActiveDate: null,
      repeatMoodStreak: 0,
      lastMoodId: null,

      recordActivity: () => {
        const now = new Date();
        const last = get().lastActiveDate ? new Date(get().lastActiveDate!) : null;

        if (!last) {
          set({ streakCount: 1, lastActiveDate: now.toISOString() });
          return;
        }

        const diffHours = (now.getTime() - last.getTime()) / (1000 * 60 * 60);

        if (diffHours < 24) {
          // Same day — just update timestamp
          set({ lastActiveDate: now.toISOString() });
        } else if (diffHours < 48) {
          // Next day — increment streak
          set({ streakCount: get().streakCount + 1, lastActiveDate: now.toISOString() });
        } else {
          // Missed — streak resets (shield logic handled separately)
          set({ streakCount: 1, lastActiveDate: now.toISOString() });
        }
      },

      checkAndApplyShield: () => {
        const { lastActiveDate, shieldAvailable, shieldUsed } = get();
        if (!lastActiveDate) return false;

        const diffHours =
          (new Date().getTime() - new Date(lastActiveDate).getTime()) / (1000 * 60 * 60);

        if (diffHours >= 48 && shieldAvailable && !shieldUsed) {
          set({ shieldAvailable: false, shieldUsed: true });
          return true;
        }
        return false;
      },

      recordMood: (moodId: string) => {
        const { lastMoodId, repeatMoodStreak } = get();
        if (moodId === lastMoodId) {
          set({ repeatMoodStreak: repeatMoodStreak + 1, lastMoodId: moodId });
        } else {
          set({ repeatMoodStreak: 1, lastMoodId: moodId });
        }
      },

      resetStreak: () =>
        set({
          streakCount: 0,
          shieldAvailable: true,
          shieldUsed: false,
          lastActiveDate: null,
          repeatMoodStreak: 0,
          lastMoodId: null,
        }),
    }),
    {
      name: 'lda-streak-store',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
