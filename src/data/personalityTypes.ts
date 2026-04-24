// ─────────────────────────────────────────────────────────────
// 4 Personality Types — PRD spec
// steady_flame | electric_spark | deep_current | shifting_tide
// Calculated from 7 A/B quiz answers
// ─────────────────────────────────────────────────────────────

export type PersonalityTypeId =
  | 'steady_flame'
  | 'electric_spark'
  | 'deep_current'
  | 'shifting_tide';

export interface PersonalityType {
  id: PersonalityTypeId;
  name: string;
  subLabel: string;
  description: string;
  traits: string[];
  growth: string;
  triviaFact: string;
  color: string;
}

export const personalityTypes: PersonalityType[] = [
  {
    id: 'steady_flame',
    name: 'The Steady Flame',
    subLabel: 'Consistent · Protective · Quietly devoted',
    description:
      'You burn quietly — but you never go out. You show love through consistency and quiet devotion. In a world of noise, your partner finds peace in knowing you will always be there.',
    traits: ['Deeply reliable', 'Steady through storms', 'Thoughtful and careful'],
    growth: 'Let them in more often — your feelings, when shared, are a gift.',
    triviaFact:
      'Research shows that consistent, predictable partners create the strongest attachment bonds. Reliability is not boring — it is the foundation of deep trust.',
    color: '#9B8EC4',
  },
  {
    id: 'electric_spark',
    name: 'The Electric Spark',
    subLabel: 'Passionate · Expressive · Growth-chasing',
    description:
      'You bring the energy that others remember. Passionate, expressive, and always chasing the next beautiful moment. You push your relationship into new territory and your partner feels alive around you.',
    traits: ['Infectious energy', 'Deeply expressive', 'Growth-oriented'],
    growth: 'Slow down sometimes — presence matters more than the next adventure.',
    triviaFact:
      'Studies find that couples who regularly try new experiences together show higher relationship satisfaction. Your instinct to keep things alive is scientifically sound.',
    color: '#E85C7A',
  },
  {
    id: 'deep_current',
    name: 'The Deep Current',
    subLabel: 'Introspective · Quietly intense · Deeply feeling',
    description:
      'Still on the surface. Worlds deep underneath. You feel everything but seldom say it. You process deeply, love quietly, and when you do open up — it changes everything.',
    traits: ['Deep emotional intelligence', 'Quietly devoted', 'Inward strength'],
    growth: 'Trust that sharing half a thought is better than sharing none.',
    triviaFact:
      "Psychologists call it 'quiet devotion' — the kind of love that doesn't need an audience. Research shows it's one of the most durable forms of attachment.",
    color: '#4FBFA5',
  },
  {
    id: 'shifting_tide',
    name: 'The Shifting Tide',
    subLabel: 'Adaptive · Emotionally fluid · Surprising',
    description:
      'Unexpected. Unforgettable. Undeniably you. You grow in unexpected leaps, surprise your partner in the best ways, and love with rare intensity when something moves you.',
    traits: ['Intensely authentic', 'Surprising depth', 'Fearless when it counts'],
    growth: 'Your partner wants the storm sometimes — let them witness you.',
    triviaFact:
      'Emotional flexibility — the ability to feel and adapt — is linked to higher empathy and deeper intimacy. Your range is a relationship superpower.',
    color: '#F0A057',
  },
];

// ─────────────────────────────────────────────────────────────
// Personality Calculator
// Maps 7 A/B answers → one of 4 types
// A answers = more open/expressive/present
// B answers = more reserved/deep/protective
// ─────────────────────────────────────────────────────────────
export function calculatePersonalityType(
  answers: Record<string, 'A' | 'B'>
): PersonalityType {
  let aCount = 0;
  let bCount = 0;

  Object.values(answers).forEach((v) => {
    if (v === 'A') aCount++;
    else bCount++;
  });

  const q1 = answers['q1'];
  const q4 = answers['q4'];
  const q7 = answers['q7'];

  // Determine type from dominant pattern
  if (aCount >= 5) return personalityTypes.find((t) => t.id === 'electric_spark')!;
  if (bCount >= 5) return personalityTypes.find((t) => t.id === 'deep_current')!;

  // Mixed — use key questions to differentiate
  if (q1 === 'A' && q7 === 'A') return personalityTypes.find((t) => t.id === 'electric_spark')!;
  if (q1 === 'B' && q7 === 'B') return personalityTypes.find((t) => t.id === 'steady_flame')!;
  if (q4 === 'A') return personalityTypes.find((t) => t.id === 'shifting_tide')!;
  return personalityTypes.find((t) => t.id === 'deep_current')!;
}
