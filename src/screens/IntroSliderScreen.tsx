/**
 * IntroSliderScreen
 * ─────────────────
 * 3 clean slides shown once on first launch.
 * Top half: rich gradient illustration (always vivid, same in light & dark).
 * Bottom half: theme-aware background, headline, body text.
 * Bottom controls: theme-aware background, dots, buttons.
 */

import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { useAppColors } from '../theme';
import { metrics } from '../theme/metrics';
import { useUserStore } from '../store/useUserStore';
import { AppColors } from '../theme/ThemeContext';

type Nav = StackNavigationProp<RootStackParamList, 'Intro'>;

const { width: W } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────
//  Slide definitions — illustration gradients are always vivid
//  (they look great on both light and dark backgrounds).
//  Text content is theme-neutral; colors come from useAppColors.
// ─────────────────────────────────────────────────────────────
const SLIDES = [
  {
    gradTop: ['#1a0533', '#3b0764', '#6d28d9'] as string[],
    illustration: 'circles' as const,
    accentColor: '#a78bfa',
    headline: 'Reignite the\nconnection.',
    body: 'A 5-day solo journey of honest moments, small rituals, and real reflection.',
  },
  {
    gradTop: ['#1a0a1f', '#4a1942', '#be185d'] as string[],
    illustration: 'heart' as const,
    accentColor: '#FF1493',
    headline: 'Daily rituals\nthat actually work.',
    body: 'Mood check-ins, appreciation prompts, and questions that bring you closer.',
  },
  {
    gradTop: ['#0a1628', '#1e3a5f', '#0ea5e9'] as string[],
    illustration: 'star' as const,
    accentColor: '#38bdf8',
    headline: 'Discover your\nrelationship style.',
    body: 'Earn your connection badge and write a promise that lasts beyond 5 days.',
  },
];

// ─────────────────────────────────────────────────────────────
//  Illustration styles — no colors, safe as module-level
// ─────────────────────────────────────────────────────────────
const IL_SIZE = W * 0.52;
const CIRCLE_R = IL_SIZE * 0.42;

