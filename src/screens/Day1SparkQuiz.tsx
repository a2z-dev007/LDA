import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ImageBackground, Image,
} from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Reanimated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  runOnJS,
  withTiming,
  Easing,
  withDelay,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { useAppColors } from '../theme';
import { typography } from '../theme/typography';
import { metrics } from '../theme/metrics';
import { getQuizQuestions, resolveSegment, calculatePersonalityType } from '../data/day1Service';
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
// Swipeable Option Component
// ─────────────────────────────────────────────────────────────
const SWIPE_THRESHOLD = 80;

interface SwipeableOptionProps {
  children: React.ReactNode;
  onSelect: () => void;
  isSelected: boolean;
  isDimmed: boolean;
  colors: any;
}

const SwipeableOption: React.FC<SwipeableOptionProps> = ({ 
  children, 
  onSelect, 
  isSelected, 
  isDimmed, 
  colors 
}) => {
  const translateX = useSharedValue(0);
  const isPressed = useSharedValue(false);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      isPressed.value = true;
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      isPressed.value = false;
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        runOnJS(onSelect)();
      }
      translateX.value = withSpring(0);
    });

  const tapGesture = Gesture.Tap()
    .onEnd(() => {
      runOnJS(onSelect)();
    });

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = isDimmed ? 0.35 : 1;
    return {
      transform: [
        { translateX: translateX.value },
        { scale: withTiming(isPressed.value ? 0.97 : 1, { duration: 150 }) }
      ],
      opacity: withTiming(opacity, { duration: 200 }),
      overflow: 'hidden' as const,
    };
  });

  return (
    <GestureDetector gesture={Gesture.Exclusive(panGesture, tapGesture)}>
      <Reanimated.View style={animatedStyle}>
        {children}
      </Reanimated.View>
    </GestureDetector>
  );
};

