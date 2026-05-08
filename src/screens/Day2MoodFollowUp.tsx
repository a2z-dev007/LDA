import React, { useState } from 'react';
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

type Nav = StackNavigationProp<RootStackParamList, 'Day2MoodFollowUp'>;

export const Day2MoodFollowUp: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const day2 = useDayStore((s) => s.day2);
  const completeDay2 = useDayStore((s) => s.completeDay2);
  const addEntry = useJournalStore((s) => s.addEntry);
  const [answer, setAnswer] = useState('');

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
    navigation.navigate('Home');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScreenWrapper>
        <ProgressStrip currentDay={2} />
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {moodData && (
            <View style={styles.moodBadge}>
              <Text style={styles.moodEmoji}>{moodData.emoji}</Text>
              <Text style={[styles.moodText, { color: moodData.color }]}>{moodData.label}</Text>
            </View>
          )}

          <Text style={styles.question}>{question}</Text>

          <TextInput
            style={styles.input}
            placeholder="Write whatever comes to mind…"
            placeholderTextColor={colors.textHint}
            value={answer}
            onChangeText={setAnswer}
            multiline
            textAlignVertical="top"
            autoFocus
          />
          <Text style={styles.privacy}>🔒 Stored only on this phone. Never shared.</Text>
        </ScrollView>

        <TouchableOpacity style={styles.ctaTouch} activeOpacity={0.85} onPress={handleSave}>
          <LinearGradient colors={[colors.buttonGradientStart, colors.buttonGradientEnd]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cta}>
            <Text style={styles.ctaLabel}>{answer.trim() ? 'Save & continue' : 'Skip for today'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 28, paddingBottom: 8 },
  moodBadge: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 24 },
  moodEmoji: { fontSize: 28 },
  moodText: { fontSize: 18, fontFamily: 'Inter-SemiBold' },
  question: {
    fontSize: 22, color: c.text, fontFamily: 'PlayfairDisplay-Italic',
    lineHeight: 32, marginBottom: 28,
  },
  input: {
    color: c.text, fontSize: 16, fontFamily: 'Inter-Regular',
    borderWidth: 1, borderColor: c.surfaceBorder, borderRadius: 12,
    padding: 16, minHeight: 140, lineHeight: 24, marginBottom: 12,
  },
  privacy: { color: c.textHint, fontSize: 12, fontFamily: 'Inter-Regular' },
  ctaTouch: { marginHorizontal: 28, marginBottom: 48, borderRadius: 100, shadowColor: c.glowPrimary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8 },
  cta: { paddingVertical: 18, borderRadius: 100, alignItems: 'center' },
  ctaLabel: { color: c.onPrimary, fontSize: 17, fontFamily: 'Inter-SemiBold', letterSpacing: 0.3 },
});
