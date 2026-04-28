// Color Theme System
// Each "pair" has a dark variant and a matching light variant.
// colors.ts picks the right one automatically based on system appearance.

export interface ColorTheme {
  name: string;
  description: string;
  isDark: boolean;

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
  // Use these everywhere instead of hardcoded '#FFFFFF' / rgba(255,255,255,...)
  text: string;           // primary body text  (white on dark, near-black on light)
  textSecondary: string;  // secondary / muted text  (~60% opacity)
  textHint: string;       // placeholder / hint text  (~35% opacity)
  surface: string;        // card / input background
  surfaceBorder: string;  // card / input border
  onPrimary: string;      // text/icon ON a primary-colored button (always white)
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
  textDark: string;   // primary text on light bg
  textLight: string;  // primary text on dark bg
  textMuted: string;  // secondary text
  textSubtle: string; // hint / placeholder text

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
//  DARK THEMES
// ─────────────────────────────────────────────────────────────

// ── 1. Elegant Dark ──────────────────────────────────────────
export const elegantDarkTheme: ColorTheme = {
  name: 'Elegant Dark',
  description: 'Sophisticated dark purple with rose pink accents',
  isDark: true,

  primary: '#DB7093',
  secondary: '#9B7BC8',
  accent: '#B8A0D6',

  dark: '#1A0B2E',
  darkMid: '#2D1B4E',
  light: '#F8F6FB',
  white: '#FFFFFF',

  text: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.60)',
  textHint: 'rgba(255,255,255,0.35)',
  surface: 'rgba(255,255,255,0.07)',
  surfaceBorder: 'rgba(255,255,255,0.12)',
  onPrimary: '#FFFFFF',

  gradientStart: '#1A0B2E',
  gradientMid: '#2D1B4E',
  gradientEnd: '#1A0B2E',

  buttonGradientStart: '#DB7093',
  buttonGradientEnd: '#C77DFF',

  glassLight: 'rgba(255,255,255,0.12)',
  glassBorder: 'rgba(255,255,255,0.18)',
  glassHeavy: 'rgba(255,255,255,0.25)',

  textDark: '#2D1B4E',
  textLight: '#FFFFFF',
  textMuted: 'rgba(255,255,255,0.70)',
  textSubtle: 'rgba(255,255,255,0.45)',

  glowPrimary: 'rgba(219,112,147,0.50)',
  glowSecondary: 'rgba(199,125,255,0.50)',

  day1: '#DB7093',
  day2: '#C77DFF',
  day3: '#B8A0D6',
  day4: '#D4C4E8',
  day5: '#E8DFF5',

  error: '#EF4444',
  success: '#10B981',
};

// ── 2. Luxe Pink & Gold (Dark) ────────────────────────────────
export const luxePinkGoldTheme: ColorTheme = {
  name: 'Luxe Pink & Gold',
  description: 'Premium pink heart with champagne gold accents',
  isDark: true,

  primary: '#FF6B9D',
  secondary: '#D4AF37',
  accent: '#FFB6C1',

  dark: '#0A0A1F',
  darkMid: '#1A1A3E',
  light: '#FFF5F7',
  white: '#FFFFFF',

  text: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.60)',
  textHint: 'rgba(255,255,255,0.35)',
  surface: 'rgba(255,255,255,0.07)',
  surfaceBorder: 'rgba(255,255,255,0.12)',
  onPrimary: '#FFFFFF',

  gradientStart: '#0A0A1F',
  gradientMid: '#1A1A3E',
  gradientEnd: '#2D1B4E',

  buttonGradientStart: '#FF6B9D',
  buttonGradientEnd: '#FF1493',

  glassLight: 'rgba(255,107,157,0.15)',
  glassBorder: 'rgba(212,175,55,0.25)',
  glassHeavy: 'rgba(255,107,157,0.25)',

  textDark: '#0A0A1F',
  textLight: '#FFFFFF',
  textMuted: 'rgba(255,255,255,0.75)',
  textSubtle: 'rgba(212,175,55,0.60)',

  glowPrimary: 'rgba(255,107,157,0.60)',
  glowSecondary: 'rgba(212,175,55,0.50)',

  day1: '#FF6B9D',
  day2: '#FF85B3',
  day3: '#FFB6C1',
  day4: '#E6C68A',
  day5: '#D4AF37',

  error: '#FF4757',
  success: '#2ED573',
};