// ─────────────────────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────────────────────
export const Day1SparkQuiz: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProps>();
  const { sliderScore } = route.params;
  const saveDay1Quiz = useDayStore((s) => s.saveDay1Quiz);
  const insets = useSafeAreaInsets();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B'>>({});
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const segment = resolveSegment(sliderScore);
  const questions = getQuizQuestions(segment);

  // Reanimated shared values for smooth content transition
  const contentOpacity = useSharedValue(1);
  const contentTranslateY = useSharedValue(0);
  const optionScale = useSharedValue(1);

  const question = questions[currentIndex];
  const total    = questions.length;
  const meta     = QUESTION_META[question.id as keyof typeof QUESTION_META];
  const BadgeIcon   = meta.badgeIcon;
  const OptionAIcon = meta.optionAIcon;
  const OptionBIcon = meta.optionBIcon;

  // Animated styles for the content area (question + options only)
  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [
      { translateY: contentTranslateY.value },
    ],
  }));

  const optionAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: optionScale.value },
    ],
  }));

  // Enter animation — called after state updates
  const animateIn = useCallback(() => {
    contentOpacity.value = 0;
    contentTranslateY.value = 18;
    optionScale.value = 0.96;

    const easingConfig = { duration: 320, easing: Easing.out(Easing.cubic) };

    contentOpacity.value = withTiming(1, easingConfig);
    contentTranslateY.value = withTiming(0, easingConfig);
    optionScale.value = withDelay(60, withTiming(1, { duration: 350, easing: Easing.out(Easing.back(1.3)) }));
  }, []);

  useEffect(() => {
    const existing = answers[question.id] ?? null;
    setSelectedOption(existing);
    animateIn();
  }, [currentIndex]);



  // Exit animation — fades out, then updates index
  const animateOutThenAdvance = useCallback((nextIndex: number) => {
    'worklet';
    const easingConfig = { duration: 200, easing: Easing.in(Easing.cubic) };
    contentOpacity.value = withTiming(0, easingConfig);
    contentTranslateY.value = withTiming(-12, easingConfig, () => {
      runOnJS(setCurrentIndex)(nextIndex);
      runOnJS(setIsTransitioning)(false);
    });
  }, []);

  const handleSelect = (value: 'A' | 'B') => {
    if (isTransitioning) return; // Guard against rapid taps
    haptics.light();
    setSelectedOption(value);

    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);

    if (currentIndex < total - 1) {
      setIsTransitioning(true);
      // Short delay to let user see selection, then animate out
      setTimeout(() => {
        animateOutThenAdvance(currentIndex + 1);
      }, 280);
    } else {
      const personality = calculatePersonalityType(newAnswers);
      saveDay1Quiz(newAnswers, personality.id);
      navigation.replace('Day1Result');
    }
  };

  const handleBack = () => {
    if (currentIndex > 0 && !isTransitioning) {
      haptics.light();
      setIsTransitioning(true);
      animateOutThenAdvance(currentIndex - 1);
    }
  };

  return (
    <ImageBackground
      source={IMAGE.greenBg2}
      style={styles.root}
      resizeMode="cover"
    >
      {/* Main content — safe area top */}
      <View
        style={[
          styles.body,
          {
            paddingTop: Math.max(insets.top + responsiveHeight(1), responsiveHeight(5)),
          },
        ]}
      >
        {/* ── Progress dots — top of content ── */}
        <View style={styles.dotsRow}>
          {Array.from({ length: total }, (_, i) => (
            i <= currentIndex ? (
              <LinearGradient
                key={i}
                colors={[colors.primary, colors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.dot, styles.dotActive]}
              />
            ) : (
              <View key={i} style={[styles.dot, styles.dotInactive]} />
            )
          ))}
        </View>

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

        {/* ── Animated content area (only this part transitions) ── */}
        <Reanimated.View style={contentAnimatedStyle}>
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

          {/* ── Swipe/Tap hint ── */}
          <View style={styles.hintRow}>
            <Text style={styles.hintArrow}>«</Text>
            <Text style={styles.hintText}>Swipe or Tap to choose</Text>
            <Text style={styles.hintArrow}>»</Text>
          </View>
        </Reanimated.View>

        {/* ── Options (animated with scale for a polished feel) ── */}
        <Reanimated.View style={[contentAnimatedStyle, optionAnimatedStyle]}>
          <View style={styles.options}>
            {/* Option A */}
            <SwipeableOption
              onSelect={() => handleSelect('A')}
              isDimmed={selectedOption === 'B'}
              isSelected={selectedOption === 'A'}
              colors={colors}
            >
              <View style={[styles.option, selectedOption === 'A' && styles.optionSelected]}>
                <LinearGradient
                  colors={[colors.primary, colors.secondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.optionIconCircle}
                >
                  <OptionAIcon size={responsiveWidth(7)} color="#FFFFFF" strokeWidth={2} />
                </LinearGradient>
                <Text style={[styles.optionText, selectedOption === 'A' && styles.optionTextSelected]}>
                  {question.optionA}
                </Text>
              </View>
            </SwipeableOption>

            {/* Or divider */}
            <View style={styles.orDivider}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>or</Text>
              <View style={styles.orLine} />
            </View>

            {/* Option B */}
            <SwipeableOption
              onSelect={() => handleSelect('B')}
              isDimmed={selectedOption === 'A'}
              isSelected={selectedOption === 'B'}
              colors={colors}
            >
              <View style={[styles.option, selectedOption === 'B' && styles.optionSelected]}>
                <LinearGradient
                  colors={[colors.primary, colors.secondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.optionIconCircle}
                >
                  <OptionBIcon size={responsiveWidth(7)} color="#FFFFFF" strokeWidth={2} />
                </LinearGradient>
                <Text style={[styles.optionText, selectedOption === 'B' && styles.optionTextSelected]}>
                  {question.optionB}
                </Text>
              </View>
            </SwipeableOption>
          </View>
        </Reanimated.View>

        {/* ── Decorative sparkles + leaves ── */}
        <View style={styles.decorContainer} pointerEvents="none">
          <Text style={styles.sparkle1}>✦</Text>
          <Text style={styles.sparkle2}>✦</Text>
          <Image source={ICONS.leaves} style={styles.leavesDecor} resizeMode="contain" />
        </View>
      </View>

    </ImageBackground>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  root: { flex: 1 },

  body: {
    flex: 1,
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingBottom: responsiveHeight(3),
  },

  // ── Top row (counter + back) ──────────────────────────────
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: metrics.spacing.sm,
    marginBottom: metrics.spacing.xs,
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
    marginTop:responsiveHeight(1)
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
    flexDirection: 'column',
    alignItems: 'center',
    gap: metrics.spacing.md,
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderRadius: metrics.radius.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.9)',
    paddingVertical: metrics.spacing.lg,
    paddingHorizontal: metrics.spacing.md,
    elevation: 0,
    shadowOpacity: 0,
  },
  optionSelected: {
    borderColor: 'rgba(45, 212, 191, 0.45)',
    backgroundColor: 'rgba(255,255,255,0.88)',
    elevation: 0,
    shadowOpacity: 0,
  },
  optionIconCircle: {
    width: responsiveWidth(16),
    height: responsiveWidth(16),
    borderRadius: responsiveWidth(8),
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginBottom: metrics.spacing.xs,
  },
  optionText: {
    ...typography.bodyMedium,
    color: c.text,
    textAlign: 'center',
    lineHeight: metrics.fontSize.body * 1.4,
    fontSize: responsiveFontSize(2),
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

  // ── Bottom dots — now at top ─────────────────────────────
  dotsRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: metrics.spacing.sm,
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
