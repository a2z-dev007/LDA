import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import Svg, {
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
  Ellipse,
  Rect,
  Path,
  Circle,
} from 'react-native-svg';

// ─── Mood intensity map ────────────────────────────────────────────────────────
// Maps a MoodId to a 0–1 intensity value that controls flame height.
export const MOOD_INTENSITY: Record<string, number> = {
  connected: 1.0,
  loved: 0.9,
  playful: 0.8,
  grateful: 0.6,
  missed: 0.5,
  overwhelmed: 0.35,
  frustrated: 0.25,
  distant: 0.15,
};

// ─── Flame colour palettes ─────────────────────────────────────────────────────
// high intensity → warm orange/gold   low intensity → cool blue/purple
const flameColors = (intensity: number) => {
  if (intensity >= 0.7) {
    return { outer: '#FF6B00', mid: '#FFAA00', inner: '#FFE566', core: '#FFFFFF' };
  } else if (intensity >= 0.4) {
    return { outer: '#FF9540', mid: '#FFD080', inner: '#FFF0B0', core: '#FFFFFF' };
  } else {
    return { outer: '#6C8EFF', mid: '#A0BFFF', inner: '#D0E4FF', core: '#FFFFFF' };
  }
};

// ─── Types ─────────────────────────────────────────────────────────────────────
interface AnimatedCandleProps {
  moodId: string | null;
  /** Width of the component (height is derived). Default 120 */
  size?: number;
}

