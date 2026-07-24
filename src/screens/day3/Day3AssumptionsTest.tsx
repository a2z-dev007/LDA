import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, Animated, PanResponder, Dimensions, TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { useAppColors } from '../../theme';
import { typography, fonts } from '../../theme/typography';
import { metrics } from '../../theme/metrics';
import { assumptionsSets } from '../../data/quizData';
import { useDayStore } from '../../store/useDayStore';
import { haptics } from '../../utils/haptics';
import { Day3Scoring } from '../../services/scoring/day3Scoring';
import { CheckCircle, XCircle, ArrowLeft, ArrowRight } from 'lucide-react-native';

type Nav = StackNavigationProp<RootStackParamList, 'Day3AssumptionsTest'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const SWIPE_OUT_DURATION = 300;

export const Day3AssumptionsTest: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const day1 = useDayStore((s) => s.day1);
  const completeDay3 = useDayStore((s) => s.completeDay3);

  const personalityKey = day1.personalityType ?? 'default';
  const questions = assumptionsSets[personalityKey] ?? assumptionsSets['default'];
  const total = questions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  // Swipe animation
  const position = useRef(new Animated.ValueXY()).current;
  const cardOpacity = useRef(new Animated.Value(1)).current;

  // Smooth progress bar animation
  const progressAnim = useRef(new Animated.Value(1 / total)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentIndex + 1) / total,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentIndex, total]);

  // Derived rotation & overlay opacities from position.x
  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-12deg', '0deg', '12deg'],
    extrapolate: 'clamp',
  });

  const trueOverlayOpacity = position.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const falseOverlayOpacity = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // Dynamic next card animations bound to front card displacement
  const nextCardScale = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH * 0.5, 0, SCREEN_WIDTH * 0.5],
    outputRange: [1, 0.94, 1],
    extrapolate: 'clamp',
  });

  const nextCardOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH * 0.5, 0, SCREEN_WIDTH * 0.5],
    outputRange: [0.95, 0.5, 0.95],
    extrapolate: 'clamp',
  });

  const nextCardTranslateY = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH * 0.5, 0, SCREEN_WIDTH * 0.5],
    outputRange: [0, 16, 0],
    extrapolate: 'clamp',
  });

  // Haptic feedback on crossing threshold
  const hasTriggeredHaptic = useRef(false);

  const handleSwipeComplete = useCallback((isTrue: boolean) => {
    const question = questions[currentIndex];
    const newAnswers = { ...answers, [question.id]: isTrue };
    setAnswers(newAnswers);

    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
      // Reset animations for next card
      position.setValue({ x: 0, y: 0 });
      cardOpacity.setValue(1);
    } else {
      // Last question — complete
      const trueCount = Object.values(newAnswers).filter(Boolean).length;
      const trueRatio = trueCount / total;
      completeDay3(newAnswers, trueRatio);

      const updatedDay3 = useDayStore.getState().day3;
      const scoringResult = Day3Scoring.calculate(updatedDay3);
      console.log('=== [DEBUG] Day 3 Completion Scoring & Local Storage Log ===');
      console.log('Day 3 Data in Local Storage:', JSON.stringify(updatedDay3, null, 2));
      console.log('Day 3 Calculated Scoring Result:', JSON.stringify(scoringResult, null, 2));
      console.log('===========================================================');

      navigation.navigate('Day3MirrorResults');
    }
  }, [currentIndex, answers, questions, total]);

  const swipeOut = useCallback((direction: 'left' | 'right') => {
    const toX = direction === 'right' ? SCREEN_WIDTH * 1.2 : -SCREEN_WIDTH * 1.2;
    haptics.success();

    Animated.parallel([
      Animated.timing(position, {
        toValue: { x: toX, y: 0 },
        duration: SWIPE_OUT_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 0,
        duration: SWIPE_OUT_DURATION,
        useNativeDriver: true,
      }),
    ]).start(() => {
      handleSwipeComplete(direction === 'right');
    });
  }, [handleSwipeComplete]);

  // Keep a ref to the latest swipeOut so PanResponder always calls the current version
  const swipeOutRef = useRef(swipeOut);
  useEffect(() => {
    swipeOutRef.current = swipeOut;
  }, [swipeOut]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dx) > 8,
      onPanResponderGrant: () => {
        hasTriggeredHaptic.current = false;
      },
      onPanResponderMove: (_, gs) => {
        position.setValue({ x: gs.dx, y: gs.dy * 0.15 });

        // Light haptic when crossing threshold
        const past = Math.abs(gs.dx) > SWIPE_THRESHOLD;
        if (past && !hasTriggeredHaptic.current) {
          haptics.selection();
          hasTriggeredHaptic.current = true;
        } else if (!past && hasTriggeredHaptic.current) {
          hasTriggeredHaptic.current = false;
        }
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dx > SWIPE_THRESHOLD) {
          swipeOutRef.current('right');
        } else if (gs.dx < -SWIPE_THRESHOLD) {
          swipeOutRef.current('left');
        } else {
          // Snap back
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 6,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const question = questions[currentIndex];
  const nextQuestion = currentIndex < total - 1 ? questions[currentIndex + 1] : null;

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const formatPersonalityType = (key: string) =>
    key.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const formattedPersonality = formatPersonalityType(personalityKey);

  return (
    <ScreenWrapper>
      <View style={styles.content}>
        {/* Header */}
        <ScreenHeader title="The Assumptions Test" />

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          10 statements · Swipe or tap to answer
        </Text>

        {/* Personality Pill */}
        <View style={styles.personalityPillRow}>
          <View style={styles.personalityPill}>
            <Text style={styles.flameIcon}>🔥</Text>
            <Text style={styles.personalityPillText}>
              {formattedPersonality} set
            </Text>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
          </View>
          <Text style={styles.progressText}>
            {currentIndex + 1} / {total}
          </Text>
        </View>

        {/* Card Stack Area */}
        <View style={styles.cardArea}>
          {/* Next card (behind) */}
          {nextQuestion && (
            <Animated.View style={[
              styles.questionCard,
              styles.nextCard,
              {
                transform: [
                  { scale: nextCardScale },
                  { translateY: nextCardTranslateY },
                ],
                opacity: nextCardOpacity,
              },
            ]}>
              <Text style={styles.quoteBackground}>“</Text>
              <View style={styles.statementBadge}>
                <Text style={styles.statementNumber}>
                  STATEMENT {currentIndex + 2} OF {total}
                </Text>
              </View>
              <Text style={styles.statementText} numberOfLines={4}>
                "{nextQuestion.statement}"
              </Text>
            </Animated.View>
          )}

          {/* Current card (swipeable) */}
          <Animated.View
            style={[
              styles.questionCard,
              {
                transform: [
                  { translateX: position.x },
                  { translateY: position.y },
                  { rotate },
                ],
                opacity: cardOpacity,
              },
            ]}
            {...panResponder.panHandlers}
          >
            {/* TRUE overlay (right swipe) */}
            <Animated.View style={[styles.swipeOverlay, styles.trueOverlay, { opacity: trueOverlayOpacity }]}>
              <CheckCircle size={28} color="#065F46" strokeWidth={2.5} />
              <Text style={styles.trueOverlayText}>TRUE</Text>
            </Animated.View>

            {/* FALSE overlay (left swipe) */}
            <Animated.View style={[styles.swipeOverlay, styles.falseOverlay, { opacity: falseOverlayOpacity }]}>
              <XCircle size={28} color="#991B1B" strokeWidth={2.5} />
              <Text style={styles.falseOverlayText}>FALSE</Text>
            </Animated.View>

            <Text style={styles.quoteBackground}>“</Text>

            <View style={styles.statementBadge}>
              <Text style={styles.statementNumber}>
                STATEMENT {currentIndex + 1} OF {total}
              </Text>
            </View>

            <Text style={styles.statementText}>
              "{question.statement}"
            </Text>
          </Animated.View>
        </View>

        {/* Swipe buttons (Tap actions) */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.buttonFalse]}
            onPress={() => swipeOut('left')}
            activeOpacity={0.7}
          >
            <XCircle size={20} color="#C85A54" strokeWidth={2.5} />
            <Text style={styles.buttonTextFalse}>False</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.buttonTrue]}
            onPress={() => swipeOut('right')}
            activeOpacity={0.7}
          >
            <CheckCircle size={20} color="#2D5F5D" strokeWidth={2.5} />
            <Text style={styles.buttonTextTrue}>True</Text>
          </TouchableOpacity>
        </View>

        {/* Dots */}
        <View style={styles.dotsRow}>
          {questions.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i < currentIndex
                  ? (answers[questions[i].id] ? styles.dotTrue : styles.dotFalse)
                  : i === currentIndex
                    ? styles.dotActive
                    : styles.dotInactive,
              ]}
            />
          ))}
        </View>
      </View>
    </ScreenWrapper>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingBottom: metrics.spacing.md,
  },
  subtitle: {
    ...typography.caption,
    color: c.textHint,
    textAlign: 'center',
    marginBottom: metrics.spacing.sm,
  },
  personalityPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: metrics.spacing.md,
  },
  personalityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: metrics.radius.full,
    borderWidth: 1,
    borderColor: 'rgba(45,95,93,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  flameIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  personalityPillText: {
    ...typography.captionSmall,
    color: c.text,
    fontFamily: fonts.dmSansBold,
  },
  progressContainer: {
    paddingHorizontal: 8,
    marginBottom: metrics.spacing.md,
    gap: 6,
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(45, 95, 93, 0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: c.primary,
    borderRadius: 3,
  },
  progressText: {
    ...typography.captionSmall,
    color: c.textHint,
    textAlign: 'right',
    marginTop: 2,
  },

  // Card stack
  cardArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionCard: {
    position: 'absolute',
    width: SCREEN_WIDTH - metrics.layout.screenPaddingHz * 2 - 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(45, 95, 93, 0.12)',
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 280,
    shadowColor: '#1A3635',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
  },
  nextCard: {
    zIndex: -1,
  },
  quoteBackground: {
    position: 'absolute',
    top: -15,
    left: 20,
    fontSize: 140,
    fontFamily: 'PlayfairDisplay-Italic',
    color: 'rgba(45, 95, 93, 0.04)',
    zIndex: -1,
  },
  statementBadge: {
    backgroundColor: 'rgba(45, 95, 93, 0.06)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: metrics.spacing.md,
  },
  statementNumber: {
    fontSize: 11,
    fontFamily: fonts.dmSansBold,
    color: c.primary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  statementText: {
    fontSize: 22,
    color: c.text,
    fontFamily: 'PlayfairDisplay-Italic',
    lineHeight: 32,
    textAlign: 'center',
    paddingHorizontal: 8,
  },

  // Swipe overlays
  swipeOverlay: {
    position: 'absolute',
    top: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 2,
    zIndex: 10,
  },
  trueOverlay: {
    right: 16,
    backgroundColor: 'rgba(236,253,245,0.95)',
    borderColor: '#A7F3D0',
  },
  falseOverlay: {
    left: 16,
    backgroundColor: 'rgba(254,242,242,0.95)',
    borderColor: '#FECACA',
  },
  trueOverlayText: {
    fontSize: 16,
    fontFamily: fonts.dmSansBold,
    color: '#065F46',
    letterSpacing: 1,
  },
  falseOverlayText: {
    fontSize: 16,
    fontFamily: fonts.dmSansBold,
    color: '#991B1B',
    letterSpacing: 1,
  },

  // Action Buttons Row
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 8,
    marginVertical: metrics.spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flex: 1,
    height: 52,
    borderRadius: metrics.radius.full,
    borderWidth: 1.5,
    shadowColor: '#1A3635',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonFalse: {
    backgroundColor: 'rgba(254, 242, 242, 0.95)',
    borderColor: 'rgba(200, 90, 84, 0.25)',
  },
  buttonTrue: {
    backgroundColor: 'rgba(236, 253, 245, 0.95)',
    borderColor: 'rgba(45, 95, 93, 0.25)',
  },
  buttonTextFalse: {
    fontSize: 15,
    fontFamily: fonts.dmSansBold,
    color: '#C85A54',
    letterSpacing: 0.5,
  },
  buttonTextTrue: {
    fontSize: 15,
    fontFamily: fonts.dmSansBold,
    color: '#2D5F5D',
    letterSpacing: 0.5,
  },

  // Dots
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: c.primary,
    width: 20,
    borderRadius: 4,
  },
  dotTrue: {
    backgroundColor: '#A7F3D0',
  },
  dotFalse: {
    backgroundColor: '#FECACA',
  },
  dotInactive: {
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
});
