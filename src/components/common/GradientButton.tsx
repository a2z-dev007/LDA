/**
 * GradientButton Component
 * ────────────────────────
 * Premium 3D button with realistic shadows and glossy gradient.
 * Matches the reference design with clean depth and shine.
 */

import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View, StyleProp, TextStyle, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAppColors } from '../../theme';
import { metrics } from '../../theme/metrics';
import { typography } from '../../theme/typography';

// ─────────────────────────────────────────────────────────────
//  Gradient Variants
// ─────────────────────────────────────────────────────────────
export type GradientVariant = 
  | 'default'           // Uses theme colors
  | 'blushRose'         // Blush rose to peach blossom (day1 → day2)
  | 'roseLavender'      // Blush rose to soft lavender (day1 → day4)
  | 'peachMint'         // Peach blossom to sage mint (day2 → day3)
  | 'mintSky'           // Sage mint to sky mist (day3 → day5)
  | 'lavenderSky'       // Soft lavender to sky mist (day4 → day5)
  | 'roseMint'          // Blush rose to sage mint (day1 → day3)
  | 'peachLavender'     // Peach blossom to soft lavender (day2 → day4)
  | 'lavenderRose'      // Soft lavender to blush rose (day4 → day1) - reverse
  | 'skyLavender'       // Sky mist to soft lavender (day5 → day4) - reverse
  | 'sageBlue'          // Sage green to teal blue
  | 'forestSage'        // Forest teal to sage green
  | 'mintTeal'          // Mint to teal
  | 'sunset'            // Warm coral pink to peachy cream
  | 'dreamy';           // Lavender purple to soft pink

const GRADIENT_VARIANTS: Record<GradientVariant, { start: string; end: string }> = {
  default: { start: '', end: '' }, // Will use theme colors
  
  // ── Love Bloom Theme Gradients ──────────────────────────────
  blushRose: { start: '#E8799D', end: '#F5A67A' },        // day1 → day2: romantic warmth
  roseLavender: { start: '#E8799D', end: '#B8A8D8' },     // day1 → day4: romantic to dreamy
  peachMint: { start: '#F5A67A', end: '#8ECAAA' },        // day2 → day3: warm to fresh
  mintSky: { start: '#8ECAAA', end: '#8CB8D8' },          // day3 → day5: fresh to serene
  lavenderSky: { start: '#B8A8D8', end: '#8CB8D8' },      // day4 → day5: dreamy to calm
  roseMint: { start: '#E8799D', end: '#8ECAAA' },         // day1 → day3: passion to growth
  peachLavender: { start: '#F5A67A', end: '#B8A8D8' },    // day2 → day4: warmth to reflection
  lavenderRose: { start: '#B8A8D8', end: '#E8799D' },     // day4 → day1: reflection to passion
  skyLavender: { start: '#8CB8D8', end: '#B8A8D8' },      // day5 → day4: calm to dreamy
  
  // ── Sage Garden Theme Gradients ─────────────────────────────
  sageBlue: { start: '#6EE87A', end: '#00BCD4' },         // lime green → cyan blue — matches LDA logo
  forestSage: { start: '#2D5F5D', end: '#8FB8A8' },       // forest teal to sage
  mintTeal: { start: '#A8C9BC', end: '#6BA8B8' },         // mint to teal
  
  // ── Additional Premium Gradients ────────────────────────────
  sunset: { start: '#FF9A9E', end: '#FAD0C4' },           // coral pink to peachy cream
  dreamy: { start: '#A18CD1', end: '#FBC2EB' },           // lavender purple to soft pink
};

interface GradientButtonProps {
  /** Button text */
  text: string;
  /** On press handler */
  onPress: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Show arrow icon */
  showArrow?: boolean;
  /** Full width button */
  fullWidth?: boolean;
  /** Custom style for container */
  style?: any;
  /** Gradient variant (predefined color combinations) */
  variant?: GradientVariant;
  /** Custom gradient start color (overrides variant and theme) */
  gradientStart?: string;
  /** Custom gradient end color (overrides variant and theme) */
  gradientEnd?: string;
  /** Custom array of gradient colors (overrides gradientStart, gradientEnd, and variant) */
  gradientColors?: string[];
  /** Optional subtitle text rendered above the main text */
  subtitle?: string;
  /** Optional icon to render on the left */
  icon?: React.ReactNode;
  /** Custom text style */
  textStyle?: StyleProp<TextStyle>;
  /** Custom subtitle style */
  subtitleStyle?: StyleProp<TextStyle>;
  /** Custom container style for the inner content */
  contentStyle?: StyleProp<ViewStyle>;
  /** Custom style for the icon wrapper */
  iconContainerStyle?: StyleProp<ViewStyle>;
  /** Gradient start coordinates (defaults to {x:0, y:0}) */
  gradientStartPosition?: { x: number, y: number };
  /** Gradient end coordinates (defaults to {x:1, y:0}) */
  gradientEndPosition?: { x: number, y: number };
  /** Custom shadow color */
  shadowColor?: string;
  /** Hide the top glossy shine effect */
  hideGlossyOverlay?: boolean;
}

