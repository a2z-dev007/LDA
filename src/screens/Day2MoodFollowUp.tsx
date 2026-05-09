import React, { useState } from 'react';
import { DayCTA } from '../components/common/DayCTA';
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
          <DayHeader eyebrow="Day 2 · Reflection" />
          
          {moodData && (
            <View style={styles.moodBadge}>
              <View style={styles.moodIconCircle}>
                <Text style={styles.moodEmoji}>{moodData.emoji}</Text>
              </View>
              <View>
                <Text style={styles.moodLabel}>CURRENT MOOD</Text>
                <Text style={[styles.moodText, { color: moodData.color }]}>{moodData.label} ✨</Text>
              </View>
            </View>
          )}

          <View style={styles.questionContainer}>
            <MessageCircle size={metrics.iconSize.sm} color={colors.primary} style={{marginBottom: 8}} />
            <Text style={styles.question}>{question}</Text>
          </View>

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

        <DayCTA title="{answer.trim() ? 'Save & continue' : 'Skip for today'}" onPress={handleSave} />
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: metrics.layout.screenPaddingHz, paddingBottom: metrics.spacing.lg, paddingTop: metrics.spacing.md },
  moodBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: metrics.spacing.md, 
    marginBottom: metrics.spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: metrics.spacing.smMd,
    borderRadius: metrics.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  moodIconCircle: {
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    borderRadius: responsiveWidth(6),
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  moodEmoji: { fontSize: responsiveFontSize(3.5) },
  moodLabel: { ...typography.captionSmall, color: c.textHint, letterSpacing: 1 },
  moodText: { ...typography.bodyBold, fontSize: responsiveFontSize(2.2) },
  questionContainer: {
    marginBottom: metrics.spacing.md,
  },
  question: {
    ...typography.displaySmall, 
    color: c.text, 
    fontFamily: 'PlayfairDisplay-Italic',
    lineHeight: responsiveFontSize(4),
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
    marginBottom: metrics.spacing.sm,
    shadowColor: '#2DD4BF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 1,
  },
  privacy: { color: c.textHint, ...typography.caption, textAlign: 'center', marginTop: metrics.spacing.xs },
});
