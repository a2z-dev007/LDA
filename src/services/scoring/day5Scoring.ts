import { Day1Data, Day2Data, Day3Data, Day4Data, Day5Data } from '../../store/useDayStore';
import { Badge, badges } from '../../data/quizData';
import { Day1Scoring } from './day1Scoring';
import { Day2Scoring } from './day2Scoring';
import { Day3Scoring } from './day3Scoring';
import { Day4Scoring } from './day4Scoring';

/**
 * Interface representing the complete consolidated scoring report for the user.
 */
export interface ConsolidatedScoringResult {
  connectionScore: number;       // Capped strictly at 100
  dedicationScore: number;       // Capped strictly at 7.0
  badge: Badge;                  // Matched relationship archetype badge
  badgeTier: 'gold' | 'standard' | 'emerging';
  partnerKnowledgeScore: number; // T/F score out of 10
  breakdown: {
    d1Slider: number;
    d1Vibe: number;
    d2Mood: number;
    d3MoodBoard: number;
    d3Mirror: number;
    dedicationContribution: number;
    trendBonus: number;
  };
  axes: {
    axisA: 'expressive' | 'active';
    axisB: 'deep' | 'present';
    axisC: 'protecting' | 'building';
    signals: {
      expressive: number;
      active: number;
      deep: number;
      present: number;
      protecting: number;
      building: number;
    };
  };
}

/**
 * Day 5 Master Scoring & Consolidation Engine
 * Integrates results from all 5 days to compute final metrics.
 */
