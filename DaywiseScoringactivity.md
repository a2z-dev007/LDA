# Day-by-Day Scoring Activities & Jar Animation Map

This document outlines all screens in the 5-day journey where a scoring activity is completed, details how each activity contributes to scoring and badge calculations, and tracks how the animated jar is displayed and incremented (by +1) upon completion.

---

## Jar Animation Mechanics

The app uses two key components for the jar experience:
1. **[JarEnvelopeAnimation.tsx](file:///e:/LDA/src/components/common/JarEnvelopeAnimation.tsx)**: A floating, glowing glass jar component that displays a count of completed activities. It features a premium animation where an envelope flies in, the lid opens, the envelope drops in, sparkles burst, and the count increments by 1.
2. **[DayEndJarModal.tsx](file:///e:/LDA/src/components/common/DayEndJarModal.tsx)**: A modal triggered at the end of Day 1 and Day 5 that wraps the `JarEnvelopeAnimation` in a premium dark-overlay card for the final daily transition.

---

## Scoring Activities & Jar Increment Map

| Day / Bridge | Completed Activity | Scoring Impact | Completion Screen | File Link | Jar Animation Type | Jar Count Increment |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Day 1** | **Connection Slider** | • Up to 20 pts (Connection Score)<br>• Axis C (Protecting vs Building) | **Honest Moment Screen** | [Day1HonestMoment.tsx](file:///e:/LDA/src/screens/day1/Day1HonestMoment.tsx) | `JarEnvelopeAnimation` (On Mount) | **0 → 1** |
| **Day 1** | **Spark Quiz (7 Questions)** | • personality type determination<br>• Axis A, B, & C badge signals | **Personality Result Screen** | [Day1ResultScreen.tsx](file:///e:/LDA/src/screens/day1/Day1ResultScreen.tsx) | `JarEnvelopeAnimation` (On Mount) | **1 → 2** |
| **Day 1** | **Vibe Check** | • Up to 10 pts (Connection Score)<br>• Axis A & C badge signals | **Vibe Check Screen (End of Day 1)** | [Day1VibeCheck.tsx](file:///e:/LDA/src/screens/day1/Day1VibeCheck.tsx) | `DayEndJarModal` (On Confirm Vibe) | **2 → 3** |
| **Bridge 1→2** | **This or That: Us Edition** | • Axis A & C badge signals | **This or That Results Screen** | [ThisOrThatScreen.tsx](file:///e:/LDA/src/screens/ThisOrThatScreen.tsx) | `JarEnvelopeAnimation` (On Finish) | **3 → 4** |
| **Day 2** | **Candle Mood & One Good Thing & Follow-Up** | • Up to 10 pts (Connection Score)<br>• +1.0 pt (Dedication Score)<br>• Axis A (Follow-up length $\ge 60$ chars = Exp +2) | **Day 2 Result Screen** | [Day2ResultScreen.tsx](file:///e:/LDA/src/screens/day2/Day2ResultScreen.tsx) | `JarEnvelopeAnimation` (On Mount) | **4 → 5** |
| **Day 3** | **Appreciation Snap & Finish My Sentence** | • +0.5 pt (Dedication Score)<br>• Sentence stem card tag feeds all 3 axes | **Mirror Game Results Screen** | [Day3MirrorResults.tsx](file:///e:/LDA/src/screens/day3/Day3MirrorResults.tsx) | `JarEnvelopeAnimation` (On Mount) | **5 → 6** |
| **Day 3** | **Mirror Game (10 T/F)** | • Up to 10 pts (Connection Score)<br>• Axis B & C badge signals | **Mirror Game Results Screen** | [Day3MirrorResults.tsx](file:///e:/LDA/src/screens/day3/Day3MirrorResults.tsx) | `JarEnvelopeAnimation` (On Mount) | *Bundled with D3 results* |
| **Day 3** | **Mood Board Match** | • Up to 10 pts (Connection Score)<br>• +0.5 pt (Dedication Score)<br>• Selected tile tag feeds all 3 axes | **Mood Board Result Screen** | [Day3MoodBoardResult.tsx](file:///e:/LDA/src/screens/day3/Day3MoodBoardResult.tsx) | `JarEnvelopeAnimation` (On Mount) | **6 → 7** |
| **Day 3** | **The One Certainty** | • +0.5 pt (Dedication Score)<br>• Timeline display text | **Day 3 Complete Screen** | [Day3Complete.tsx](file:///e:/LDA/src/screens/day3/Day3Complete.tsx) | `JarEnvelopeAnimation` (On Mount) | **7 → 8** |
| **Day 4** | **The Memory Jar** | • +1.0 pt (Dedication Score)<br>• Memory type signals (Text = Exp +2, Photo = Act +2) | **Memory Jar Input Screen** | [Day4MemoryJar.tsx](file:///e:/LDA/src/screens/day4/Day4MemoryJar.tsx) | `CommonJar` custom envelope drop animation (On Save) | **8 → 9** |
| **Day 4** | **The Tiny Compliment** | • +0.5 pt (Dedication Score) | **Tiny Compliment Screen** | [Day4TinyCompliment.tsx](file:///e:/LDA/src/screens/day4/Day4TinyCompliment.tsx) | `JarEnvelopeAnimation` (On Seal Word) | **9 → 10** |
| **Day 4** | **Priority Shuffle & Daily 2 & Love Drop / Drop Box** | • +0.5 pt (Dedication Score each)<br>• Axis signals (Shuffle = Deep/Present, Drop Box = Deep +2) | **Day 4 Complete Screen** | [Day4Complete.tsx](file:///e:/LDA/src/screens/day4/Day4Complete.tsx) | `JarEnvelopeAnimation` (On Mount) | **10 → 11** |
| **Day 5** | **The Promise** | • +1.0 pt (Dedication Score) | **The Promise Screen** | [Day5ThePromise.tsx](file:///e:/LDA/src/screens/day5/Day5ThePromise.tsx) | `JarEnvelopeAnimation` (On Seal Promise) | **11 → 12** |
| **Day 5** | **Partner Invite** | • Final Solo Day 5 payoff / exit | **Partner Invite Screen** | [Day5PartnerInvite.tsx](file:///e:/LDA/src/screens/day5/Day5PartnerInvite.tsx) | `DayEndJarModal` (On Mount for Jar reveal) | *Final Full Jar Reveal payoff* |

---

## Detailed Screen-by-Screen Specifications

### 1. Day 1: Honest Moment
* **Trigger Screen:** [Day1HonestMoment.tsx](file:///e:/LDA/src/screens/day1/Day1HonestMoment.tsx)
* **Action completed:** Connection Slider baseline score input.
* **Math & Logic:** Slider value $\times$ 2 feeds Connection Score. Slider score $\ge 6$ pushes Axis C to Protecting; $\le 5$ pushes to Building.
* **Jar Behavior:** Shows `JarEnvelopeAnimation` at `0.55` scale in the top right. Triggers an envelope flight animation on mount that increments the count from **0 to 1**.

### 2. Day 1: Spark Quiz & Personality Result
* **Trigger Screen:** [Day1ResultScreen.tsx](file:///e:/LDA/src/screens/day1/Day1ResultScreen.tsx)
* **Action completed:** 7-Question Spark Quiz.
* **Math & Logic:** Combines answers to calculate personality type (Steady Flame, Electric Spark, Deep Current, Shifting Tide) and signals for all 3 axes.
* **Jar Behavior:** Shows `JarEnvelopeAnimation` in the top right. Triggers envelope flight on mount that increments the count from **1 to 2**.

### 3. Day 1: Vibe Check (End of Day 1)
* **Trigger Screen:** [Day1VibeCheck.tsx](file:///e:/LDA/src/screens/day1/Day1VibeCheck.tsx) (via [DayEndJarModal.tsx](file:///e:/LDA/src/components/common/DayEndJarModal.tsx))
* **Action completed:** Selection of emoji mood tile.
* **Math & Logic:** Positive vibe tile adds 10 pts; tender adds 7; heavy adds 3 to Connection Score. Also feeds Axis A & C.
* **Jar Behavior:** When the user hits "Confirm", the `DayEndJarModal` opens. The modal displays a centered `JarEnvelopeAnimation` that runs the flight animation and increments the count from **2 to 3**.

### 4. Bridge 1→2: This or That: Us Edition
* **Trigger Screen:** [ThisOrThatScreen.tsx](file:///e:/LDA/src/screens/ThisOrThatScreen.tsx)
* **Action completed:** Us Edition This or That prediction game.
* **Math & Logic:** Comfort/Home choices shift Axis A to Expressive; Adventure to Active. Predictions matching choices 2+ times shift Axis C to Protecting; otherwise Building.
* **Jar Behavior:** On completing round 3, the results view is animated in. The `JarEnvelopeAnimation` fades in and triggers its envelope flight, incrementing the count from **3 to 4**.

### 5. Day 2: The Mood Room
* **Trigger Screen:** [Day2ResultScreen.tsx](file:///e:/LDA/src/screens/day2/Day2ResultScreen.tsx)
* **Action completed:** Candle Mood Picker, One Good Thing journal entry, and Follow-Up question.
* **Math & Logic:** Connected/Loved/Playful candle adds 10 pts; Grateful/Missed 6 pts; Overwhelmed/Frustrated/Distant 3 pts. Follow-up answers completed adds +1.0 Dedication points. One Good Thing $\ge 40$ chars and Follow-up $\ge 60$ chars add Expressive signals to Axis A.
* **Jar Behavior:** Fades in the `JarEnvelopeAnimation` on mount. Triggers the envelope flight animation which increments the count from **4 to 5**.

### 6. Day 3: Mirror Game (Appreciation & Sentences & T/F)
* **Trigger Screen:** [Day3MirrorResults.tsx](file:///e:/LDA/src/screens/day3/Day3MirrorResults.tsx)
* **Action completed:** Appreciation Snap text, Finish My Sentence selection, and 10 T/F Statements.
* **Math & Logic:** Appreciation Snap (+0.5 Dedication), Sentence Stem (+0.5 Dedication + Axis signals), Mirror Game T/F (TRUE count/10 adds up to 10 pts to Connection Score, $\ge 7$ TRUE shifts Axis B to Deep & Axis C to Protecting, $\le 4$ TRUE shifts Axis B to Present).
* **Jar Behavior:** Fades in `JarEnvelopeAnimation` on mount. Triggers flight animation to increment the count from **5 to 6**.

### 7. Day 3: Mood Board Match
* **Trigger Screen:** [Day3MoodBoardResult.tsx](file:///e:/LDA/src/screens/day3/Day3MoodBoardResult.tsx)
* **Action completed:** Selection of exactly 3 mood tiles.
* **Math & Logic:** Proportion of positive tiles adds up to 10 pts to Connection Score. Tile category majority feeds all 3 axes simultaneously. Completing adds +0.5 Dedication points.
* **Jar Behavior:** Shows `JarEnvelopeAnimation` on mount. Triggers flight animation to increment the count from **6 to 7**.

### 8. Day 3: The One Certainty
* **Trigger Screen:** [Day3Complete.tsx](file:///e:/LDA/src/screens/day3/Day3Complete.tsx)
* **Action completed:** Writing of "one certainty" open text.
* **Math & Logic:** Completing adds +0.5 Dedication points.
* **Jar Behavior:** Shows `JarEnvelopeAnimation` in top right. Triggers flight animation to increment the count from **7 to 8**.

### 9. Day 4: Memory Jar
* **Trigger Screen:** [Day4MemoryJar.tsx](file:///e:/LDA/src/screens/day4/Day4MemoryJar.tsx) (uses [CommonJar.tsx](file:///e:/LDA/src/components/common/CommonJar.tsx))
* **Action completed:** Text, Photo, or Emoji memory dropped.
* **Math & Logic:** Dropping a memory adds +1.0 Dedication points (largest single Day 4 task). Text Memory adds Expressive +2; Photo adds Active +2; Emoji adds Active +1 to Axis A.
* **Jar Behavior:** This screen displays a large `CommonJar` component. Saving triggers a custom flying envelope note animation that drops straight into the jar body, incrementing the count from **8 to 9**.

### 10. Day 4: The Tiny Compliment
* **Trigger Screen:** [Day4TinyCompliment.tsx](file:///e:/LDA/src/screens/day4/Day4TinyCompliment.tsx)
* **Action completed:** Tapping one compliment word.
* **Math & Logic:** Adds +0.5 Dedication points. Word glows inside the jar on Day 5.
* **Jar Behavior:** Shows `JarEnvelopeAnimation` at top right. Tapping "Seal word" triggers the envelope flight, incrementing the count from **9 to 10**.

### 11. Day 4: Priority Shuffle & Daily 2 & Love Drop / Drop Box
* **Trigger Screen:** [Day4Complete.tsx](file:///e:/LDA/src/screens/day4/Day4Complete.tsx)
* **Action completed:** Priority Shuffle, Daily 2 question, and Love Drop or Drop Box.
* **Math & Logic:** Shuffle (+0.5 Dedication, feeds Axis B & C), Daily 2 (+0.5 Dedication), Love Drop / Drop Box (+0.5 Dedication each, feeds Axis A, B, or C).
* **Jar Behavior:** Fades in `JarEnvelopeAnimation` on mount. Triggers envelope flight to increment count from **10 to 11**.

### 12. Day 5: The Promise
* **Trigger Screen:** [Day5ThePromise.tsx](file:///e:/LDA/src/screens/day5/Day5ThePromise.tsx)
* **Action completed:** Writing "one thing you want to do differently" intention text.
* **Math & Logic:** Completing adds +1.0 Dedication points (final opportunity to reach the Gold tier badge).
* **Jar Behavior:** Displays `JarEnvelopeAnimation` at the top. Sealing the promise triggers flight animation, incrementing the count from **11 to 12**.

### 13. Day 5: Partner Invite (End of Day 5)
* **Trigger Screen:** [Day5PartnerInvite.tsx](file:///e:/LDA/src/screens/day5/Day5PartnerInvite.tsx) (via [DayEndJarModal.tsx](file:///e:/LDA/src/components/common/DayEndJarModal.tsx))
* **Action completed:** Day 5 Reveal completed, triggering partner pairing.
* **Math & Logic:** Concluding screen of the solo 5-day cycle. Generates partner invite code.
* **Jar Behavior:** Shows `DayEndJarModal` on screen entrance. Runs a final celebratory payoff animation on the fully loaded jar.
