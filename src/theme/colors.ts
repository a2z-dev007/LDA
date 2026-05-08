/**
 * colors.ts
 * ─────────
 * Static color snapshot — resolved once at module load.
 * Currently forced to use dark theme (Midnight Garden).
 *
 * For live reactive colors inside components use:
 *   const colors = useAppColors();   ← preferred in components
 *
 * The active themes are controlled by ACTIVE_LIGHT_THEME and
 * ACTIVE_DARK_THEME in ThemeContext.tsx.
 */

import { lightThemes, darkThemes } from './colorThemes';
import { ACTIVE_LIGHT_THEME, ACTIVE_DARK_THEME } from './ThemeContext';

// Force dark mode - always use dark theme
const FORCE_DARK_MODE = true;

// Resolve to dark theme when forced, otherwise check system appearance
const _t = FORCE_DARK_MODE
  ? darkThemes[ACTIVE_DARK_THEME]
  : lightThemes[ACTIVE_LIGHT_THEME];

export const colors = {
  primary: _t.primary,
  secondary: _t.secondary,
  accent: _t.accent,

  dark: _t.dark,
  darkMid: _t.darkMid,
  light: _t.light,
  white: _t.white,

  text: _t.text,
  textSecondary: _t.textSecondary,
  textHint: _t.textHint,
  surface: _t.surface,
  surfaceBorder: _t.surfaceBorder,
  onPrimary: _t.onPrimary,

  gradientStart: _t.gradientStart,
  gradientMid: _t.gradientMid,
  gradientEnd: _t.gradientEnd,

  buttonGradientStart: _t.buttonGradientStart,
  buttonGradientEnd: _t.buttonGradientEnd,

  glassLight: _t.glassLight,
  glassBorder: _t.glassBorder,
  glassHeavy: _t.glassHeavy,

  textDark: _t.textDark,
  textLight: _t.textLight,
  textMuted: _t.textMuted,
  textSubtle: _t.textSubtle,

  glowPrimary: _t.glowPrimary,
  glowSecondary: _t.glowSecondary,

  day1: _t.day1,
  day2: _t.day2,
  day3: _t.day3,
  day4: _t.day4,
  day5: _t.day5,

  error: _t.error,
  success: _t.success,

  isDark: _t.isDark,
};

export const currentTheme = {
  name: _t.name,
  description: _t.description,
  isDark: _t.isDark,
};

// Re-export theme registry
export { themes, type ThemeName, type DarkThemeName, type LightThemeName } from './colorThemes';
