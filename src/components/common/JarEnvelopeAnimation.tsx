/**
 * JarEnvelopeAnimation — Magical Glass Jar 💚
 * ─────────────────────────────────────────────
 * Matches the HTML preview animation flow exactly:
 *   1. Paper spawns above, flies a wide CUBIC-BEZIER ARC (like the HTML)
 *   2. Trail sparkle dots follow paper during flight
 *   3. Lid lifts open with tilt + glow ring pulses
 *   4. Paper drops into mouth, scales down, fades
 *   5. Lid snaps closed with BOUNCE easing
 *   6. Jar body WAVE shake + scale pulse (sinusoidal, like HTML)
 *   7. BURST sparkles explode outward
 *   8. Floating hearts drift upward
 *   9. Ambient rising particles loop continuously
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
  useEffect,
  useCallback,
} from 'react';
import { useJournalStore } from '../../store/useJournalStore';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated as RNAnimated,
  Easing as RNEasing,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  runOnJS,
  Easing,
  cancelAnimation,
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
  Line,
} from 'react-native-svg';
import { responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_W } = Dimensions.get('window');

// ── Sizing ────────────────────────────────────────────────────
const JAR_W  = responsiveWidth(22);
const JAR_H  = responsiveWidth(26);
const LID_H  = responsiveWidth(6);
const ENV_W  = responsiveWidth(14);
const ENV_H  = responsiveWidth(11);

// ── Palette (Teal/Green magical theme) ───────────────────────
const C = {
  // Glass
  glassStroke:  '#2DD4BF',
  glassShine:   '#FFFFFF',
  glassShadow:  '#14B8A6',
  // Lid
  lidTop:       '#99F6E4',
  lidBot:       '#2DD4BF',
  lidRim:       '#0D9488',
  lidKnob:      '#E6FFFA',
  // Paper
  paperBase:    '#F0FDFA',
  paperShadow:  '#CCFBF1',
  paperLine:    '#99F6E4',
  // Hearts
  heartPrimary: '#2DD4BF',
  heartDeep:    '#14B8A6',
  // Particles
  sparkTeal:    '#2DD4BF',
  sparkGreen:   '#6EE87A',
  sparkGold:    '#FFD700',
  sparkWhite:   '#FFFFFF',
  sparkMint:    '#A7F3D0',
  // Glow
  glow:         'rgba(45,212,191,0.35)',
  badge:        '#2DD4BF',
  badgeShadow:  '#14B8A6',
};

// ── Heart path ────────────────────────────────────────────────
const heartD = (s: number) =>
  `M0,${-s * 0.15} C${-s * 0.5},${-s * 0.65} ${-s},${-s * 0.1} ${-s},${s * 0.3} C${-s},${s * 0.8} 0,${s * 1.05} 0,${s * 1.05} C0,${s * 1.05} ${s},${s * 0.8} ${s},${s * 0.3} C${s},${-s * 0.1} ${s * 0.5},${-s * 0.65} 0,${-s * 0.15} Z`;

// ── Paper slips inside jar ────────────────────────────────────
const PAPERS = [
  { x: 16, y: 44, w: 30, h: 22, rot: -18, big: false },
  { x: 52, y: 40, w: 28, h: 20, rot:  14, big: false },
  { x: 11, y: 64, w: 26, h: 19, rot: -10, big: false },
  { x: 46, y: 60, w: 32, h: 23, rot:  20, big: false },
  { x: 29, y: 50, w: 30, h: 22, rot:   3, big: true  },
];

// ── Burst sparkle config ──────────────────────────────────────
const BURST_DEFS = [
  { dx: -36, dy: -28, color: C.sparkTeal,  size: 8 },
  { dx:  36, dy: -30, color: C.sparkGold,  size: 7 },
  { dx: -42, dy:   8, color: C.sparkWhite, size: 6 },
  { dx:  40, dy:  10, color: C.sparkMint,  size: 8 },
  { dx: -18, dy: -44, color: C.sparkGreen, size: 6 },
  { dx:  20, dy: -40, color: C.sparkGold,  size: 7 },
  { dx:   4, dy: -50, color: C.sparkTeal,  size: 6 },
  { dx:  46, dy: -18, color: C.sparkWhite, size: 5 },
  { dx: -46, dy: -15, color: C.sparkGreen, size: 5 },
  { dx:   0, dy: -56, color: C.sparkGold,  size: 7 },
];

// ── Float hearts config ───────────────────────────────────────
const FLOAT_DEFS = [
  { dx: -70, dy:  -60, size: 13, color: C.sparkTeal,  delay:   0 },
  { dx:  72, dy:  -80, size: 11, color: C.sparkGold,  delay:  80 },
  { dx: -40, dy: -100, size:  9, color: C.sparkWhite, delay: 150 },
  { dx:  45, dy:  -90, size: 11, color: C.sparkGreen, delay:  50 },
  { dx:  -5, dy: -115, size:  9, color: C.sparkTeal,  delay: 120 },
  { dx:  60, dy:  -45, size: 13, color: C.sparkMint,  delay: 200 },
];

// ── Ambient particle colors ───────────────────────────────────
const AMBIENT_COLORS = [C.sparkTeal, C.sparkMint, C.sparkGreen, C.sparkGold, C.sparkWhite];

// ─────────────────────────────────────────────────────────────
// Easing helpers (matching HTML exactly)
// ─────────────────────────────────────────────────────────────
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInCubic  = (t: number) => Math.pow(t, 3);
const easeInOut    = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
// Bounce (exact match to HTML)
const bounceOut = (t: number) => {
  const n1 = 7.5625, d1 = 2.75;
  if (t < 1 / d1)       return n1 * t * t;
  if (t < 2 / d1)       return n1 * (t -= 1.5 / d1) * t + 0.75;
  if (t < 2.5 / d1)     return n1 * (t -= 2.25 / d1) * t + 0.9375;
  return                        n1 * (t -= 2.625 / d1) * t + 0.984375;
};

// ─────────────────────────────────────────────────────────────
// requestAnimationFrame ticker (JS-side, for complex curves)
// ─────────────────────────────────────────────────────────────
function raf(
  duration: number,
  onTick: (t: number) => void,
  onDone?: () => void,
): () => void {
  let id: number;
  let start: number | null = null;
  let cancelled = false;
  function frame(now: number) {
    if (cancelled) return;
    if (start === null) start = now;
    const t = Math.min((now - start) / duration, 1);
    onTick(t);
    if (t < 1) { id = requestAnimationFrame(frame); }
    else        { onDone?.(); }
  }
  id = requestAnimationFrame(frame);
  return () => { cancelled = true; cancelAnimationFrame(id); };
}

// ─────────────────────────────────────────────────────────────
// JarBodySvg
// ─────────────────────────────────────────────────────────────
const JarBodySvg: React.FC<{ fillCount: number }> = ({ fillCount }) => {
  const visible = Math.min(fillCount, PAPERS.length);
  return (
    <Svg width={JAR_W} height={JAR_H - LID_H} viewBox="0 0 100 98">
      <Defs>
        <SvgLinearGradient id="jbGlassH" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0"    stopColor="#E6FFFA" stopOpacity="0.97" />
          <Stop offset="0.30" stopColor="#F0FDFA" stopOpacity="0.88" />
          <Stop offset="0.65" stopColor="#E6FFFA" stopOpacity="0.92" />
          <Stop offset="1"    stopColor="#CCFBF1" stopOpacity="0.97" />
        </SvgLinearGradient>
        <SvgRadialGradient id="jbGlow" cx="35%" cy="25%" r="58%">
          <Stop offset="0"   stopColor="#FFFFFF" stopOpacity="0.55" />
          <Stop offset="1"   stopColor="#2DD4BF" stopOpacity="0"   />
        </SvgRadialGradient>
        <SvgLinearGradient id="jbPaperG" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFFFFF"  />
          <Stop offset="1" stopColor="#F0FDFA"  />
        </SvgLinearGradient>
        <ClipPath id="jbInside">
          <Path d="M12 10 Q5 13 4 22 L2 90 Q1 98 10 98 L90 98 Q99 98 98 90 L96 22 Q95 13 88 10 Z" />
        </ClipPath>
        <ClipPath id="jbFull">
          <Path d="M8 6 Q2 10 2 18 L2 90 Q1 98 10 98 L90 98 Q99 98 98 90 L98 18 Q98 10 92 6 Z" />
        </ClipPath>
      </Defs>

      {/* Neck collar */}
      <Rect x="14" y="0" width="72" height="9" rx="4"
        fill="url(#jbGlassH)" stroke={C.glassStroke} strokeWidth="0.8" />
      <Rect x="12" y="7" width="76" height="4" rx="2"
        fill={C.glassShadow} opacity={0.3} />

      {/* Body */}
      <Path
        d="M12 10 Q5 13 4 22 L2 90 Q1 98 10 98 L90 98 Q99 98 98 90 L96 22 Q95 13 88 10 Z"
        fill="url(#jbGlassH)" stroke={C.glassStroke} strokeWidth="1.5"
      />
      <Path
        d="M12 10 Q5 13 4 22 L2 90 Q1 98 10 98 L90 98 Q99 98 98 90 L96 22 Q95 13 88 10 Z"
        fill="url(#jbGlow)"
      />

      {/* Shimmer top highlight */}
      <Path d="M20 14 Q50 10 80 14" stroke="#FFFFFF" strokeWidth="2"
        strokeLinecap="round" opacity={0.6} />

      {/* Paper slips */}
      {PAPERS.slice(0, visible).map((p, i) => {
        const cx = p.x + p.w / 2;
        const cy = p.y + p.h / 2;
        return (
          <G key={i} clipPath="url(#jbInside)">
            <G transform={`rotate(${p.rot}, ${cx}, ${cy})`}>
              <Rect x={p.x + 2} y={p.y + 2} width={p.w} height={p.h} rx="3"
                fill={C.paperShadow} opacity={0.45} />
              <Rect x={p.x} y={p.y} width={p.w} height={p.h} rx="3"
                fill="url(#jbPaperG)" stroke={C.paperLine} strokeWidth="0.7" />
              <Line x1={p.x + 5} y1={p.y + p.h * 0.38} x2={p.x + p.w - 5} y2={p.y + p.h * 0.38}
                stroke={C.paperLine} strokeWidth="0.8" />
              <Line x1={p.x + 5} y1={p.y + p.h * 0.62} x2={p.x + p.w - 5} y2={p.y + p.h * 0.62}
                stroke={C.paperLine} strokeWidth="0.8" />
              <G transform={`translate(${cx}, ${cy - 1})`}>
                <Path d={heartD(p.big ? 5.5 : 3.8)}
                  fill={p.big ? C.heartPrimary : C.heartDeep}
                  opacity={p.big ? 0.95 : 0.75} />
              </G>
            </G>
          </G>
        );
      })}

      {/* Glass shine stripes */}
      <Path d="M13 18 Q10 50 12 88" stroke={C.glassShine} strokeWidth="5.5"
        strokeLinecap="round" opacity={0.52} clipPath="url(#jbFull)" />
      <Path d="M21 16 Q18 46 20 80" stroke={C.glassShine} strokeWidth="2"
        strokeLinecap="round" opacity={0.28} clipPath="url(#jbFull)" />
      <Path d="M89 18 Q92 50 90 88" stroke={C.glassShadow} strokeWidth="5"
        strokeLinecap="round" opacity={0.22} clipPath="url(#jbFull)" />
      <Ellipse cx="50" cy="93" rx="28" ry="3.5"
        fill={C.glassShadow} opacity={0.18} clipPath="url(#jbFull)" />

      {/* Re-stroke edge */}
      <Path
        d="M12 10 Q5 13 4 22 L2 90 Q1 98 10 98 L90 98 Q99 98 98 90 L96 22 Q95 13 88 10 Z"
        fill="none" stroke={C.glassStroke} strokeWidth="1.5"
      />
    </Svg>
  );
};

