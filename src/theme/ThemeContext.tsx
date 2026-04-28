/**
 * ThemeContext
 * ────────────
 * Provides live theme colors to the entire app via React context.
 * Listens to Appearance changes and re-renders all consumers
 * automatically when the user switches light ↔ dark in system settings.
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
import { Appearance, ColorSchemeName } from 'react-native';
import {
  darkThemes,
  lightThemes,
  themePairs,
  DarkThemeName,
  ColorTheme,
} from './colorThemes';

// ─────────────────────────────────────────────────────────────
//  ✏️  ONE LINE TO CHANGE THE WHOLE APP THEME PAIR
//  Options: 'elegantDark' | 'luxePinkGold' | 'romanticRoseGold' | 'midnightPassion'
// ─────────────────────────────────────────────────────────────
export const ACTIVE_DARK_THEME: DarkThemeName = 'midnightPassion';

// ─────────────────────────────────────────────────────────────
//  Resolver
// ─────────────────────────────────────────────────────────────
function resolveTheme(scheme: ColorSchemeName): ColorTheme {
  if (scheme === 'light') {
    return lightThemes[themePairs[ACTIVE_DARK_THEME]];
  }
  return darkThemes[ACTIVE_DARK_THEME];
}

export type AppColors = ColorTheme;

// ─────────────────────────────────────────────────────────────
//  Context
// ─────────────────────────────────────────────────────────────
const ThemeContext = createContext<AppColors>(
  resolveTheme(Appearance.getColorScheme()),
);

// ─────────────────────────────────────────────────────────────
//  Provider — wrap the app once
// ─────────────────────────────────────────────────────────────
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<AppColors>(() =>
    resolveTheme(Appearance.getColorScheme()),
  );

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(resolveTheme(colorScheme));
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
