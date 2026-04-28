/**
 * useTheme()
 * ──────────
 * React hook that returns live theme colors and re-renders
 * automatically when the user switches between light and dark mode.
 *
 * Usage:
 *   const { colors, isDark } = useTheme();
 *
 * For StyleSheet.create() outside components, keep using the
 * static `colors` export from '../theme' — it reflects the
 * system appearance at app launch.
 */

import { useState, useEffect } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import {
  darkThemes,
  lightThemes,
  themePairs,
  DarkThemeName,
  ColorTheme,
} from './colorThemes';

// Must match the ACTIVE_DARK_THEME in colors.ts
const ACTIVE_DARK_THEME: DarkThemeName = 'midnightPassion';

function resolveTheme(scheme: ColorSchemeName): ColorTheme {
  if (scheme === 'light') {
    return lightThemes[themePairs[ACTIVE_DARK_THEME]];
  }
  return darkThemes[ACTIVE_DARK_THEME];
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
  const [scheme, setScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme(),
  );

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setScheme(colorScheme);
    });
    return () => sub.remove();
  }, []);

  const theme = resolveTheme(scheme);
  const themeColors = buildColors(theme);

  return {
    colors: themeColors,
    isDark: theme.isDark,
    themeName: theme.name,
    scheme,
  };
}
