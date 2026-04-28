import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { ProgressStrip } from '../components/common/ProgressStrip';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { useAppColors } from '../theme';
import { dailyTwoQuestions } from '../data/quizData';
import { useDayStore } from '../store/useDayStore';
import { useJournalStore } from '../store/useJournalStore';
import { haptics } from '../utils/haptics';
import { memoryRef } from './Day4MemoryJar';

type Nav = StackNavigationProp<RootStackParamList, 'Day4DailyTwo'>;

export const Day4DailyTwo: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const completeDay4 = useDayStore((s) => s.completeDay4);
  const day4 = useDayStore((s) => s.day4);
  const addEntry = useJournalStore((s) => s.addEntry);

  const pair = dailyTwoQuestions[new Date().getDay() % dailyTwoQuestions.length];
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');

  const canContinue = answer1.trim().length > 0 || answer2.trim().length > 0;
  const daily2Status = answer1.trim() && answer2.trim() ? 'both' : canContinue ? 'one' : 'skipped';

  const handleDone = () => {
    haptics.success();
    const a1 = answer1.trim();
    const a2 = answer2.trim();
    if (a1 || a2) {
      addEntry({ day: 4, type: 'daily2', content: `Q1: ${a1}\nQ2: ${a2}` });
    }
    completeDay4({
      memoryContent: memoryRef.current || null,
      memoryType: memoryRef.current ? 'text' : 'skipped',
      tinyComplimentWord: day4.tinyComplimentWord,
      daily2Q1: a1,
      daily2Q2: a2,
      daily2Status,
      dropBoxUsed: day4.dropBoxUsed,
      dropBoxReframedText: day4.dropBoxReframedText,
    });
    navigation.navigate('Day4TriviaFact');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScreenWrapper backgroundColor="#110A1A">
        <ProgressStrip currentDay={4} />
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.eyebrow}>The Daily 2</Text>
          <Text style={styles.title}>Two questions.{'\n'}Both for you.</Text>
          <Text style={styles.subtitle}>Private. No one will read them but you.</Text>

          <View style={styles.questionBlock}>
            <Text style={styles.qNumber}>01</Text>
            <Text style={styles.qText}>{pair[0]}</Text>
            <TextInput
              style={styles.input}
              placeholder="Your answer…"
              placeholderTextColor="rgba(255,255,255,0.2)"
              value={answer1}
              onChangeText={setAnswer1}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.questionBlock}>
            <Text style={styles.qNumber}>02</Text>
            <Text style={styles.qText}>{pair[1]}</Text>
            <TextInput
              style={styles.input}
              placeholder="Your answer…"
              placeholderTextColor="rgba(255,255,255,0.2)"
              value={answer2}
              onChangeText={setAnswer2}
              multiline
              textAlignVertical="top"
            />
          </View>

          <Text style={styles.hook}>Tomorrow is Day 5. Your final ritual. Make it count.</Text>
        </ScrollView>

        <TouchableOpacity
          style={[styles.cta, !canContinue && styles.ctaDim]}
          activeOpacity={0.85}
          onPress={handleDone}
        >
          <Text style={styles.ctaLabel}>{canContinue ? 'Save & continue →' : 'Skip for now'}</Text>
        </TouchableOpacity>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 28, paddingBottom: 8 },
  eyebrow: { color: c.day4, fontSize: 12, fontFamily: 'Inter-SemiBold', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 },
  title: { fontSize: 26, color: c.text, fontFamily: 'PlayfairDisplay-Bold', lineHeight: 36, marginBottom: 10 },
  subtitle: { fontSize: 14, color: c.textHint, fontFamily: 'Inter-Regular', lineHeight: 22, marginBottom: 32 },
  questionBlock: { marginBottom: 8 },
  qNumber: { color: c.day4, fontSize: 12, fontFamily: 'Inter-SemiBold', letterSpacing: 1, marginBottom: 8 },
  qText: { fontSize: 18, color: c.text, fontFamily: 'PlayfairDisplay-Italic', lineHeight: 28, marginBottom: 14 },
  input: {
    color: c.text, fontSize: 15, fontFamily: 'Inter-Regular',
    borderWidth: 1, borderColor: c.surfaceBorder, borderRadius: 12,
    padding: 14, minHeight: 80, lineHeight: 22,
  },
  divider: { height: 1, backgroundColor: c.surface, marginVertical: 24 },
  hook: { color: c.textHint, fontSize: 13, fontFamily: 'Inter-Regular', textAlign: 'center', marginTop: 24, marginBottom: 8, lineHeight: 20 },
  cta: {
    backgroundColor: c.day4, marginHorizontal: 28, marginBottom: 48,
    paddingVertical: 18, borderRadius: 100, alignItems: 'center',
  },
  ctaDim: { opacity: 0.5 },
  ctaLabel: { color: c.text, fontSize: 17, fontFamily: 'Inter-SemiBold', letterSpacing: 0.3 },
});