const il = StyleSheet.create({
  root: {
    width: IL_SIZE,
    height: IL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: CIRCLE_R * 2,
    height: CIRCLE_R * 2,
    borderRadius: CIRCLE_R,
    position: 'absolute',
  },
  circleLeft:  { left: 0 },
  circleRight: { right: 0 },
  overlap: {
    width: CIRCLE_R * 0.9,
    height: CIRCLE_R * 2,
    borderRadius: CIRCLE_R,
    position: 'absolute',
    alignSelf: 'center',
  },
  disc: {
    width: IL_SIZE * 0.9,
    height: IL_SIZE * 0.9,
    borderRadius: IL_SIZE * 0.45,
    position: 'absolute',
  },
  heartWrap: {
    width: IL_SIZE * 0.55,
    height: IL_SIZE * 0.55,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  heartLeft: {
    width: IL_SIZE * 0.28,
    height: IL_SIZE * 0.28,
    borderRadius: IL_SIZE * 0.14,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  heartRight: {
    width: IL_SIZE * 0.28,
    height: IL_SIZE * 0.28,
    borderRadius: IL_SIZE * 0.14,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  heartBottom: {
    width: IL_SIZE * 0.38,
    height: IL_SIZE * 0.38,
    borderRadius: 4,
    position: 'absolute',
    bottom: 0,
    transform: [{ rotate: '45deg' }],
  },
  ring: {
    width: IL_SIZE * 0.88,
    height: IL_SIZE * 0.88,
    borderRadius: IL_SIZE * 0.44,
    borderWidth: 1.5,
    position: 'absolute',
  },
  ringInner: {
    width: IL_SIZE * 0.62,
    height: IL_SIZE * 0.62,
    borderRadius: IL_SIZE * 0.31,
    borderWidth: 1.5,
    position: 'absolute',
  },
  centreDot: {
    width: IL_SIZE * 0.22,
    height: IL_SIZE * 0.22,
    borderRadius: IL_SIZE * 0.11,
    position: 'absolute',
  },
  spoke: {
    width: 2,
    height: IL_SIZE * 0.38,
    borderRadius: 1,
    position: 'absolute',
    top: IL_SIZE * 0.06,
    alignSelf: 'center',
  },
  labelWrap: {
    position: 'absolute',
    bottom: -metrics.spacing.lg,
  },
  labelText: {
    fontSize: metrics.fontSize.caption,
    fontFamily: 'DMSans-Medium',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});

// ─────────────────────────────────────────────────────────────
//  Illustration components
// ─────────────────────────────────────────────────────────────
const IllustrationCircles: React.FC<{ accent: string; gradTop: string[] }> = ({ accent, gradTop }) => (
  <View style={il.root}>
    <LinearGradient colors={[`${accent}cc`, `${accent}44`]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[il.circle, il.circleLeft]} />
    <LinearGradient colors={[`${gradTop[2]}ff`, `${accent}88`]} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={[il.circle, il.circleRight]} />
    <View style={[il.overlap, { backgroundColor: `${accent}30` }]} />
    <View style={il.labelWrap}>
      <Text style={[il.labelText, { color: accent }]}>5 days</Text>
    </View>
  </View>
);

const IllustrationHeart: React.FC<{ accent: string }> = ({ accent }) => (
  <View style={il.root}>
    <View style={[il.disc, { backgroundColor: `${accent}22` }]} />
    <View style={il.heartWrap}>
      <LinearGradient colors={[accent, `${accent}88`]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={il.heartLeft} />
      <LinearGradient colors={[accent, `${accent}88`]} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={il.heartRight} />
      <LinearGradient colors={[`${accent}cc`, `${accent}44`]} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={il.heartBottom} />
    </View>
    <View style={il.labelWrap}>
      <Text style={[il.labelText, { color: accent }]}>for two</Text>
    </View>
  </View>
);

const IllustrationStar: React.FC<{ accent: string }> = ({ accent }) => (
  <View style={il.root}>
    <View style={[il.ring, { borderColor: `${accent}55` }]} />
    <View style={[il.ringInner, { borderColor: `${accent}99` }]} />
    <LinearGradient colors={[accent, `${accent}66`]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={il.centreDot} />
    {[0, 45, 90, 135].map((deg) => (
      <LinearGradient
        key={deg}
        colors={[`${accent}cc`, `${accent}00`]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[il.spoke, { transform: [{ rotate: `${deg}deg` }] }]}
      />
    ))}
    <View style={il.labelWrap}>
      <Text style={[il.labelText, { color: accent }]}>your badge</Text>
    </View>
  </View>
);

// ─────────────────────────────────────────────────────────────
//  Theme-aware styles factory
// ─────────────────────────────────────────────────────────────
function makeStyles(c: AppColors) {
  const textPrimary   = c.isDark ? '#FFFFFF'                  : c.textDark;
  const textSecondary = c.isDark ? 'rgba(255,255,255,0.55)'   : 'rgba(0,0,0,0.45)';
  const skipColor     = c.isDark ? 'rgba(255,255,255,0.30)'   : 'rgba(0,0,0,0.30)';
  const privacyColor  = c.isDark ? 'rgba(255,255,255,0.18)'   : 'rgba(0,0,0,0.22)';
  const bottomBg      = c.isDark ? `${c.dark}F2`              : `${c.dark}F2`;

  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: c.dark,
    },
    page: {
      width: W,
      flex: 1,
      backgroundColor: c.dark,
    },
    illustrationBg: {
      height: '52%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    seam: {
      height: metrics.spacing.xxl,
      marginTop: -metrics.spacing.xxl,
    },
    textArea: {
      flex: 1,
      paddingHorizontal: metrics.layout.screenPaddingHz * 1.2,
      paddingTop: metrics.spacing.lg,
      justifyContent: 'flex-start',
      backgroundColor: c.dark,
    },
    headline: {
      fontSize: metrics.fontSize.h1 * 1.1,
      fontFamily: 'PlayfairDisplay-SemiBold',
      color: textPrimary,
      lineHeight: metrics.fontSize.h1 * 1.5,
      marginBottom: metrics.spacing.md,
    },
    body: {
      fontSize: metrics.fontSize.body,
      fontFamily: 'DMSans-Regular',
      color: textSecondary,
      lineHeight: metrics.fontSize.body * 1.7,
    },
    bottom: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: metrics.layout.screenPaddingHz,
      paddingBottom: metrics.spacing.md,
      backgroundColor: bottomBg,
    },
    dots: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: metrics.spacing.xs,
      marginBottom: metrics.spacing.md,
    },
    dot: {
      height: 8,
      borderRadius: 4,
    },
    btnRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: metrics.spacing.sm,
    },
    skipBtn: {
      paddingVertical: metrics.spacing.sm,
      paddingRight: metrics.spacing.md,
    },
    skipText: {
      color: skipColor,
      fontSize: metrics.fontSize.body,
      fontFamily: 'DMSans-Regular',
    },
    nextBtnTouch: {
      flex: 1,
    },
    nextBtn: {
      height: metrics.button.height,
      borderRadius: metrics.radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 14,
      elevation: 10,
    },
    nextText: {
      color: c.text,
      fontSize: metrics.fontSize.button,
      fontFamily: 'DMSans-Bold',
      letterSpacing: 0.4,
    },
    privacy: {
      color: privacyColor,
      fontSize: metrics.fontSize.micro,
      fontFamily: 'DMSans-Regular',
      letterSpacing: 1.5,
      textAlign: 'center',
    },
  });
}

