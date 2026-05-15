import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { ProgressStrip } from '../components/common/ProgressStrip';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { useAppColors } from '../theme';
import { typography } from '../theme/typography';
import { metrics } from '../theme/metrics';
import { getHonestMomentCopy, getHonestMomentMeta, resolveSegment } from '../data/day1Service';
import { haptics } from '../utils/haptics';
import { useJournalStore } from '../store/useJournalStore';

import { Heart, Lightbulb, Sparkles } from 'lucide-react-native';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { ICONS } from '../assets/image/icons';
import { JarEnvelopeAnimation, JarEnvelopeHandle } from '../components/common/JarEnvelopeAnimation';
import { GradientButton } from '../components/common/GradientButton';


type Nav = StackNavigationProp<RootStackParamList, 'Day1HonestMoment'>;
type RouteProps = StackScreenProps<RootStackParamList, 'Day1HonestMoment'>['route'];

// ── Insight tip per segment ───────────────────────────────────
const SEGMENT_TIP: Record<string, string> = {
  segment_1: 'Honesty is the first act of love.',
  segment_2: 'Awareness is the beginning of change.',
  segment_3: 'Depth creates lasting connection.',
  segment_4: 'Keep going! Depth creates lasting connection.',
  segment_5: 'Turn this feeling into something they\'ll remember.',
};

// ── Headline per segment ──────────────────────────────────────
const SEGMENT_HEADLINE: Record<string, string> = {
  segment_1: 'That took courage.',
  segment_2: 'Something feels off.',
  segment_3: 'You\'re close.',
  segment_4: 'You\'re close.',
  segment_5: 'You feel it.',
};

