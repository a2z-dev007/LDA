import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { StreakRing } from '../components/common/StreakRing';
import { IntentionWordSelector } from '../components/common/IntentionWordSelector';
import { colors } from '../theme';
import { bridgeQuotes, moodOptions } from '../data/quizData';
import { useDayStore } from '../store/useDayStore';
import { useStreakStore } from '../store/useStreakStore';
import { haptics } from '../utils/haptics';

type Nav = StackNavigationProp<RootStackParamList, 'Bridge3to4'>;

export const Bridge3to4: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const day3 = useDayStore((s) => s.day3);
  const day2 = useDayStore((s) => s.day2);
  const setIntentionWord = useDayStore((s) => s.setDay4IntentionWord);
  const streakCount = useStreakStore((s) => s.streakCount);
  const repeatMoodStreak = useStreakStore((s) => s.repeatMoodStreak);

  const trueCount = Object.values(day3.mirrorAnswers).filter(Boolean).length;
  const total = Object.keys(day3.mirrorAnswers).length;
  const showRepeatMoodWarning = repeatMoodStreak >= 3 && day2.mood;
  const moodData = moodOptions.find((m) => m.id === day2.mood);

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Zone 1 */}
        <View style={styles.zone1}>
          <StreakRing streakCount={streakCount} />
        </View>

        {/* Zone 2 — Recap */}
        <View style={styles.zone2}>
          <Text style={styles.recapLabel}>Yesterday's assumptions test</Text>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreNum}>{trueCount}</Text>
            <Text style={styles.scoreOf}>of {total} marked TRUE</Text>
          </View>
          {day3.appreciationSnap && (
            <View style={styles.snapCard}>
              <Text style={styles.snapLabel}>You wanted them to know</Text>
              <Text style={styles.snapText}>"{day3.appreciationSnap}"</Text>
            </View>
          )}
          {showRepeatMoodWarning && moodData && (
            <View style={styles.repeatMoodCard}>
              <Text style={styles.repeatMoodText}>
                You've been feeling <Text style={{ color: moodData.color }}>{moodData.label.toLowerCase()}</Text> for a few days.{'\n'}
                That's worth noticing. The jar is a good place for that.
              </Text>
            </View>
          )}
        </View>

        {/* Zone 2b — Intention Word */}
        <IntentionWordSelector accentColor={colors.day4} onSelect={setIntentionWord} />

        {/* Zone 3 — Quote */}
        <View style={styles.zone3}>
          <Text style={styles.quote}>"{bridgeQuotes.bridge_3to4}"</Text>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.cta}
        activeOpacity={0.85}
        onPress={() => {
          haptics.medium();
          navigation.navigate('Day4MemoryJar');
        }}
      >
        <Text style={styles.ctaLabel}>Continue to Day 4 →</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: { padding: 28, paddingBottom: 16, gap: 24 },
  zone1: { alignItems: 'center' },
  zone2: { gap: 12 },
  recapLabel: { color: 'rgba(255,255,255,0.35)', fontSize: 12, fontFamily: 'Inter-SemiBold', letterSpacing: 1.5, textTransform: 'uppercase' },
  scoreCard: {
    flexDirection: 'row', alignItems: 'baseline', gap: 10,
    backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 20,
  },
  scoreNum: { fontSize: 48, color: colors.day3, fontFamily: 'PlayfairDisplay-Bold' },
  scoreOf: { fontSize: 16, color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter-Regular' },
  snapCard: { backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 16 },
  snapLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'Inter-SemiBold', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 },
  snapText: { color: 'rgba(255,255,255,0.7)', fontSize: 15, fontFamily: 'PlayfairDisplay-Italic', lineHeight: 24 },
  repeatMoodCard: {
    backgroundColor: `${colors.day4}15`, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: `${colors.day4}40`,
  },
  repeatMoodText: { color: 'rgba(255,255,255,0.65)', fontSize: 14, fontFamily: 'Inter-Regular', lineHeight: 22 },
  zone3: {
    backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: 20,
    borderLeftWidth: 3, borderLeftColor: colors.day4,
  },
  quote: { color: 'rgba(255,255,255,0.7)', fontSize: 17, fontFamily: 'PlayfairDisplay-Italic', lineHeight: 28 },
  cta: {
    backgroundColor: colors.day4, marginHorizontal: 28, marginBottom: 48,
    paddingVertical: 18, borderRadius: 100, alignItems: 'center',
  },
  ctaLabel: { color: colors.dark, fontSize: 17, fontFamily: 'Inter-SemiBold', letterSpacing: 0.3 },
});