// 3-stop gradient matching the LDA logo: lime green → teal → cyan blue
const SAGE_BLUE_GRADIENT: [string, string, string] = ['#6EE87A', '#2DD4BF', '#00BCD4'];

export const GradientButton: React.FC<GradientButtonProps> = ({
  text,
  onPress,
  disabled = false,
  showArrow = true,
  fullWidth = false,
  style,
  variant = 'default',
  gradientStart,
  gradientEnd,
  gradientColors: customGradientColors,
  subtitle,
  icon,
  textStyle,
  subtitleStyle,
  contentStyle,
  iconContainerStyle,
  gradientStartPosition = { x: 0, y: 0 },
  gradientEndPosition = { x: 1, y: 0 },
  shadowColor,
  hideGlossyOverlay = false,
}) => {
  const colors = useAppColors();

  // Determine gradient colors — sageBlue and default use 3-stop gradient
  const isSageBlue = variant === 'sageBlue' || (variant === 'default' && !gradientStart);
  
  let gradientColors: string[];
  if (disabled) {
    gradientColors = ['#E8D5D8', '#D4D0E8'];
  } else if (customGradientColors && customGradientColors.length > 0) {
    gradientColors = customGradientColors;
  } else if (gradientStart && gradientEnd) {
    gradientColors = [gradientStart, gradientEnd];
  } else if (isSageBlue) {
    gradientColors = SAGE_BLUE_GRADIENT;
  } else if (variant !== 'default') {
    gradientColors = [GRADIENT_VARIANTS[variant].start, GRADIENT_VARIANTS[variant].end];
  } else {
    gradientColors = [colors.buttonGradientStart, '#5FAFC1', '#1E90FF'];
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled}
      style={[
        styles.touchable,
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {/* Shadow container */}
      <View style={[
        styles.shadowContainer, 
        disabled && styles.shadowContainerDisabled,
        shadowColor ? { shadowColor } : null,
      ]}>
        {/* Button body with gradient */}
        <LinearGradient
          colors={gradientColors as any}
          start={gradientStartPosition}
          end={gradientEndPosition}
          style={styles.gradient}
        >
          {/* Top glossy shine */}
          {!hideGlossyOverlay && (
            <LinearGradient
              colors={[
                'rgba(255,255,255,0.5)',
                'rgba(255,255,255,0.25)',
                'rgba(255,255,255,0.05)',
                'rgba(255,255,255,0)',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.glossOverlay}
            />
          )}
          
          {/* Content */}
          <View style={[styles.content, subtitle ? styles.contentWithSubtitle : null, contentStyle]}>
            {icon && (
              <View style={[styles.iconContainer, iconContainerStyle]}>
                {icon}
              </View>
            )}
            
            <View style={styles.textContainer}>
              {subtitle && (
                <Text style={[styles.subtitle, disabled && styles.textDisabled, subtitleStyle]}>
                  {subtitle}
                </Text>
              )}
              <Text style={[styles.text, disabled && styles.textDisabled, subtitle && styles.textWithSubtitle, textStyle]}>
                {text}
              </Text>
            </View>

            {showArrow && (
              <Text style={[styles.arrow, disabled && styles.textDisabled]}>
                →
              </Text>
            )}
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    // Width controlled by parent or fullWidth prop
  },
  fullWidth: {
    width: '100%',
  },
  // Shadow container with realistic depth
  shadowContainer: {
    borderRadius: metrics.radius.full,
    // Outer shadow for depth
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  shadowContainerDisabled: {
    shadowColor: '#C0B8D0',
    shadowOpacity: 0.12,
    elevation: 2,
  },
  gradient: {
    height: metrics.button.height,
    borderRadius: metrics.radius.full,
    position: 'relative',
    overflow: 'hidden',
    // Subtle border for definition
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    // borderTopColor: 'rgba(255, 255, 255, 0.3)',
    // borderLeftColor: 'rgba(255, 255, 255, 0.2)',
    // borderBottomColor: 'rgba(0, 0, 0, 0.15)',
    // borderRightColor: 'rgba(0, 0, 0, 0.1)',
  },
  // Glossy overlay for shine effect
  glossOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    borderTopLeftRadius: metrics.radius.full,
    borderTopRightRadius: metrics.radius.full,
  },
  // Content container
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: metrics.spacing.sm,
    paddingHorizontal: metrics.spacing.lg,
    zIndex: 10,
  },
  contentWithSubtitle: {
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: metrics.spacing.xs,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    ...typography.captionSmall,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'Inter-SemiBold',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  text: {
    ...typography.buttonLarge,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  textWithSubtitle: {
    ...typography.bodyMedium,
    fontFamily: 'Inter-SemiBold',
  },
  arrow: {
    fontSize: metrics.fontSize.button * 1.3,
    fontFamily: 'DMSans-Bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    marginLeft: metrics.spacing.xs,
  },
  textDisabled: {
    color: 'rgba(80, 70, 90, 0.6)',
  },
});
