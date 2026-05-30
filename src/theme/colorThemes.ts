// Color Theme System
// All themes are premium light themes — no dark mode.

import { IMAGE } from "../assets/image/bg-images";

export interface ColorTheme {
  name: string;
  description: string;
  isDark: boolean;
  bgImage?: "",

  // Brand Colors
  primary: string;
  secondary: string;
  accent: string;

  // Backgrounds
  dark: string;       // main screen background
  darkMid: string;    // card / surface background
  light: string;      // subtle tinted surface
  white: string;      // pure white / near-white
  glassWhite: string;

  // ── Semantic tokens ──────────────────────────────────────
  text: string;           // primary body text
  textSecondary: string;  // secondary / muted text  (~60% opacity)
  textHint: string;       // placeholder / hint text  (~35% opacity)
  surface: string;        // card / input background
  surfaceBorder: string;  // card / input border
  onPrimary: string;      // text/icon ON a primary-colored button
  // ─────────────────────────────────────────────────────────
  glassCardBg?: string;
  // Gradients
  gradientStart: string;
  gradientMid: string;
  gradientEnd: string;
  gradientBtn?: any;
  gradientBtn2?: any;
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

  buttonGradientStart: '#D63F6E',
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
// export const sageGardenTheme: ColorTheme = {
//   name: 'Sage Garden',
//   description: 'Soft sage & mint — natural, calming, and grounded',
//   isDark: false,

//   primary: '#2D5F5D',           // forest teal — main text, icons
//   secondary: '#8FB8A8',         // sage green — secondary actions
//   accent: '#A8C9BC',            // soft mint — highlights

//   dark: '#1A3635',              // deep forest — darkest text
//   darkMid: '#F5FAF9',           // mint cream — card surfaces
//   light: '#FFFFFF',             // pure white
//   white: '#FFFFFF',

//   text: '#1A3635',              // deep forest — primary text
//   textSecondary: 'rgba(26,54,53,0.65)',
//   textHint: 'rgba(26,54,53,0.38)',

//   surface: 'rgba(45,95,93,0.06)',
//   surfaceBorder: 'rgba(45,95,93,0.15)',

//   onPrimary: '#FFFFFF',

//   gradientStart: '#F5FAF9',
//   gradientMid: '#E8F3F1',
//   gradientEnd: '#E0F0ED',
//   gradientBtn: ["#2DD4BF", "#60A5FA", "#8B5CF6"],
//   gradientBtn2: ["#2DD4BF", "#60A5FA", "#8B5CF6"],
//   buttonGradientStart: '#2D5F5D',
//   buttonGradientEnd: '#8FB8A8',
//   glassWhite: 'rgba(255,255,255,0.3)',
//   glassLight: 'rgba(45,95,93,0.08)',
//   glassBorder: 'rgba(143,184,168,0.25)',
//   glassHeavy: 'rgba(45,95,93,0.12)',
//   glassCardBg: 'rgba(255,255,255,0.8)',
//   textDark: '#1A3635',
//   textLight: '#FFFFFF',
//   textMuted: 'rgba(26,54,53,0.65)',
//   textSubtle: 'rgba(26,54,53,0.38)',

//   glowPrimary: 'rgba(45,95,93,0.25)',
//   glowSecondary: 'rgba(143,184,168,0.20)',

//   day1: '#2D5F5D',   // forest teal
//   day2: '#5A8A7F',   // medium sage
//   day3: '#8FB8A8',   // soft sage
//   day4: '#A8C9BC',   // mint green
//   day5: '#6BA8B8',   // sky teal

//   error: '#C85A54',
//   success: '#5A8A7F',
// };
// export const auroraLoveTheme: ColorTheme = {
//   name: 'Aurora Love',
//   description: 'Dreamy emotional gradients with soft glass romance',
//   isDark: false,

//   // Core Brand
//   primary: '#214E5A',           // deep emotional teal
//   secondary: '#7BC8C4',         // mint cyan
//   accent: '#B794F6',            // soft lavender

//   dark: '#16343D',
//   darkMid: '#F6FBFF',
//   light: '#FFFFFF',
//   white: '#FFFFFF',

//   // Typography
//   text: '#183642',
//   textSecondary: 'rgba(24,54,66,0.68)',
//   textHint: 'rgba(24,54,66,0.42)',

//   textDark: '#183642',
//   textLight: '#FFFFFF',
//   textMuted: 'rgba(24,54,66,0.68)',
//   textSubtle: 'rgba(24,54,66,0.42)',

//   // Surfaces
//   surface: 'rgba(255,255,255,0.28)',
//   surfaceBorder: 'rgba(255,255,255,0.35)',

//   glassWhite: 'rgba(255,255,255,0.32)',
//   glassLight: 'rgba(255,255,255,0.18)',
//   glassBorder: 'rgba(255,255,255,0.30)',
//   glassHeavy: 'rgba(255,255,255,0.40)',
//   glassCardBg: 'rgba(255,255,255,0.72)',

//   // Main Background Gradient
//   gradientStart: '#E8FFF8',
//   gradientMid: '#EEF6FF',
//   gradientEnd: '#F4EEFF',

//   // CTA Gradients
//   gradientBtn: ['#2DD4BF', '#60A5FA', '#8B5CF6'],
//   gradientBtn2: ['#34D399', '#3B82F6', '#A855F7'],

//   buttonGradientStart: '#2DD4BF',
//   buttonGradientEnd: '#8B5CF6',

//   onPrimary: '#FFFFFF',

//   // Glow Effects
//   glowPrimary: 'rgba(96,165,250,0.28)',
//   glowSecondary: 'rgba(168,85,247,0.22)',

//   // Day Colors
//   day1: '#4ECDC4',
//   day2: '#60A5FA',
//   day3: '#8B5CF6',
//   day4: '#22C7D6',
//   day5: '#4ADE80',

//   // Status
//   error: '#F87171',
//   success: '#34D399',
// };

// export const dreamyAuroraTheme: ColorTheme = {
//   name: 'Dreamy Aurora',
//   description: 'Soft emotional aurora gradients with dreamy romance',
//   isDark: false,

//   primary: '#183B56',
//   secondary: '#72D6C9',
//   accent: '#A78BFA',

//   dark: '#102A43',
//   darkMid: '#F8FBFF',
//   light: '#FFFFFF',
//   white: '#FFFFFF',

//   text: '#183B56',
//   textSecondary: 'rgba(24,59,86,0.68)',
//   textHint: 'rgba(24,59,86,0.42)',

//   surface: 'rgba(255,255,255,0.22)',
//   surfaceBorder: 'rgba(255,255,255,0.35)',

//   gradientStart: '#E6FFF9',
//   gradientMid: '#EEF5FF',
//   gradientEnd: '#F5EDFF',

//   gradientBtn: ['#2DD4BF', '#60A5FA', '#8B5CF6'],
//   gradientBtn2: ['#34D399', '#3B82F6', '#A855F7'],

//   buttonGradientStart: '#2DD4BF',
//   buttonGradientEnd: '#8B5CF6',

//   glassWhite: 'rgba(255,255,255,0.30)',
//   glassLight: 'rgba(255,255,255,0.18)',
//   glassBorder: 'rgba(255,255,255,0.28)',
//   glassHeavy: 'rgba(255,255,255,0.40)',
//   glassCardBg: 'rgba(255,255,255,0.72)',

//   glowPrimary: 'rgba(96,165,250,0.22)',
//   glowSecondary: 'rgba(168,85,247,0.18)',

//   day1: '#4ECDC4',
//   day2: '#60A5FA',
//   day3: '#8B5CF6',
//   day4: '#22C7D6',
//   day5: '#4ADE80',

//   error: '#F87171',
//   success: '#34D399',
// };

export const healingTherapyTheme: ColorTheme = {
  name: 'Healing Therapy',
  description: 'Safe emotional support and calm healing',
  isDark: false,

  primary: '#215A6D',
  secondary: '#4ECDC4',
  accent: '#7DD3FC',

  dark: '#12313D',
  darkMid: '#F5FBFC',
  light: '#FFFFFF',
  white: '#FFFFFF',

  text: '#183642',
  textSecondary: 'rgba(24,54,66,0.68)',
  textHint: 'rgba(24,54,66,0.42)',
  onPrimary: '#FFFFFF',
  textDark: '#183642',
  textLight: '#FFFFFF',
  textMuted: 'rgba(24,54,66,0.68)',
  textSubtle: 'rgba(24,54,66,0.42)',

  surface: 'rgba(255,255,255,0.24)',
  surfaceBorder: 'rgba(255,255,255,0.30)',

  gradientStart: '#F0FDFA',
  gradientMid: '#E0F2FE',
  gradientEnd: '#F8FAFC',

  gradientBtn: ['#43CEA2', '#185A9D'],
  gradientBtn2: ['#4ECDC4', '#3B82F6'],

  buttonGradientStart: '#43CEA2',
  buttonGradientEnd: '#185A9D',

  glassWhite: 'rgba(255,255,255,0.32)',
  glassLight: 'rgba(255,255,255,0.18)',
  glassBorder: 'rgba(255,255,255,0.28)',
  glassHeavy: 'rgba(255,255,255,0.42)',
  glassCardBg: 'rgba(255,255,255,0.78)',

  glowPrimary: 'rgba(78,205,196,0.20)',
  glowSecondary: 'rgba(59,130,246,0.18)',

  day1: '#43CEA2',
  day2: '#4ECDC4',
  day3: '#3B82F6',
  day4: '#7DD3FC',
  day5: '#22C55E',

  error: '#F87171',
  success: '#10B981',
};
export const lightThemes = {
  sageGarden: healingTherapyTheme,
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
