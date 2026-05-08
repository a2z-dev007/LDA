/**
 * useTheme()
 * ──────────
 * React hook that returns live theme colors.
 * The app uses premium light themes exclusively — always returns
 * the active light theme regardless of system appearance.
 *
 * Usage:
 *   const { colors, isDark } = useTheme();
 *
 * For StyleSheet.create() outside components, keep using the
 * static `colors` export from '../theme'.
 */

import { useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import {
  lightThemes,
  LightThemeName,
  ColorTheme,
} from './colorThemes';

// Must match ACTIVE_DARK_THEME in ThemeContext.tsx
const ACTIVE_THEME: LightThemeName = 'velvetMauve';

function resolveTheme(): ColorTheme {
  return lightThemes[ACTIVE_THEME];
}

function buildColors(theme: ColorTheme) {
  return {
    primary: theme.primary,
    secondary: theme.secondary,
    accent: theme.accent,

    dark: theme.dark,
    darkMid: theme.darkMid,
    light: theme.light,
    white: theme.white,

    text: theme.text,
    textSecondary: theme.textSecondary,
    textHint: theme.textHint,
    surface: theme.surface,
    surfaceBorder: theme.surfaceBorder,
    onPrimary: theme.onPrimary,

    gradientStart: theme.gradientStart,
    gradientMid: theme.gradientMid,
    gradientEnd: theme.gradientEnd,

    buttonGradientStart: theme.buttonGradientStart,
    buttonGradientEnd: theme.buttonGradientEnd,

    glassLight: theme.glassLight,
    glassBorder: theme.glassBorder,
    glassHeavy: theme.glassHeavy,

    textDark: theme.textDark,
    textLight: theme.textLight,
    textMuted: theme.textMuted,
    textSubtle: theme.textSubtle,

    glowPrimary: theme.glowPrimary,
    glowSecondary: theme.glowSecondary,

    day1: theme.day1,
    day2: theme.day2,
    day3: theme.day3,
    day4: theme.day4,
    day5: theme.day5,

    error: theme.error,
    success: theme.success,

    isDark: theme.isDark,
  };
}

export type ThemeColors = ReturnType<typeof buildColors>;

export function useTheme() {
  // Keep Appearance listener for API compatibility, but theme never changes
  const [, setTick] = useState(0);

  useEffect(() => {
    const sub = Appearance.addChangeListener(() => {
      // Light-only: no theme switch needed
      setTick(t => t); // no-op re-render guard
    });
    return () => sub.remove();
  }, []);

  const theme = resolveTheme();
  const themeColors = buildColors(theme);

  return {
    colors: themeColors,
    isDark: false,
    themeName: theme.name,
    scheme: 'light' as const,
  };
}
