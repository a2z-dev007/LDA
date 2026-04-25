/**
 * QuizBackground
 * 5 premium background variants that rotate per question.
 * All built from theme colors — no hardcoded values.
 *
 * Variants:
 *  0 — Premium Dark Gradient   (deep navy → purple, pink orb top-right)
 *  1 — Pink Bloom              (dark base, large soft pink bloom centre)
 *  2 — Gold Dust               (dark navy, gold shimmer orb bottom-left)
 *  3 — Midnight Veil           (near-black, dual pink + gold orbs)
 *  4 — Deep Rose Haze          (dark burgundy-navy, rose haze top + bottom)
 */

import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../theme';

const { width: W, height: H } = Dimensions.get('window');

interface Props {
  variant: number; // 0–4, cycles automatically
}

// ─── Soft blur orb ───────────────────────────────────────────
interface OrbProps {
  size: number;
  color: string;
  opacity: number;
  top?: number | string;
  bottom?: number | string;
  left?: number | string;
  right?: number | string;
  delay?: number;
}

const BlurOrb: React.FC<OrbProps> = ({
  size, color, opacity, top, bottom, left, right, delay = 0,
}) => {
  const pulse = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 3000 + delay,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.7,
          duration: 3000 + delay,
          useNativeDriver: true,
        }),
      ])
    );
    const timeout = setTimeout(() => anim.start(), delay);
    return () => {
      clearTimeout(timeout);
      anim.stop();
    };
  }, []);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity: pulse.interpolate({
          inputRange: [0.7, 1],
          outputRange: [opacity * 0.7, opacity],
        }),
        top: top as any,
        bottom: bottom as any,
        left: left as any,
        right: right as any,
        shadowColor: color,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: size * 0.4,
      }}
    />
  );
};

// ─── Variant definitions ──────────────────────────────────────

const Variant0_PremiumDark: React.FC = () => (
  // Deep navy → dark purple gradient + vibrant pink orb top-right
  <LinearGradient
    colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
    start={{ x: 0.1, y: 0 }}
    end={{ x: 0.9, y: 1 }}
    style={StyleSheet.absoluteFillObject}
  >
    {/* Large pink bloom — top right */}
    <BlurOrb
      size={W * 0.85}
      color={colors.primary}
      opacity={0.12}
      top={-W * 0.3}
      right={-W * 0.25}
    />
    {/* Small gold accent — bottom left */}
    <BlurOrb
      size={W * 0.45}
      color={colors.secondary}
      opacity={0.08}
      bottom={H * 0.1}
      left={-W * 0.1}
      delay={800}
    />
  </LinearGradient>
);

const Variant1_PinkBloom: React.FC = () => (
  // Dark base with a large centred pink bloom — most dramatic
  <LinearGradient
    colors={[colors.dark, colors.darkMid, colors.dark]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={StyleSheet.absoluteFillObject}
  >
    {/* Massive centred bloom */}
    <BlurOrb
      size={W * 1.2}
      color={colors.primary}
      opacity={0.14}
      top={H * 0.15}
      left={-W * 0.1}
    />
    {/* Secondary smaller orb — bottom right */}
    <BlurOrb
      size={W * 0.5}
      color={colors.accent}
      opacity={0.1}
      bottom={H * 0.05}
      right={-W * 0.05}
      delay={1200}
    />
    {/* Tiny gold spark — top left */}
    <BlurOrb
      size={W * 0.25}
      color={colors.secondary}
      opacity={0.12}
      top={H * 0.08}
      left={W * 0.05}
      delay={400}
    />
  </LinearGradient>
);

const Variant2_GoldDust: React.FC = () => (
  // Near-black navy with champagne gold shimmer
  <LinearGradient
    colors={[colors.dark, '#0D0D28', colors.darkMid]}
    start={{ x: 0, y: 1 }}
    end={{ x: 1, y: 0 }}
    style={StyleSheet.absoluteFillObject}
  >
    {/* Gold orb — bottom left */}
    <BlurOrb
      size={W * 0.9}
      color={colors.secondary}
      opacity={0.11}
      bottom={-W * 0.2}
      left={-W * 0.2}
    />
    {/* Pink accent — top right */}
    <BlurOrb
      size={W * 0.55}
      color={colors.primary}
      opacity={0.09}
      top={H * 0.05}
      right={-W * 0.1}
      delay={600}
    />
    {/* Tiny gold highlight — centre top */}
    <BlurOrb
      size={W * 0.3}
      color={colors.secondary}
      opacity={0.15}
      top={H * 0.2}
      left={W * 0.35}
      delay={1500}
    />
  </LinearGradient>
);

const Variant3_MidnightVeil: React.FC = () => (
  // Near-black with dual pink + gold orbs creating depth
  <LinearGradient
    colors={[colors.dark, colors.dark, colors.darkMid]}
    start={{ x: 0.5, y: 0 }}
    end={{ x: 0.5, y: 1 }}
    style={StyleSheet.absoluteFillObject}
  >
    {/* Pink orb — upper left */}
    <BlurOrb
      size={W * 0.7}
      color={colors.primary}
      opacity={0.13}
      top={-W * 0.1}
      left={-W * 0.15}
    />
    {/* Gold orb — lower right */}
    <BlurOrb
      size={W * 0.65}
      color={colors.secondary}
      opacity={0.1}
      bottom={-W * 0.1}
      right={-W * 0.1}
      delay={900}
    />
    {/* Accent pink — centre */}
    <BlurOrb
      size={W * 0.35}
      color={colors.accent}
      opacity={0.07}
      top={H * 0.4}
      left={W * 0.3}
      delay={1800}
    />
  </LinearGradient>
);

const Variant4_DeepRoseHaze: React.FC = () => (
  // Diagonal gradient with rose haze top and bottom
  <LinearGradient
    colors={[colors.darkMid, colors.dark, colors.gradientEnd]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={StyleSheet.absoluteFillObject}
  >
    {/* Rose haze — top */}
    <BlurOrb
      size={W * 0.75}
      color={colors.primary}
      opacity={0.1}
      top={-W * 0.2}
      left={W * 0.1}
    />
    {/* Rose haze — bottom */}
    <BlurOrb
      size={W * 0.7}
      color={colors.primary}
      opacity={0.09}
      bottom={-W * 0.15}
      right={W * 0.05}
      delay={700}
    />
    {/* Gold centre accent */}
    <BlurOrb
      size={W * 0.4}
      color={colors.secondary}
      opacity={0.08}
      top={H * 0.35}
      left={W * 0.25}
      delay={1400}
    />
  </LinearGradient>
);

const VARIANTS = [
  Variant0_PremiumDark,
  Variant1_PinkBloom,
  Variant2_GoldDust,
  Variant3_MidnightVeil,
  Variant4_DeepRoseHaze,
];

// ─── Main export ──────────────────────────────────────────────
export const QuizBackground: React.FC<Props> = ({ variant }) => {
  const index = ((variant % VARIANTS.length) + VARIANTS.length) % VARIANTS.length;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const prevVariant = useRef(index);

  useEffect(() => {
    if (prevVariant.current === index) return;
    prevVariant.current = index;

    // Cross-fade on variant change
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [index]);

  const ActiveVariant = VARIANTS[index];

  return (
    <Animated.View
      pointerEvents="none"
      style={[StyleSheet.absoluteFillObject, { opacity: fadeAnim }]}
    >
      <ActiveVariant />
    </Animated.View>
  );
};
