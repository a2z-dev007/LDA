import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
  ImageBackground, Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { useAppColors } from '../theme';
import { typography } from '../theme/typography';
import { metrics } from '../theme/metrics';
import { sparkQuizQuestions } from '../data/quizData';
import { calculatePersonalityType } from '../data/personalityTypes';
import { useDayStore } from '../store/useDayStore';
import { haptics } from '../utils/haptics';
import { IMAGE } from '../assets/image/bg-images';
import { ICONS } from '../assets/image/icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Heart, Search, Shield, Flame, Anchor, HandHeart,
  Compass, MessageCircle, Clock, Leaf, ChevronRight, ArrowLeft,
} from 'lucide-react-native';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {
  JarEnvelopeAnimation,
  JarEnvelopeHandle,
} from '../components/common/JarEnvelopeAnimation';

type Nav = StackNavigationProp<RootStackParamList, 'Day1Quiz'>;
type RouteProps = StackScreenProps<RootStackParamList, 'Day1Quiz'>['route'];

// ── Icon + teal keyword per question ─────────────────────────
const QUESTION_META = {
  q1: {
    badgeIcon: Heart,
    optionAIcon: MessageCircle,
    optionBIcon: Clock,
    tealWord: 'disconnected',
  },
  q2: {
    badgeIcon: Search,
    optionAIcon: Heart,
    optionBIcon: Clock,
    tealWord: 'truly seen',
  },
  q3: {
    badgeIcon: Shield,
    optionAIcon: Shield,
    optionBIcon: Leaf,
    tealWord: 'In conflict,',
  },
  q4: {
    badgeIcon: Heart,
    optionAIcon: MessageCircle,
    optionBIcon: HandHeart,
    tealWord: 'expressing love',
  },
  q5: {
    badgeIcon: Flame,
    optionAIcon: Anchor,
    optionBIcon: Compass,
    tealWord: 'right now',
  },
  q6: {
    badgeIcon: HandHeart,
    optionAIcon: Heart,
    optionBIcon: Leaf,
    tealWord: 'struggling',
  },
  q7: {
    badgeIcon: Compass,
    optionAIcon: Compass,
    optionBIcon: Leaf,
    tealWord: 'future',
  },
};

