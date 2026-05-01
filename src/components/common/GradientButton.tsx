/**
 * GradientButton Component
 * ────────────────────────
 * Premium 3D button with realistic shadows and glossy gradient.
 * Matches the reference design with clean depth and shine.
 */

import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAppColors } from '../../theme';
import { metrics } from '../../theme/metrics';
import { typography } from '../../theme/typography';

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
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  text,
  onPress,
  disabled = false,
  showArrow = true,
  fullWidth = false,
  style,
}) => {
  const colors = useAppColors();

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
      <View style={[styles.shadowContainer, disabled && styles.shadowContainerDisabled]}>
        {/* Button body with gradient */}
        <LinearGradient
          colors={
            disabled
              ? ['rgba(227,139,155,0.3)', 'rgba(205,180,219,0.3)']
              : [colors.buttonGradientStart, colors.buttonGradientEnd]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {/* Top glossy shine */}
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
          
          {/* Content */}
          <View style={styles.content}>
            <Text style={[styles.text, disabled && styles.textDisabled]}>
              {text}
            </Text>
            {showArrow && (
              <Text style={[styles.icon, disabled && styles.textDisabled]}>
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
    shadowOpacity: 0.15,
  },
  gradient: {
    height: metrics.button.height,
    borderRadius: metrics.radius.full,
    position: 'relative',
    overflow: 'hidden',
    // Subtle border for definition
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    borderLeftColor: 'rgba(255, 255, 255, 0.2)',
    borderBottomColor: 'rgba(0, 0, 0, 0.15)',
    borderRightColor: 'rgba(0, 0, 0, 0.1)',
  },
  // Glossy overlay for shine effect
  glossOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60%',
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
  text: {
    ...typography.buttonLarge,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  icon: {
    fontSize: metrics.fontSize.button * 1.3,
    fontFamily: 'DMSans-Bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  textDisabled: {
    color: 'rgba(43, 30, 35, 0.4)',
  },
});
