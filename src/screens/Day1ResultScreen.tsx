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
import { useJournalStore } from '../store/useJournalStore';

import { haptics } from '../utils/haptics';
import { LOTTIE } from '../assets/lottie';
import { JarEnvelopeAnimation, JarEnvelopeHandle } from '../components/common/JarEnvelopeAnimation';
import { GradientButton } from '../components/common/GradientButton';

import {
  Award, Sparkles, Heart, Star, ChevronRight, Flame,
  Droplets, Waves,
} from 'lucide-react-native';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

type Nav = StackNavigationProp<RootStackParamList, 'Day1Result'>;

const TYPE_ICON: Record<string, any> = {
  steady_flame:   Flame,
  electric_spark: Sparkles,
  deep_current:   Droplets,
  shifting_tide:  Waves,
};

export const Day1ResultScreen: React.FC = () => {
  const colors = useAppColors();
  const day1 = useDayStore((s) => s.day1);
  const recordActivity = useStreakStore((s) => s.recordActivity);
  const addJarMemory = useJournalStore((s) => s.addJarMemory);

  const personality = getPersonalityType(
    (day1.personalityType as PersonalityTypeId) ?? 'shifting_tide'
  );

  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  const TypeIcon = TYPE_ICON[personality.id] ?? Star;

  const jarRef = useRef<JarEnvelopeHandle>(null);
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
    lottieRef.current?.play();
    jarRef.current?.triggerEnvelope(() => {
      addJarMemory({
        content: `Relationship Type: ${personality.name}`,
        type: 'text',
        tinyCompliment: null,
        dayColor: colors.primary,
      });
    });

    Animated.sequence([
      Animated.timing(headerAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(badgeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(badgeScale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(cardAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(cardSlide, { toValue: 0, friction: 8, tension: 80, useNativeDriver: true }),
      ]),
      Animated.timing(pillsAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.timing(growthAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.timing(ctaAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.06, duration: 1400, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1400, useNativeDriver: true }),
        ])
      ).start();
    });
  }, []);

  const handleVibeCheck = () => {
    haptics.medium();
    navigation.navigate('Day1VibeCheck');
  };

  return (
    <ScreenWrapper>
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
        <Animated.View style={[styles.jarWrapper, { opacity: headerAnim, top: responsiveHeight(-2) }]}>
          <JarEnvelopeAnimation ref={jarRef} initialCount={1} />
        </Animated.View>

        <Animated.View style={[styles.header, { opacity: headerAnim }]}>
          <View style={styles.achievementBadgeRow}>
            <Award size={metrics.iconSize.xs} color={colors.primary} strokeWidth={2} />
            <Text style={[styles.achievementLabel, { color: colors.primary }]}>
              DAY 1 COMPLETE
            </Text>
            <Award size={metrics.iconSize.xs} color={colors.primary} strokeWidth={2} />
          </View>
          <Text style={styles.headerTitle}>Your relationship type is</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.badgeContainer,
            {
              opacity: badgeAnim,
              transform: [{ scale: Animated.multiply(badgeScale, pulseAnim) }],
            },
          ]}
        >
          <View style={[styles.badgeGlowRing, { borderColor: 'rgba(45,212,191,0.15)' }]} />
          <View style={[styles.badgeMidRing, { borderColor: 'rgba(45,212,191,0.3)' }]} />
          <LinearGradient
            colors={['#6EE87A', '#2DD4BF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.badgeCircle}
          >
            <TypeIcon size={responsiveWidth(10)} color="#FFFFFF" strokeWidth={1.5} />
          </LinearGradient>
        </Animated.View>

        <Animated.View style={[styles.typeNameContainer, { opacity: badgeAnim }]}>
          <Text style={[styles.typeName, { color: colors.primary }]}>
            {personality.name}
          </Text>
          <Text style={styles.typeSubLabel}>{personality.subLabel}</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.card,
            {
              opacity: cardAnim,
              transform: [{ translateY: cardSlide }],
              borderColor: 'rgba(45,212,191,0.3)',
            },
          ]}
        >
          <LinearGradient
            colors={['#6EE87A', '#2DD4BF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.cardAccentBar}
          />
          <Text style={styles.cardDescription}>{personality.description}</Text>
        </Animated.View>

        <Animated.View style={[styles.pillsSection, { opacity: pillsAnim }]}>
          <Text style={styles.sectionLabel}>YOUR TRAITS</Text>
          <View style={styles.pillRow}>
            {personality.traits.map((trait, i) => (
              <LinearGradient
                key={i}
                colors={['rgba(110,232,122,0.15)', 'rgba(45,212,191,0.15)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.pill, { borderColor: 'rgba(45,212,191,0.5)' }]}
              >
                <Text style={[styles.pillText, { color: colors.primary }]}>{trait}</Text>
              </LinearGradient>
            ))}
          </View>
        </Animated.View>

        <Animated.View style={[styles.growthCard, { opacity: growthAnim }]}>
          <View style={styles.growthIconRow}>
            <View style={[styles.growthIconCircle, { backgroundColor: 'rgba(45,212,191,0.15)' }]}>
              <Heart size={metrics.iconSize.sm} color={colors.primary} strokeWidth={1.5} />
            </View>
            <Text style={styles.growthLabel}>ONE INVITATION FOR YOU</Text>
          </View>
          <Text style={styles.growthText}>{personality.growth}</Text>
        </Animated.View>

        <View style={{ height: responsiveHeight(12) }} />
      </ScrollView>

      <Animated.View
        style={[
          styles.ctaSection,
          {
            opacity: ctaAnim,
            paddingBottom: responsiveHeight(2),
          },
        ]}
      >
        <GradientButton
          text="Vibe Check"
          onPress={handleVibeCheck}
          showArrow={true}
          fullWidth={true}
          gradientColors={colors.gradientBtn}
          icon={<Sparkles size={metrics.iconSize.sm} color="#FFFFFF" strokeWidth={2} />}
        />
      </Animated.View>
    </ScreenWrapper>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingBottom: metrics.spacing.sm,
    position: 'relative',
  },
  jarWrapper: {
    position: 'absolute',
    right: metrics.layout.screenPaddingHz - 15,
    top:0,
    zIndex: 10,
    transform: [{ scale: 0.55 }],
  },

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
  header: {
    alignItems: 'center',
    marginBottom: responsiveHeight(5),
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
  ctaSection: {
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingTop: metrics.spacing.sm,
    gap: metrics.spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
});
