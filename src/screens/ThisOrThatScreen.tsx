import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Modal,
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
import { useJournalStore } from '../store/useJournalStore';
import { GradientButton } from '../components/common/GradientButton';

import { thisOrThatSets, ThisOrThatQuestion } from '../data/thisOrThatData';
import { JarEnvelopeAnimation } from '../components/common/JarEnvelopeAnimation';



import { ChevronLeft, Sparkles, Lock, UserPlus, Share2 } from 'lucide-react-native';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

type Nav = StackNavigationProp<RootStackParamList, 'ThisOrThat'>;

const DotsIndicator: React.FC<{ current: number; total: number; colors: any }> = ({ current, total, colors }) => (
  <View style={{ flexDirection: 'row', gap: 6, marginVertical: 12 }}>
    {Array.from({ length: total }).map((_, i) => (
      <View
        key={i}
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: i <= current ? colors.primary : 'rgba(0,0,0,0.1)',
          opacity: i === current ? 1 : 0.4,
        }}
      />
    ))}
  </View>
);


export const ThisOrThatScreen: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const setB2ThisOrThat = useDayStore((s) => s.setB2ThisOrThat);

  const intentionWord = useDayStore((s) => s.day2.intentionWord) || 'Present';
  const activeSet = thisOrThatSets[intentionWord] || thisOrThatSets.Present;
  const thisOrThatQuestions = activeSet.questions;

  const [currentRound, setCurrentRound] = useState(0);
  const [picks, setPicks] = useState<string[]>([]);
  const [showQuote, setShowQuote] = useState(false);
  const jarRef = useRef<any>(null);
  const jarEntranceAnim = useRef(new Animated.Value(0)).current;

  const jarMemories = useJournalStore((s) => s.jarMemories);
  const addJarMemory = useJournalStore((s) => s.addJarMemory);
  const initialJarCount = jarMemories.length;



  const totalQuestions = thisOrThatQuestions.length;
  const isFinished = currentRound >= totalQuestions;
  const currentQuestionIndex = currentRound;

  // Animation for the jar when finished
  useEffect(() => {
    if (isFinished) {
      // 1. Reset and Fade in the jar first
      jarEntranceAnim.setValue(0);
      Animated.timing(jarEntranceAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();

      // 2. Trigger the envelope animation after it has appeared
      const timer = setTimeout(() => {
        if (jarRef.current) {
          jarRef.current.triggerEnvelope(() => {
            addJarMemory({
              content: `This or That: ${intentionWord} Edition Complete`,
              type: 'text',
              tinyCompliment: null,
              dayColor: colors.primary,
            });
          });
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isFinished]);

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
    newPicks[currentRound] = optionText;
    setPicks(newPicks);
    
    // Show quote after selection
    setTimeout(() => {
      setShowQuote(true);
    }, 400);
  };

  const handleNextRound = () => {
    setShowQuote(false);
    triggerTransition(() => {
      const isLastRound = currentRound === totalQuestions - 1;
      if (isLastRound) {
        const finalRounds = thisOrThatQuestions.map((q, idx) => ({
          round: idx + 1,
          my_pick: picks[idx] || '',
          my_pred_of_partner: '', // Removed prediction phase
        }));
        useDayStore.getState().setB2ThisOrThat(finalRounds);
        setCurrentRound(totalQuestions);
      } else {
        setCurrentRound((p) => p + 1);
      }
    });
  };






  const handleFinish = () => {
    haptics.heavy();
    navigation.navigate('Day2MoodPicker');
  };

  const handleBack = () => {
    if (currentRound > 0) {
      triggerTransition(() => {
        setCurrentRound((p) => p - 1);
      });
    } else {
      navigation.goBack();
    }
  };



  // Progress percentage
  const progress = isFinished ? 1 : currentRound / totalQuestions;




  return (
    <ScreenWrapper>
      {/* Top Header */}
      <View style={[styles.topHeader]}>
        <TouchableOpacity
          style={styles.backBtnHeader}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <ChevronLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>This or That: Us Edition</Text>
      </View>




      <Animated.ScrollView
        style={[styles.container, { opacity: fadeAnim }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >


        <View style={styles.centeredContent}>
        {!isFinished ? (
          <>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>3 quick rounds</Text>
              <Text style={styles.subtitle}>
                {currentRound === 0 ? activeSet.intro : "Pick yours — then see what it reveals."}
              </Text>


              <DotsIndicator current={currentRound} total={totalQuestions} colors={colors} />

              <View style={styles.promptBox}>
                <Text style={styles.promptText}>{currentQuestion.prompt}</Text>
              </View>

            </View>




            {/* Options */}
            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option) => {
                const isSelected = picks[currentQuestionIndex] === option.text;
                const borderColor = isSelected ? colors.primary : 'rgba(255,255,255,0.9)';


                return (
                  <TouchableOpacity
                    key={option.text}
                    style={[styles.optionCard, { borderColor }]}
                    onPress={() => handleSelect(option.text)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.optionEmoji}>{option.emoji}</Text>
                    <Text style={styles.optionText}>{option.text}</Text>
                    <Text style={styles.optionSubtext}>{option.subtext}</Text>
                  </TouchableOpacity>

                );
              })}
            </View>


            {/* Phase Indicators */}
            <View style={styles.phaseIndicatorWrapper}>
              {!picks[currentRound] ? (
                <Text style={styles.tapPrompt}>Tap your preference</Text>
              ) : (
                <Text style={styles.tapPrompt}>✓ Selected</Text>
              )}
            </View>


            {/* Bottom Progress Indicator */}
            <View style={styles.bottomProgressWrapper}>
               <View style={styles.progressLine} />
               <Text style={styles.bottomRoundIndicator}>
                 ROUND {currentRound + 1} OF {totalQuestions}
               </Text>
            </View>


          </>
        ) : (
          <>

            {/* Results Screen */}
            <View style={styles.header}>
              <Animated.View 
                style={[
                  styles.resultJarPos, 
                  { 
                    opacity: jarEntranceAnim,
                    transform: [{ 
                      translateY: jarEntranceAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0]
                      })
                    }]
                  }
                ]}
              >
                <JarEnvelopeAnimation ref={jarRef} initialCount={initialJarCount} />
              </Animated.View>
              <Text style={styles.title}>All 3 rounds done 🎉</Text>
              <Text style={styles.subtitle}>Their answers are sealed — reveal when they join.</Text>
              
              <DotsIndicator current={2} total={3} colors={colors} />
            </View>

            <View style={styles.sealedCardsRow}>
              {[1, 2, 3].map((r) => (
                <View key={r} style={styles.sealedCard}>
                  <Lock size={20} color={colors.textHint} />
                  <Text style={styles.sealedCardTitle}>Round {r}</Text>
                  <Text style={styles.sealedCardSub}>Sealed</Text>
                </View>
              ))}
            </View>

            <View style={styles.resultInfoBox}>
              <Text style={styles.resultInfoText}>
                Their answers reveal when they join. Never shown to you again until reveal.
              </Text>
            </View>

            <View style={styles.ctaGroup}>
              <GradientButton
                text="Enter Day 2"
                onPress={handleFinish}
                showArrow={true}
                fullWidth={true}
              />
            </View>





          </>
        )}
        </View>
      </Animated.ScrollView>


      {/* Quote Modal */}
      <Modal
        visible={showQuote}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowQuote(false)}
      >
        <View style={styles.quoteOverlay}>
          <Animated.View 
            style={[
              styles.quoteCard,
              {
                transform: [
                  { translateY: 0 }
                ]
              }
            ]}
          >
            <View style={styles.quoteIconBox}>
              <Sparkles size={24} color={colors.primary} />
            </View>
            <Text style={styles.quoteTitle}>Couple Insight</Text>
            <Text style={styles.quoteText}>{currentQuestion?.coupleCard}</Text>
            <GradientButton
              text={currentRound === totalQuestions - 1 ? 'Finish Activity' : 'Next Round'}
              onPress={handleNextRound}
              showArrow={true}
              style={{ width: '100%', marginTop: metrics.spacing.md }}
            />
          </Animated.View>
        </View>
      </Modal>

    </ScreenWrapper>

  );
};

