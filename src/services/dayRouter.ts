import { useDayStore } from '../store/useDayStore';
import { useStreakStore } from '../store/useStreakStore';
import { RootStackParamList } from '../navigation/types';

// ─────────────────────────────────────────────────────────────
// DayRouter — PRD §5
// On every app open, checks completion flags D1→D5
// Routes to the bridge/day of the first incomplete day
// If 48+ hours elapsed, checks streak shield eligibility
// ─────────────────────────────────────────────────────────────

export type RouterTarget = keyof RootStackParamList;

export interface RouterResult {
  screen: RouterTarget;
  shieldApplied: boolean;
}

export function resolveRoute(): RouterResult {
  const { day1, day2, day3, day4, day5 } = useDayStore.getState();
  const { lastActiveDate, shieldAvailable, shieldUsed } = useStreakStore.getState();

  let shieldApplied = false;

  // Check if 48+ hours elapsed since last active
  if (lastActiveDate) {
    const diffHours =
      (new Date().getTime() - new Date(lastActiveDate).getTime()) / (1000 * 60 * 60);

    if (diffHours >= 48 && shieldAvailable && !shieldUsed) {
      useStreakStore.getState().checkAndApplyShield();
      shieldApplied = true;
    }
  }

  // Route to first incomplete day
  if (!day1.complete) return { screen: 'Day1Slider', shieldApplied };
  if (!day2.complete) return { screen: 'Bridge1to2', shieldApplied };
  if (!day3.complete) return { screen: 'Bridge2to3', shieldApplied };
  if (!day4.complete) return { screen: 'Bridge3to4', shieldApplied };
  if (!day5.complete) return { screen: 'Bridge4to5', shieldApplied };

  return { screen: 'Day5PartnerInvite', shieldApplied };
}
