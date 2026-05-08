import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, PanResponder,
  TouchableOpacity, Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { ProgressStrip } from '../components/common/ProgressStrip';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { useAppColors } from '../theme';
import { fonts, typography } from '../theme/typography';
import { metrics } from '../theme/metrics';
import { haptics } from '../utils/haptics';
import { useDayStore } from '../store/useDayStore';
import { resolveSegment } from '../data/quizData';
import { Heart, Sparkles } from 'lucide-react-native';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
type Nav = StackNavigationProp<RootStackParamList, 'Day1Slider'>;

const { width } = Dimensions.get('window');
const TRACK_WIDTH = width - metrics.layout.screenPaddingHz * 2;

// ── Emoji + label per score ───────────────────────────────────
const SCORE_META: Record<number, { emoji: string; label: string }> = {
  1:  { emoji: '😞', label: 'Very distant' },
  2:  { emoji: '😔', label: 'Disconnected' },
  3:  { emoji: '😕', label: 'A little off' },
  4:  { emoji: '😐', label: 'Neutral' },
  5:  { emoji: '🙂', label: 'Moderately' },
  6:  { emoji: '😊', label: 'Pretty good' },
  7:  { emoji: '😄', label: 'Connected' },
  8:  { emoji: '😁', label: 'Really close' },
  9:  { emoji: '🥰', label: 'Very connected' },
  10: { emoji: '😍', label: 'Deeply bonded' },
};

// ── Insight card per score range ──────────────────────────────
function getInsight(score: number): string {
  if (score <= 2) return "It's okay to feel distant. Showing up is the first step.";
  if (score <= 4) return "Something feels off — and you know it. That awareness matters.";
  if (score <= 6) return "You're building a beautiful connection.\nThere's a solid foundation of trust and comfort. Keep showing up and deepening the little moments together.";
  if (score <= 8) return "You're close. Something good is already here. Let's make it deeper.";
  return "You feel it. Now let's make sure they feel it too.";
}

// ── Rainbow track gradient stops ─────────────────────────────
const TRACK_COLORS = ['#FF4444', '#FF8C00', '#FFD700', '#7CFC00', '#2DD4BF', '#1E90FF'];