const makeStyles = (c: any) => StyleSheet.create({
  topHeader: {

    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: metrics.layout.screenPaddingHz,
    height: 60,
    zIndex: 20,
  },
  resultJarPos: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    marginBottom: 10,
  },





  backBtnHeader: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    ...typography.bodyBold,
    color: c.text,
    fontFamily: fonts.dmSansBold,
  },
  container: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingBottom: metrics.spacing.xxl,
    paddingTop: 20,
    position: 'relative',
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
  },


  header: {
    alignItems: 'center',
    marginBottom: metrics.spacing.xl,
  },
  title: {
    ...typography.h3,
    color: c.text,
    fontFamily: fonts.dmSansBold,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    ...typography.bodySmall,
    color: c.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  categoryLabel: {
    ...typography.captionSmall,
    color: c.textHint,
    fontFamily: fonts.dmSansBold,
    letterSpacing: 2,
    marginTop: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: metrics.spacing.md,
    justifyContent: 'space-between',
    alignItems: 'stretch',
    marginBottom: metrics.spacing.lg,
  },
  optionCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: metrics.radius.xl,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: metrics.spacing.lg,
    gap: metrics.spacing.md,
    minHeight: responsiveWidth(48),
  },

  optionEmoji: {
    fontSize: responsiveFontSize(4.5),
  },
  optionText: {
    ...typography.bodyBold,
    color: c.text,
    textAlign: 'center',
  },
  optionSubtext: {
    ...typography.captionSmall,
    color: c.textHint,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 14,
    letterSpacing: 0,
  },

  promptBox: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  promptText: {
    ...typography.bodyLarge,
    color: c.text,
    fontFamily: 'PlayfairDisplay-Italic',
    textAlign: 'center',
    lineHeight: 24,
  },

  phaseIndicatorWrapper: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: metrics.spacing.xxl,
  },
  tapPrompt: {
    ...typography.caption,
    color: c.textHint,
    fontStyle: 'italic',
  },
  predictNextLink: {
    paddingVertical: 4,
  },
  predictNextText: {
    ...typography.bodySmall,
    color: c.primary,
  },
  predictPrompt: {
    ...typography.bodySmall,
    color: '#F87171',
  },
  quoteOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: metrics.spacing.xl,
  },

  quoteCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: metrics.spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  quoteIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(45,212,191,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: metrics.spacing.lg,
  },
  quoteTitle: {
    ...typography.caption,
    color: c.primary,
    fontFamily: fonts.dmSansBold,
    letterSpacing: 1.5,
    marginBottom: metrics.spacing.md,
  },
  quoteText: {
    ...typography.bodyLarge,
    color: c.text,
    fontFamily: 'PlayfairDisplay-Italic',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: metrics.spacing.xl,
  },
  quoteNextBtn: {
    width: '100%',
    marginTop: metrics.spacing.md,
  },

  bottomProgressWrapper: {
    alignItems: 'center',
    marginTop: metrics.spacing.xl,
  },

  progressLine: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.08)',
    marginBottom: metrics.spacing.md,
  },
  bottomRoundIndicator: {
    ...typography.captionSmall,
    color: c.textHint,
    letterSpacing: 1.5,
  },

  // Results Styles
  sealedCardsRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    marginBottom: metrics.spacing.xl,
  },
  sealedCard: {
    width: responsiveWidth(26),
    height: responsiveWidth(30),
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  sealedCardTitle: {
    fontSize: 10,
    fontFamily: fonts.dmSansBold,
    color: c.text,
  },
  sealedCardSub: {
    fontSize: 9,
    fontFamily: fonts.dmSansMedium,
    color: c.textHint,
  },
  resultInfoBox: {
    paddingHorizontal: metrics.spacing.xl,
    marginBottom: metrics.spacing.xxl,
  },
  resultInfoText: {
    ...typography.caption,
    color: c.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  ctaGroup: {
    gap: 12,
    alignItems: 'center',
  },
  enterDay2Btn: {
    width: '100%',
  },

});
