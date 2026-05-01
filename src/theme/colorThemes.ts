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

// ─────────────────────────────────────────────────────────────
//  PREMIUM LIGHT THEMES
// ─────────────────────────────────────────────────────────────

// ── 1. Blossom Luxe ──────────────────────────────────────────
// Warm ivory canvas with vivid rose-pink and champagne gold.
// Feels like a high-end beauty brand — polished, feminine, premium.
export const blossomLuxeTheme: ColorTheme = {
  name: 'Blossom Luxe',
  description: 'Warm ivory with vivid rose-pink and champagne gold',
  isDark: false,

  primary: '#D63F6E',           // deep rose — strong contrast on ivory
  secondary: '#C49A3C',         // champagne gold
  accent: '#F28BAD',            // soft pink highlight

  dark: '#FFF5ED',              // warm ivory — main background
  darkMid: '#FFECD9',           // linen card surface
  light: '#FFFFFF',
  white: '#FFFFFF',

  text: '#1C0A14',              // near-black with warm tint
  textSecondary: 'rgba(28,10,20,0.62)',
  textHint: 'rgba(28,10,20,0.36)',
  surface: 'rgba(214,63,110,0.06)',
  surfaceBorder: 'rgba(214,63,110,0.14)',
  onPrimary: '#FFFFFF',

  gradientStart: '#FFF5ED',
  gradientMid: '#FFE8D6',
  gradientEnd: '#FFF0E5',

  buttonGradientStart: '#E8799D',
  buttonGradientEnd: '#E8A87A',

  glassLight: 'rgba(214,63,110,0.07)',
  glassBorder: 'rgba(196,154,60,0.22)',
  glassHeavy: 'rgba(214,63,110,0.13)',

  textDark: '#1C0A14',
  textLight: '#FFFFFF',
  textMuted: 'rgba(28,10,20,0.62)',
  textSubtle: 'rgba(28,10,20,0.36)',

  glowPrimary: 'rgba(214,63,110,0.28)',
  glowSecondary: 'rgba(196,154,60,0.22)',

  day1: '#D63F6E',
  day2: '#E8527A',
  day3: '#F28BAD',
  day4: '#C49A3C',
  day5: '#E8C97A',

  error: '#C0392B',
  success: '#1A7A4A',
};

// ── 2. Pearl Violet ──────────────────────────────────────────
// Soft pearl-white canvas with rich violet and lavender.
// Feels like a luxury skincare or wellness brand — serene, modern, elevated.
export const pearlVioletTheme: ColorTheme = {
  name: 'Pearl Violet',
  description: 'Pearl white with rich violet and soft lavender',
  isDark: false,

  primary: '#6B3FA0',           // deep violet
  secondary: '#A855F7',         // vivid purple
  accent: '#C4A8E8',            // soft lavender

  dark: '#F3EEFF',              // pearl lavender-white — main background
  darkMid: '#E8DCFC',           // soft violet card
  light: '#FFFFFF',
  white: '#FFFFFF',

  text: '#1A0A30',              // deep violet-black
  textSecondary: 'rgba(26,10,48,0.62)',
  textHint: 'rgba(26,10,48,0.36)',
  surface: 'rgba(107,63,160,0.06)',
  surfaceBorder: 'rgba(107,63,160,0.14)',
  onPrimary: '#FFFFFF',

  gradientStart: '#F3EEFF',
  gradientMid: '#E5D5FA',
  gradientEnd: '#EEE4FF',

  buttonGradientStart: '#9B7BC8',
  buttonGradientEnd: '#C4A8E8',

  glassLight: 'rgba(107,63,160,0.07)',
  glassBorder: 'rgba(168,85,247,0.20)',
  glassHeavy: 'rgba(107,63,160,0.13)',

  textDark: '#1A0A30',
  textLight: '#FFFFFF',
  textMuted: 'rgba(26,10,48,0.62)',
  textSubtle: 'rgba(26,10,48,0.36)',

  glowPrimary: 'rgba(107,63,160,0.26)',
  glowSecondary: 'rgba(168,85,247,0.22)',

  day1: '#6B3FA0',
  day2: '#8B5CC8',
  day3: '#A855F7',
  day4: '#C4A8E8',
  day5: '#DDD0F5',

  error: '#C0392B',
  success: '#1A7A4A',
};

