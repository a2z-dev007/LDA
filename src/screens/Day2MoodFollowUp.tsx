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
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { metrics } from '../theme/metrics';
import { typography } from '../theme/typography';
import { Sparkles, MessageCircle } from 'lucide-react-native';
import { DayEndJarModal } from '../components/common/DayEndJarModal';

type Nav = StackNavigationProp<RootStackParamList, 'Day2MoodFollowUp'>;

export const Day2MoodFollowUp: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const day2 = useDayStore((s) => s.day2);
  const completeDay2 = useDayStore((s) => s.completeDay2);
  const addEntry = useJournalStore((s) => s.addEntry);
  const [answer, setAnswer] = useState('');
  const [showJarModal, setShowJarModal] = useState(false);

  const moodData = moodOptions.find((m) => m.id === day2.mood);
  const question = moodData?.followUpQuestion ?? "What's on your mind today?";

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
                <Text style={styles.trackBadgeEmoji}>🤍</Text>
                <Text style={styles.trackBadgeText}>Happiness track · {moodData.label} mood</Text>
              </View>
            </View>
          )}

          <View style={styles.privacyBadge}>
            <Text style={styles.privacyBadgeText}>🔒 This answer stays private — only you can see it.</Text>
          </View>

          <View style={styles.questionContainer}>
            <Text style={styles.question}>"{question}"</Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Write freely — this is just for you..."
            placeholderTextColor={colors.textHint}
            value={answer}
            onChangeText={setAnswer}
            multiline
            textAlignVertical="top"
          />
          
          <View style={styles.helperBox}>
            <Text style={styles.helperTitle}>3 ROTATING QUESTIONS FOR THIS SEGMENT</Text>
            <Text style={styles.helperText}>
              Q1 (shown) · Q2 · Q3 — rotate from pool of 3 per mood segment (Happiness / Sadness / Saturated)
            </Text>
          </View>

        </ScrollView>
        <View style={{ paddingHorizontal: metrics.layout.screenPaddingHz, paddingBottom: metrics.spacing.xl }}>
          <GradientButton
            text="Complete Day 2"
            onPress={handleSave}
            showArrow={true}
            fullWidth={true}
            gradientColors={colors.gradientBtn}
          />
        </View>
      </ScreenWrapper>

      <DayEndJarModal 
        visible={showJarModal}
        currentDay={2}
        onNext={handleModalNext}
      />
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
    backgroundColor: 'rgba(45,212,191,0.1)',
    paddingHorizontal: metrics.spacing.md,
    paddingVertical: metrics.spacing.xs,
    borderRadius: metrics.radius.full,
    borderWidth: 1,
    borderColor: 'rgba(45,212,191,0.2)',
    gap: 6,
  },
  trackBadgeEmoji: { fontSize: 12 },
  trackBadgeText: { ...typography.captionSmall, color: c.primary, fontFamily: 'Inter-SemiBold' },
  privacyBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.03)',
    paddingHorizontal: metrics.spacing.md,
    paddingVertical: metrics.spacing.xs,
    borderRadius: metrics.radius.full,
    marginBottom: metrics.spacing.xl,
  },
  privacyBadgeText: { ...typography.captionSmall, color: c.textSecondary },
  questionContainer: {
    marginBottom: metrics.spacing.lg,
  },
  question: {
    ...typography.displaySmall, 
    color: c.text, 
    fontFamily: 'PlayfairDisplay-Bold',
    lineHeight: responsiveFontSize(3.8),
  },
  input: {
    color: c.text, 
    ...typography.bodyMedium,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1.5, 
    borderColor: 'rgba(255,255,255,0.9)', 
    borderRadius: metrics.radius.lg,
    padding: metrics.spacing.md, 
    minHeight: responsiveHeight(20), 
    lineHeight: 24, 
    marginBottom: metrics.spacing.xl,
  },
  helperBox: {
    padding: metrics.spacing.md,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: metrics.radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  helperTitle: { ...typography.captionSmall, color: c.textHint, fontFamily: 'Inter-SemiBold', letterSpacing: 1, marginBottom: 4 },
  helperText: { ...typography.captionSmall, color: c.textSecondary, lineHeight: 18 },
});
