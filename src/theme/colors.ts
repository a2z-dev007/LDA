import { themes, ThemeName } from './colorThemes';

// ============================================
// 🎨 SWITCH THEME HERE
// ============================================
// Change this to switch the entire app theme:
// - 'elegantDark' (current theme)
// - 'luxePinkGold' (from logo - pink heart & gold)
// - 'romanticRoseGold' (soft rose gold)
// - 'midnightPassion' (deep blue with hot pink)

const ACTIVE_THEME: ThemeName = 'luxePinkGold';

// ============================================
// Export active theme colors
// ============================================
const activeTheme = themes[ACTIVE_THEME];

// Debug logging
console.log('🎨 Active Theme:', ACTIVE_THEME);
console.log('🎨 Theme Name:', activeTheme.name);
console.log('🎨 Primary Color:', activeTheme.primary);
console.log('🎨 Background:', activeTheme.dark);

export const colors = {
  // Brand Core
  primary: activeTheme.primary,
  secondary: activeTheme.secondary,
  accent: activeTheme.accent,
  
  // Backgrounds
  dark: activeTheme.dark,
  darkMid: activeTheme.darkMid,
  light: activeTheme.light,
  white: activeTheme.white,
  
  // Gradients
  gradientStart: activeTheme.gradientStart,
  gradientMid: activeTheme.gradientMid,
  gradientEnd: activeTheme.gradientEnd,
  
  // Button Gradients (for glowing effects)
  buttonGradientStart: activeTheme.buttonGradientStart,
  buttonGradientEnd: activeTheme.buttonGradientEnd,
  
  // Glass/Transparent Surfaces
  glassLight: activeTheme.glassLight,
  glassBorder: activeTheme.glassBorder,
  glassHeavy: activeTheme.glassHeavy,
  
  // Text Colors
  textDark: activeTheme.textDark,
  textLight: activeTheme.textLight,
  textMuted: activeTheme.textMuted,
  textSubtle: activeTheme.textSubtle,
  
  // Glow Effects
  glowPrimary: activeTheme.glowPrimary,
  glowSecondary: activeTheme.glowSecondary,

  // Day Accent Colors
  day1: activeTheme.day1,
  day2: activeTheme.day2,
  day3: activeTheme.day3,
  day4: activeTheme.day4,
  day5: activeTheme.day5,

  // Feedback
  error: activeTheme.error,
  success: activeTheme.success,
};

// Export theme info for debugging/display
export const currentTheme = {
  name: activeTheme.name,
  description: activeTheme.description,
};

// Export all available themes for theme switcher UI (future feature)
export { themes, type ThemeName } from './colorThemes';