// ── 3. Coral Sunrise ─────────────────────────────────────────
// Crisp white canvas with warm coral-orange and golden amber.
// Feels like a modern lifestyle app — energetic, fresh, premium.
export const coralSunriseTheme: ColorTheme = {
  name: 'Coral Sunrise',
  description: 'Crisp white with warm coral-orange and golden amber',
  isDark: false,

  primary: '#E8450A',           // deep coral-orange
  secondary: '#F59E0B',         // golden amber
  accent: '#FCA97A',            // soft peach

  dark: '#FFF4EC',              // warm peach-white — main background
  darkMid: '#FFE5CC',           // peach card surface
  light: '#FFFFFF',
  white: '#FFFFFF',

  text: '#1A0800',              // warm near-black
  textSecondary: 'rgba(26,8,0,0.62)',
  textHint: 'rgba(26,8,0,0.36)',
  surface: 'rgba(232,69,10,0.06)',
  surfaceBorder: 'rgba(232,69,10,0.13)',
  onPrimary: '#FFFFFF',

  gradientStart: '#FFF4EC',
  gradientMid: '#FFD9B5',
  gradientEnd: '#FFEEDD',

  buttonGradientStart: '#F28B5A',
  buttonGradientEnd: '#F5B84D',

  glassLight: 'rgba(232,69,10,0.07)',
  glassBorder: 'rgba(245,158,11,0.22)',
  glassHeavy: 'rgba(232,69,10,0.13)',

  textDark: '#1A0800',
  textLight: '#FFFFFF',
  textMuted: 'rgba(26,8,0,0.62)',
  textSubtle: 'rgba(26,8,0,0.36)',

  glowPrimary: 'rgba(232,69,10,0.26)',
  glowSecondary: 'rgba(245,158,11,0.22)',

  day1: '#E8450A',
  day2: '#F06030',
  day3: '#FCA97A',
  day4: '#F59E0B',
  day5: '#FCD34D',

  error: '#C0392B',
  success: '#1A7A4A',
};

// ── 4. Aqua Mint ─────────────────────────────────────────────
// Pure white canvas with deep teal and fresh mint.
// Feels like a premium wellness or fintech app — clean, calm, sophisticated.
export const aquaMintTheme: ColorTheme = {
  name: 'Aqua Mint',
  description: 'Pure white with deep teal and fresh mint accents',
  isDark: false,

  primary: '#0D7A6E',           // deep teal
  secondary: '#06B6A4',         // vivid teal-green
  accent: '#6EE7D8',            // fresh mint

  dark: '#E8FBF8',              // mint-tinted white — main background
  darkMid: '#D0F5F0',           // soft teal card
  light: '#FFFFFF',
  white: '#FFFFFF',

  text: '#021A17',              // deep teal-black
  textSecondary: 'rgba(2,26,23,0.62)',
  textHint: 'rgba(2,26,23,0.36)',
  surface: 'rgba(13,122,110,0.06)',
  surfaceBorder: 'rgba(13,122,110,0.14)',
  onPrimary: '#FFFFFF',

  gradientStart: '#E8FBF8',
  gradientMid: '#C2F0EA',
  gradientEnd: '#D8F8F4',

  buttonGradientStart: '#4DA89E',
  buttonGradientEnd: '#6EE7D8',

  glassLight: 'rgba(13,122,110,0.07)',
  glassBorder: 'rgba(6,182,164,0.20)',
  glassHeavy: 'rgba(13,122,110,0.13)',

  textDark: '#021A17',
  textLight: '#FFFFFF',
  textMuted: 'rgba(2,26,23,0.62)',
  textSubtle: 'rgba(2,26,23,0.36)',

  glowPrimary: 'rgba(13,122,110,0.26)',
  glowSecondary: 'rgba(6,182,164,0.22)',

  day1: '#0D7A6E',
  day2: '#0A9E8E',
  day3: '#06B6A4',
  day4: '#6EE7D8',
  day5: '#A7F3EC',

  error: '#C0392B',
  success: '#1A7A4A',
};

// ─────────────────────────────────────────────────────────────
//  THEME REGISTRY  (light only)
// ─────────────────────────────────────────────────────────────

