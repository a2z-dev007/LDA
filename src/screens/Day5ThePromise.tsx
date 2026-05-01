import React, { useState } from 'react';
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

  const dedicationScore = getDedicationScore() + (promise.trim() ? 0.5 : 0);  const badgeResult = calculateBadge(day1, day2, day3, day4, dedicationScore);

  const handleContinue = () => {
    haptics.success();
    const trimmed = promise.trim();
    if (trimmed) {
      addEntry({ day: 5, type: 'promise', content: trimmed });
    }

    const moodScores = [day1.moodScore, day2.moodScore];
    const avg = moodScores.reduce((a, b) => a + b, 0) / moodScores.length;

    completeDay5({
      badgeName: badgeResult.badge.name,
      badgeTier: badgeResult.tier,
      dedicationScore,
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
          <Text style={styles.eyebrow}>Day 5 · The Promise</Text>
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

        <TouchableOpacity style={styles.ctaTouch} activeOpacity={0.85} onPress={handleContinue}>
          <LinearGradient colors={[colors.buttonGradientStart, colors.buttonGradientEnd]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cta}>
            <Text style={styles.ctaLabel}>{promise.trim() ? 'Save & continue →' : 'Skip →'}</Text>
          </LinearGradient>
        </TouchableOpacity>
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
  ctaTouch: { marginHorizontal: 28, marginBottom: 48, borderRadius: 100, shadowColor: c.glowPrimary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8 },
  cta: { paddingVertical: 18, borderRadius: 100, alignItems: 'center' },
  ctaLabel: { color: c.onPrimary, fontSize: 17, fontFamily: 'Inter-SemiBold', letterSpacing: 0.3 },
});