// ─────────────────────────────────────────────────────────────
//  Main screen
// ─────────────────────────────────────────────────────────────
export const IntroSliderScreen: React.FC = () => {
  const colors = useAppColors();
  const s = makeStyles(colors);

  const navigation = useNavigation<Nav>();
  const setIntroSeen = useUserStore((s) => s.setIntroSeen);

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const dotWidths = useRef(SLIDES.map((_, i) => new Animated.Value(i === 0 ? 1 : 0))).current;

  const activateDot = useCallback(
    (idx: number) => {
      dotWidths.forEach((anim, i) => {
        Animated.spring(anim, {
          toValue: i === idx ? 1 : 0,
          useNativeDriver: false,
          tension: 140,
          friction: 10,
        }).start();
      });
    },
    [dotWidths],
  );

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const idx = Math.round(e.nativeEvent.contentOffset.x / W);
      if (idx !== activeIndex) {
        setActiveIndex(idx);
        activateDot(idx);
      }
    },
    [activeIndex, activateDot],
  );

  const goNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({ x: W * (activeIndex + 1), animated: true });
    } else {
      finish();
    }
  };

  const finish = () => {
    setIntroSeen(true);
    navigation.replace('Splash');
  };

  const isLast = activeIndex === SLIDES.length - 1;
  const slide = SLIDES[activeIndex];

  return (
    <View style={s.root}>
      {/* ── Paged scroll ─────────────────────────────────── */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
        bounces={false}
        style={StyleSheet.absoluteFill}
      >
        {SLIDES.map((sl, idx) => (
          <View key={idx} style={s.page}>
            {/* Top half — vivid gradient illustration (same in light & dark) */}
            <LinearGradient
              colors={sl.gradTop}
              start={{ x: 0.2, y: 0 }}
              end={{ x: 0.8, y: 1 }}
              style={s.illustrationBg}
            >
              {sl.illustration === 'circles' && <IllustrationCircles accent={sl.accentColor} gradTop={sl.gradTop} />}
              {sl.illustration === 'heart'   && <IllustrationHeart   accent={sl.accentColor} />}
              {sl.illustration === 'star'    && <IllustrationStar    accent={sl.accentColor} />}
            </LinearGradient>

            {/* Seam — fades illustration into theme background */}
            <LinearGradient
              colors={[`${sl.gradTop[sl.gradTop.length - 1]}00`, colors.dark]}
              style={s.seam}
            />

            {/* Bottom half — theme-aware */}
            <View style={s.textArea}>
              <Text style={s.headline}>{sl.headline}</Text>
              <Text style={s.body}>{sl.body}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* ── Fixed bottom controls — theme-aware ─────────── */}
      <SafeAreaView edges={['bottom']} style={s.bottom} pointerEvents="box-none">
        {/* Dots */}
        <View style={s.dots}>
          {SLIDES.map((sl, i) => (
            <Animated.View
              key={i}
              style={[
                s.dot,
                {
                  backgroundColor: sl.accentColor,
                  width: dotWidths[i].interpolate({ inputRange: [0, 1], outputRange: [8, 28] }),
                  opacity: dotWidths[i].interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
                },
              ]}
            />
          ))}
        </View>

        {/* Buttons */}
        <View style={s.btnRow}>
          {!isLast ? (
            <TouchableOpacity onPress={finish} activeOpacity={0.6} style={s.skipBtn}>
              <Text style={s.skipText}>Skip</Text>
            </TouchableOpacity>
          ) : (
            <View style={s.skipBtn} />
          )}

          <TouchableOpacity onPress={goNext} activeOpacity={0.88} style={s.nextBtnTouch}>
            <LinearGradient
              colors={[slide.accentColor, `${slide.accentColor}99`]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={s.nextBtn}
            >
              <Text style={s.nextText}>{isLast ? "Let's Begin" : 'Next'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <Text style={s.privacy}>No signup · No data · Just you two</Text>
      </SafeAreaView>
    </View>
  );
};
