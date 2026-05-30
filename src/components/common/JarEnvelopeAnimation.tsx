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
import { useAppColors } from '../../theme';
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

// ── Palette (Dynamic theme-based magical colors) ─────────────
// function getJarColors(colors: ReturnType<typeof useAppColors>) {
//   const isDark = colors.isDark;

//   // Magical Celestial Purple & Luxury Gold Theme
//   return {
//     // Glass
//     glassStroke:  isDark ? 'rgba(168, 85, 247, 0.85)' : 'rgba(139, 92, 246, 0.75)', // Neon violet/purple stroke
//     glassShine:   '#FFFFFF',
//     glassShadow:  isDark ? 'rgba(124, 58, 237, 0.35)' : 'rgba(124, 58, 237, 0.25)', // Deep violet glass shadow
//     glassInsideBgStart: isDark ? 'rgba(139, 92, 246, 0.12)' : 'rgba(255, 255, 255, 0.88)',
//     glassInsideBgEnd: isDark ? 'rgba(124, 58, 237, 0.04)' : 'rgba(245, 243, 255, 0.7)',
    
//     // Lid (Luxury Metallic Gold Crown)
//     lidTop:       '#FEF3C7', // Soft warm gold
//     lidBot:       '#F59E0B', // Rich amber gold
//     lidRim:       '#D97706', // Burnished bronze gold
//     lidKnob:      '#FEF3C7',
//     lidAccent:    '#FBBF24', // Shimmering gold
    
//     // Paper (Golden-edged warm parchment)
//     paperBase:    '#FEFCE8',
//     paperShadow:  '#FEF9C3',
//     paperLine:    '#FDE047',
    
//     // Hearts (Glowing Golden Hearts)
//     heartPrimary: '#F59E0B', // Vibrant gold
//     heartDeep:    '#D97706', // Rich bronze gold
    
//     // Particles / Sparkles (Celestial Amber & Diamond White)
//     sparkPrimary: '#FBBF24', // Shimmering gold
//     sparkSecondary:'#F59E0B', // Warm gold
//     sparkAccent:  '#FEF3C7', // White gold
//     sparkWhite:   '#FFFFFF', // Diamond shine
//     sparkGlow:    '#FCD34D', // Golden glow aura
    
//     // Glow (Magic Golden Aura)
//     glow:         isDark ? 'rgba(245, 158, 11, 0.32)' : 'rgba(245, 158, 11, 0.25)',
//     badge:        '#F59E0B', // Rich gold badge
//     badgeShadow:  'rgba(245, 158, 11, 0.45)',
//   };
// }

function getJarColors(colors: ReturnType<typeof useAppColors>) {
  const isDark = colors.isDark;

  return {
    // Glass
    glassStroke: isDark
      ? 'rgba(196, 181, 253, 0.9)'
      : 'rgba(139, 92, 246, 0.7)',

    glassShine: 'rgba(255,255,255,0.95)',

    glassShadow: isDark
      ? 'rgba(91, 33, 182, 0.45)'
      : 'rgba(124, 58, 237, 0.18)',

    glassInsideBgStart: isDark
      ? 'rgba(139, 92, 246, 0.18)'
      : 'rgba(255,255,255,0.9)',

    glassInsideBgEnd: isDark
      ? 'rgba(76, 29, 149, 0.08)'
      : 'rgba(243,232,255,0.6)',

    // Lid
    lidTop: '#E9D5FF',
    lidBot: '#8B5CF6',
    lidRim: '#6D28D9',
    lidKnob: '#F5F3FF',
    lidAccent: '#C084FC',

    // Paper
    paperBase: '#FFF7FF',
    paperShadow: '#F3E8FF',
    paperLine: '#D8B4FE',

    // Hearts
    heartPrimary: '#FB7185',
    heartDeep: '#EC4899',

    // Sparkles
    sparkPrimary: '#C084FC',
    sparkSecondary: '#A78BFA',
    sparkAccent: '#F0ABFC',
    sparkWhite: '#FFFFFF',
    sparkGlow: '#E9D5FF',

    // Glow
    glow: isDark
      ? 'rgba(168,85,247,0.35)'
      : 'rgba(168,85,247,0.22)',

    badge: '#A855F7',
    badgeShadow: 'rgba(168,85,247,0.5)',
  };
}

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
  { dx: -36, dy: -28, colorKey: 'sparkPrimary',   size: 8 },
  { dx:  36, dy: -30, colorKey: 'sparkSecondary', size: 7 },
  { dx: -42, dy:   8, colorKey: 'sparkWhite',     size: 6 },
  { dx:  40, dy:  10, colorKey: 'sparkGlow',      size: 8 },
  { dx: -18, dy: -44, colorKey: 'sparkAccent',    size: 6 },
  { dx:  20, dy: -40, colorKey: 'sparkSecondary', size: 7 },
  { dx:   4, dy: -50, colorKey: 'sparkPrimary',   size: 6 },
  { dx:  46, dy: -18, colorKey: 'sparkWhite',     size: 5 },
  { dx: -46, dy: -15, colorKey: 'sparkAccent',    size: 5 },
  { dx:   0, dy: -56, colorKey: 'sparkSecondary', size: 7 },
] as const;

