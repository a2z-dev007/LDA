// ─────────────────────────────────────────────────────────────
// Day 1 — Spark Quiz
// 5 segments × 7 questions (A/B options each)
// Segment is determined by sliderScore: 1-2=seg1, 3-4=seg2, 5-6=seg3, 7-8=seg4, 9-10=seg5
// ─────────────────────────────────────────────────────────────

export type Segment = 'segment_1' | 'segment_2' | 'segment_3' | 'segment_4' | 'segment_5';

export interface SparkQuestion {
  id: 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6' | 'q7';
  moodBadge: string;
  prompt: string;
  optionA: { label: string; value: 'A' };
  optionB: { label: string; value: 'B' };
}

// All 5 segments share the same 7 question slots but with segment-flavoured copy
export const sparkQuizQuestions: SparkQuestion[] = [
  {
    id: 'q1',
    moodBadge: 'Honest · Self-aware',
    prompt: 'When you feel disconnected, you usually…',
    optionA: { label: 'Reach out and say something', value: 'A' },
    optionB: { label: 'Wait and hope it passes', value: 'B' },
  },
  {
    id: 'q2',
    moodBadge: 'Curious · Open',
    prompt: 'The last time you felt truly seen by your partner was…',
    optionA: { label: 'Recently — it happens often', value: 'A' },
    optionB: { label: 'A while ago — I miss it', value: 'B' },
  },
  {
    id: 'q3',
    moodBadge: 'Reflective · Brave',
    prompt: 'In conflict, you tend to…',
    optionA: { label: 'Stay and work through it', value: 'A' },
    optionB: { label: 'Need space before talking', value: 'B' },
  },
  {
    id: 'q4',
    moodBadge: 'Tender · Honest',
    prompt: 'When it comes to expressing love, you…',
    optionA: { label: 'Say it out loud, often', value: 'A' },
    optionB: { label: 'Show it through actions', value: 'B' },
  },
  {
    id: 'q5',
    moodBadge: 'Spicy · Self-aware',
    prompt: 'Your relationship right now feels more like…',
    optionA: { label: 'A safe harbour', value: 'A' },
    optionB: { label: 'An open sea', value: 'B' },
  },
  {
    id: 'q6',
    moodBadge: 'Deep · Vulnerable',
    prompt: 'When your partner is struggling, you…',
    optionA: { label: 'Jump in to help immediately', value: 'A' },
    optionB: { label: 'Give them space first', value: 'B' },
  },
  {
    id: 'q7',
    moodBadge: 'Grounded · Clear',
    prompt: 'The future of this relationship feels…',
    optionA: { label: 'Clear and intentional', value: 'A' },
    optionB: { label: 'Open and evolving', value: 'B' },
  },
];

export function resolveSegment(sliderScore: number): Segment {
  if (sliderScore <= 2) return 'segment_1';
  if (sliderScore <= 4) return 'segment_2';
  if (sliderScore <= 6) return 'segment_3';
  if (sliderScore <= 8) return 'segment_4';
  return 'segment_5';
}

// ─────────────────────────────────────────────────────────────
// Honest Moment Copy — 5 segment responses with {score} token
// ─────────────────────────────────────────────────────────────
export const honestMomentCopy: Record<Segment, string> = {
  segment_1:
    "A {score}. That took courage to admit. Most people round up. You didn't. That honesty is exactly where this journey starts.",
  segment_2:
    "A {score}. Something feels off and you know it. The fact that you're here means you haven't given up. That matters.",
  segment_3:
    "A {score}. Right in the middle — which means there's real room to move. You're not stuck. You're just ready.",
  segment_4:
    "A {score}. You're close. Something good is already here. This week is about making it deeper.",
  segment_5:
    "A {score}. You feel it. Now let's make sure they feel it too. Five days to turn a feeling into something they'll remember.",
};

// ─────────────────────────────────────────────────────────────
// Day 2 — Mood Options
// 8 moods with scores (3–9), candle variant, follow-up questions
// ─────────────────────────────────────────────────────────────
export type MoodId =
  | 'connected'
  | 'grateful'
  | 'loved'
  | 'playful'
  | 'overwhelmed'
  | 'frustrated'
  | 'distant'
  | 'missed';

