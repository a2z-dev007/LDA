import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
  Dimensions, Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';
import { sparkQuizQuestions } from '../data/quizData';
import { calculatePersonalityType } from '../data/personalityTypes';
import { useDayStore } from '../store/useDayStore';
import { haptics } from '../utils/haptics';
import { QuizBackground } from '../components/common/QuizBackground';

type Nav = StackNavigationProp<RootStackParamList, 'Day1Quiz'>;
type RouteProps = StackScreenProps<RootStackParamList, 'Day1Quiz'>['route'];

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const BORDER = 3;

// ─────────────────────────────────────────────────────────────
// ProgressBorder
// Draws 4 animated segments (top, right, bottom, left) that
// fill sequentially based on progress (0.0 → 1.0).
// Each side = 25% of total perimeter.
// ─────────────────────────────────────────────────────────────
const ProgressBorder: React.FC<{ progress: number }> = ({ progress }) => {
  const animatedProgress = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  // Top side: 0–25%  → width 0→SCREEN_W
  // Right side: 25–50% → height 0→SCREEN_H
  // Bottom side: 50–75% → width 0→SCREEN_W (right to left)
  // Left side: 75–100% → height 0→SCREEN_H (bottom to top)

  const topWidth = animatedProgress.interpolate({
    inputRange: [0, 0.25, 1],
    outputRange: [0, SCREEN_W, SCREEN_W],
    extrapolate: 'clamp',
  });

  const rightHeight = animatedProgress.interpolate({
    inputRange: [0.25, 0.5, 1],
    outputRange: [0, SCREEN_H, SCREEN_H],
    extrapolate: 'clamp',
  });

  const bottomWidth = animatedProgress.interpolate({
    inputRange: [0.5, 0.75, 1],
    outputRange: [0, SCREEN_W, SCREEN_W],
    extrapolate: 'clamp',
  });

  const leftHeight = animatedProgress.interpolate({
    inputRange: [0.75, 1],
    outputRange: [0, SCREEN_H],
    extrapolate: 'clamp',
  });

  const glowStyle = {
    shadowColor: colors.glowPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 12,
  };

  return (
    <>
      {/* Top — left to right */}
      <Animated.View
        pointerEvents="none"
        style={[styles.borderTop, glowStyle, { width: topWidth }]}
      />
      {/* Right — top to bottom */}
      <Animated.View
        pointerEvents="none"
        style={[styles.borderRight, glowStyle, { height: rightHeight }]}
      />
      {/* Bottom — right to left */}
      <Animated.View
        pointerEvents="none"
        style={[styles.borderBottom, glowStyle, { width: bottomWidth }]}
      />
      {/* Left — bottom to top */}
      <Animated.View
        pointerEvents="none"
        style={[styles.borderLeft, glowStyle, { height: leftHeight }]}
      />
    </>
  );
};

// ─────────────────────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────────────────────
export const Day1SparkQuiz: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProps>();
  const { sliderScore } = route.params;
  const completeDay1 = useDayStore((s) => s.completeDay1);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B'>>({});
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
  const [showSwipeHint, setShowSwipeHint] = useState(true);

  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const unchosen = useRef(new Animated.Value(1)).current;

  const question = sparkQuizQuestions[currentIndex];
  const total = sparkQuizQuestions.length;

  // Progress: after answering question N, border is (N+1)/total filled
  // Before any answer: show a tiny sliver so the border is visible from Q1
  const borderProgress = (currentIndex + 1) / total;

  useEffect(() => {
    setSelectedOption(null);
    unchosen.setValue(1);
    fadeIn.setValue(0);
    slideAnim.setValue(40);
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 100, useNativeDriver: true }),
    ]).start();
  }, [currentIndex]);

  const handleSelect = (value: 'A' | 'B') => {
    haptics.light();
    setSelectedOption(value);
    if (showSwipeHint) setShowSwipeHint(false);

    Animated.timing(unchosen, { toValue: 0.3, duration: 200, useNativeDriver: true }).start();

    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentIndex < total - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        const personality = calculatePersonalityType(newAnswers);
        completeDay1(newAnswers, personality.id);
        navigation.replace('Day1Result');
      }
    }, 120);
  };

  return (
    <View style={styles.root}>
      {/* Cycling premium background — changes every 2 questions */}
      <QuizBackground variant={Math.floor(currentIndex / 2)} />

      {/* Animated progress border — drawn on top of everything */}
      <ProgressBorder progress={borderProgress} />

      {/* Content */}
      <Animated.View
        style={[styles.body, { opacity: fadeIn, transform: [{ translateY: slideAnim }] }]}
      >
        {/* Counter */}
        <Text style={styles.counter}>{currentIndex + 1} of {total}</Text>

        {/* Mood badge */}
        <View style={styles.moodBadge}>
          <Text style={styles.moodBadgeText}>{question.moodBadge}</Text>
        </View>

        {/* Question */}
        <Text style={styles.question}>{question.prompt}</Text>

        {showSwipeHint && (
          <Text style={styles.swipeHint}>tap to choose</Text>
        )}

        {/* Options */}
        <View style={styles.options}>
          <Animated.View style={{ opacity: selectedOption === 'B' ? unchosen : 1 }}>
            <TouchableOpacity
              style={[styles.option, selectedOption === 'A' && styles.optionSelected]}
              activeOpacity={0.8}
              onPress={() => handleSelect('A')}
            >
              <Text style={styles.optionText}>{question.optionA.label}</Text>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.orDivider}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.orLine} />
          </View>

          <Animated.View style={{ opacity: selectedOption === 'A' ? unchosen : 1 }}>
            <TouchableOpacity
              style={[styles.option, selectedOption === 'B' && styles.optionSelected]}
              activeOpacity={0.8}
              onPress={() => handleSelect('B')}
            >
              <Text style={styles.optionText}>{question.optionB.label}</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.dark,
  },

  // ── Progress border segments ──────────────────────────────
  borderTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: BORDER,
    backgroundColor: colors.primary,
    zIndex: 100,
  },
  borderRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: BORDER,
    backgroundColor: colors.primary,
    zIndex: 100,
  },
  borderBottom: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: BORDER,
    backgroundColor: colors.primary,
    zIndex: 100,
  },
  borderLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: BORDER,
    backgroundColor: colors.primary,
    zIndex: 100,
  },

  // ── Content ───────────────────────────────────────────────
  body: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: Platform.OS === 'ios' ? 64 : 48,
    paddingBottom: 32,
  },
  counter: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    letterSpacing: 1,
    marginBottom: 20,
  },
  moodBadge: {
    alignSelf: 'flex-start',
    backgroundColor: `${colors.primary}22`,
    borderWidth: 1,
    borderColor: `${colors.primary}55`,
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 28,
  },
  moodBadgeText: {
    color: colors.primary,
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    letterSpacing: 0.5,
  },
  question: {
    fontSize: 28,
    color: '#FFFFFF',
    fontFamily: 'PlayfairDisplay-Italic',
    lineHeight: 40,
    marginBottom: 48,
  },
  swipeHint: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 1,
  },
  options: { gap: 16 },
  option: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    paddingVertical: 22,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}15`,
    shadowColor: colors.glowPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 24,
  },
  orDivider: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  orLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  orText: { color: 'rgba(255,255,255,0.25)', fontSize: 13, fontFamily: 'Inter-Regular' },
});