// ── Float hearts config ───────────────────────────────────────
const FLOAT_DEFS = [
  { dx: -70, dy:  -60, size: 13, colorKey: 'heartPrimary',   delay:   0 },
  { dx:  72, dy:  -80, size: 11, colorKey: 'sparkSecondary', delay:  80 },
  { dx: -40, dy: -100, size:  9, colorKey: 'sparkWhite',     delay: 150 },
  { dx:  45, dy:  -90, size: 11, colorKey: 'sparkGlow',      delay:  50 },
  { dx:  -5, dy: -115, size:  9, colorKey: 'heartPrimary',  delay: 120 },
  { dx:  60, dy:  -45, size: 13, colorKey: 'sparkGlow',      delay: 200 },
] as const;

// ── Easing helpers (matching HTML exactly) ───────────────────
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
  const colors = useAppColors();
  const c = getJarColors(colors);

  return (
    <Svg width={JAR_W} height={JAR_H - LID_H} viewBox="0 0 100 98">
      <Defs>
        <SvgLinearGradient id="jbGlassH" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0"    stopColor={c.glassInsideBgStart} stopOpacity={colors.isDark ? 0.45 : 0.97} />
          <Stop offset="0.30" stopColor={c.glassInsideBgEnd} stopOpacity={colors.isDark ? 0.15 : 0.88} />
          <Stop offset="0.65" stopColor={c.glassInsideBgStart} stopOpacity={colors.isDark ? 0.25 : 0.92} />
          <Stop offset="1"    stopColor={c.glassInsideBgEnd} stopOpacity={colors.isDark ? 0.45 : 0.97} />
        </SvgLinearGradient>
        <SvgRadialGradient id="jbGlow" cx="35%" cy="25%" r="58%">
          <Stop offset="0"   stopColor="#FFFFFF" stopOpacity="0.55" />
          <Stop offset="1"   stopColor={c.glassStroke} stopOpacity="0"   />
        </SvgRadialGradient>
        <SvgLinearGradient id="jbPaperG" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={c.paperBase}  />
          <Stop offset="1" stopColor={c.paperShadow}  />
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
        fill="url(#jbGlassH)" stroke={c.glassStroke} strokeWidth="0.8" />
      <Rect x="12" y="7" width="76" height="4" rx="2"
        fill={c.glassShadow} opacity={0.3} />

      {/* Body */}
      <Path
        d="M12 10 Q5 13 4 22 L2 90 Q1 98 10 98 L90 98 Q99 98 98 90 L96 22 Q95 13 88 10 Z"
        fill="url(#jbGlassH)" stroke={c.glassStroke} strokeWidth="1.5"
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
                fill={c.paperShadow} opacity={0.45} />
              <Rect x={p.x} y={p.y} width={p.w} height={p.h} rx="3"
                fill="url(#jbPaperG)" stroke={c.paperLine} strokeWidth="0.7" />
              <Line x1={p.x + 5} y1={p.y + p.h * 0.38} x2={p.x + p.w - 5} y2={p.y + p.h * 0.38}
                stroke={c.paperLine} strokeWidth="0.8" />
              <Line x1={p.x + 5} y1={p.y + p.h * 0.62} x2={p.x + p.w - 5} y2={p.y + p.h * 0.62}
                stroke={c.paperLine} strokeWidth="0.8" />
              <G transform={`translate(${cx}, ${cy - 1})`}>
                <Path d={heartD(p.big ? 5.5 : 3.8)}
                  fill={p.big ? c.heartPrimary : c.heartDeep}
                  opacity={p.big ? 0.95 : 0.75} />
              </G>
            </G>
          </G>
        );
      })}

      {/* Glass shine stripes */}
      <Path d="M13 18 Q10 50 12 88" stroke={c.glassShine} strokeWidth="5.5"
        strokeLinecap="round" opacity={0.52} clipPath="url(#jbFull)" />
      <Path d="M21 16 Q18 46 20 80" stroke={c.glassShine} strokeWidth="2"
        strokeLinecap="round" opacity={0.28} clipPath="url(#jbFull)" />
      <Path d="M89 18 Q92 50 90 88" stroke={c.glassShadow} strokeWidth="5"
        strokeLinecap="round" opacity={0.22} clipPath="url(#jbFull)" />
      <Ellipse cx="50" cy="93" rx="28" ry="3.5"
        fill={c.glassShadow} opacity={0.18} clipPath="url(#jbFull)" />

      {/* Re-stroke edge */}
      <Path
        d="M12 10 Q5 13 4 22 L2 90 Q1 98 10 98 L90 98 Q99 98 98 90 L96 22 Q95 13 88 10 Z"
        fill="none" stroke={c.glassStroke} strokeWidth="1.5"
      />
    </Svg>
  );
};

