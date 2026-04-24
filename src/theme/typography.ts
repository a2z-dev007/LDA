import { Platform } from 'react-native';

// Typography System
// Playfair Display: Display/Headings - Wt 600 upright, 400-500 italic
// DM Sans: Body/UI - Wt 400 regular, 500 medium ONLY

export const typography = {
  // Playfair Display - Headings
  displayLarge: {
    fontSize: 36,
    fontFamily: 'PlayfairDisplay-SemiBold',
    fontWeight: Platform.OS === 'android' ? undefined : '600',
    lineHeight: 46,
  },
  displayMedium: {
    fontSize: 28,
    fontFamily: 'PlayfairDisplay-SemiBold',
    fontWeight: Platform.OS === 'android' ? undefined : '600',
    lineHeight: 38,
  },
  
  // Playfair Display - Italic (Questions, Quotes)
  displayItalic: {
    fontSize: 32,
    fontFamily: 'PlayfairDisplay-Italic',
    fontWeight: Platform.OS === 'android' ? undefined : '400',
    fontStyle: 'italic' as const,
    lineHeight: 42,
  },
  quoteItalic: {
    fontSize: 24,
    fontFamily: 'PlayfairDisplay-Italic',
    fontWeight: Platform.OS === 'android' ? undefined : '400',
    fontStyle: 'italic' as const,
    lineHeight: 34,
  },

  // DM Sans - Body
  bodyLarge: {
    fontSize: 18,
    fontFamily: 'DMSans-Regular',
    fontWeight: Platform.OS === 'android' ? undefined : '400',
    lineHeight: 26,
  },
  bodyMedium: {
    fontSize: 16,
    fontFamily: 'DMSans-Regular',
    fontWeight: Platform.OS === 'android' ? undefined : '400',
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontFamily: 'DMSans-Regular',
    fontWeight: Platform.OS === 'android' ? undefined : '400',
    lineHeight: 20,
  },

  // DM Sans - UI Elements
  labelLarge: {
    fontSize: 17,
    fontFamily: 'DMSans-Medium',
    fontWeight: Platform.OS === 'android' ? undefined : '500',
    letterSpacing: 0.3,
  },
  labelMedium: {
    fontSize: 14,
    fontFamily: 'DMSans-Medium',
    fontWeight: Platform.OS === 'android' ? undefined : '500',
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontSize: 12,
    fontFamily: 'DMSans-Medium',
    fontWeight: Platform.OS === 'android' ? undefined : '500',
    letterSpacing: 1,
  },
  caption: {
    fontSize: 11,
    fontFamily: 'DMSans-Regular',
    fontWeight: Platform.OS === 'android' ? undefined : '400',
    letterSpacing: 0.5,
  },

  // Buttons
  button: {
    fontSize: 17,
    fontFamily: 'DMSans-Medium',
    fontWeight: Platform.OS === 'android' ? undefined : '500',
    letterSpacing: 0.3,
  },
};
