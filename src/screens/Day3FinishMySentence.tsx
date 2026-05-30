import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/types';
import { ProgressStrip } from '../components/common/ProgressStrip';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { COLORS, colors, useAppColors } from '../theme';
import { typography, fonts } from '../theme/typography';
import { metrics } from '../theme/metrics';
import { haptics } from '../utils/haptics';
import { useDayStore } from '../store/useDayStore';
import { ChevronLeft, Check, Sparkles, BookOpen, Heart, ChevronRight } from 'lucide-react-native';
import { GradientButton } from '../components/common/GradientButton';
import { FMS_DATA } from '../data/fmsData';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

type Nav = StackNavigationProp<RootStackParamList, 'Day3FinishMySentence'>;

// Helper: strip "Set A — " / "Set B — " / "Set C — " prefix from titles
const cleanSetTitle = (title: string) => title.replace(/^Set [A-Z] — /, '');

// Helper: get a representative emoji for a set (first emoji from the first question's options)
const getSetEmoji = (set: { qs: { opts: { i: string }[] }[] }) =>
  set.qs[0]?.opts[0]?.i || '✨';

// Set card decorative emojis (collect diverse emojis from each set's questions)
const getSetDecoEmojis = (set: { qs: { opts: { i: string }[] }[] }) => {
  const emojis: string[] = [];
  for (const q of set.qs) {
    for (const opt of q.opts) {
      if (!emojis.includes(opt.i)) emojis.push(opt.i);
      if (emojis.length >= 4) return emojis;
    }
  }
  return emojis;
};

