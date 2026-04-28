/**
 * QuizBackground
 * 5 premium background variants that rotate per question.
 * All built from theme colors — fully reactive to light/dark mode.
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
  const pulse = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 3000 + delay, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.7, duration: 3000 + delay, useNativeDriver: true }),
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
        opacity: pulse.interpolate({ inputRange: [0.7, 1], outputRange: [opacity * 0.7, opacity] }),
        top: top as any, bottom: bottom as any, left: left as any, right: right as any,
        shadowColor: color,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: size * 0.4,
      }}
    />
  );
};

// ─── Variant components — receive colors as prop ──────────────

const Variant0: React.FC<{ c: AppColors }> = ({ c }) => (
  <LinearGradient
    colors={[c.gradientStart, c.gradientMid, c.gradientEnd]}
    start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }}
    style={StyleSheet.absoluteFill}
  >
    <BlurOrb size={W * 0.85} color={c.primary}   opacity={0.12} top={-W * 0.3}  right={-W * 0.25} />
    <BlurOrb size={W * 0.45} color={c.secondary} opacity={0.08} bottom={H * 0.1} left={-W * 0.1} delay={800} />
  </LinearGradient>
);

const Variant1: React.FC<{ c: AppColors }> = ({ c }) => (
  <LinearGradient
    colors={[c.dark, c.darkMid, c.dark]}
    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
    style={StyleSheet.absoluteFill}
  >
    <BlurOrb size={W * 1.2} color={c.primary}   opacity={0.14} top={H * 0.15}  left={-W * 0.1} />
    <BlurOrb size={W * 0.5} color={c.accent}    opacity={0.10} bottom={H * 0.05} right={-W * 0.05} delay={1200} />
    <BlurOrb size={W * 0.25} color={c.secondary} opacity={0.12} top={H * 0.08}  left={W * 0.05} delay={400} />
  </LinearGradient>
);

const Variant2: React.FC<{ c: AppColors }> = ({ c }) => (
  <LinearGradient
    colors={[c.dark, c.darkMid, c.darkMid]}
    start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}
    style={StyleSheet.absoluteFill}
  >
    <BlurOrb size={W * 0.9}  color={c.secondary} opacity={0.11} bottom={-W * 0.2} left={-W * 0.2} />
    <BlurOrb size={W * 0.55} color={c.primary}   opacity={0.09} top={H * 0.05}   right={-W * 0.1} delay={600} />
    <BlurOrb size={W * 0.3}  color={c.secondary} opacity={0.15} top={H * 0.2}    left={W * 0.35} delay={1500} />
  </LinearGradient>
);

const Variant3: React.FC<{ c: AppColors }> = ({ c }) => (
  <LinearGradient
    colors={[c.dark, c.dark, c.darkMid]}
    start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }}
    style={StyleSheet.absoluteFill}
  >
    <BlurOrb size={W * 0.7}  color={c.primary}   opacity={0.13} top={-W * 0.1}   left={-W * 0.15} />
    <BlurOrb size={W * 0.65} color={c.secondary} opacity={0.10} bottom={-W * 0.1} right={-W * 0.1} delay={900} />
    <BlurOrb size={W * 0.35} color={c.accent}    opacity={0.07} top={H * 0.4}    left={W * 0.3} delay={1800} />
  </LinearGradient>
);

const Variant4: React.FC<{ c: AppColors }> = ({ c }) => (
  <LinearGradient
    colors={[c.darkMid, c.dark, c.gradientEnd]}
    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
    style={StyleSheet.absoluteFill}
  >
    <BlurOrb size={W * 0.75} color={c.primary} opacity={0.10} top={-W * 0.2}    left={W * 0.1} />
    <BlurOrb size={W * 0.7}  color={c.primary} opacity={0.09} bottom={-W * 0.15} right={W * 0.05} delay={700} />
    <BlurOrb size={W * 0.4}  color={c.secondary} opacity={0.08} top={H * 0.35}  left={W * 0.25} delay={1400} />
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