// ─── Component ─────────────────────────────────────────────────────────────────
export const AnimatedCandle: React.FC<AnimatedCandleProps> = ({
  moodId,
  size = 120,
}) => {
  const intensity = moodId ? (MOOD_INTENSITY[moodId] ?? 0.5) : 0.5;

  // ── Animated values ──
  const flameHeightAnim = useRef(new Animated.Value(intensity)).current;
  const flickerAnim = useRef(new Animated.Value(0)).current;  // -1 to 1, sinusoidal
  const glowAnim = useRef(new Animated.Value(intensity)).current;
  const scaleXAnim = useRef(new Animated.Value(1)).current;

  // ── Drive flame height toward new intensity ──
  useEffect(() => {
    Animated.spring(flameHeightAnim, {
      toValue: intensity,
      friction: 8,
      tension: 20,
      useNativeDriver: false,
    }).start();

    Animated.spring(glowAnim, {
      toValue: intensity,
      friction: 9,
      tension: 18,
      useNativeDriver: false,
    }).start();
  }, [intensity]);

  // ── Continuous flicker loop (Softened for organic, smooth candle flutter) ──
  useEffect(() => {
    const flicker = () => {
      Animated.sequence([
        Animated.timing(flickerAnim, {
          toValue: 0.6,
          duration: 700 + Math.random() * 400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(flickerAnim, {
          toValue: -0.6,
          duration: 650 + Math.random() * 350,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(flickerAnim, {
          toValue: 0,
          duration: 550 + Math.random() * 250,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ]).start(flicker);
    };
    flicker();
  }, []);

  // ── Gentle horizontal scale sway (Softened for premium slow swaying) ──
  useEffect(() => {
    const sway = () => {
      Animated.sequence([
        Animated.timing(scaleXAnim, {
          toValue: 1.025,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(scaleXAnim, {
          toValue: 0.975,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(scaleXAnim, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ]).start(sway);
    };
    sway();
  }, []);

  // ── Derived layout ──
  const W = size;
  const CANDLE_W = W * 0.32;
  const CANDLE_H = W * 0.75;
  const WICK_H = W * 0.08;

  // Flame height range: 20% to 90% of candle height
  const MIN_FLAME = W * 0.18;
  const MAX_FLAME = W * 0.82;

  // ── Cross-faded Opacities for Three Flame Color Layers ──
  // Warm Orange Flame: Active at high scores >= 0.7, fades to 0 below 0.55
  const warmOpacity = flameHeightAnim.interpolate({
    inputRange: [0.35, 0.55, 0.7, 1.0],
    outputRange: [0, 0, 1, 1],
    extrapolate: 'clamp',
  });

  // Amber Flame: Active at mid scores 0.5 - 0.65, fades to 0 at low or high ends
  const amberOpacity = flameHeightAnim.interpolate({
    inputRange: [0.3, 0.45, 0.55, 0.65, 0.75],
    outputRange: [0, 1, 1, 1, 0],
    extrapolate: 'clamp',
  });

  // Cool Blue Flame: Active at low scores <= 0.35, fades to 0 at 0.55
  const blueOpacity = flameHeightAnim.interpolate({
    inputRange: [0.0, 0.25, 0.4, 0.55],
    outputRange: [1, 1, 0, 0],
    extrapolate: 'clamp',
  });

  // Stacked Glow Opacities
  const warmGlowOpacity = flameHeightAnim.interpolate({
    inputRange: [0.35, 0.5, 1.0],
    outputRange: [0, 0.2, 0.35],
    extrapolate: 'clamp',
  });

  const blueGlowOpacity = flameHeightAnim.interpolate({
    inputRange: [0.0, 0.35, 0.5],
    outputRange: [0.35, 0.15, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.wrapper, { width: W, height: W * 1.4 }]}>
      {/* Warm Glow Layer */}
      <Animated.View
        style={[
          styles.glow,
          {
            width: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [W * 0.6, W * 1.35] }),
            height: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [W * 0.6, W * 1.35] }),
            borderRadius: W,
            opacity: warmGlowOpacity,
            backgroundColor: '#FFAA0060',
            top: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [W * 0.25, W * -0.1] }),
            alignSelf: 'center',
          },
        ]}
      />

      {/* Blue Glow Layer */}
      <Animated.View
        style={[
          styles.glow,
          {
            width: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [W * 0.6, W * 1.35] }),
            height: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [W * 0.6, W * 1.35] }),
            borderRadius: W,
            opacity: blueGlowOpacity,
            backgroundColor: '#7090FF60',
            top: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [W * 0.25, W * -0.1] }),
            alignSelf: 'center',
          },
        ]}
      />

      {/* Flame (SVG Container) — animated height, width and translation sway */}
      <Animated.View
        style={[
          styles.flameContainer,
          {
            height: flameHeightAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [MIN_FLAME, MAX_FLAME],
            }),
            width: Animated.add(
              flameHeightAnim.interpolate({ inputRange: [0, 1], outputRange: [W * 0.22, W * 0.48] }),
              flickerAnim.interpolate({ inputRange: [-1, 1], outputRange: [-W * 0.015, W * 0.015] }),
            ),
            // translateX wobble
            transform: [
              {
                translateX: flickerAnim.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: [-W * 0.012, 0, W * 0.012],
                }),
              },
              { scaleX: scaleXAnim },
            ],
          },
        ]}
      >
        {/* Warm Gold Flame Svg */}
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: warmOpacity }]}>
          <Svg width="100%" height="100%" viewBox="0 0 60 100" preserveAspectRatio="xMidYMax meet">
            <Defs>
              <RadialGradient id="flameGradWarm" cx="50%" cy="75%" rx="50%" ry="50%">
                <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                <Stop offset="30%" stopColor="#FFE566" stopOpacity="1" />
                <Stop offset="65%" stopColor="#FFAA00" stopOpacity="1" />
                <Stop offset="100%" stopColor="#FF6B00" stopOpacity="0" />
              </RadialGradient>
              <RadialGradient id="innerFlameWarm" cx="50%" cy="80%" rx="30%" ry="30%">
                <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                <Stop offset="100%" stopColor="#FFE566" stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Path
              d="M30 2 C20 20 5 35 5 60 C5 82 16 100 30 100 C44 100 55 82 55 60 C55 35 40 20 30 2 Z"
              fill="url(#flameGradWarm)"
            />
            <Path
              d="M30 30 C24 45 18 58 18 70 C18 84 23 96 30 96 C37 96 42 84 42 70 C42 58 36 45 30 30 Z"
              fill="url(#innerFlameWarm)"
            />
          </Svg>
        </Animated.View>

        {/* Amber Flame Svg */}
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: amberOpacity }]}>
          <Svg width="100%" height="100%" viewBox="0 0 60 100" preserveAspectRatio="xMidYMax meet">
            <Defs>
              <RadialGradient id="flameGradAmber" cx="50%" cy="75%" rx="50%" ry="50%">
                <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                <Stop offset="30%" stopColor="#FFF0B0" stopOpacity="1" />
                <Stop offset="65%" stopColor="#FFD080" stopOpacity="1" />
                <Stop offset="100%" stopColor="#FF9540" stopOpacity="0" />
              </RadialGradient>
              <RadialGradient id="innerFlameAmber" cx="50%" cy="80%" rx="30%" ry="30%">
                <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                <Stop offset="100%" stopColor="#FFF0B0" stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Path
              d="M30 2 C20 20 5 35 5 60 C5 82 16 100 30 100 C44 100 55 82 55 60 C55 35 40 20 30 2 Z"
              fill="url(#flameGradAmber)"
            />
            <Path
              d="M30 30 C24 45 18 58 18 70 C18 84 23 96 30 96 C37 96 42 84 42 70 C42 58 36 45 30 30 Z"
              fill="url(#innerFlameAmber)"
            />
          </Svg>
        </Animated.View>

        {/* Cool Blue Flame Svg */}
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: blueOpacity }]}>
          <Svg width="100%" height="100%" viewBox="0 0 60 100" preserveAspectRatio="xMidYMax meet">
            <Defs>
              <RadialGradient id="flameGradBlue" cx="50%" cy="75%" rx="50%" ry="50%">
                <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                <Stop offset="30%" stopColor="#D0E4FF" stopOpacity="1" />
                <Stop offset="65%" stopColor="#A0BFFF" stopOpacity="1" />
                <Stop offset="100%" stopColor="#6C8EFF" stopOpacity="0" />
              </RadialGradient>
              <RadialGradient id="innerFlameBlue" cx="50%" cy="80%" rx="30%" ry="30%">
                <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                <Stop offset="100%" stopColor="#D0E4FF" stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Path
              d="M30 2 C20 20 5 35 5 60 C5 82 16 100 30 100 C44 100 55 82 55 60 C55 35 40 20 30 2 Z"
              fill="url(#flameGradBlue)"
            />
            <Path
              d="M30 30 C24 45 18 58 18 70 C18 84 23 96 30 96 C37 96 42 84 42 70 C42 58 36 45 30 30 Z"
              fill="url(#innerFlameBlue)"
            />
          </Svg>
        </Animated.View>
      </Animated.View>

      {/* Candle body */}
      <View style={[styles.candleWrapper, { width: CANDLE_W }]}>
        <Svg width={CANDLE_W} height={WICK_H + CANDLE_H + 12} viewBox={`0 0 ${CANDLE_W} ${WICK_H + CANDLE_H + 12}`}>
          <Defs>
            <LinearGradient id="candleBody" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0%" stopColor="#C8D8E8" />
              <Stop offset="30%" stopColor="#EEF4FA" />
              <Stop offset="60%" stopColor="#F8FBFF" />
              <Stop offset="100%" stopColor="#B0C4D4" />
            </LinearGradient>
            <LinearGradient id="candleTop" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#DCE8F2" />
              <Stop offset="100%" stopColor="#C0D0E0" />
            </LinearGradient>
            <RadialGradient id="meltGlow" cx="50%" cy="0%" rx="50%" ry="30%">
              <Stop offset="0%" stopColor={intensity >= 0.4 ? '#FFCC66' : '#A0B8FF'} stopOpacity="0.6" />
              <Stop offset="100%" stopColor="#EEF4FA" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* Wick */}
          <Rect
            x={CANDLE_W / 2 - 1}
            y={2}
            width={2}
            height={WICK_H}
            rx={1}
            fill="#4A3728"
          />

          {/* Melted wax pool at top */}
          <Ellipse
            cx={CANDLE_W / 2}
            cy={WICK_H + 6}
            rx={CANDLE_W / 2}
            ry={6}
            fill="url(#candleTop)"
          />
          <Ellipse
            cx={CANDLE_W / 2}
            cy={WICK_H + 6}
            rx={CANDLE_W / 2}
            ry={6}
            fill="url(#meltGlow)"
          />

          {/* Body */}
          <Rect
            x={0}
            y={WICK_H + 6}
            width={CANDLE_W}
            height={CANDLE_H}
            fill="url(#candleBody)"
          />

          {/* Drip lines */}
          <Path
            d={`M ${CANDLE_W * 0.25} ${WICK_H + 10} Q ${CANDLE_W * 0.2} ${WICK_H + 28} ${CANDLE_W * 0.22} ${WICK_H + 40}`}
            stroke="#D8E8F4"
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
          />
          <Path
            d={`M ${CANDLE_W * 0.7} ${WICK_H + 8} Q ${CANDLE_W * 0.75} ${WICK_H + 22} ${CANDLE_W * 0.72} ${WICK_H + 32}`}
            stroke="#D8E8F4"
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
          />

          {/* Shine highlight */}
          <Rect
            x={CANDLE_W * 0.55}
            y={WICK_H + 14}
            width={CANDLE_W * 0.08}
            height={CANDLE_H * 0.55}
            rx={3}
            fill="rgba(255,255,255,0.45)"
          />

          {/* Bottom ellipse */}
          <Ellipse
            cx={CANDLE_W / 2}
            cy={WICK_H + 6 + CANDLE_H}
            rx={CANDLE_W / 2}
            ry={6}
            fill="#B0C4D4"
          />
        </Svg>
      </View>

      {/* Base shadow */}
      <View style={[styles.shadow, { width: CANDLE_W * 1.4 }]} />
    </View>
  );
};

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    zIndex: 0,
  },
  flameContainer: {
    position: 'absolute',
    bottom: '52%', // sits just above candle top
    zIndex: 2,
    alignSelf: 'center',
  },
  candleWrapper: {
    zIndex: 1,
    alignItems: 'center',
  },
  shadow: {
    height: 6,
    borderRadius: 50,
    backgroundColor: 'rgba(0,0,0,0.10)',
    marginTop: 2,
    alignSelf: 'center',
  },
});