export interface MoodOption {
  id: MoodId;
  label: string;
  emoji: string;
  color: string;
  moodScore: number;
  candleVariant: 'tall_gold' | 'steady_amber' | 'low_blue' | 'warm_small' | 'flicker' | 'dim' | 'cold' | 'soft';
  followUpQuestion: string;
  axisSignals: string[];
}

export const moodOptions: MoodOption[] = [
  {
    id: 'connected',
    label: 'Connected',
    emoji: '🔥',
    color: '#F0A057',
    moodScore: 9,
    candleVariant: 'tall_gold',
    followUpQuestion: 'What made you feel connected today? Even one small thing.',
    axisSignals: ['present', 'building'],
  },
  {
    id: 'grateful',
    label: 'Grateful',
    emoji: '🌿',
    color: '#4FBFA5',
    moodScore: 8,
    candleVariant: 'steady_amber',
    followUpQuestion: 'What are you grateful for about them right now?',
    axisSignals: ['deep', 'protecting'],
  },
  {
    id: 'loved',
    label: 'Loved',
    emoji: '💛',
    color: '#D4A843',
    moodScore: 8,
    candleVariant: 'steady_amber',
    followUpQuestion: 'When did you last feel this loved? What was happening?',
    axisSignals: ['deep', 'protecting'],
  },
  {
    id: 'playful',
    label: 'Playful',
    emoji: '✨',
    color: '#E85C7A',
    moodScore: 7,
    candleVariant: 'flicker',
    followUpQuestion: 'What would a playful evening with them look like right now?',
    axisSignals: ['present', 'building'],
  },
  {
    id: 'overwhelmed',
    label: 'Overwhelmed',
    emoji: '🌀',
    color: '#9B8EC4',
    moodScore: 4,
    candleVariant: 'dim',
    followUpQuestion: "What's one thing that would make today feel lighter?",
    axisSignals: ['present', 'building'],
  },
  {
    id: 'frustrated',
    label: 'Frustrated',
    emoji: '🌊',
    color: '#6B8CFF',
    moodScore: 3,
    candleVariant: 'low_blue',
    followUpQuestion: "What's underneath the frustration? What do you actually need?",
    axisSignals: ['deep', 'building'],
  },
  {
    id: 'distant',
    label: 'Distant',
    emoji: '🌫️',
    color: '#888888',
    moodScore: 3,
    candleVariant: 'cold',
    followUpQuestion: 'When did the distance start? Was there a moment?',
    axisSignals: ['deep', 'building'],
  },
  {
    id: 'missed',
    label: 'Missing Them',
    emoji: '🌙',
    color: '#9B8EC4',
    moodScore: 5,
    candleVariant: 'warm_small',
    followUpQuestion: 'What do you miss most about them right now?',
    axisSignals: ['deep', 'protecting'],
  },
];

// ─────────────────────────────────────────────────────────────
// Day 3 — Assumptions Test
// 5 sets × 10 TRUE/FALSE statements, keyed by personality type
// ─────────────────────────────────────────────────────────────
export interface AssumptionStatement {
  id: string;
  statement: string;
}

