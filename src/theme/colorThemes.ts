// Color Theme System
// Switch themes by changing the active theme name in colors.ts

export interface ColorTheme {
  name: string;
  description: string;
  
  // Brand Colors
  primary: string;
  secondary: string;
  accent: string;
  
  // Backgrounds
  dark: string;
  darkMid: string;
  light: string;
  white: string;
  
  // Gradients
  gradientStart: string;
  gradientMid: string;
  gradientEnd: string;
  
  // Button Gradients (for glowing effects)
  buttonGradientStart: string;
  buttonGradientEnd: string;
  
  // Glass/Transparent Surfaces
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
  
  // Day Colors
  day1: string;
  day2: string;
  day3: string;
  day4: string;
  day5: string;
  
  // Feedback
  error: string;
  success: string;
}

// ============================================
// THEME 1: ELEGANT DARK (Current Theme)
// ============================================
export const elegantDarkTheme: ColorTheme = {
  name: 'Elegant Dark',
  description: 'Sophisticated dark purple with rose pink accents',
  
  // Brand Colors
  primary: '#DB7093',           // Rose Pink
  secondary: '#9B7BC8',         // Soft Lavender
  accent: '#B8A0D6',            // Light Purple
  
  // Backgrounds
  dark: '#1A0B2E',              // Deep Dark Purple
  darkMid: '#2D1B4E',           // Mid Dark Purple
  light: '#F8F6FB',             // Soft Lavender White
  white: '#FFFFFF',
  
  // Gradients
  gradientStart: '#1A0B2E',
  gradientMid: '#2D1B4E',
  gradientEnd: '#1A0B2E',
  
  // Button Gradients
  buttonGradientStart: '#DB7093',
  buttonGradientEnd: '#C77DFF',
  
  // Glass/Transparent
  glassLight: 'rgba(255, 255, 255, 0.12)',
  glassBorder: 'rgba(255, 255, 255, 0.18)',
  glassHeavy: 'rgba(255, 255, 255, 0.25)',
  
  // Text
  textDark: '#2D1B4E',
  textLight: '#FFFFFF',
  textMuted: 'rgba(255, 255, 255, 0.7)',
  textSubtle: 'rgba(255, 255, 255, 0.45)',
  
  // Glow
  glowPrimary: 'rgba(219, 112, 147, 0.5)',
  glowSecondary: 'rgba(199, 125, 255, 0.5)',
  
  // Days
  day1: '#DB7093',
  day2: '#C77DFF',
  day3: '#B8A0D6',
  day4: '#D4C4E8',
  day5: '#E8DFF5',
  
  // Feedback
  error: '#EF4444',
  success: '#10B981',
};

// ============================================
// THEME 2: LUXE PINK & GOLD (From Logo)
// ============================================
export const luxePinkGoldTheme: ColorTheme = {
  name: 'Luxe Pink & Gold',
  description: 'Premium pink heart with champagne gold accents from logo',
  
  // Brand Colors - Extracted from logo
  primary: '#FF6B9D',           // Vibrant Pink (heart)
  secondary: '#D4AF37',         // Champagne Gold (ring/text)
  accent: '#FFB6C1',            // Light Pink (heart highlights)
  
  // Backgrounds - Same dark navy from logo
  dark: '#0A0A1F',              // Deep Navy (logo background)
  darkMid: '#1A1A3E',           // Mid Navy
  light: '#FFF5F7',             // Soft Pink White
  white: '#FFFFFF',
  
  // Gradients - Navy to deep purple
  gradientStart: '#0A0A1F',     // Deep Navy
  gradientMid: '#1A1A3E',       // Mid Navy
  gradientEnd: '#2D1B4E',       // Purple tint
  
  // Button Gradients - Glowing Pink
  buttonGradientStart: '#FF6B9D',  // Vibrant Pink
  buttonGradientEnd: '#FF1493',    // Deep Pink
  
  // Glass/Transparent
  glassLight: 'rgba(255, 107, 157, 0.15)',   // Pink tinted glass
  glassBorder: 'rgba(212, 175, 55, 0.25)',   // Gold border
  glassHeavy: 'rgba(255, 107, 157, 0.25)',
  
  // Text
  textDark: '#0A0A1F',
  textLight: '#FFFFFF',
  textMuted: 'rgba(255, 255, 255, 0.75)',
  textSubtle: 'rgba(212, 175, 55, 0.6)',     // Gold subtle text
  
  // Glow Effects - Pink and Gold glows
  glowPrimary: 'rgba(255, 107, 157, 0.6)',   // Pink glow
  glowSecondary: 'rgba(212, 175, 55, 0.5)',  // Gold glow
  
  // Days - Pink to Gold gradient
  day1: '#FF6B9D',              // Vibrant Pink
  day2: '#FF85B3',              // Light Pink
  day3: '#FFB6C1',              // Pale Pink
  day4: '#E6C68A',              // Soft Gold
  day5: '#D4AF37',              // Champagne Gold
  
  // Feedback
  error: '#FF4757',
  success: '#2ED573',
};

