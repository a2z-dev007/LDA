import { PersonalityTypeId } from '../data/personalityTypes';

// ─────────────────────────────────────────────────────────────
// Letter Generator — PRD §6.6 D5_TheLetter
// Template-generated personal letter using:
// user name, D1 slider score, personality type name, first 8 words of D4 memory
// ─────────────────────────────────────────────────────────────

const personalityNames: Record<PersonalityTypeId, string> = {
  steady_flame: 'The Steady Flame',
  electric_spark: 'The Electric Spark',
  deep_current: 'The Deep Current',
  shifting_tide: 'The Shifting Tide',
};

const templates = [
  (name: string, score: number, typeName: string, memoryOpener: string) =>
    `Dear ${name},\n\nFive days ago, I sat with a number — ${score} out of 10. That number was honest. Maybe more honest than I'd been in a while.\n\nI've been thinking about what it means to be ${typeName} in this relationship. It means I love in a particular way. Not always loudly. Not always perfectly. But consistently mine.\n\nI keep coming back to this: ${memoryOpener}...\n\nThat moment matters. You matter. And I wanted to write that down somewhere real.\n\nI'm not done growing. But I'm glad I'm growing with you.\n\nWith love,\nMe`,

  (name: string, score: number, typeName: string, memoryOpener: string) =>
    `To ${name},\n\nI started this week at a ${score}. I'm ending it somewhere different — not because everything changed, but because I looked more carefully.\n\nBeing ${typeName} means I carry things quietly sometimes. But this week I tried to carry them out loud, even just for myself.\n\nSomething I keep returning to: ${memoryOpener}...\n\nThat's the kind of thing I don't want to forget. So I wrote it down. For you. For us.\n\nAlways,\nMe`,
];

export function generateLetter(
  userName: string,
  sliderScore: number,
  personalityType: PersonalityTypeId,
  memoryContent: string | null
): string {
  const typeName = personalityNames[personalityType] ?? 'someone who loves deeply';
  const memoryOpener = memoryContent
    ? memoryContent.split(' ').slice(0, 8).join(' ')
    : 'the small moments that make this real';

  const template = templates[Math.floor(Math.random() * templates.length)];
  return template(userName || 'you', sliderScore, typeName, memoryOpener);
}
