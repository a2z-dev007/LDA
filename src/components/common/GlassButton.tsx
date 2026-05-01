/**
 * GlassButton Component
 * ─────────────────────
 * Beautiful glass morphism button with real blur effect
 * using @react-native-community/blur (works on iOS & Android).
 */

import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Platform } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import { useAppColors } from '../../theme';
import { metrics } from '../../theme/metrics';
import { typography } from '../../theme/typography';

interface GlassButtonProps {
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

export const GlassButton: React.FC<GlassButtonProps> = ({
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
        styles.container,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.glassWrapper}>
        {/* Blur background */}
        <BlurView
          style={styles.blurView}
          blurType={disabled ? 'dark' : 'light'}
          blurAmount={20}
          reducedTransparencyFallbackColor="transparent"
        />

        {/* Color tint overlay */}
        <LinearGradient
          colors={
            disabled
              ? ['rgba(45, 62, 87, 0.5)', 'rgba(45, 62, 87, 0.4)']
              : [`${colors.primary}35`, `${colors.primary}25`]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.tintOverlay}
        />

        {/* Top highlight for glass shine */}
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.05)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.5 }}
          style={styles.topHighlight}
        />

        {/* Border */}
        <View
          style={[
            styles.border,
            {
              borderColor: disabled
                ? 'rgba(143, 161, 177, 0.25)'
                : `${colors.primary}60`,
            },
          ]}
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
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    // Shadow for elevation
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 10,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  },
  glassWrapper: {
    height: metrics.button.height,
    borderRadius: metrics.radius.full,
    overflow: 'hidden',
    position: 'relative',
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  tintOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    borderTopLeftRadius: metrics.radius.full,
    borderTopRightRadius: metrics.radius.full,
  },
  border: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: metrics.radius.full,
    borderWidth: 1.5,
    pointerEvents: 'none',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: metrics.spacing.sm,
    paddingHorizontal: metrics.spacing.lg,
    height: '100%',
    zIndex: 10,
  },
  text: {
    ...typography.buttonLarge,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  icon: {
    fontSize: metrics.fontSize.button * 1.3,
    fontFamily: 'DMSans-Bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  textDisabled: {
    color: 'rgba(245, 247, 250, 0.5)',
  },
});