export const assumptionsSets: Record<string, AssumptionStatement[]> = {
  steady_flame: [
    { id: 'a1', statement: 'My partner knows when I need space without me saying it.' },
    { id: 'a2', statement: 'My partner thinks I show love more through actions than words.' },
    { id: 'a3', statement: 'My partner feels I am the more patient one in the relationship.' },
    { id: 'a4', statement: 'My partner believes I find it hard to ask for help.' },
    { id: 'a5', statement: 'My partner thinks I worry about the future more than I let on.' },
    { id: 'a6', statement: 'My partner feels I am the one who keeps things stable.' },
    { id: 'a7', statement: 'My partner thinks I hold back my feelings to protect them.' },
    { id: 'a8', statement: 'My partner believes I need more reassurance than I ask for.' },
    { id: 'a9', statement: 'My partner thinks I am better at listening than talking.' },
    { id: 'a10', statement: 'My partner feels I am the one who remembers the small things.' },
  ],
  electric_spark: [
    { id: 'a1', statement: 'My partner thinks I get bored easily in routines.' },
    { id: 'a2', statement: 'My partner believes I am the one who initiates most things.' },
    { id: 'a3', statement: 'My partner thinks I feel things more intensely than most people.' },
    { id: 'a4', statement: 'My partner feels I sometimes move too fast for them.' },
    { id: 'a5', statement: 'My partner thinks I need excitement to feel connected.' },
    { id: 'a6', statement: 'My partner believes I am more impulsive than I admit.' },
    { id: 'a7', statement: 'My partner thinks I express love loudly and often.' },
    { id: 'a8', statement: 'My partner feels I am the one who keeps things interesting.' },
    { id: 'a9', statement: 'My partner thinks I struggle with sitting in discomfort.' },
    { id: 'a10', statement: 'My partner believes I love deeply but sometimes inconsistently.' },
  ],
  deep_current: [
    { id: 'a1', statement: 'My partner thinks I feel more than I ever say.' },
    { id: 'a2', statement: 'My partner believes I process things alone before sharing.' },
    { id: 'a3', statement: 'My partner thinks I am the more introspective one.' },
    { id: 'a4', statement: 'My partner feels I sometimes disappear into my own world.' },
    { id: 'a5', statement: 'My partner thinks I love quietly but deeply.' },
    { id: 'a6', statement: 'My partner believes I find small talk exhausting.' },
    { id: 'a7', statement: 'My partner thinks I notice things they never mention.' },
    { id: 'a8', statement: 'My partner feels I am hard to read sometimes.' },
    { id: 'a9', statement: 'My partner thinks I need depth in conversations to feel close.' },
    { id: 'a10', statement: 'My partner believes I carry things longer than I should.' },
  ],
  shifting_tide: [
    { id: 'a1', statement: 'My partner thinks my moods shift more than they expect.' },
    { id: 'a2', statement: 'My partner believes I adapt quickly to new situations.' },
    { id: 'a3', statement: 'My partner thinks I am hard to predict sometimes.' },
    { id: 'a4', statement: 'My partner feels I bring different energy each day.' },
    { id: 'a5', statement: 'My partner thinks I am more sensitive than I appear.' },
    { id: 'a6', statement: 'My partner believes I need variety to stay engaged.' },
    { id: 'a7', statement: 'My partner thinks I sometimes change my mind without warning.' },
    { id: 'a8', statement: 'My partner feels I am the one who keeps them on their toes.' },
    { id: 'a9', statement: 'My partner thinks I feel deeply but express it differently each time.' },
    { id: 'a10', statement: 'My partner believes I am still figuring out what I need.' },
  ],
  // fallback set
  default: [
    { id: 'a1', statement: 'My partner thinks I show love more through actions than words.' },
    { id: 'a2', statement: 'My partner believes I am the more patient one.' },
    { id: 'a3', statement: 'My partner thinks I need more alone time than I ask for.' },
    { id: 'a4', statement: 'My partner feels I am the one who remembers anniversaries.' },
    { id: 'a5', statement: 'My partner thinks I worry about us more than I let on.' },
    { id: 'a6', statement: 'My partner believes I find it hard to say sorry first.' },
    { id: 'a7', statement: 'My partner thinks I am better at giving advice than receiving it.' },
    { id: 'a8', statement: 'My partner feels I am the one who keeps things light.' },
    { id: 'a9', statement: 'My partner thinks I love deeply but quietly.' },
    { id: 'a10', statement: 'My partner believes I am still growing into who I want to be.' },
  ],
};

// ─────────────────────────────────────────────────────────────
// Bridge Quotes — one per bridge + mood-pattern insight lines
// ─────────────────────────────────────────────────────────────
export const bridgeQuotes: Record<string, string> = {
  bridge_1to2:
    "The first honest number is always the hardest. You gave yours. That's already something.",
  bridge_2to3:
    "Naming how you feel is an act of love — for yourself and for them.",
  bridge_3to4:
    "You've looked at yourself honestly. Tomorrow, you look at what you've built together.",
  bridge_4to5:
    "Four days of showing up. One more. The last one always means the most.",
};

// ─────────────────────────────────────────────────────────────
// Intention Words — 8 words + metadata
// ─────────────────────────────────────────────────────────────
export interface IntentionWord {
  word: string;
  subtext: string;
}

export const intentionWords: IntentionWord[] = [
  { word: 'Present', subtext: 'I will be here, fully.' },
  { word: 'Gentle', subtext: 'I will soften where I can.' },
  { word: 'Curious', subtext: 'I will ask before assuming.' },
  { word: 'Open', subtext: 'I will let them in.' },
  { word: 'Patient', subtext: 'I will wait for the right moment.' },
  { word: 'Brave', subtext: 'I will say the hard thing.' },
  { word: 'Grateful', subtext: 'I will notice what I have.' },
  { word: 'Playful', subtext: 'I will not take this too seriously.' },
];

