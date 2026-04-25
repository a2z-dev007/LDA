# Theme Management Guide

## Centralized Theme System

All theme colors and styles are managed from a single location: `src/theme/colors.ts`

### How It Works

1. **Single Source of Truth**: All colors are defined in `src/theme/colors.ts`
2. **Import Everywhere**: Screens import colors using `import { colors } from '../theme'`
3. **Change Once, Update Everywhere**: Modify colors in one file to update the entire app

## Current Theme: Dark Elegant

### Color Palette

```typescript
// Brand Colors
primary: '#DB7093'      // Rose Pink - Used for buttons, accents, logo
secondary: '#9B7BC8'    // Soft Lavender
accent: '#B8A0D6'       // Light Purple

// Background Colors
dark: '#1A0B2E'         // Deep Dark Purple (main background)
darkMid: '#2D1B4E'      // Mid Dark Purple (gradient middle)

// Gradient Colors
gradientStart: '#1A0B2E'
gradientMid: '#2D1B4E'
gradientEnd: '#1A0B2E'

// Glass/Transparent Surfaces
glassLight: 'rgba(255, 255, 255, 0.12)'   // Light glass effect
glassBorder: 'rgba(255, 255, 255, 0.18)'  // Glass borders
glassHeavy: 'rgba(255, 255, 255, 0.25)'   // Heavier glass

// Text Colors
textLight: '#FFFFFF'                       // Primary text on dark
textMuted: 'rgba(255, 255, 255, 0.7)'     // Secondary text
textSubtle: 'rgba(255, 255, 255, 0.45)'   // Subtle text (footers)
```

## Usage Examples

### In Screens

```typescript
import { colors } from '../theme';

// Gradient
<LinearGradient
  colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
  style={styles.gradient}
>

// Styles
const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
  },
  text: {
    color: colors.textLight,
  },
  card: {
    backgroundColor: colors.glassLight,
    borderColor: colors.glassBorder,
  },
});
```

### In App.tsx

```typescript
import { colors } from './src/theme';

<StatusBar backgroundColor={colors.dark} />
<View style={{ backgroundColor: colors.dark }} />
```

## Screens Using Centralized Theme

✅ **SplashScreen** - Fully themed
✅ **CommitmentScreen** - Fully themed
✅ **App.tsx** - Using theme colors
✅ **Android styles.xml** - Needs manual update (see below)

## Updating Android Native Styles

When you change theme colors, also update:

**File**: `android/app/src/main/res/values/styles.xml`

```xml
<item name="android:statusBarColor">#1A0B2E</item>
<item name="android:navigationBarColor">#1A0B2E</item>
```

Replace `#1A0B2E` with the new `colors.dark` value.

## How to Change the Theme

### Example: Switching to a Blue Theme

1. Open `src/theme/colors.ts`
2. Update the colors:

```typescript
export const colors = {
  primary: '#4A90E2',              // Blue
  dark: '#0A1929',                 // Dark Navy
  darkMid: '#1E3A5F',              // Mid Navy
  gradientStart: '#0A1929',
  gradientMid: '#1E3A5F',
  gradientEnd: '#0A1929',
  // ... rest stays the same
};
```

3. Update Android styles.xml with new dark color
4. **That's it!** All screens update automatically

## Benefits

- ✅ **Consistency**: All screens use the same colors
- ✅ **Easy Updates**: Change once, update everywhere
- ✅ **Maintainability**: Single file to manage
- ✅ **Type Safety**: TypeScript ensures correct usage
- ✅ **Scalability**: Easy to add new color variants

## Adding New Colors

To add a new color to the theme:

1. Add to `src/theme/colors.ts`:
```typescript
export const colors = {
  // ... existing colors
  newColor: '#HEXCODE',
};
```

2. Use in any screen:
```typescript
import { colors } from '../theme';

const styles = StyleSheet.create({
  element: {
    backgroundColor: colors.newColor,
  },
});
```

## Theme Variants (Future)

You can create theme variants by exporting different color sets:

```typescript
// src/theme/colors.ts
export const darkTheme = { ... };
export const lightTheme = { ... };

// Use based on user preference
export const colors = isDarkMode ? darkTheme : lightTheme;
```
