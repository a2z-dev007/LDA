# LDA — 5-Day Solo Flow + All 8 Games Integrated

**Development Reference v2.0** | Solo MVP | Games 01–08 Mapped | Day 5 Scoring Algorithm Complete

---

## 📋 Master Overview

Games 01–04 (from the first set) and 05–08 (tap-select set) distributed across 5 days. Games 01 & 03 require both partners active simultaneously — held for Couple Mode. All others adapted for Solo MVP.

### Day-by-Day Game Distribution

- **Day 1**: Connection Slider, G05 Vibe Check, Spark Quiz (7Q), Personality Type
- **Bridge 1→2**: G06 This or That (x3), Intention Word
- **Day 2**: Candle Mood, Follow-up Q
- **Day 3**: Appreciation Snap, G02 Finish My Sentence, Mirror 10 T/F, G07 Mood Board Match, One Certainty
- **Day 4**: Memory Jar, Tiny Compliment, G08 Priority Shuffle, Daily 2, G04 Love Drop
- **Day 5**: Badge + Report, 5-Day Story, Memory Jar Reveal, G01/G03 Previewed, Partner Invite

---

## 📊 Master Data Variables — Full List

| Variable                     | Source          | Type                      | Day 5 Use                                          |
| :--------------------------- | :-------------- | :------------------------ | :------------------------------------------------- |
| `baseline_connection_score`  | D1 Slider       | Int 1–10                  | Connection Score base, Mood chart D1 bar           |
| `vibe_d1`                    | G05 Day 1       | String (8 options)        | Emotional Weather, Badge Axes A+C                  |
| `d1_personality_type`        | D1 Quiz         | Enum (4 types)            | Type deep dive section                             |
| `d1_q[1-7]_answer`           | D1 Quiz         | Enum A/B ×7               | Badge axis calculations                            |
| `b2_tot_rounds[1-3]`         | G06 Bridge B1→2 | Object {my_pick, my_pred} | This or That section (revealed when partner joins) |
| `d2_intention_word`          | Bridge B1→2     | String (8 opts)           | Week timeline pill                                 |
| `d2_mood`                    | D2 Candle       | Enum (8 moods)            | Mood chart D2 bar, Badge Axes                      |
| `d2_mood_score`              | D2 Candle       | Int 3–9                   | Connection Score component                         |
| `d2_one_good_thing`          | D2 Prompt       | Text                      | Week timeline card D2                              |
| `d2_followup_answer`         | D2 Follow-up    | Text                      | Week timeline, Badge Axis A (length signal)        |
| `d3_appreciation_snap`       | D3 Quick1       | Text                      | Week timeline card D3                              |
| `d3_fms_pick`                | G02 Day 3       | Enum (4 options)          | Badge Axes A+B, Week timeline                      |
| `d3_mirror_q[1-10]`          | D3 Mirror       | Bool ×10                  | Partner Knowledge Score                            |
| `d3_true_ratio`              | D3 Mirror       | Int 0–10                  | Partner Knowledge bar, Badge Axes B+C              |
| `d3_mood_board`              | G07 Day 3       | Array [3 tile IDs]        | Emotional Weather, Badge Axes A+B+C                |
| `d3_mood_board_theme`        | G07 computed    | Enum (5 themes)           | Emotional Theme banner in report                   |
| `d3_one_certainty`           | D3 Quick2       | Text                      | Week timeline, The Letter                          |
| `d4_memory_content`          | D4 Jar          | Text/Photo/Emoji          | Jar reveal, The Letter, Bridge B4→5                |
| `d4_memory_type`             | D4 Jar          | Enum                      | Badge Axis A                                       |
| `d4_tiny_compliment_word`    | D4 Quick1       | String                    | Jar glow label, Shareable card                     |
| `d4_priority_picks`          | G08 Day 4       | Array [3 of 5]            | Top Needs section, Badge Axes B+C                  |
| `d4_top_need`                | G08 computed    | String (pick[0])          | Bridge B4→5 card, Report section                   |
| `d4_love_drop_used`          | G04 Day 4       | Bool                      | Jar special note, Badge Axes B+C                   |
| `d4_love_drop_type`          | G04 Day 4       | Enum (4 types)            | Badge Axes A+C, Dedication score                   |
| `d4_love_drop_content`       | G04 Day 4       | Text (sealed)             | Unseals when partner joins                         |
| `d4_daily2_q1`               | D4 Daily2       | Text                      | Mood chart D4 bar (keyword tone)                   |
| `d4_daily2_q2`               | D4 Daily2       | Text                      | Week timeline card D4                              |
| `drop_box_used`              | D4 Drop Box     | Bool                      | Jar rose note, Badge Axis B                        |
| `d5_badge_name`              | Day 5 calc      | Enum (8 badges)           | Report badge section, Shareable card               |
| `d5_dedication_score`        | Day 5 calc      | Float 0–7                 | Badge tier, Connection Score component             |
| `d5_connection_score`        | Day 5 calc      | Int 0–100                 | Connection Score display                           |
| `d5_partner_knowledge_score` | Day 5 calc      | Int 0–10                  | Partner Knowledge display                          |

