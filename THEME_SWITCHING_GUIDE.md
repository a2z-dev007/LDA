# 🎨 Theme Switching Guide

## How to Switch Themes

### Quick Switch (1 Line Change!)

Open `src/theme/colors.ts` and change line 10:

```typescript
const ACTIVE_THEME: ThemeName = 'luxePinkGold';  // Change this!
```

That's it! The entire app will use the new theme.

---

## Available Themes

### 1. **Elegant Dark** (Current)
```typescript
const ACTIVE_THEME: ThemeName = 'elegantDark';
```

**Colors:**
- Primary: Rose Pink (#DB7093)
- Secondary: Soft Lavender (#9B7BC8)
- Background: Deep Dark Purple (#1A0B2E)
- Style: Sophisticated, elegant, mysterious

**Best For:** Premium, intimate, sophisticated feel

---

### 2. **Luxe Pink & Gold** ⭐ (From Logo)
```typescript
const ACTIVE_THEME: ThemeName = 'luxePinkGold';
```

**Colors:**
- Primary: Vibrant Pink (#FF6B9D) - from heart
- Secondary: Champagne Gold (#D4AF37) - from ring/text
- Accent: Light Pink (#FFB6C1) - from highlights
- Background: Deep Navy (#0A0A1F) - from logo background
- Glow: Pink and Gold glowing effects

**Features:**
- ✨ Glowing pink gradient buttons
- 💛 Gold accents for headings
- 💗 Pink text highlights
- 🌟 Premium gold borders on glass elements
- 🎆 Pink and gold glow effects

**Best For:** Luxurious, romantic, eye-catching

---

### 3. **Romantic Rose Gold**
```typescript
const ACTIVE_THEME: ThemeName = 'romanticRoseGold';
```

**Colors:**
- Primary: Rose Gold (#E8B4B8)
- Secondary: Dusty Rose (#C9A0A0)
- Background: Deep Burgundy (#1A0F14)
- Style: Warm, romantic, soft

**Best For:** Gentle, warm, romantic atmosphere

---

### 4. **Midnight Passion**
```typescript
const ACTIVE_THEME: ThemeName = 'midnightPassion';
```

**Colors:**
- Primary: Deep Pink (#FF1493)
- Secondary: Hot Pink (#FF69B4)
- Background: Midnight Blue (#0C0C1E)
- Glow: Intense pink glow effects

**Features:**
- 🔥 Most vibrant pink
- 🌙 Deep midnight blue background
- ⚡ Strongest glow effects
- 💥 High contrast, bold

**Best For:** Bold, passionate, energetic feel

---

## Theme Features

### All Themes Include:

1. **Background Gradients**
   - Smooth dark gradients for depth
   - Consistent across all screens

2. **Glass Morphism**
   - Semi-transparent cards
   - Themed borders
   - Depth and layering

3. **Glowing Buttons**
   - Gradient buttons with glow effects
   - Theme-specific colors
   - Disabled states

4. **Text Hierarchy**
   - Primary: Main actions, headings
   - Secondary: Supporting elements
   - Muted: Less important text
   - Subtle: Footer, hints

5. **Day Colors**
   - 5 progressive colors for each day
   - Matches theme palette

---

## Using Glowing Gradient Buttons

### Import the GlowButton component:

```typescript
import { GlowButton } from '../components/GlowButton';

// Gradient button (default)
<GlowButton
  title="Begin Your Journey →"
  onPress={handlePress}
/>

// Solid button
<GlowButton
  title="Continue"
  onPress={handlePress}
  variant="solid"
/>

// Disabled state
<GlowButton
  title="Not Ready"
  onPress={handlePress}
  disabled={true}
/>
```

---

## Color Usage Guide

### For Headings (Playfair Display):
```typescript
{
  fontFamily: 'PlayfairDisplay-Italic',
  color: colors.primary,  // Gold in luxePinkGold theme
}
```

### For Body Text:
```typescript
{
  fontFamily: 'DMSans-Regular',
  color: colors.textLight,  // White
}
```

### For Accents:
```typescript
{
  color: colors.secondary,  // Pink in luxePinkGold theme
}
```

### For Glass Cards:
```typescript
{
  backgroundColor: colors.glassLight,
  borderColor: colors.glassBorder,  // Gold border in luxePinkGold
}
```

### For Glowing Elements:
```typescript
{
  shadowColor: colors.glowPrimary,  // Pink glow
  shadowOpacity: 0.6,
  shadowRadius: 16,
}
```

---

## Recommended Theme for Client Demo

### **Luxe Pink & Gold** (`luxePinkGold`)

**Why?**
1. ✅ Extracted directly from the logo
2. ✅ Premium gold and pink combination
3. ✅ Glowing effects for modern feel
4. ✅ High contrast and readability
5. ✅ Matches brand identity perfectly

**To Activate:**
```typescript
// src/theme/colors.ts line 10
const ACTIVE_THEME: ThemeName = 'luxePinkGold';
```

---

## Creating Custom Themes

1. Open `src/theme/colorThemes.ts`
2. Copy an existing theme
3. Modify colors
4. Add to themes registry
5. Use in `colors.ts`

Example:
```typescript
export const myCustomTheme: ColorTheme = {
  name: 'My Custom Theme',
  description: 'Description here',
  primary: '#YOUR_COLOR',
  // ... rest of colors
};

export const themes = {
  // ... existing themes
  myCustom: myCustomTheme,
};
```

---

## Testing Themes

1. Change `ACTIVE_THEME` in `src/theme/colors.ts`
2. Save the file
3. Reload the app (Cmd+R or Ctrl+R)
4. Theme changes instantly!

**Note:** For production, you might want to add a theme switcher UI that lets users choose their preferred theme.

---

## Theme Comparison

| Feature | Elegant Dark | Luxe Pink & Gold | Romantic Rose Gold | Midnight Passion |
|---------|--------------|------------------|-------------------|------------------|
| Vibe | Sophisticated | Luxurious | Warm & Soft | Bold & Energetic |
| Primary Color | Rose Pink | Vibrant Pink | Rose Gold | Deep Pink |
| Accent | Lavender | Champagne Gold | Dusty Rose | Hot Pink |
| Background | Purple | Navy | Burgundy | Midnight Blue |
| Glow Effect | Subtle | Strong | Soft | Intense |
| Best For | Premium | Luxury | Romance | Passion |

---

## Quick Reference

```typescript
// Switch theme (src/theme/colors.ts)
const ACTIVE_THEME: ThemeName = 'luxePinkGold';

// Use colors anywhere
import { colors } from '../theme';

// Primary action
color: colors.primary

// Background
backgroundColor: colors.dark

// Glass effect
backgroundColor: colors.glassLight
borderColor: colors.glassBorder

// Glow
shadowColor: colors.glowPrimary
```

---

## 🎯 Recommendation

For your client demo, use **Luxe Pink & Gold** theme as it:
- Matches the logo perfectly
- Has premium gold accents
- Features glowing pink buttons
- Looks modern and luxurious
- High visual impact

Just change one line and you're done! 🚀
