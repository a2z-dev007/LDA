import React, { useState } from 'react';
import { DayHeader } from '../components/common/DayHeader';
import { DayCTA } from '../components/common/DayCTA';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { ProgressStrip } from '../components/common/ProgressStrip';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { useAppColors } from '../theme';
import { useDayStore } from '../store/useDayStore';
import { useJournalStore } from '../store/useJournalStore';
import { calculateBadge } from '../services/badgeCalculator';
import { haptics } from '../utils/haptics';
import { Day5Scoring } from '../services/scoring/day5Scoring';

type Nav = StackNavigationProp<RootStackParamList, 'Day5ThePromise'>;

export const Day5ThePromise: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const day5 = useDayStore((s) => s.day5);
  const completeDay5 = useDayStore((s) => s.completeDay5);
  const getDedicationScore = useDayStore((s) => s.getDedicationScore);
  const day1 = useDayStore((s) => s.day1);
  const day2 = useDayStore((s) => s.day2);
  const day3 = useDayStore((s) => s.day3);
  const day4 = useDayStore((s) => s.day4);
  const addEntry = useJournalStore((s) => s.addEntry);
  const [promise, setPromise] = useState('');

  // Pre-calculate badge based on current data for local state reference if needed
  const preCalculated = calculateBadge(day1, day2, day3, day4);

  const handleContinue = () => {
    haptics.success();
    const trimmed = promise.trim();
    if (trimmed) {
      addEntry({ day: 5, type: 'promise', content: trimmed });
    }

    const moodScores = [day1.moodScore, day2.moodScore];
    const avg = moodScores.reduce((a, b) => a + b, 0) / moodScores.length;

    // Run consolidated scoring with the saved Day 5 Promise
    const report = Day5Scoring.consolidate(day1, day2, day3, day4, trimmed || null);

    completeDay5({
      badgeName: report.badge.name,
      badgeTier: report.badgeTier,
      dedicationScore: report.dedicationScore,
      connectionScore: report.connectionScore,
      partnerKnowledgeScore: report.partnerKnowledgeScore,
      promise: trimmed || null,
      letterGenerated: false,
      averageScore: avg,
    });

    navigation.navigate('Day5JarReveal');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScreenWrapper>
        <ProgressStrip currentDay={5} />
        <View style={styles.body}>
          <DayHeader eyebrow="Day 5 · The Promise" />
          <Text style={styles.title}>
            Five days in.
          </Text>
          <Text style={styles.subtitle}>
            One thing you want to do differently from tomorrow.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="From tomorrow, I will…"
            placeholderTextColor={colors.textHint}
            value={promise}
            onChangeText={setPromise}
            multiline
            textAlignVertical="top"
            autoFocus
            maxLength={200}
          />
          <Text style={styles.hint}>
            This becomes the closing statement of your report card.{'\n'}
            Optional to include on your shareable card.
          </Text>
        </View>

        <DayCTA title="{promise.trim() ? 'Save & continue ' : 'Skip '}" onPress={handleContinue} />
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  body: { flex: 1, paddingHorizontal: 28, paddingTop: 24 },
  eyebrow: { color: c.day5, fontSize: 12, fontFamily: 'Inter-SemiBold', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 },
  title: { fontSize: 32, color: c.text, fontFamily: 'PlayfairDisplay-Bold', lineHeight: 42, marginBottom: 8 },
  subtitle: { fontSize: 18, color: c.textSecondary, fontFamily: 'PlayfairDisplay-Italic', lineHeight: 28, marginBottom: 28 },
  input: {
    color: c.text, fontSize: 16, fontFamily: 'Inter-Regular',
    borderWidth: 1, borderColor: c.surfaceBorder, borderRadius: 12,
    padding: 16, minHeight: 120, lineHeight: 24, marginBottom: 16,
  },
  hint: { color: c.textHint, fontSize: 13, fontFamily: 'Inter-Regular', lineHeight: 20 },
});
