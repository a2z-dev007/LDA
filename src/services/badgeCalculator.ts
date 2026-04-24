import { Day1Data, Day2Data, Day3Data, Day4Data } from '../store/useDayStore';
import { badges, Badge } from '../data/quizData';

// ─────────────────────────────────────────────────────────────
// Badge Calculator — PRD §7.2
// Three axes each independently resolve to one of two values,
// then mapped to one of 8 badges.
// ─────────────────────────────────────────────────────────────

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

export function calculateBadge(
  day1: Day1Data,
  day2: Day2Data,
  day3: Day3Data,
  day4: Day4Data,
  dedicationScore: number
): BadgeResult {
  const answers = day1.quizAnswers;

  // ── Axis A: Expressive vs Active ──────────────────────────
  let expressiveScore = 0;
  let activeScore = 0;

  if (answers['q1'] === 'A') expressiveScore++;
  if (answers['q6'] === 'A') expressiveScore++;
  if (day2.followUpLength >= 60) expressiveScore++;
  if (day4.daily2Q1.length >= 40 && day4.daily2Q2.length >= 40) expressiveScore++;
  if (day4.memoryType === 'text') expressiveScore++;

  if (answers['q1'] === 'B') activeScore++;
  if (answers['q6'] === 'B') activeScore++;
  if (day4.memoryType === 'photo') activeScore += 2;
  if (day2.mood === 'playful' || day2.mood === 'connected') activeScore++;

  let axisA: AxisAResult;
  if (expressiveScore > activeScore) axisA = 'expressive';
  else if (activeScore > expressiveScore) axisA = 'active';
  else axisA = answers['q1'] === 'A' ? 'expressive' : 'active'; // tiebreak

  // ── Axis B: Deep vs Present ───────────────────────────────
  let deepScore = 0;
  let presentScore = 0;

  if (answers['q4'] === 'B') deepScore++;
  if (answers['q7'] === 'B') deepScore++;
  if (day2.mood === 'loved' || day2.mood === 'grateful' || day2.mood === 'missed') deepScore++;
  if (day3.trueRatio >= 0.7) deepScore += 2;
  if (day4.dropBoxUsed) deepScore += 2;

  if (answers['q4'] === 'A') presentScore++;
  if (answers['q7'] === 'A') presentScore++;
  if (day2.mood === 'connected' || day2.mood === 'playful' || day2.mood === 'overwhelmed') presentScore++;
  if (day3.trueRatio <= 0.4) presentScore += 2;

  let axisB: AxisBResult;
  if (deepScore > presentScore) axisB = 'deep';
  else if (presentScore > deepScore) axisB = 'present';
  else axisB = answers['q7'] === 'B' ? 'deep' : 'present'; // tiebreak

  // ── Axis C: Protecting vs Building ───────────────────────
  let protectingScore = 0;
  let buildingScore = 0;

  if (day1.sliderScore >= 6) protectingScore++;
  if (answers['q5'] === 'B') protectingScore++;
  if (answers['q6'] === 'A') protectingScore++;
  if (day3.trueRatio >= 0.7) protectingScore++;
  if (day2.mood === 'grateful' || day2.mood === 'loved') protectingScore++;

  if (day1.sliderScore <= 5) buildingScore++;
  if (answers['q5'] === 'A') buildingScore++;
  if (answers['q7'] === 'A') buildingScore++;
  if (day4.dropBoxUsed) buildingScore++;
  if (day2.mood === 'frustrated' || day2.mood === 'distant' || day2.mood === 'overwhelmed') buildingScore++;

  let axisC: AxisCResult;
  if (protectingScore > buildingScore) axisC = 'protecting';
  else if (buildingScore > protectingScore) axisC = 'building';
  else axisC = day1.sliderScore >= 6 ? 'protecting' : 'building'; // tiebreak

  // ── Badge Mapping ─────────────────────────────────────────
  const badge = findBadge(axisA, axisB, axisC);

  // ── Tier ──────────────────────────────────────────────────
  let tier: 'gold' | 'standard' | 'emerging';
  if (dedicationScore >= 6) tier = 'gold';
  else if (dedicationScore >= 4) tier = 'standard';
  else tier = 'emerging';

  return { badge, tier, dedicationScore, axisA, axisB, axisC };
}

function findBadge(axisA: AxisAResult, axisB: AxisBResult, axisC: AxisCResult): Badge {
  const match = badges.find(
    (b) => b.axisA === axisA && b.axisB === axisB && b.axisC === axisC
  );
  // Fallback to intentional_partner
  return match ?? badges.find((b) => b.id === 'intentional_partner')!;
}