export const Day3FinishMySentence: React.FC = () => {
  const colors = useAppColors();
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  // Day Store
  const intentionWord = useDayStore(s => s.day3.intentionWord) || 'Patient';
  const setDay3FMS = useDayStore(s => s.setDay3FMS);

  // Get data for selected intention
  const wordKey = intentionWord.toLowerCase();
  const intentionConfig = FMS_DATA[wordKey] || FMS_DATA['patient'];
  const activeColor = intentionConfig.color;
  const activeBg = intentionConfig.bg;
  const intentionEmoji = intentionConfig.emoji;

  // Wizard state
  const [selectedSetIdx, setSelectedSetIdx] = useState<number | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<number[]>(); // option indices for the 5 questions

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const coupleCardFade = useRef(new Animated.Value(0)).current;
  const cardScales = useRef(intentionConfig.sets.map(() => new Animated.Value(1))).current;

  // Handle set selection
  const handleSelectSet = (idx: number) => {
    haptics.medium();
    // Animate card press
    Animated.sequence([
      Animated.timing(cardScales[idx], { toValue: 0.97, duration: 80, useNativeDriver: true }),
      Animated.timing(cardScales[idx], { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();

    setTimeout(() => {
      setSelectedSetIdx(idx);
      setAnswers([]);
      setCurrentQuestionIdx(0);
    }, 120);
  };

  // Handle option selection
  const handleSelectOption = (optIdx: number) => {
    haptics.medium();
    const newAnswers = [...(answers || [])];
    newAnswers[currentQuestionIdx] = optIdx;
    setAnswers(newAnswers);

    // Fade in couple card
    Animated.timing(coupleCardFade, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Run fade transitions when moving to next question
  const runTransition = (action: () => void) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      action();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });
  };

  // Next / Previous navigation
  const handleNext = () => {
    if (selectedSetIdx === null) return;
    const currentSet = intentionConfig.sets[selectedSetIdx];

    if (currentQuestionIdx < currentSet.qs.length - 1) {
      runTransition(() => {
        setCurrentQuestionIdx(prev => prev + 1);
        // If next question already has an answer, fade in couple card, else reset
        const nextHasAnswer = answers && answers[currentQuestionIdx + 1] !== undefined;
        coupleCardFade.setValue(nextHasAnswer ? 1 : 0);
      });
    } else {
      // Completed last question
      haptics.success();
      // Store the first question's selection for scoring compatibility
      const firstAnswerIdx = answers ? answers[0] : 0;
      const firstQuestion = currentSet.qs[0];
      const selectedOpt = firstQuestion.opts[firstAnswerIdx];

      setDay3FMS(selectedSetIdx, selectedOpt.t, selectedOpt.tag);
      navigation.navigate('Day3AssumptionsTest');
    }
  };

  const handleBack = () => {
    if (currentQuestionIdx > 0) {
      runTransition(() => {
        setCurrentQuestionIdx(prev => prev - 1);
        coupleCardFade.setValue(1); // previous questions definitely have answers
      });
    } else {
      // Go back to set selector
      runTransition(() => {
        setSelectedSetIdx(null);
      });
    }
  };

  const styles = makeStyles(colors, activeColor, activeBg);

  // ─────────────────────────────────────────────────────────────
  // RENDER: Set Selector UI
  // ─────────────────────────────────────────────────────────────
  const renderSetSelector = () => {
    return (
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ChevronLeft size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Finish My Sentence</Text>
        </View>

        {/* Intention Badge */}
        <View style={[styles.intentionBadge, { backgroundColor: activeBg, borderColor: activeColor + '30' }]}>
          <Text style={styles.intentionBadgeEmoji}>{intentionEmoji}</Text>
          <Text style={[styles.intentionBadgeText, { color: activeColor }]}>{intentionWord}</Text>
        </View>

        {/* Warm Heading */}
        <Text style={styles.prompt}>
          Choose your focus {intentionEmoji}
        </Text>
        <Text style={styles.stemsSubtitle}>
          Each path explores a different side of being {intentionWord.toLowerCase()} — pick the one that speaks to you most.
        </Text>

        {/* Set Cards */}
        <View style={styles.setListContainer}>
          {intentionConfig.sets.map((set, idx) => {
            const setEmoji = getSetEmoji(set);
            const decoEmojis = getSetDecoEmojis(set);
            const cleanTitle = cleanSetTitle(set.title);

            return (
              <Animated.View key={idx} style={{ transform: [{ scale: cardScales[idx] }] }}>
                <TouchableOpacity
                  activeOpacity={0.92}
                  onPress={() => handleSelectSet(idx)}
                  style={[styles.setCard, { borderColor: activeColor + '15' }]}
                >
                  {/* Decorative emoji row */}
                  <View style={styles.setCardDecoRow}>
                    {decoEmojis.map((e, i) => (
                      <Text key={i} style={[styles.setCardDecoEmoji, { opacity: 0.15 + (i * 0.1) }]}>{e}</Text>
                    ))}
                  </View>

                  <View style={styles.setCardBody}>
                    {/* Emoji + Title */}
                    <View style={styles.setCardTitleRow}>
                      <View style={[styles.setEmojiCircle, { backgroundColor: activeBg }]}>
                        <Text style={styles.setEmojiText}>{setEmoji}</Text>
                      </View>
                      <View style={styles.setCardTitleCol}>
                        <Text style={styles.setTitleText}>{cleanTitle}</Text>
                        <Text style={styles.setQuestionCount}>5 questions</Text>
                      </View>
                      <View style={[styles.setArrowCircle, { backgroundColor: activeColor + '12' }]}>
                        <ChevronRight size={16} color={activeColor} />
                      </View>
                    </View>

                    {/* Theme description */}
                    <Text style={styles.setThemeText}>{set.theme}</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </Animated.View>
    );
  };

  // ─────────────────────────────────────────────────────────────
  // RENDER: Question Wizard UI
  // ─────────────────────────────────────────────────────────────
  const renderQuestionWizard = () => {
    if (selectedSetIdx === null) return null;
    const currentSet = intentionConfig.sets[selectedSetIdx];
    const question = currentSet.qs[currentQuestionIdx];
    const isAnswered = answers ? answers[currentQuestionIdx] !== undefined : false;
    const selectedOptIdx = answers ? answers[currentQuestionIdx] : undefined;
    const cleanTitle = cleanSetTitle(currentSet.title);
    const totalQuestions = currentSet.qs.length;

    return (
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        {/* Sub Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <ChevronLeft size={20} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.wizardHeaderText}>
            <Text style={styles.wizardHeaderTitle}>{cleanTitle}</Text>
            <Text style={styles.wizardHeaderSub}>
              {intentionEmoji} Being {intentionWord}
            </Text>
          </View>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressLabelRow}>
            <Text style={[styles.progressLabel, { color: activeColor }]}>
              {currentQuestionIdx + 1} of {totalQuestions}
            </Text>
            <View style={styles.progressDots}>
              {Array.from({ length: totalQuestions }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.progressDot,
                    i <= currentQuestionIdx && { backgroundColor: activeColor },
                    i === currentQuestionIdx && styles.progressDotActive,
                  ]}
                />
              ))}
            </View>
          </View>
          <View style={styles.progressBarBg}>
            <Animated.View
              style={[
                styles.progressBarFill,
                { width: `${((currentQuestionIdx + 1) / totalQuestions) * 100}%`, backgroundColor: activeColor }
              ]}
            />
          </View>
        </View>

        {/* Stem Prompt Card */}
        <View style={[styles.promptCard, { borderColor: activeColor + '15' }]}>
          <View style={styles.promptCardHeader}>
            <View style={[styles.promptIconCircle, { backgroundColor: activeBg }]}>
              <Sparkles size={14} color={activeColor} />
            </View>
            <Text style={[styles.promptLabel, { color: activeColor }]}>Complete the sentence</Text>
          </View>
          <Text style={styles.promptText}>
            "{question.stem}{' '}
            {isAnswered && selectedOptIdx !== undefined ? (
              <Text style={{ color: activeColor, fontFamily: fonts.dmSansBold }}>
                {question.opts[selectedOptIdx].t.replace(/^…/, '')}
              </Text>
            ) : (
              <Text style={{ color: colors.textHint }}>___</Text>
            )}
            "
          </Text>
        </View>

        {/* Option Grid */}
        <View style={styles.gridContainer}>
          {question.opts.map((opt, idx) => {
            const isSelected = selectedOptIdx === idx;
            return (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.85}
                onPress={() => handleSelectOption(idx)}
                style={[
                  styles.optionCard,
                  isSelected && [styles.optionCardSelected, { borderColor: activeColor, backgroundColor: activeBg }],
                ]}
              >
                <View style={styles.optionContent}>
                  <View style={[
                    styles.optionEmojiCircle,
                    isSelected && { backgroundColor: activeColor + '20' },
                  ]}>
                    <Text style={styles.optionEmoji}>{opt.i}</Text>
                  </View>
                  <Text
                    style={[
                      styles.optionLabel,
                      isSelected && [styles.optionLabelSelected, { color: activeColor }]
                    ]}
                    numberOfLines={4}
                  >
                    {opt.t.replace(/^…/, '')}
                  </Text>
                </View>
                {isSelected && (
                  <View style={[styles.selectedCheckCircle, { backgroundColor: activeColor }]}>
                    <Check size={10} color="#FFFFFF" strokeWidth={3} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Couple Card Feedback */}
        {isAnswered && (
          <Animated.View style={{ opacity: coupleCardFade, marginTop: metrics.spacing.lg }}>
            <View style={[styles.coupleCardContainer, { borderColor: activeColor + '20' }]}>
              <View style={[styles.coupleCardAccent, { backgroundColor: activeColor }]} />
              <View style={styles.coupleCardInner}>
                <View style={styles.coupleCardHeader}>
                  <View style={[styles.coupleCardIconCircle, { backgroundColor: activeBg }]}>
                    <Heart size={12} color={activeColor} fill={activeColor} />
                  </View>
                  <Text style={[styles.coupleCardTitle, { color: activeColor }]}>Couple Insight</Text>
                </View>
                <Text style={styles.coupleCardContent}>{question.cc}</Text>
              </View>
            </View>
          </Animated.View>
        )}

        <View style={{ height: responsiveHeight(16) }} />
      </Animated.View>
    );
  };

  return (
    <ScreenWrapper>
      {/* <ProgressStrip currentDay={3} /> */}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {selectedSetIdx === null ? renderSetSelector() : renderQuestionWizard()}
      </ScrollView>

      {/* Floating Footer CTA (Only in Wizard mode) */}
      {selectedSetIdx !== null && (
        <View style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom + 8, metrics.spacing.md) }
        ]}>
          <GradientButton
            text={currentQuestionIdx === 4 ? "Complete & Continue ✨" : "Next Question →"}
            onPress={handleNext}
            disabled={!answers || answers[currentQuestionIdx] === undefined}
            showArrow={false}
            fullWidth={true}
            gradientColors={colors.gradientBtn}
          />
        </View>
      )}
    </ScreenWrapper>
  );
};

const makeStyles = (c: any, activeColor: string, activeBg: string) => StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingBottom: metrics.spacing.xl,
  },

  // ── Header ──────────────────────────────────────────────
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: metrics.spacing.md,
    marginTop: metrics.spacing.xs,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    alignItems: 'center',
    justifyContent: 'center',

  },
  headerTitle: {
    fontSize: responsiveFontSize(2.6),
    color: c.text,
    fontFamily: fonts.playfairSemiBold,
  },

  // ── Intention Badge ─────────────────────────────────────
  intentionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
    marginBottom: 12,
  },
  intentionBadgeEmoji: {
    fontSize: 14,
  },
  intentionBadgeText: {
    fontSize: 12,
    fontFamily: fonts.dmSansBold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  // ── Prompt / Heading ────────────────────────────────────
  prompt: {
    fontSize: responsiveFontSize(2.8),
    color: c.text,
    fontFamily: fonts.playfairSemiBold,
    lineHeight: responsiveFontSize(2.8) * 1.3,
    marginBottom: 8,
  },
  stemsSubtitle: {
    fontSize: responsiveFontSize(1.7),
    fontFamily: fonts.dmSansRegular,
    color: c.textHint,
    marginBottom: metrics.spacing.lg,
    lineHeight: responsiveFontSize(1.7) * 1.5,
  },

  // ── Set Cards ───────────────────────────────────────────
  setListContainer: {
    gap: 16,
  },
  setCard: {
    backgroundColor: COLORS.bgGlass,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.glassBorderColor,
    overflow: 'hidden',

  },
  setCardDecoRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 6,
  },
  setCardDecoEmoji: {
    fontSize: 18,
  },
  setCardBody: {
    paddingHorizontal: 18,
    paddingBottom: 18,
    paddingTop: 4,
  },
  setCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  setEmojiCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setEmojiText: {
    fontSize: 22,
  },
  setCardTitleCol: {
    flex: 1,
  },
  setTitleText: {
    fontSize: responsiveFontSize(2.1),
    fontFamily: fonts.dmSansBold,
    color: c.text,
    marginBottom: 2,
  },
  setQuestionCount: {
    fontSize: 11,
    fontFamily: fonts.dmSansMedium,
    color: c.textHint,
    letterSpacing: 0.3,
  },
  setArrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setThemeText: {
    fontSize: responsiveFontSize(1.6),
    fontFamily: fonts.dmSansRegular,
    color: c.textSecondary,
    lineHeight: responsiveFontSize(1.6) * 1.55,
    paddingLeft: 56, // align with title text after emoji circle
  },

  // ── Wizard Header ───────────────────────────────────────
  wizardHeaderText: {
    flex: 1,
  },
  wizardHeaderTitle: {
    fontSize: responsiveFontSize(2.3),
    fontFamily: fonts.playfairSemiBold,
    color: c.text,
    marginBottom: 1,
  },
  wizardHeaderSub: {
    fontSize: 11,
    fontFamily: fonts.dmSansMedium,
    color: c.textHint,
    letterSpacing: 0.3,
  },

  // ── Progress ────────────────────────────────────────────
  progressContainer: {
    marginBottom: metrics.spacing.md,
  },
  progressLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontFamily: fonts.dmSansBold,
    letterSpacing: 0.3,
  },
  progressDots: {
    flexDirection: 'row',
    gap: 5,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  progressDotActive: {
    width: 20,
    borderRadius: 4,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },

  // ── Prompt Card (Question) ──────────────────────────────
  promptCard: {
    backgroundColor: COLORS.bgGlass,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.glassBorderColor,
    marginBottom: metrics.spacing.lg,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 3 },
    // shadowOpacity: 0.04,
    // shadowRadius: 10,
    // elevation: 2,
  },
  promptCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  promptIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptLabel: {
    fontSize: 11,
    fontFamily: fonts.dmSansBold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  promptText: {
    fontSize: responsiveFontSize(2.2),
    fontFamily: 'PlayfairDisplay-Italic',
    color: c.text,
    lineHeight: responsiveFontSize(2.2) * 1.4,
  },

  // ── Option Grid ─────────────────────────────────────────
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionCard: {
    width: (responsiveWidth(100) - metrics.layout.screenPaddingHz * 2 - 12) / 2,
    backgroundColor: COLORS.bgGlass,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: COLORS.glassBorderColor,
    paddingVertical: 16,
    paddingHorizontal: 12,
    minHeight: 120,
    position: 'relative',

  },
  optionCardSelected: {
    // shadowOpacity: 0.08,
    // shadowRadius: 12,
    // // elevation: 1,
  },
  optionContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionEmojiCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  optionEmoji: {
    fontSize: 24,
  },
  optionLabel: {
    fontSize: responsiveFontSize(1.6),
    fontFamily: fonts.dmSansMedium,
    color: c.textSecondary,
    textAlign: 'center',
    lineHeight: responsiveFontSize(1.6) * 1.45,
  },
  optionLabelSelected: {
    fontFamily: fonts.dmSansBold,
  },
  selectedCheckCircle: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',

  },

  // ── Couple Card ─────────────────────────────────────────
  coupleCardContainer: {
    backgroundColor: COLORS.bgGlass,
    borderWidth: 1,
    borderColor: COLORS.glassBorderColor,
    borderRadius: 18,
    overflow: 'hidden',
    flexDirection: 'row',

  },
  coupleCardAccent: {
    width: 4,
  },
  coupleCardInner: {
    flex: 1,
    padding: 16,
  },
  coupleCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  coupleCardIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coupleCardTitle: {
    fontSize: 11,
    fontFamily: fonts.dmSansBold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  coupleCardContent: {
    fontSize: responsiveFontSize(1.65),
    color: c.textSecondary,
    fontFamily: fonts.dmSansItalic,
    lineHeight: responsiveFontSize(1.65) * 1.55,
  },

  // ── Footer ──────────────────────────────────────────────
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingTop: metrics.spacing.md,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.04)',
  },
});
