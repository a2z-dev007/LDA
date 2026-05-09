// Color Theme System
// All themes are premium light themes — no dark mode.

import { IMAGE } from "../assets/image/bg-images";

export interface ColorTheme {
  name: string;
  description: string;
  isDark: boolean;
  bgImage?:"",

  // Brand Colors
  primary: string;
  secondary: string;
  accent: string;

  // Backgrounds
  dark: string;       // main screen background
  darkMid: string;    // card / surface background
  light: string;      // subtle tinted surface
  white: string;      // pure white / near-white
  glassWhite:string;

  // ── Semantic tokens ──────────────────────────────────────
  text: string;           // primary body text
  textSecondary: string;  // secondary / muted text  (~60% opacity)
  textHint: string;       // placeholder / hint text  (~35% opacity)
  surface: string;        // card / input background
  surfaceBorder: string;  // card / input border
  onPrimary: string;      // text/icon ON a primary-colored button
  // ─────────────────────────────────────────────────────────

  // Gradients
  gradientStart: string;
  gradientMid: string;
  gradientEnd: string;
  gradientBtn?: any;
  // Button Gradients
  buttonGradientStart: string;
  buttonGradientEnd: string;

  // Glass / Transparent Surfaces
  glassLight: string;
  glassBorder: string;
  glassHeavy: string;

  // Text Colors
  textDark: string;
  textLight: string;
  textMuted: string;
  textSubtle: string;

  // Glow Effects
  glowPrimary: string;
  glowSecondary: string;

  // Day Accent Colors
  day1: string;
  day2: string;
  day3: string;
  day4: string;
  day5: string;

  // Feedback
  error: string;
  success: string;
}

// ── Midnight Garden (DARK) ────────────────────────────────
export const midnightGardenTheme: ColorTheme = {
  name: 'Midnight Garden',
  description: 'Deep navy with nectarine coral, pêche, menthe and lagune accents',
  isDark: true,

  primary: '#E8799D',           // primary brand color — warm, inviting
  secondary: '#8FA1B1',         // secondary mist blue — sophisticated complement
  accent: '#F9B95C',            // golden pêche — warm highlight

  dark: '#1A2332',              // deep navy — main background
  darkMid: '#23314A',           // navy blue — card surface (brand background)
  light: '#2D3E57',             // lighter navy — elevated surfaces
  white: '#F5F7FA',             // off-white for text

  text: '#F5F7FA',              // off-white — primary text
  textSecondary: 'rgba(245,247,250,0.70)',
  textHint: 'rgba(245,247,250,0.40)',
  surface: 'rgba(216,128,132,0.08)',
  surfaceBorder: 'rgba(216,128,132,0.20)',
  onPrimary: '#1A2332',

  gradientStart: '#1A2332',
  gradientMid: '#23314A',
  gradientEnd: '#2D3E57',

  buttonGradientStart:  '#D63F6E',
  buttonGradientEnd: '#D7897F',
  glassWhite: 'rgba(255,255,255,0.1)',
  
  glassLight: 'rgba(216,128,132,0.10)',
  glassBorder: 'rgba(143,161,177,0.25)',
  glassHeavy: 'rgba(216,128,132,0.18)',

  textDark: '#1A2332',
  textLight: '#F5F7FA',
  textMuted: 'rgba(245,247,250,0.70)',
  textSubtle: 'rgba(245,247,250,0.40)',

  glowPrimary: 'rgba(216,128,132,0.35)',
  glowSecondary: 'rgba(143,161,177,0.30)',

  day1: '#D88084',
  day2: '#D7897F',
  day3: '#F9B95C',
  day4: '#96C7B3',
  day5: '#6398A9',

  error: '#E57373',
  success: '#81C784',
};

// ── Sage Garden (LIGHT) ──────────────────────────────────
export const sageGardenTheme: ColorTheme = {
  name: 'Sage Garden',
  description: 'Soft sage & mint — natural, calming, and grounded',
  isDark: false,

  primary: '#2D5F5D',           // forest teal — main text, icons
  secondary: '#8FB8A8',         // sage green — secondary actions
  accent: '#A8C9BC',            // soft mint — highlights

  dark: '#1A3635',              // deep forest — darkest text
  darkMid: '#F5FAF9',           // mint cream — card surfaces
  light: '#FFFFFF',             // pure white
  white: '#FFFFFF',

  text: '#1A3635',              // deep forest — primary text
  textSecondary: 'rgba(26,54,53,0.65)',
  textHint: 'rgba(26,54,53,0.38)',

  surface: 'rgba(45,95,93,0.06)',
  surfaceBorder: 'rgba(45,95,93,0.15)',

  onPrimary: '#FFFFFF',

  gradientStart: '#F5FAF9',
  gradientMid: '#E8F3F1',
  gradientEnd: '#E0F0ED',
  gradientBtn:['#6EE87A', '#2DD4BF', '#00BCD4'],

  buttonGradientStart: '#6EE87A',
  buttonGradientEnd: '#00BCD4',
  glassWhite: 'rgba(255,255,255,0.3)',
  glassLight: 'rgba(45,95,93,0.08)',
  glassBorder: 'rgba(143,184,168,0.25)',
  glassHeavy: 'rgba(45,95,93,0.12)',

  textDark: '#1A3635',
  textLight: '#FFFFFF',
  textMuted: 'rgba(26,54,53,0.65)',
  textSubtle: 'rgba(26,54,53,0.38)',

  glowPrimary: 'rgba(45,95,93,0.25)',
  glowSecondary: 'rgba(143,184,168,0.20)',

  day1: '#2D5F5D',   // forest teal
  day2: '#5A8A7F',   // medium sage
  day3: '#8FB8A8',   // soft sage
  day4: '#A8C9BC',   // mint green
  day5: '#6BA8B8',   // sky teal

  error: '#C85A54',
  success: '#5A8A7F',
};

export const lightThemes = {
  sageGarden: sageGardenTheme,
} as const;

export const darkThemes = {
  midnightGarden: midnightGardenTheme,
} as const;

export const themes = { ...lightThemes, ...darkThemes };

export const themePairs: Record<keyof typeof themes, keyof typeof themes> = {
  sageGarden: 'sageGarden',
  midnightGarden: 'midnightGarden',
};

export type LightThemeName = keyof typeof lightThemes;
export type DarkThemeName = keyof typeof darkThemes;
export type ThemeName = keyof typeof themes;
