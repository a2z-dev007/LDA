// ─────────────────────────────────────────────────────────────
// Tone Reframer — PRD §6.5 D4_DropBox
// Rule-based reframing of raw feelings into constructive language
// Original text is NEVER stored — only the reframe
// ─────────────────────────────────────────────────────────────

const reframePatterns: Array<{ pattern: RegExp; reframe: (match: string) => string }> = [
  {
    pattern: /i hate (when|that|how)/i,
    reframe: () => "It's hard for me when",
  },
  {
    pattern: /you never/i,
    reframe: () => "I'd love it if you could",
  },
  {
    pattern: /you always/i,
    reframe: () => "Sometimes I notice that",
  },
  {
    pattern: /i can't (stand|take|deal)/i,
    reframe: () => "I find it really difficult when",
  },
  {
    pattern: /why (don't|won't|can't) you/i,
    reframe: () => "I wonder if we could",
  },
  {
    pattern: /you don't (care|listen|understand)/i,
    reframe: () => "I sometimes feel unseen when",
  },
];

const softeningPrefixes = [
  "Something I've been sitting with: ",
  "What I'm really trying to say is: ",
  "Underneath all of this, I think: ",
  "If I'm being honest with myself: ",
];

export function reframeText(rawText: string): string {
  let reframed = rawText.trim();

  // Apply pattern replacements
  for (const { pattern, reframe } of reframePatterns) {
    reframed = reframed.replace(pattern, reframe(''));
  }

  // If the text changed, return it
  if (reframed !== rawText.trim()) {
    return reframed;
  }

  // Otherwise add a softening prefix
  const prefix = softeningPrefixes[Math.floor(Math.random() * softeningPrefixes.length)];
  const lower = reframed.charAt(0).toLowerCase() + reframed.slice(1);
  return `${prefix}${lower}`;
}

// Simulate async delay for the deliberate loading pause (0.8–1.2s)
export async function reframeTextAsync(rawText: string): Promise<string> {
  const delay = 800 + Math.random() * 400;
  await new Promise<void>((resolve) => setTimeout(resolve, delay));
  return reframeText(rawText);
}
