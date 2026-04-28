/**
 * Typography System
 * ─────────────────
 * All font sizes come from metrics.fontSize — change them there
 * and every text style in the app updates automatically.
 *
 * Font families:
 *  - PlayfairDisplay-* → headings, quotes, display text
 *  - DMSans-*          → body, labels, buttons, captions
 */

import { fontSize } from './metrics';

// ─────────────────────────────────────────────────────────────
//  DISPLAY  (Playfair Display — headings & quotes)
// ─────────────────────────────────────────────────────────────
export const typography = {
  /** Main screen heading  →  metrics.fontSize.h1 */
  displayLarge: {
    fontSize: fontSize.h1,
    fontFamily: 'PlayfairDisplay-SemiBold',
    fontWeight: '600' as const,
    lineHeight: fontSize.h1 * 1.25,
  },
  /** Section heading  →  metrics.fontSize.h2 */
  displayMedium: {
    fontSize: fontSize.h2,
    fontFamily: 'PlayfairDisplay-SemiBold',
    fontWeight: '600' as const,
    lineHeight: fontSize.h2 * 1.3,
  },
  /** Card / modal heading  →  metrics.fontSize.h3 */
  displaySmall: {
    fontSize: fontSize.h3,
    fontFamily: 'PlayfairDisplay-SemiBold',
    fontWeight: '600' as const,
    lineHeight: fontSize.h3 * 1.3,
  },

  /** Italic display (quiz questions)  →  metrics.fontSize.h2 */
  displayItalic: {
    fontSize: fontSize.h2,
    fontFamily: 'PlayfairDisplay-Italic',
    fontWeight: '400' as const,
    fontStyle: 'italic' as const,
    lineHeight: fontSize.h2 * 1.3,
  },
  /** Quote italic large  →  metrics.fontSize.h3 */
  quoteItalicLarge: {
    fontSize: fontSize.h3,
    fontFamily: 'PlayfairDisplay-Italic',
    fontWeight: '400' as const,
    fontStyle: 'italic' as const,
    lineHeight: fontSize.h3 * 1.35,
  },
  /** Quote italic  →  metrics.fontSize.h4 */
  quoteItalic: {
    fontSize: fontSize.h4,
    fontFamily: 'PlayfairDisplay-Italic',
    fontWeight: '400' as const,
    fontStyle: 'italic' as const,
    lineHeight: fontSize.h4 * 1.4,
  },

  // ─────────────────────────────────────────────────────────
  //  BODY  (DM Sans)
  // ─────────────────────────────────────────────────────────
  /** Large body copy  →  metrics.fontSize.bodyLg */
  bodyLarge: {
    fontSize: fontSize.bodyLg,
    fontFamily: 'DMSans-Regular',
    fontWeight: '400' as const,
    lineHeight: fontSize.bodyLg * 1.5,
  },
  /** Default body copy  →  metrics.fontSize.body */
  bodyMedium: {
    fontSize: fontSize.body,
    fontFamily: 'DMSans-Regular',
    fontWeight: '400' as const,
    lineHeight: fontSize.body * 1.5,
  },
  /** Small body / secondary text  →  metrics.fontSize.bodySm */
  bodySmall: {
    fontSize: fontSize.bodySm,
    fontFamily: 'DMSans-Regular',
    fontWeight: '400' as const,
    lineHeight: fontSize.bodySm * 1.5,
  },
  /** Bold body  →  metrics.fontSize.body */
  bodyBold: {
    fontSize: fontSize.body,
    fontFamily: 'DMSans-Bold',
    fontWeight: '700' as const,
    lineHeight: fontSize.body * 1.5,
  },

  // ─────────────────────────────────────────────────────────
  //  LABELS  (DM Sans Medium)
  // ─────────────────────────────────────────────────────────
  /** Large label  →  metrics.fontSize.bodyLg */
  labelLarge: {
    fontSize: fontSize.bodyLg,
    fontFamily: 'DMSans-Medium',
    fontWeight: '500' as const,
    letterSpacing: 0.3,
  },
  /** Default label  →  metrics.fontSize.label */
  labelMedium: {
    fontSize: fontSize.label,
    fontFamily: 'DMSans-Medium',
    fontWeight: '500' as const,
    letterSpacing: 0.5,
  },
  /** Small label  →  metrics.fontSize.caption */
  labelSmall: {
    fontSize: fontSize.caption,
    fontFamily: 'DMSans-Medium',
    fontWeight: '500' as const,
    letterSpacing: 1.0,
  },
  /** Bold label / overline  →  metrics.fontSize.micro */
  labelBold: {
    fontSize: fontSize.micro,
    fontFamily: 'DMSans-Bold',
    fontWeight: '700' as const,
    letterSpacing: 1.8,
  },

  // ─────────────────────────────────────────────────────────
  //  BUTTONS  (DM Sans)
  // ─────────────────────────────────────────────────────────
  /** Large button label  →  metrics.fontSize.buttonLg */
  buttonLarge: {
    fontSize: fontSize.buttonLg,
    fontFamily: 'DMSans-Bold',
    fontWeight: '700' as const,
    letterSpacing: 0.8,
  },
  /** Default button label  →  metrics.fontSize.button */
  button: {
    fontSize: fontSize.button,
    fontFamily: 'DMSans-Medium',
    fontWeight: '500' as const,
    letterSpacing: 0.3,
  },
  /** Small button label  →  metrics.fontSize.buttonSm */
  buttonSmall: {
    fontSize: fontSize.buttonSm,
    fontFamily: 'DMSans-Medium',
    fontWeight: '500' as const,
    letterSpacing: 0.3,
  },

  // ─────────────────────────────────────────────────────────
  //  CAPTIONS & MICRO
  // ─────────────────────────────────────────────────────────
  /** Caption / hint text  →  metrics.fontSize.caption */
  caption: {
    fontSize: fontSize.caption,
    fontFamily: 'DMSans-Regular',
    fontWeight: '400' as const,
    letterSpacing: 0.5,
  },
  /** Micro / overline  →  metrics.fontSize.micro */
  captionSmall: {
    fontSize: fontSize.micro,
    fontFamily: 'DMSans-Regular',
    fontWeight: '400' as const,
    letterSpacing: 2.2,
  },
};

// ─────────────────────────────────────────────────────────────
//  FONT FAMILY CONSTANTS
// ─────────────────────────────────────────────────────────────
export const fonts = {
  dmSansRegular: 'DMSans-Regular',
  dmSansMedium: 'DMSans-Medium',
  dmSansBold: 'DMSans-Bold',
  dmSansItalic: 'DMSans-Italic',

  playfairRegular: 'PlayfairDisplay-Regular',
  playfairItalic: 'PlayfairDisplay-Italic',
  playfairSemiBold: 'PlayfairDisplay-SemiBold',
  playfairMediumItalic: 'PlayfairDisplay-MediumItalic',
};
