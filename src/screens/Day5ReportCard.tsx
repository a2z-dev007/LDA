import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { ProgressStrip } from '../components/common/ProgressStrip';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { colors } from '../theme';
import { useDayStore } from '../store/useDayStore';
import { useJournalStore } from '../store/useJournalStore';
import { personalityTypes } from '../data/personalityTypes';
import { moodOptions } from '../data/quizData';
import { haptics } from '../utils/haptics';

type Nav = StackNavigationProp<RootStackParamList, 'Day5ReportCard'>;

const DAY_COLORS = [colors.day1, colors.day2, colors.day3, colors.day4, colors.day5];
const DAY_LABELS = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'];

export const Day5ReportCard: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const day1 = useDayStore((s) => s.day1);
  const day2 = useDayStore((s) => s.day2);
  const day3 = useDayStore((s) => s.day3);
  const day4 = useDayStore((s) => s.day4);
  const entries = useJournalStore((s) => s.entries);

  const personality = personalityTypes.find((p) => p.id === day1.personalityType);
  const moodScores = [day1.moodScore, day2.moodScore, day2.moodScore, day2.moodScore, day2.moodScore];
  const maxScore = 10;

  // Mood chart insight
  const avg = moodScores.reduce((a, b) => a + b, 0) / moodScores.length;
  const moodInsight = avg >= 7
    ? "Your connection stayed strong all week. That's rare and worth protecting."
    : avg >= 5
    ? "Your mood moved through the week. That's honest. That's human."
    : "You showed up even when it was hard. That's the whole point.";

  return (
    <ScreenWrapper>
      <ProgressStrip currentDay={5} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Your 5-Day Report</Text>

        {/* Section 1 — Mood Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>01 · Connection Over Time</Text>
          <View style={styles.chart}>
            {moodScores.map((score, i) => (
              <View key={i} style={styles.barContainer}>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, {
                    height: `${(score / maxScore) * 100}%`,
                    backgroundColor: DAY_COLORS[i],
                  }]} />
                </View>
                <Text style={[styles.barLabel, { color: DAY_COLORS[i] }]}>{DAY_LABELS[i].replace('Day ', 'D')}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.chartInsight}>"{moodInsight}"</Text>
        </View>

        {/* Section 2 — Personality Deep Dive */}
        {personality && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>02 · Your Relationship Type</Text>
            <View style={[styles.personalityCard, { borderColor: personality.color }]}>
              <Text style={[styles.personalityName, { color: personality.color }]}>{personality.name}</Text>
              <View style={styles.strengthsList}>
                {personality.traits.map((t, i) => (
                  <View key={i} style={styles.strengthRow}>
                    <Text style={[styles.strengthBullet, { color: personality.color }]}>✦</Text>
                    <Text style={styles.strengthText}>{t}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.growthBox}>
                <Text style={styles.growthLabel}>Growth area</Text>
                <Text style={styles.growthText}>{personality.growth}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Section 3 — Week in Moments */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>03 · Week in Moments</Text>
          {entries.length > 0 ? (
            entries.map((entry, i) => (
              <View key={entry.id} style={styles.journalEntry}>
                <View style={[styles.entryDot, { backgroundColor: DAY_COLORS[entry.day - 1] ?? colors.primary }]} />
                <View style={styles.entryContent}>
                  <Text style={styles.entryDay}>Day {entry.day}</Text>
                  {entry.intentionWord && (
                    <View style={styles.intentionPill}>
                      <Text style={styles.intentionPillText}>{entry.intentionWord}</Text>
                    </View>
                  )}
                  <Text style={styles.entryText}>"{entry.content}"</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Your private reflections from the week.</Text>
          )}
        </View>

        {/* Section 4 — Memory Jar Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>04 · Memory Jar</Text>
          <View style={styles.jarPreview}>
            <Text style={styles.jarIcon}>🫙</Text>
            <Text style={styles.jarPreviewText}>Full reveal on the next screen.</Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.cta}
        activeOpacity={0.85}
        onPress={() => {
          haptics.medium();
          navigation.navigate('Day5ThePromise');
        }}
      >
        <Text style={styles.ctaLabel}>Continue →</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: { padding: 28, paddingBottom: 16 },
  title: { fontSize: 28, color: '#FFFFFF', fontFamily: 'PlayfairDisplay-Bold', marginBottom: 28 },
  section: { marginBottom: 32 },
  sectionLabel: {
    color: 'rgba(255,255,255,0.35)', fontSize: 11, fontFamily: 'Inter-SemiBold',
    letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 16,
  },
  chart: { flexDirection: 'row', height: 120, gap: 8, alignItems: 'flex-end', marginBottom: 16 },
  barContainer: { flex: 1, alignItems: 'center', gap: 6 },
  barTrack: { flex: 1, width: '100%', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 4, justifyContent: 'flex-end' },
  barFill: { width: '100%', borderRadius: 4, minHeight: 4 },
  barLabel: { fontSize: 10, fontFamily: 'Inter-SemiBold' },
  chartInsight: { color: 'rgba(255,255,255,0.6)', fontSize: 15, fontFamily: 'PlayfairDisplay-Italic', lineHeight: 24, textAlign: 'center' },
  personalityCard: { borderWidth: 1.5, borderRadius: 16, padding: 20, gap: 16 },
  personalityName: { fontSize: 22, fontFamily: 'PlayfairDisplay-Bold' },
  strengthsList: { gap: 8 },
  strengthRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  strengthBullet: { fontSize: 12, lineHeight: 22 },
  strengthText: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontFamily: 'Inter-Regular', flex: 1, lineHeight: 22 },
  growthBox: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: 14 },
  growthLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'Inter-SemiBold', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 },
  growthText: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontFamily: 'Inter-Regular', lineHeight: 22 },
  journalEntry: { flexDirection: 'row', gap: 14, marginBottom: 16 },
  entryDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  entryContent: { flex: 1, gap: 6 },
  entryDay: { color: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'Inter-SemiBold', letterSpacing: 1, textTransform: 'uppercase' },
  intentionPill: {
    alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 100, paddingHorizontal: 10, paddingVertical: 3,
  },
  intentionPillText: { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: 'Inter-SemiBold' },
  entryText: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontFamily: 'PlayfairDisplay-Italic', lineHeight: 22 },
  emptyText: { color: 'rgba(255,255,255,0.3)', fontSize: 14, fontFamily: 'Inter-Regular', fontStyle: 'italic' },
  jarPreview: {
    backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: 24,
    alignItems: 'center', gap: 12,
  },
  jarIcon: { fontSize: 48 },
  jarPreviewText: { color: 'rgba(255,255,255,0.4)', fontSize: 14, fontFamily: 'Inter-Regular' },
  cta: {
    backgroundColor: colors.day5, marginHorizontal: 28, marginBottom: 48,
    paddingVertical: 18, borderRadius: 100, alignItems: 'center',
  },
  ctaLabel: { color: colors.dark, fontSize: 17, fontFamily: 'Inter-SemiBold', letterSpacing: 0.3 },
});
