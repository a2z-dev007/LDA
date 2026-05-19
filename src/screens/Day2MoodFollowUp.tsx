import React, { useState } from 'react';
import { GradientButton } from '../components/common/GradientButton';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { ProgressStrip } from '../components/common/ProgressStrip';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { useAppColors } from '../theme';
import { moodOptions } from '../data/quizData';
import { useDayStore } from '../store/useDayStore';
import { useJournalStore } from '../store/useJournalStore';
import { haptics } from '../utils/haptics';
import { DayHeader } from '../components/common/DayHeader';
import { Day2Scoring } from '../services/scoring/day2Scoring';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { metrics } from '../theme/metrics';
import { typography, fonts } from '../theme/typography';
import { Sparkles, MessageCircle, Heart, Lock, ArrowRight } from 'lucide-react-native';


type Nav = StackNavigationProp<RootStackParamList, 'Day2MoodFollowUp'>;

export const Day2MoodFollowUp: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const day2 = useDayStore((s) => s.day2);
  const completeDay2 = useDayStore((s) => s.completeDay2);
  const addEntry = useJournalStore((s) => s.addEntry);
  const [answer, setAnswer] = useState('');

  const moodData = React.useMemo(() => 
    moodOptions.find((m) => m.id === day2.mood), 
    [day2.mood]
  );

  const question = React.useMemo(() => {
    if (day2.mood === 'connected') {
      return "What is it about how they show up for you lately that's made you feel most seen?";
    }
    if (!moodData) return "What's on your mind today?";
    return moodData.followUpQuestion;
  }, [moodData, day2.mood]);

  const handleSave = () => {
    haptics.success();
    const trimmed = answer.trim();
    if (trimmed) {
      addEntry({ day: 2, type: 'followup', content: trimmed, intentionWord: day2.intentionWord });
    }
    completeDay2(
      day2.mood,
      moodData?.moodScore ?? 5,
      question,
      trimmed
    );

    // Calculate and Log Day 2 Scoring output for debugging
    const updatedDay2 = useDayStore.getState().day2;
    const scoringResult = Day2Scoring.calculate(updatedDay2);
    console.log('=== [DEBUG] Day 2 Completion Scoring & Local Storage Log ===');
    console.log('Day 2 Data in Local Storage:', JSON.stringify(updatedDay2, null, 2));
    console.log('Day 2 Calculated Scoring Result:', JSON.stringify(scoringResult, null, 2));
    console.log('===========================================================');

    navigation.navigate('Day2Result');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenWrapper>
        <ProgressStrip currentDay={2} />
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <DayHeader eyebrow="A little deeper" />
          
          {moodData && (
            <View style={styles.badgeRow}>
              <View style={styles.trackBadge}>
                <Heart size={14} color={colors.primary} fill={colors.primary} opacity={0.6} />
                <Text style={styles.trackBadgeText}>Happiness track · {moodData.label} mood</Text>
              </View>
            </View>
          )}





          <View style={styles.questionContainer}>
            <Text style={styles.question}>"{question}"</Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Write freely — this is just for you..."
              placeholderTextColor={colors.textHint}
              value={answer}
              onChangeText={setAnswer}
              multiline
              textAlignVertical="top"
            />
            <View style={styles.charCountRow}>
              <Text style={styles.charCountText}>
                {answer.length} / — chars · Goal ≥ 60 for Expressive signal
              </Text>
            </View>
          </View>

          <View style={styles.privacyBadge}>
            <Lock size={14} color={colors.textSecondary} opacity={0.6} />
            <Text style={styles.privacyBadgeText}>This answer stays private — only you can see it.</Text>
          </View>

        </ScrollView>
        <View style={styles.footer}>
          <GradientButton
            text="Complete Day 2"
            onPress={handleSave}
            showArrow={true}
            fullWidth={true}
            gradientColors={colors.gradientBtn}
          />
        </View>
      </ScreenWrapper>


    </KeyboardAvoidingView>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: metrics.layout.screenPaddingHz, paddingBottom: metrics.spacing.lg, paddingTop: metrics.spacing.md },
  badgeRow: { marginBottom: metrics.spacing.sm },
  trackBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(45,212,191,0.08)',
    paddingHorizontal: metrics.spacing.md,
    paddingVertical: metrics.spacing.xs,
    borderRadius: metrics.radius.full,
    borderWidth: 1,
    borderColor: 'rgba(45,212,191,0.15)',
    gap: 8,
  },
  trackBadgeText: { ...typography.captionSmall, color: c.primary, fontFamily: 'Inter-SemiBold', letterSpacing: 0 },
  privacyBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
    paddingHorizontal: metrics.spacing.md,
    paddingVertical: metrics.spacing.xs,
    borderRadius: metrics.radius.full,
    marginBottom: metrics.spacing.xl,
    gap: 8,
  },
  privacyBadgeText: { ...typography.captionSmall, color: c.textSecondary, letterSpacing: 0 },
  questionContainer: {
    marginBottom: metrics.spacing.lg,
  },
  question: {
    ...typography.displaySmall, 
    color: c.text, 
    fontFamily: 'PlayfairDisplay-Bold',
    lineHeight: responsiveFontSize(3.8),
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: metrics.radius.xl,
    padding: metrics.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    marginBottom: metrics.spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 1,
  },
  input: {
    color: c.text, 
    ...typography.bodyMedium,
    minHeight: responsiveHeight(15), 
    lineHeight: 24, 
    textAlignVertical: 'top',
  },
  charCountRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: metrics.spacing.sm,
    marginTop: metrics.spacing.sm,
  },
  charCountText: {
    ...typography.captionSmall,
    color: c.textHint,
    letterSpacing: 0,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingBottom: metrics.spacing.xl,
  },

});
