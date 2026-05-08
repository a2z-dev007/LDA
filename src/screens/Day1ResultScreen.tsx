import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, TouchableOpacity, ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/types';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { useAppColors } from '../theme';
import { typography } from '../theme/typography';
import { metrics } from '../theme/metrics';
import { getPersonalityType } from '../data/day1Service';
import type { PersonalityTypeId } from '../data/day1Service';
import { useDayStore } from '../store/useDayStore';
import { useStreakStore } from '../store/useStreakStore';
import { haptics } from '../utils/haptics';
import { LOTTIE } from '../assets/lottie';
import {
  Award, Sparkles, Heart, Star, ChevronRight, Flame,
  Droplets, Wind, Waves,
} from 'lucide-react-native';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

type Nav = StackNavigationProp<RootStackParamList, 'Day1Result'>;

// Icon per personality type
const TYPE_ICON: Record<string, any> = {
  steady_flame:   Flame,
  electric_spark: Sparkles,
  deep_current:   Droplets,
  shifting_tide:  Waves,
};

export const Day1ResultScreen: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const day1 = useDayStore((s) => s.day1);
  const recordActivity = useStreakStore((s) => s.recordActivity);

  const personality = getPersonalityType(
    (day1.personalityType as PersonalityTypeId) ?? 'shifting_tide'
  );

  const TypeIcon = TYPE_ICON[personality.id] ?? Star;

  // Animations
  const headerAnim  = useRef(new Animated.Value(0)).current;
  const badgeAnim   = useRef(new Animated.Value(0)).current;
  const badgeScale  = useRef(new Animated.Value(0.5)).current;
  const cardAnim    = useRef(new Animated.Value(0)).current;
  const cardSlide   = useRef(new Animated.Value(40)).current;
  const pillsAnim   = useRef(new Animated.Value(0)).current;
  const growthAnim  = useRef(new Animated.Value(0)).current;
  const ctaAnim     = useRef(new Animated.Value(0)).current;
  const pulseAnim   = useRef(new Animated.Value(1)).current;
  const lottieRef   = useRef<LottieView>(null);

  useEffect(() => {
    haptics.success();
    recordActivity();
    // Play confetti once
    lottieRef.current?.play();

    Animated.sequence([
      // Header fades in
      Animated.timing(headerAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      // Badge pops in with spring
      Animated.parallel([
        Animated.timing(badgeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(badgeScale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
      ]),
      // Card slides up
      Animated.parallel([
        Animated.timing(cardAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(cardSlide, { toValue: 0, friction: 8, tension: 80, useNativeDriver: true }),
      ]),
      // Pills + growth
      Animated.timing(pillsAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.timing(growthAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
      // CTA
      Animated.timing(ctaAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start(() => {
      // Pulse the badge continuously
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.06, duration: 1400, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1400, useNativeDriver: true }),
        ])
      ).start();
    });
  }, []);

  const handleSave = () => {
    haptics.medium();
    navigation.navigate('Home');
  };

  const handleTomorrow = () => {
    haptics.light();
    navigation.navigate('Home');
  };

  return (
    <ScreenWrapper>
      {/* ── Confetti — plays once on mount, absolute over everything ── */}
      <LottieView
        ref={lottieRef}
        source={LOTTIE.confetti}
        style={styles.confetti}
        autoPlay={false}
        loop={false}
        resizeMode="cover"
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingTop: Math.max(insets.top, metrics.spacing.md) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Achievement header ── */}
        <Animated.View style={[styles.header, { opacity: headerAnim }]}>
          <View style={styles.achievementBadgeRow}>
            <Award size={metrics.iconSize.xs} color={personality.color} strokeWidth={2} />
            <Text style={[styles.achievementLabel, { color: personality.color }]}>
              DAY 1 COMPLETE
            </Text>
            <Award size={metrics.iconSize.xs} color={personality.color} strokeWidth={2} />
          </View>
          <Text style={styles.headerTitle}>Your relationship type is</Text>
        </Animated.View>

        {/* ── Big badge / icon ── */}
        <Animated.View
          style={[
            styles.badgeContainer,
            {
              opacity: badgeAnim,
              transform: [{ scale: Animated.multiply(badgeScale, pulseAnim) }],
            },
          ]}
        >
          {/* Outer glow ring */}
          <View style={[styles.badgeGlowRing, { borderColor: `${personality.color}30` }]} />
          {/* Middle ring */}
          <View style={[styles.badgeMidRing, { borderColor: `${personality.color}50` }]} />
          {/* Inner gradient circle */}
          <LinearGradient
            colors={['#6EE87A', '#2DD4BF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.badgeCircle}
          >
            <TypeIcon size={responsiveWidth(10)} color="#FFFFFF" strokeWidth={1.5} />
          </LinearGradient>
          {/* Star decorations */}
        
        </Animated.View>

        {/* ── Type name + sublabel ── */}
        <Animated.View style={[styles.typeNameContainer, { opacity: badgeAnim }]}>
          <Text style={[styles.typeName, { color: personality.color }]}>
            {personality.name}
          </Text>
          <Text style={styles.typeSubLabel}>{personality.subLabel}</Text>
        </Animated.View>

        {/* ── Description card ── */}
        <Animated.View
          style={[
            styles.card,
            {
              opacity: cardAnim,
              transform: [{ translateY: cardSlide }],
              borderColor: `${personality.color}30`,
            },
          ]}
        >
          {/* Top accent bar */}
          <LinearGradient
            colors={['#6EE87A', '#2DD4BF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.cardAccentBar}
          />
          <Text style={styles.cardDescription}>{personality.description}</Text>
        </Animated.View>

        {/* ── Trait pills ── */}
        <Animated.View style={[styles.pillsSection, { opacity: pillsAnim }]}>
          <Text style={styles.sectionLabel}>YOUR TRAITS</Text>
          <View style={styles.pillRow}>
            {personality.traits.map((trait, i) => (
              <LinearGradient
                key={i}
                colors={['rgba(110,232,122,0.15)', 'rgba(45,212,191,0.15)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.pill, { borderColor: `${personality.color}50` }]}
              >
                <Text style={[styles.pillText, { color: personality.color }]}>{trait}</Text>
              </LinearGradient>
            ))}
          </View>
        </Animated.View>

        {/* ── Growth invitation ── */}
        <Animated.View style={[styles.growthCard, { opacity: growthAnim }]}>
          <View style={styles.growthIconRow}>
            <View style={[styles.growthIconCircle, { backgroundColor: `${personality.color}15` }]}>
              <Heart size={metrics.iconSize.sm} color={personality.color} strokeWidth={1.5} />
            </View>
            <Text style={styles.growthLabel}>ONE INVITATION FOR YOU</Text>
          </View>
          <Text style={styles.growthText}>{personality.growth}</Text>
        </Animated.View>

        {/* ── Key question ── */}
        <Animated.View style={[styles.keyLineContainer, { opacity: growthAnim }]}>
          <Text style={styles.keyLine}>
            "Would your partner say the same thing about themselves?"
          </Text>
        </Animated.View>

        <View style={{ height: responsiveHeight(12) }} />
      </ScrollView>

      {/* ── Fixed CTAs ── */}
      <Animated.View
        style={[
          styles.ctaSection,
          {
            opacity: ctaAnim,
            paddingBottom:responsiveHeight(2),
          },
        ]}
      >
        {/* Primary CTA — gradient button */}
        <TouchableOpacity
          style={styles.primaryBtnTouch}
          activeOpacity={0.88}
          onPress={handleSave}
        >
          <LinearGradient
            colors={['#6EE87A', '#2DD4BF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryBtn}
          >
            <View style={styles.primaryBtnIconCircle}>
              <Sparkles size={metrics.iconSize.sm} color="#FFFFFF" strokeWidth={2} />
            </View>
            <Text style={styles.primaryBtnLabel}>Save my result</Text>
            <ChevronRight size={metrics.iconSize.sm} color="#FFFFFF" strokeWidth={2} />
          </LinearGradient>
        </TouchableOpacity>

        {/* Ghost CTA */}
        <TouchableOpacity
          style={styles.ghostCta}
          activeOpacity={0.7}
          onPress={handleTomorrow}
        >
          <Text style={styles.ghostCtaLabel}>Come back tomorrow →</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScreenWrapper>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingBottom: metrics.spacing.sm,
  },

  // ── Confetti ─────────────────────────────────────────────
  confetti: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: responsiveHeight(50),
    zIndex: 999,
    pointerEvents: 'none' as any,
  },

  // ── Header ───────────────────────────────────────────────
  header: {
    alignItems: 'center',
    marginBottom:responsiveHeight(5),
  },
  achievementBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.xs,
    marginBottom: metrics.spacing.xs,
  },
  achievementLabel: {
    ...typography.captionSmall,
    letterSpacing: 2,
  },
  headerTitle: {
    ...typography.bodySmall,
    color: c.textSecondary,
    textAlign: 'center',
  },

  // ── Badge ────────────────────────────────────────────────
  badgeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: metrics.spacing.xl,
    position: 'relative',
  },
  badgeGlowRing: {
    position: 'absolute',
    width: responsiveWidth(42),
    height: responsiveWidth(42),
    borderRadius: responsiveWidth(21),
    borderWidth: 1,
  },
  badgeMidRing: {
    position: 'absolute',
    width: responsiveWidth(34),
    height: responsiveWidth(34),
    borderRadius: responsiveWidth(17),
    borderWidth: 1.5,
  },
  badgeCircle: {
    width: responsiveWidth(26),
    height: responsiveWidth(26),
    borderRadius: responsiveWidth(13),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2DD4BF',
    shadowOffset: { width: 0, height: responsiveHeight(0.5) },
    shadowOpacity: 0.4,
    shadowRadius: responsiveWidth(4),
    elevation: 10,
  },
  starDecor: {
    position: 'absolute',
    color: '#2DD4BF',
    fontSize: responsiveFontSize(2),
    opacity: 0.6,
  },
  starTopLeft:     { top: responsiveWidth(2),  left: responsiveWidth(2) },
  starTopRight:    { top: 0,                   right: responsiveWidth(4) },
  starBottomRight: { bottom: responsiveWidth(2), right: 0 },

  // ── Type name ────────────────────────────────────────────
  typeNameContainer: {
    alignItems: 'center',
    marginBottom: metrics.spacing.md,
  },
  typeName: {
    fontSize: responsiveFontSize(4),
    fontFamily: 'PlayfairDisplay-Bold',
    textAlign: 'center',
    marginBottom: metrics.spacing.xxs,
  },
  typeSubLabel: {
    ...typography.bodySmall,
    color: c.textSecondary,
    fontFamily: 'PlayfairDisplay-Italic',
    textAlign: 'center',
  },

  // ── Description card ─────────────────────────────────────
  card: {
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderRadius: metrics.radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: metrics.spacing.md,
    shadowColor: '#2DD4BF',
    shadowOffset: { width: 0, height: responsiveHeight(0.3) },
    shadowOpacity: 0.08,
    shadowRadius: responsiveWidth(3),
    elevation: 3,
  },
  cardAccentBar: {
    height: 3,
    width: '100%',
  },
  cardDescription: {
    ...typography.bodyMedium,
    color: c.text,
    lineHeight: metrics.fontSize.body * 1.65,
    padding: metrics.spacing.md,
  },

  // ── Trait pills ──────────────────────────────────────────
  pillsSection: {
    marginBottom: metrics.spacing.md,
  },
  sectionLabel: {
    ...typography.captionSmall,
    color: c.textHint,
    letterSpacing: 1.8,
    marginBottom: metrics.spacing.sm,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: metrics.spacing.sm,
  },
  pill: {
    borderWidth: 1,
    borderRadius: metrics.radius.full,
    paddingHorizontal: metrics.spacing.smMd,
    paddingVertical: metrics.spacing.xs,
  },
  pillText: {
    ...typography.labelSmall,
    letterSpacing: 0.3,
  },

  // ── Growth card ──────────────────────────────────────────
  growthCard: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: metrics.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    padding: metrics.spacing.smMd,
    marginBottom: metrics.spacing.sm,
  },
  growthIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.sm,
    marginBottom: metrics.spacing.xs,
  },
  growthIconCircle: {
    width: responsiveWidth(8),
    height: responsiveWidth(8),
    borderRadius: responsiveWidth(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  growthLabel: {
    ...typography.captionSmall,
    color: c.textHint,
    letterSpacing: 1.5,
  },
  growthText: {
    ...typography.bodySmall,
    color: c.text,
    lineHeight: metrics.fontSize.bodySm * 1.6,
    fontFamily: 'PlayfairDisplay-Italic',
  },

  // ── Key line ─────────────────────────────────────────────
  keyLineContainer: {
    paddingHorizontal: metrics.spacing.sm,
  },
  keyLine: {
    ...typography.quoteItalic,
    color: c.textSecondary,
    textAlign: 'center',
    lineHeight: metrics.fontSize.h4 * 1.5,
  },

  // ── CTAs ─────────────────────────────────────────────────
  ctaSection: {
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingTop: metrics.spacing.sm,
    gap: metrics.spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  primaryBtnTouch: {
    borderRadius: metrics.radius.full,
    backgroundColor: '#1A9B7A',
    shadowColor: '#0D5C4A',
    shadowOffset: { width: 0, height: responsiveHeight(0.8) },
    shadowOpacity: 0.4,
    shadowRadius: responsiveWidth(4),
    elevation: 12,
  },
  primaryBtn: {
    borderRadius: metrics.radius.full,
    paddingVertical: metrics.spacing.smMd,
    paddingHorizontal: metrics.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: metrics.button.height,
  },
  primaryBtnIconCircle: {
    width: responsiveWidth(9),
    height: responsiveWidth(9),
    borderRadius: responsiveWidth(4.5),
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: metrics.spacing.smMd,
  },
  primaryBtnLabel: {
    ...typography.buttonLarge,
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  ghostCta: {
    alignItems: 'center',
    paddingVertical: metrics.spacing.sm,
  },
  ghostCtaLabel: {
    ...typography.bodySmall,
    color: c.textHint,
  },
});
