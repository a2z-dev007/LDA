/**
 * Day 1 Data Service
 * ──────────────────
 * Currently reads from local JSON.
 * To connect to a real API, replace the import and return fetch() calls.
 *
 * API SWAP GUIDE:
 *   1. Replace `import day1Data from './day1Content.json'`
 *      with `const day1Data = await fetch('/api/day1/content').then(r => r.json())`
 *   2. All function signatures stay the same — screens don't need to change.
 */

import day1Data from './day1Content.json';

export type SegmentId = 'segment_1' | 'segment_2' | 'segment_3' | 'segment_4' | 'segment_5';
export type PersonalityTypeId = 'steady_flame' | 'electric_spark' | 'deep_current' | 'shifting_tide';
export type AnswerValue = 'A' | 'B';

export interface QuizQuestion {
  id: string;
  prompt: string;
  optionA: string;
  optionB: string;
  moodBadge: string;
}

export interface PersonalityType {
  id: PersonalityTypeId;
  name: string;
  subLabel: string;
  description: string;
  traits: string[];
  growth: string;
  color: string;
}

// ── Slider ────────────────────────────────────────────────────
export function getSliderContent() {
  return day1Data.slider;
}

export function resolveSegment(score: number): SegmentId {
  const rule = day1Data.slider.segmentRules.find(
    (r) => score >= r.min && score <= r.max
  );
  return (rule?.segment ?? 'segment_3') as SegmentId;
}

// ── Honest Moment ─────────────────────────────────────────────
export function getHonestMomentCopy(segment: SegmentId, score: number): string {
  const template = (day1Data.honestMoment.segments as Record<string, string>)[segment] ?? '';
  return template.replace('{score}', String(score));
}

export function getHonestMomentMeta() {
  return {
    dividerText: day1Data.honestMoment.dividerText,
    cta: day1Data.honestMoment.cta,
    ctaSub: day1Data.honestMoment.ctaSub,
  };
}

// ── Spark Quiz ────────────────────────────────────────────────
export function getQuizQuestions(segment: SegmentId): QuizQuestion[] {
  const segData = (day1Data.sparkQuiz.segments as any)[segment];
  if (!segData) return [];
  return segData.questions.map((q: any, i: number) => ({
    id: q.id,
    prompt: q.prompt,
    optionA: q.optionA,
    optionB: q.optionB,
    moodBadge: segData.moodBadges[i] ?? 'Honest · Self-aware',
  }));
}

export function getSegmentName(segment: SegmentId): string {
  return (day1Data.sparkQuiz.segments as any)[segment]?.name ?? '';
}

// ── Personality Type Calculator ───────────────────────────────
export function calculatePersonalityType(
  answers: Record<string, AnswerValue>
): PersonalityType {
  const scoring = day1Data.personalityTypes.scoring as Record<string, Record<string, number>>;
  const scores: Record<string, number> = {
    steady_flame: 0,
    electric_spark: 0,
    deep_current: 0,
    shifting_tide: 0,
  };

  // Apply scoring rules
  Object.entries(answers).forEach(([qId, answer]) => {
    const key = `${qId.toUpperCase()}=${answer}`;
    const points = scoring[key];
    if (points) {
      Object.entries(points).forEach(([type, pts]) => {
        scores[type] = (scores[type] ?? 0) + pts;
      });
    }
  });

  // Find highest score
  let maxScore = -1;
  let winner: string = day1Data.personalityTypes.tiebreakDefault;
  const tied: string[] = [];

  Object.entries(scores).forEach(([type, score]) => {
    if (score > maxScore) {
      maxScore = score;
      winner = type;
      tied.length = 0;
      tied.push(type);
    } else if (score === maxScore) {
      tied.push(type);
    }
  });

  // Tiebreak
  if (tied.length > 1) {
    for (const tieQ of day1Data.personalityTypes.tiebreakOrder) {
      const ans = answers[tieQ];
      if (ans) {
        const key = `${tieQ.toUpperCase()}=${ans}`;
        const pts = scoring[key];
        if (pts) {
          const tieWinner = Object.entries(pts).find(([t]) => tied.includes(t));
          if (tieWinner) { winner = tieWinner[0]; break; }
        }
      }
    }
  }

  const typeData = (day1Data.personalityTypes.types as any)[winner];
  return typeData as PersonalityType;
}

export function getPersonalityType(id: PersonalityTypeId): PersonalityType {
  return (day1Data.personalityTypes.types as any)[id] as PersonalityType;
}

export function getAllPersonalityTypes(): PersonalityType[] {
  return Object.values(day1Data.personalityTypes.types) as PersonalityType[];
}
