/**
 * ThemeContext
 * ────────────
 * Provides live theme colors to the entire app via React context.
 * Supports both light and dark themes with automatic system appearance detection.
 *
 * Wrap your app once with <ThemeProvider> (done in App.tsx).
 * Consume anywhere with useAppColors() — drop-in replacement for
 * the static `colors` import in every component.
 *
 *   const colors = useAppColors();
 */

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';
import {
  lightThemes,
  darkThemes,
  LightThemeName,
  DarkThemeName,
  ColorTheme,
} from './colorThemes';

// ─────────────────────────────────────────────────────────────
//  ✏️  THEME CONFIGURATION
//  Set your preferred light and dark themes here
// ─────────────────────────────────────────────────────────────
export const ACTIVE_LIGHT_THEME: LightThemeName = 'sageGarden';
export const ACTIVE_DARK_THEME: DarkThemeName = 'midnightGarden';

// Force dark mode - set to false to use light theme
const FORCE_DARK_MODE = false;
// ─────────────────────────────────────────────────────────────
//  Resolver — always returns light theme, ignores system setting
// ─────────────────────────────────────────────────────────────
function resolveTheme(): ColorTheme {
  if (FORCE_DARK_MODE) {
    return darkThemes[ACTIVE_DARK_THEME];
  }
  // Always use light theme — ignore system dark mode
  return lightThemes[ACTIVE_LIGHT_THEME];
}

export type AppColors = ColorTheme;

// ─────────────────────────────────────────────────────────────
//  Context
// ─────────────────────────────────────────────────────────────
const ThemeContext = createContext<AppColors>(resolveTheme());

// ─────────────────────────────────────────────────────────────
//  Provider — wrap the app once
// ─────────────────────────────────────────────────────────────
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<AppColors>(() => resolveTheme());

  // No system appearance listener — light theme is always applied
  // To re-enable system dark mode support, restore the Appearance listener
  // and update resolveTheme() accordingly.

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────
//  Hook — use inside any component
// ─────────────────────────────────────────────────────────────
export function useAppColors(): AppColors {
  return useContext(ThemeContext);
}