// ─────────────────────────────────────────────────────────────
// JarLidSvg
// ─────────────────────────────────────────────────────────────
const JarLidSvg: React.FC = () => {
  const colors = useAppColors();
  const c = getJarColors(colors);

  return (
    <Svg width={JAR_W} height={LID_H} viewBox="0 0 100 26">
      <Defs>
        <SvgLinearGradient id="jlGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0"   stopColor={c.lidTop} />
          <Stop offset="0.5" stopColor={c.lidBot} />
          <Stop offset="1"   stopColor={c.lidRim} />
        </SvgLinearGradient>
        <SvgLinearGradient id="jlKnob" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={c.lidKnob} />
          <Stop offset="1" stopColor={c.lidTop} />
        </SvgLinearGradient>
        <SvgRadialGradient id="jlKnobShine" cx="40%" cy="35%" r="55%">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.7" />
          <Stop offset="1" stopColor={c.lidBot} stopOpacity="0"   />
        </SvgRadialGradient>
      </Defs>
      {/* Lid body */}
      <Rect x="12" y="14" width="76" height="11" rx="5.5"
        fill="url(#jlGrad)" stroke={c.lidRim} strokeWidth="0.8" />
      {/* Rim shadow */}
      <Rect x="10" y="23" width="80" height="2.5" rx="1.2"
        fill={c.glassShadow} opacity={0.35} />
      {/* Shine streak */}
      <Rect x="18" y="16" width="22" height="5" rx="2.5"
        fill={c.glassShine} opacity={0.42} />
      {/* Accent rim line */}
      <Rect x="12" y="19" width="76" height="2" rx="1"
        fill={c.lidAccent} opacity={0.3} />
      {/* Knob */}
      <Ellipse cx="50" cy="8" rx="16" ry="8"
        fill="url(#jlKnob)" stroke={c.lidRim} strokeWidth="0.8" />
      <Ellipse cx="50" cy="6.5" rx="11" ry="5.5"
        fill="url(#jlKnobShine)" />
      <Ellipse cx="44" cy="5.5" rx="3.5" ry="2.5"
        fill={c.glassShine} opacity={0.55} />
    </Svg>
  );
};