---

## 📅 Day 1: The Spark Check

**Theme**: Bold & Fun
**Goal**: Establish emotional baseline. Make the user feel seen through the Honest Moment response. Introduce the Vibe Check as a visual emotional fingerprint.

### D1-1: Connection Slider

- **Interaction**: User drags slider 1–10. Live updates.
- **Segments**: 1–2 (seg_1), 3–5 (seg_2), 6–7 (seg_3), 8–9 (seg_4), 10 (seg_5).
- **Data**: `baseline_connection_score`, `d1_slider_timestamp`, `d1_segment`.

### D1-2: The Honest Moment

- **Display**: Pre-written copy per segment. 4–6s pause.
- **Interaction**: CTA: "Take the Spark Quiz →".

### D1-2.5: Vibe Check (New Game 05)

- **Prompt**: "Before we go deeper — one card that captures how your relationship feels right now."
- **Interaction**: 8 tiles (🌱 Growing, 🌊 Drifting, 🔥 Passionate, 🌙 Quiet, 😮💨 Tired, 💫 Hopeful, 🤍 Tender, ⚡ Energised).
- **Logic**: Selection is auto-advance. No back-navigation.
- **Data**: `vibe_d1`, `vibe_d1_category`.
- **Badge Axis**:
  - **Axis A**: {Tender, Loved, Quiet} → Expressive +1 \| {Energised, Passionate, Growing} → Active +1
  - **Axis C**: {Growing, Hopeful, Energised} → Building +1 \| {Tender, Quiet, Peaceful} → Protecting +1

### D1-3 → D1-9: Spark Quiz (Existing)

- **Interaction**: 7 questions based on `d1_segment`. Tap auto-advances.
- **Data**: `d1_q[n]_answer` (A/B).

### D1-10: Personality Type Result

- **Result**: Steady Flame / Electric Spark / Deep Current / Shifting Tide.
- **Data**: `d1_personality_type`, `d1_complete: true`, `streak_count: 1`, `Dedication Score: +1`.

---

## 🌉 Bridge B1→2: Entering Day 2

**Goal**: Transition from D1 to D2 with partner-invite hook.

1. **Activity 1**: Return Greeting + Streak Ring (shows 2). Recap D1 personality.
2. **Activity 2**: Intention Word Selector (Patient, Present, Honest, Warm, Playful, Open, Gentle, Brave). Stored as `d2_intention_word`.
3. **Activity 3: This or That: Us Edition (G06)**: 3 rounds.
   - **Step A (My pick)**: User selects their choice.
   - **Step B (Prediction)**: "What would they pick?".
   - **Scenarios**: Trip (Beach/Trek), Sunday (Home/Out), Recharge (Space/Close).
   - **Badge Axis A**: Adventure/Active ≥2 → Active +1 \| Comfort/Home ≥2 → Expressive +1.
   - **Badge Axis C**: Match ≥2/3 → Protecting +1 \| All differ → Building +1.

