import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import { View, StyleSheet, Animated as RNAnimated, Easing as RNEasing, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
  withSpring,
  withSequence,
  withRepeat,
  withDelay,
  cancelAnimation,
  Easing,
  SharedValue,
} from 'react-native-reanimated';
import Svg, { Rect, Path, Defs, LinearGradient as SvgLinearGradient, RadialGradient as SvgRadialGradient, Stop, ClipPath, G, Line, Ellipse } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppColors } from '../../theme';
import { useJournalStore } from '../../store/useJournalStore';
import { responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import { haptics } from '../../utils/haptics';

const AnimatedG = Animated.createAnimatedComponent(G);

// ── Color Config (adapted for Day 4 theme colors) ────────────────
export interface JarColorConfig {
  primary?: string;
  secondary?: string;
  glow?: string;
  lid?: string;
  glass?: string;
  
  // Custom specific overrides
  glassStroke?: string;
  glassShine?: string;
  glassShadow?: string;
  glassInsideBgStart?: string;
  glassInsideBgEnd?: string;
  lidTop?: string;
  lidBot?: string;
  lidRim?: string;
  lidKnob?: string;
  lidAccent?: string;
  paperBase?: string;
  paperShadow?: string;
  paperLine?: string;
  heartPrimary?: string;
  heartDeep?: string;
  sparkPrimary?: string;
  sparkSecondary?: string;
  sparkAccent?: string;
  sparkWhite?: string;
  sparkGlow?: string;
  badge?: string;
  badgeShadow?: string;
}

function getJarColors(themeColors: ReturnType<typeof useAppColors>, customColors?: JarColorConfig) {
  const isDark = themeColors.isDark;
  
  // Default base color mappings if not customized
  const baseDayColor = customColors?.primary || themeColors.day4;
  const secondaryColor = customColors?.secondary || themeColors.accent || '#FBBF24';

  // Helper to convert hex color to rgba with opacity
  const hexToRgba = (hex: string, alpha: number) => {
    try {
      const cleanHex = hex.replace('#', '');
      const r = parseInt(cleanHex.substring(0, 2), 16);
      const g = parseInt(cleanHex.substring(2, 4), 16);
      const b = parseInt(cleanHex.substring(4, 6), 16);
      if (isNaN(r) || isNaN(g) || isNaN(b)) {
        return `rgba(139, 92, 246, ${alpha})`;
      }
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    } catch {
      return `rgba(139, 92, 246, ${alpha})`;
    }
  };

  // Dynamically generated overrides based on primaryColor
  const defaultGlassStroke = customColors?.primary 
    ? hexToRgba(customColors.primary, 0.9)
    : (isDark ? 'rgba(192, 132, 252, 0.9)' : 'rgba(139, 92, 246, 0.8)');

  const defaultGlassShadow = customColors?.primary 
    ? hexToRgba(customColors.primary, isDark ? 0.4 : 0.15)
    : (isDark ? 'rgba(124, 58, 237, 0.4)' : 'rgba(124, 58, 237, 0.15)');

  const defaultGlassInsideBgStart = customColors?.primary 
    ? hexToRgba(customColors.primary, isDark ? 0.08 : 0.25)
    : (isDark ? 'rgba(139, 92, 246, 0.08)' : 'rgba(243, 232, 255, 0.25)');

  const defaultGlow = customColors?.primary 
    ? hexToRgba(customColors.primary, isDark ? 0.45 : 0.3)
    : (isDark ? 'rgba(168, 85, 247, 0.45)' : 'rgba(139, 92, 246, 0.3)');

  const defaultBadge = '#F59E0B';

  // Ultra-premium Magical Celestial Purple & Luxury Gold Theme
  const defaultColors = {
    // Glass
    glassStroke: defaultGlassStroke,
    glassShine: '#FFFFFF',
    glassShadow: defaultGlassShadow,
    glassInsideBgStart: defaultGlassInsideBgStart,
    glassInsideBgEnd: isDark ? 'rgba(15, 23, 42, 0.15)' : 'rgba(255, 255, 255, 0.45)',
    
    // Lid (Luxury Metallic Gold Crown)
    lidTop: '#FEF3C7',
    lidBot: '#F59E0B',
    lidRim: '#D97706',
    lidKnob: '#FEF3C7',
    lidAccent: '#FBBF24',

    // Paper (Golden-edged warm parchment)
    paperBase: '#FEFCE8',
    paperShadow: '#FEF9C3',
    paperLine: '#FDE047',

    // Hearts (Vibrant Crimson Red)
    heartPrimary: '#E11D48',
    heartDeep: '#BE123C',

    // Particles / Sparkles (Celestial Amber & Diamond White)
    sparkPrimary: '#FBBF24',
    sparkSecondary: '#F59E0B',
    sparkAccent: '#A78BFA',
    sparkWhite: '#FFFFFF',
    sparkGlow: '#FCD34D',

    // Glow (Magic Purple Aura)
    glow: defaultGlow,
    badge: defaultBadge,
    badgeShadow: 'rgba(217, 119, 6, 0.45)',
  };

  return {
    glassStroke: customColors?.glassStroke || customColors?.glass || defaultColors.glassStroke,
    glassShine: customColors?.glassShine || defaultColors.glassShine,
    glassShadow: customColors?.glassShadow || defaultColors.glassShadow,
    glassInsideBgStart: customColors?.glassInsideBgStart || defaultColors.glassInsideBgStart,
    glassInsideBgEnd: customColors?.glassInsideBgEnd || defaultColors.glassInsideBgEnd,
    
    lidTop: customColors?.lidTop || customColors?.lid || defaultColors.lidTop,
    lidBot: customColors?.lidBot || defaultColors.lidBot,
    lidRim: customColors?.lidRim || customColors?.lid || defaultColors.lidRim,
    lidKnob: customColors?.lidKnob || defaultColors.lidKnob,
    lidAccent: customColors?.lidAccent || defaultColors.lidAccent,
    
    paperBase: customColors?.paperBase || defaultColors.paperBase,
    paperShadow: customColors?.paperShadow || defaultColors.paperShadow,
    paperLine: customColors?.paperLine || defaultColors.paperLine,
    
    heartPrimary: customColors?.heartPrimary || defaultColors.heartPrimary,
    heartDeep: customColors?.heartDeep || defaultColors.heartDeep,
    
    sparkPrimary: customColors?.sparkPrimary || defaultColors.sparkPrimary,
    sparkSecondary: customColors?.sparkSecondary || defaultColors.sparkSecondary,
    sparkAccent: customColors?.sparkAccent || defaultColors.sparkAccent,
    sparkWhite: customColors?.sparkWhite || defaultColors.sparkWhite,
    sparkGlow: customColors?.sparkGlow || defaultColors.sparkGlow,
    
    glow: customColors?.glow || defaultColors.glow,
    badge: customColors?.badge || defaultColors.badge,
    badgeShadow: customColors?.badgeShadow || defaultColors.badgeShadow,
  };
}

// ── Heart path ────────────────────────────────────────────────
const heartD = (s: number) =>
  `M0,${-s * 0.15} C${-s * 0.5},${-s * 0.65} ${-s},${-s * 0.1} ${-s},${s * 0.3} C${-s},${s * 0.8} 0,${s * 1.05} 0,${s * 1.05} C0,${s * 1.05} ${s},${s * 0.8} ${s},${s * 0.3} C${s},${-s * 0.1} ${s * 0.5},${-s * 0.65} 0,${-s * 0.15} Z`;

// ── 4-point star path ─────────────────────────────────────────
const starPath = (cx: number, cy: number, r: number) => {
  const inner = r * 0.22;
  return `M ${cx} ${cy - r} 
          Q ${cx} ${cy - inner} ${cx + r} ${cy} 
          Q ${cx + inner} ${cy} ${cx} ${cy + r} 
          Q ${cx} ${cy + inner} ${cx - r} ${cy} 
          Q ${cx - inner} ${cy} ${cx} ${cy - r} Z`;
};

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

// ── Easing helpers ───────────────────────────────────────────
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInCubic  = (t: number) => Math.pow(t, 3);
const easeInOut    = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const bounceOut = (t: number) => {
  const n1 = 7.5625, d1 = 2.75;
  if (t < 1 / d1)       return n1 * t * t;
  if (t < 2 / d1)       return n1 * (t -= 1.5 / d1) * t + 0.75;
  if (t < 2.5 / d1)     return n1 * (t -= 2.25 / d1) * t + 0.9375;
  return                        n1 * (t -= 2.625 / d1) * t + 0.984375;
};

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

// ── SVG Subcomponents ────────────────────────────────────────
const JarBodySvg: React.FC<{
  fillCount: number;
  width: number;
  height: number;
  colors: any;
  c: any;
  shimmerTransX: SharedValue<number>;
  orbX: SharedValue<number>;
  orbY: SharedValue<number>;
  orbScale: SharedValue<number>;
  star1X: SharedValue<number>;
  star1Y: SharedValue<number>;
  star1Scale: SharedValue<number>;
  star1Opacity: SharedValue<number>;
  star2X: SharedValue<number>;
  star2Y: SharedValue<number>;
  star2Scale: SharedValue<number>;
  star2Opacity: SharedValue<number>;
}> = ({
  fillCount,
  width,
  height,
  colors,
  c,
  shimmerTransX,
  orbX,
  orbY,
  orbScale,
  star1X,
  star1Y,
  star1Scale,
  star1Opacity,
  star2X,
  star2Y,
  star2Scale,
  star2Opacity,
}) => {
  const visible = Math.min(fillCount, PAPERS.length);
  const isDark = colors.isDark;

  const shimmerProps = useAnimatedProps(() => ({
    transform: [{ translateX: shimmerTransX.value }] as any,
  }));

  const orbProps = useAnimatedProps(() => ({
    transform: [
      { translateX: orbX.value },
      { translateY: orbY.value },
      { scale: orbScale.value },
    ] as any,
  }));

  const star1Props = useAnimatedProps(() => ({
    transform: [
      { translateX: star1X.value },
      { translateY: star1Y.value },
      { scale: star1Scale.value },
    ] as any,
    opacity: star1Opacity.value,
  }));

  const star2Props = useAnimatedProps(() => ({
    transform: [
      { translateX: star2X.value },
      { translateY: star2Y.value },
      { scale: star2Scale.value },
    ] as any,
    opacity: star2Opacity.value,
  }));

  return (
    <Svg width={width} height={height} viewBox="0 0 100 98">
      <Defs>
        <SvgLinearGradient id="cGlassH" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0"    stopColor={c.glassInsideBgStart} stopOpacity={colors.isDark ? 0.25 : 0.4} />
          <Stop offset="0.30" stopColor={c.glassInsideBgEnd} stopOpacity={colors.isDark ? 0.08 : 0.2} />
          <Stop offset="0.65" stopColor={c.glassInsideBgStart} stopOpacity={colors.isDark ? 0.15 : 0.3} />
          <Stop offset="1"    stopColor={c.glassInsideBgEnd} stopOpacity={colors.isDark ? 0.25 : 0.4} />
        </SvgLinearGradient>
        <SvgRadialGradient id="cGlow" cx="35%" cy="25%" r="58%">
          <Stop offset="0"   stopColor="#FFFFFF" stopOpacity="0.45" />
          <Stop offset="1"   stopColor={c.glassStroke} stopOpacity="0"   />
        </SvgRadialGradient>
        <SvgRadialGradient id="cInnerGlow" cx="50%" cy="60%" r="50%">
          <Stop offset="0" stopColor={c.sparkGlow} stopOpacity={0.35} />
          <Stop offset="1" stopColor={c.glassStroke} stopOpacity="0" />
        </SvgRadialGradient>
        
        <SvgLinearGradient id="cPaper0" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFE082" />
          <Stop offset="1" stopColor="#FFB300" />
        </SvgLinearGradient>
        <SvgLinearGradient id="cPaper1" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#F472B6" />
          <Stop offset="1" stopColor="#DB2777" />
        </SvgLinearGradient>
        <SvgLinearGradient id="cPaper2" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#34D399" />
          <Stop offset="1" stopColor="#059669" />
        </SvgLinearGradient>
        <SvgLinearGradient id="cPaper3" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#C084FC" />
          <Stop offset="1" stopColor="#7C3AED" />
        </SvgLinearGradient>
        <SvgLinearGradient id="cPaper4" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#60A5FA" />
          <Stop offset="1" stopColor="#2563EB" />
        </SvgLinearGradient>

        <SvgLinearGradient id="shimmerGrad" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
          <Stop offset="0.5" stopColor="#FFFFFF" stopOpacity={isDark ? 0.35 : 0.6} />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </SvgLinearGradient>

        <SvgRadialGradient id="orbGlow" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={c.sparkGlow} stopOpacity={0.85} />
          <Stop offset="0.4" stopColor={c.sparkSecondary} stopOpacity={0.5} />
          <Stop offset="1" stopColor={c.sparkSecondary} stopOpacity={0} />
        </SvgRadialGradient>

        <ClipPath id="cInside">
          <Path d="M12 10 Q5 13 4 22 L2 90 Q1 98 10 98 L90 98 Q99 98 98 90 L96 22 Q95 13 88 10 Z" />
        </ClipPath>
        <ClipPath id="cFull">
          <Path d="M8 6 Q2 10 2 18 L2 90 Q1 98 10 98 L90 98 Q99 98 98 90 L98 18 Q98 10 92 6 Z" />
        </ClipPath>
      </Defs>

      <Rect x="14" y="0" width="72" height="9" rx="4"
        fill="url(#cGlassH)" stroke={c.glassStroke} strokeWidth="0.8" />
      <Rect x="12" y="7" width="76" height="4" rx="2"
        fill={c.glassShadow} opacity={0.3} />

      <Path
        d="M12 10 Q5 13 4 22 L2 90 Q1 98 10 98 L90 98 Q99 98 98 90 L96 22 Q95 13 88 10 Z"
        fill="url(#cGlassH)" stroke={c.glassStroke} strokeWidth="1.5"
      />
      <Path
        d="M12 10 Q5 13 4 22 L2 90 Q1 98 10 98 L90 98 Q99 98 98 90 L96 22 Q95 13 88 10 Z"
        fill="url(#cInnerGlow)"
        clipPath="url(#cInside)"
      />
      <Path
        d="M12 10 Q5 13 4 22 L2 90 Q1 98 10 98 L90 98 Q99 98 98 90 L96 22 Q95 13 88 10 Z"
        fill="url(#cGlow)"
      />

      <AnimatedG animatedProps={shimmerProps} clipPath="url(#cInside)">
        <Path d="M -20 -10 L 5 -10 L -15 110 L -40 110 Z" fill="url(#shimmerGrad)" opacity={0.35} />
        <Path d="M 0 -10 L 20 -10 L 0 110 L -20 110 Z" fill="url(#shimmerGrad)" opacity={0.18} />
      </AnimatedG>

      <AnimatedG animatedProps={orbProps} clipPath="url(#cInside)">
        <Ellipse cx="50" cy="55" rx="16" ry="16" fill="url(#orbGlow)" />
        <Path d={starPath(50, 55, 8)} fill="#FFFFFF" opacity={0.9} />
      </AnimatedG>

      {/* Twinkling Magical Star 1 */}
      <AnimatedG animatedProps={star1Props} clipPath="url(#cInside)">
        <Path d={starPath(50, 55, 5.5)} fill={c.sparkAccent} />
      </AnimatedG>

      {/* Twinkling Magical Star 2 */}
      <AnimatedG animatedProps={star2Props} clipPath="url(#cInside)">
        <Path d={starPath(50, 55, 4.5)} fill={c.sparkPrimary} />
      </AnimatedG>

      <Path d="M20 14 Q50 10 80 14" stroke="#FFFFFF" strokeWidth="2"
        strokeLinecap="round" opacity={0.6} />

      {PAPERS.slice(0, visible).map((p, i) => {
        const cx = p.x + p.w / 2;
        const cy = p.y + p.h / 2;
        
        // Single golden envelope color and matching outline
        const strokeCol = 'rgba(217, 119, 6, 0.7)';

        return (
          <G key={i} clipPath="url(#cInside)">
            <G transform={`rotate(${p.rot}, ${cx}, ${cy})`}>
              <Rect x={p.x + 1.5} y={p.y + 1.5} width={p.w} height={p.h} rx="3"
                fill="#E5E7EB" opacity={0.35} />
              <Rect x={p.x} y={p.y} width={p.w} height={p.h} rx="3"
                fill="url(#cPaper0)" stroke={strokeCol} strokeWidth="0.8" />
              <Line x1={p.x + 5} y1={p.y + p.h * 0.38} x2={p.x + p.w - 5} y2={p.y + p.h * 0.38}
                stroke={strokeCol} strokeOpacity={0.4} strokeWidth="1" />
              <Line x1={p.x + 5} y1={p.y + p.h * 0.62} x2={p.x + p.w - 5} y2={p.y + p.h * 0.62}
                stroke={strokeCol} strokeOpacity={0.4} strokeWidth="1" />
              <G transform={`translate(${cx}, ${cy - 1})`}>
                <Path d={heartD(p.big ? 5.5 : 3.8)}
                  fill={p.big ? c.heartPrimary : c.heartDeep}
                  opacity={p.big ? 0.95 : 0.85} />
              </G>
            </G>
          </G>
        );
      })}

      <Path d="M13 18 Q10 50 12 88" stroke={c.glassShine} strokeWidth="5.5"
        strokeLinecap="round" opacity={0.52} clipPath="url(#cFull)" />
      <Path d="M21 16 Q18 46 20 80" stroke={c.glassShine} strokeWidth="2"
        strokeLinecap="round" opacity={0.28} clipPath="url(#cFull)" />
      <Path d="M89 18 Q92 50 90 88" stroke={c.glassShadow} strokeWidth="5"
        strokeLinecap="round" opacity={0.22} clipPath="url(#cFull)" />
      <Ellipse cx="50" cy="93" rx="28" ry="3.5"
        fill={c.glassShadow} opacity={0.18} clipPath="url(#cFull)" />

      <Path
        d="M12 10 Q5 13 4 22 L2 90 Q1 98 10 98 L90 98 Q99 98 98 90 L96 22 Q95 13 88 10 Z"
        fill="none" stroke={c.glassStroke} strokeWidth="1.5"
      />
    </Svg>
  );
};

const JarLidSvg: React.FC<{ width: number; height: number; colors: any; c: any }> = 
  ({ width, height, colors, c }) => {
    return (
      <Svg width={width} height={height} viewBox="0 0 100 26">
        <Defs>
          <SvgLinearGradient id="clGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0"   stopColor={c.lidBot} />
            <Stop offset="0.3" stopColor={c.lidTop} />
            <Stop offset="0.5" stopColor="#FFFFFF" stopOpacity={0.7} />
            <Stop offset="0.7" stopColor={c.lidTop} />
            <Stop offset="1"   stopColor={c.lidBot} />
          </SvgLinearGradient>
          <SvgLinearGradient id="clKnob" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={c.lidBot} />
            <Stop offset="0.4" stopColor={c.lidKnob} />
            <Stop offset="0.5" stopColor="#FFFFFF" stopOpacity={0.8} />
            <Stop offset="1" stopColor={c.lidBot} />
          </SvgLinearGradient>
          <SvgRadialGradient id="clKnobShine" cx="40%" cy="35%" r="55%">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.7} />
            <Stop offset="1" stopColor={c.lidBot} stopOpacity="0"   />
          </SvgRadialGradient>
        </Defs>
        <Rect x="12" y="14" width="76" height="11" rx="5.5"
          fill="url(#clGrad)" stroke={c.lidRim} strokeWidth="0.8" />
        <Rect x="10" y="23" width="80" height="2.5" rx="1.2"
          fill={c.glassShadow} opacity={0.35} />
        <Rect x="18" y="16" width="22" height="5" rx="2.5"
          fill={c.glassShine} opacity={0.42} />
        <Rect x="12" y="19" width="76" height="2" rx="1"
          fill={c.lidAccent} opacity={0.3} />
        <Ellipse cx="50" cy="8" rx="16" ry="8"
          fill="url(#clKnob)" stroke={c.lidRim} strokeWidth="0.8" />
        <Ellipse cx="50" cy="6.5" rx="11" ry="5.5"
          fill="url(#clKnobShine)" />
        <Ellipse cx="44" cy="5.5" rx="3.5" ry="2.5"
          fill={c.glassShine} opacity={0.55} />
      </Svg>
    );
  };

