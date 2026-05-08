/**
 * ─────────────────────────────────────────────────────────────
 *  METRICS  —  Single source of truth for all sizing in the app
 * ─────────────────────────────────────────────────────────────
 *
 *  Built on react-native-responsive-dimensions so every value
 *  scales perfectly across phone sizes and densities.
 *
 *  HOW TO USE
 *  ──────────
 *  import { metrics } from '../theme';
 *
 *  fontSize:   metrics.fontSize.h1          → responsive font size
 *  spacing:    metrics.spacing.md           → responsive padding/margin
 *  radius:     metrics.radius.lg            → border radius
 *  button:     metrics.button.heightLg      → button height
 *              metrics.button.widthFull     → button width (% of screen)
 *              metrics.button.widthHalf     → half-width button
 *
 *  CHANGE ONE VALUE HERE → ENTIRE APP UPDATES
 *  ───────────────────────────────────────────
 *  e.g. bump fontSize.h1 from 4.5 to 5 → every main heading grows.
 *
 *  Units
 *  ─────
 *  responsiveFontSize(n)   → n % of screen diagonal  (pixel-perfect)
 *  responsiveHeight(n)     → n % of screen height
 *  responsiveWidth(n)      → n % of screen width
 */

import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

// ─────────────────────────────────────────────────────────────
//  FONT SIZES
//  Change any value here → every component using it updates.
// ─────────────────────────────────────────────────────────────
export const fontSize = {
  /** Main screen headings  (e.g. "Day 1 – Love Languages") */
  h1: responsiveFontSize(3),
  /** Section headings */
  h2: responsiveFontSize(2.5),
  /** Card / modal headings */
  h3: responsiveFontSize(2),
  /** Sub-headings */
  h4: responsiveFontSize(1.5),

  /** Large body copy */
  bodyLg: responsiveFontSize(2.2),
  /** Default body copy */
  body: responsiveFontSize(2.0),
  /** Small body / secondary text */
  bodySm: responsiveFontSize(1.8),

  /** Button label – large button */
  buttonLg: responsiveFontSize(2.2),
  /** Button label – default button */
  button: responsiveFontSize(2.0),
  /** Button label – small button */
  buttonSm: responsiveFontSize(1.7),

  /** Labels, tags, badges */
  label: responsiveFontSize(1.7),
  /** Captions, hints, timestamps */
  caption: responsiveFontSize(1.4),
  /** Tiny overline / micro text */
  micro: responsiveFontSize(1.2),
};

// ─────────────────────────────────────────────────────────────
//  SPACING  (padding, margin, gap)
// ─────────────────────────────────────────────────────────────
export const spacing = {
  /** 2 px equivalent */
  xxs: responsiveHeight(0.25),
  /** 4 px equivalent */
  xs: responsiveHeight(0.5),
  /** 8 px equivalent */
  sm: responsiveHeight(1.0),
  /** 12 px equivalent */
  smMd: responsiveHeight(1.5),
  /** 16 px equivalent */
  md: responsiveHeight(2.0),
  /** 24 px equivalent */
  lg: responsiveHeight(3.0),
  /** 32 px equivalent */
  xl: responsiveHeight(4.0),
  /** 48 px equivalent */
  xxl: responsiveHeight(6.0),
  /** 64 px equivalent */
  xxxl: responsiveHeight(8.0),
};

// ─────────────────────────────────────────────────────────────
//  BORDER RADIUS
// ─────────────────────────────────────────────────────────────
export const radius = {
  xs: responsiveWidth(1.0),   // ~4 px
  sm: responsiveWidth(2.0),   // ~8 px
  md: responsiveWidth(3.5),   // ~14 px
  lg: responsiveWidth(5.0),   // ~20 px
  xl: responsiveWidth(7.0),   // ~28 px
  xxl: responsiveWidth(10.0), // ~40 px
  full: 9999,                 // pill / circle
};

// ─────────────────────────────────────────────────────────────
//  BUTTON DIMENSIONS
//  Heights use responsiveHeight, widths use responsiveWidth.
// ─────────────────────────────────────────────────────────────
export const button = {
  // ── Heights ──────────────────────────────────────────────
  /** Large CTA button  (e.g. "Start Quiz") */
  heightLg: responsiveHeight(7.5),
  /** Default button */
  height: responsiveHeight(6.5),
  /** Small / compact button */
  heightSm: responsiveHeight(5.5),
  /** Icon-only / chip button */
  heightXs: responsiveHeight(4.5),

  // ── Widths ───────────────────────────────────────────────
  /** Full-width button (with horizontal padding) */
  widthFull: responsiveWidth(90),
  /** Wide button (e.g. modal CTA) */
  widthWide: responsiveWidth(80),
  /** Half-width (side-by-side pair) */
  widthHalf: responsiveWidth(43),
  /** Compact / inline button */
  widthCompact: responsiveWidth(35),

  // ── Padding (horizontal inner padding) ───────────────────
  paddingHzLg: responsiveWidth(8),
  paddingHz: responsiveWidth(6),
  paddingHzSm: responsiveWidth(4),
};

// ─────────────────────────────────────────────────────────────
//  ICON SIZES
// ─────────────────────────────────────────────────────────────
export const iconSize = {
  xs: responsiveWidth(4),   // ~16 px
  sm: responsiveWidth(5),   // ~20 px
  md: responsiveWidth(6),   // ~24 px
  lg: responsiveWidth(8),   // ~32 px
  xl: responsiveWidth(10),  // ~40 px
  xxl: responsiveWidth(14), // ~56 px
};

// ─────────────────────────────────────────────────────────────
//  AVATAR / RING SIZES
// ─────────────────────────────────────────────────────────────
export const avatarSize = {
  sm: responsiveWidth(10),  // ~40 px
  md: responsiveWidth(15),  // ~60 px
  lg: responsiveWidth(20),  // ~80 px
  xl: responsiveWidth(28),  // ~112 px
};

// ─────────────────────────────────────────────────────────────
//  CARD / CONTAINER DIMENSIONS
// ─────────────────────────────────────────────────────────────
export const card = {
  paddingHz: responsiveWidth(5),
  paddingVt: responsiveHeight(2.5),
  borderRadius: radius.lg,
  /** Standard card width */
  width: responsiveWidth(90),
  /** Wide card */
  widthWide: responsiveWidth(95),
};

// ─────────────────────────────────────────────────────────────
//  SCREEN LAYOUT
// ─────────────────────────────────────────────────────────────
export const layout = {
  /** Horizontal screen padding (left/right gutters) */
  screenPaddingHz: responsiveWidth(5),
  /** Vertical screen padding (top/bottom) */
  screenPaddingVt: responsiveHeight(2.5),
  /** Max content width (for tablets / large screens) */
  maxContentWidth: responsiveWidth(100),
};

// ─────────────────────────────────────────────────────────────
//  COMBINED EXPORT  (import { metrics } from '../theme')
// ─────────────────────────────────────────────────────────────
export const metrics = {
  fontSize,
  spacing,
  radius,
  button,
  iconSize,
  avatarSize,
  card,
  layout,
};

export default metrics;