---

## 📅 Day 2: The Mood Room

**Theme**: Calm & Warm
**Goal**: Emotional check-in via the candle and deep reflection.

### D2-1: The Candle Mood Screen

- **Interaction**: 3s animation → 8-mood grid.
- **Moods**: Distant, Connected, Grateful, Frustrated, Playful, Missed, Overwhelmed, Loved.
- **Data**: `d2_mood`, `d2_mood_score`.

### D2-Prompt: One Good Thing

- **Interaction**: Name one positive thing about partner (10–80 chars).
- **Data**: `d2_one_good_thing`. Dedication: Expressive if length ≥40 chars.

### D2-2: The Follow-Up Question

- **Interaction**: Personalized question by mood segment.
- **Data**: `d2_followup_answer`, `d2_complete: true`, `streak_count: 2`, `Dedication Score: +1`.

---

## 📅 Day 3: The Mirror Game

**Theme**: Playful + Provocative
**Goal**: Self-expression → Testing assumptions → Visual reflection.

### D3-Quick1: The Appreciation Snap

- **Interaction**: "What do you want them to know about you right now?" (1 sentence).
- **Data**: `d3_appreciation_snap`, `Dedication Score: +0.5`.

### D3-Quick1b: Finish My Sentence (G02)

- **Stem**: "The thing I love most about us is…"
- **Options**: Resilience, Present, Playful, Protective.
- **Data**: `d3_fms_pick`, `d3_fms_tag`.

### D3-1: The Assumptions Test (Mirror Game)

- **Interaction**: 10 T/F statements based on personality.
- **Data**: `d3_mirror_q[1-10]`, `d3_true_ratio`.

### D3-MoodBoard: Mood Board Match (G07)

- **Interaction**: Pick 3 of 10 visual tiles (Comfort, Fresh start, etc.).
- **Data**: `d3_mood_board`, `d3_mood_board_theme`.
- **Badge Axis**: Calculated by majority tag across 3 tiles.

### D3-Quick2: The One Certainty

- **Interaction**: "What's the one thing you know for certain?"
- **Data**: `d3_one_certainty`, `d3_complete: true`, `streak_count: 3`, `Dedication Score: +0.5`.

---

## 📅 Day 4: The Memory Jar

**Theme**: Warm & Emotional
**Goal**: Preservation and surfacing unspoken needs.

### D4-1: The Memory Jar

- **Interaction**: Drop Text/Photo/Emoji note.
- **Data**: `d4_memory_content`, `d4_memory_type`.

### D4-Quick1: The Tiny Compliment

- **Interaction**: 8 word pills (Seen, Safe, Home, etc.) or free-type.
- **Data**: `d4_tiny_compliment_word`, `Dedication Score: +0.5`.

### D4-Quick1b: Priority Shuffle (G08)

- **Interaction**: Vertical stack of 5 cards. Tap top 3 in order.
- **Cards**: Warmth, Time, Calm, Laughter, Conversations.
- **Data**: `d4_priority_picks`, `d4_top_need`.

### D4-2: The Daily 2

- **Interaction**: 2 open-text reflection cards.
- **Data**: `d4_daily2_q1`, `d4_daily2_q2`. Dedication: +0.5 if both answered.

### D4-3: Love Drop + Drop Box (G04)

- **Love Drop**: Leave a sealed compliment/memory/challenge. Stored as `d4_love_drop_content`.
- **Drop Box**: Reframe a heavy thought. Stored as `d4_reframed_text`.
- **Data**: `d4_love_drop_used`, `drop_box_used`. Dedication: +1.0 max.

### D4-Quick2: Personalised Trivia Fact

- **Display**: 5s trivia fact. `d4_complete: true`, `streak_count: 4`, `Dedication Score: +1`.