export const Day5Scoring = {
  /**
   * Calculates the final Consolidated Scoring Report.
   * Runs atomically to prevent sync lag between state and badge display.
   * 
   * @param day1 Day 1 store data
   * @param day2 Day 2 store data
   * @param day3 Day 3 store data
   * @param day4 Day 4 store data
   * @param promise Day 5 Promise string
   * @returns ConsolidatedScoringResult containing the definitive app scoring metrics.
   */
  consolidate: (
    day1: Day1Data,
    day2: Day2Data,
    day3: Day3Data,
    day4: Day4Data,
    promise: string | null
  ): ConsolidatedScoringResult => {
    // ─────────────────────────────────────────────────────────────
    // 1. Calculate Daily Scores
    // ─────────────────────────────────────────────────────────────
    const d1Scoring = Day1Scoring.calculate(day1);
    const d2Scoring = Day2Scoring.calculate(day2);
    const d3Scoring = Day3Scoring.calculate(day3);
    const d4Scoring = Day4Scoring.calculate(day4, day1.sliderScore);

    // ─────────────────────────────────────────────────────────────
    // 2. Dedication Score Calculation (/7.0) (PRD §5.4)
    // ─────────────────────────────────────────────────────────────
    let rawDedication = 0;
    
    // Day 1: complete = +1.0
    rawDedication += d1Scoring.dedicationPointsEarned;
    // Day 2: complete = +1.0
    rawDedication += d2Scoring.dedicationPointsEarned;
    // Day 3: appreciation (+0.5), FMS (+0.5), mood board (+0.5), certainty (+0.5) = Max +2.0
    rawDedication += d3Scoring.dedicationPointsEarned;
    // Day 4: jar (+1.0), compliment (+0.5), shuffle (+0.5), daily 2 (+0.25 to +0.5), love drop (+0.5), drop box (+0.5) = Max +3.5
    rawDedication += d4Scoring.dedicationPointsEarned;
    // Day 5: complete (Promise answered) = +1.0
    if (promise && promise.trim().length > 0) {
      rawDedication += 1.0;
    }

    // Streak Bonus: If the user completed all days 1-4, they never skipped. Streak = +1.0
    const noSkipStreak = (day1.complete && day2.complete && day3.complete && day4.complete);
    if (noSkipStreak) {
      rawDedication += 1.0;
    }

    // Strictly capped at 7.0
    const finalDedicationScore = Number(Math.min(7.0, rawDedication).toFixed(2));

    // Determine Badge Tier Ring
    let badgeTier: 'gold' | 'standard' | 'emerging' = 'emerging';
    if (finalDedicationScore >= 6.0) {
      badgeTier = 'gold';
    } else if (finalDedicationScore >= 4.0) {
      badgeTier = 'standard';
    }

    // ─────────────────────────────────────────────────────────────
    // 3. Tally Personality Axes Signals (PRD §7.2)
    // ─────────────────────────────────────────────────────────────
    const expressiveSignals = d1Scoring.axisASignals.expressive + d2Scoring.axisASignals.expressive + d3Scoring.axisASignals.expressive + d4Scoring.axisASignals.expressive;
    const activeSignals = d1Scoring.axisASignals.active + d2Scoring.axisASignals.active + d3Scoring.axisASignals.active + d4Scoring.axisASignals.active;
    
    const deepSignals = d1Scoring.axisBSignals.deep + d2Scoring.axisBSignals.deep + d3Scoring.axisBSignals.deep + d4Scoring.axisBSignals.deep;
    const presentSignals = d1Scoring.axisBSignals.present + d2Scoring.axisBSignals.present + d3Scoring.axisBSignals.present + d4Scoring.axisBSignals.present;
    
    const protectingSignals = d1Scoring.axisCSignals.protecting + d2Scoring.axisCSignals.protecting + d3Scoring.axisCSignals.protecting + d4Scoring.axisCSignals.protecting;
    const buildingSignals = d1Scoring.axisCSignals.building + d2Scoring.axisCSignals.building + d3Scoring.axisCSignals.building + d4Scoring.axisCSignals.building;

    // ── Axis A Resolution (Expressive vs Active) ──
    let finalAxisA: 'expressive' | 'active';
    if (expressiveSignals > activeSignals) {
      finalAxisA = 'expressive';
    } else if (activeSignals > expressiveSignals) {
      finalAxisA = 'active';
    } else {
      // Tiebreak A: Spark Quiz Q1 response
      if (day1.quizAnswers && day1.quizAnswers['q1'] === 'A') {
        finalAxisA = 'expressive';
      } else {
        finalAxisA = 'active'; // Q1-B or default fallback
      }
    }

    // ── Axis B Resolution (Deep vs Present) ──
    let finalAxisB: 'deep' | 'present';
    if (deepSignals > presentSignals) {
      finalAxisB = 'deep';
    } else if (presentSignals > deepSignals) {
      finalAxisB = 'present';
    } else {
      // Tiebreak B: Spark Quiz Q7 response
      if (day1.quizAnswers && day1.quizAnswers['q7'] === 'B') {
        finalAxisB = 'deep';
      } else {
        finalAxisB = 'present'; // Q7-A or default fallback
      }
    }

    // ── Axis C Resolution (Protecting vs Building) ──
    let finalAxisC: 'protecting' | 'building';
    if (protectingSignals > buildingSignals) {
      finalAxisC = 'protecting';
    } else if (buildingSignals > protectingSignals) {
      finalAxisC = 'building';
    } else {
      // Tiebreak C: Baseline Slider Score >= 6 = Protecting, <= 5 = Building
      if (day1.sliderScore >= 6) {
        finalAxisC = 'protecting';
      } else {
        finalAxisC = 'building';
      }
    }

    // ── Archetype Badge Mapping ──
    const matchedBadge = badges.find(
      (b: Badge) => b.axisA === finalAxisA && b.axisB === finalAxisB && b.axisC === finalAxisC
    ) || badges.find((b: Badge) => b.id === 'intentional_partner')!; // Default fallback archetype

    // ─────────────────────────────────────────────────────────────
    // 4. Connection Score Calculation (/100) (PRD §5.1 & §5.2)
    // ─────────────────────────────────────────────────────────────
    
    // Component A: Slider Points (Max 20)
    const d1SliderContribution = d1Scoring.connectionScoreContribution - (day1.vibe_d1_category ? (day1.vibe_d1_category === 'positive' ? 10 : day1.vibe_d1_category === 'tender' ? 7 : 3) : 0);
    const d1SliderCapped = Math.min(20, d1SliderContribution);

    // Component B: Vibe Check (Max 10)
    let d1VibeCapped = 0;
    if (day1.vibe_d1_category === 'positive') d1VibeCapped = 10;
    else if (day1.vibe_d1_category === 'tender') d1VibeCapped = 7;
    else if (day1.vibe_d1_category === 'heavy') d1VibeCapped = 3;

    // Component C: Mood Candle (Max 10)
    const d2MoodCapped = d2Scoring.connectionScoreContribution;

    // Component D: Mood Board warm ratio (Max 10)
    const selectedTiles = day3.d3_mood_board || [];
    let warmCount = 0;
    selectedTiles.forEach((tileId: string) => {
      const tags = Day3Scoring.MOOD_BOARD_TAGS[tileId];
      if (tags && tags.isWarm) warmCount++;
    });
    const d3MoodBoardCapped = selectedTiles.length > 0 ? Math.min(10, (warmCount / 3) * 10) : 0;

    // Component E: Mirror Game TRUE count (Max 10)
    const mirrorAnswers = day3.mirrorAnswers || {};
    const d3MirrorCapped = Object.values(mirrorAnswers).filter(val => val === true).length;

    // Component F: Dedication contribution (Dedication Score ÷ 7 × 30) (Max 30)
    const dedicationContribution = Math.min(30, (finalDedicationScore / 7) * 30);

    // Component G: Trend Bonus (Max 10)
    const d4TrendBonus = d4Scoring.trendBonusEarned;

    // Aggregate Connection Score
    const totalConnectionScore = d1SliderCapped + d1VibeCapped + d2MoodCapped + d3MoodBoardCapped + d3MirrorCapped + dedicationContribution + d4TrendBonus;
    const finalConnectionScore = Math.min(100, Math.round(totalConnectionScore));

    // ─────────────────────────────────────────────────────────────
    // 5. Partner Knowledge Score (/10)
    // ─────────────────────────────────────────────────────────────
    // Standalone Display score. Based on TRUE answers count of Mirror Game
    const finalPartnerKnowledgeScore = d3MirrorCapped;

    return {
      connectionScore: finalConnectionScore,
      dedicationScore: finalDedicationScore,
      badge: matchedBadge,
      badgeTier,
      partnerKnowledgeScore: finalPartnerKnowledgeScore,
      breakdown: {
        d1Slider: d1SliderCapped,
        d1Vibe: d1VibeCapped,
        d2Mood: d2MoodCapped,
        d3MoodBoard: d3MoodBoardCapped,
        d3Mirror: d3MirrorCapped,
        dedicationContribution,
        trendBonus: d4TrendBonus,
      },
      axes: {
        axisA: finalAxisA,
        axisB: finalAxisB,
        axisC: finalAxisC,
        signals: {
          expressive: expressiveSignals,
          active: activeSignals,
          deep: deepSignals,
          present: presentSignals,
          protecting: protectingSignals,
          building: buildingSignals,
        },
      },
    };
  },
};
