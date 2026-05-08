/**
 * JarEnvelopeAnimation
 * ─────────────────────
 * Reusable jar + flying envelope animation.
 * - Jar sits top-right, shows fill level based on answer count
 * - On triggerEnvelope(), an envelope flies from bottom to the jar
 * - Jar shakes + particle burst on landing
 * - onComplete fires after animation (~820ms) to trigger navigation
 */

import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
} from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import Svg, {
  Path,
  Rect,
  Ellipse,
  Line,
  G,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  ClipPath,
} from 'react-native-svg';
import { responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// ── Tunables ──────────────────────────────────────────────────
const JAR_W = responsiveWidth(11);
const JAR_H = responsiveWidth(13);
const JAR_TOP = responsiveHeight(1.5);
const JAR_RIGHT = responsiveWidth(5);
const ENV_W = responsiveWidth(11);
const ENV_H = responsiveWidth(8);

const JAR_CENTER_X = SCREEN_W - JAR_RIGHT - JAR_W / 2;
const JAR_CENTER_Y = JAR_TOP + JAR_H / 2;
const ENV_START_X = SCREEN_W / 2 - ENV_W / 2;
const ENV_START_Y = SCREEN_H - responsiveHeight(14);

// ── Jar SVG ───────────────────────────────────────────────────
const JarSvg: React.FC<{ fillCount: number }> = ({ fillCount }) => {
  const fillHeight = Math.min((fillCount / 10) * 36, 36);
  return (
    <Svg width={JAR_W} height={JAR_H} viewBox="0 0 56 64">
      <Defs>
        <SvgLinearGradient id="jarGrad" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#2DD4BF" stopOpacity="0.25" />
          <Stop offset="1" stopColor="#1E90FF" stopOpacity="0.18" />
        </SvgLinearGradient>
        <SvgLinearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#6EE87A" stopOpacity="0.85" />
          <Stop offset="1" stopColor="#2DD4BF" stopOpacity="0.95" />
        </SvgLinearGradient>
        <ClipPath id="jarClip">
          <Path d="M10 20 Q8 20 7 22 L4 56 Q4 60 8 60 L48 60 Q52 60 52 56 L49 22 Q48 20 46 20 Z" />
        </ClipPath>
      </Defs>
      {/* Lid */}
      <Rect x="14" y="12" width="28" height="8" rx="4" fill="#2DD4BF" opacity={0.9} />
      <Rect x="12" y="18" width="32" height="4" rx="2" fill="#1E90FF" opacity={0.7} />
      {/* Body */}
      <Path
        d="M10 20 Q8 20 7 22 L4 56 Q4 60 8 60 L48 60 Q52 60 52 56 L49 22 Q48 20 46 20 Z"
        fill="url(#jarGrad)"
        stroke="#2DD4BF"
        strokeWidth="1.5"
        strokeOpacity={0.6}
      />
      {/* Fill level */}
      {fillHeight > 0 && (
        <Rect
          x="5"
          y={60 - fillHeight}
          width="46"
          height={fillHeight}
          fill="url(#fillGrad)"
          clipPath="url(#jarClip)"
          opacity={0.7}
        />
      )}
      {/* Shine */}
      <Path
        d="M14 26 Q13 40 14 50"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        opacity={0.4}
      />
    </Svg>
  );
};

// ── Envelope SVG ──────────────────────────────────────────────
const EnvelopeSvg: React.FC = () => (
  <Svg width={ENV_W} height={ENV_H} viewBox="0 0 44 32">
    <Defs>
      <SvgLinearGradient id="envGrad" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor="#6EE87A" />
        <Stop offset="1" stopColor="#2DD4BF" />
      </SvgLinearGradient>
    </Defs>
    <Rect x="1" y="1" width="42" height="30" rx="4" fill="url(#envGrad)" />
    <Path d="M1 1 L22 18 L43 1" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity={0.8} />
    <Line x1="1" y1="31" x2="16" y2="18" stroke="white" strokeWidth="1" strokeOpacity={0.5} />
    <Line x1="43" y1="31" x2="28" y2="18" stroke="white" strokeWidth="1" strokeOpacity={0.5} />
    <Path
      d="M22 24 C22 24 17 20 17 17 C17 15 19 14 22 17 C25 14 27 15 27 17 C27 20 22 24 22 24 Z"
      fill="white"
      opacity={0.9}
    />
  </Svg>
);

// ── Burst particles ───────────────────────────────────────────
const BURST_PARTICLES = [
  { x: -18, y: -14, color: '#6EE87A' },
  { x:  18, y: -16, color: '#2DD4BF' },
  { x: -22, y:   4, color: '#FFD700' },
  { x:  20, y:   6, color: '#1E90FF' },
  { x:  -8, y: -22, color: '#FF8C00' },
  { x:  10, y: -20, color: '#FF4444' },
];

// ── Public handle ─────────────────────────────────────────────
export interface JarEnvelopeHandle {
  /** Call this when user presses submit.
   *  @param onComplete fires when animation ends
   *  @param skipCount  pass true when re-answering a previous question (don't increment counter)
   */
  triggerEnvelope: (onComplete?: () => void, skipCount?: boolean) => void;
  incrementCount: () => void;
}

// ── Main component ────────────────────────────────────────────
export const JarEnvelopeAnimation = forwardRef<JarEnvelopeHandle>((_, ref) => {
  const [answerCount, setAnswerCount] = useState(0);
  const [showEnvelope, setShowEnvelope] = useState(false);
  const insets = useSafeAreaInsets();

  // Jar top = status bar height + small gap
  const jarTop = insets.top + responsiveHeight(2);
  const jarRight = responsiveWidth(5);

  const envX       = useSharedValue(ENV_START_X);
  const envY       = useSharedValue(ENV_START_Y);
  const envOpacity = useSharedValue(0);
  const envScale   = useSharedValue(1);
  const envRotate  = useSharedValue(0);

  const jarScale   = useSharedValue(1);
  const jarRotate  = useSharedValue(0);
  const burstOpacity = useSharedValue(0);
  const burstScale   = useSharedValue(0.5);

  const doIncrementCount = () => setAnswerCount((c) => c + 1);
  const doHideEnvelope   = () => setShowEnvelope(false);

  useImperativeHandle(ref, () => ({
    incrementCount: doIncrementCount,
    triggerEnvelope: (onComplete?: () => void, skipCount?: boolean) => {
      // Reset envelope position
      envX.value       = ENV_START_X;
      envY.value       = ENV_START_Y;
      envOpacity.value = 0;
      envScale.value   = 1;
      envRotate.value  = 0;
      setShowEnvelope(true);

      // 1. Fade in
      envOpacity.value = withTiming(1, { duration: 150 });

      // 2. Arc flight to jar
      const midX = (ENV_START_X + JAR_CENTER_X) / 2 + 40;
      const midY = JAR_CENTER_Y - 80;

      envX.value = withSequence(
        withTiming(midX, { duration: 350, easing: Easing.out(Easing.quad) }),
        withTiming(JAR_CENTER_X - ENV_W / 2, { duration: 280, easing: Easing.in(Easing.quad) }),
      );
      envY.value = withSequence(
        withTiming(midY, { duration: 350, easing: Easing.out(Easing.quad) }),
        withTiming(JAR_CENTER_Y - ENV_H / 2, { duration: 280, easing: Easing.in(Easing.quad) }),
      );

      // Rotate during flight
      envRotate.value = withSequence(
        withTiming(-25, { duration: 350, easing: Easing.out(Easing.quad) }),
        withTiming(10,  { duration: 280, easing: Easing.in(Easing.quad) }),
      );

      // Scale down as it enters jar
      envScale.value = withDelay(
        480,
        withTiming(0.3, { duration: 200, easing: Easing.in(Easing.cubic) }),
      );

      // Fade out + hide + conditionally increment count
      envOpacity.value = withDelay(
        500,
        withTiming(0, { duration: 180 }, (finished) => {
          if (finished) {
            runOnJS(doHideEnvelope)();
            if (!skipCount) {
              runOnJS(doIncrementCount)();
            }
          }
        }),
      );

      // Jar shake on landing
      jarScale.value = withDelay(
        580,
        withSequence(
          withSpring(1.18, { damping: 4, stiffness: 400 }),
          withSpring(1.0,  { damping: 8, stiffness: 300 }),
        ),
      );
      jarRotate.value = withDelay(
        580,
        withSequence(
          withTiming(-8, { duration: 80 }),
          withTiming( 8, { duration: 80 }),
          withTiming(-4, { duration: 60 }),
          withTiming( 0, { duration: 60 }),
        ),
      );

      // Particle burst
      burstOpacity.value = withDelay(580, withSequence(
        withTiming(1, { duration: 80 }),
        withDelay(200, withTiming(0, { duration: 200 })),
      ));
      burstScale.value = withDelay(580,
        withTiming(1.4, { duration: 320, easing: Easing.out(Easing.quad) }),
      );

      // Fire onComplete after full animation
      if (onComplete) {
        setTimeout(onComplete, 820);
      }
    },
  }));

  const envStyle = useAnimatedStyle(() => ({
    opacity: envOpacity.value,
    transform: [
      { translateX: envX.value },
      { translateY: envY.value },
      { scale: envScale.value },
      { rotate: `${envRotate.value}deg` },
    ],
  }));

  const jarStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: jarScale.value },
      { rotate: `${jarRotate.value}deg` },
    ],
  }));

  const burstStyle = useAnimatedStyle(() => ({
    opacity: burstOpacity.value,
    transform: [{ scale: burstScale.value }],
  }));

  return (
    <>
      {/* Jar — always visible top-right */}
      <Animated.View
        style={[
          styles.jarContainer,
          { top: jarTop, right: jarRight },
          jarStyle,
        ]}
        pointerEvents="none"
      >
        <JarSvg fillCount={answerCount} />
        {answerCount > 0 && (
          <Animated.Text style={styles.countBadge}>{answerCount}</Animated.Text>
        )}
        {/* Burst particles */}
        <Animated.View style={[styles.burst, burstStyle]} pointerEvents="none">
          {BURST_PARTICLES.map((p, i) => (
            <View
              key={i}
              style={[
                styles.particle,
                { left: JAR_W / 2 + p.x, top: JAR_H / 2 + p.y, backgroundColor: p.color },
              ]}
            />
          ))}
        </Animated.View>
      </Animated.View>

      {/* Flying envelope — absolute over everything */}
      {showEnvelope && (
        <Animated.View style={[styles.envelope, envStyle]} pointerEvents="none">
          <EnvelopeSvg />
        </Animated.View>
      )}
    </>
  );
});

JarEnvelopeAnimation.displayName = 'JarEnvelopeAnimation';

const styles = StyleSheet.create({
  jarContainer: {
    position: 'absolute',
    width: JAR_W,
    height: JAR_H,
    zIndex: 999,
  },
  countBadge: {
    position: 'absolute',
    bottom: -4,
    right: -6,
    backgroundColor: '#2DD4BF',
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 3,
    overflow: 'hidden',
  },
  burst: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: JAR_W,
    height: JAR_H,
  },
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  envelope: {
    position: 'absolute',
    zIndex: 1000,
    width: ENV_W,
    height: ENV_H,
  },
});
