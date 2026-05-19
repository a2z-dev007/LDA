import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/types';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { useAppColors } from '../theme';
import { typography, fonts } from '../theme/typography';
import { metrics } from '../theme/metrics';
import { assumptionsSets } from '../data/quizData';
import { useDayStore } from '../store/useDayStore';
import { haptics } from '../utils/haptics';
import { Day3Scoring } from '../services/scoring/day3Scoring';
import { ChevronLeft } from 'lucide-react-native';

type Nav = StackNavigationProp<RootStackParamList, 'Day3AssumptionsTest'>;

export const Day3AssumptionsTest: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const day1 = useDayStore((s) => s.day1);
  const completeDay3 = useDayStore((s) => s.completeDay3);

  const personalityKey = day1.personalityType ?? 'default';
  const questions = assumptionsSets[personalityKey] ?? assumptionsSets['default'];
  const total = questions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(20);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
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
      const trueCount = Object.values(newAnswers).filter(Boolean).length;
      const trueRatio = trueCount / total;
      completeDay3(newAnswers, trueRatio);

      // Calculate and Log Day 3 Scoring output for debugging
      const updatedDay3 = useDayStore.getState().day3;
      const scoringResult = Day3Scoring.calculate(updatedDay3);
      console.log('=== [DEBUG] Day 3 Completion Scoring & Local Storage Log ===');
      console.log('Day 3 Data in Local Storage:', JSON.stringify(updatedDay3, null, 2));
      console.log('Day 3 Calculated Scoring Result:', JSON.stringify(scoringResult, null, 2));
      console.log('===========================================================');

      navigation.navigate('Day3MirrorResults');
    }
  };

  const question = questions[currentIndex];
  const progress = (currentIndex + 1) / total;

  const formatPersonalityType = (key: string) => {
    return key
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formattedPersonality = formatPersonalityType(personalityKey);

  return (
    <ScreenWrapper>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          // { paddingTop: Math.max(insets.top + metrics.spacing.xs, metrics.spacing.sm) }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header row */}
        <View style={styles.headerRow}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ChevronLeft size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>The Assumptions Test</Text>
        </View>

        {/* Title */}
        {/* <Text style={styles.mainTitle}>The Assumptions Test.</Text> */}
        
        {/* Subtitle */}
        <Text style={styles.subtitle}>
          10 statements · One per screen · TRUE or FALSE
        </Text>

        {/* Dynamic Personality Pill Row */}
        <View style={styles.personalityPillRow}>
          <View style={styles.personalityPill}>
            <Text style={styles.flameIcon}>🔥</Text>
            <Text style={styles.personalityPillText}>
              {formattedPersonality} set
            </Text>
          </View>
          {/* <Text style={styles.personalitySubtext}>Based on d1_personality_type</Text> */}
        </View>

        {/* Question Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {currentIndex + 1} / {total}
          </Text>
        </View>

        {/* Question Card */}
        <Animated.View style={[
          styles.questionCard,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}>
          <Text style={styles.statementNumber}>
            STATEMENT {currentIndex + 1} OF {total}
          </Text>
          
          <Text style={styles.statementText}>
            "{question.statement}"
          </Text>

          {/* Answer buttons inside card */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.answerBtn, styles.trueBtn]}
              activeOpacity={0.8}
              onPress={() => handleAnswer(true)}
            >
              <Text style={[styles.answerBtnLabel, styles.trueBtnLabel]}>TRUE</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.answerBtn, styles.falseBtn]}
              activeOpacity={0.8}
              onPress={() => handleAnswer(false)}
            >
              <Text style={[styles.answerBtnLabel, styles.falseBtnLabel]}>FALSE</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Auto-advance helper note */}
        <Text style={styles.helperNote}>
          Tap → auto-advance to next statement
        </Text>

        {/* Storage capsule hint */}
        {/* <View style={styles.storageHintCard}>
          <View style={styles.databaseIconContainer}>
            <Text style={{ fontSize: 14 }}>📂</Text>
          </View>
          <Text style={styles.storageHintText}>
            Stores: d3_mirror_q[{currentIndex + 1}] · d3_true_ratio (running count)
          </Text>
        </View> */}

      </ScrollView>
    </ScreenWrapper>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingBottom: metrics.spacing.xl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: metrics.spacing.md,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    color: c.text,
    fontFamily: fonts.playfairSemiBold,
  },
  mainTitle: {
    fontSize: 26,
    color: c.text,
    fontFamily: 'PlayfairDisplay-Bold',
    textAlign: 'center',
    marginTop: metrics.spacing.sm,
    marginBottom: 6,
  },
  subtitle: {
    ...typography.caption,
    color: c.textHint,
    textAlign: 'center',
    marginBottom: metrics.spacing.md,
  },
  personalityPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: metrics.spacing.lg,
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
  personalitySubtext: {
    ...typography.captionSmall,
    color: c.textHint,
  },
  progressContainer: {
    paddingHorizontal: 8,
    marginBottom: metrics.spacing.md,
    gap: 6,
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0D9488',
    borderRadius: 2,
  },
  progressText: {
    ...typography.captionSmall,
    color: c.textHint,
    textAlign: 'right',
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.06)',
    padding: metrics.spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: metrics.spacing.md,
  },
  statementNumber: {
    ...typography.captionSmall,
    color: c.textHint,
    letterSpacing: 1.5,
    marginBottom: metrics.spacing.md,
  },
  statementText: {
    fontSize: 22,
    color: c.text,
    fontFamily: 'PlayfairDisplay-Italic',
    lineHeight: 32,
    textAlign: 'center',
    marginBottom: metrics.spacing.xl,
    paddingHorizontal: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  answerBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  trueBtn: {
    borderColor: '#A7F3D0',
    backgroundColor: '#ECFDF5',
  },
  falseBtn: {
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },
  answerBtnLabel: {
    fontSize: 16,
    fontFamily: fonts.dmSansBold,
    letterSpacing: 1,
  },
  trueBtnLabel: {
    color: '#065F46',
  },
  falseBtnLabel: {
    color: '#991B1B',
  },
  helperNote: {
    ...typography.caption,
    color: c.textHint,
    textAlign: 'center',
    marginBottom: metrics.spacing.lg,
  },
  storageHintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    borderRadius: metrics.radius.lg,
    padding: metrics.spacing.md,
    gap: metrics.spacing.sm,
    width: '100%',
  },
  databaseIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storageHintText: {
    flex: 1,
    ...typography.captionSmall,
    color: '#1B5E20',
  },
});