// ── 3. Romantic Rose Gold (Dark) ──────────────────────────────
export const romanticRoseGoldTheme: ColorTheme = {
  name: 'Romantic Rose Gold',
  description: 'Soft rose gold with warm pink tones',
  isDark: true,

  primary: '#E8B4B8',
  secondary: '#C9A0A0',
  accent: '#F4D9D0',

  dark: '#1A0F14',
  darkMid: '#2D1B24',
  light: '#FFF5F5',
  white: '#FFFFFF',

  text: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.60)',
  textHint: 'rgba(255,255,255,0.35)',
  surface: 'rgba(255,255,255,0.07)',
  surfaceBorder: 'rgba(255,255,255,0.12)',
  onPrimary: '#FFFFFF',

  gradientStart: '#1A0F14',
  gradientMid: '#2D1B24',
  gradientEnd: '#3D2B34',

  buttonGradientStart: '#E8B4B8',
  buttonGradientEnd: '#D4A5A5',

  glassLight: 'rgba(232,180,184,0.15)',
  glassBorder: 'rgba(232,180,184,0.25)',
  glassHeavy: 'rgba(232,180,184,0.30)',

  textDark: '#1A0F14',
  textLight: '#FFFFFF',
  textMuted: 'rgba(255,255,255,0.70)',
  textSubtle: 'rgba(232,180,184,0.50)',

  glowPrimary: 'rgba(232,180,184,0.50)',
  glowSecondary: 'rgba(201,160,160,0.50)',

  day1: '#E8B4B8',
  day2: '#D4A5A5',
  day3: '#C9A0A0',
  day4: '#B89090',
  day5: '#A88080',

  error: '#E74C3C',
  success: '#27AE60',
};

// ── 4. Midnight Passion (Dark) ────────────────────────────────
export const midnightPassionTheme: ColorTheme = {
  name: 'Midnight Passion',
  description: 'Deep midnight blue with passionate pink accents',
  isDark: true,

  primary: '#FF1493',
  secondary: '#FF69B4',
  accent: '#FFB6D9',

  dark: '#0C0C1E',
  darkMid: '#1A1A3E',
  light: '#F0F4FF',
  white: '#FFFFFF',

  text: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.60)',
  textHint: 'rgba(255,255,255,0.35)',
  surface: 'rgba(255,255,255,0.07)',
  surfaceBorder: 'rgba(255,255,255,0.12)',
  onPrimary: '#FFFFFF',

  gradientStart: '#0C0C1E',
  gradientMid: '#1A1A3E',
  gradientEnd: '#0C0C1E',

  buttonGradientStart: '#FF1493',
  buttonGradientEnd: '#FF69B4',

  glassLight: 'rgba(255,20,147,0.12)',
  glassBorder: 'rgba(255,105,180,0.20)',
  glassHeavy: 'rgba(255,20,147,0.25)',

  textDark: '#0C0C1E',
  textLight: '#FFFFFF',
  textMuted: 'rgba(255,255,255,0.75)',
  textSubtle: 'rgba(255,105,180,0.50)',

  glowPrimary: 'rgba(255,20,147,0.70)',
  glowSecondary: 'rgba(255,105,180,0.60)',

  day1: '#FF1493',
  day2: '#FF69B4',
  day3: '#FFB6D9',
  day4: '#FFC0E0',
  day5: '#FFD9EC',

  error: '#FF4757',
  success: '#2ED573',
};

// ─────────────────────────────────────────────────────────────
//  LIGHT THEMES  (mirror pairs for each dark theme)
// ─────────────────────────────────────────────────────────────