---

## 📅 Day 5: The Reveal

**Theme**: Bold & Emotional
**Goal**: Celebration, Badge revealing, and long-term intention.

### D5-1: Celebration + Badge Calculation

- **Action**: Confetti + Full calculation of Connection Score and Badge.

### D5-2: The Report Card Sections

1. **Mood Journey**: 5-bar chart.
2. **Emotional Weather**: Vibe tile + Mood icon + Theme name.
3. **Personality Deep Dive**: Strengths + growth invitation.
4. **Relationship Needs**: Top need from G08.
5. **Week in Moments**: Vertical timeline of exact words.
6. **Memory Jar Full Reveal**: All 5 notes + gold sealed note.
7. **Your Badge**: Badge name + tier + trait pills.
8. **Couple Mode Unlock**: Preview G01/G03 and sealed reveal hooks.

### D5-Quick1: The Promise

- **Interaction**: "One honest intention from tomorrow." Stored for report/share.

### D5-Quick2: The Letter

- **Display**: Template-generated emotional summary.

---

## 🧮 Scoring Algorithm Reference

### ① Connection Score (/100)

| Component          | Source Variable             | Max Pts | Formula                                   |
| :----------------- | :-------------------------- | :------ | :---------------------------------------- |
| Emotional Baseline | `baseline_connection_score` | 20      | (score / 10) × 20                         |
| Vibe Check Day 1   | `vibe_d1_category`          | 10      | Positive=10, Tender=7, Heavy=3            |
| Mood Day 2         | `d2_mood_score`             | 10      | (score / 9) × 10                          |
| Mood Board         | `d3_mood_board`             | 10      | Count tiles (Present/Protecting) / 3 × 10 |
| Knowledge          | `d3_true_ratio`             | 10      | true_ratio × 1                            |
| Dedication         | `d5_dedication_score`       | 30      | (dedication / 7) × 30                     |
| Trend Bonus        | D1 vs D4 tone               | 10      | D4 > D1 → +10, Equal → +5                 |

### ② Dedication Score (/7.0)

| Activity                       | Points |
| :----------------------------- | :----- |
| D1 Full Complete               | 1      |
| D2 Complete                    | 1      |
| D3 Mirror + FMS + Board        | 1      |
| G07 Mood Board completed       | 0.5    |
| G02 FMS completed              | 0.5    |
| D4 Memory dropped              | 1      |
| G08 Priority Shuffle completed | 0.5    |
| G04 Love Drop used             | 0.5    |
| D4 Daily 2 (both)              | 0.5    |
| Drop Box used                  | 0.5    |
| D5 Promise completed           | 1      |
| Skip never used                | 1      |

_Cap at 7.0 for badge tier._

### ③ Badge Axis Contributions

| Axis                          | Source                                                              | Signals                                                           |
| :---------------------------- | :------------------------------------------------------------------ | :---------------------------------------------------------------- |
| **A: Expressive vs Active**   | D1 Q1/Q6, D2 Follow-up, D4 Memory Type, G05, G02, G07, G04          | Expressive: Text, Tender. Active: Photo, Playful.                 |
| **B: Deep vs Present**        | D1 Q4/Q7, D2 Mood, D3 Mirror, D4 Drop Box, G02, G07, G08, G04       | Deep: Loved, Mirror Ratio. Present: Playful, Laughter.            |
| **C: Protecting vs Building** | D1 Slider/Q5/Q6, D2 Mood, D3 Ratio, D4 Drop Box, G05, G07, G08, G04 | Protecting: Slider ≥6, Safe Home. Building: Slider ≤5, Challenge. |

---

## 🔒 Couple Mode Games (Post-Join)

### G01: Prediction Game

- Both partners answer the same question and predict the other's answer.
- **Score**: Match = Mind Meld +2.

### G03: Us vs. The Question

- Simultaneous 10s countdown tap on same question.
- **Score**: Matched = +2 sync points + streak.

---
