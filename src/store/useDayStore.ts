import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '../services/mmkvStorage';
import { Segment } from '../data/quizData';
import { PersonalityTypeId } from '../data/personalityTypes';
import { useJournalStore } from './useJournalStore';
import { useStreakStore } from './useStreakStore';

// ─────────────────────────────────────────────────────────────
// Day Data Shapes — PRD §4.1
// ─────────────────────────────────────────────────────────────

export interface Day1Data {
  complete: boolean;
  completionTimestamp: string | null;
  sliderScore: number;
  segment: Segment | null;
  vibe_d1: string | null;
  vibe_d1_category: 'positive' | 'tender' | 'heavy' | null;
  quizAnswers: Record<string, 'A' | 'B'>;
  personalityType: PersonalityTypeId | null;
  moodScore: number;
}

export interface ThisOrThatRound {
  round: number;
  my_pick: string;
  my_pred_of_partner: string;
}

export interface Day2Data {
  complete: boolean;
  completionTimestamp: string | null;
  intentionWord: string;
  b2_tot_rounds: ThisOrThatRound[];
  b2_tot_complete: boolean;
  mood: 'connected' | 'grateful' | 'loved' | 'playful' | 'overwhelmed' | 'frustrated' | 'distant' | 'missed' | null;
  moodScore: number;
  followUpQuestion: string;
  followUpAnswer: string;
  followUpLength: number;
  oneGoodThing: string | null;
}

export interface Day3Data {
  complete: boolean;
  completionTimestamp: string | null;
  intentionWord: string;
  appreciationSnap: string | null;
  d3_fms_stem_id: number | null;
  d3_fms_pick: string | null;
  d3_fms_tag: string | null;
  mirrorAnswers: Record<string, boolean>;
  trueRatio: number;
  d3_mood_board: string[];
  d3_mood_board_theme: string | null;
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
  d4_priority_picks: string[];
  d4_top_need: string | null;
  daily2Q1: string;
  daily2Q2: string;
  daily2Status: 'both' | 'one' | 'skipped';
  dropBoxUsed: boolean;
  dropBoxReframedText: string | null;
  loveDropUsed: boolean;
  loveDropType: 'compliment' | 'memory' | 'challenge' | 'unsaid' | null;
  loveDropContent: string | null;
}

export interface Day5Data {
  complete: boolean;
  completionTimestamp: string | null;
  badgeName: string;
  badgeTier: 'gold' | 'standard' | 'emerging';
  dedicationScore: number;
  connectionScore: number;
  partnerKnowledgeScore: number;
  promise: string | null;
  letterGenerated: boolean;
  averageScore: number;
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
  setDay1Vibe: (vibe: string, category: Day1Data['vibe_d1_category']) => void;
  saveDay1Quiz: (quizAnswers: Record<string, 'A' | 'B'>, personalityType: PersonalityTypeId) => void;
  completeDay1: () => void;

  // Day 2
  setDay2IntentionWord: (word: string) => void;
  setB2ThisOrThat: (rounds: ThisOrThatRound[]) => void;
  setDay2OneGoodThing: (text: string) => void;
  setDay2Mood: (mood: Day2Data['mood']) => void;
  completeDay2: (mood: Day2Data['mood'], moodScore: number, followUpQuestion: string, followUpAnswer: string) => void;

  // Day 3
  setDay3IntentionWord: (word: string) => void;
  setAppreciationSnap: (text: string) => void;
  setDay3FMS: (stemId: number, pick: string, tag: string) => void;
  setDay3MoodBoard: (tiles: string[], theme: string) => void;
  setOneCertainty: (text: string) => void;
  completeDay3: (mirrorAnswers: Record<string, boolean>, trueRatio: number) => void;

  // Day 4
  setDay4IntentionWord: (word: string) => void;
  setTinyCompliment: (word: string) => void;
  setDay4Memory: (content: string | null, type: Day4Data['memoryType']) => void;
  setDay4PriorityShuffle: (picks: string[], topNeed: string) => void;
  setLoveDrop: (type: NonNullable<Day4Data['loveDropType']>, content: string) => void;
  setDay4DailyTwo: (q1: string, q2: string, status: Day4Data['daily2Status']) => void;
  setDay4DropBoxUsed: (used: boolean, reframedText: string | null) => void;
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
    connectionScore: number;
    partnerKnowledgeScore: number;
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
  vibe_d1: null,
  vibe_d1_category: null,
  quizAnswers: {},
  personalityType: null,
  moodScore: 0,
};

const defaultDay2: Day2Data = {
  complete: false,
  completionTimestamp: null,
  intentionWord: '',
  b2_tot_rounds: [],
  b2_tot_complete: false,
  mood: null,
  moodScore: 0,
  followUpQuestion: '',
  followUpAnswer: '',
  followUpLength: 0,
  oneGoodThing: null,
};