// ─────────────────────────────────────────────────────────────
// PaperSlipSvg (flying)
// ─────────────────────────────────────────────────────────────
const PaperSlipSvg: React.FC = () => {
  const colors = useAppColors();
  const c = getJarColors(colors);

  return (
    <Svg width={ENV_W} height={ENV_H} viewBox="0 0 48 38">
      <Defs>
        <SvgLinearGradient id="fpGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={c.paperBase}  />
          <Stop offset="1" stopColor={c.paperShadow}  />
        </SvgLinearGradient>
      </Defs>
      <Rect x="2.5" y="2.5" width="44" height="34" rx="3.5"
        fill={c.paperShadow} opacity={0.5} />
      <Rect x="1" y="1" width="44" height="34" rx="3.5"
        fill="url(#fpGrad)" stroke={c.paperLine} strokeWidth="1" />
      <Line x1="6" y1="13" x2="42" y2="13" stroke={c.paperLine} strokeWidth="1.1" />
      <Line x1="6" y1="21" x2="42" y2="21" stroke={c.paperLine} strokeWidth="1.1" />
      <Line x1="6" y1="29" x2="42" y2="29" stroke={c.paperLine} strokeWidth="1.1" />
      <G transform="translate(24, 10)">
        <Path d={heartD(6.5)} fill={c.heartPrimary} opacity={0.92} />
      </G>
      <Path d="M38 1 L45 8 L38 8 Z" fill={c.paperShadow} opacity={0.55} />
      <Rect x="4" y="3" width="13" height="3" rx="1.5" fill="#FFF" opacity={0.5} />
    </Svg>
  );
};

// ── Radial Gradient Glow Ring Svg ────────────────────────────
const GlowRingSvg: React.FC = () => {
  const colors = useAppColors();
  const c = getJarColors(colors);
  return (
    <Svg width="100%" height="100%" viewBox="0 0 100 100" style={StyleSheet.absoluteFill}>
      <Defs>
        <SvgRadialGradient id="ringGlow" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={c.sparkGlow} stopOpacity={0.7} />
          <Stop offset="0.5" stopColor={c.glow} stopOpacity={0.3} />
          <Stop offset="1" stopColor={c.glow} stopOpacity={0} />
        </SvgRadialGradient>
      </Defs>
      <Ellipse cx="50" cy="50" rx="50" ry="40" fill="url(#ringGlow)" />
    </Svg>
  );
};

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
  size: number;
}

interface AmbientParticle {
  id: number;
  left: number;
  bottom: number;
  size: number;
  color: string;
  opacity: RNAnimated.Value;
  translateY: RNAnimated.Value;
  translateX: RNAnimated.Value;
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

    const colors = useAppColors();
    const c = getJarColors(colors);

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

    const shadowStyle = useAnimatedStyle(() => ({
      transform: [
        { scaleX: bodyScale.value },
        { scaleY: bodyScale.value },
      ],
      opacity: 0.18 + (bodyScale.value - 1) * 2.5,
    }));

    // Cleanup animations on unmount
    useEffect(() => {
      return () => {
        cancelFlightRef.current?.();
      };
    }, []);

    // ── Ambient particle colors setup ─────────────────────────
    const ambientColors = [
      c.sparkPrimary,
      c.sparkSecondary,
      c.sparkAccent,
      c.sparkGlow,
      c.sparkWhite,
    ];
    const ambientColorsRef = useRef(ambientColors);
    useEffect(() => {
      ambientColorsRef.current = ambientColors;
    }, [ambientColors]);

