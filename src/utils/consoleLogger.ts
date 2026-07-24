import { useDayStore } from '../store/useDayStore';
import { useJournalStore } from '../store/useJournalStore';
import { Day5Scoring } from '../services/scoring/day5Scoring';

// Debounce helper to avoid flooding the console during rapid inputs (e.g. dragging sliders)
function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: any = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

export function logDiagnosticData() {
  const dayStore = useDayStore.getState();
  const journalStore = useJournalStore.getState();

  // Run Consolidated Scoring
  let scoring;
  try {
    scoring = Day5Scoring.consolidate(
      dayStore.day1,
      dayStore.day2,
      dayStore.day3,
      dayStore.day4,
      dayStore.day5.promise
    );
  } catch (error) {
    scoring = { error: (error as Error).message };
  }

  const completedCount = dayStore.completedDayCount();
  const nextActiveDay = dayStore.nextDay();

  console.log('\n======================================================================');
  console.log('                 🌟 LDA APP SYSTEM DIAGNOSTICS 🌟                     ');
  console.log('======================================================================');
  
  // 1. DAY PROGRESS SUMMARY
  console.log('\n📅 [PROGRESS SUMMARY]');
  console.log(`- Completed Days: ${completedCount} / 5`);
  console.log(`- Next Active Day: Day ${nextActiveDay}`);
  console.log(`- Streak Bonus Status: ${completedCount >= 4 ? '🔥 Active' : '❄️ Inactive'}`);

  // 2. DETAILED DAYS WISE DATA
  console.log('\n📂 [DAYS WISE DATA]');
  console.log('--- Day 1 (The Vibe & Personality Spark) ---');
  console.log(`  • Status: ${dayStore.day1.complete ? '✅ Completed' : '⏳ Pending'}`);
  console.log(`  • Slider Score: ${dayStore.day1.sliderScore} / 10`);
  console.log(`  • Segment Name: ${dayStore.day1.segment || 'None'}`);
  console.log(`  • Selected Vibe Check: "${dayStore.day1.vibe_d1 || 'None'}" (${dayStore.day1.vibe_d1_category || 'N/A'})`);
  console.log(`  • Personality Type: ${dayStore.day1.personalityType || 'None'}`);
  console.log(`  • Spark Quiz Answers:`, JSON.stringify(dayStore.day1.quizAnswers));

  console.log('\n--- Day 2 (Intention & The Candle) ---');
  console.log(`  • Status: ${dayStore.day2.complete ? '✅ Completed' : '⏳ Pending'}`);
  console.log(`  • Intention Word: "${dayStore.day2.intentionWord || 'None'}"`);
  console.log(`  • Picked Mood: ${dayStore.day2.mood || 'None'} (Score: ${dayStore.day2.moodScore}/10)`);
  console.log(`  • This or That Rounds Count: ${dayStore.day2.b2_tot_rounds.length}`);
  console.log(`  • Follow-up Q/A: Q: "${dayStore.day2.followUpQuestion || 'None'}" | A: "${dayStore.day2.followUpAnswer || 'None'}"`);
  console.log(`  • One Good Thing Note: "${dayStore.day2.oneGoodThing || 'None'}"`);

  console.log('\n--- Day 3 (Appreciation & Mirror Game) ---');
  console.log(`  • Status: ${dayStore.day3.complete ? '✅ Completed' : '⏳ Pending'}`);
  console.log(`  • Intention Word: "${dayStore.day3.intentionWord || 'None'}"`);
  console.log(`  • Appreciation Snap Note: "${dayStore.day3.appreciationSnap || 'None'}"`);
  console.log(`  • First Moment Spark Stem Pick: ${dayStore.day3.d3_fms_pick || 'None'} (Tag: ${dayStore.day3.d3_fms_tag || 'None'})`);
  console.log(`  • Selected Mood Board Tiles:`, JSON.stringify(dayStore.day3.d3_mood_board));
  console.log(`  • Mood Board Theme: "${dayStore.day3.d3_mood_board_theme || 'None'}"`);
  console.log(`  • One Certainty Note: "${dayStore.day3.oneCertainty || 'None'}"`);
  console.log(`  • Mirror Game Answers (True/False):`, JSON.stringify(dayStore.day3.mirrorAnswers));
  console.log(`  • Mirror Game True Ratio: ${(dayStore.day3.trueRatio * 100).toFixed(0)}%`);

  console.log('\n--- Day 4 (Memory Jar & Priority Shuffle) ---');
  console.log(`  • Status: ${dayStore.day4.complete ? '✅ Completed' : '⏳ Pending'}`);
  console.log(`  • Intention Word: "${dayStore.day4.intentionWord || 'None'}"`);
  console.log(`  • Memory Dropped: Type = ${dayStore.day4.memoryType} | Content = "${dayStore.day4.memoryContent || 'None'}"`);
  console.log(`  • Tiny Compliment: "${dayStore.day4.tinyComplimentWord || 'None'}"`);
  console.log(`  • Priority Shuffle Picks:`, JSON.stringify(dayStore.day4.d4_priority_picks));
  console.log(`  • Top Relationship Need: "${dayStore.day4.d4_top_need || 'None'}"`);
  console.log(`  • Daily 2 Questions: Q1: "${dayStore.day4.daily2Q1 || 'None'}" | Q2: "${dayStore.day4.daily2Q2 || 'None'}"`);
  console.log(`  • Drop Box Reframe: Used = ${dayStore.day4.dropBoxUsed} | Text = "${dayStore.day4.dropBoxReframedText || 'None'}"`);
  console.log(`  • Love Drop: Used = ${dayStore.day4.loveDropUsed} | Type = ${dayStore.day4.loveDropType} | Content = "${dayStore.day4.loveDropContent || 'None'}"`);

  console.log('\n--- Day 5 (The Promise & Report Card) ---');
  console.log(`  • Status: ${dayStore.day5.complete ? '✅ Completed' : '⏳ Pending'}`);
  console.log(`  • Promise Answer: "${dayStore.day5.promise || 'None'}"`);
  console.log(`  • Letter Generated: ${dayStore.day5.letterGenerated}`);
  console.log(`  • Badge Awarded: "${dayStore.day5.badgeName || 'None'}" (${dayStore.day5.badgeTier || 'N/A'})`);

  // 3. CONSOLIDATED SCORING ENGINE
  console.log('\n🎯 [SCORING REPORT]');
  if ('error' in scoring) {
    console.log('  ❌ Error calculating scoring:', scoring.error);
  } else {
    console.log(`  • Connection Score: ${scoring.connectionScore} / 100`);
    console.log(`  • Dedication Score: ${scoring.dedicationScore} / 7.0`);
    console.log(`  • Partner Knowledge Score: ${scoring.partnerKnowledgeScore} / 10`);
    console.log(`  • Relationship Badge: "${scoring.badge?.name || 'None'}"`);
    console.log(`  • Badge Tier Ring: ${scoring.badgeTier.toUpperCase()}`);
    console.log(`  • Description: "${scoring.badge?.description || 'N/A'}"`);
    
    console.log('\n  📈 Connection Points Contribution Breakdown:');
    console.log(`    - Day 1 Baseline Slider Contribution (Max 20):   ${scoring.breakdown.d1Slider} pts`);
    console.log(`    - Day 1 Vibe Check Tile Contribution (Max 10):   ${scoring.breakdown.d1Vibe} pts`);
    console.log(`    - Day 2 Mood Candle Contribution (Max 10):       ${scoring.breakdown.d2Mood} pts`);
    console.log(`    - Day 3 Mood Board Warmth Ratio (Max 10):        ${scoring.breakdown.d3MoodBoard} pts`);
    console.log(`    - Day 3 Mirror Game Matches (Max 10):            ${scoring.breakdown.d3Mirror} pts`);
    console.log(`    - Overall Dedication Contribution (Max 30):      ${scoring.breakdown.dedicationContribution.toFixed(2)} pts`);
    console.log(`    - Day 4 Tone/Trend Alignment Bonus (Max 10):     ${scoring.breakdown.trendBonus} pts`);
    console.log(`    ----------------------------------------------------------`);
    console.log(`    = TOTAL SCALED SCORE (Capped strictly at 100):   ${scoring.connectionScore} pts`);

    console.log('\n  🧬 Personality Archetype Axes & Signals:');
    console.log(`    - Axis A (Expressive vs Active): Resolves to '${scoring.axes.axisA.toUpperCase()}'`);
    console.log(`      • Signals: Expressive = ${scoring.axes.signals.expressive} | Active = ${scoring.axes.signals.active}`);
    console.log(`    - Axis B (Deep vs Present): Resolves to '${scoring.axes.axisB.toUpperCase()}'`);
    console.log(`      • Signals: Deep = ${scoring.axes.signals.deep} | Present = ${scoring.axes.signals.present}`);
    console.log(`    - Axis C (Protecting vs Building): Resolves to '${scoring.axes.axisC.toUpperCase()}'`);
    console.log(`      • Signals: Protecting = ${scoring.axes.signals.protecting} | Building = ${scoring.axes.signals.building}`);
  }

  // 4. ANIMATED JAR STATE & MEMORIES
  console.log('\n🫙 [ANIMATED MEMORY JAR STATE]');
  console.log(`  • Jar Fill Level: ${journalStore.jarFillLevel}%`);
  console.log(`  • Total Memory Items in Jar: ${journalStore.jarMemories.length}`);
  
  if (journalStore.jarMemories.length > 0) {
    console.log('  • Memory Notes List:');
    journalStore.jarMemories.forEach((memory, idx) => {
      console.log(`    [#${idx + 1}] ID: ${memory.id}`);
      console.log(`        - Type: ${memory.type}`);
      console.log(`        - Color Theme: ${memory.dayColor || 'N/A'}`);
      console.log(`        - Timestamp: ${memory.createdAt}`);
      if (memory.content) {
        console.log(`        - Content: "${memory.content}"`);
      }
      if (memory.tinyCompliment) {
        console.log(`        - Tiny Compliment Word: "${memory.tinyCompliment}"`);
      }
    });
  } else {
    console.log('  • Memory Notes: (Empty - No notes added to the jar yet)');
  }
  
  console.log('======================================================================\n');
}

const debouncedLogDiagnosticData = debounce(logDiagnosticData, 400);

let isInitialized = false;

export function initializeConsoleLogger() {
  if (isInitialized) return;
  isInitialized = true;

  // Initial log on start
  logDiagnosticData();

  // Listen for updates on the day store
  useDayStore.subscribe(() => {
    debouncedLogDiagnosticData();
  });

  // Listen for updates on the journal/jar store
  useJournalStore.subscribe(() => {
    debouncedLogDiagnosticData();
  });
}
