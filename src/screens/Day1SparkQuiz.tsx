import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { ProgressStrip } from '../components/common/ProgressStrip';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { colors } from '../theme';
import { sparkQuizQuestions } from '../data/quizData';
import { calculatePersonalityType } from '../data/personalityTypes';
import { useDayStore } from '../store/useDayStore';
import { haptics } from '../utils/haptics';

type Nav = StackNavigationProp<RootStackParamList, 'Day1Quiz'>;
type RouteProps = StackScreenProps<RootStackParamList, 'Day1Quiz'>['route'];

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

    // Fade unchosen card
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
    <ScreenWrapper>
      <ProgressStrip currentDay={1} />

      {/* 7-pip progress bar */}
      <View style={styles.pips}>
        {sparkQuizQuestions.map((_, i) => (
          <View
            key={i}
            style={[
              styles.pip,
              i < currentIndex && styles.pipDone,
              i === currentIndex && styles.pipActive,
            ]}
          />
        ))}
      </View>

      <Animated.View style={[styles.body, { opacity: fadeIn, transform: [{ translateY: slideAnim }] }]}>
        {/* Mood badge */}
        <View style={styles.moodBadge}>
          <Text style={styles.moodBadgeText}>{question.moodBadge}</Text>
        </View>

        <Text style={styles.counter}>{currentIndex + 1} of {total}</Text>
        <Text style={styles.question}>{question.prompt}</Text>

        {showSwipeHint && (
          <Text style={styles.swipeHint}>tap to choose</Text>
        )}

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
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  pips: { flexDirection: 'row', paddingHorizontal: 32, marginTop: 8, gap: 6 },
  pip: { flex: 1, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.15)' },
  pipDone: { backgroundColor: colors.day1, opacity: 0.6 },
  pipActive: { backgroundColor: colors.day1 },
  body: { flex: 1, paddingHorizontal: 32, paddingTop: 32 },
  moodBadge: {
    alignSelf: 'flex-start',
    backgroundColor: `${colors.day1}22`,
    borderWidth: 1,
    borderColor: `${colors.day1}55`,
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 16,
  },
  moodBadgeText: { color: colors.day1, fontSize: 12, fontFamily: 'Inter-SemiBold', letterSpacing: 0.5 },
  counter: {
    color: 'rgba(255,255,255,0.3)', fontSize: 13, fontFamily: 'Inter-Regular',
    letterSpacing: 1, marginBottom: 16,
  },
  question: {
    fontSize: 26, color: '#FFFFFF', fontFamily: 'PlayfairDisplay-Italic',
    lineHeight: 36, marginBottom: 40,
  },
  swipeHint: {
    color: 'rgba(255,255,255,0.2)', fontSize: 12, fontFamily: 'Inter-Regular',
    textAlign: 'center', marginBottom: 16, letterSpacing: 1,
  },
  options: { gap: 16 },
  option: {
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16, paddingVertical: 22, paddingHorizontal: 24, alignItems: 'center',
  },
  optionSelected: { borderColor: colors.day1, backgroundColor: `${colors.day1}15` },
  optionText: { color: '#FFFFFF', fontSize: 17, fontFamily: 'Inter-Regular', textAlign: 'center', lineHeight: 24 },
  orDivider: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  orLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  orText: { color: 'rgba(255,255,255,0.25)', fontSize: 13, fontFamily: 'Inter-Regular' },
});
