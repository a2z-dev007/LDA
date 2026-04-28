/**
 * AnimatedGradientBorderButton
 *
 * Animated glowing border button — no LinearGradient, no overflow:hidden tricks.
 *
 * Approach:
 * - The "border" is a View behind the inner pill with padding = border width
 * - Its backgroundColor animates through pink → gold → pink using
 *   Animated.Value + interpolate on a 0→1→0 loop
 * - useNativeDriver: false is required for backgroundColor but the loop
 *   is simple enough to be smooth at 60fps
 * - A subtle glow (shadowColor) pulses in sync
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  ViewStyle,
} from 'react-native';
import { useAppColors } from '../../theme';

interface Props {
  onPress: () => void;
  label: string;
  sublabel?: string;
  style?: ViewStyle;
  activeOpacity?: number;
}

const BORDER = 2;
const BTN_HEIGHT = 64;
const CYCLE_DURATION = 1800; // ms for one full pink→gold→pink cycle

export const AnimatedGradientBorderButton: React.FC<Props> = ({
  onPress,
  label,
  sublabel,
  style,
  activeOpacity = 0.88,
}) => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const anim = useRef(new Animated.Value(0)).current;
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: CYCLE_DURATION,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: CYCLE_DURATION,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ])
    );

    loop.start();

    return () => {
      mountedRef.current = false;
      loop.stop();
    };
  }, []);

  // Animate border color: primary (pink) → secondary (gold) → primary
  const borderColor = anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [colors.primary, colors.secondary, colors.primary],
  });

  // Animate glow intensity in sync
  const glowOpacity = anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.55, 0.85, 0.55],
  });

  // Animate border width slightly for a pulse feel
  const borderWidth = anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1.5, 3, 1.5],
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={activeOpacity}
      style={[styles.touchable, style]}
    >
      {/* Animated border ring */}
      <Animated.View
        style={[
          styles.borderRing,
          {
            borderColor,
            borderWidth,
            shadowColor: borderColor,
            shadowOpacity: glowOpacity,
          },
        ]}
      >
        {/* Inner pill — solid button face */}
        <View style={styles.innerPill}>
          <View style={styles.contentRow}>
            <View style={styles.textBlock}>
              {sublabel ? (
                <Text style={styles.sublabel}>{sublabel}</Text>
              ) : null}
              <Text style={styles.label} numberOfLines={1}>
                {label}
              </Text>
            </View>
            <Text style={styles.arrow}>→</Text>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  touchable: {
    width: '100%',
  },
  borderRing: {
    height: BTN_HEIGHT,
    borderRadius: 100,
    // Glow
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 12,
    elevation: 0, // elevation interferes with animated shadow on Android
  },
  innerPill: {
    flex: 1,
    borderRadius: 100,
    backgroundColor: c.primary,
    justifyContent: 'center',
    paddingHorizontal: 22,
    // Inset by border so it doesn't overlap the ring
    margin: BORDER,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textBlock: {
    gap: 1,
    flex: 1,
    marginRight: 12,
  },
  sublabel: {
    color: c.textSecondary,
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  label: {
    color: c.text,
    fontSize: 17,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  arrow: {
    color: c.text,
    fontSize: 22,
  },
});
