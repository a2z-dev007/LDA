import { PersonalityTypeId } from '../data/personalityTypes';

// ─────────────────────────────────────────────────────────────
// Letter Generator — PRD §6.6 D5_TheLetter
// Template-generated personal letter using:
// user name, D1 slider score, personality type name, and memory/certainty fallbacks.
// ─────────────────────────────────────────────────────────────

const personalityNames: Record<PersonalityTypeId, string> = {
  steady_flame: 'The Steady Flame',
  electric_spark: 'The Electric Spark',
  deep_current: 'The Deep Current',
  shifting_tide: 'The Shifting Tide',
};

const templates = [
  (name: string, score: number, typeName: string, memoryOpener: string) =>
    `${name}.\n\nYou started this week at a ${score}.\n\nYou didn't know what you'd find — but you showed up anyway.\n\nThe ${typeName} in you knew something worth protecting was here.\n\n${memoryOpener}\n\nThat's the memory you chose to keep. That's enough. That's everything.`,

  (name: string, score: number, typeName: string, memoryOpener: string) =>
    `${name}.\n\nYou gave yourself a score of ${score} on Day 1.\n\nYou started with that simple, honest baseline — and you kept showing up day after day.\n\nYour inner ${typeName} showed that there is something deep here worth guarding.\n\n${memoryOpener}\n\nThat's the memory you held onto. That's enough. That's everything.`,
];

export function generateLetter(
  userName: string,
  sliderScore: number,
  personalityType: PersonalityTypeId,
  memoryContent: string | null,
  day3Certainty: string | null
): string {
  const typeName = personalityNames[personalityType] ?? 'Steady Flame';
  const name = userName || 'you';
  
  let memoryOpener = '';
  if (memoryContent && memoryContent.trim()) {
    const words = memoryContent.trim().split(/\s+/);
    memoryOpener = `"${words.slice(0, 8).join(' ')}${words.length > 8 ? '...' : ''}"`;
  } else if (day3Certainty && day3Certainty.trim()) {
    memoryOpener = `"${day3Certainty.trim()}"`;
  } else {
    memoryOpener = '"You came back, five days in a row. That\'s the memory worth keeping."';
  }

  // Consistent template selection per user/score to prevent letter change on re-render
  const strForHash = `${name}_${sliderScore}_${personalityType}`;
  let hash = 0;
  for (let i = 0; i < strForHash.length; i++) {
    hash = strForHash.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % templates.length;
  const template = templates[index];

  return template(name, sliderScore, typeName, memoryOpener);
}