// ── 1L. Elegant Light ─────────────────────────────────────────
// Warm lavender-white canvas, same rose-pink brand color.
export const elegantLightTheme: ColorTheme = {
  name: 'Elegant Light',
  description: 'Soft lavender white with rose pink accents',
  isDark: false,

  primary: '#C45C7A',           // slightly deeper rose for contrast on white
  secondary: '#7B5BA8',
  accent: '#9B7BC8',

  dark: '#F8F6FB',              // main bg — soft lavender white
  darkMid: '#EDE8F5',           // card surface
  light: '#FFFFFF',
  white: '#FFFFFF',

  text: '#1A0B2E',
  textSecondary: 'rgba(26,11,46,0.60)',
  textHint: 'rgba(26,11,46,0.35)',
  surface: 'rgba(26,11,46,0.05)',
  surfaceBorder: 'rgba(26,11,46,0.10)',
  onPrimary: '#FFFFFF',

  gradientStart: '#F8F6FB',
  gradientMid: '#EDE8F5',
  gradientEnd: '#F8F6FB',

  buttonGradientStart: '#C45C7A',
  buttonGradientEnd: '#9B5FD4',

  glassLight: 'rgba(196,92,122,0.08)',
  glassBorder: 'rgba(155,123,200,0.20)',
  glassHeavy: 'rgba(196,92,122,0.14)',

  textDark: '#1A0B2E',          // deep purple — primary text
  textLight: '#FFFFFF',
  textMuted: 'rgba(26,11,46,0.60)',
  textSubtle: 'rgba(26,11,46,0.35)',

  glowPrimary: 'rgba(196,92,122,0.25)',
  glowSecondary: 'rgba(155,91,212,0.20)',

  day1: '#C45C7A',
  day2: '#9B5FD4',
  day3: '#7B5BA8',
  day4: '#B8A0D6',
  day5: '#D4C4E8',

  error: '#DC2626',
  success: '#059669',
};

// ── 2L. Luxe Pink & Gold Light ────────────────────────────────
// Creamy champagne canvas, vivid pink + gold brand.
export const luxePinkGoldLightTheme: ColorTheme = {
  name: 'Luxe Pink & Gold Light',
  description: 'Champagne canvas with vibrant pink and gold accents',
  isDark: false,

  primary: '#E8527A',           // deeper pink for light bg readability
  secondary: '#B8860B',         // dark gold
  accent: '#FF85B3',

  dark: '#FFF8F0',              // warm champagne white
  darkMid: '#FFF0E8',           // soft peach card
  light: '#FFFFFF',
  white: '#FFFFFF',

  text: '#1A0A10',
  textSecondary: 'rgba(26,10,16,0.60)',
  textHint: 'rgba(26,10,16,0.35)',
  surface: 'rgba(26,10,16,0.05)',
  surfaceBorder: 'rgba(26,10,16,0.10)',
  onPrimary: '#FFFFFF',

  gradientStart: '#FFF8F0',
  gradientMid: '#FFF0E8',
  gradientEnd: '#FFF8F0',

  buttonGradientStart: '#E8527A',
  buttonGradientEnd: '#D4AF37',

  glassLight: 'rgba(232,82,122,0.08)',
  glassBorder: 'rgba(212,175,55,0.25)',
  glassHeavy: 'rgba(232,82,122,0.14)',

  textDark: '#1A0A10',
  textLight: '#FFFFFF',
  textMuted: 'rgba(26,10,16,0.60)',
  textSubtle: 'rgba(184,134,11,0.65)',

  glowPrimary: 'rgba(232,82,122,0.22)',
  glowSecondary: 'rgba(212,175,55,0.20)',

  day1: '#E8527A',
  day2: '#FF85B3',
  day3: '#FFB6C1',
  day4: '#D4AF37',
  day5: '#B8860B',

  error: '#DC2626',
  success: '#059669',
};

