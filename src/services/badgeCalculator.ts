import { Day1Data, Day2Data, Day3Data, Day4Data } from '../store/useDayStore';
import { Badge } from '../data/quizData';
import { Day5Scoring } from './scoring/day5Scoring';

type AxisAResult = 'expressive' | 'active';
type AxisBResult = 'deep' | 'present';
type AxisCResult = 'protecting' | 'building';

export interface BadgeResult {
  badge: Badge;
  tier: 'gold' | 'standard' | 'emerging';
  dedicationScore: number;
  axisA: AxisAResult;
  axisB: AxisBResult;
  axisC: AxisCResult;
}

/**
 * Legacy Badge Calculator Wrapper — PRD §7.2
 * Refactored to delegate calculations directly to the high-fidelity Day5Scoring consolidation engine.
 * Maintains complete backwards-compatibility with the existing Day 5 screens.
 */
export function calculateBadge(
  day1: Day1Data,
  day2: Day2Data,
  day3: Day3Data,
  day4: Day4Data,
  dedicationScore?: number // Unused now, as we calculate the high-fidelity dedication score internally
): BadgeResult {
  // Delegate to our new Day5 consolidated scoring engine
  // Pass null for promise during early celebration reveals; is recalculated and stored during Promise submission
  const consolidated = Day5Scoring.consolidate(day1, day2, day3, day4, null);

  return {
    badge: consolidated.badge,
    tier: consolidated.badgeTier,
    dedicationScore: consolidated.dedicationScore,
    axisA: consolidated.axes.axisA,
    axisB: consolidated.axes.axisB,
    axisC: consolidated.axes.axisC,
  };
}