// ── 5. Velvet Mauve ──────────────────────────────────────────
// Soft blush canvas with deep mauve-wine primary and muted indigo.
// Palette: Soft Blush #D8B7B0 · Warm Rose #D08A7C · Deep Mauve #8C4A54 · Muted Indigo #4B4A63
// Feels like a luxury editorial magazine — intimate, romantic, premium.
export const velvetMauveTheme: ColorTheme = {
  name: 'Velvet Mauve',
  description: 'Soft blush canvas with deep mauve-wine and muted indigo',
  isDark: false,

  primary: '#8C4A54',           // deep mauve-wine — rich, strong contrast on blush
  secondary: '#4B4A63',         // muted indigo — sophisticated complement
  accent: '#D08A7C',            // warm rose — soft highlight

  dark: '#FDF5F3',              // blush-white — main background
  darkMid: '#F7EAE7',           // soft blush card surface
  light: '#FFFFFF',
  white: '#FFFFFF',

  text: '#2A1018',              // deep warm near-black
  textSecondary: 'rgba(42,16,24,0.62)',
  textHint: 'rgba(42,16,24,0.36)',
  surface: 'rgba(140,74,84,0.06)',
  surfaceBorder: 'rgba(140,74,84,0.14)',
  onPrimary: '#FFFFFF',

  // Gradient: blush-white → warm rose blush → soft mauve tint
  gradientStart: '#FDF5F3',
  gradientMid: '#F5E2DE',
  gradientEnd: '#F9EBE8',

  // Button: warm rose → soft blush — gentle, feminine, premium
  buttonGradientStart: '#C47880',
  buttonGradientEnd: '#D8B7B0',

  glassLight: 'rgba(140,74,84,0.07)',
  glassBorder: 'rgba(208,138,124,0.22)',
  glassHeavy: 'rgba(140,74,84,0.13)',

  textDark: '#2A1018',
  textLight: '#FFFFFF',
  textMuted: 'rgba(42,16,24,0.62)',
  textSubtle: 'rgba(42,16,24,0.36)',

  glowPrimary: 'rgba(140,74,84,0.28)',
  glowSecondary: 'rgba(75,74,99,0.22)',

  // Day accents: journey from warm rose → deep mauve → indigo
  day1: '#D08A7C',
  day2: '#B86870',
  day3: '#8C4A54',
  day4: '#6B5A7A',
  day5: '#4B4A63',

  error: '#B03030',
  success: '#2A6B4A',
};

// ── 6. Nectarine Garden ──────────────────────────────────────
// Warm peach-cream canvas with nectarine coral, golden pêche, and lagune teal.
// Palette: Nectarine #D7897F · Pêche #F9B95C · Menthe #96C7B3 · Lagune #6398A9
// Feels like a modern Parisian lifestyle app — warm, playful, joyful, premium.
export const nectarineGardenTheme: ColorTheme = {
  name: 'Nectarine Garden',
  description: 'Warm peach canvas with nectarine coral, golden pêche and lagune teal',
  isDark: false,
  bgImage:IMAGE.bgImag4,

  primary: '#D7897F',           // nectarine coral — warm, inviting, strong
  secondary: '#6398A9',         // lagune teal — cool complement
  accent: '#F9B95C',            // golden pêche — warm highlight

  dark: '#FFF8F4',              // warm cream-white — main background
  darkMid: '#FFEEE5',           // soft peach card surface
  light: '#FFFFFF',
  white: '#FFFFFF',

  text: '#1E0C08',              // warm near-black
  textSecondary: 'rgba(30,12,8,0.62)',
  textHint: 'rgba(30,12,8,0.36)',
  surface: 'rgba(215,137,127,0.06)',
  surfaceBorder: 'rgba(215,137,127,0.15)',
  onPrimary: '#FFFFFF',

  // Gradient: warm cream → soft nectarine blush → peach tint
  gradientStart: '#FFF8F4',
  gradientMid: '#FFE8D8',
  gradientEnd: '#FFF2EA',

  // Button: nectarine → golden pêche — warm, energetic, premium
  buttonGradientStart: '#D7897F',
  buttonGradientEnd: '#F9B95C',

  glassLight: 'rgba(215,137,127,0.08)',
  glassBorder: 'rgba(249,185,92,0.25)',
  glassHeavy: 'rgba(215,137,127,0.14)',

  textDark: '#1E0C08',
  textLight: '#FFFFFF',
  textMuted: 'rgba(30,12,8,0.62)',
  textSubtle: 'rgba(30,12,8,0.36)',

  glowPrimary: 'rgba(215,137,127,0.30)',
  glowSecondary: 'rgba(99,152,169,0.24)',

  // Day accents: warm nectarine → golden → menthe → lagune journey
  day1: '#D7897F',
  day2: '#E8A070',
  day3: '#F9B95C',
  day4: '#96C7B3',
  day5: '#6398A9',

  error: '#B83030',
  success: '#2A6B4A',
};

