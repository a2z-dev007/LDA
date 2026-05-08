/**
 * QuizBackground
 * 5 premium light-theme background variants that rotate per question.
 * All built from theme colors — fully reactive to theme changes.
 * Orb opacities and gradients are tuned for bright, airy light themes.
 */

import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAppColors } from '../../theme';
import { AppColors } from '../../theme/ThemeContext';

const { width: W, height: H } = Dimensions.get('window');

interface Props {
  variant: number; // 0–4
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

const BlurOrb: React.FC<OrbProps> = ({ size, color, opacity, top, bottom, left, right, delay = 0 }) => {
  const pulse = useRef(new Animated.Value(0.75)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 3200 + delay, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.75, duration: 3200 + delay, useNativeDriver: true }),
      ])
    );
    const timeout = setTimeout(() => anim.start(), delay);
    return () => { clearTimeout(timeout); anim.stop(); };
  }, []);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        width: size, height: size, borderRadius: size / 2,
        backgroundColor: color,
        opacity: pulse.interpolate({ inputRange: [0.75, 1], outputRange: [opacity * 0.75, opacity] }),
        top: top as any, bottom: bottom as any, left: left as any, right: right as any,
        // Soft shadow bloom for light themes
        shadowColor: color,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: size * 0.35,
      }}
    />
  );
};

// ─── Variant components — receive colors as prop ──────────────
// Opacities are higher than dark-theme equivalents so orbs are
// visible against the bright canvas without looking garish.

// Variant 0 — Radiant top-right bloom
const Variant0: React.FC<{ c: AppColors }> = ({ c }) => (
  <LinearGradient
    colors={[c.gradientStart, c.gradientMid, c.gradientEnd]}
    start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }}
    style={StyleSheet.absoluteFill}
  >
    <BlurOrb size={W * 0.80} color={c.primary}   opacity={0.10} top={-W * 0.28} right={-W * 0.22} />
    <BlurOrb size={W * 0.50} color={c.secondary} opacity={0.09} bottom={H * 0.08} left={-W * 0.08} delay={900} />
    <BlurOrb size={W * 0.30} color={c.accent}    opacity={0.12} top={H * 0.45}  left={W * 0.55} delay={1600} />
  </LinearGradient>
);

// Variant 1 — Diagonal sweep with centre glow
const Variant1: React.FC<{ c: AppColors }> = ({ c }) => (
  <LinearGradient
    colors={[c.dark, c.darkMid, c.dark]}
    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
    style={StyleSheet.absoluteFill}
  >
    <BlurOrb size={W * 1.10} color={c.primary}   opacity={0.09} top={H * 0.12}  left={-W * 0.08} />
    <BlurOrb size={W * 0.55} color={c.accent}    opacity={0.11} bottom={H * 0.04} right={-W * 0.04} delay={1100} />
    <BlurOrb size={W * 0.28} color={c.secondary} opacity={0.13} top={H * 0.06}  left={W * 0.06} delay={500} />
  </LinearGradient>
);

// Variant 2 — Bottom-left anchor with top-right accent
const Variant2: React.FC<{ c: AppColors }> = ({ c }) => (
  <LinearGradient
    colors={[c.dark, c.darkMid, c.darkMid]}
    start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}
    style={StyleSheet.absoluteFill}
  >
    <BlurOrb size={W * 0.85}  color={c.secondary} opacity={0.10} bottom={-W * 0.18} left={-W * 0.18} />
    <BlurOrb size={W * 0.60}  color={c.primary}   opacity={0.09} top={H * 0.04}    right={-W * 0.08} delay={700} />
    <BlurOrb size={W * 0.32}  color={c.accent}    opacity={0.14} top={H * 0.22}    left={W * 0.38} delay={1400} />
  </LinearGradient>
);

// Variant 3 — Vertical centre column
const Variant3: React.FC<{ c: AppColors }> = ({ c }) => (
  <LinearGradient
    colors={[c.dark, c.dark, c.darkMid]}
    start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }}
    style={StyleSheet.absoluteFill}
  >
    <BlurOrb size={W * 0.72}  color={c.primary}   opacity={0.10} top={-W * 0.08}   left={-W * 0.12} />
    <BlurOrb size={W * 0.68}  color={c.secondary} opacity={0.09} bottom={-W * 0.08} right={-W * 0.08} delay={1000} />
    <BlurOrb size={W * 0.38}  color={c.accent}    opacity={0.11} top={H * 0.38}    left={W * 0.28} delay={1800} />
  </LinearGradient>
);

// Variant 4 — Dual-corner bloom
const Variant4: React.FC<{ c: AppColors }> = ({ c }) => (
  <LinearGradient
    colors={[c.darkMid, c.dark, c.gradientEnd]}
    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
    style={StyleSheet.absoluteFill}
  >
    <BlurOrb size={W * 0.78} color={c.primary}   opacity={0.09} top={-W * 0.18}    left={W * 0.08} />
    <BlurOrb size={W * 0.72} color={c.accent}    opacity={0.10} bottom={-W * 0.12} right={W * 0.04} delay={800} />
    <BlurOrb size={W * 0.42} color={c.secondary} opacity={0.11} top={H * 0.32}     left={W * 0.22} delay={1500} />
  </LinearGradient>
);

const VARIANTS = [Variant0, Variant1, Variant2, Variant3, Variant4];

// ─── Main export ──────────────────────────────────────────────
export const QuizBackground: React.FC<Props> = ({ variant }) => {
  const colors = useAppColors();
  const index = ((variant % VARIANTS.length) + VARIANTS.length) % VARIANTS.length;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const prevVariant = useRef(index);

  useEffect(() => {
    if (prevVariant.current === index) return;
    prevVariant.current = index;
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, [index]);

  const ActiveVariant = VARIANTS[index];

  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]}>
      <ActiveVariant c={colors} />
    </Animated.View>
  );
};