    // ── Ambient particle spawner ──────────────────────────────
    useEffect(() => {
      const interval = setInterval(() => {
        const id = ambientIdRef.current++;
        const opacity    = new RNAnimated.Value(0);
        const translateY = new RNAnimated.Value(0);
        const translateX = new RNAnimated.Value(0);
        const scale      = new RNAnimated.Value(1);
        
        const swayDist = (Math.random() - 0.5) * responsiveWidth(5);
        const particleSize = 3 + Math.random() * 4;

        const particle: AmbientParticle = {
          id,
          left:   10 + Math.random() * 80,   // % of JAR_W
          bottom: 5 + Math.random() * 40,
          size:   particleSize,
          color:  ambientColorsRef.current[Math.floor(Math.random() * ambientColorsRef.current.length)],
          opacity,
          translateY,
          translateX,
          scale,
        };
        setAmbientParticles(prev => [...prev.slice(-12), particle]);

        // float up, sway and fade
        RNAnimated.parallel([
          RNAnimated.sequence([
            RNAnimated.timing(opacity, { toValue: 0.6, duration: 400, useNativeDriver: true }),
            RNAnimated.timing(opacity, { toValue: 0,   duration: 2600, useNativeDriver: true }),
          ]),
          RNAnimated.timing(translateY, { toValue: -responsiveHeight(12), duration: 3500, easing: RNEasing.linear, useNativeDriver: true }),
          RNAnimated.timing(translateX, { toValue: swayDist, duration: 3500, easing: RNEasing.inOut(RNEasing.ease), useNativeDriver: true }),
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
      const opacity = new RNAnimated.Value(0.85);
      const scale   = new RNAnimated.Value(1);
      const trailColors  = [c.sparkPrimary, c.sparkSecondary, c.sparkGlow];
      const trailSize = 3 + Math.random() * 4;
      
      const dot: TrailDot = {
        id, left: x, top: y,
        opacity, scale,
        color: trailColors[Math.floor(Math.random() * trailColors.length)],
        size: trailSize,
      };
      setTrailDots(prev => [...prev.slice(-20), dot]);
      RNAnimated.parallel([
        RNAnimated.timing(opacity, { toValue: 0, duration: 550, useNativeDriver: true }),
        RNAnimated.timing(scale,   { toValue: 0.25, duration: 550, useNativeDriver: true }),
      ]).start(() => {
        setTrailDots(prev => prev.filter(d => d.id !== id));
      });
    }, [c.sparkPrimary, c.sparkSecondary, c.sparkGlow]);

    // ── Trigger burst sparkles ────────────────────────────────
    const triggerBurst = useCallback(() => {
      const particles: BurstParticle[] = BURST_DEFS.map((b, i) => ({
        id: i,
        x:       new RNAnimated.Value(0),
        y:       new RNAnimated.Value(0),
        opacity: new RNAnimated.Value(0),
        scale:   new RNAnimated.Value(1),
        color:   (c as any)[b.colorKey],
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
    }, [c]);

    // ── Trigger floating hearts ───────────────────────────────
    const triggerFloatHearts = useCallback(() => {
      const hearts: FloatHeart[] = FLOAT_DEFS.map((h, i) => ({
        id: i,
        x:       new RNAnimated.Value(0),
        y:       new RNAnimated.Value(0),
        opacity: new RNAnimated.Value(0),
        scale:   new RNAnimated.Value(1),
        color:   (c as any)[h.colorKey],
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
    }, [c]);

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
        {/* ── Ground shadow under the jar ── */}
        <Animated.View
          style={[
            styles.groundShadow,
            {
              backgroundColor: colors.isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(124, 58, 237, 0.15)',
            },
            shadowStyle,
          ]}
          pointerEvents="none"
        />

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
                  { translateX: p.translateX },
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
                width:           d.size,
                height:          d.size,
                borderRadius:    d.size / 2,
                backgroundColor: d.color,
                opacity:         d.opacity,
                transform:       [{ scale: d.scale }],
                shadowColor:     d.color,
                shadowRadius:    d.size,
                shadowOpacity:   0.9,
              },
            ]}
          />
        ))}

        {/* ── Jar assembly ── */}
        <Animated.View style={[styles.jarWrapper]} pointerEvents="none">
          {/* Glow ring (radial gradient) */}
          <Animated.View style={[styles.glowRing, glowStyle]} pointerEvents="none">
            <GlowRingSvg />
          </Animated.View>

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
            <Animated.Text
              style={[
                styles.countBadge,
                {
                  backgroundColor: c.badge,
                  shadowColor: c.badgeShadow,
                },
                badgeStyle,
              ]}
            >
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
    color:           '#FFFFFF',
    fontSize:        12,
    fontWeight:      '700',
    fontFamily:      'DMSans-Bold',
    borderRadius:    12,
    minWidth:        24,
    height:          24,
    textAlign:       'center',
    lineHeight:      24,
    paddingHorizontal: 4,
    overflow:        'hidden',
    zIndex:          20,
    shadowOffset:    { width: 0, height: 2 },
    shadowOpacity:   0.45,
    shadowRadius:    3,
    elevation:       4,
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
    shadowColor: 'rgba(0, 0, 0, 0.22)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 7,
  },

  ambientDot: {
    position: 'absolute',
    elevation: 2,
  },

  trailDot: {
    position:     'absolute',
    elevation:    3,
    zIndex:       35,
  },

  groundShadow: {
    position: 'absolute',
    bottom: responsiveHeight(1.5),
    width: JAR_W * 0.75,
    height: 8,
    borderRadius: 4,
    zIndex: 1,
  },
});