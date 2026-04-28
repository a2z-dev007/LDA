import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { ProgressStrip } from '../components/common/ProgressStrip';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { useAppColors } from '../theme';
import { assumptionsSets } from '../data/quizData';
import { useDayStore } from '../store/useDayStore';
import { haptics } from '../utils/haptics';

type Nav = StackNavigationProp<RootStackParamList, 'Day3AssumptionsTest'>;

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
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, useNativeDriver: true }),
    ]).start();
  }, [currentIndex]);

  const handleAnswer = (value: boolean) => {
    haptics.light();
    const question = questions[currentIndex];
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);

    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      // Calculate trueRatio
      const trueCount = Object.values(newAnswers).filter(Boolean).length;
      const trueRatio = trueCount / total;
      completeDay3(newAnswers, trueRatio);
      navigation.navigate('Day3OneCertainty');
    }
  };

  const question = questions[currentIndex];
  const progress = (currentIndex + 1) / total;

  return (
    <ScreenWrapper backgroundColor="#0B1020">
      <ProgressStrip currentDay={3} />

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>{currentIndex + 1} of {total}</Text>
      </View>

      <Animated.View style={[styles.body, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.eyebrow}>Day 3 · The Assumptions Test</Text>
        <Text style={styles.statement}>{question.statement}</Text>
        <Text style={styles.instruction}>Does your partner think this is TRUE about you?</Text>
      </Animated.View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.answerBtn, styles.trueBtn]}
          activeOpacity={0.85}
          onPress={() => handleAnswer(true)}
        >
          <Text style={styles.answerBtnLabel}>TRUE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.answerBtn, styles.falseBtn]}
          activeOpacity={0.85}
          onPress={() => handleAnswer(false)}
        >
          <Text style={styles.answerBtnLabel}>FALSE</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  progressContainer: { paddingHorizontal: 28, paddingTop: 8, paddingBottom: 16, gap: 8 },
  progressTrack: { height: 3, backgroundColor: c.surface, borderRadius: 2 },
  progressFill: { height: '100%', backgroundColor: c.day3, borderRadius: 2 },
  progressText: { color: c.textHint, fontSize: 12, fontFamily: 'Inter-Regular', textAlign: 'right' },
  body: { flex: 1, paddingHorizontal: 28, justifyContent: 'center' },
  eyebrow: { color: c.day3, fontSize: 12, fontFamily: 'Inter-SemiBold', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 32 },
  statement: {
    fontSize: 26, color: c.text, fontFamily: 'PlayfairDisplay-Bold',
    lineHeight: 38, marginBottom: 24,
  },
  instruction: { fontSize: 15, color: c.textHint, fontFamily: 'Inter-Regular' },
  buttons: { flexDirection: 'row', paddingHorizontal: 28, paddingBottom: 48, gap: 12 },
  answerBtn: {
    flex: 1, paddingVertical: 20, borderRadius: 16, alignItems: 'center',
    borderWidth: 1.5,
  },
  trueBtn: { borderColor: c.day3, backgroundColor: `${c.day3}15` },
  falseBtn: { borderColor: c.surfaceBorder, backgroundColor: c.surface },
  answerBtnLabel: { color: c.text, fontSize: 17, fontFamily: 'Inter-SemiBold', letterSpacing: 1 },
});