// ─────────────────────────────────────────────────────────────
// Badges — 8 badges with axis keys, descriptions, trait pills
// ─────────────────────────────────────────────────────────────
export interface Badge {
  id: string;
  name: string;
  description: string;
  traitPills: string[];
  axisA: 'expressive' | 'active';
  axisB: 'deep' | 'present';
  axisC: 'protecting' | 'building';
}

export const badges: Badge[] = [
  {
    id: 'warm_keeper',
    name: 'The Warm Keeper',
    description: "You hold the relationship with both hands. Steady, expressive, and deeply protective of what you've built.",
    traitPills: ['Emotionally present', 'Protective', 'Expressive'],
    axisA: 'expressive', axisB: 'deep', axisC: 'protecting',
  },
  {
    id: 'honest_architect',
    name: 'The Honest Architect',
    description: "You build with intention. Every word, every gesture — you're constructing something that lasts.",
    traitPills: ['Intentional', 'Expressive', 'Growth-focused'],
    axisA: 'expressive', axisB: 'deep', axisC: 'building',
  },
  {
    id: 'joyful_anchor',
    name: 'The Joyful Anchor',
    description: "You bring lightness and stability in equal measure. Your partner feels safe and alive around you.",
    traitPills: ['Grounding', 'Playful', 'Protective'],
    axisA: 'active', axisB: 'present', axisC: 'protecting',
  },
  {
    id: 'curious_lover',
    name: 'The Curious Lover',
    description: "You're always learning them. Always growing. The relationship is a living thing you tend with care.",
    traitPills: ['Curious', 'Present', 'Growth-focused'],
    axisA: 'active', axisB: 'present', axisC: 'building',
  },
  {
    id: 'quiet_strength',
    name: 'The Quiet Strength',
    description: "Still on the surface. Worlds deep underneath. Your love is a force that doesn't need to announce itself.",
    traitPills: ['Deeply loyal', 'Protective', 'Inward strength'],
    axisA: 'active', axisB: 'deep', axisC: 'protecting',
  },
  {
    id: 'steady_climber',
    name: 'The Steady Climber',
    description: "You grow quietly but consistently. Every day you show up, you're building something neither of you can fully see yet.",
    traitPills: ['Consistent', 'Growth-focused', 'Resilient'],
    axisA: 'active', axisB: 'deep', axisC: 'building',
  },
  {
    id: 'spark_keeper',
    name: 'The Spark Keeper',
    description: "You keep the fire alive. Present, expressive, and always finding ways to remind them why this matters.",
    traitPills: ['Energetic', 'Present', 'Expressive'],
    axisA: 'expressive', axisB: 'present', axisC: 'protecting',
  },
  {
    id: 'intentional_partner',
    name: 'The Intentional Partner',
    description: "You showed up every day with purpose. That's not nothing. That's everything.",
    traitPills: ['Dedicated', 'Balanced', 'Intentional'],
    axisA: 'expressive', axisB: 'present', axisC: 'building',
  },
];

// ─────────────────────────────────────────────────────────────
// Trivia Facts — 4 personality-keyed psychology facts
// ─────────────────────────────────────────────────────────────
export const triviaFacts: Record<string, string> = {
  steady_flame:
    "Research shows that consistent, predictable partners create the strongest attachment bonds. Reliability is not boring — it is the foundation of deep trust.",
  electric_spark:
    "Studies find that couples who regularly try new experiences together show higher relationship satisfaction. Your instinct to keep things alive is scientifically sound.",
  deep_current:
    `Psychologists call it "quiet devotion" — the kind of love that doesn't need an audience. Research shows it's one of the most durable forms of attachment.`,
  shifting_tide:
    "Emotional flexibility — the ability to feel and adapt — is linked to higher empathy and deeper intimacy. Your range is a relationship superpower.",
};

// ─────────────────────────────────────────────────────────────
// Daily Two Questions — Day 4
// ─────────────────────────────────────────────────────────────
export const dailyTwoQuestions: [string, string][] = [
  [
    'What emotion are you carrying into today?',
    "What's something your relationship taught you this week?",
  ],
  [
    "What's a worry you've been carrying alone lately?",
    'What do you wish the two of you did more of?',
  ],
  [
    'What made you choose this person?',
    "What's one small ritual you could start with them?",
  ],
];