const defaultDay3: Day3Data = {
  complete: false,
  completionTimestamp: null,
  intentionWord: '',
  appreciationSnap: null,
  d3_fms_stem_id: null,
  d3_fms_pick: null,
  d3_fms_tag: null,
  mirrorAnswers: {},
  trueRatio: 0,
  d3_mood_board: [],
  d3_mood_board_theme: null,
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
  d4_priority_picks: [],
  d4_top_need: null,
  daily2Q1: '',
  daily2Q2: '',
  daily2Status: 'skipped',
  dropBoxUsed: false,
  dropBoxReframedText: null,
  loveDropUsed: false,
  loveDropType: null,
  loveDropContent: null,
};

const defaultDay5: Day5Data = {
  complete: false,
  completionTimestamp: null,
  badgeName: '',
  badgeTier: 'emerging',
  dedicationScore: 0,
  connectionScore: 0,
  partnerKnowledgeScore: 0,
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

      setDay1Vibe: (vibe, category) =>
        set((s) => ({ day1: { ...s.day1, vibe_d1: vibe, vibe_d1_category: category } })),

      saveDay1Quiz: (quizAnswers, personalityType) =>
        set((s) => ({
          day1: {
            ...s.day1,
            quizAnswers,
            personalityType,
          },
        })),
      
      completeDay1: () =>
        set((s) => ({
          day1: {
            ...s.day1,
            complete: true,
            completionTimestamp: new Date().toISOString(),
          },
        })),

      setDay2IntentionWord: (word) =>
        set((s) => ({ day2: { ...s.day2, intentionWord: word } })),

      setB2ThisOrThat: (rounds) =>
        set((s) => ({ day2: { ...s.day2, b2_tot_rounds: rounds, b2_tot_complete: true } })),

      setDay2OneGoodThing: (text) =>
        set((s) => ({ day2: { ...s.day2, oneGoodThing: text } })),

      setDay2Mood: (mood) =>
        set((s) => ({ day2: { ...s.day2, mood } })),

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

      setDay3FMS: (stemId, pick, tag) =>
        set((s) => ({ day3: { ...s.day3, d3_fms_stem_id: stemId, d3_fms_pick: pick, d3_fms_tag: tag } })),

      setDay3MoodBoard: (tiles, theme) =>
        set((s) => ({ day3: { ...s.day3, d3_mood_board: tiles, d3_mood_board_theme: theme } })),

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

      setDay4Memory: (content, type) =>
        set((s) => ({ day4: { ...s.day4, memoryContent: content, memoryType: type } })),

      setDay4PriorityShuffle: (picks, topNeed) =>
        set((s) => ({ day4: { ...s.day4, d4_priority_picks: picks, d4_top_need: topNeed } })),

      setLoveDrop: (type, content) =>
        set((s) => ({ day4: { ...s.day4, loveDropUsed: true, loveDropType: type, loveDropContent: content } })),

      setDay4DailyTwo: (q1, q2, status) =>
        set((s) => ({
          day4: {
            ...s.day4,
            daily2Q1: q1,
            daily2Q2: q2,
            daily2Status: status,
          },
        })),

      setDay4DropBoxUsed: (used, reframedText) =>
        set((s) => ({
          day4: {
            ...s.day4,
            dropBoxUsed: used,
            dropBoxReframedText: reframedText,
          },
        })),

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
        const { day1, day2, day3, day4, day5 } = get();
        let pts = 0;
        
        // D1 complete
        if (day1.complete && day1.vibe_d1) pts += 1;
        
        // D2 complete
        if (day2.complete && day2.mood) pts += 1;
        
        // D3 complete parts
        if (day3.complete) pts += 1;
        if (day3.d3_mood_board.length === 3) pts += 0.5;
        if (day3.d3_fms_pick) pts += 0.5;
        
        // D4 complete parts
        if (day4.memoryType !== 'skipped') pts += 1;
        if (day4.d4_priority_picks.length === 3) pts += 0.5;
        if (day4.loveDropUsed) pts += 0.5;
        if (day4.daily2Status === 'both') pts += 0.5;
        if (day4.dropBoxUsed) pts += 0.5;
        
        // D5 complete
        if (day5.complete && day5.promise) pts += 1;
        
        // Skip bonus
        pts += 1; 

        return Math.min(pts, 7.0);
      },

      resetAll: () => {
        useJournalStore.getState().clearAll();
        useStreakStore.getState().resetStreak();
        set({
          day1: defaultDay1,
          day2: defaultDay2,
          day3: defaultDay3,
          day4: defaultDay4,
          day5: defaultDay5,
        });
      },
    }),
    {
      name: 'lda-day-store',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
