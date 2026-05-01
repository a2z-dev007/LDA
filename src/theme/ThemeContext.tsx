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
  useEffect,
  ReactNode,
} from 'react';
import { Appearance } from 'react-native';
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
export const ACTIVE_LIGHT_THEME: LightThemeName = 'loveBloom';
export const ACTIVE_DARK_THEME: DarkThemeName = 'midnightGarden';

// Force dark mode - set to false to use light theme
const FORCE_DARK_MODE = false;
// Brand Colors:
// Primary: #D88084
// Background: #23314A
// Secondary: #8FA1B1
// Nectarine: #D7897F
// Pêche: #F9B95C
// Menthe: #96C7B3
// Lagune: #6398A9
// ─────────────────────────────────────────────────────────────
//  Resolver — returns dark theme when forced, otherwise system
// ─────────────────────────────────────────────────────────────
function resolveTheme(): ColorTheme {
  if (FORCE_DARK_MODE) {
    return darkThemes[ACTIVE_DARK_THEME];
  }
  
  const colorScheme = Appearance.getColorScheme();
  if (colorScheme === 'dark') {
    return darkThemes[ACTIVE_DARK_THEME];
  }
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

  // Listen to system appearance changes (only if not forcing dark mode)
  useEffect(() => {
    if (FORCE_DARK_MODE) {
      // Dark mode is forced, no need to listen to system changes
      return;
    }
    
    const sub = Appearance.addChangeListener(() => {
      setTheme(resolveTheme());
    });
    return () => sub.remove();
  }, []);

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