// ── 7. Flamingo Dusk ─────────────────────────────────────────
// Pale mist canvas with flamingo salmon primary and deep navy accent.
// Palette: Salmon #DB8084 · Navy #23314A · Mist #8FA1B1
// Feels like a premium editorial app — sophisticated, bold contrast, modern luxury.
export const flamingoDuskTheme: ColorTheme = {
  name: 'Flamingo Dusk',
  description: 'Pale mist canvas with flamingo salmon and deep navy',
  isDark: false,

  primary: '#C4606A',           // deeper flamingo — strong contrast on mist
  secondary: '#23314A',         // deep navy — bold, sophisticated
  accent: '#DB8084',            // soft salmon — warm highlight

  dark: '#F6F8FB',              // pale mist-white — main background
  darkMid: '#EBF0F6',           // soft blue-grey card surface
  light: '#FFFFFF',
  white: '#FFFFFF',

  text: '#0E1826',              // deep navy-black
  textSecondary: 'rgba(14,24,38,0.62)',
  textHint: 'rgba(14,24,38,0.36)',
  surface: 'rgba(196,96,106,0.06)',
  surfaceBorder: 'rgba(143,161,177,0.25)',
  onPrimary: '#FFFFFF',

  // Gradient: pale mist → soft blue-grey → near-white — cool, airy, premium
  gradientStart: '#F6F8FB',
  gradientMid: '#E8EEF5',
  gradientEnd: '#F2F5F9',

  // Button: flamingo → mist blue — unexpected, editorial, premium
  buttonGradientStart: '#C4606A',
  buttonGradientEnd: '#8FA1B1',

  glassLight: 'rgba(196,96,106,0.07)',
  glassBorder: 'rgba(143,161,177,0.28)',
  glassHeavy: 'rgba(35,49,74,0.10)',

  textDark: '#0E1826',
  textLight: '#FFFFFF',
  textMuted: 'rgba(14,24,38,0.62)',
  textSubtle: 'rgba(14,24,38,0.36)',

  glowPrimary: 'rgba(196,96,106,0.28)',
  glowSecondary: 'rgba(35,49,74,0.20)',

  // Day accents: flamingo → salmon → mist → navy journey
  day1: '#C4606A',
  day2: '#DB8084',
  day3: '#C49AAA',
  day4: '#8FA1B1',
  day5: '#23314A',

  error: '#B03030',
  success: '#2A6B4A',
};

// ── 8. Midnight Garden (DARK) ────────────────────────────────
// Deep navy canvas with nectarine coral, golden pêche, mint menthe, and lagune teal.
// Main brand colors: #D88084 (primary), #23314A (background), #8FA1B1 (secondary)
// Accent colors: #D7897F (nectarine), #F9B95C (pêche), #96C7B3 (menthe), #6398A9 (lagune)
// A sophisticated dark theme with warm coral and cool teal accents.
export const midnightGardenTheme: ColorTheme = {
  name: 'Midnight Garden',
  description: 'Deep navy with nectarine coral, pêche, menthe and lagune accents',
  isDark: true,

  // primary: '#D88084',           // primary brand color — warm, inviting
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

  // Gradient: deep navy → navy blue → mist blue tint
  gradientStart: '#1A2332',
  gradientMid: '#23314A',
  gradientEnd: '#2D3E57',

  // Button: keep current gradient (primary → nectarine) — warm, inviting
  buttonGradientStart:  '#D63F6E',
  buttonGradientEnd: '#D7897F',
  

  glassLight: 'rgba(216,128,132,0.10)',
  glassBorder: 'rgba(143,161,177,0.25)',
  glassHeavy: 'rgba(216,128,132,0.18)',

  textDark: '#1A2332',
  textLight: '#F5F7FA',
  textMuted: 'rgba(245,247,250,0.70)',
  textSubtle: 'rgba(245,247,250,0.40)',

  glowPrimary: 'rgba(216,128,132,0.35)',
  glowSecondary: 'rgba(143,161,177,0.30)',

  // Day accents: primary → nectarine → pêche → menthe → lagune journey
  day1: '#D88084',
  day2: '#D7897F',
  day3: '#F9B95C',
  day4: '#96C7B3',
  day5: '#6398A9',

  error: '#E57373',
  success: '#81C784',
};