export const Day1HonestMoment: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProps>();
  const { sliderScore } = route.params;
  const addJarMemory = useJournalStore((s) => s.addJarMemory);

  const segment = resolveSegment(sliderScore);

  const bodyText = getHonestMomentCopy(segment, sliderScore);
  const { dividerText, cta: ctaLabel, ctaSub } = getHonestMomentMeta();
  const headline = SEGMENT_HEADLINE[segment] ?? "You're here.";
  const tip = SEGMENT_TIP[segment] ?? 'Keep going.';

  // Staggered entrance animations
  const jarRef = useRef<JarEnvelopeHandle>(null);
  const scoreAnim  = useRef(new Animated.Value(0)).current;

  const cardAnim   = useRef(new Animated.Value(0)).current;
  const tipAnim    = useRef(new Animated.Value(0)).current;
  const ctaAnim    = useRef(new Animated.Value(0)).current;
  const scoreScale = useRef(new Animated.Value(0.6)).current;

  // Continuous animations
  const pulseAnim    = useRef(new Animated.Value(1)).current;
  const sparkle1Anim = useRef(new Animated.Value(0)).current;
  const sparkle2Anim = useRef(new Animated.Value(0)).current;
  const heartBeatAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    haptics.medium();
    jarRef.current?.triggerEnvelope(() => {
      addJarMemory({
        content: `Honest Moment Score: ${sliderScore}`,
        type: 'text',
        tinyCompliment: null,
        dayColor: '#2DD4BF',
      });
    });

    // Entrance sequence

    Animated.sequence([
      Animated.parallel([
        Animated.timing(scoreAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(scoreScale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
      ]),
      Animated.timing(cardAnim, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.timing(tipAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.timing(ctaAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start(() => {
      // After entrance — start continuous animations



      // Pulse on score card
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.04, duration: 1200, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        ])
      ).start();

      // Sparkle 1 — twinkle in/out with scale
      Animated.loop(
        Animated.sequence([
          Animated.delay(200),
          Animated.parallel([
            Animated.timing(sparkle1Anim, { toValue: 1, duration: 600, useNativeDriver: true }),
          ]),
          Animated.timing(sparkle1Anim, { toValue: 0.2, duration: 800, useNativeDriver: true }),
        ])
      ).start();

      // Sparkle 2 — offset timing
      Animated.loop(
        Animated.sequence([
          Animated.delay(900),
          Animated.timing(sparkle2Anim, { toValue: 1, duration: 600, useNativeDriver: true }),
          Animated.timing(sparkle2Anim, { toValue: 0.2, duration: 800, useNativeDriver: true }),
        ])
      ).start();

      // Heart badge beat
      Animated.loop(
        Animated.sequence([
          Animated.spring(heartBeatAnim, { toValue: 1.2, friction: 3, tension: 200, useNativeDriver: true }),
          Animated.spring(heartBeatAnim, { toValue: 1, friction: 5, tension: 100, useNativeDriver: true }),
          Animated.delay(1800),
        ])
      ).start();
    });
  }, []);

  const cardTranslate = cardAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 0],
  });

  return (
    <ScreenWrapper>
      <ProgressStrip currentDay={1} />

      <View style={styles.body}>

        {/* ── Jar Animation ── */}
        <Animated.View style={[styles.jarWrapper, { opacity: scoreAnim, top: responsiveHeight(-2) }]}>
          <JarEnvelopeAnimation ref={jarRef} />
        </Animated.View>

        {/* ── YOUR SCORE label ── */}

        <Animated.View style={[styles.scoreLabelRow, { opacity: scoreAnim }]}>
          <Text style={styles.scoreLabelPlus}>+</Text>
          <Text style={styles.scoreLabel}>YOUR SCORE</Text>
          <Text style={styles.scoreLabelPlus}>+</Text>
        </Animated.View>

        {/* ── Big score number + heart badge ── */}
        <Animated.View
          style={[
            styles.scoreContainer,
            {
              opacity: scoreAnim,
              transform: [
                { scale: scoreScale },
              ],
            },
          ]}
        >
          {/* Pulse wrapper on the card */}
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            {/* White border wrapper */}
            <View style={styles.scoreCardBorder}>
              {/* Gradient card */}
              <LinearGradient
                colors={['#6EE87A', '#2DD4BF', '#1E90FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.6, y: 1 }}
                style={styles.scoreGradientMask}
              >
                <Text style={styles.scoreNumber}>{sliderScore}</Text>
              </LinearGradient>
            </View>
          </Animated.View>

          {/* Heart badge — beats */}
          <Animated.View style={[styles.heartBadge, { transform: [{ scale: heartBeatAnim }] }]}>
            <LinearGradient
              colors={['#6EE87A', '#2DD4BF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heartBadgeGradient}
            >
              <Heart size={metrics.iconSize.sm} color="#FFFFFF" fill="#FFFFFF" />
            </LinearGradient>
          </Animated.View>

          {/* Sparkle 1 — top right, twinkles */}
          <Animated.Text
            style={[
              styles.sparkle,
              styles.sparkleTopRight,
              {
                opacity: sparkle1Anim,
                transform: [{ scale: sparkle1Anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1.3] }) }],
              },
            ]}
          >✦</Animated.Text>

          {/* Sparkle 2 — bottom left, offset twinkle */}
          <Animated.Text
            style={[
              styles.sparkle,
              styles.sparkleBottomLeft,
              {
                opacity: sparkle2Anim,
                transform: [{ scale: sparkle2Anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1.2] }) }],
              },
            ]}
          >✦</Animated.Text>
        </Animated.View>

        {/* ── Copy card ── */}
        <Animated.View
          style={[
            styles.card,
            {
              opacity: cardAnim,
              transform: [{ translateY: cardTranslate }],
            },
          ]}
        >
          {/* Headline row */}
          <View style={styles.cardHeadlineRow}>
            <Text style={styles.cardHeadlineScore}>{sliderScore}. </Text>
            <Text style={styles.cardHeadline}>{headline} </Text>
            <Heart
              size={metrics.iconSize.sm}
              color={colors.textSecondary}
              strokeWidth={1.5}
            />
          </View>



          {/* Body text — full copy */}
          <Text style={styles.cardBody}>{bodyText}</Text>

          {/* Divider text */}
          <Text style={styles.cardDivider}>{dividerText}</Text>

          {/* Decorative leaves image — bottom right */}
          <Image
            source={ICONS.leaves}
            style={styles.leafDecor}
            resizeMode="contain"
          />
        </Animated.View>

        {/* ── Tip row ── */}
        <Animated.View style={[styles.tipRow, { opacity: tipAnim }]}>
          <View style={styles.tipIconCircle}>
            <Lightbulb size={metrics.iconSize.sm} color={colors.primary} strokeWidth={1.5} />
          </View>
          <View style={styles.tipTextCol}>
            <Text style={styles.tipTitle}>Keep going!</Text>
            <Text style={styles.tipBody}>{tip}</Text>
          </View>
        </Animated.View>

      </View>

      {/* ── CTA button ── */}
      <Animated.View style={[styles.ctaWrapper, { opacity: ctaAnim }]}>
        <GradientButton
          text={ctaLabel}
          subtitle={ctaSub}
          icon={<Sparkles size={metrics.iconSize.sm} color="#FFFFFF" strokeWidth={2} />}
          onPress={() => {
            haptics.medium();
            navigation.navigate('Day1Quiz', { sliderScore });
          }}
          showArrow={true}
          fullWidth={true}
          gradientColors={['#6EE87A', '#2DD4BF', '#1E90FF']}
        />
      </Animated.View>
    </ScreenWrapper>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingTop: metrics.spacing.lg,
    position: 'relative',
  },
  jarWrapper: {
    position: 'absolute',
    top: -metrics.spacing.sm,
    right: metrics.layout.screenPaddingHz - 10,
    zIndex: 10,
    transform: [{ scale: 0.55 }],
  },




  // ── Score label ───────────────────────────────────────────
  scoreLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    gap: metrics.spacing.sm,
    marginBottom: metrics.spacing.sm,
  },
  scoreLabelPlus: {
    ...typography.labelMedium,
    color: c.primary,
  },
  scoreLabel: {
    ...typography.labelMedium,
    color: c.primary,
    letterSpacing: 2.5,
  },

  // ── Score number ──────────────────────────────────────────
  scoreContainer: {
    position: 'relative',
    marginBottom: metrics.spacing.lg,
    alignSelf: 'center',
    marginTop:responsiveWidth(3)
  },
  // White border wrapper — creates the white border effect
  scoreCardBorder: {
    padding: 3,
    borderRadius: metrics.radius.xl + 3,
    backgroundColor: '#FFFFFF',
    shadowColor: '#2DD4BF',
    shadowOffset: { width: 0, height: responsiveHeight(0.5) },
    shadowOpacity: 0.25,
    shadowRadius: responsiveWidth(4),
    elevation: 8,
  },
  scoreGradientMask: {
    width: responsiveWidth(30),
    height: responsiveWidth(36),
    borderRadius: metrics.radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  scoreNumber: {
    fontSize: responsiveFontSize(12),
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#FFFFFF',
    lineHeight: responsiveFontSize(16),
    includeFontPadding: false,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },

  heartBadge: {
    position: 'absolute',
    bottom: -responsiveWidth(2),
    right: -responsiveWidth(2),
    shadowColor: '#2DD4BF',
    shadowOffset: { width: 0, height: responsiveHeight(0.3) },
    shadowOpacity: 0.4,
    shadowRadius: responsiveWidth(2),
    elevation: 6,
  },
  heartBadgeGradient: {
    width: responsiveWidth(13),
    height: responsiveWidth(13),
    borderRadius: responsiveWidth(6.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  sparkle: {
    position: 'absolute',
    color: '#2DD4BF',
    fontSize: responsiveFontSize(2.5),
    opacity: 0.7,
  },
  sparkleTopRight: {
    top: -responsiveHeight(1),
    right: -responsiveWidth(8),
  },
  sparkleBottomLeft: {
    bottom: responsiveHeight(2),
    left: -responsiveWidth(5),
  },

  // ── Copy card ─────────────────────────────────────────────
  card: {
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: metrics.radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.95)',
    padding: metrics.spacing.md,
    marginBottom: metrics.spacing.md,
    shadowColor: '#2DD4BF',
    shadowOffset: { width: 0, height: responsiveHeight(0.3) },
    shadowOpacity: 0.08,
    shadowRadius: responsiveWidth(3),
    elevation: 2,
    overflow: 'hidden',
    minHeight: responsiveHeight(18),
  },
  cardHeadlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: metrics.spacing.xs,
  },
  cardHeadlineScore: {
    ...typography.displaySmall,
    color: c.primary,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  cardHeadline: {
    ...typography.displaySmall,
    color: c.text,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  cardHeadlineHeart: {
    marginLeft: metrics.spacing.xs,
  },
  cardUnderline: {
    width: responsiveWidth(18),
    height: 2.5,
    borderRadius: 2,
    backgroundColor: c.primary,
    opacity: 0.45,
    marginBottom: metrics.spacing.sm,
  },
  cardBody: {
    ...typography.bodySmall,
    color: c.textSecondary,
    lineHeight: metrics.fontSize.bodySm * 1.7,
    maxWidth: '75%',
  },
  cardDivider: {
    ...typography.caption,
    color: c.textHint,
    fontFamily: 'PlayfairDisplay-Italic',
    marginTop: metrics.spacing.sm,
    lineHeight: metrics.fontSize.caption * 1.6,
  },
  leafDecor: {
    position: 'absolute',
    bottom: metrics.spacing.xs,
    right: metrics.spacing.sm,
    width: responsiveWidth(24),
    height: responsiveWidth(24),
    // opacity: 0.35,
  },

  // ── Tip row ───────────────────────────────────────────────
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.smMd,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: metrics.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.85)',
    padding: metrics.spacing.smMd,
  },
  tipIconCircle: {
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    borderRadius: responsiveWidth(5),
    backgroundColor: 'rgba(45,95,93,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(45,95,93,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  tipTextCol: {
    flex: 1,
    gap: metrics.spacing.xxs,
  },
  tipTitle: {
    ...typography.bodyBold,
    color: c.text,
    fontSize: metrics.fontSize.body,
  },
  tipBody: {
    ...typography.bodySmall,
    color: c.textSecondary,
  },

  // ── CTA ───────────────────────────────────────────────────
  ctaWrapper: {
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingBottom: responsiveHeight(4),
  },
});
