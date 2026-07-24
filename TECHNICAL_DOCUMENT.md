    # Let's Date Again (LDA) — Technical System Architecture & Algorithm Specification

    Let's Date Again (LDA) is a premium relationship wellness mobile application designed specifically for Indian couples. This technical document specifies the system architecture, state management framework, routing engines, scoring algorithms, and the design tokens that power the MVP: a solo 5-day progressive guided experience.

    ---

    ## 🖥️ 1. Technology Stack & Core Dependencies

    The application is engineered using React Native CLI (TypeScript) for high performance, smooth animations, and platform-native integration.

    ### Core Architecture & Libraries

    | Category | Library / Dependency | Purpose / Description |
    | :--- | :--- | :--- |
    | **Framework** | `react-native` (0.85.2) | Core platform wrapper and native module bridge. |
    | **Language** | `typescript` (^5.8.3) | Enforces strict compile-time type safety across all stores and components. |
    | **Navigation** | `@react-navigation/native` (v7) | Linear screen stack traversal (bottom navigation tab bars are omitted by design). |
    | **Global State** | `zustand` (^5.0.12) & `immer` | Highly performant, boilerplate-free state management with immutability. |
    | **Storage Layer** | `react-native-mmkv` (^4.3.1) | Fast, native C++ key-value storage for immediate store synchronization. |
    | **Secondary Storage** | `@react-native-async-storage/async-storage` | Fallback for storing larger blobs (e.g., historical reports and images). |
    | **Styling** | `nativewind` (v2.0.11) & `tailwindcss` | Integrates atomic Utility CSS styling for React Native styles. |
    | **Animations** | `react-native-reanimated` (v4.3.0) & `lottie-react-native` | Fluid 60fps micro-animations, physical gestures, and Lottie animations. |
    | **Sensory System** | `react-native-haptic-feedback` | Tactile reinforcement for choices, completions, and slider increments. |
    | **Graphics & Capture** | `react-native-svg` & `react-native-view-shot` | Dynamic custom layout widgets and report card exporting to social sharing. |

    ---

    ## 📁 2. Project Directory Structure

    LDA follows a **Feature-First Architecture** in the `src/` directory to group logical modules cleanly.

    ```
    src/
    ├── assets/          # Custom Fonts (Playfair Display, Inter), Lottie JSONs, background vectors
    ├── components/      # UI component hierarchy divided by scope
    │    ├── common/     # Reusable atomic elements (GlowButton, ProgressStrip, StreakRing)
    │    ├── bridge/     # Transition/Bridge subcomponents (e.g., ThisOrThatBridge)
    │    └── icons/      # Lucide helper overrides and customized vector SVGs
    ├── data/            # Static configuration files (Spark Quiz, ThisOrThat question sets)
    ├── navigation/      # RootNavigator configuration and TypeScript route type parameter definitions
    ├── screens/         # Page containers structured by Day 1–5 sequences, bridges, and onboarding
    ├── services/        # Business logic modules
    │    ├── scoring/    # Atomic day-by-day score calculation engines
    │    ├── badgeCalculator.ts # Maps user outputs to couple personality archetypes
    │    ├── dayRouter.ts       # Evaluates application entry state to route the user
    │    ├── toneReframer.ts    # Locally reframes hostile user entry text (privacy-first filter)
    │    └── letterGenerator.ts # Generates deterministic template letters at the end of Day 5
    ├── store/           # Local Zustand stores mapped to MMKV storage persistence adapters
    ├── theme/           # Theming context, dynamic palette registers, and typography sizing matrices
    ├── types/           # Global type declarations (e.g., asset image declarations)
    └── utils/           # Shared utility tools (e.g., standardized haptic system wrappers)
    ```

    ---

    ## 🧠 3. State Architecture & Storage Strategy

    Global state is split across specialized domain stores to maximize rendering efficiency. All stores are persistent using `react-native-mmkv`.

    ```mermaid
    graph TD
        subgraph Zustand Stores
            UserStore[useUserStore]
            DayStore[useDayStore]
            StreakStore[useStreakStore]
        end
        
        subgraph MMKV Storage
            MMKV[react-native-mmkv Adapter]
        end
        
        UserStore -->|Auto-Persist| MMKV
        DayStore -->|Auto-Persist| MMKV
        StreakStore -->|Auto-Persist| MMKV
    ```

    ### 3.1 `useUserStore`
    Tracks the user's demographic metadata and onboarding flags:
    * `userId`: Unique UUID generated at initial launch.
    * `name`: Custom name configured during onboarding.
    * `introSeen`: Boolean indicating if the introduction walk-through has been completed.
    * `onboardingComplete`: Toggle flag verifying commitment sign-up.

    ### 3.2 `useStreakStore`
    Maintains operational telemetry regarding streak metrics:
    * `streakCount`: Consecutive days completed.
    * `shieldAvailable`: Toggle tracking if the **Streak Shield** can be utilized (+48-hour recovery).
    * `shieldUsed`: Prevents abuse by tracking if the shield has already been spent.
    * `lastActiveDate`: ISO timestamp of the last activity execution.

    ### 3.3 `useDayStore`
    The master store. Houses responses, completion flags, and metadata across the 5 days:
    * `day1` to `day5` sub-objects storing:
      - Intention words, slider scores, and selected quiz answers.
      - Mirror Game results, selected mood board tiles, and input text details.
      - Final calculated badges, average scores, and invitations.

    ---

    ## 🧭 4. Navigation Flow & DayRouter Engine

    The application enforces a **Strictly Linear Flow** without bottom tab bars. 

    ```mermaid
    graph TD
        A[App Startup] --> B{Intro Seen?}
        B -- No --> C[IntroSliderScreen]
        B -- Yes --> D{Onboarding Complete?}
        D -- No --> E[SplashScreen / NameKeeper / Commitment]
        D -- Yes --> F[HomeScreen / Hub]
        F --> G[Resolve Active Route]
        G --> H{Day 1 Complete?}
        H -- No --> I[Day 1 Flow]
        H -- Yes --> J{Day 2 Complete?}
        J -- No --> K[Bridge 1 to 2 / Day 2 Flow]
        J -- Yes --> L{Day 3 Complete?}
        L -- No --> M[Bridge 2 to 3 / Day 3 Flow]
        L -- Yes --> N{Day 4 Complete?}
        N -- No --> O[Bridge 3 to 4 / Day 4 Flow]
        N -- Yes --> P{Day 5 Complete?}
        P -- No --> Q[Bridge 4 to 5 / Day 5 Flow]
        P -- Yes --> R[Partner Invite / Reveal]
    ```

    ### 4.1 Routing Resolution (`dayRouter.ts`)
    On application launch or resuming, `resolveRoute()` evaluates completion checkpoints to navigate to the exact step of the journey:
    1. `!day1.complete` ➡️ Route to `Day1Slider`.
    2. `!day2.complete` ➡️ Route to `Bridge1to2` (This or That).
    3. `!day3.complete` ➡️ Route to `Bridge2to3`.
    4. `!day4.complete` ➡️ Route to `Bridge3to4`.
    5. `!day5.complete` ➡️ Route to `Bridge4to5`.
    6. Else ➡️ Route to `Day5PartnerInvite`.

    ### 4.2 Streak Shield Recovery Rule
    During `resolveRoute()`, if the current time exceeds `lastActiveDate` by **48 hours or more**, the engine checks if the Streak Shield is available:
    * If `shieldAvailable === true` and `shieldUsed === false`:
      - `shieldAvailable` is set to `false`.
      - `shieldUsed` is set to `true`.
      - The current streak count is protected (not reset), and the check returns `shieldApplied: true`.
    * If the shield has already been spent or is unavailable:
      - The active streak resets back to `1`.

    ---

    ## 🧮 5. Daywise Exact Scoring & Personality Axes Algorithms

    All interactions feed the Day 5 Report Card, calculations, and personality assessments.

    ### 5.1 Day 1: The Spark Check (Bold & Fun Theme)
    * **Connection Slider Baseline ($S_1$)**:
      - *Mechanic*: Drag-and-drop slider returning a value from 1 to 10.
      - *Scoring Contribution*: Value multiplied by 2 (up to **20 points** on the final Connection Score).
      - *Badge Axis Impact*: Baseline score $\ge 6$ adds **+2 Protecting** signals; score $\le 5$ adds **+2 Building** signals on Axis C.
      - *Continuity*: Classifies the user into one of five baseline segments, adapting the Spark Quiz.
    * **Vibe Check ($V_1$)**:
      - *Mechanic*: Tap to choose relationship vibe.
      - *Scoring Contribution*:
        - **Positive / Warm** (Growing, Hopeful, Energised, Passionate) = **10 pts**
        - **Calm / Tender** (Tender, Quiet) = **7 pts**
        - **Heavy / Challenged** (Tired, Drifting) = **3 pts**
      - *Badge Axis Impact*:
        - Tender/Quiet vibe $\rightarrow$ **+1 Expressive** (Axis A) & **+1 Protecting** (Axis C).
        - Energised/Growing/Hopeful/Passionate vibe $\rightarrow$ **+1 Active** (Axis A) & **+1 Building** (Axis C).
    * **Spark Quiz**:
      - *Mechanic*: 7 segment-adaptive questions.
      - *Badge Axis Impact*:
        - Q1: Option A $\rightarrow$ **+2 Expressive**; Option B $\rightarrow$ **+2 Active** (Primary Axis A signal & tie-breaker).
        - Q6: Option A $\rightarrow$ **+2 Expressive** & **+1 Protecting**; Option B $\rightarrow$ **+2 Active** & **+1 Building**.
        - Q4: Option B $\rightarrow$ **+2 Deep**; Option A $\rightarrow$ **+2 Present**.
        - Q7: Option B $\rightarrow$ **+2 Deep** & **+1 Protecting**; Option A $\rightarrow$ **+2 Present** & **+1 Building** (Primary Axis B signal & tie-breaker).
        - Q5: Option B $\rightarrow$ **+1 Protecting**; Option A $\rightarrow$ **+1 Building**.
    * **Day 1 Complete**: Finished all required activities $\rightarrow$ **+1.0 Dedication points**.

    ---

    ### 5.2 Day 2: The Mood Room (Calm & Warm Theme)
    * **Intention Word Selector**:
      - *Mechanic*: Text entry selection.
      - *Display-Feed Only*: Populates recap blocks and Section 5 timeline.
    * **This or That: Us Edition (Game 06)**:
      - *Mechanic*: 3 rounds of comfort vs adventure picks and partner choice predictions.
      - *Badge Axis Impact*:
        - Comfort/Home picks $\ge 2$ rounds $\rightarrow$ **+1 Expressive** (Axis A).
        - Adventure/Active picks $\ge 2$ rounds $\rightarrow$ **+1 Active** (Axis A).
        - Partner prediction matches own choice $\ge 2$ rounds $\rightarrow$ **+1 Protecting** (Axis C).
        - All partner predictions differ from own choice (0 matches) $\rightarrow$ **+1 Building** (Axis C).
    * **Mood Candle Picker ($M_2$)**:
      - *Mechanic*: Interactive candle selector with 8 candle options.
      - *Scoring Contribution*:
        - **Connected / Loved / Playful** = **10 pts**
        - **Grateful / Missed** = **6 pts**
        - **Overwhelmed / Frustrated / Distant** = **3 pts**
      - *Badge Axis Impact*:
        - Connected/Playful $\rightarrow$ **+1 Active** (Axis A) & **+1 Present** (Axis B).
        - Loved/Grateful/Missed $\rightarrow$ **+1 Deep** (Axis B).
        - Grateful/Loved $\rightarrow$ **+1 Protecting** (Axis C).
        - Overwhelmed/Frustrated/Distant $\rightarrow$ **+1 Building** (Axis C).
    * **One Good Thing**:
      - *Mechanic*: Free text memory describing the partner (10-80 chars).
      - *Badge Axis Impact*: Input length $\ge 40$ characters $\rightarrow$ **+1 Expressive** (Axis A).
    * **Day 2 Follow-Up Question**:
      - *Mechanic*: Adaptive open text based on selected candle mood.
      - *Scoring Contribution*: Completing (not skipping) = **+1.0 Dedication point**.
      - *Badge Axis Impact*: Input length $\ge 60$ characters $\rightarrow$ **+2 Expressive** (Axis A).

    ---

    ### 5.3 Day 3: The Assumptions Test (Playful & Provocative Theme)
    * **Appreciation Snap**:
      - *Mechanic*: Text entry prompt.
      - *Scoring Contribution*: Completing = **+0.5 Dedication points**.
    * **Finish My Sentence (Game 02)**:
      - *Mechanic*: Complete sentence stem from 4 card options.
      - *Scoring Contribution*: Completing = **+0.5 Dedication points**.
      - *Badge Axis Impact*: Tapped card tag adds **+1** to specific endpoint:
        - Expressive / Deep $\rightarrow$ **+1 Expressive** (Axis A)
        - Active / Playful $\rightarrow$ **+1 Active** (Axis A)
        - Deep / Resilience $\rightarrow$ **+1 Deep** (Axis B)
        - Present / Playful $\rightarrow$ **+1 Present** (Axis B)
        - Protective $\rightarrow$ **+1 Protecting** (Axis C)
        - Building / Active $\rightarrow$ **+1 Building** (Axis C)
    * **Mirror Game T/F Quiz ($MG_3$)**:
      - *Mechanic*: 10 custom statements determined by Day 1 Personality Type.
      - *Scoring Contribution*: 1 pt per TRUE answer $\rightarrow$ up to **10 points** on the final Connection Score.
      - *Badge Axis Impact*:
        - $\ge 7$ TRUE answers $\rightarrow$ **+2 Deep** (Axis B) & **+1 Protecting** (Axis C).
        - $\le 4$ TRUE answers $\rightarrow$ **+2 Present** (Axis B).
    * **Mood Board Match (Game 07 / $MB_3$)**:
      - *Mechanic*: Select exactly 3 tiles descriptive of the relationship.
      - *Scoring Contribution*: Warm tiles count $\div 3 \times 10 \rightarrow$ up to **10 points** on the Connection Score (Warm tiles: `protected`, `grounded`, `valued`, `fluid`, `light`). Completing = **+0.5 Dedication points**.
      - *Badge Axis Impact*: Tiles map to hidden attributes. The majority tag (2 out of 3 selected tiles) awards **+1** to the dominant endpoint for Axis A, Axis B, and Axis C respectively.
    * **The One Certainty**:
      - *Mechanic*: Open text entry.
      - *Scoring Contribution*: Completing = **+0.5 Dedication points**.

    ---

    ### 5.4 Day 4: The Memory Jar (Warm & Emotional Theme)
    * **Memory Jar**:
      - *Mechanic*: Drop a Text, Photo, or Emoji memory.
      - *Scoring Contribution*: Dropping any memory = **+1.0 Dedication points**.
      - *Badge Axis Impact*:
        - Text memory $\rightarrow$ **+2 Expressive** (Axis A).
        - Photo memory $\rightarrow$ **+2 Active** (Axis A).
        - Emoji memory $\rightarrow$ **+1 Active** (Axis A).
    * **Tiny Compliment**:
      - *Mechanic*: Pick feeling word.
      - *Scoring Contribution*: Completing = **+0.5 Dedication points**.
    * **Priority Shuffle (Game 08)**:
      - *Mechanic*: Rank top 3 relationship needs out of 5 choices.
      - *Scoring Contribution*: Completing = **+0.5 Dedication points**.
      - *Badge Axis Impact*:
        - "Deeper conversations" in top 3 $\rightarrow$ **+2 Deep** (Axis B).
        - "More calm, less stress" in top 3 $\rightarrow$ **+1 Deep** (Axis B).
        - "Laughter & lightness" ranked 1st $\rightarrow$ **+2 Present** (Axis B).
        - Rank 1 is Warmth ("More warmth & affection") or Calm ("More calm, less stress") $\rightarrow$ **+2 Protecting** (Axis C).
        - Rank 1 is Laughter ("Laughter & lightness"), Time ("Dedicated time together"), or Conversations ("Deeper conversations") $\rightarrow$ **+2 Building** (Axis C).
    * **The Daily Two Journal**:
      - *Mechanic*: Answer journal question Card 1 and Card 2.
      - *Scoring Contribution*: Both answered = **+0.5 Dedication points**; one answered = **+0.25**.
      - *Badge Axis Impact*: Both answers $\ge 40$ chars each $\rightarrow$ **+1 Expressive** (Axis A).
      - *Tone Check ($T_{\text{bonus}}$)*: Card 1 text is scanned for emotional keywords:
        - *Warm keywords*: grateful, happy, calm, loved, good, content, optimistic, hopeful.
        - *Heavy keywords*: tired, frustrated, anxious, distant, sad, stressed, lonely, overwhelmed.
        - Warm count > Heavy count $\rightarrow$ **Tone = 7 (Warm)**.
        - Heavy count > Warm count $\rightarrow$ **Tone = 4 (Heavy)**.
        - Otherwise (tie or neutral) $\rightarrow$ **Tone = 5 (Neutral)**.
    * **Love Drop (Game 04 Tab A)**:
      - *Mechanic*: Write/leave message for partner.
      - *Scoring Contribution*: Using it = **+0.5 Dedication points**.
      - *Badge Axis Impact*:
        - Using it (any type) $\rightarrow$ **+1 Deep** (Axis B).
        - Envelope type is Compliment $\rightarrow$ **+1 Expressive** (Axis A) & **+1 Protecting** (Axis C).
        - Envelope type is Memory $\rightarrow$ **+1 Protecting** (Axis C).
        - Envelope type is Challenge $\rightarrow$ **+1 Building** (Axis C).
    * **Drop Box (Game 04 Tab B)**:
      - *Mechanic*: Hard feedback entered, reframed locally, raw deleted.
      - *Scoring Contribution*: Using it = **+0.5 Dedication points**.
      - *Badge Axis Impact*: Using it $\rightarrow$ **+2 Deep** (Axis B) & **+1 Building** (Axis C).

    ---

    ### 5.5 Day 5: The Reveal (Bold & Emotional Theme)
    * **The Promise**:
      - *Mechanic*: Input one forward-looking relationship intention.
      - *Scoring Contribution*: Completing = **+1.0 Dedication points** (adds to total before badge tier assignment).
    * **Dedication Score ($D_{\text{Score}}$ - Capped at 7.0)**:
      - Consolidation formula:
        $$D_{\text{Score}} = \min\left(7.0, \sum D_{\text{tasks}} + \text{Streak Bonus}\right)$$
      - *Streak Bonus*: Completed Days 1–4 without resets adds **+1.0**.
      - *Tiers*: Gold Ring (6.0 - 7.0), Standard Ring (4.0 - 5.9), Emerging Ring (2.0 - 3.9).
    * **Connection Score (Capped at 100)**:
      - Consolidation formula:
        $$\text{Connection Score} = \min\left(100, S_1 + V_1 + M_2 + MB_3 + MG_3 + D_{\text{contrib}} + T_{\text{bonus}}\right)$$
      - *Dedication Contribution ($D_{\text{contrib}}$)*: Normalizes Dedication score out of 30 pts:
        $$D_{\text{contrib}} = \left( \frac{D_{\text{Score}}}{7.0} \right) \times 30$$
      - *Trend Bonus ($T_{\text{bonus}}$)*: Compared as follows:
        - Day 1 Slider baseline is High ($\ge 8$): Tone 7 = **+5 pts**; otherwise = **0 pts**.
        - Day 1 Slider baseline is Medium ($5\text{--}7$): Tone 7 = **+10 pts**; Tone 5 = **+5 pts**; Tone 4 = **0 pts**.
        - Day 1 Slider baseline is Low ($\le 4$): Tone 7 or 5 = **+10 pts**; Tone 4 = **+5 pts**.
    * **Partner Knowledge Score (Capped at 10)**:
      - Solo mode: Set to the Day 3 Mirror Game TRUE count.
      - Couple mode recalibration (upon partner entry): Calculates matching prediction answers:
        $$\text{Partner Knowledge Score} = \left(\frac{\text{Total Matching Answers}}{\text{10 Statements}}\right) \times 10$$
    * **Badge Archetype Selection**:
      - Axis endpoint counts totaled across Days 1–4:
        - **Axis A**: If Expressive > Active $\rightarrow$ **Expressive**; else **Active**. *Tie-breaker*: Day 1 Quiz Q1 (A = Expressive, B = Active).
        - **Axis B**: If Deep > Present $\rightarrow$ **Deep**; else **Present**. *Tie-breaker*: Day 1 Quiz Q7 (B = Deep, A = Present).
        - **Axis C**: If Protecting > Building $\rightarrow$ **Protecting**; else **Building**. *Tie-breaker*: Day 1 Slider baseline ($\ge 6$ = Protecting, $\le 5$ = Building).
      - Archetype matching results:
        - **Expressive + Deep + Protecting** = *The Warm Keeper*
        - **Expressive + Deep + Building** = *The Honest Architect*
        - **Expressive + Present + Protecting** = *The Joyful Anchor*
        - **Expressive + Present + Building** = *The Curious Lover*
        - **Active + Deep + Protecting** = *The Quiet Strength*
        - **Active + Deep + Building** = *The Steady Climber*
        - **Active + Present + Protecting** = *The Spark Keeper*
        - **Active + Present + Building** = *The Intentional Partner* (Fallback)

    ---

    ## 🗺️ 6. The Segment Journey: Day 1 Slider Cascade

    The score selected on the Day 1 Connection Slider divides users into 1 of 5 baseline segments, adapting the copy, quiz questions, statements, and reports.

    | Baseline Slider | Baseline Segment | Custom Quiz Focus | Custom Honest Moment copy | Day 3 T/F Statement Set | Day 5 Weather Pattern reads |
    | :--- | :--- | :--- | :--- | :--- | :--- |
    | **1–2** | **The Quiet Crisis** | Loneliness, survival, courage, what broke down. | *"Most people wouldn't admit this. You just did. That takes courage — and it's exactly why you're here."* | Custom statement set focusing on repair, early hope, and effort. | Mixed: *"You came in in crisis, but you showed up. That's reconstruction."* |
    | **3–5** | **The Slow Drift** | Routine, replacement of conversations, quiet drift. | *"Most people open this app at a 5. You opened it at [N]. That's honest. Let's work with that."* | Custom statement set exploring silent boundaries and routine gaps. | Heavy opening, warm close: *"You began in the drift and landed in safety. Growth is real."* |
    | **6–7** | **The Good Place** | Shared language, growth vectors, preservation. | *"Most people open at a 5. You opened at [N]. You're doing better than you think — we'll hold it there."* | Custom statement set focusing on daily noticing, small appreciations, and shared context. | All-warm week: *"Your week felt grounded and consistent. Safe ground."* |
    | **8–9** | **The Strong Foundation** | Comfort zones, conflicts, mutual admiration. | *"[N] out of 10. You're here because you want to protect something good. That's smart."* | Custom statement set highlighting future dreams, shared secrets, and inner worlds. | All-warm week: *"A rare, solid foundation. You're building from high ground."* |
    | **10** | **The Perfect Ten** | True cost of perfect, emotional fatigue, honesty corners. | *"10. Either things are genuinely perfect — or you're being very kind to yourself. Either way, let's begin."* | Custom statement set evaluating emotional disclosures and whether "perfect" is healthy. | Heavy close: *"A perfect ten is a high standard. Be gentle when the weather shifts."* |

    ---

    ## 🔒 7. Conversion Architecture & Open Loops

    The app encourages the partner invite on Day 5 by leaving specific interactions incomplete ("open loops") that only resolve when the partner joins.

    * **Sealed prediction game (Game 06)**: User's choice and prediction of partner's choice are locked. Report Section 8 shows: *"Predictions sealed. 3 matches waiting."*
    * **Sealed sentence stem (Game 02)**: User's selected card and entry are shown; the partner's column displays a frosted card labeled *"Waiting for partner..."*
    * **Love Drop (Envelope Tab)**: Leaving a sealed message places a glowing gold envelope in the Day 5 Memory Jar. The solo user cannot open it; it only unseals on the partner's device upon registration.
    * **Drop Box (AI Reframe Tab)**: Processing difficult thoughts reframes the text locally and deletes the raw entry. Displays a rose envelope in the Day 5 jar labeled *"Something you found the words for"*, preserving total privacy.

    ---

    ## 🛡️ 8. Tone Reframer Engine (Privacy-First)

    To ensure privacy, raw text input in the Drop Box is reframed locally using Regex patterns in memory. Raw text is never saved or stored.

    ```typescript
    const reframePatterns = [
      { pattern: /i hate (when|that|how)/i, reframe: () => "It's hard for me when" },
      { pattern: /you never/i,              reframe: () => "I'd love it if you could" },
      { pattern: /you always/i,             reframe: () => "Sometimes I notice that" },
      { pattern: /i can't (stand|take|deal)/i, reframe: () => "I find it really difficult when" },
      { pattern: /why (don't|won't|can't) you/i, reframe: () => "I wonder if we could" },
      { pattern: /you don't (care|listen|understand)/i, reframe: () => "I sometimes feel unseen when" },
    ];
    ```

    If no patterns match, one of the following softening prefixes is prepended to the lowercased text:
    * *"Something I've been sitting with: [input text]"*
    * *"What I'm really trying to say is: [input text]"*
    * *"Underneath all of this, I think: [input text]"*
    * *"If I'm being honest with myself: [input text]"*

    An async delay of 800ms - 1200ms is simulated to indicate a deliberate reframing action.

    ---

    ## 🎨 9. Design System & Dynamic Theme Registry

    LDA uses a dynamic theme registry coordinating brand assets, gradient backgrounds, custom typography, and haptics.

    * **Fonts Registry**: Playfair Display italic/bold (Serif font for headers, quotes, numbers) and Inter (Sans-serif font for buttons, forms, body text).
    * **Color Themes**:
      - `elegantDark`: Rose pink (`#DB7093`), soft lavender (`#9B7BC8`), deep dark purple base (`#1A0B2E`).
      - `luxePinkGold` (Demo Recommended): Vibrant pink (`#FF6B9D`), champagne gold (`#D4AF37`), deep space navy base (`#0A0A1F`).
      - `romanticRoseGold`: Rose gold (`#E8B4B8`), dusty rose (`#C9A0A0`), deep burgundy base (`#1A0F14`).
      - `midnightPassion`: Deep pink (`#FF1493`), hot pink (`#FF69B4`), midnight blue base (`#0C0C1E`).
    * **Haptics Hierarchy**: `selection` for slider ticks/taps, `impactMedium` for button confirmations, `notificationSuccess` for screen completions, and `notificationWarning` for shield activations.

    ---

    ## ✅ 10. Verification of Implementation Status

    The business logic and scoring requirements have been fully verified against the project codebase.

    ```mermaid
    classDiagram
        class useDayStore {
            day1: Day1Data
            day2: Day2Data
            day3: Day3Data
            day4: Day4Data
            day5: Day5Data
        }
        class Day5Scoring {
            +consolidate(day1, day2, day3, day4, promise) ConsolidatedScoringResult
        }
        class badgeCalculator {
            +calculateBadge(day1, day2, day3, day4) BadgeResult
        }
        class dayRouter {
            +resolveRoute() RouterResult
        }
        class toneReframer {
            +reframeText(rawText) String
        }
        class letterGenerator {
            +generateLetter(name, score, type, memory, certainty) String
        }

        Day5Scoring ..> useDayStore : reads
        badgeCalculator --> Day5Scoring : delegates
        dayRouter ..> useDayStore : checks completion
    ```

    | Component | File Path | Status | Verification Note |
    | :--- | :--- | :---: | :--- |
    | **Day Router & Shield** | `src/services/dayRouter.ts` | **Implemented** | Properly evaluates completion flags D1-D5 sequentially and triggers Streak Shield application. |
    | **Day 1 scoring rules** | `src/services/scoring/day1Scoring.ts` | **Implemented** | Computes slider * 2, vibe points (10/7/3), and quiz axes signals. |
    | **Day 2 scoring rules** | `src/services/scoring/day2Scoring.ts` | **Implemented** | Candle mood points, Tot picks analysis, and text character checks. |
    | **Day 3 scoring rules** | `src/services/scoring/day3Scoring.ts` | **Implemented** | Sentence stem tagging, mirror True/False matching, and Mood board majority axes. |
    | **Day 4 scoring rules** | `src/services/scoring/day4Scoring.ts` | **Implemented** | Priority shuffle need rules, compli drop tags, journal length checks, and trend bonus calculator. |
    | **Consolidated Engine** | `src/services/scoring/day5Scoring.ts` | **Implemented** | Consolidates subtask tallies, caps Dedication to 7.0 and Connection to 100, maps badge archetypes with tie-breakers. |
    | **Badge Calculator** | `src/services/badgeCalculator.ts` | **Implemented** | Correctly delegates all tasks to `Day5Scoring.consolidate`. |
    | **Letter Generator** | `src/services/letterGenerator.ts` | **Implemented** | Selects template deterministically based on user-hash; pulls Day 4 memory fragments. |
    | **Tone Reframer** | `src/services/toneReframer.ts` | **Implemented** | Locally replaces hostile regex phrases and appends random softening prefixes. |
