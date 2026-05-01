import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useAppColors } from '../../theme';

interface Props {
  children: React.ReactNode;
  backgroundColor?: string;  // deprecated — kept for backward compat, ignored
  style?: ViewStyle;
  [key: string]: any; // allow panHandlers spread
}

/**
 * ScreenWrapper
 * ─────────────
 * Premium gradient background for every screen.
 * Uses a rich diagonal base gradient + a soft radial accent blob
 * in the top-right corner for depth and visual interest.
 */
export const ScreenWrapper: React.FC<Props> = ({
  children,
  backgroundColor, // ignored — always uses theme gradient
  style,
  ...rest
}) => {
  const colors = useAppColors();
  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      {/* Soft accent blob — top-right corner */}
      <View
        pointerEvents="none"
        style={[
          styles.blob,
          { backgroundColor: colors.primary },
        ]}
      />
      {/* Soft accent blob — bottom-left corner */}
      <View
        pointerEvents="none"
        style={[
          styles.blobBottomLeft,
          { backgroundColor: colors.secondary },
        ]}
      />

      <SafeAreaView
        style={[styles.root, style]}
        edges={['top', 'bottom', 'left', 'right']}
        {...rest}
      >
        {children}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  // Large soft orb — top-right
  blob: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    top: -100,
    right: -100,
    opacity: 0.12,
  },
  // Smaller soft orb — bottom-left
  blobBottomLeft: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    bottom: -60,
    left: -60,
    opacity: 0.10,
  },
});
