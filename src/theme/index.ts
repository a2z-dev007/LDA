/**
 * Theme barrel export
 * ───────────────────
 *
 * COLORS — two ways:
 *
 *  Static (StyleSheet.create, module-level code):
 *    import { colors } from '../theme';
 *
 *  Reactive (inside React components — re-renders on light/dark switch):
 *    import { useAppColors } from '../theme';
 *    const colors = useAppColors();
 *
 * PROVIDER — wrap the app once in App.tsx (already done):
 *    import { ThemeProvider } from '../theme';
 *    <ThemeProvider><App /></ThemeProvider>
 */

export * from './colors';
export * from './typography';
export * from './metrics';
export { ThemeProvider, useAppColors, ACTIVE_DARK_THEME } from './ThemeContext';
export type { AppColors } from './ThemeContext';

// Keep useTheme for any existing usages
export { useTheme } from './useTheme';
export type { ThemeColors } from './useTheme';

export { spacing, radius } from './metrics';
