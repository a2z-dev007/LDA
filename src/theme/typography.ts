import { Platform } from 'react-native';

// Typography System
// Font Family Names:
// - Android: Use file name without extension (e.g., 'DMSans-Regular')
// - iOS: Can use either file name or internal name (e.g., 'DM Sans')
// We use file names for consistency across platforms

export const typography = {
  // Playfair Display - Headings
  displayLarge: {
    fontSize: 36,
    fontFamily: 'PlayfairDisplay-SemiBold',
    fontWeight: '600' as const,
    lineHeight: 46,
  },
  displayMedium: {
    fontSize: 28,
    fontFamily: 'PlayfairDisplay-SemiBold',
    fontWeight: '600' as const,
    lineHeight: 38,
  },
  
  // Playfair Display - Italic (Questions, Quotes)
  displayItalic: {
    fontSize: 32,
    fontFamily: 'PlayfairDisplay-Italic',
    fontWeight: '400' as const,
    fontStyle: 'italic' as const,
    lineHeight: 42,
  },
  quoteItalic: {
    fontSize: 24,
    fontFamily: 'PlayfairDisplay-Italic',
    fontWeight: '400' as const,
    fontStyle: 'italic' as const,
    lineHeight: 34,
  },
  quoteItalicLarge: {
    fontSize: 26,
    fontFamily: 'PlayfairDisplay-Italic',
    fontWeight: '400' as const,
    fontStyle: 'italic' as const,
    lineHeight: 38,
  },

  // DM Sans - Body
  bodyLarge: {
    fontSize: 18,
    fontFamily: 'DMSans-Regular',
    fontWeight: '400' as const,
    lineHeight: 26,
  },
  bodyMedium: {
    fontSize: 16,
    fontFamily: 'DMSans-Regular',
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontFamily: 'DMSans-Regular',
    fontWeight: '400' as const,
    lineHeight: 20,
  },

  // DM Sans - Medium Weight
  labelLarge: {
    fontSize: 17,
    fontFamily: 'DMSans-Medium',
    fontWeight: '500' as const,
    letterSpacing: 0.3,
  },
  labelMedium: {
    fontSize: 14,
    fontFamily: 'DMSans-Medium',
    fontWeight: '500' as const,
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontSize: 12,
    fontFamily: 'DMSans-Medium',
    fontWeight: '500' as const,
    letterSpacing: 1,
  },
  
  // DM Sans - Bold Weight
  labelBold: {
    fontSize: 11,
    fontFamily: 'DMSans-Bold',
    fontWeight: '700' as const,
    letterSpacing: 1.8,
  },
  bodyBold: {
    fontSize: 16,
    fontFamily: 'DMSans-Bold',
    fontWeight: '700' as const,
    lineHeight: 24,
  },
  
  // Captions and Small Text
  caption: {
    fontSize: 11,
    fontFamily: 'DMSans-Regular',
    fontWeight: '400' as const,
    letterSpacing: 0.5,
  },
  captionSmall: {
    fontSize: 10,
    fontFamily: 'DMSans-Regular',
    fontWeight: '400' as const,
    letterSpacing: 2.2,
  },

  // Buttons
  button: {
    fontSize: 17,
    fontFamily: 'DMSans-Medium',
    fontWeight: '500' as const,
    letterSpacing: 0.3,
  },
  buttonLarge: {
    fontSize: 18,
    fontFamily: 'DMSans-Bold',
    fontWeight: '700' as const,
    letterSpacing: 0.8,
  },
};

// Font families - Use file names (works on both Android and iOS)
export const fonts = {
  // DM Sans - Use file names without .ttf
  dmSansRegular: 'DMSans-Regular',
  dmSansMedium: 'DMSans-Medium',
  dmSansBold: 'DMSans-Bold',
  dmSansItalic: 'DMSans-Italic',
  
  // Playfair Display - Use file names without .ttf
  playfairRegular: 'PlayfairDisplay-Regular',
  playfairItalic: 'PlayfairDisplay-Italic',
  playfairSemiBold: 'PlayfairDisplay-SemiBold',
  playfairMediumItalic: 'PlayfairDisplay-MediumItalic',
};
