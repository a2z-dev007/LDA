# LDA — 5-Day Solo Flow + All 8 Games Integrated
**Development Reference v2.0** | Solo MVP | Games 01–08 mapped | Day 5 scoring algorithm complete

---

## 📋 Table of Contents
- [Overview](#master-overview)
- [Day 1](#day-1)
- [Bridge 1→2](#bridge-12)
- [Day 2](#day-2)
- [Day 3](#day-3)
- [Day 4](#day-4)
- [Day 5](#day-5)
- [Scoring Algorithm](#scoring-algorithm)
- [Report Structure](#report-structure)
- [Couple Mode Games](#couple-mode-games)

---

## 🏛️ Master Overview
Games 01–04 (from the first set) and 05–08 (tap-select set) distributed across 5 days. Games 01 & 03 require both partners active simultaneously — held for Couple Mode. All others adapted for Solo MVP.

### Day 1: The Spark Check
Connection Slider • G05 Vibe Check • Spark Quiz 7Q • Personality Type

### Bridge + Day 2: The Mood Room
G06 This or That ×3 • Intention Word • Candle • Mood Follow-up Q

### Day 3: The Mirror Game
Appreciation Snap • G02 Finish My Sentence • Mirror 10 T/F • G07 Mood Board Match • One Certainty

### Day 4: The Memory Jar
Memory Jar • Tiny Compliment • G08 Priority Shuffle • Daily 2 • G04 Love Drop

### Day 5: The Reveal
Badge + Report • 5-Day Story • Memory Jar Reveal • G01 G03 Previewed • Partner Invite

---

## 📊 Master Data Variables — Full List

| Variable | Source | Type | Day 5 Use |
| :--- | :--- | :--- | :--- |
| `baseline_connection_score` | D1 Slider | Int 1–10 | Connection Score base, Mood chart D1 bar |
| `vibe_d1` | G05 Day 1 | String (8 options) | Emotional Weather, Badge Axes A+C |
| `d1_personality_type` | D1 Quiz | Enum (4 types) | Type deep dive section |
| `d1_q[1-7]_answer` | D1 Quiz | Enum A/B ×7 | Badge axis calculations |
| `b2_tot_rounds[1-3]` | G06 Bridge B1→2 | Object {my_pick, my_pred} | This or That section (revealed when partner joins) |
| `d2_intention_word` | Bridge B1→2 | String (8 opts) | Week timeline pill |
| `d2_mood` | D2 Candle | Enum (8 moods) | Mood chart D2 bar, Badge Axes |
| `d2_mood_score` | D2 Candle | Int 3–9 | Connection Score component |
| `d2_one_good_thing` | D2 Prompt | Text | Week timeline card D2 |
| `d2_followup_answer` | D2 Follow-up | Text | Week timeline, Badge Axis A (length signal) |
| `d3_appreciation_snap` | D3 Quick1 | Text | Week timeline card D3 |
| `d3_fms_pick` | G02 Day 3 | Enum (4 options) | Badge Axes A+B, Week timeline |
| `d3_mirror_q[1-10]` | D3 Mirror | Bool ×10 | Partner Knowledge Score |
| `d3_true_ratio` | D3 Mirror | Int 0–10 | Partner Knowledge bar, Badge Axes B+C |
| `d3_mood_board` | G07 Day 3 | Array [3 tile IDs] | Emotional Weather, Badge Axes A+B+C |
| `d3_mood_board_theme` | G07 computed | Enum (5 themes) | Emotional Theme banner in report |
| `d3_one_certainty` | D3 Quick2 | Text | Week timeline, The Letter |
| `d4_memory_content` | D4 Jar | Text/Photo/Emoji | Jar reveal, The Letter, Bridge B4→5 |
| `d4_memory_type` | D4 Jar | Enum | Badge Axis A |
| `d4_tiny_compliment_word` | D4 Quick1 | String | Jar glow label, Shareable card |
| `d4_priority_picks` | G08 Day 4 | Array [3 of 5] | Top Needs section, Badge Axes B+C |
| `d4_top_need` | G08 computed | String (pick[0]) | Bridge B4→5 card, Report section |
| `d4_love_drop_used` | G04 Day 4 | Bool | Jar special note, Badge Axes B+C |
| `d4_love_drop_type` | G04 Day 4 | Enum (4 types) | Badge Axes A+C, Dedication score |
| `d4_love_drop_content` | G04 Day 4 | Text (sealed) | Unseals when partner joins |
| `d4_daily2_q1` | D4 Daily2 | Text | Mood chart D4 bar (keyword tone) |
| `d4_daily2_q2` | D4 Daily2 | Text | Week timeline card D4 |
| `drop_box_used` | D4 Drop Box | Bool | Jar rose note, Badge Axis B |
| `d5_badge_name` | Day 5 calc | Enum (8 badges) | Report badge section, Shareable card |
| `d5_dedication_score` | Day 5 calc | Float 0–7 | Badge tier, Connection Score component |
| `d5_connection_score` | Day 5 calc | Int 0–100 | Connection Score display |
| `d5_partner_knowledge_score` | Day 5 calc | Int 0–10 | Partner Knowledge display |

---

## 🌅 Day 1: The Spark Check
**Theme**: Bold & Fun
Establish emotional baseline. Make the user feel seen through the Honest Moment response. Introduce the Vibe Check as a visual emotional fingerprint to complement the numeric slider. Generate personality type from the Spark Quiz.

### D1-1 Existing: Connection Slider
- **Default**: 5 · Haptic at each integer · "no right answer · only your truth"
- **Interaction**:
  1. User drags slider 1–10. Number updates live. CTA: "That's my number"
  2. Segment assigned: 1–2 = `seg_1`, 3–5 = `seg_2`, 6–7 = `seg_3`, 8–9 = `seg_4`, 10 = `seg_5`
  3. Transition: number animates from slider into D1-2 large display. Fade transition.
- **Data Stored**: `baseline_connection_score` · `d1_slider_timestamp` · `d1_segment`

### D1-2 Existing: The Honest Moment
- **Display**: Display only. Pre-written copy per segment. 4–6 second pause — no auto-advance. This screen is the first emotional mirror.
- **Note**: No new data stored here. This screen intentionally silent — let the copy land before any interaction.
- **CTA**: "Take the Spark Quiz →" · Sub: "7 questions · 90 seconds"

### D1-2.5 🆕 Game 05: Vibe Check
Appears after Honest Moment, before Quiz begins. Adds emotional texture to the numeric baseline. ~20 seconds.
- **Interaction**:
  1. **Prompt** (Playfair italic): "Before we go deeper — one card that captures how your relationship feels right now."
  2. **Display**: 8 illustrated emoji-icon tiles in a 4×2 grid: 🌱 Growing / 🌊 Drifting / 🔥 Passionate / 🌙 Quiet / 😮💨 Tired / 💫 Hopeful / 🤍 Tender / ⚡ Energised
  3. **Selection**: Tap one tile. Selection highlighted with day accent colour + 1.06× scale. Unselected tiles fade to 40% opacity.
  4. **Auto-advance**: After 400ms to D1-3. No confirm button.
- **⚡ Note**: No writing. No back-navigation. If back is tapped, return to D1-2 Honest Moment.
- **Data Stored**:
  - `vibe_d1`: Selected tile string (e.g., "Growing")
  - `vibe_d1_category`: Positive = {Growing, Hopeful, Energised, Passionate} · Tender = {Tender, Quiet} · Heavy = {Tired, Drifting}
- **Badge Axis Contributions**:
  - **Axis A**: `vibe_d1` ∈ {Tender, Loved, Quiet} → Expressive +1 | `vibe_d1` ∈ {Energised, Passionate, Growing} → Active +1
  - **Axis C**: `vibe_d1` ∈ {Growing, Hopeful, Energised} → Building +1 | `vibe_d1` ∈ {Tender, Quiet, Peaceful} → Protecting +1
- **Day 5 Feed**: Emotional Weather section · Connection Score component (Positive=10pts, Tender=7pts, Heavy=3pts) · Shareable card vibe icon

### D1-3 → D1-9 Existing: Spark Quiz
7 pip progress bar. No confirm button — tap auto-advances after 120ms.
- **Interaction**:
  1. 7 questions served based on `d1_segment`. Each question = 2 card options.
  2. Every answer stored as `d1_q[n]_answer` = A or B.
  3. After Q7: Personality type calculated.
- **Note**: No changes to this section. Existing rules apply.

### D1-10 Existing: Personality Type Result
Steady Flame / Electric Spark / Deep Current / Shifting Tide.
- **CTAs**: Save my result (primary) · Come back tomorrow → (ghost)
- **Data Stored**: `d1_personality_type` · `d1_complete: true` · `streak_count: 1` · `Dedication Score: +1`
- **⏱ Timing**: Day 1 total with Vibe Check: ~3 min 20 sec.

---

## 🌉 Bridge B1→2: Entering Day 2
Bridge from Day 1 to Day 2. Contains 3 activities.

### B1→2 Activity 1 Existing: Greeting + Streak
"Welcome back, [Name]" · Streak ring shows 2 · Day 1 recap card.

### B1→2 Activity 2 Existing: Intention Word
"One word you want to bring into your relationship today."
- **Options**: Patient / Present / Honest / Warm / Playful / Open / Gentle / Brave
- **Data**: `d2_intention_word`

### B1→2 Activity 3 🆕 Game 06: This or That: Us Edition
Replaces "card rapid fire". 3 rounds. Solo Prediction Mode. ~45 seconds.
- **Interaction**:
  1. **Header**: "3 quick rounds. Pick yours — then predict theirs." · **Sub**: "Your partner's answer is locked until they join."
  2. **Layout**: Two large illustrated cards. Scenario label above.
  3. **Step A (My pick)**: User taps one card. "Now predict theirs →" appears.
  4. **Step B (Prediction)**: User predicts partner's choice. Auto-advances.
  5. **Result**: All partner sides show a frosted card with 🔒 lock icon.
- **Rounds**:
  - R1: Trip together (🏖️ Beach & do nothing / 🏔️ Trek & explore)
  - R2: Quiet Sunday (☕ Slow morning at home / 🚗 Spontaneous day out)
  - R3: Need to recharge (🤍 Need space alone / 🤗 Need you close)
- **Data Stored**: `b2_tot_rounds` (Array of 3 objects) · `b2_tot_complete` (Boolean)
- **Badge Axis Contributions**:
  - **Axis A**: ≥2 Active options → Active +1 | ≥2 Comfort options → Expressive +1
  - **Axis C**: Match prediction ≥2/3 → Protecting +1 | All differ → Building +1
- **Day 5 Feed**: "This or That Preview" card. Reveals match rate when partner joins.
- **🔒 Security**: Partner side sealed. Never show prediction back to sender until join.

---

## 🕯️ Day 2: The Mood Room
**Theme**: Calm & Warm
Emotional check-in via the candle. One personalised follow-up question.

### D2-1 Existing: The Candle Mood Screen
3-second candle animation → 8-mood grid (4×2): Distant · Connected · Grateful · Frustrated · Playful · Missed · Overwhelmed · Loved. SVG icons.
- **Data**: `d2_mood` · `d2_mood_score` (Connected/Loved/Playful=9, Grateful/Missed=6, Overwhelmed/Frustrated/Distant=3)
- **Badge Axis**:
  - Axis A: Playful/Connected → Active +1
  - Axis B: Loved/Grateful/Missed → Deep +1 | Connected/Playful/Overwhelmed → Present +1
  - Axis C: Grateful/Loved → Protecting +1 | Frustrated/Distant/Overwhelmed → Building +1

### D2-Prompt Existing: One Good Thing
"Before anything else — name one thing about your partner... It can be tiny." 10–80 chars.
- **Data**: `d2_one_good_thing`. Dedication: Expressive if length ≥40 chars.

### D2-2 Existing: The Follow-Up Question
Personalised by `d2_mood` segment. 3 rotating questions.
- **Data**: `d2_followup_answer` · `d2_followup_length` · `d2_complete: true` · `streak_count: 2`
- **Axis A**: length ≥ 60 chars → Expressive +1
- **Dedication Score**: +1
- **⏱ Timing**: Day 2 total: ~2 min 40 sec.

---

## 🪞 Day 3: The Mirror Game
**Theme**: Playful + Provocative
Strongest conversion day. Self-expression → Testing assumptions → Visual reflection → Certainty anchor.

### D3-Quick1 Existing: Appreciation Snap
"What do you want them to know about you right now?" Open text, 1 sentence.
- **Data**: `d3_appreciation_snap` · `Dedication Score: +0.5`

### D3-Quick1b 🆕 Game 02: Finish My Sentence
Positioned after Snap, before Mirror. User picks completion. Partner's version locked. ~25 seconds.
- **Interaction**:
  1. Stem (Playfair italic): "The thing I love most about us is…"
  2. 4 cards: 🌊 Resilience / ☕ Present / ⚡ Playful / 🕯️ Protective
  3. Selection: Card highlights. Frosted partner card appears (🔒 sealed).
- **Sentence Stem Bank**:
  1. The thing I love most about us is... (Resilience / Present / Playful / Protective)
  2. I feel closest to you when... (Deep / Caring / Active / Expressive)
  3. What I want us to always protect is... (Building / Protecting / Present / Deep)
- **Data**: `d3_fms_stem_id`, `d3_fms_pick`, `d3_fms_tag`.
- **Badge Axis**: Based on tags (e.g., `deep` → Expressive +1, `playful` → Active +1).
- **Day 5 Feed**: Week timeline Day 3 card. Dedication Score: +0.5.

### D3-1 Existing: The Assumptions Test (Mirror Game)
10 T/F statements based on `d1_personality_type`. TRUE/FALSE tap → auto-advance.
- **Data**: `d3_mirror_q[1-10]` · `d3_true_ratio` (count of TRUE / 10).
- **Axis B**: 7–10 → Deep +2 | 0–4 → Present +2
- **Axis C**: ≥7 → Protecting +1

### D3-2 Existing: Mirror Results
Split screen: left = user's 10 answers, right = frosted/locked. Invite CTA.

### D3-MoodBoard 🆕 Game 07: Mood Board Match
Converts uncertainty into visual reflection. ~30 seconds.
- **Interaction**:
  1. **Prompt**: "Pick 3 tiles that describe your relationship this week."
  2. **10 Tiles**: ☕ Comfort / 🌅 Fresh start / 🎧 Our world / 🌧️ Under cloud / 🕯️ Intimate / 🌿 Peaceful / 🎢 Up & down / 🧩 Figuring out / 🌻 Blossoming / 🏡 Safe home
  3. **Auto-save**: Partner's board shown as 3 frosted ❓ tiles.
- **Tagging**: Each tile tagged with Axis A/B/C traits. Axis contributed by majority tag.
- **Themes**: Safe & Steady / Growing & Open / Navigating Together / Deeply Connected / Mixed & Moving.
- **Data**: `d3_mood_board` (Array) · `d3_mood_board_theme` (Computed) · `Dedication Score: +0.5`.

### D3-Quick2 Existing: One Certainty
"What's the one thing you know for certain?" Open text.
- **Data**: `d3_one_certainty` · `d3_complete: true` · `streak_count: 3` · `Dedication Score: +0.5`.
- **⏱ Timing**: Day 3 total: ~3 min 30 sec.

---

## 🏺 Day 4: The Memory Jar
**Theme**: Warm & Emotional
Preservation and intention. Surfaces unspoken needs.

### D4-1 Existing: The Memory Jar
Jar at 60% fill. Drop Text / Photo / Emoji+date. Drop animation.
- **Data**: `d4_memory_content` · `d4_memory_type`.
- **Axis A**: Text → Expressive +2 | Photo → Active +2 | Emoji → Active +1.

### D4-Quick1 Existing: Tiny Compliment
8 word pills (Seen / Safe / Lighter / Lucky / Proud / Loved / Calm / Home) or free-type.
- **Data**: `d4_tiny_compliment_word` · `Dedication Score: +0.5`.

### D4-Quick1b 🆕 Game 08: Priority Shuffle
"What do you need most this week?" 5 cards, pick top 3 in order. ~40 seconds.
- **Relationship Needs**: 🤗 Warmth / 🗓️ Time / 🧘 Calm / 😂 Laughter / 💬 Conversations.
- **Data**: `d4_priority_picks` (ordered array) · `d4_top_need` (pick[0]).
- **Axis B**: Conversations → Deep +2 | Laughter → Present +2 | Calm → Deep +1.
- **Axis C**: Warmth/Calm → Protecting +2 | Laughter/Time → Building +1 | Conversations → Building +2.
- **Day 5 Feed**: "Top Relationship Need" section. Partner's picks revealed on join. `Dedication Score: +0.5`.

### D4-2 Existing: The Daily 2
Card 1: Emotion today. Card 2: Relationship lesson.
- **Data**: `d4_daily2_q1` · `d4_daily2_q2`.
- **Axis A**: Both answered 40+ chars → Expressive +1.
- **Dedication**: +0.5 if both, +0.25 if one.

### D4-3 Updated Game 04: Love Drop (Two Modes)
#### Mode A: Love Drop (NEW)
1. "Leave something for your partner."
2. 4 Types: 🤍 Compliment / 💭 Memory / ⚡ Challenge / 💬 Unsaid.
3. Content: 50–100 char text or preset tap-options.
4. Animation: Envelope drops into gold "Drops for them" jar. 🔒 Sealed.
- **Axis A**: Compliment → Expressive +1.
- **Axis B**: Used → Deep +1.
- **Axis C**: Challenge → Building +1 | Compliment/Memory → Protecting +1.

#### Mode B: Drop Box (Existing)
"Something you've been carrying — but haven't said yet." Reframe logic.
- **Data**: `d4_love_drop_used` · `drop_box_used` · `d4_reframed_text`.
- **Dedication**: Max +1.0 from this screen.

### D4-Quick2 Existing: Trivia Fact
5s display. `d4_complete: true` · `streak_count: 4` · `Dedication Score: +1`.
- **⏱ Timing**: Day 4 total: ~3 min 20 sec.

---

## 🌉 Bridge B4→5: Entering Day 5
### B4→5 Update: Top Need Card
- **Zone 2**: Memory card + Jar preview + 🆕 **Top Need card**.
- **Card 3**: Displays `d4_top_need` icon/label. "Day 5 shows you if they felt the same."

---

## 🏆 Day 5: The Reveal
**Theme**: Bold & Emotional

### D5-1 Existing: Celebration
Confetti. Full calculation runs. See Algorithm section.

### D5-2 Expanded: The Report Card
Section Order:
1. Mood Journey (5-bar chart)
2. Emotional Weather (🆕 vibe + mood + theme)
3. Personality Deep Dive
4. Your Relationship Needs (🆕 from G08)
5. Week in Moments (Timeline with all game data)
6. Memory Jar Reveal (now with gold Love Drop note)
7. Your Badge
8. Couple Mode Unlock (🆕 G01/G03 preview)

### D5-Quick1 Existing: The Promise
"One honest intention from tomorrow." `Dedication Score: +0.5`.

### D5-Quick2 Existing: The Letter
Template-generated from user data. 6s no-button moment.

### D5-3 Existing: Partner Invite
Invite partner or continue solo.
- **⏱ Timing**: Day 5 total: ~5 min.

---

## 🧮 Scoring Algorithm

### ① Connection Score (/100)
| Component | Source Variable | Max Pts | Formula |
| :--- | :--- | :---: | :--- |
| Emotional Baseline | `baseline_connection_score` | 20 | (score / 10) × 20 |
| Vibe Check Day 1 | `vibe_d1_category` | 10 | Positive=10, Tender=7, Heavy=3 |
| Mood Day 2 | `d2_mood_score` | 10 | (score / 9) × 10 |
| Mood Board Positivity| `d3_mood_board` | 10 | Count tiles tagged Present or Protecting / 3 × 10 |
| Partner Knowledge | `d3_true_ratio` | 10 | `true_ratio` × 1 (raw, /10) |
| Dedication | `d5_dedication_score` | 30 | (dedication / 7) × 30 |
| Trend Bonus | D1 vs D4 tone | 10 | D4 tone > D1 → +10; equal → +5; declining → +0 |

*Note: `d4_daily2_tone_score` mapping: Warmth=7, Heavy=4, Neutral=5.*

### ② Partner Knowledge Score (/10)
`d5_partner_knowledge_score` = `d3_true_ratio`.

### ③ Dedication Score (/7)
| Activity | Points |
| :--- | :---: |
| D1 full complete (slider + Vibe Check + quiz + result) | 1 |
| D2 complete (mood + follow-up, not skipped) | 1 |
| D3 complete (all 10 T/F answered + Mood Board + Sentence) | 1 |
| D3 Mood Board completed | 0.5 |
| D3 Finish My Sentence completed | 0.5 |
| D4 memory dropped | 1 |
| D4 Priority Shuffle completed | 0.5 |
| D4 Love Drop used | 0.5 |
| D4 Daily 2 both answered | 0.5 |
| Drop Box used | 0.5 |
| D5 Promise completed | 1 |
| Skip never used across all days | 1 |
*Sum capped at 7.0.*

**Badge Tiers**: 6–7 pts → Gold Ring | 4–5 pts → Standard | 2–3 pts → Emerging.

### ④ Badge Axis Calculations

| Axis | Signal Sources | Highlights |
| :--- | :--- | :--- |
| **A: Expressive vs Active** | D1 Q1/Q6, D2 length, D2 Mood, D4 Memory, G05, G02, G07, G04 | Expressive: Text, Tender. Active: Photo, Passionate. |
| **B: Deep vs Present** | D1 Q4/Q7, D2 Mood, D3 Mirror ratio, D4 Drop Box, G02, G07, G08, G04 | Deep: Loved, Ratio 7-10. Present: Playful, Laughter. |
| **C: Protecting vs Building**| D1 Slider/Q5/Q6, D2 Mood, D3 ratio, D4 Drop Box, G05, G07, G08, G04 | Protecting: Slider ≥6, Safe Home. Building: Slider ≤5, Challenge. |

### ⑤ Mood Chart — 5-Bar Data
- **D1**: `baseline_connection_score` (1-10)
- **D2**: `d2_mood_score` (3/6/9 normalised)
- **D3**: Average of D1 + D2
- **D4**: `d4_daily2_q1` tone (7/4/5)
- **D5**: Running average of (D1+D2+D3+D4) / 4

---

## 📈 Report Structure Details

### Section 1 — Mood Journey
5-bar chart + insight line (upward/downward/etc).

### Section 2 — Emotional Weather 🆕
Three-tile display: Day 1 vibe + Day 2 mood + Day 3 Board theme.
- **Pattern reads**: "Grounded", "Moved", "Growth", "Hard week".

### Section 3 — Personality Type Deep Dive
Type name + 3 strengths + 1 growth area.

### Section 4 — Your Relationship Needs 🆕
Top need (pick[0]) + 1-line description. Full list 1-3. Partner side frosted.

### Section 5 — Week in Moments (Timeline)
- D1: Vibe + Type + Slider.
- D2: Intention + Good Thing + Mood.
- D3: Snap + FMS (Playfair) + Certainty.
- D4: Memory + Compliment + Daily 2.

### Section 6 — Memory Jar Full Reveal
Fill animation + tappable notes. Rose note if Drop Box. Gold note if Love Drop.

### Section 7 — Your Badge
Badge visual + tier + trait pills.

### Section 8 — Couple Mode Unlock 🆕
Previews G01/G03. Status: 🔒 Waiting.
- G02 FMS reveal: Show stem + my answer + ⌛ 1 of 2 complete.
- G06 This or That: Show 3 rounds + ⌛ 3 of 6 answers in.

---

## 🔒 Couple Mode: Games 01 & 03
Only activate after partner joins.

### Game 01 — Prediction Game (Daily)
Both answer same question + predict partner's choice. Reveal together.
- **Score**: Match = +2 Mind Meld.

### Game 03 — Us vs. The Question (Simultaneous)
Same binary question. 10s countdown. Both tap.
- **Score**: Matched = +2 sync points + streak.

---
**Seals**: G02 and G06 seals resolve automatically when partner completes relevant day/bridge. Data merges for "reveal" moments.