// ============================================
// THEME 3: ROMANTIC ROSE GOLD
// ============================================
export const romanticRoseGoldTheme: ColorTheme = {
  name: 'Romantic Rose Gold',
  description: 'Soft rose gold with warm pink tones',
  
  // Brand Colors
  primary: '#E8B4B8',           // Rose Gold
  secondary: '#C9A0A0',         // Dusty Rose
  accent: '#F4D9D0',            // Champagne
  
  // Backgrounds
  dark: '#1A0F14',              // Deep Burgundy
  darkMid: '#2D1B24',           // Mid Burgundy
  light: '#FFF5F5',             // Soft Rose White
  white: '#FFFFFF',
  
  // Gradients
  gradientStart: '#1A0F14',
  gradientMid: '#2D1B24',
  gradientEnd: '#3D2B34',
  
  // Button Gradients
  buttonGradientStart: '#E8B4B8',
  buttonGradientEnd: '#D4A5A5',
  
  // Glass/Transparent
  glassLight: 'rgba(232, 180, 184, 0.15)',
  glassBorder: 'rgba(232, 180, 184, 0.25)',
  glassHeavy: 'rgba(232, 180, 184, 0.3)',
  
  // Text
  textDark: '#1A0F14',
  textLight: '#FFFFFF',
  textMuted: 'rgba(255, 255, 255, 0.7)',
  textSubtle: 'rgba(232, 180, 184, 0.5)',
  
  // Glow
  glowPrimary: 'rgba(232, 180, 184, 0.5)',
  glowSecondary: 'rgba(201, 160, 160, 0.5)',
  
  // Days
  day1: '#E8B4B8',
  day2: '#D4A5A5',
  day3: '#C9A0A0',
  day4: '#B89090',
  day5: '#A88080',
  
  // Feedback
  error: '#E74C3C',
  success: '#27AE60',
};

// ============================================
// THEME 4: MIDNIGHT PASSION
// ============================================
export const midnightPassionTheme: ColorTheme = {
  name: 'Midnight Passion',
  description: 'Deep midnight blue with passionate pink accents',
  
  // Brand Colors
  primary: '#FF1493',           // Deep Pink
  secondary: '#FF69B4',         // Hot Pink
  accent: '#FFB6D9',            // Light Pink
  
  // Backgrounds
  dark: '#0C0C1E',              // Midnight Blue
  darkMid: '#1A1A3E',           // Deep Blue
  light: '#F0F4FF',             // Ice Blue
  white: '#FFFFFF',
  
  // Gradients
  gradientStart: '#0C0C1E',
  gradientMid: '#1A1A3E',
  gradientEnd: '#0C0C1E',
  
  // Button Gradients - Glowing Pink
  buttonGradientStart: '#FF1493',
  buttonGradientEnd: '#FF69B4',
  
  // Glass/Transparent
  glassLight: 'rgba(255, 20, 147, 0.12)',
  glassBorder: 'rgba(255, 105, 180, 0.2)',
  glassHeavy: 'rgba(255, 20, 147, 0.25)',
  
  // Text
  textDark: '#0C0C1E',
  textLight: '#FFFFFF',
  textMuted: 'rgba(255, 255, 255, 0.75)',
  textSubtle: 'rgba(255, 105, 180, 0.5)',
  
  // Glow
  glowPrimary: 'rgba(255, 20, 147, 0.7)',
  glowSecondary: 'rgba(255, 105, 180, 0.6)',
  
  // Days
  day1: '#FF1493',
  day2: '#FF69B4',
  day3: '#FFB6D9',
  day4: '#FFC0E0',
  day5: '#FFD9EC',
  
  // Feedback
  error: '#FF4757',
  success: '#2ED573',
};

// ============================================
// THEME REGISTRY
// ============================================
export const themes = {
  elegantDark: elegantDarkTheme,
  luxePinkGold: luxePinkGoldTheme,
  romanticRoseGold: romanticRoseGoldTheme,
  midnightPassion: midnightPassionTheme,
};

export type ThemeName = keyof typeof themes;
