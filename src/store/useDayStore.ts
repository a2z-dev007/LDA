import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '../services/mmkvStorage';
import { Segment } from '../data/quizData';
import { PersonalityTypeId } from '../data/personalityTypes';

// ─────────────────────────────────────────────────────────────
// Day Data Shapes — PRD §4.1
// ─────────────────────────────────────────────────────────────

export interface Day1Data {
  complete: boolean;
  completionTimestamp: string | null;
  sliderScore: number;
  segment: Segment | null;
  quizAnswers: Record<string, 'A' | 'B'>;
  personalityType: PersonalityTypeId | null;
  moodScore: number; // = sliderScore, used in Day 5 chart
}

export interface Day2Data {
  complete: boolean;
  completionTimestamp: string | null;
  intentionWord: string;
  mood: 'connected' | 'grateful' | 'loved' | 'playful' | 'overwhelmed' | 'frustrated' | 'distant' | 'missed' | null;
  moodScore: number; // 3–9 from mood table
  followUpQuestion: string;
  followUpAnswer: string;
  followUpLength: number; // used in badge Axis A calculation
}

export interface Day3Data {
  complete: boolean;
  completionTimestamp: string | null;
  intentionWord: string;
  appreciationSnap: string | null;
  mirrorAnswers: Record<string, boolean>; // q1–q10: true=TRUE, false=FALSE
  trueRatio: number; // 0.0–1.0 → used in Axis B & C badge calculation
  oneCertainty: string | null;
  partnerInviteSent: boolean;
}

export interface Day4Data {
  complete: boolean;
  completionTimestamp: string | null;
  intentionWord: string;
  memoryContent: string | null;
  memoryType: 'text' | 'photo' | 'emoji' | 'skipped';
  tinyComplimentWord: string | null;
  daily2Q1: string;
  daily2Q2: string;
  daily2Status: 'both' | 'one' | 'skipped';
  dropBoxUsed: boolean;
  dropBoxReframedText: string | null; // original NEVER stored
}

export interface Day5Data {
  complete: boolean;
  completionTimestamp: string | null;
  badgeName: string;
  badgeTier: 'gold' | 'standard' | 'emerging';
  dedicationScore: number; // 2–8
  promise: string | null;
  letterGenerated: boolean;
  averageScore: number; // rolling average for report chart
  partnerInviteSent: boolean;
  soloContinuation: boolean;
}

// ─────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────

interface DayStore {
  day1: Day1Data;
  day2: Day2Data;
  day3: Day3Data;
  day4: Day4Data;
  day5: Day5Data;

  // Day 1
  setDay1Slider: (score: number, segment: Segment) => void;
  completeDay1: (quizAnswers: Record<string, 'A' | 'B'>, personalityType: PersonalityTypeId) => void;

  // Day 2
  setDay2IntentionWord: (word: string) => void;
  completeDay2: (mood: Day2Data['mood'], moodScore: number, followUpQuestion: string, followUpAnswer: string) => void;

  // Day 3
  setDay3IntentionWord: (word: string) => void;
  setAppreciationSnap: (text: string) => void;
  setOneCertainty: (text: string) => void;
  completeDay3: (mirrorAnswers: Record<string, boolean>, trueRatio: number) => void;

  // Day 4
  setDay4IntentionWord: (word: string) => void;
  setTinyCompliment: (word: string) => void;
  completeDay4: (payload: {
    memoryContent: string | null;
    memoryType: Day4Data['memoryType'];
    tinyComplimentWord: string | null;
    daily2Q1: string;
    daily2Q2: string;
    daily2Status: Day4Data['daily2Status'];
    dropBoxUsed: boolean;
    dropBoxReframedText: string | null;
  }) => void;

  // Day 5
  completeDay5: (payload: {
    badgeName: string;
    badgeTier: Day5Data['badgeTier'];
    dedicationScore: number;
    promise: string | null;
    letterGenerated: boolean;
    averageScore: number;
  }) => void;
  setPartnerInviteSent: (day: 3 | 5) => void;

  // Helpers
  nextDay: () => number;
  completedDayCount: () => number;
  getDedicationScore: () => number;
  resetAll: () => void;
}

// ─────────────────────────────────────────────────────────────
// Defaults
// ─────────────────────────────────────────────────────────────

const defaultDay1: Day1Data = {
  complete: false,
  completionTimestamp: null,
  sliderScore: 0,
  segment: null,
  quizAnswers: {},
  personalityType: null,
  moodScore: 0,
};

const defaultDay2: Day2Data = {
  complete: false,
  completionTimestamp: null,
  intentionWord: '',
  mood: null,
  moodScore: 0,
  followUpQuestion: '',
  followUpAnswer: '',
  followUpLength: 0,
};

const defaultDay3: Day3Data = {
  complete: false,
  completionTimestamp: null,
  intentionWord: '',
  appreciationSnap: null,
  mirrorAnswers: {},
  trueRatio: 0,
  oneCertainty: null,
  partnerInviteSent: false,
};

