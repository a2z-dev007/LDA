/**
 * JarEnvelopeAnimation — Premium Glass Jar 💜
 * ─────────────────────────────────────────────
 * Glass jar with paper slips. Full cinematic sequence:
 *   1. Paper flies in arc toward jar
 *   2. Jar lid lifts open with soft bounce
 *   3. Paper curves into open mouth, scales down
 *   4. Impact jar shake + lid snaps closed with bounce
 *   5. Glow pulse + floating heart particles throughout
 *
 * Public API:
 *   triggerEnvelope(onComplete?, skipCount?)
 *   incrementCount()
 */

import React, {
  useImperativeHandle,
  forwardRef,
  useState,
  useRef,
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
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import Svg, {
  Path,
  Rect,
  Ellipse,
  G,
  Defs,
  LinearGradient as SvgLinearGradient,
  RadialGradient as SvgRadialGradient,
  Stop,
  ClipPath,
  Circle,
  Line,
} from 'react-native-svg';
import { responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// ── Sizing ────────────────────────────────────────────────────
const JAR_W         = responsiveWidth(22);
const JAR_H         = responsiveWidth(26);
const LID_H         = responsiveWidth(6);   // animated lid height
const ENV_W         = responsiveWidth(14);
const ENV_H         = responsiveWidth(11);

const JAR_RIGHT     = responsiveWidth(3.5);
const JAR_TOP_EXTRA = responsiveHeight(1.5);

// The jar body top-right anchor
const JAR_RIGHT_EDGE = SCREEN_W - JAR_RIGHT;
const JAR_TOP_BASE   = JAR_TOP_EXTRA; // will be offset by insets at runtime

// Jar mouth center (flight target) — approximate, refined at runtime
const JAR_MOUTH_X = SCREEN_W - JAR_RIGHT - JAR_W / 2;
const JAR_MOUTH_Y = JAR_TOP_EXTRA + LID_H + responsiveHeight(0.5); // top of body

// Paper starts ABOVE the jar (relative to the container)
const ENV_START_X = JAR_W / 2 - ENV_W / 2;
const ENV_START_Y = -responsiveHeight(20);

// ── Palette (Green/Teal Theme) ────────────────────────────────
const C = {
  glassStroke: '#2DD4BF',
  glassShine:  '#FFFFFF',
  glassShadow: '#14B8A6',
  lidRim:      '#0D9488',
  paperBase:   '#F0FDFA',
  paperShadow: '#CCFBF1',
  paperLine:   '#99F6E4',
  heartGreen:  '#2DD4BF',
  heartDark:   '#14B8A6',
  glow:        '#6EE87A',
  glowStrong:  '#2DD4BF',
  sparkTeal:   '#2DD4BF',
  sparkGreen:  '#6EE87A',
  sparkWhite:  '#FFFFFF',
  sparkGold:   '#FFD700',
};

// ── Heart path (centered at origin) ──────────────────────────
const heartD = (s: number) =>
  `M0,${-s*.1} C${-s*.5},${-s*.65} ${-s},${-s*.1} ${-s},${s*.3} C${-s},${s*.8} 0,${s*1.1} 0,${s*1.1} C0,${s*1.1} ${s},${s*.8} ${s},${s*.3} C${s},${-s*.1} ${s*.5},${-s*.65} 0,${-s*.1} Z`;

// ── Paper slip positions inside jar body SVG (viewBox 100×98) ─
const PAPERS = [
  { x: 16, y: 44, w: 30, h: 22, rot: -18, big: false },
  { x: 52, y: 40, w: 28, h: 20, rot:  14, big: false },
  { x: 11, y: 64, w: 26, h: 19, rot: -10, big: false },
  { x: 46, y: 60, w: 32, h: 23, rot:  20, big: false },
  { x: 29, y: 50, w: 30, h: 22, rot:   3, big: true  },
];

// ── Floating heart/sparkle definitions ───────────────────────
const FLOAT_HEARTS = [
  { dx: -JAR_W * 0.55, dy: -JAR_H * 0.2,  size: 5, color: C.sparkTeal,  delay: 0   },
  { dx:  JAR_W * 0.55, dy: -JAR_H * 0.3,  size: 4, color: C.sparkGreen, delay: 80  },
  { dx: -JAR_W * 0.3,  dy: -JAR_H * 0.55, size: 3, color: C.sparkGold,  delay: 160 },
  { dx:  JAR_W * 0.35, dy: -JAR_H * 0.5,  size: 4, color: C.sparkWhite, delay: 50  },
  { dx: -JAR_W * 0.1,  dy: -JAR_H * 0.65, size: 3, color: C.sparkTeal,  delay: 120 },
  { dx:  JAR_W * 0.2,  dy: -JAR_H * 0.1,  size: 5, color: C.sparkGreen, delay: 200 },
];

// ── Burst sparkle particles ───────────────────────────────────
const BURST = [
  { x: -22, y: -18, color: C.sparkTeal,  size: 7 },
  { x:  22, y: -20, color: C.sparkGreen, size: 6 },
  { x: -26, y:   6, color: C.sparkWhite, size: 5 },
  { x:  24, y:   8, color: C.sparkGold,  size: 7 },
  { x: -10, y: -26, color: C.sparkTeal,  size: 5 },
  { x:  12, y: -24, color: C.sparkGreen, size: 6 },
  { x:   2, y: -30, color: C.sparkGold,  size: 5 },
  { x:  28, y: -12, color: C.sparkWhite, size: 4 },
];

// ─────────────────────────────────────────────────────────────
// JarBodySvg — body only, no lid (lid is a separate Animated.View)
// viewBox 100×98 (slightly shorter than full since lid is separate)
// ─────────────────────────────────────────────────────────────
const JarBodySvg: React.FC<{ fillCount: number }> = ({ fillCount }) => {
  const visible = Math.min(fillCount, PAPERS.length);
  return (
    <Svg width={JAR_W} height={JAR_H - LID_H} viewBox="0 0 100 98">
      <Defs>
        <SvgLinearGradient id="glassH" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0"    stopColor="#E6FFFA" stopOpacity="0.97" />
          <Stop offset="0.30" stopColor="#F0FDFA" stopOpacity="0.88" />
          <Stop offset="0.65" stopColor="#E6FFFA" stopOpacity="0.92" />
          <Stop offset="1"    stopColor="#CCFBF1" stopOpacity="0.97" />
        </SvgLinearGradient>
        <SvgRadialGradient id="glow2" cx="38%" cy="28%" r="52%">
          <Stop offset="0"   stopColor="#FFFFFF" stopOpacity="0.55" />
          <Stop offset="1"   stopColor="#2DD4BF" stopOpacity="0" />
        </SvgRadialGradient>
        <SvgLinearGradient id="paperG2" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" />
          <Stop offset="1" stopColor="#F0FDFA" />
        </SvgLinearGradient>
        {/* Neck strip at top of body */}
        <ClipPath id="inside2">
          <Path d="M12 10 Q5 13 4 22 L2 90 Q1 98 10 98 L90 98 Q99 98 98 90 L96 22 Q95 13 88 10 Z" />
        </ClipPath>
        <ClipPath id="fullBody">
          <Path d="M8 6 Q2 10 2 18 L2 90 Q1 98 10 98 L90 98 Q99 98 98 90 L98 18 Q98 10 92 6 Z" />
        </ClipPath>
      </Defs>

      {/* Neck collar */}
      <Rect x="14" y="0" width="72" height="9" rx="4"
        fill="url(#glassH)" stroke={C.glassStroke} strokeWidth="0.8" />
      <Rect x="12" y="7" width="76" height="4" rx="2"
        fill={C.glassShadow} opacity={0.3} />

      {/* Body */}
      <Path
        d="M12 10 Q5 13 4 22 L2 90 Q1 98 10 98 L90 98 Q99 98 98 90 L96 22 Q95 13 88 10 Z"
        fill="url(#glassH)"
        stroke={C.glassStroke}
        strokeWidth="1.5"
      />
      {/* Radial inner glow */}
      <Path
        d="M12 10 Q5 13 4 22 L2 90 Q1 98 10 98 L90 98 Q99 98 98 90 L96 22 Q95 13 88 10 Z"
        fill="url(#glow2)"
      />

      {/* Paper slips */}
      {PAPERS.slice(0, visible).map((p, i) => {
        const cx = p.x + p.w / 2;
        const cy = p.y + p.h / 2;
        return (
          <G key={i} clipPath="url(#inside2)">
            <G transform={`rotate(${p.rot}, ${cx}, ${cy})`}>
              <Rect x={p.x+2} y={p.y+2} width={p.w} height={p.h} rx="3"
                fill={C.paperShadow} opacity={0.4} />
              <Rect x={p.x} y={p.y} width={p.w} height={p.h} rx="3"
                fill="url(#paperG2)" stroke={C.paperLine} strokeWidth="0.7" />
              <Line x1={p.x+5} y1={p.y+p.h*0.40} x2={p.x+p.w-5} y2={p.y+p.h*0.40}
                stroke={C.paperLine} strokeWidth="0.9" />
              <Line x1={p.x+5} y1={p.y+p.h*0.63} x2={p.x+p.w-5} y2={p.y+p.h*0.63}
                stroke={C.paperLine} strokeWidth="0.9" />
              <G transform={`translate(${cx}, ${cy - 1})`}>
                <Path d={heartD(p.big ? 6.5 : 4)}
                  fill={p.big ? C.heartGreen : C.heartDark}
                  opacity={p.big ? 0.95 : 0.78} />
              </G>
              <Path
                d={`M${p.x+p.w-6} ${p.y} L${p.x+p.w} ${p.y+7} L${p.x+p.w-6} ${p.y+7} Z`}
                fill={C.paperShadow} opacity={0.5} />
            </G>
          </G>
        );
      })}

      {/* Glass shine overlays */}
      <Path d="M13 18 Q10 50 12 88" stroke={C.glassShine} strokeWidth="4.5"
        strokeLinecap="round" opacity={0.5} clipPath="url(#fullBody)" />
      <Path d="M21 16 Q18 46 20 80" stroke={C.glassShine} strokeWidth="2"
        strokeLinecap="round" opacity={0.28} clipPath="url(#fullBody)" />
      <Path d="M89 18 Q92 50 90 88" stroke={C.glassShadow} strokeWidth="5"
        strokeLinecap="round" opacity={0.25} clipPath="url(#fullBody)" />
      <Ellipse cx="50" cy="93" rx="28" ry="3.5"
        fill={C.glassShadow} opacity={0.18} clipPath="url(#fullBody)" />

      {/* Re-stroke edge */}
      <Path
        d="M12 10 Q5 13 4 22 L2 90 Q1 98 10 98 L90 98 Q99 98 98 90 L96 22 Q95 13 88 10 Z"
        fill="none" stroke={C.glassStroke} strokeWidth="1.5" />
    </Svg>
  );
};

// ─────────────────────────────────────────────────────────────
// JarLidSvg — standalone lid (knob + body), pivots upward
// viewBox 100×26
// ─────────────────────────────────────────────────────────────
const JarLidSvg: React.FC = () => (
  <Svg width={JAR_W} height={LID_H} viewBox="0 0 100 26">
    <Defs>
      <SvgLinearGradient id="lidG2" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#99F6E4" />
        <Stop offset="1" stopColor="#2DD4BF" />
      </SvgLinearGradient>
    </Defs>
    {/* Knob */}
    <Ellipse cx="50" cy="5.5" rx="14" ry="5.5"
      fill="url(#lidG2)" stroke={C.lidRim} strokeWidth="0.8" />
    <Ellipse cx="50" cy="4" rx="10" ry="3.5"
      fill={C.glassShine} opacity={0.38} />
    {/* Lid body */}
    <Rect x="14" y="10" width="72" height="15" rx="7"
      fill="url(#lidG2)" stroke={C.lidRim} strokeWidth="0.8" />
    {/* Lid shine */}
    <Rect x="19" y="12" width="22" height="5" rx="2.5"
      fill={C.glassShine} opacity={0.42} />
    {/* Bottom rim shadow */}
    <Rect x="12" y="23" width="76" height="3" rx="1.5"
      fill={C.glassShadow} opacity={0.35} />
  </Svg>
);

// ─────────────────────────────────────────────────────────────
// Flying paper slip SVG
// ─────────────────────────────────────────────────────────────
const PaperSlipSvg: React.FC = () => (
  <Svg width={ENV_W} height={ENV_H} viewBox="0 0 48 38">
    <Defs>
      <SvgLinearGradient id="fpG2" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#FFFFFF" />
        <Stop offset="1" stopColor="#F0FDFA" />
      </SvgLinearGradient>
    </Defs>
    <Rect x="2.5" y="2.5" width="44" height="34" rx="3.5"
      fill={C.paperShadow} opacity={0.45} />
    <Rect x="1" y="1" width="44" height="34" rx="3.5"
      fill="url(#fpG2)" stroke={C.paperLine} strokeWidth="1" />
    <Line x1="6" y1="13" x2="42" y2="13" stroke={C.paperLine} strokeWidth="1.1" />
    <Line x1="6" y1="21" x2="42" y2="21" stroke={C.paperLine} strokeWidth="1.1" />
    <Line x1="6" y1="29" x2="42" y2="29" stroke={C.paperLine} strokeWidth="1.1" />
    <G transform="translate(24, 10)">
      <Path d={heartD(6.5)} fill={C.heartGreen} opacity={0.92} />
    </G>
    <Path d="M38 1 L45 8 L38 8 Z" fill={C.paperShadow} opacity={0.55} />
    <Rect x="4" y="3" width="13" height="3" rx="1.5" fill="#FFF" opacity={0.5} />
  </Svg>
);

// ── Public handle ─────────────────────────────────────────────
export interface JarEnvelopeHandle {
  triggerEnvelope: (onComplete?: () => void, skipCount?: boolean) => void;
  incrementCount: () => void;
}

// ─────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────
export const JarEnvelopeAnimation = forwardRef<JarEnvelopeHandle, { initialCount?: number }>(
  ({ initialCount = 0 }, ref) => {
    const [answerCount, setAnswerCount] = useState(initialCount);
    const [showEnvelope, setShowEnvelope] = useState(false);
    const insets = useSafeAreaInsets();

    const jarTop   = insets.top + JAR_TOP_EXTRA;
    const jarRight = JAR_RIGHT;

  // ── Paper (envelope) shared values ──
  const envX       = useSharedValue(ENV_START_X);
  const envY       = useSharedValue(ENV_START_Y);
  const envOpacity = useSharedValue(0);
  const envScale   = useSharedValue(1);
  const envRotate  = useSharedValue(0);

  // ── Lid shared values ──
  const lidTranslateY = useSharedValue(0);
  const lidRotate     = useSharedValue(0);

  // ── Jar body shared values ──
  const jarScale  = useSharedValue(1);
  const jarRotate = useSharedValue(0);

  const doIncrementCount = () => setAnswerCount(c => c + 1);
  const doHideEnvelope   = () => setShowEnvelope(false);

  useImperativeHandle(ref, () => ({
    incrementCount: doIncrementCount,

    triggerEnvelope: (onComplete?: () => void, skipCount?: boolean) => {
      // ── Reset all ──
      envX.value       = ENV_START_X;
      envY.value       = ENV_START_Y;
      envOpacity.value = 0;
      envScale.value   = 1;
      envRotate.value  = 0;
      lidTranslateY.value = 0;
      lidRotate.value     = 0;
      setShowEnvelope(true);

      // ─────────────────────────────────────────────────────
      // TIMELINE (all times in ms from t=0):
      //   0      — paper fades in, begins arc
      //   0–400  — paper arcs to midpoint (ease-out)
      //   300    — lid begins lifting
      //   400–680— paper curves down into jar mouth (ease-in)
      //   550    — glow pulse starts + floating hearts
      //   680    — paper fully inside, fade out, increment
      //   700    — jar body impact shake
      //   720    — lid snaps closed
      //   720    — burst sparkle
      //   840    — onComplete
      // ─────────────────────────────────────────────────────

      // ── 1. Paper fade in ──
      envOpacity.value = withTiming(1, { duration: 300 });

      // ── 2. Paper falling arc flight (Local Coordinates) ──
      // Falls from above, curves slightly to the side, then into mouth
      const targetX = JAR_W / 2 - ENV_W / 2;
      const targetY = LID_H + 5;
      
      const midX = targetX + JAR_W * 0.4; // Curve to the right
      const midY = targetY - JAR_H * 0.4;

      envX.value = withSequence(
        withTiming(midX,    { duration: 400, easing: Easing.out(Easing.cubic) }),
        withTiming(targetX, { duration: 400, easing: Easing.in(Easing.cubic) }),
      );
      envY.value = withSequence(
        withTiming(midY,    { duration: 400, easing: Easing.out(Easing.cubic) }),
        withTiming(targetY, { duration: 400, easing: Easing.in(Easing.cubic) }),
      );

      // ── 3. Paper flutter rotation ──
      envRotate.value = withSequence(
        withTiming(15,  { duration: 400 }),
        withTiming(-10, { duration: 300 }),
        withTiming(0,   { duration: 200 }),
      );

      // ── 4. Paper scales down as it enters ──
      envScale.value = withDelay(
        650,
        withTiming(0.4, { duration: 250, easing: Easing.in(Easing.cubic) }),
      );

      // ── 5. Paper fades out + increment ──
      envOpacity.value = withDelay(
        800,
        withTiming(0, { duration: 100 }, (finished) => {
          if (finished) {
            runOnJS(doHideEnvelope)();
            if (!skipCount) runOnJS(doIncrementCount)();
          }
        }),
      );

      // ── 6. Lid lifts open (starts at t=400) ──
      lidTranslateY.value = withDelay(
        400,
        withSequence(
          withTiming(-LID_H * 1.5, { duration: 250, easing: Easing.out(Easing.quad) }),
          withDelay(70,
            withTiming(0, { duration: 150, easing: Easing.out(Easing.quad) })
          ),
        ),
      );

      lidRotate.value = withDelay(
        400,
        withSequence(
          withTiming(-10, { duration: 250, easing: Easing.out(Easing.quad) }),
          withDelay(70,
            withTiming(0, { duration: 150, easing: Easing.out(Easing.quad) })
          ),
        ),
      );




      // Glow pulse and hearts removed for clarity

      // ── 9. Jar body impact shake (t=800) ──
      jarScale.value = withDelay(
        800,
        withSequence(
          withSpring(1.1, { damping: 5, stiffness: 200 }),
          withSpring(1.0, { damping: 10, stiffness: 150 }),
        ),
      );
      jarRotate.value = withDelay(
        800,
        withSequence(
          withTiming(-4, { duration: 60 }),
          withTiming(4,  { duration: 60 }),
          withTiming(0,  { duration: 60 }),
        ),
      );

      // Burst sparkle removed for clarity

      // ── 11. onComplete ──
      if (onComplete) setTimeout(onComplete, 1100);
    },
  }));

  // ── Animated styles ──────────────────────────────────────────

  const envStyle = useAnimatedStyle(() => ({
    opacity: envOpacity.value,
    transform: [
      { translateX: envX.value },
      { translateY: envY.value },
      { scale: envScale.value },
      { rotate: `${envRotate.value}deg` },
    ],
  }));

  // Lid: positioned absolutely atop jar body
  // translateY lifts it; rotate pivots around its center for tilt
  const lidStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: lidTranslateY.value },
      { rotate: `${lidRotate.value}deg` },
    ],
  }));

  const jarBodyStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: jarScale.value },
      { rotate: `${jarRotate.value}deg` },
    ],
  }));

  // Per-heart animated styles removed

  return (
    <>
      {/* ── Jar assembly (lid + body stacked) ── */}
      <Animated.View
        style={[styles.jarWrapper, jarBodyStyle]}
        pointerEvents="none"
      >
        {/* Lid — sits above body, animates independently */}
        <Animated.View style={[styles.lidContainer, lidStyle]}>
          <JarLidSvg />
        </Animated.View>

        {/* Body with shake */}
        <Animated.View style={[styles.bodyContainer, jarBodyStyle]}>
          <JarBodySvg fillCount={answerCount} />
        </Animated.View>

        {/* Count badge */}
        {answerCount > 0 && (
          <Animated.Text style={styles.countBadge}>{answerCount}</Animated.Text>
        )}
      </Animated.View>

      {/* ── Flying paper slip (absolute, full-screen) ── */}
      {showEnvelope && (
        <Animated.View style={[styles.flySlip, envStyle]} pointerEvents="none">
          <PaperSlipSvg />
        </Animated.View>
      )}
    </>
  );
});

JarEnvelopeAnimation.displayName = 'JarEnvelopeAnimation';

// ── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Wrapper contains glow + lid + body stacked
  jarWrapper: {
    width: JAR_W,
    height: JAR_H + LID_H,    // extra room for lid lift
    zIndex: 999,
    alignItems: 'center',
    // Removed absolute positioning to allow modal centering
  },

  // Glow ring removed

  // Lid sits at top of wrapper, can translate up
  lidContainer: {
    width: JAR_W,
    height: LID_H,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
  },

  // Body sits directly below lid
  bodyContainer: {
    width: JAR_W,
    height: JAR_H - LID_H,
    position: 'absolute',
    top: LID_H,
    left: 0,
    zIndex: 1,
  },

  countBadge: {
    position: 'absolute',
    bottom: 0,
    right: -10,
    backgroundColor: '#2DD4BF',
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 3,
    overflow: 'hidden',
    zIndex: 10,
    shadowColor: '#14B8A6',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.45,
    shadowRadius: 2,
    elevation: 3,
  },

  // Particle styles removed

  flySlip: {
    position: 'absolute',
    zIndex: 1000,
    width: ENV_W,
    height: ENV_H,
  },
});