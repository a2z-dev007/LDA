# Let's Date Again (LDA) — Google AI Gemini Integration Report

This document outlines the setup, architecture, and instructions for using the newly integrated Google AI (Gemini) helper in the Let's Date Again (LDA) mobile application.

---

## 🛠️ 1. Architecture & Files Added

The integration consists of a reusable service layer, a unified UI trigger button, and integrations on the text input screens.

### 📄 New Files
1. **AI Service Layer**: [`src/services/googleAI.ts`](file:///E:/LDA/src/services/googleAI.ts)
   - Persists the Gemini API key securely in MMKV.
   - Restructures and reframes input strings via a raw HTTP request directly to the Gemini API (`gemini-2.5-flash`). This bypasses native/web bundler polyfill issues in React Native.
   - Tailors prompt contexts (e.g., appreciation, promises, relationship certainty) to match the warm, authentic, and emotionally intelligent voice of the LDA application.
2. **AI Component Trigger**: [`src/components/common/EnhanceAIButton.tsx`](file:///E:/LDA/src/components/common/EnhanceAIButton.tsx)
   - A reusable button with loading spinners, haptics, and disabled states.
   - **Self-Contained API Key Setup**: If no API key is detected, clicking the button triggers a beautiful slide-up modal (via the app's `CustomBottomSheet`) prompting the developer or user to paste their API key. It validates the key in real-time via a test call before saving and executing the enhancement.

### 📄 Modified Screens
- **Day 2 — One Good Thing**: [`src/screens/day2/Day2OneGoodThing.tsx`](file:///E:/LDA/src/screens/day2/Day2OneGoodThing.tsx) (Appreciation)
- **Day 3 — One Certainty**: [`src/screens/day3/Day3OneCertainty.tsx`](file:///E:/LDA/src/screens/day3/Day3OneCertainty.tsx) (Certainty)
- **Day 5 — The Promise**: [`src/screens/day5/Day5ThePromise.tsx`](file:///E:/LDA/src/screens/day5/Day5ThePromise.tsx) (Promise)

---

## 🔑 2. Gemini API Key Configuration

To test this feature locally, you have two options:

### Option A: Paste in-app (Recommended)
1. Launch the app and navigate to any text input screen (e.g. Day 2 "One Good Thing").
2. Type at least 5 characters to enable the **Enhance AI** button.
3. Tap **Enhance AI**.
4. If no key is set, the Gemini AI Setup bottom sheet will slide up.
5. Paste your API Key (starting with `AIzaSy...`). You can get one for free at [Google AI Studio](https://aistudio.google.com/app/apikey).
6. Tap **Validate & Save**. Once validated, the modal closes and your text is enhanced automatically!

### Option B: Hardcode in Code (For quick testing)
Open [`src/services/googleAI.ts`](file:///E:/LDA/src/services/googleAI.ts) and paste your key in the constant:
```typescript
const HARDCODED_API_KEY = 'YOUR_GEMINI_API_KEY_HERE';
```

---

## 🚀 3. How to Reuse "Enhance AI" on any TextInput

You can add this to any text entry screen in less than 2 minutes:

### Step 1: Import the component
```typescript
import { EnhanceAIButton } from '../../components/common/EnhanceAIButton';
```

### Step 2: Render it alongside your TextInput
For best styling, wrap your `TextInput` and the `EnhanceAIButton` in a container to show them together. Below is a standard setup:

```tsx
const [text, setText] = useState('');

return (
  <View style={styles.inputContainer}>
    <TextInput
      style={styles.input}
      placeholder="Write here..."
      value={text}
      onChangeText={setText}
      multiline
      maxLength={200}
    />
    
    <View style={styles.charCountContainer}>
      <Text style={styles.charCountText}>
        {text.length} / 200 chars
      </Text>
      
      <EnhanceAIButton
        text={text}
        onEnhanced={setText}
        context="general" // Options: 'appreciation' | 'certainty' | 'promise' | 'memory' | 'frustration_reframe' | 'general'
        maxLength={200}
        disabled={text.trim().length < 5} // Disables if text is empty/too short
      />
    </View>
  </View>
);
```

---

## 🎨 4. AI Prompt Contexts Available

The `context` parameter adjusts Gemini's prompts to suit the activity's emotional goal:

| Context Code | Description / Tone |
| :--- | :--- |
| `appreciation` | Focuses on heartfelt appreciation of a partner. Keeps it grounded and simple. |
| `certainty` | Reinforces security, trust, and deep, reassuring foundational truths. |
| `promise` | Focuses on realistic, loving, and constructive behaviors to change or commit to. |
| `memory` | Nostalgic and warm reflections of shared experiences. |
| `frustration_reframe`| Reframes complaints or irritations into vulnerable, constructive "I" statements. |
| `general` | General emotional polishing and spelling/grammar check. |