const defaultDay4: Day4Data = {
  complete: false,
  completionTimestamp: null,
  intentionWord: '',
  memoryContent: null,
  memoryType: 'skipped',
  tinyComplimentWord: null,
  daily2Q1: '',
  daily2Q2: '',
  daily2Status: 'skipped',
  dropBoxUsed: false,
  dropBoxReframedText: null,
};

const defaultDay5: Day5Data = {
  complete: false,
  completionTimestamp: null,
  badgeName: '',
  badgeTier: 'emerging',
  dedicationScore: 0,
  promise: null,
  letterGenerated: false,
  averageScore: 0,
  partnerInviteSent: false,
  soloContinuation: false,
};

// ─────────────────────────────────────────────────────────────
// Store Implementation
// ─────────────────────────────────────────────────────────────

export const useDayStore = create<DayStore>()(
  persist(
    (set, get) => ({
      day1: defaultDay1,
      day2: defaultDay2,
      day3: defaultDay3,
      day4: defaultDay4,
      day5: defaultDay5,

      setDay1Slider: (score, segment) =>
        set((s) => ({ day1: { ...s.day1, sliderScore: score, segment, moodScore: score } })),

      completeDay1: (quizAnswers, personalityType) =>
        set((s) => ({
          day1: {
            ...s.day1,
            quizAnswers,
            personalityType,
            complete: true,
            completionTimestamp: new Date().toISOString(),
          },
        })),

      setDay2IntentionWord: (word) =>
        set((s) => ({ day2: { ...s.day2, intentionWord: word } })),

      completeDay2: (mood, moodScore, followUpQuestion, followUpAnswer) =>
        set((s) => ({
          day2: {
            ...s.day2,
            mood,
            moodScore,
            followUpQuestion,
            followUpAnswer,
            followUpLength: followUpAnswer.length,
            complete: true,
            completionTimestamp: new Date().toISOString(),
          },
        })),

      setDay3IntentionWord: (word) =>
        set((s) => ({ day3: { ...s.day3, intentionWord: word } })),

      setAppreciationSnap: (text) =>
        set((s) => ({ day3: { ...s.day3, appreciationSnap: text } })),

      setOneCertainty: (text) =>
        set((s) => ({ day3: { ...s.day3, oneCertainty: text } })),

      completeDay3: (mirrorAnswers, trueRatio) =>
        set((s) => ({
          day3: {
            ...s.day3,
            mirrorAnswers,
            trueRatio,
            complete: true,
            completionTimestamp: new Date().toISOString(),
          },
        })),

      setDay4IntentionWord: (word) =>
        set((s) => ({ day4: { ...s.day4, intentionWord: word } })),

      setTinyCompliment: (word: string) =>
        set((s) => ({ day4: { ...s.day4, tinyComplimentWord: word } })),

      completeDay4: (payload) =>
        set((s) => ({
          day4: {
            ...s.day4,
            ...payload,
            complete: true,
            completionTimestamp: new Date().toISOString(),
          },
        })),

      completeDay5: (payload) =>
        set((s) => ({
          day5: {
            ...s.day5,
            ...payload,
            complete: true,
            completionTimestamp: new Date().toISOString(),
          },
        })),

      setPartnerInviteSent: (day) => {
        if (day === 3) set((s) => ({ day3: { ...s.day3, partnerInviteSent: true } }));
        if (day === 5) set((s) => ({ day5: { ...s.day5, partnerInviteSent: true } }));
      },

      nextDay: () => {
        const { day1, day2, day3, day4, day5 } = get();
        if (!day1.complete) return 1;
        if (!day2.complete) return 2;
        if (!day3.complete) return 3;
        if (!day4.complete) return 4;
        if (!day5.complete) return 5;
        return 6;
      },

      completedDayCount: () => {
        const { day1, day2, day3, day4, day5 } = get();
        return [day1, day2, day3, day4, day5].filter((d) => d.complete).length;
      },

      getDedicationScore: () => {
        const { day2, day3, day4, day5 } = get();
        let score = 4.0; // base for completing all 5 days
        if (day2.followUpLength > 0) score += 0.5;
        if (day3.appreciationSnap) score += 0.5;
        if (day3.oneCertainty) score += 0.5;
        if (day4.tinyComplimentWord) score += 0.5;
        if (day4.daily2Status !== 'skipped') score += 0.5;
        if (day4.dropBoxUsed) score += 0.5;
        if (day5.promise) score += 0.5;
        return Math.min(score, 8);
      },

      resetAll: () =>
        set({
          day1: defaultDay1,
          day2: defaultDay2,
          day3: defaultDay3,
          day4: defaultDay4,
          day5: defaultDay5,
        }),
    }),
    {
      name: 'lda-day-store',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