// ── Highlight teal keyword in prompt ─────────────────────────
function renderPrompt(
  prompt: string,
  tealWord: string,
  questionStyle: any,
  tealStyle: any,
) {
  const idx = prompt.toLowerCase().indexOf(tealWord.toLowerCase());
  if (idx === -1) return <Text style={questionStyle}>{prompt}</Text>;

  const before = prompt.slice(0, idx);
  const match  = prompt.slice(idx, idx + tealWord.length);
  const after  = prompt.slice(idx + tealWord.length);

  return (
    <Text style={questionStyle}>
      {before}
      <Text style={tealStyle}>{match}</Text>
      {after}
    </Text>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────────────────────
export const Day1SparkQuiz: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProps>();
  const { sliderScore } = route.params;
  const completeDay1 = useDayStore((s) => s.completeDay1);
  const insets = useSafeAreaInsets();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B'>>({});
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
  const jarRef = useRef<JarEnvelopeHandle>(null);

  const fadeIn    = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const unchosen  = useRef(new Animated.Value(1)).current;

  // Per-option press animations
  const scaleA = useRef(new Animated.Value(1)).current;
  const scaleB = useRef(new Animated.Value(1)).current;

  const question = sparkQuizQuestions[currentIndex];
  const total    = sparkQuizQuestions.length;
  const meta     = QUESTION_META[question.id as keyof typeof QUESTION_META];
  const BadgeIcon   = meta.badgeIcon;
  const OptionAIcon = meta.optionAIcon;
  const OptionBIcon = meta.optionBIcon;

  useEffect(() => {
    const existing = answers[question.id] ?? null;
    setSelectedOption(existing);
    unchosen.setValue(existing ? 0.35 : 1);
    // Reset scales
    scaleA.setValue(1);
    scaleB.setValue(1);
    fadeIn.setValue(0);
    slideAnim.setValue(30);
    Animated.parallel([
      Animated.timing(fadeIn,    { toValue: 1, duration: 380, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 100, useNativeDriver: true }),
    ]).start();
  }, [currentIndex]);

  const animateOptionPress = (scale: Animated.Value, callback: () => void) => {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 0.96,
        friction: 4,
        tension: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 200,
        useNativeDriver: true,
      }),
    ]).start();
    // Small delay so the press animation is visible before advancing
    setTimeout(callback, 120);
  };

  const handleSelect = (value: 'A' | 'B') => {
    haptics.light();
    const scale = value === 'A' ? scaleA : scaleB;

    animateOptionPress(scale, () => {
      setSelectedOption(value);
      Animated.timing(unchosen, { toValue: 0.35, duration: 200, useNativeDriver: true }).start();

      const newAnswers = { ...answers, [question.id]: value };
      setAnswers(newAnswers);

      jarRef.current?.triggerEnvelope(() => {
        if (currentIndex < total - 1) {
          setCurrentIndex((i) => i + 1);
        } else {
          const personality = calculatePersonalityType(newAnswers);
          completeDay1(newAnswers, personality.id);
          navigation.replace('Day1Result');
        }
      });
    });
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      haptics.light();
      Animated.parallel([
        Animated.timing(fadeIn,    { toValue: 0, duration: 180, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: -30, duration: 180, useNativeDriver: true }),
      ]).start(() => {
        setCurrentIndex((i) => i - 1);
      });
    }
  };

  return (
    <ImageBackground
      source={IMAGE.greenBg2}
      style={styles.root}
      resizeMode="cover"
    >
      {/* Jar animation */}
      <JarEnvelopeAnimation ref={jarRef} />

      {/* Main content — scrollable area with safe area top */}
      <Animated.View
        style={[
          styles.body,
          {
            opacity: fadeIn,
            transform: [{ translateY: slideAnim }],
            paddingTop: Math.max(insets.top + responsiveHeight(2), responsiveHeight(6)),
          },
        ]}
      >
        {/* ── Counter + back button ── */}
        <View style={styles.topRow}>
          {currentIndex > 0 ? (
            <TouchableOpacity
              onPress={handleBack}
              activeOpacity={0.7}
              style={styles.backBtn}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <View style={styles.backIconCircle}>
                <ArrowLeft size={metrics.iconSize.sm} color={colors.primary} strokeWidth={2} />
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.backBtnPlaceholder} />
          )}
          <Text style={styles.counter}>{currentIndex + 1} of {total}</Text>
        </View>

        {/* ── Mood badge with icon ── */}
        <View style={styles.moodBadge}>
          <BadgeIcon size={metrics.iconSize.xs} color={colors.primary} strokeWidth={2} />
          <Text style={styles.moodBadgeText}>{question.moodBadge}</Text>
        </View>

        {/* ── Question with teal keyword + heart ── */}
        <View style={styles.questionRow}>
          {renderPrompt(question.prompt, meta.tealWord, styles.question, styles.questionTeal)}
          <Heart
            size={metrics.iconSize.sm}
            color={colors.primary}
            strokeWidth={1.5}
            style={styles.questionHeart}
          />
        </View>

        {/* ── Tap hint ── */}
        <View style={styles.hintRow}>
          <Text style={styles.hintArrow}>›</Text>
          <Text style={styles.hintText}>Tap to choose</Text>
          <Text style={styles.hintArrow}>‹</Text>
        </View>

        {/* ── Options ── */}
        <View style={styles.options}>
          {/* Option A */}
          <Animated.View style={[
            { opacity: selectedOption === 'B' ? unchosen : 1 },
            { transform: [{ scale: scaleA }] },
          ]}>
            <TouchableOpacity
              style={[styles.option, selectedOption === 'A' && styles.optionSelected]}
              activeOpacity={1}
              onPress={() => handleSelect('A')}
            >
              <LinearGradient
                colors={selectedOption === 'A'
                  ? ['#6EE87A', '#2DD4BF', '#1E90FF']
                  : ['#A8D8D0', '#8EC8C0', '#7AB8C8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.optionIconCircle}
              >
                <OptionAIcon size={metrics.iconSize.sm} color="#FFFFFF" strokeWidth={2} />
              </LinearGradient>
              <Text style={[styles.optionText, selectedOption === 'A' && styles.optionTextSelected]}>
                {question.optionA.label}
              </Text>
              <ChevronRight size={metrics.iconSize.sm} color={selectedOption === 'A' ? colors.primary : colors.textHint} strokeWidth={1.5} />
            </TouchableOpacity>
          </Animated.View>

          {/* Or divider */}
          <View style={styles.orDivider}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.orLine} />
          </View>

          {/* Option B */}
          <Animated.View style={[
            { opacity: selectedOption === 'A' ? unchosen : 1 },
            { transform: [{ scale: scaleB }] },
          ]}>
            <TouchableOpacity
              style={[styles.option, selectedOption === 'B' && styles.optionSelected]}
              activeOpacity={1}
              onPress={() => handleSelect('B')}
            >
              <LinearGradient
                colors={selectedOption === 'B'
                  ? ['#6EE87A', '#2DD4BF', '#1E90FF']
                  : ['#A8D8D0', '#8EC8C0', '#7AB8C8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.optionIconCircle}
              >
                <OptionBIcon size={metrics.iconSize.sm} color="#FFFFFF" strokeWidth={2} />
              </LinearGradient>
              <Text style={[styles.optionText, selectedOption === 'B' && styles.optionTextSelected]}>
                {question.optionB.label}
              </Text>
              <ChevronRight size={metrics.iconSize.sm} color={selectedOption === 'B' ? colors.primary : colors.textHint} strokeWidth={1.5} />
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* ── Decorative sparkles + leaves ── */}
        <View style={styles.decorContainer} pointerEvents="none">
          <Text style={styles.sparkle1}>✦</Text>
          <Text style={styles.sparkle2}>✦</Text>
          <Image source={ICONS.leaves} style={styles.leavesDecor} resizeMode="contain" />
        </View>
      </Animated.View>

      {/* ── Progress dots — pinned at bottom ── */}
      <View style={[styles.dotsRow, { paddingBottom: Math.max(insets.bottom, responsiveHeight(12)) }]}>
        {Array.from({ length: total }, (_, i) => (
          i <= currentIndex ? (
            <LinearGradient
              key={i}
              colors={['#6EE87A', '#2DD4BF', '#1E90FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.dot, styles.dotActive]}
            />
          ) : (
            <View key={i} style={[styles.dot, styles.dotInactive]} />
          )
        ))}
      </View>
    </ImageBackground>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  root: { flex: 1 },

  body: {
    flex: 1,
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingBottom: responsiveHeight(8),
  },

  // ── Top row (counter + back) ──────────────────────────────
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: metrics.spacing.sm,
  },
  backBtn: {
    padding: metrics.spacing.xs,
  },
  backIconCircle: {
    width: responsiveWidth(9),
    height: responsiveWidth(9),
    borderRadius: responsiveWidth(4.5),
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnPlaceholder: {
    width: responsiveWidth(9),
    height: responsiveWidth(9),
  },

  // ── Counter ───────────────────────────────────────────────
  counter: {
    ...typography.caption,
    color: c.textSecondary,
  },

  // ── Mood badge ────────────────────────────────────────────
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.xs,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    borderRadius: metrics.radius.full,
    paddingHorizontal: metrics.spacing.smMd,
    paddingVertical: metrics.spacing.xs,
    marginBottom: metrics.spacing.md,
  },
  moodBadgeText: {
    ...typography.labelSmall,
    color: c.primary,
    letterSpacing: 0.3,
  },

  // ── Question ──────────────────────────────────────────────
  questionRow: {
    marginBottom: metrics.spacing.md,
  },
  question: {
    fontSize: responsiveFontSize(3.2),
    fontFamily: 'PlayfairDisplay-Italic',
    color: c.text,
    lineHeight: responsiveFontSize(4.2),
  },
  questionTeal: {
    fontSize: responsiveFontSize(3.2),
    fontFamily: 'PlayfairDisplay-Italic',
    color: c.primary,
    lineHeight: responsiveFontSize(4.2),
  },
  questionHeart: {
    marginTop: metrics.spacing.xs,
  },

  // ── Tap hint ──────────────────────────────────────────────
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.xs,
    marginBottom: metrics.spacing.md,
  },
  hintArrow: {
    ...typography.bodySmall,
    color: c.textHint,
  },
  hintText: {
    ...typography.caption,
    color: c.textHint,
    letterSpacing: 0.5,
  },

  // ── Options ───────────────────────────────────────────────
  options: {
    gap: 0,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.smMd,
    backgroundColor: 'transparent',
    borderRadius: metrics.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    paddingVertical: metrics.spacing.smMd,
    paddingHorizontal: metrics.spacing.smMd,
  },
  optionSelected: {
    borderColor: c.primary,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  optionIconCircle: {
    width: responsiveWidth(11),
    height: responsiveWidth(11),
    borderRadius: responsiveWidth(5.5),
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  optionText: {
    ...typography.bodyMedium,
    color: c.text,
    flex: 1,
    lineHeight: metrics.fontSize.body * 1.4,
  },
  optionTextSelected: {
    color: c.primary,
    fontFamily: 'DMSans-SemiBold',
  },

  // ── Or divider ────────────────────────────────────────────
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.sm,
    marginVertical: metrics.spacing.sm,
    paddingHorizontal: metrics.spacing.sm,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(45,95,93,0.12)',
  },
  orText: {
    ...typography.caption,
    color: c.textHint,
  },

  // ── Decorative elements ───────────────────────────────────
  decorContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: responsiveHeight(22),
    pointerEvents: 'none' as any,
  },
  sparkle1: {
    position: 'absolute',
    bottom: responsiveHeight(6),
    left: responsiveWidth(5),
    color: '#2DD4BF',
    fontSize: responsiveFontSize(2),
    opacity: 0.5,
  },
  sparkle2: {
    position: 'absolute',
    bottom: responsiveHeight(10),
    right: responsiveWidth(32),
    color: '#2DD4BF',
    fontSize: responsiveFontSize(1.5),
    opacity: 0.4,
  },
  leavesDecor: {
    position: 'absolute',
    bottom: 0,
    right: responsiveWidth(2),
    width: responsiveWidth(28),
    height: responsiveWidth(28),
    opacity: 0.4,
  },

  // ── Bottom dots — pinned at bottom ────────────────────────
  dotsRow: {
    position: 'absolute',
    bottom: 0,
    left: metrics.layout.screenPaddingHz,
    right: metrics.layout.screenPaddingHz,
    flexDirection: 'row',
    gap: 4,
    paddingTop: responsiveHeight(1.5),
  },
  dot: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
  dotActive: {},
  dotInactive: {
    backgroundColor: 'rgba(45,95,93,0.15)',
  },
});