// ─────────────────────────────────────────────────────────────
// JarLidSvg
// ─────────────────────────────────────────────────────────────
const JarLidSvg: React.FC = () => (
  <Svg width={JAR_W} height={LID_H} viewBox="0 0 100 26">
    <Defs>
      <SvgLinearGradient id="jlGrad" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0"   stopColor="#99F6E4" />
        <Stop offset="0.5" stopColor="#2DD4BF" />
        <Stop offset="1"   stopColor="#0D9488" />
      </SvgLinearGradient>
      <SvgLinearGradient id="jlKnob" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#E6FFFA" />
        <Stop offset="1" stopColor="#99F6E4" />
      </SvgLinearGradient>
      <SvgRadialGradient id="jlKnobShine" cx="40%" cy="35%" r="55%">
        <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.7" />
        <Stop offset="1" stopColor="#2DD4BF" stopOpacity="0"   />
      </SvgRadialGradient>
    </Defs>
    {/* Lid body */}
    <Rect x="12" y="14" width="76" height="11" rx="5.5"
      fill="url(#jlGrad)" stroke={C.lidRim} strokeWidth="0.8" />
    {/* Rim shadow */}
    <Rect x="10" y="23" width="80" height="2.5" rx="1.2"
      fill={C.glassShadow} opacity={0.35} />
    {/* Shine streak */}
    <Rect x="18" y="16" width="22" height="5" rx="2.5"
      fill={C.glassShine} opacity={0.42} />
    {/* Gold rim accent */}
    <Rect x="12" y="19" width="76" height="2" rx="1"
      fill="#6EE87A" opacity={0.3} />
    {/* Knob */}
    <Ellipse cx="50" cy="8" rx="16" ry="8"
      fill="url(#jlKnob)" stroke={C.lidRim} strokeWidth="0.8" />
    <Ellipse cx="50" cy="6.5" rx="11" ry="5.5"
      fill="url(#jlKnobShine)" />
    <Ellipse cx="44" cy="5.5" rx="3.5" ry="2.5"
      fill={C.glassShine} opacity={0.55} />
  </Svg>
);

