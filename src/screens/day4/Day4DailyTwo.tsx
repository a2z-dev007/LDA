import React, { useState } from 'react';
import { DayHeader } from '../../components/common/DayHeader';
import {
  View, Text, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/types';
import { ProgressStrip } from '../../components/common/ProgressStrip';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { useAppColors } from '../../theme';
import { metrics } from '../../theme/metrics';
import { typography, fonts } from '../../theme/typography';
import { dailyTwoQuestions } from '../../data/quizData';
import { useDayStore } from '../../store/useDayStore';
import { useJournalStore } from '../../store/useJournalStore';
import { haptics } from '../../utils/haptics';
import { GradientButton } from '../../components/common/GradientButton';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { AIInput } from '../../components/common/AIInput';

type Nav = StackNavigationProp<RootStackParamList, 'Day4DailyTwo'>;

export const Day4DailyTwo: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const day4 = useDayStore((s) => s.day4);
  const setDay4DailyTwo = useDayStore((s) => s.setDay4DailyTwo);
  const addEntry = useJournalStore((s) => s.addEntry);

  const pair = dailyTwoQuestions[new Date().getDay() % dailyTwoQuestions.length];
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');

  const canContinue = answer1.trim().length > 0 || answer2.trim().length > 0;

  const handleDone = () => {
    haptics.success();
    const a1 = answer1.trim();
    const a2 = answer2.trim();
    let status: 'both' | 'one' | 'skipped' = 'skipped';
    if (a1 && a2) status = 'both';
    else if (a1 || a2) status = 'one';
    
    setDay4DailyTwo(a1, a2, status);
    if (a1 || a2) {
      addEntry({ day: 4, type: 'daily2', content: `Q1: ${a1}\nQ2: ${a2}` });
    }
    navigation.navigate('Day4DropBox');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenWrapper>
        <ProgressStrip currentDay={4} />
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <DayHeader eyebrow="Daily Journal" />
          {/* <Text style={styles.title}>Two questions. Two cards.</Text> */}
          <Text style={styles.title}>Your private journal grows here — day by day.</Text>

          {/* Card 1 */}
          <View style={styles.card}>
            <Text style={styles.cardEyebrow}>ABOUT YOU</Text>
            <Text style={styles.cardQuestion}>{pair[0]}</Text>
            <AIInput
              value={answer1}
              onChangeText={setAnswer1}
              context="general"
              question={pair[0]}
              placeholder="Type anything..."
              maxLength={300}
              containerStyle={styles.customAIInputContainer}
              inputStyle={styles.customAIInput}
            />
            <View style={styles.cardFooter}>
              <View style={[styles.tag, answer1.trim().length > 0 ? styles.tagActive : null]}>
                <Text style={[styles.tagText, answer1.trim().length > 0 ? styles.tagTextActive : null]}>
                  {answer1.trim().length > 0 ? 'Tone: Tender ✓' : 'Tone: Pending'}
                </Text>
              </View>
              <Text style={styles.footerNote}>Feeds Day 5 Mood Chart</Text>
            </View>
          </View>

          {/* Card 2 */}
          <View style={styles.card}>
            <Text style={styles.cardEyebrow}>ABOUT YOUR RELATIONSHIP</Text>
            <Text style={styles.cardQuestion}>{pair[1]}</Text>
            <AIInput
              value={answer2}
              onChangeText={setAnswer2}
              context="general"
              question={pair[1]}
              placeholder="Type anything..."
              maxLength={300}
              containerStyle={styles.customAIInputContainer}
              inputStyle={styles.customAIInput}
            />
            <View style={styles.cardFooter}>
              <View style={[styles.tag, answer2.trim().length > 0 ? styles.tagActive : null]}>
                <Text style={[styles.tagText, answer2.trim().length > 0 ? styles.tagTextActive : null]}>
                  {answer2.trim().length > 0 ? 'Tone: Warm ✓' : 'Tone: Pending'}
                </Text>
              </View>
              <Text style={styles.footerNote}>Feeds Day 5 Mood Chart</Text>
            </View>
          </View>

          <Text style={styles.hook}>Tomorrow is Day 5. Your final ritual. Make it count.</Text>
          <View style={{ height: 120 }} />
        </ScrollView>

        {/* Custom bottom button row matching screenshot */}
        <View style={[styles.ctaWrapper, { paddingBottom:metrics.spacing.md}]}>
          {/* <TouchableOpacity
            style={[styles.mainBtn, !canContinue && styles.mainBtnDisabled]}
            onPress={handleDone}
            disabled={!canContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.mainBtnText}>Save to journal →</Text>
          </TouchableOpacity> */}
          <GradientButton
            text="Save to journal "
            onPress={handleDone}
            disabled={!canContinue}
             gradientColors={colors.gradientBtn2}
            
          />
          
          <TouchableOpacity
            style={styles.skipBtn}
            onPress={() => {
              haptics.light();
              setDay4DailyTwo('', '', 'skipped');
              navigation.navigate('Day4DropBox');
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.skipBtnText}>Skip</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: metrics.layout.screenPaddingHz, paddingTop: metrics.spacing.md },
  title: { fontSize:responsiveFontSize(2), color: c.text, fontFamily: 'PlayfairDisplay-Bold', lineHeight: 34, marginBottom: 8 },
  subtitle: { fontSize: 14, color: c.textSecondary, fontFamily: fonts.dmSansRegular, lineHeight: 22, marginBottom: metrics.spacing.lg },
  
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: c.glassBorder || 'rgba(0,0,0,0.06)',
    borderRadius: 20,
    padding: 16,
    marginBottom: metrics.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    gap: 12,
    marginTop: metrics.spacing.sm
  },
  cardEyebrow: {
    fontSize: 10,
    fontFamily: fonts.dmSansBold,
    color: c.textHint || '#9CA3AF',
    letterSpacing: 1.0,
    textTransform: 'uppercase',
  },
  cardQuestion: {
    fontSize: responsiveFontSize(2),
    color: c.text,
    fontFamily: 'PlayfairDisplay-Bold',
    // lineHeight: responsiveHeight(2.4),
  },
  customAIInputContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: c.surfaceBorder,
    borderRadius: 12,
    padding: 12,
    paddingBottom: 8,
    marginBottom: 0,
    marginTop: 4,
  },
  customAIInput: {
    minHeight: 80,
    fontSize: 14,
    lineHeight: 20,
    padding: 0,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  tag: {
    backgroundColor: 'rgba(0,0,0,0.03)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: metrics.radius.sm || 6,
  },
  tagActive: {
    backgroundColor: c.day4 + '15',
  },
  tagText: {
    fontSize: 10,
    fontFamily: fonts.dmSansBold,
    color: c.textHint,
  },
  tagTextActive: {
    color: c.day4,
  },
  footerNote: {
    fontSize: 10,
    fontFamily: fonts.dmSansMedium,
    color: c.textHint,
  },
  hook: {
    color: c.text,
    fontSize: 12,
    fontFamily: fonts.dmSansRegular,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
    lineHeight: 18
  },
  
  // ── CTA Wrapper ─────────────────────────────────────────
  ctaWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingTop: metrics.spacing.md,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.5)',
  },
  mainBtn: {
    backgroundColor: c.primary,
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainBtnDisabled: {
    backgroundColor: c.textHint,
    opacity: 0.5,
  },
  mainBtnText: {
    ...typography.buttonLarge,
    color: '#FFFFFF',
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: metrics.spacing.smMd,
  },
  skipBtnText: {
    fontSize: 12,
    color: c.textHint,
    fontFamily: fonts.dmSansRegular,
    textDecorationLine: 'underline',
  },
});
