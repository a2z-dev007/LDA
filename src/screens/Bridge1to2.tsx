import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { StreakRing } from '../components/common/StreakRing';
import { IntentionWordSelector } from '../components/common/IntentionWordSelector';
import { useAppColors } from '../theme';
import { bridgeQuotes } from '../data/quizData';
import { useDayStore } from '../store/useDayStore';
import { useStreakStore } from '../store/useStreakStore';
import { personalityTypes } from '../data/personalityTypes';
import { haptics } from '../utils/haptics';

type Nav = StackNavigationProp<RootStackParamList, 'Bridge1to2'>;

export const Bridge1to2: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const day1 = useDayStore((s) => s.day1);
  const setIntentionWord = useDayStore((s) => s.setDay2IntentionWord);
  const streakCount = useStreakStore((s) => s.streakCount);
  const shieldUsed = useStreakStore((s) => s.shieldUsed);

  const personality = personalityTypes.find((p) => p.id === day1.personalityType);

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Zone 1 — Streak Ring */}
        <View style={styles.zone1}>
          <StreakRing streakCount={streakCount} />
          {shieldUsed && (
            <View style={styles.shieldCard}>
              <Text style={styles.shieldText}>Life happened today. Your streak is safe.</Text>
            </View>
          )}
        </View>

        {/* Zone 2 — Recap */}
        <View style={styles.zone2}>
          <Text style={styles.recapLabel}>Yesterday you said</Text>
          <View style={styles.recapCard}>
            <Text style={styles.recapScore}>{day1.sliderScore}</Text>
            <Text style={styles.recapScoreLabel}>out of 10</Text>
          </View>
          {personality && (
            <View style={[styles.typeCard, { borderColor: personality.color }]}>
              <Text style={[styles.typeName, { color: personality.color }]}>{personality.name}</Text>
              <Text style={styles.typeDesc}>{personality.subLabel}</Text>
            </View>
          )}
        </View>

        {/* Zone 2b — Intention Word */}
        <View style={styles.zone2b}>
          <IntentionWordSelector accentColor={colors.day2} onSelect={setIntentionWord} />
        </View>

        {/* Zone 3 — Bridge Quote */}
        <View style={styles.zone3}>
          <Text style={styles.quote}>"{bridgeQuotes.bridge_1to2}"</Text>
        </View>
      </ScrollView>

      {/* Zone 4 — CTA */}
      <TouchableOpacity
        style={styles.cta}
        activeOpacity={0.85}
        onPress={() => {
          haptics.medium();
          navigation.navigate('Day2MoodPicker');
        }}
      >
        <Text style={styles.ctaLabel}>Continue to Day 2 →</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  content: { padding: 28, paddingBottom: 16, gap: 28 },
  zone1: { alignItems: 'center', gap: 16 },
  shieldCard: {
    backgroundColor: `${c.primary}20`, borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: `${c.primary}40`,
  },
  shieldText: { color: c.textSecondary, fontSize: 14, fontFamily: 'PlayfairDisplay-Italic', textAlign: 'center' },
  zone2: { gap: 12 },
  recapLabel: { color: c.textHint, fontSize: 12, fontFamily: 'Inter-SemiBold', letterSpacing: 1.5, textTransform: 'uppercase' },
  recapCard: {
    flexDirection: 'row', alignItems: 'baseline', gap: 8,
    backgroundColor: c.surface, borderRadius: 16, padding: 20,
  },
  recapScore: { fontSize: 48, color: c.day1, fontFamily: 'PlayfairDisplay-Bold' },
  recapScoreLabel: { fontSize: 16, color: c.textHint, fontFamily: 'Inter-Regular' },
  typeCard: {
    borderWidth: 1.5, borderRadius: 14, padding: 16,
  },
  typeName: { fontSize: 18, fontFamily: 'PlayfairDisplay-Bold', marginBottom: 4 },
  typeDesc: { fontSize: 13, color: c.textSecondary, fontFamily: 'Inter-Regular' },
  zone2b: {},
  zone3: {
    backgroundColor: c.surface, borderRadius: 16, padding: 20,
    borderLeftWidth: 3, borderLeftColor: c.day2,
  },
  quote: { color: c.textSecondary, fontSize: 17, fontFamily: 'PlayfairDisplay-Italic', lineHeight: 28 },
  cta: {
    backgroundColor: c.day2, marginHorizontal: 28, marginBottom: 48,
    paddingVertical: 18, borderRadius: 100, alignItems: 'center',
  },
  ctaLabel: { color: c.dark, fontSize: 17, fontFamily: 'Inter-SemiBold', letterSpacing: 0.3 },
});