// ── 9. Love Bloom (LIGHT) ────────────────────────────────────
// Soft romantic pastel theme with glassmorphism and floral warmth.
// Main brand colors: #E38B9B (soft rose pink), #8FA1B1 (mist blue), #CDB4DB (lavender)
// A light, romantic theme with soft pastels and premium glass effects.
export const loveBloomTheme: ColorTheme = {
  name: 'Bloom Love',
  description: 'Soft blush & lavender petals — romantic, tender, and intimate',
  isDark: false,

  // Primary: warm rose blush — the heart of the palette
  primary: '#E8799D',           // rose petal — main CTA, hearts, matches
  secondary: '#B8A8D8',         // soft lavender — secondary actions, tags
  accent: '#F5A67A',            // peach blossom — warm highlights, streaks

  dark: '#3D2A3A',              // deep plum — richest text / icons
  darkMid: '#FAF0F5',           // blush white — card surfaces
  light: '#FDF6FF',             // near-white lavender — elevated surfaces / modals
  white: '#FFFFFF',

  text: '#3D2A3A',              // deep plum — primary readable text
  textSecondary: 'rgba(61,42,58,0.65)',
  textHint: 'rgba(61,42,58,0.38)',

  surface: 'rgba(232,121,157,0.07)',
  surfaceBorder: 'rgba(232,121,157,0.18)',

  onPrimary: '#FFFFFF',

  // Background gradient: blush → lavender mist → soft white
  gradientStart: '#FDE8F0',
  gradientMid: '#EFE4FA',
  gradientEnd: '#F5F0FF',

  // Button gradient: rose → coral peach — warm & inviting tap
  buttonGradientStart: '#E8799D',
  buttonGradientEnd: '#F5A67A',

  glassLight: 'rgba(232,121,157,0.08)',
  glassBorder: 'rgba(184,168,216,0.30)',
  glassHeavy: 'rgba(232,121,157,0.15)',

  textDark: '#3D2A3A',
  textLight: '#FFFFFF',
  textMuted: 'rgba(61,42,58,0.65)',
  textSubtle: 'rgba(61,42,58,0.38)',

  glowPrimary: 'rgba(232,121,157,0.28)',
  glowSecondary: 'rgba(184,168,216,0.25)',

  // Journey day accents: rose → peach → sage → lavender → sky
  day1: '#E8799D',   // blush rose
  day2: '#F5A67A',   // peach blossom
  day3: '#8ECAAA',   // sage mint
  day4: '#B8A8D8',   // soft lavender
  day5: '#8CB8D8',   // sky mist

  error: '#E06B7A',
  success: '#7ABFA0',
};


// ─────────────────────────────────────────────────────────────
//  THEME REGISTRY  (light only)
// ─────────────────────────────────────────────────────────────

export const lightThemes = {
  blossomLuxe: blossomLuxeTheme,
  pearlViolet: pearlVioletTheme,
  coralSunrise: coralSunriseTheme,
  aquaMint: aquaMintTheme,
  velvetMauve: velvetMauveTheme,
  nectarineGarden: nectarineGardenTheme,
  flamingoDusk: flamingoDuskTheme,
  loveBloom: loveBloomTheme,
} as const;

// Dark themes
export const darkThemes = {
  midnightGarden: flamingoDuskTheme,
} as const;

// Combined themes
export const themes = { ...lightThemes, ...darkThemes };

// themePairs maps light themes to themselves, and dark theme to itself
export const themePairs: Record<keyof typeof themes, keyof typeof themes> = {
  blossomLuxe: 'blossomLuxe',
  pearlViolet: 'pearlViolet',
  coralSunrise: 'coralSunrise',
  aquaMint: 'aquaMint',
  velvetMauve: 'velvetMauve',
  nectarineGarden: 'nectarineGarden',
  flamingoDusk: 'flamingoDusk',
  loveBloom: 'loveBloom',
  midnightGarden: 'midnightGarden',
};

export type LightThemeName = keyof typeof lightThemes;
export type DarkThemeName = keyof typeof darkThemes;
export type ThemeName = keyof typeof themes;