// ─────────────────────────────────────────────────────────────
// PaperSlipSvg (flying)
// ─────────────────────────────────────────────────────────────
const PaperSlipSvg: React.FC = () => (
  <Svg width={ENV_W} height={ENV_H} viewBox="0 0 48 38">
    <Defs>
      <SvgLinearGradient id="fpGrad" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#FFFFFF"  />
        <Stop offset="1" stopColor="#F0FDFA"  />
      </SvgLinearGradient>
    </Defs>
    <Rect x="2.5" y="2.5" width="44" height="34" rx="3.5"
      fill={C.paperShadow} opacity={0.5} />
    <Rect x="1" y="1" width="44" height="34" rx="3.5"
      fill="url(#fpGrad)" stroke={C.paperLine} strokeWidth="1" />
    <Line x1="6" y1="13" x2="42" y2="13" stroke={C.paperLine} strokeWidth="1.1" />
    <Line x1="6" y1="21" x2="42" y2="21" stroke={C.paperLine} strokeWidth="1.1" />
    <Line x1="6" y1="29" x2="42" y2="29" stroke={C.paperLine} strokeWidth="1.1" />
    <G transform="translate(24, 10)">
      <Path d={heartD(6.5)} fill={C.heartPrimary} opacity={0.92} />
    </G>
    <Path d="M38 1 L45 8 L38 8 Z" fill={C.paperShadow} opacity={0.55} />
    <Rect x="4" y="3" width="13" height="3" rx="1.5" fill="#FFF" opacity={0.5} />
  </Svg>
);

