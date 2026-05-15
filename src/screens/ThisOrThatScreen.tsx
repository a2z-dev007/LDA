import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/types';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { useAppColors } from '../theme';
import { typography, fonts } from '../theme/typography';
import { metrics } from '../theme/metrics';
import { haptics } from '../utils/haptics';
import { useDayStore } from '../store/useDayStore';
import { thisOrThatQuestions } from '../data/thisOrThatData';
import { ChevronLeft, Sparkles, Lock, Share2 } from 'lucide-react-native';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

type Nav = StackNavigationProp<RootStackParamList, 'ThisOrThat'>;

export const ThisOrThatScreen: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const setB2ThisOrThat = useDayStore((s) => s.setB2ThisOrThat);

  const [currentStep, setCurrentStep] = useState(0);
  const [picks, setPicks] = useState<string[]>([]);
  const [predictions, setPredictions] = useState<string[]>([]);
  
  const totalQuestions = thisOrThatQuestions.length;
  const currentQuestionIndex = currentStep;
  const isPredicting = currentStep % 2 !== 0; // Alternates: 0=Pick, 1=Predict, 2=Pick, etc.
  const isFinished = currentStep >= totalQuestions;

  const currentQuestion = thisOrThatQuestions[currentQuestionIndex];

  // Animations
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const triggerTransition = (callback: () => void) => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      callback();
      Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    });
  };

  const handleSelect = (optionText: string) => {
    haptics.medium();
    
    let newPicks = [...picks];
    let newPredictions = [...predictions];

    if (!isPredicting) {
      newPicks[currentStep] = optionText;
      setPicks(newPicks);
    } else {
      newPredictions[currentStep] = optionText;
      setPredictions(newPredictions);
    }

    // Auto advance
    setTimeout(() => {
      triggerTransition(() => {
        if (currentStep === totalQuestions - 1) {
          // Final step complete
          const finalRounds = thisOrThatQuestions.map((q, idx) => ({
            round: idx + 1,
            my_pick: newPicks[idx] || '',
            my_pred_of_partner: newPredictions[idx] || '',
          }));
          setB2ThisOrThat(finalRounds);
        }
        setCurrentStep((p) => p + 1);
      });
    }, 300);
  };

  const handleFinish = () => {
    haptics.heavy();
    navigation.navigate('Day2MoodPicker');
  };

  const handleBack = () => {
    if (currentStep > 0) {
      triggerTransition(() => {
        setCurrentStep((p) => p - 1);
      });
    } else {
      navigation.goBack();
    }
  };

  // Progress percentage
  const progress = isFinished ? 1 : currentStep / totalQuestions;

  return (
    <ScreenWrapper>
      {/* Back button */}
      <TouchableOpacity
        style={[styles.backBtn, { top: insets.top + metrics.spacing.sm }]}
        onPress={handleBack}
        activeOpacity={0.7}
      >
        <ChevronLeft size={22} color={colors.text} />
      </TouchableOpacity>

      <Animated.ScrollView
        style={[styles.container, { opacity: fadeAnim }]}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + metrics.spacing.xxl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {!isFinished ? (
          <>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>
                {!isPredicting ? 'Pick yours' : 'What would they pick?'}
              </Text>
              <Text style={styles.subtitle}>
                {!isPredicting
                  ? `Round ${currentStep + 1} · Choose your preference`
                  : `Round ${currentStep + 1} · Predict their choice`}
              </Text>
              
              {/* Progress Bar */}
              <View style={styles.progressBg}>
                <Animated.View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
              </View>
              
              <Text style={styles.roundIndicator}>
                ROUND {currentStep + 1} OF {totalQuestions}
              </Text>
            </View>

            {/* Question Category */}
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryText}>{currentQuestion.category}</Text>
            </View>

            {/* Options */}
            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option) => {
                const isSelected = !isPredicting
                  ? picks[currentStep] === option.text
                  : predictions[currentStep] === option.text;

                return (
                  <TouchableOpacity
                    key={option.text}
                    style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                    onPress={() => handleSelect(option.text)}
                    activeOpacity={0.8}
                  >
                    {isSelected && (
                      <LinearGradient
                        colors={['rgba(45,212,191,0.15)', 'rgba(110,232,122,0.15)']}
                        style={StyleSheet.absoluteFill}
                      />
                    )}
                    <Text style={styles.optionEmoji}>{option.emoji}</Text>
                    <Text style={styles.optionText}>{option.text}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={[styles.stepIndicatorContainer, { backgroundColor: isPredicting ? 'rgba(45,212,191,0.1)' : 'rgba(0,0,0,0.05)' }]}>
              <Text style={[styles.stepIndicatorText, { color: isPredicting ? colors.primary : colors.textSecondary }]}>
                {!isPredicting ? 'MY PICK' : 'MY PREDICTION'}
              </Text>
            </View>

            <Text style={styles.hintText}>
              {!isPredicting
                ? "Tap your preference"
                : "Predict what your partner would choose"}
            </Text>
          </>
        ) : (
          <>
            {/* Results Screen */}
            <View style={styles.header}>
              <Text style={styles.title}>This or That: Us Edition</Text>
              <Text style={styles.subtitle}>All {totalQuestions} rounds done 🎉</Text>
              
              <View style={styles.progressBg}>
                <View style={[styles.progressBar, { width: '100%' }]} />
              </View>
            </View>

            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Your answers are sealed 🔒</Text>
              <Text style={styles.summarySub}>They'll reveal when your partner joins.</Text>

              <View style={styles.roundsSummary}>
                {thisOrThatQuestions.map((q, idx) => (
                  <View key={idx} style={styles.roundRow}>
                    <View style={styles.roundBadge}>
                      <Text style={styles.roundBadgeText}>R{idx + 1}</Text>
                    </View>
                    <View style={styles.roundDetails}>
                      <Text style={styles.roundQ}>{q.category}</Text>
                      {picks[idx] ? (
                        <Text style={styles.roundA}>You picked: {picks[idx]}</Text>
                      ) : null}
                      {predictions[idx] ? (
                        <Text style={styles.roundA}>You predicted: {predictions[idx]}</Text>
                      ) : null}
                    </View>
                  </View>
                ))}
              </View>

            </View>

            <TouchableOpacity
              style={styles.ctaButton}
              onPress={handleFinish}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={colors.gradientBtn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.ctaGradient}
              >
                <Text style={styles.ctaText}>Enter Day 2 →</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
      </Animated.ScrollView>
    </ScreenWrapper>
  );
};

const makeStyles = (c: any) => StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingBottom: metrics.spacing.xxl,
  },
  backBtn: {
    position: 'absolute',
    left: metrics.layout.screenPaddingHz,
    zIndex: 10,
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    borderRadius: responsiveWidth(5),
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: metrics.spacing.xl,
    marginTop: metrics.spacing.md,
  },
  title: {
    ...typography.h3,
    color: c.text,
    fontFamily: fonts.dmSansBold,
    marginBottom: 4,
  },
  subtitle: {
    ...typography.bodySmall,
    color: c.textSecondary,
    marginBottom: metrics.spacing.md,
  },
  progressBg: {
    width: '60%',
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: metrics.spacing.sm,
  },
  progressBar: {
    height: '100%',
    backgroundColor: c.primary,
    borderRadius: 2,
  },
  roundIndicator: {
    ...typography.captionSmall,
    color: c.textHint,
    letterSpacing: 1.2,
  },
  categoryContainer: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    paddingVertical: metrics.spacing.sm,
    paddingHorizontal: metrics.spacing.md,
    borderRadius: metrics.radius.full,
    alignSelf: 'center',
    marginBottom: metrics.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(45,212,191,0.15)',
  },
  categoryText: {
    ...typography.caption,
    color: c.primary,
    fontFamily: fonts.dmSansBold,
    letterSpacing: 1,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: metrics.spacing.md,
    justifyContent: 'space-between',
    marginBottom: metrics.spacing.xl,
  },
  optionCard: {
    flex: 1,
    height: responsiveWidth(42),
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: metrics.radius.xl,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: metrics.spacing.md,
    overflow: 'hidden',
    gap: metrics.spacing.sm,
  },
  optionCardSelected: {
    borderColor: c.primary,
    backgroundColor: '#FFFFFF',
    shadowColor: c.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  optionEmoji: {
    fontSize: responsiveFontSize(4),
  },
  optionText: {
    ...typography.bodyMedium,
    color: c.text,
    fontFamily: fonts.dmSansBold,
    textAlign: 'center',
  },
  stepIndicatorContainer: {
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: metrics.spacing.md,
  },
  stepIndicatorText: {
    fontSize: metrics.fontSize.caption,
    fontFamily: fonts.dmSansBold,
    letterSpacing: 1,
  },
  hintText: {
    ...typography.caption,
    color: c.textHint,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  summaryContainer: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: metrics.radius.xxl,
    padding: metrics.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    marginBottom: metrics.spacing.xl,
    alignItems: 'center',
    shadowColor: '#2DD4BF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },
  summaryTitle: {
    ...typography.bodyBold,
    color: c.text,
    fontSize: responsiveFontSize(2.2),
    marginBottom: 4,
  },
  summarySub: {
    ...typography.caption,
    color: c.textSecondary,
    marginBottom: metrics.spacing.lg,
    textAlign: 'center',
  },
  roundsSummary: {
    width: '100%',
    gap: metrics.spacing.md,
    marginBottom: metrics.spacing.md,
  },
  roundRow: {
    flexDirection: 'row',
    gap: metrics.spacing.md,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: metrics.spacing.md,
    borderRadius: metrics.radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(45,212,191,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  roundBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(45,212,191,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundBadgeText: {
    ...typography.captionSmall,
    color: c.primary,
    fontFamily: fonts.dmSansBold,
  },
  roundDetails: {
    flex: 1,
  },
  roundQ: {
    ...typography.bodySmall,
    color: c.text,
    fontFamily: fonts.dmSansBold,
    marginBottom: 2,
  },
  roundA: {
    ...typography.captionSmall,
    color: c.textSecondary,
    fontStyle: 'italic',
  },
  inviteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.xs,
    paddingVertical: metrics.spacing.xs,
    paddingHorizontal: metrics.spacing.md,
    borderRadius: metrics.radius.full,
    borderWidth: 1,
    borderColor: c.primary,
  },
  inviteBtnText: {
    ...typography.caption,
    color: c.primary,
    fontFamily: fonts.dmSansBold,
  },
  ctaButton: {
    width: '100%',
    shadowColor: '#2DD4BF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: metrics.spacing.md,
    borderRadius: metrics.radius.full,
    gap: metrics.spacing.sm,
  },
  ctaText: {
    ...typography.buttonLarge,
    color: '#FFFFFF',
  },
});