export const Day1ConnectionSlider: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const setDay1Slider = useDayStore((s) => s.setDay1Slider);
  const [score, setScore] = useState(5);
  const thumbX = useRef(new Animated.Value(((5 - 1) / 9) * TRACK_WIDTH)).current;
  const scoreAnim = useRef(new Animated.Value(1)).current;

  const handleScoreChange = (newScore: number) => {
    if (newScore === score) return;
    setScore(newScore);
    Animated.spring(thumbX, {
      toValue: ((newScore - 1) / 9) * TRACK_WIDTH,
      friction: 8, tension: 120, useNativeDriver: false,
    }).start();
    // Bounce the score number
    Animated.sequence([
      Animated.timing(scoreAnim, { toValue: 1.2, duration: 80, useNativeDriver: true }),
      Animated.spring(scoreAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
    haptics.light();
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gs) => {
      const rawX = gs.moveX - metrics.layout.screenPaddingHz;
      const clamped = Math.max(0, Math.min(TRACK_WIDTH, rawX));
      const newScore = Math.round((clamped / TRACK_WIDTH) * 9) + 1;
      handleScoreChange(newScore);
    },
  });

  const handleNext = () => {
    haptics.medium();
    const segment = resolveSegment(score);
    setDay1Slider(score, segment);
    navigation.navigate('Day1HonestMoment', { sliderScore: score });
  };

  const meta = SCORE_META[score];
  const insight = getInsight(score);
  const thumbPercent = ((score - 1) / 9) * 100;

  return (
    <ScreenWrapper>
      <ProgressStrip currentDay={1} />

      <View style={styles.body}>
        {/* ── Top row: eyebrow pill + sparkle icon ── */}
        <View style={styles.topRow}>
          <View style={styles.eyebrowPill}>
            <Sparkles size={metrics.iconSize.xs} color={colors.primary} strokeWidth={2} />
            <Text style={styles.eyebrow}>DAY 1 · THE SPARK CHECK</Text>
          </View>
          <View style={styles.sparkleCircle}>
            <Sparkles size={metrics.iconSize.sm} color={colors.primary} strokeWidth={1.5} />
          </View>
        </View>

        {/* ── Question ── */}
        <Text style={styles.question}>
          On a scale of 1–10,{'\n'}how connected do you{'\n'}feel to your partner{'\n'}
          <Text style={styles.questionTeal}>right now?</Text>
          {'  '}
          <Heart size={metrics.iconSize.sm} color={colors.primary} strokeWidth={1.5} />
        </Text>

        <Text style={styles.subtext}>No right answer · Only your truth</Text>

        {/* ── Score display with side emojis ── */}
        <View style={styles.scoreRow}>
          {/* Left: score 1 */}
          <View style={styles.sideScore}>
            <Text style={styles.sideNumber}>1</Text>
            <Text style={styles.sideEmoji}>{SCORE_META[1].emoji}</Text>
          </View>

          {/* Center: big score circle */}
          <View style={styles.scoreCircleOuter}>
            <View style={styles.scoreCircle}>
              <Animated.Text style={[styles.scoreNumber, { transform: [{ scale: scoreAnim }] }]}>
                {score}
              </Animated.Text>
              <Text style={styles.scoreEmoji}>{meta.emoji}</Text>
              <Text style={styles.scoreLabel}>{meta.label}</Text>
            </View>
          </View>

          {/* Right: score 10 */}
          <View style={styles.sideScore}>
            <Text style={styles.sideNumber}>10</Text>
            <Text style={styles.sideEmoji}>{SCORE_META[10].emoji}</Text>
          </View>
        </View>

        {/* ── Rainbow slider track ── */}
        <View style={styles.trackWrapper} {...panResponder.panHandlers}>
          <LinearGradient
            colors={TRACK_COLORS}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.track}
          />
          <Animated.View style={[styles.thumb, { left: thumbX }]}>
            <View style={styles.thumbInner} />
          </Animated.View>
        </View>

        <View style={styles.scaleLabels}>
          <Text style={styles.scaleEnd}>1</Text>
          <Text style={styles.scaleEnd}>10</Text>
        </View>

        {/* ── Insight card ── */}
        <View style={styles.insightCard}>
          <View style={styles.insightIcon}>
            <Heart size={metrics.iconSize.sm} color={colors.primary} fill={colors.primary} />
          </View>
          <Text style={styles.insightText}>{insight}</Text>
        </View>
      </View>

      {/* ── CTA button ── */}
      <View style={[styles.ctaWrapper, { paddingBottom: responsiveHeight(3) }]}>
        <TouchableOpacity
          style={styles.ctaTouch}
          activeOpacity={0.88}
          onPress={handleNext}
        >
          <LinearGradient
            colors={['#6EE87A', '#2DD4BF', '#1E90FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.cta}
          >
            <View style={styles.ctaLeft}>
              <Sparkles size={metrics.iconSize.sm} color="#FFFFFF" strokeWidth={2} />
            </View>
            <Text style={styles.ctaLabel}>That's my number</Text>
            <Text style={styles.ctaArrow}>→</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingTop: metrics.spacing.md,
  },

  // ── Top row ──────────────────────────────────────────────
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: metrics.spacing.md,
  },
  eyebrowPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: metrics.radius.full,
    paddingHorizontal: metrics.spacing.smMd,
    paddingVertical: metrics.spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(45,95,93,0.15)',
  },
  eyebrow: {
    ...typography.captionSmall,
    color: c.primary,
    letterSpacing: 1.5,
  },
  sparkleCircle: {
    width: responsiveWidth(11),
    height: responsiveWidth(11),
    borderRadius: responsiveWidth(5.5),
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(45,95,93,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Question ─────────────────────────────────────────────
  question: {
    ...typography.displayMedium,
    color: c.text,
    fontFamily: 'PlayfairDisplay-Bold',
    lineHeight: metrics.fontSize.h2 * 1.35,
    marginBottom: metrics.spacing.xs,
  },
  questionTeal: {
    color: c.primary,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  subtext: {
    ...typography.bodySmall,
    color: c.textSecondary,
    marginBottom: metrics.spacing.lg,
  },

  // ── Score row ────────────────────────────────────────────
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: metrics.spacing.md,
  },
  sideScore: {
    alignItems: 'center',
    gap: metrics.spacing.xs,
    width: responsiveWidth(12),
  },
  sideNumber: {
    ...typography.bodyMedium,
    color: c.textSecondary,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  sideEmoji: {
    fontSize: responsiveFontSize(3.5),
    lineHeight: responsiveFontSize(4),
  },

  // Center score circle
  scoreCircleOuter: {
    width: responsiveWidth(38),
    height: responsiveWidth(38),
    borderRadius: responsiveWidth(19),
    backgroundColor: 'rgba(45,212,191,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(45,212,191,0.2)',
  },
  scoreCircle: {
    width: responsiveWidth(34),
    height: responsiveWidth(34),
    borderRadius: responsiveWidth(16),
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2DD4BF',
    shadowOffset: { width: 0, height: responsiveHeight(0.5) },
    shadowOpacity: 0.2,
    shadowRadius: responsiveWidth(3),
    elevation: 4,
    paddingVertical: metrics.spacing.xs,
  },
  scoreNumber: {
    fontSize: responsiveFontSize(5),
    color: c.primary,
    fontFamily: 'PlayfairDisplay-Bold',
    lineHeight: responsiveFontSize(7.5),
    includeFontPadding: false,
  },
  scoreEmoji: {
    fontSize: responsiveFontSize(3),
    lineHeight: responsiveFontSize(4),
    includeFontPadding: false,
  },
  scoreLabel: {
    fontSize:responsiveFontSize(1.2),
    fontFamily:fonts.dmSansBold,
    color: c.primary,
    marginTop: metrics.spacing.xxs,
    textAlign: 'center',
  },

  // ── Slider ───────────────────────────────────────────────
  trackWrapper: {
    height: responsiveHeight(5),
    justifyContent: 'center',
    marginBottom: metrics.spacing.xs,
  },
  track: {
    height: responsiveHeight(0.7),
    borderRadius: metrics.radius.full,
  },
  thumb: {
    position: 'absolute',
    width: responsiveWidth(7),
    height: responsiveWidth(7),
    borderRadius: responsiveWidth(3.5),
    backgroundColor: '#FFFFFF',
    top: (responsiveHeight(5) - responsiveWidth(7)) / 2,
    marginLeft: -responsiveWidth(3.5),
    shadowColor: '#2DD4BF',
    shadowOffset: { width: 0, height: responsiveHeight(0.3) },
    shadowOpacity: 0.4,
    shadowRadius: responsiveWidth(2),
    elevation: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#2DD4BF',
  },
  thumbInner: {
    width: responsiveWidth(3),
    height: responsiveWidth(3),
    borderRadius: responsiveWidth(1.5),
    backgroundColor: '#2DD4BF',
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: metrics.spacing.md,
  },
  scaleEnd: {
    ...typography.caption,
    color: c.textHint,
  },

  // ── Insight card ─────────────────────────────────────────
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: metrics.spacing.smMd,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: metrics.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    padding: metrics.spacing.smMd,
  },
  insightIcon: {
    width: responsiveWidth(9),
    height: responsiveWidth(9),
    borderRadius: responsiveWidth(4.5),
    backgroundColor: 'rgba(45,95,93,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  insightText: {
    ...typography.bodySmall,
    color: c.text,
    flex: 1,
    lineHeight: metrics.fontSize.bodySm * 1.5,
  },

  // ── CTA ──────────────────────────────────────────────────
  ctaWrapper: {
    paddingHorizontal: metrics.layout.screenPaddingHz,
  },
  ctaTouch: {
    borderRadius: metrics.radius.full,
    backgroundColor: '#1A9B7A',
    shadowColor: '#0D5C4A',
    shadowOffset: { width: 0, height: responsiveHeight(1.0) },
    shadowOpacity: 0.5,
    shadowRadius: responsiveWidth(5),
    elevation: 14,
  },
  cta: {
    borderRadius: metrics.radius.full,
    paddingVertical: metrics.spacing.smMd,
    paddingHorizontal: metrics.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: metrics.button.height,
  },
  ctaLeft: {
    width: responsiveWidth(9),
    height: responsiveWidth(9),
    borderRadius: responsiveWidth(4.5),
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: metrics.spacing.smMd,
  },
  ctaLabel: {
    ...typography.buttonLarge,
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  ctaArrow: {
    ...typography.buttonLarge,
    color: '#FFFFFF',
  },
});