const PaperSlipSvg: React.FC<{ width: number; height: number; c: any }> = 
  ({ width, height, c }) => {
    return (
      <Svg width={width} height={height} viewBox="0 0 48 38">
        <Defs>
          <SvgLinearGradient id="cfpGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={c.paperBase}  />
            <Stop offset="1" stopColor={c.paperShadow}  />
          </SvgLinearGradient>
        </Defs>
        <Rect x="2.5" y="2.5" width="44" height="34" rx="3.5"
          fill={c.paperShadow} opacity={0.5} />
        <Rect x="1" y="1" width="44" height="34" rx="3.5"
          fill="url(#cfpGrad)" stroke={c.paperLine} strokeWidth="1" />
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

const GlowRingSvg: React.FC<{ c: any; glow: any }> = ({ c, glow }) => {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 100 100" style={StyleSheet.absoluteFill}>
      <Defs>
        <SvgRadialGradient id="cRingGlow" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={c.sparkGlow} stopOpacity={0.7} />
          <Stop offset="0.5" stopColor={glow} stopOpacity={0.3} />
          <Stop offset="1" stopColor={glow} stopOpacity={0} />
        </SvgRadialGradient>
      </Defs>
      <Ellipse cx="50" cy="50" rx="50" ry="40" fill="url(#cRingGlow)" />
    </Svg>
  );
};

// ── Particle interfaces ──────────────────────────────────────
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

export interface CommonJarHandle {
  triggerEnvelope: (onComplete?: () => void) => void;
}

interface CommonJarProps {
  count?: number;
  initialCount?: number;
  scale?: number;
  onPress?: () => void;
  colors?: JarColorConfig;
  primaryColor?: string;
  secondaryColor?: string;
  glowColor?: string;
  glassColor?: string;
  lidColor?: string;
  badgeColor?: string;
}

export const CommonJar = forwardRef<CommonJarHandle, CommonJarProps>(
  (
    {
      count,
      initialCount,
      scale = 1.0,
      onPress,
      colors: propsColors,
      primaryColor,
      secondaryColor,
      glowColor,
      glassColor,
      lidColor,
      badgeColor,
    },
    ref
  ) => {
    const jarMemoriesCount = useJournalStore((s) => s.jarMemories.length);
    const [localCount, setLocalCount] = useState<number | null>(null);

    const displayCount =
      localCount !== null
        ? localCount
        : count !== undefined
        ? count
        : initialCount !== undefined
        ? initialCount
        : jarMemoriesCount;

    const animatingRef = useRef(false);
    const cancelFlightRef = useRef<(() => void) | null>(null);

    const colors = useAppColors();
    const mergedColorsConfig: JarColorConfig = {
      ...propsColors,
      ...(primaryColor ? { primary: primaryColor } : {}),
      ...(secondaryColor ? { secondary: secondaryColor } : {}),
      ...(glowColor ? { glow: glowColor } : {}),
      ...(glassColor ? { glass: glassColor } : {}),
      ...(lidColor ? { lid: lidColor } : {}),
      ...(badgeColor ? { badge: badgeColor } : {}),
    };
    const c = getJarColors(colors, mergedColorsConfig);

    const JAR_W  = responsiveWidth(22) * scale;
    const JAR_H  = responsiveWidth(26) * scale;
    const LID_H  = responsiveWidth(6) * scale;
    const ENV_W  = responsiveWidth(12) * scale;
    const ENV_H  = responsiveWidth(10) * scale;

    const [paperState, setPaperState] = useState({
      visible: false,
      x: 0,
      y: -100,
      rot: -20,
      scale: 1,
      opacity: 0,
    });

    const lidTransY  = useSharedValue(0);
    const lidRotate  = useSharedValue(0);
    const bodyRotate = useSharedValue(0);
    const bodyScale  = useSharedValue(1);
    const glowOpacity = useSharedValue(0);
    const glowScale   = useSharedValue(0);
    const jarHoverY   = useSharedValue(0);

    const shimmerTransX = useSharedValue(-60);
    const orbX = useSharedValue(0);
    const orbY = useSharedValue(0);
    const orbScale = useSharedValue(1);

    const star1X = useSharedValue(-15);
    const star1Y = useSharedValue(-20);
    const star1Scale = useSharedValue(0.2);
    const star1Opacity = useSharedValue(0.1);

    const star2X = useSharedValue(20);
    const star2Y = useSharedValue(15);
    const star2Scale = useSharedValue(0.3);
    const star2Opacity = useSharedValue(0.15);

    const [burstParticles, setBurstParticles] = useState<BurstParticle[]>([]);
    const [floatHearts, setFloatHearts] = useState<FloatHeart[]>([]);
    const [trailDots, setTrailDots] = useState<TrailDot[]>([]);
    const [ambientParticles, setAmbientParticles] = useState<AmbientParticle[]>([]);
    
    const trailIdRef = useRef(0);
    const ambientIdRef = useRef(0);

    const ambientColors = [
      c.sparkPrimary,
      c.sparkSecondary,
      c.sparkAccent,
      c.sparkGlow,
      c.sparkWhite,
    ];
    const ambientColorsRef = useRef(ambientColors);
    ambientColorsRef.current = ambientColors;

    const badgeScale = useSharedValue(1);

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

    const shadowStyle = useAnimatedStyle(() => {
      const hoverFactor = 1 - (jarHoverY.value / -5) * 0.12;
      return {
        transform: [
          { scaleX: bodyScale.value * hoverFactor },
          { scaleY: bodyScale.value * hoverFactor },
        ],
        opacity: Math.max(0.08, 0.18 + (bodyScale.value - 1) * 2.5 - (jarHoverY.value / -5) * 0.05),
      };
    });

    const wrapperStyle = useAnimatedStyle(() => ({
      transform: [
        { translateY: jarHoverY.value },
      ],
    }));

    const startBreathing = useCallback(() => {
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.24, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.08, { duration: 2200, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      glowScale.value = withRepeat(
        withSequence(
          withTiming(0.96, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.76, { duration: 2200, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      lidTransY.value = withRepeat(
        withSequence(
          withTiming(-3, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 2200, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      jarHoverY.value = withRepeat(
        withSequence(
          withTiming(-5, { duration: 2600, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 2600, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );

      orbX.value = withRepeat(
        withSequence(
          withTiming(12, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
          withTiming(-12, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1600, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      orbY.value = withRepeat(
        withSequence(
          withTiming(18, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
          withTiming(-12, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
          withTiming(6, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      orbScale.value = withRepeat(
        withSequence(
          withTiming(1.35, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.75, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );

      // Slow magical pulsing & swaying of the jar body to make it look active & alive
      bodyScale.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 2400, easing: Easing.inOut(Easing.ease) }),
          withTiming(1.0, { duration: 2400, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      bodyRotate.value = withRepeat(
        withSequence(
          withTiming(-1, { duration: 2800, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 2800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );

      // Stars floating & twinkling loops
      star1X.value = withRepeat(
        withSequence(
          withTiming(-8, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(-20, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
          withTiming(-15, { duration: 1800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      star1Y.value = withRepeat(
        withSequence(
          withTiming(-12, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
          withTiming(-25, { duration: 2400, easing: Easing.inOut(Easing.ease) }),
          withTiming(-20, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      star1Scale.value = withRepeat(
        withSequence(
          withTiming(0.85, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.2, { duration: 1200, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      star1Opacity.value = withRepeat(
        withSequence(
          withTiming(0.9, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.2, { duration: 1200, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );

      star2X.value = withRepeat(
        withSequence(
          withTiming(25, { duration: 2300, easing: Easing.inOut(Easing.ease) }),
          withTiming(12, { duration: 1900, easing: Easing.inOut(Easing.ease) }),
          withTiming(20, { duration: 2100, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      star2Y.value = withRepeat(
        withSequence(
          withTiming(8, { duration: 2100, easing: Easing.inOut(Easing.ease) }),
          withTiming(22, { duration: 2300, easing: Easing.inOut(Easing.ease) }),
          withTiming(15, { duration: 1900, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      star2Scale.value = withRepeat(
        withSequence(
          withTiming(0.3, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.9, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      star2Opacity.value = withRepeat(
        withSequence(
          withTiming(0.15, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.85, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );

      shimmerTransX.value = withRepeat(
        withSequence(
          withTiming(120, { duration: 1600, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
          withDelay(
            2400,
            withTiming(-60, { duration: 0 })
          )
        ),
        -1,
        false
      );
    }, [glowOpacity, glowScale, lidTransY, jarHoverY, orbX, orbY, orbScale, shimmerTransX, bodyScale, bodyRotate, star1X, star1Y, star1Scale, star1Opacity, star2X, star2Y, star2Scale, star2Opacity]);

    useEffect(() => {
      startBreathing();
      return () => {
        cancelFlightRef.current?.();
        cancelAnimation(glowOpacity);
        cancelAnimation(glowScale);
        cancelAnimation(lidTransY);
        cancelAnimation(jarHoverY);
        cancelAnimation(orbX);
        cancelAnimation(orbY);
        cancelAnimation(orbScale);
        cancelAnimation(shimmerTransX);
        cancelAnimation(bodyScale);
        cancelAnimation(bodyRotate);
        cancelAnimation(star1X);
        cancelAnimation(star1Y);
        cancelAnimation(star1Scale);
        cancelAnimation(star1Opacity);
        cancelAnimation(star2X);
        cancelAnimation(star2Y);
        cancelAnimation(star2Scale);
        cancelAnimation(star2Opacity);
      };
    }, [startBreathing]);

    const handlePressJar = () => {
      if (animatingRef.current) return;
      haptics.light();
      onPress?.();

      cancelAnimation(glowOpacity);
      cancelAnimation(glowScale);
      cancelAnimation(lidTransY);
      cancelAnimation(jarHoverY);
      cancelAnimation(orbX);
      cancelAnimation(orbY);
      cancelAnimation(orbScale);
      cancelAnimation(shimmerTransX);
      cancelAnimation(bodyScale);
      cancelAnimation(bodyRotate);
      cancelAnimation(star1X);
      cancelAnimation(star1Y);
      cancelAnimation(star1Scale);
      cancelAnimation(star1Opacity);
      cancelAnimation(star2X);
      cancelAnimation(star2Y);
      cancelAnimation(star2Scale);
      cancelAnimation(star2Opacity);

      jarHoverY.value = withTiming(0, { duration: 150 });
      lidTransY.value = withSequence(
        withTiming(-8, { duration: 100 }),
        withSpring(0, { damping: 10, stiffness: 120 })
      );
      bodyRotate.value = withSequence(
        withTiming(-5, { duration: 60 }),
        withTiming(5, { duration: 100 }),
        withTiming(-3, { duration: 100 }),
        withTiming(3, { duration: 100 }),
        withTiming(0, { duration: 80 })
      );
      bodyScale.value = withSequence(
        withTiming(1.1, { duration: 100 }),
        withSpring(1.0, { damping: 9, stiffness: 140 })
      );

      orbScale.value = withSequence(
        withTiming(2.2, { duration: 220, easing: Easing.out(Easing.quad) }),
        withSpring(1.0, { damping: 8, stiffness: 120 })
      );
      orbX.value = withSequence(
        withTiming(20, { duration: 150 }),
        withTiming(-20, { duration: 150 }),
        withTiming(0, { duration: 150 })
      );
      orbY.value = withSequence(
        withTiming(-16, { duration: 150 }),
        withTiming(16, { duration: 150 }),
        withTiming(0, { duration: 150 })
      );

      star1Scale.value = withSequence(
        withTiming(1.5, { duration: 200 }),
        withSpring(0.6, { damping: 7, stiffness: 110 })
      );
      star2Scale.value = withSequence(
        withTiming(1.4, { duration: 250 }),
        withSpring(0.5, { damping: 7, stiffness: 110 })
      );

      shimmerTransX.value = withSequence(
        withTiming(-60, { duration: 0 }),
        withTiming(120, { duration: 450, easing: Easing.inOut(Easing.ease) })
      );

      glowOpacity.value = withSequence(
        withTiming(0.85, { duration: 150 }),
        withTiming(0, { duration: 450 })
      );
      glowScale.value = withSequence(
        withTiming(1.2, { duration: 150 }),
        withTiming(0, { duration: 450 })
      );

      triggerBurst();
      triggerFloatHearts();

      setTimeout(() => {
        if (!animatingRef.current) {
          startBreathing();
        }
      }, 700);
    };

    useEffect(() => {
      const interval = setInterval(() => {
        const id = ambientIdRef.current++;
        const opacity    = new RNAnimated.Value(0);
        const translateY = new RNAnimated.Value(0);
        const translateX = new RNAnimated.Value(0);
        const pScale     = new RNAnimated.Value(1);
        
        const swayDist = (Math.random() - 0.5) * responsiveWidth(6);
        const particleSize = (3 + Math.random() * 4.5) * scale;

        const particle: AmbientParticle = {
          id,
          left:   10 + Math.random() * 80,
          bottom: 5 + Math.random() * 40,
          size:   particleSize,
          color:  ambientColorsRef.current[Math.floor(Math.random() * ambientColorsRef.current.length)],
          opacity,
          translateY,
          translateX,
          scale: pScale,
        };
        setAmbientParticles(prev => [...prev.slice(-15), particle]);

        RNAnimated.parallel([
          RNAnimated.sequence([
            RNAnimated.timing(opacity, { toValue: 0.75, duration: 400, useNativeDriver: true }),
            RNAnimated.timing(opacity, { toValue: 0,   duration: 2900, useNativeDriver: true }),
          ]),
          RNAnimated.timing(translateY, { toValue: -responsiveHeight(18), duration: 3800, easing: RNEasing.linear, useNativeDriver: true }),
          RNAnimated.timing(translateX, { toValue: swayDist, duration: 3800, easing: RNEasing.inOut(RNEasing.ease), useNativeDriver: true }),
          RNAnimated.sequence([
            RNAnimated.delay(3100),
            RNAnimated.timing(pScale, { toValue: 0.25, duration: 700, useNativeDriver: true }),
          ]),
        ]).start(() => {
          setAmbientParticles(prev => prev.filter(p => p.id !== id));
        });
      }, 450);

      return () => clearInterval(interval);
    }, [scale, c]);

    const spawnTrail = useCallback((x: number, y: number) => {
      const id    = trailIdRef.current++;
      const opacity = new RNAnimated.Value(0.85);
      const trailScale   = new RNAnimated.Value(1);
      const trailSize = (3 + Math.random() * 4) * scale;
      
      const dot: TrailDot = {
        id, left: x, top: y,
        opacity, scale: trailScale,
        color: [c.sparkPrimary, c.sparkSecondary, c.sparkGlow][Math.floor(Math.random() * 3)],
        size: trailSize,
      };
      setTrailDots(prev => [...prev.slice(-20), dot]);
      RNAnimated.parallel([
        RNAnimated.timing(opacity, { toValue: 0, duration: 550, useNativeDriver: true }),
        RNAnimated.timing(trailScale,   { toValue: 0.25, duration: 550, useNativeDriver: true }),
      ]).start(() => {
        setTrailDots(prev => prev.filter(d => d.id !== id));
      });
    }, [scale, c]);

    const triggerBurst = useCallback(() => {
      const particles: BurstParticle[] = BURST_DEFS.map((b, i) => ({
        id: i,
        x:       new RNAnimated.Value(0),
        y:       new RNAnimated.Value(0),
        opacity: new RNAnimated.Value(0),
        scale:   new RNAnimated.Value(1),
        color:   (c as any)[b.colorKey],
        size:    b.size * scale,
      }));
      setBurstParticles(particles);

      particles.forEach((p, i) => {
        const b = BURST_DEFS[i];
        setTimeout(() => {
          p.opacity.setValue(1);
          p.x.setValue(0);
          p.y.setValue(0);
          RNAnimated.parallel([
            RNAnimated.timing(p.x,       { toValue: b.dx * scale, duration: 550, easing: RNEasing.out(RNEasing.cubic), useNativeDriver: true }),
            RNAnimated.timing(p.y,       { toValue: b.dy * scale, duration: 550, easing: RNEasing.out(RNEasing.cubic), useNativeDriver: true }),
            RNAnimated.timing(p.opacity, { toValue: 0,    duration: 550, easing: RNEasing.out(RNEasing.quad),  useNativeDriver: true }),
            RNAnimated.timing(p.scale,   { toValue: 0.2,  duration: 550, useNativeDriver: true }),
          ]).start();
        }, i * 20);
      });

      setTimeout(() => setBurstParticles([]), 800);
    }, [scale, c]);

    const triggerFloatHearts = useCallback(() => {
      const hearts: FloatHeart[] = FLOAT_DEFS.map((h, i) => ({
        id: i,
        x:       new RNAnimated.Value(0),
        y:       new RNAnimated.Value(0),
        opacity: new RNAnimated.Value(0),
        scale:   new RNAnimated.Value(1),
        color:   (c as any)[h.colorKey],
        size:    h.size * scale,
      }));
      setFloatHearts(hearts);

      hearts.forEach((heart, i) => {
        const h = FLOAT_DEFS[i];
        setTimeout(() => {
          heart.opacity.setValue(1);
          RNAnimated.parallel([
            RNAnimated.timing(heart.x,       { toValue: h.dx * scale,  duration: 1100, easing: RNEasing.out(RNEasing.cubic), useNativeDriver: true }),
            RNAnimated.timing(heart.y,       { toValue: (h.dy - 30) * scale, duration: 1100, easing: RNEasing.out(RNEasing.cubic), useNativeDriver: true }),
            RNAnimated.timing(heart.opacity, { toValue: 0, duration: 1100, easing: RNEasing.out(RNEasing.quad),  useNativeDriver: true }),
            RNAnimated.timing(heart.scale,   { toValue: 0.3, duration: 1100, useNativeDriver: true }),
          ]).start();
        }, h.delay);
      });

      setTimeout(() => setFloatHearts([]), 1400);
    }, [scale, c]);

    useImperativeHandle(ref, () => ({
      triggerEnvelope: (onComplete?: () => void) => {
        if (animatingRef.current) return;
        animatingRef.current = true;

        cancelAnimation(glowOpacity);
        cancelAnimation(glowScale);
        cancelAnimation(lidTransY);
        cancelAnimation(jarHoverY);
        cancelAnimation(orbX);
        cancelAnimation(orbY);
        cancelAnimation(orbScale);
        cancelAnimation(shimmerTransX);
        cancelAnimation(bodyScale);
        cancelAnimation(bodyRotate);
        cancelAnimation(star1X);
        cancelAnimation(star1Y);
        cancelAnimation(star1Scale);
        cancelAnimation(star1Opacity);
        cancelAnimation(star2X);
        cancelAnimation(star2Y);
        cancelAnimation(star2Scale);
        cancelAnimation(star2Opacity);

        jarHoverY.value = withTiming(0, { duration: 150 });

        const startCount =
          count !== undefined
            ? count
            : initialCount !== undefined
            ? initialCount
            : jarMemoriesCount;
            
        setLocalCount(startCount);

        const startX = JAR_W / 2 - ENV_W / 2 - JAR_W * 0.5;
        const startY = -responsiveHeight(18);

        const mouthX = JAR_W / 2 - ENV_W / 2;
        const mouthY = LID_H + responsiveWidth(1);

        const arc1X = startX - JAR_W * 0.8;
        const arc1Y = startY + responsiveHeight(4);
        const arc2X = mouthX + JAR_W * 0.3;
        const arc2Y = mouthY - responsiveHeight(6);

        setPaperState({ visible: true, x: startX, y: startY, rot: -20, scale: 1, opacity: 1 });

        let lastTrailT = 0;

        const cancelPhase1 = raf(600, (t) => {
          const t1 = 1 - t;
          const x = t1*t1*t1*startX + 3*t1*t1*t*arc1X + 3*t1*t*t*arc2X + t*t*t*mouthX;
          const y = t1*t1*t1*startY + 3*t1*t1*t*arc1Y + 3*t1*t*t*arc2Y + t*t*t*mouthY;
          const rot = lerp(-20, 10, easeInOut(t));

          setPaperState(prev => ({ ...prev, x, y, rot, opacity: 1 }));

          if (t - lastTrailT > 0.05 && Math.random() < 0.55) {
            lastTrailT = t;
            spawnTrail(x + ENV_W / 2, y + ENV_H / 2);
          }
        }, () => {
          const lidLiftPx = LID_H * 1.8;

          glowOpacity.value = withTiming(1, { duration: 250 });
          glowScale.value   = withTiming(1, { duration: 250 });

          const cancelLidOpen = raf(280, (t) => {
            const lift = easeOutCubic(t) * -lidLiftPx;
            const rot  = easeOutCubic(t) * -14;
            lidTransY.value  = lift;
            lidRotate.value  = rot;
          }, () => {
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
              setPaperState(prev => ({ ...prev, visible: false, opacity: 0 }));

              setLocalCount(c => (c !== null ? c + 1 : startCount + 1));
              
              badgeScale.value = withSequence(
                withTiming(1.45, { duration: 150 }),
                withSpring(1.0,  { damping: 8, stiffness: 200 }),
              );

              const cancelLidClose = raf(300, (t) => {
                const e = bounceOut(t);
                lidTransY.value = -lidLiftPx * (1 - e);
                lidRotate.value = -14 * (1 - e);
              }, () => {
                lidTransY.value = 0;
                lidRotate.value = 0;

                triggerBurst();
                triggerFloatHearts();
                
                orbScale.value = withSequence(
                  withTiming(2.6, { duration: 220 }),
                  withSpring(1.0, { damping: 8, stiffness: 120 })
                );
                star1Scale.value = withSequence(
                  withTiming(2.0, { duration: 220 }),
                  withSpring(0.5, { damping: 6, stiffness: 100 })
                );
                star2Scale.value = withSequence(
                  withTiming(1.8, { duration: 250 }),
                  withSpring(0.4, { damping: 6, stiffness: 100 })
                );
                shimmerTransX.value = withSequence(
                  withTiming(-60, { duration: 0 }),
                  withTiming(120, { duration: 450, easing: Easing.inOut(Easing.ease) })
                );

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
                  startBreathing();
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

    return (
      <View style={[styles.root, { width: JAR_W, height: JAR_H + LID_H + responsiveHeight(4) }]}>
        <Animated.View
          style={[
            styles.groundShadow,
            {
              width: JAR_W * 0.75,
              bottom: responsiveHeight(1.5),
              backgroundColor: colors.isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(124, 58, 237, 0.16)',
            },
            shadowStyle,
          ]}
          pointerEvents="none"
        />

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

        <Animated.View style={[styles.jarWrapper, { width: JAR_W, height: JAR_H + LID_H }, wrapperStyle]} pointerEvents="box-none">
          <TouchableOpacity
            activeOpacity={0.92}
            onPress={handlePressJar}
            style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'flex-start' }]}
          >
            <Animated.View 
              style={[
                styles.glowRing, 
                { 
                  top: JAR_H * 0.05,
                  left: -JAR_W * 0.15,
                  width: JAR_W * 1.3,
                  height: JAR_W * 1.1,
                  borderRadius: JAR_W * 0.65,
                }, 
                glowStyle
              ]} 
              pointerEvents="none"
            >
              <GlowRingSvg c={c} glow={c.glow} />
            </Animated.View>

            <Animated.View style={[styles.lidContainer, { width: JAR_W, height: LID_H }, lidStyle]} pointerEvents="none">
              <JarLidSvg width={JAR_W} height={LID_H} colors={colors} c={c} />
            </Animated.View>

            <Animated.View style={[styles.bodyContainer, { top: LID_H, width: JAR_W, height: JAR_H - LID_H }, bodyStyle]} pointerEvents="none">
              <JarBodySvg 
                fillCount={displayCount} 
                width={JAR_W} 
                height={JAR_H - LID_H} 
                colors={colors} 
                c={c} 
                shimmerTransX={shimmerTransX}
                orbX={orbX}
                orbY={orbY}
                orbScale={orbScale}
                star1X={star1X}
                star1Y={star1Y}
                star1Scale={star1Scale}
                star1Opacity={star1Opacity}
                star2X={star2X}
                star2Y={star2Y}
                star2Scale={star2Scale}
                star2Opacity={star2Opacity}
              />
            </Animated.View>

            {displayCount > 0 && (
              <Animated.Text
                style={[
                  styles.countBadge,
                  {
                    backgroundColor: c.badge,
                    shadowColor: c.badgeShadow,
                    bottom: LID_H * 0.85, // Position on the edge of the jar bottom-right corner
                  },
                  badgeStyle,
                ]}
                pointerEvents="none"
              >
                {displayCount}
              </Animated.Text>
            )}
          </TouchableOpacity>

          <View style={[styles.burstContainer, { top: LID_H + responsiveWidth(2), left: JAR_W / 2 }]} pointerEvents="none">
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

          <View style={[styles.heartsContainer, { top: JAR_H * 0.35, left: JAR_W / 2 }]} pointerEvents="none">
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

          {paperState.visible && (
            <View
              pointerEvents="none"
              style={[
                styles.flyingPaper,
                {
                  width:   ENV_W,
                  height:  ENV_H,
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
              <PaperSlipSvg width={ENV_W} height={ENV_H} c={c} />
            </View>
          )}
        </Animated.View>
      </View>
    );
  },
);

CommonJar.displayName = 'CommonJar';

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'visible',
  },
  jarWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'visible',
    zIndex: 10,
  },
  glowRing: {
    position: 'absolute',
    zIndex: 0,
  },
  lidContainer: {
    position: 'absolute',
    top:  0,
    left: 0,
    zIndex: 5,
  },
  bodyContainer: {
    position: 'absolute',
    left: 0,
    zIndex: 3,
  },
  countBadge: {
    position:        'absolute',
    bottom:          0,
    right:           -10,
    color:           '#FFFFFF',
    fontSize:        11,
    fontWeight:      '700',
    fontFamily:      'DMSans-Bold',
    borderRadius:    12,
    minWidth:        22,
    height:          22,
    textAlign:       'center',
    lineHeight:      22,
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
    height: 8,
    borderRadius: 4,
    zIndex: 1,
  },
});