// ─────────────────────────────────────────────────────────────
// Particle types for magic effects
// ─────────────────────────────────────────────────────────────
interface BurstParticle {
  id: number;
  x: RNAnimated.Value;
  y: RNAnimated.Value;
  opacity: RNAnimated.Value;
  scale: RNAnimated.Value;
  color: string;
  size: number;
}

interface FloatHeart {
  id: number;
  x: RNAnimated.Value;
  y: RNAnimated.Value;
  opacity: RNAnimated.Value;
  scale: RNAnimated.Value;
  color: string;
  size: number;
}

interface TrailDot {
  id: number;
  left: number;
  top: number;
  opacity: RNAnimated.Value;
  scale: RNAnimated.Value;
  color: string;
}

interface AmbientParticle {
  id: number;
  left: number;
  bottom: number;
  size: number;
  color: string;
  opacity: RNAnimated.Value;
  translateY: RNAnimated.Value;
  scale: RNAnimated.Value;
}

// ── Public handle ─────────────────────────────────────────────
export interface JarEnvelopeHandle {
  triggerEnvelope: (onComplete?: () => void, skipCount?: boolean) => void;
  incrementCount: () => void;
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────
export const JarEnvelopeAnimation = forwardRef<JarEnvelopeHandle, { initialCount?: number }>(
  ({ initialCount }, ref) => {
    const jarMemoriesCount = useJournalStore((s) => s.jarMemories.length);
    const [localCount, setLocalCount] = useState<number | null>(null);
    const displayCount =
      localCount !== null
        ? localCount
        : initialCount !== undefined
        ? initialCount
        : jarMemoriesCount;

    const insets = useSafeAreaInsets();
    const animatingRef = useRef(false);
    const cancelFlightRef = useRef<(() => void) | null>(null);

    // ── Paper position (JS-driven cubic bezier, exact HTML match) ──
    const [paperState, setPaperState] = useState({
      visible: false,
      x: 0,
      y: -100,
      rot: -20,
      scale: 1,
      opacity: 0,
    });

    // ── Lid (Reanimated) ──
    const lidTransY  = useSharedValue(0);
    const lidRotate  = useSharedValue(0);

    // ── Jar body (Reanimated) ──
    const bodyRotate = useSharedValue(0);
    const bodyScale  = useSharedValue(1);

    // ── Glow ring ──
    const glowOpacity = useSharedValue(0);
    const glowScale   = useSharedValue(0);

    // ── Burst particles ──
    const [burstParticles, setBurstParticles] = useState<BurstParticle[]>([]);

    // ── Float hearts ──
    const [floatHearts, setFloatHearts] = useState<FloatHeart[]>([]);

    // ── Trail dots ──
    const [trailDots, setTrailDots] = useState<TrailDot[]>([]);
    const trailIdRef = useRef(0);

    // ── Ambient particles ──
    const [ambientParticles, setAmbientParticles] = useState<AmbientParticle[]>([]);
    const ambientIdRef = useRef(0);

    // ── Badge bounce ──
    const badgeScale = useSharedValue(1);

    // ── Animated styles ──────────────────────────────────────
    const lidStyle = useAnimatedStyle(() => ({
      transform: [
        { translateY: lidTransY.value },
        { rotate: `${lidRotate.value}deg` },
      ],
    }));

    const bodyStyle = useAnimatedStyle(() => ({
      transform: [
        { rotate: `${bodyRotate.value}deg` },
        { scale: bodyScale.value },
      ],
    }));

    const glowStyle = useAnimatedStyle(() => ({
      opacity: glowOpacity.value,
      transform: [{ scale: glowScale.value }],
    }));

    const badgeStyle = useAnimatedStyle(() => ({
      transform: [{ scale: badgeScale.value }],
    }));

    // ── Ambient particle spawner ──────────────────────────────
    useEffect(() => {
      const interval = setInterval(() => {
        const id = ambientIdRef.current++;
        const opacity    = new RNAnimated.Value(0);
        const translateY = new RNAnimated.Value(0);
        const scale      = new RNAnimated.Value(1);
        const particle: AmbientParticle = {
          id,
          left:   10 + Math.random() * 80,   // % of JAR_W
          bottom: 5 + Math.random() * 40,
          size:   3 + Math.random() * 4,
          color:  AMBIENT_COLORS[Math.floor(Math.random() * AMBIENT_COLORS.length)],
          opacity,
          translateY,
          scale,
        };
        setAmbientParticles(prev => [...prev.slice(-12), particle]);

        // float up and fade
        RNAnimated.parallel([
          RNAnimated.sequence([
            RNAnimated.timing(opacity, { toValue: 0.6, duration: 400, useNativeDriver: true }),
            RNAnimated.timing(opacity, { toValue: 0,   duration: 2600, useNativeDriver: true }),
          ]),
          RNAnimated.timing(translateY, { toValue: -responsiveHeight(12), duration: 3500, easing: RNEasing.linear, useNativeDriver: true }),
          RNAnimated.sequence([
            RNAnimated.delay(2800),
            RNAnimated.timing(scale, { toValue: 0.3, duration: 700, useNativeDriver: true }),
          ]),
        ]).start(() => {
          setAmbientParticles(prev => prev.filter(p => p.id !== id));
        });
      }, 700);

      return () => clearInterval(interval);
    }, []);

    // ── Spawn trail dot ───────────────────────────────────────
    const spawnTrail = useCallback((x: number, y: number) => {
      const id    = trailIdRef.current++;
      const opacity = new RNAnimated.Value(0.8);
      const scale   = new RNAnimated.Value(1);
      const colors  = [C.sparkTeal, C.sparkGold, C.sparkGreen];
      const dot: TrailDot = {
        id, left: x, top: y,
        opacity, scale,
        color: colors[Math.floor(Math.random() * 3)],
      };
      setTrailDots(prev => [...prev.slice(-20), dot]);
      RNAnimated.parallel([
        RNAnimated.timing(opacity, { toValue: 0, duration: 500, useNativeDriver: true }),
        RNAnimated.timing(scale,   { toValue: 0.3, duration: 500, useNativeDriver: true }),
      ]).start(() => {
        setTrailDots(prev => prev.filter(d => d.id !== id));
      });
    }, []);

    // ── Trigger burst sparkles ────────────────────────────────
    const triggerBurst = useCallback(() => {
      const particles: BurstParticle[] = BURST_DEFS.map((b, i) => ({
        id: i,
        x:       new RNAnimated.Value(0),
        y:       new RNAnimated.Value(0),
        opacity: new RNAnimated.Value(0),
        scale:   new RNAnimated.Value(1),
        color:   b.color,
        size:    b.size,
      }));
      setBurstParticles(particles);

      particles.forEach((p, i) => {
        const b = BURST_DEFS[i];
        setTimeout(() => {
          p.opacity.setValue(1);
          p.x.setValue(0);
          p.y.setValue(0);
          RNAnimated.parallel([
            RNAnimated.timing(p.x,       { toValue: b.dx, duration: 550, easing: RNEasing.out(RNEasing.cubic), useNativeDriver: true }),
            RNAnimated.timing(p.y,       { toValue: b.dy, duration: 550, easing: RNEasing.out(RNEasing.cubic), useNativeDriver: true }),
            RNAnimated.timing(p.opacity, { toValue: 0,    duration: 550, easing: RNEasing.out(RNEasing.quad),  useNativeDriver: true }),
            RNAnimated.timing(p.scale,   { toValue: 0.2,  duration: 550, useNativeDriver: true }),
          ]).start();
        }, i * 20);
      });

      setTimeout(() => setBurstParticles([]), 800);
    }, []);

    // ── Trigger floating hearts ───────────────────────────────
    const triggerFloatHearts = useCallback(() => {
      const hearts: FloatHeart[] = FLOAT_DEFS.map((h, i) => ({
        id: i,
        x:       new RNAnimated.Value(0),
        y:       new RNAnimated.Value(0),
        opacity: new RNAnimated.Value(0),
        scale:   new RNAnimated.Value(1),
        color:   h.color,
        size:    h.size,
      }));
      setFloatHearts(hearts);

      hearts.forEach((heart, i) => {
        const h = FLOAT_DEFS[i];
        setTimeout(() => {
          heart.opacity.setValue(1);
          RNAnimated.parallel([
            RNAnimated.timing(heart.x,       { toValue: h.dx,  duration: 1100, easing: RNEasing.out(RNEasing.cubic), useNativeDriver: true }),
            RNAnimated.timing(heart.y,       { toValue: h.dy - 30, duration: 1100, easing: RNEasing.out(RNEasing.cubic), useNativeDriver: true }),
            RNAnimated.timing(heart.opacity, { toValue: 0, duration: 1100, easing: RNEasing.out(RNEasing.quad),  useNativeDriver: true }),
            RNAnimated.timing(heart.scale,   { toValue: 0.3, duration: 1100, useNativeDriver: true }),
          ]).start();
        }, h.delay);
      });

      setTimeout(() => setFloatHearts([]), 1400);
    }, []);

    // ── Main animation (cubic bezier arc, exact HTML flow) ────
    useImperativeHandle(ref, () => ({
      incrementCount: () => {},

      triggerEnvelope: (onComplete?: () => void, _skipCount?: boolean) => {
        if (animatingRef.current) return;
        animatingRef.current = true;

        const startCount =
          initialCount !== undefined ? initialCount : jarMemoriesCount;
        setLocalCount(startCount);

        // Jar container dimensions (paper positions are relative to this)
        // Paper starts above jar center
        const startX = JAR_W / 2 - ENV_W / 2 - JAR_W * 0.5; // centered-ish, offset left
        const startY = -responsiveHeight(18);

        // Jar mouth target
        const mouthX = JAR_W / 2 - ENV_W / 2;
        const mouthY = LID_H + responsiveWidth(1);

        // Cubic bezier control points (matching HTML wide arc)
        const arc1X = startX - JAR_W * 0.8;
        const arc1Y = startY + responsiveHeight(4);
        const arc2X = mouthX + JAR_W * 0.3;
        const arc2Y = mouthY - responsiveHeight(6);

        // PHASE 1: Paper flies in arc (0–600ms)
        setPaperState({ visible: true, x: startX, y: startY, rot: -20, scale: 1, opacity: 1 });

        let lastTrailT = 0;

        const cancelPhase1 = raf(600, (t) => {
          // Cubic bezier position
          const t1 = 1 - t;
          const x = t1*t1*t1*startX + 3*t1*t1*t*arc1X + 3*t1*t*t*arc2X + t*t*t*mouthX;
          const y = t1*t1*t1*startY + 3*t1*t1*t*arc1Y + 3*t1*t*t*arc2Y + t*t*t*mouthY;
          const rot = lerp(-20, 10, easeInOut(t));

          setPaperState(prev => ({ ...prev, x, y, rot, opacity: 1 }));

          // Spawn trail dots ~35% chance each frame
          if (t - lastTrailT > 0.05 && Math.random() < 0.55) {
            lastTrailT = t;
            spawnTrail(x + ENV_W / 2, y + ENV_H / 2);
          }
        }, () => {
          // PHASE 2: Lid lifts (600–880ms)
          const lidLiftPx = LID_H * 1.8;

          // Pulse glow on
          glowOpacity.value = withTiming(1, { duration: 250 });
          glowScale.value   = withTiming(1, { duration: 250 });

          const cancelLidOpen = raf(280, (t) => {
            const lift = easeOutCubic(t) * -lidLiftPx;
            const rot  = easeOutCubic(t) * -14;
            lidTransY.value  = lift;
            lidRotate.value  = rot;
          }, () => {
            // PHASE 3: Paper drops into mouth (880–1160ms)
            const fromX = mouthX, fromY = mouthY;
            const toX   = mouthX + ENV_W * 0.3;
            const toY   = mouthY + JAR_H * 0.28;

            const cancelDrop = raf(280, (t) => {
              const e   = easeInCubic(t);
              const x   = lerp(fromX, toX,  e);
              const y   = lerp(fromY, toY,  e);
              const sc  = lerp(1,     0.25, e);
              const rot = lerp(10, 5, t);
              const op  = 1 - e * 0.7;
              setPaperState(prev => ({ ...prev, x, y, rot, scale: sc, opacity: op }));
            }, () => {
              // Paper fully in
              setPaperState(prev => ({ ...prev, visible: false, opacity: 0 }));

              // Increment count
              setLocalCount(c => (c !== null ? c + 1 : startCount + 1));
              // Badge bounce
              badgeScale.value = withSequence(
                withTiming(1.45, { duration: 150 }),
                withSpring(1.0,  { damping: 8, stiffness: 200 }),
              );

              // PHASE 4: Lid snaps closed with bounce (1160–1460ms)
              const cancelLidClose = raf(300, (t) => {
                const e = bounceOut(t);
                lidTransY.value = -lidLiftPx * (1 - e);
                lidRotate.value = -14 * (1 - e);
              }, () => {
                lidTransY.value = 0;
                lidRotate.value = 0;

                // PHASE 5: Jar body wave shake + scale pulse (HTML-exact sinusoidal)
                triggerBurst();
                triggerFloatHearts();
                glowOpacity.value = withTiming(0, { duration: 400 });
                glowScale.value   = withTiming(0, { duration: 400 });

                const cancelShake = raf(360, (t) => {
                  const wave  = Math.sin(t * Math.PI * 4) * (1 - t);
                  const sc    = 1 + Math.sin(t * Math.PI) * 0.06;
                  bodyRotate.value = wave * 5;
                  bodyScale.value  = sc;
                }, () => {
                  bodyRotate.value = 0;
                  bodyScale.value  = 1;
                  animatingRef.current = false;
                  onComplete?.();
                });
                cancelFlightRef.current = cancelShake;
              });
              cancelFlightRef.current = cancelLidClose;
            });
            cancelFlightRef.current = cancelDrop;
          });
          cancelFlightRef.current = cancelLidOpen;
        });
        cancelFlightRef.current = cancelPhase1;
      },
    }));

    // ─────────────────────────────────────────────────────────
    // Render
    // ─────────────────────────────────────────────────────────
    return (
      <View style={styles.root}>
        {/* ── Ambient rising particles ── */}
        {ambientParticles.map(p => (
          <RNAnimated.View
            key={p.id}
            pointerEvents="none"
            style={[
              styles.ambientDot,
              {
                width:  p.size,
                height: p.size,
                borderRadius: p.size / 2,
                backgroundColor: p.color,
                left:   (p.left / 100) * JAR_W,
                bottom: (p.bottom / 100) * JAR_H,
                opacity:   p.opacity,
                transform: [
                  { translateY: p.translateY },
                  { scale:      p.scale },
                ],
                shadowColor: p.color,
                shadowRadius: p.size,
                shadowOpacity: 0.7,
              },
            ]}
          />
        ))}

        {/* ── Trail dots ── */}
        {trailDots.map(d => (
          <RNAnimated.View
            key={d.id}
            pointerEvents="none"
            style={[
              styles.trailDot,
              {
                left:            d.left,
                top:             d.top,
                backgroundColor: d.color,
                opacity:         d.opacity,
                transform:       [{ scale: d.scale }],
                shadowColor:     d.color,
                shadowRadius:    4,
                shadowOpacity:   0.9,
              },
            ]}
          />
        ))}

        {/* ── Jar assembly ── */}
        <Animated.View style={[styles.jarWrapper]} pointerEvents="none">
          {/* Glow ring */}
          <Animated.View style={[styles.glowRing, glowStyle]} pointerEvents="none" />

          {/* Lid */}
          <Animated.View style={[styles.lidContainer, lidStyle]}>
            <JarLidSvg />
          </Animated.View>

          {/* Body */}
          <Animated.View style={[styles.bodyContainer, bodyStyle]}>
            <JarBodySvg fillCount={displayCount} />
          </Animated.View>

          {/* Count badge */}
          {displayCount > 0 && (
            <Animated.Text style={[styles.countBadge, badgeStyle]}>
              {displayCount}
            </Animated.Text>
          )}

          {/* Burst sparkles (centered on jar mouth area) */}
          <View style={styles.burstContainer} pointerEvents="none">
            {burstParticles.map(p => (
              <RNAnimated.View
                key={p.id}
                pointerEvents="none"
                style={[
                  styles.spark,
                  {
                    width:           p.size,
                    height:          p.size,
                    borderRadius:    p.size / 2,
                    backgroundColor: p.color,
                    shadowColor:     p.color,
                    shadowRadius:    p.size * 2,
                    shadowOpacity:   1,
                    opacity:         p.opacity,
                    transform: [
                      { translateX: p.x },
                      { translateY: p.y },
                      { scale:      p.scale },
                    ],
                  },
                ]}
              />
            ))}
          </View>

          {/* Floating hearts */}
          <View style={styles.heartsContainer} pointerEvents="none">
            {floatHearts.map(h => (
              <RNAnimated.Text
                key={h.id}
                pointerEvents="none"
                style={[
                  styles.floatHeart,
                  {
                    color:    h.color,
                    fontSize: h.size,
                    opacity:  h.opacity,
                    transform: [
                      { translateX: h.x },
                      { translateY: h.y },
                      { scale:      h.scale },
                    ],
                    textShadowColor:  h.color,
                    textShadowRadius: 8,
                    textShadowOffset: { width: 0, height: 0 },
                  },
                ]}
              >
                ♥
              </RNAnimated.Text>
            ))}
          </View>

          {/* Flying paper slip */}
          {paperState.visible && (
            <View
              pointerEvents="none"
              style={[
                styles.flyingPaper,
                {
                  left:    paperState.x,
                  top:     paperState.y,
                  opacity: paperState.opacity,
                  transform: [
                    { rotate: `${paperState.rot}deg` },
                    { scale:  paperState.scale },
                  ],
                },
              ]}
            >
              <PaperSlipSvg />
            </View>
          )}
        </Animated.View>
      </View>
    );
  },
);

JarEnvelopeAnimation.displayName = 'JarEnvelopeAnimation';

// ── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    position: 'relative',
    width:  JAR_W,
    height: JAR_H + LID_H + responsiveHeight(4),
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'visible',
  },

  jarWrapper: {
    width:  JAR_W,
    height: JAR_H + LID_H,
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'visible',
    zIndex: 10,
  },

  glowRing: {
    position: 'absolute',
    top:  JAR_H * 0.05,
    left: -JAR_W * 0.15,
    width:  JAR_W * 1.3,
    height: JAR_W * 1.1,
    borderRadius: JAR_W * 0.65,
    backgroundColor: C.glow,
    zIndex: 0,
  },

  lidContainer: {
    position: 'absolute',
    top:  0,
    left: 0,
    width:  JAR_W,
    height: LID_H,
    zIndex: 5,
  },

  bodyContainer: {
    position: 'absolute',
    top:  LID_H,
    left: 0,
    width:  JAR_W,
    height: JAR_H - LID_H,
    zIndex: 3,
  },

  countBadge: {
    position:        'absolute',
    bottom:          0,
    right:           -10,
    backgroundColor: C.badge,
    color:           '#FFFFFF',
    fontSize:        12,
    fontWeight:      '800',
    borderRadius:    12,
    minWidth:        24,
    height:          24,
    textAlign:       'center',
    lineHeight:      24,
    paddingHorizontal: 3,
    overflow:        'hidden',
    zIndex:          20,
    shadowColor:     C.badgeShadow,
    shadowOffset:    { width: 0, height: 1 },
    shadowOpacity:   0.45,
    shadowRadius:    2,
    elevation:       3,
  },

  burstContainer: {
    position: 'absolute',
    top:  LID_H + responsiveWidth(2),
    left: JAR_W / 2,
    width:  0,
    height: 0,
    zIndex: 30,
    overflow: 'visible',
  },

  spark: {
    position:  'absolute',
    elevation: 4,
  },

  heartsContainer: {
    position: 'absolute',
    top:  JAR_H * 0.35,
    left: JAR_W / 2,
    width:  0,
    height: 0,
    zIndex: 25,
    overflow: 'visible',
  },

  floatHeart: {
    position: 'absolute',
  },

  flyingPaper: {
    position: 'absolute',
    width:  ENV_W,
    height: ENV_H,
    zIndex: 40,
  },

  ambientDot: {
    position: 'absolute',
    elevation: 2,
  },

  trailDot: {
    position:     'absolute',
    width:        5,
    height:       5,
    borderRadius: 2.5,
    elevation:    3,
    zIndex:       35,
  },
});