// ── 3L. Romantic Rose Gold Light ──────────────────────────────
// Blush white canvas, warm dusty rose brand.
export const romanticRoseGoldLightTheme: ColorTheme = {
  name: 'Romantic Rose Gold Light',
  description: 'Blush white with warm dusty rose tones',
  isDark: false,

  primary: '#C4848A',           // deeper dusty rose
  secondary: '#A07070',
  accent: '#D4A0A0',

  dark: '#FFF5F5',              // blush white
  darkMid: '#FDEAEA',           // soft rose card
  light: '#FFFFFF',
  white: '#FFFFFF',

  text: '#2A1010',
  textSecondary: 'rgba(42,16,16,0.60)',
  textHint: 'rgba(42,16,16,0.35)',
  surface: 'rgba(42,16,16,0.05)',
  surfaceBorder: 'rgba(42,16,16,0.10)',
  onPrimary: '#FFFFFF',

  gradientStart: '#FFF5F5',
  gradientMid: '#FDEAEA',
  gradientEnd: '#FFF5F5',

  buttonGradientStart: '#C4848A',
  buttonGradientEnd: '#A07070',

  glassLight: 'rgba(196,132,138,0.08)',
  glassBorder: 'rgba(196,132,138,0.22)',
  glassHeavy: 'rgba(196,132,138,0.15)',

  textDark: '#2A1010',
  textLight: '#FFFFFF',
  textMuted: 'rgba(42,16,16,0.60)',
  textSubtle: 'rgba(42,16,16,0.35)',

  glowPrimary: 'rgba(196,132,138,0.22)',
  glowSecondary: 'rgba(160,112,112,0.18)',

  day1: '#C4848A',
  day2: '#B07878',
  day3: '#A07070',
  day4: '#C8A0A0',
  day5: '#E0C0C0',

  error: '#DC2626',
  success: '#059669',
};

// ── 4L. Daylight Passion Light ────────────────────────────────
// Icy blue-white canvas, vivid pink brand — light mirror of Midnight Passion.
export const daylightPassionTheme: ColorTheme = {
  name: 'Daylight Passion',
  description: 'Crisp icy white with vivid pink accents',
  isDark: false,

  primary: '#E0116A',           // deeper deep-pink for contrast
  secondary: '#D44090',
  accent: '#FF85C0',

  dark: '#F5F7FF',              // icy blue-white
  darkMid: '#EBF0FF',           // soft blue card
  light: '#FFFFFF',
  white: '#FFFFFF',

  text: '#0C0C1E',
  textSecondary: 'rgba(12,12,30,0.60)',
  textHint: 'rgba(12,12,30,0.35)',
  surface: 'rgba(12,12,30,0.05)',
  surfaceBorder: 'rgba(12,12,30,0.10)',
  onPrimary: '#FFFFFF',

  gradientStart: '#F5F7FF',
  gradientMid: '#EBF0FF',
  gradientEnd: '#F5F7FF',

  buttonGradientStart: '#E0116A',
  buttonGradientEnd: '#D44090',

  glassLight: 'rgba(224,17,106,0.07)',
  glassBorder: 'rgba(212,64,144,0.18)',
  glassHeavy: 'rgba(224,17,106,0.13)',

  textDark: '#0C0C1E',
  textLight: '#FFFFFF',
  textMuted: 'rgba(12,12,30,0.60)',
  textSubtle: 'rgba(12,12,30,0.35)',

  glowPrimary: 'rgba(224,17,106,0.20)',
  glowSecondary: 'rgba(212,64,144,0.18)',

  day1: '#E0116A',
  day2: '#D44090',
  day3: '#FF85C0',
  day4: '#FFB6D9',
  day5: '#FFD9EC',

  error: '#DC2626',
  success: '#059669',
};

// ─────────────────────────────────────────────────────────────
//  THEME REGISTRY
// ─────────────────────────────────────────────────────────────

export const darkThemes = {
  elegantDark: elegantDarkTheme,
  luxePinkGold: luxePinkGoldTheme,
  romanticRoseGold: romanticRoseGoldTheme,
  midnightPassion: midnightPassionTheme,
} as const;

export const lightThemes = {
  elegantLight: elegantLightTheme,
  luxePinkGoldLight: luxePinkGoldLightTheme,
  romanticRoseGoldLight: romanticRoseGoldLightTheme,
  daylightPassion: daylightPassionTheme,
} as const;

// Paired: darkThemes key → matching lightThemes key
export const themePairs: Record<keyof typeof darkThemes, keyof typeof lightThemes> = {
  elegantDark: 'elegantLight',
  luxePinkGold: 'luxePinkGoldLight',
  romanticRoseGold: 'romanticRoseGoldLight',
  midnightPassion: 'daylightPassion',
};

export const themes = { ...darkThemes, ...lightThemes };

export type DarkThemeName = keyof typeof darkThemes;
export type LightThemeName = keyof typeof lightThemes;
export type ThemeName = keyof typeof themes;
