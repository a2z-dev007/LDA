// ─────────────────────────────────────────────────────────────
// 4 Personality Types — PRD spec
// steady_flame | electric_spark | deep_current | shifting_tide
// Calculated from 7 A/B quiz answers via day1Service
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
    subLabel: 'Consistent · Deeply felt · The long game',
    description:
      "You don't do grand gestures — you do quiet, consistent love. You're the partner who remembers what they said three months ago. Your relationship feels like a warm room, not a fireworks show.",
    traits: ['Emotionally present', 'Acts of care', 'Values depth', 'Loyal'],
    growth: "You assume they know. They might not. Say it out loud more.",
    triviaFact:
      'Research shows that consistent, predictable partners create the strongest attachment bonds. Reliability is not boring — it is the foundation of deep trust.',
    color: '#9B8EC4',
  },
  {
    id: 'electric_spark',
    name: 'The Electric Spark',
    subLabel: 'Spontaneous · High energy · The initiator',
    description:
      "You are the reason your relationship feels alive. You're the one who books the trip, tries the new thing, falls in love with your partner repeatedly. Your relationship has never been boring because you won't let it be.",
    traits: ['Adventure-driven', 'Expressive', 'Spontaneous', 'Enthusiastic'],
    growth: "The spark needs to land somewhere safe. Make sure they feel secure, not just excited.",
    triviaFact:
      'Studies find that couples who regularly try new experiences together show higher relationship satisfaction. Your instinct to keep things alive is scientifically sound.',
    color: '#E85C7A',
  },
  {
    id: 'deep_current',
    name: 'The Deep Current',
    subLabel: 'Thoughtful · Intentional · The still water',
    description:
      "You think before you speak and feel before you act. Your love is not loud, but it is deep — the kind that runs underneath everything else and keeps it all moving. People think you're reserved; your partner knows the truth.",
    traits: ['Reflective', 'Intentional', 'Emotionally intelligent', 'Patient'],
    growth: "Your depth can feel like distance. Let them in before you've figured it all out.",
    triviaFact:
      "Psychologists call it 'quiet devotion' — the kind of love that doesn't need an audience. Research shows it's one of the most durable forms of attachment.",
    color: '#4FBFA5',
  },
  {
    id: 'shifting_tide',
    name: 'The Shifting Tide',
    subLabel: 'Adaptive · Honest · The truth-teller',
    description:
      "You are the partner who says what nobody else will say — and somehow makes it land without cruelty. You've probably had one really honest conversation that changed everything. You're not afraid of the hard stuff because you know it leads somewhere real.",
    traits: ['Direct communicator', 'Adaptable', 'Honest', 'Growth-focused'],
    growth: "Honesty without tenderness is just criticism. The how matters as much as the what.",
    triviaFact:
      'Emotional flexibility — the ability to feel and adapt — is linked to higher empathy and deeper intimacy. Your range is a relationship superpower.',
    color: '#F0A057',
  },
];

// ─────────────────────────────────────────────────────────────
// Personality Calculator
// Delegates to day1Service for the scoring algorithm.
// Kept here for backward compatibility with existing imports.
// ─────────────────────────────────────────────────────────────
import { calculatePersonalityType as _calculate } from './day1Service';
import type { AnswerValue } from './day1Service';

export function calculatePersonalityType(
  answers: Record<string, AnswerValue>
): PersonalityType {
  const result = _calculate(answers);
  // Map back to the local PersonalityType shape (which includes triviaFact)
  const local = personalityTypes.find((p) => p.id === result.id);
  return local ?? personalityTypes[0];
}
