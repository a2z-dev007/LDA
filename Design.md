# Design.md — Let's Date Again (LDA) Design System

## 🎯 Goal

Create a ritualistic, immersive, and emotionally resonant mobile experience for couples. The design must feel private, premium, and "not an app."

---

# 🎨 1. Brand Identity & Palette

LDA uses a curated palette that balances emotional warmth with professional psychology.

## 📁 Source: `src/theme/colors.ts`

```ts
export const colors = {
  // Brand Core
  primary: "#C4517A",      // Deep Rose (Main Accent)
  dark: "#1C1B2E",         // Midnight Navy (Text & Contrast)
  light: "#FAF0F4",        // Soft Blush (Surface/Secondary BG)
  white: "#FFFFFF",
  grey: "#888888",         // Supporting info / Progress off-state

  // Day Accent Colors (Emotional Themes)
  day1: "#FFB347",         // Spark (Warm Orange)
  day2: "#77DD77",         // Mood (Calming Green)
  day3: "#89CFF0",         // Assumptions (Clear Blue)
  day4: "#B19CD9",         // Memory (Nostalgic Lavender)
  day5: "#C4517A",         // Letter (Deep Rose)

  // Feedback
  error: "#EF4444",
  success: "#10B981",
};
```

---

# 🔤 2. Typography

We use typography as a brand voice.

## 📁 Source: `src/theme/typography.ts`

* **Playfair Display (Serif)**: Used for all numbers, headings, and emotional moments.
  * *Italic* is the default for quotes and brand promises.
* **Inter (Sans-Serif)**: Used for body copy, buttons, and utility text for readability.

```ts
export const typography = {
  h1: { fontSize: 32, fontFamily: "PlayfairDisplay-Bold" },
  h2: { fontSize: 26, fontFamily: "PlayfairDisplay-SemiBold" },
  emotional: { fontSize: 20, fontFamily: "PlayfairDisplay-Italic" },
  body: { fontSize: 16, fontFamily: "Inter-Regular" },
  button: { fontSize: 18, fontFamily: "Inter-SemiBold", letterSpacing: 0.5 },
};
```

---

# 🧱 3. Atomic Design System

## 🔹 Atoms
* **MoodPill**: Small tags like "Spicy" or "Self-aware".
* **ProgressPip**: A single dot/dash in the progress strip.
* **HapticButton**: All buttons must trigger haptics on press.

## 🔹 Molecules
* **ProgressStrip**: 5-pip strip with distinct active states for Days 1–5.
* **StreakRing**: Circular progress tracker for the daily streak.
* **ChoiceCard**: A/B selection cards with 120ms auto-advance.

## 🔹 Organisms (Immersive Flow)
* **ConnectionSlider**: Large-scale dragging interaction.
* **CandleMoodPicker**: Animated SVG candle that responds to mood selection.
* **MemoryJar**: Visual container for shared memories.

---

# 🪄 4. Interaction Principles

1. **No Nav Bars**: Screens are full-bleed. Headers are minimalist overlays or absent.
2. **Auto-Advance**: Quizzes should auto-advance after selection to minimize taps.
3. **Number Continuity**: Large numbers (like the connection score) should transition smoothly between screens.
4. **Haptic Hierarchy**:
   - *Selection*: Light haptic.
   - *Success/Complete*: Success haptic.
   - *Integer Step (Slider)*: Light haptic on every step.

---

# 📱 5. Navigation Logic

The app is **linear**. There is no "Back" button in the main flow once a choice is committed. The user is on a 5-day journey forward.

| State | Navigation Component |
|-------|----------------------|
| New | OnboardingNavigator |
| Active Bridge | BridgeScreen (recap/re-center) |
| Active Day | DayNavigator (sub-flow per day) |
| 5-Day Story | ReportNavigator (export/share) |

---

# 🔥 Final Goal

A mobile ritual that feels:
* **Private** 🔒 (Solo focus)
* **Warm** 🕯️ (Candle-lit aesthetics)
* **Premium** 💎 (Playfair typography)
* **Guided** 🗺️ (Linear progress)
