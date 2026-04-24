export type RootStackParamList = {
  // ── Onboarding ───────────────────────────────────
  Splash: undefined;
  Commitment: undefined;
  NameKeeper: undefined;

  // ── Main Hub ─────────────────────────────────────
  Home: undefined;

  // ── Day 1 ────────────────────────────────────────
  Day1Slider: undefined;
  Day1HonestMoment: { sliderScore: number };
  Day1Quiz: { sliderScore: number };
  Day1Result: undefined;

  // ── Bridge 1→2 ───────────────────────────────────
  Bridge1to2: undefined;

  // ── Day 2 ────────────────────────────────────────
  Day2MoodPicker: undefined;
  Day2MoodFollowUp: undefined;

  // ── Bridge 2→3 ───────────────────────────────────
  Bridge2to3: undefined;

  // ── Day 3 ────────────────────────────────────────
  Day3AppreciationSnap: undefined;
  Day3AssumptionsTest: undefined;
  Day3OneCertainty: undefined;
  Day3MirrorResults: undefined;

  // ── Bridge 3→4 ───────────────────────────────────
  Bridge3to4: undefined;

  // ── Day 4 ────────────────────────────────────────
  Day4MemoryJar: undefined;
  Day4TinyCompliment: undefined;
  Day4DailyTwo: undefined;
  Day4TriviaFact: undefined;
  Day4DropBox: undefined;

  // ── Bridge 4→5 ───────────────────────────────────
  Bridge4to5: undefined;

  // ── Day 5 ────────────────────────────────────────
  Day5Celebration: undefined;
  Day5ReportCard: undefined;
  Day5ThePromise: undefined;
  Day5JarReveal: undefined;
  Day5TheLetter: undefined;
  Day5PartnerInvite: undefined;
};
