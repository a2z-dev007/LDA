import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { StreakRing } from '../components/common/StreakRing';
import { useAppColors } from '../theme';
import { bridgeQuotes } from '../data/quizData';
import { useDayStore } from '../store/useDayStore';
import { useStreakStore } from '../store/useStreakStore';
import { haptics } from '../utils/haptics';

type Nav = StackNavigationProp<RootStackParamList, 'Bridge4to5'>;

export const Bridge4to5: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const day4 = useDayStore((s) => s.day4);
  const streakCount = useStreakStore((s) => s.streakCount);

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Zone 1 */}
        <View style={styles.zone1}>
          <StreakRing streakCount={streakCount} />
          <Text style={styles.streakLabel}>Four days in. One more.</Text>
        </View>

        {/* Zone 2 — Recap */}
        <View style={styles.zone2}>
          <Text style={styles.recapLabel}>What you dropped in the jar</Text>
          {day4.memoryContent ? (
            <View style={styles.memoryCard}>
              <Text style={styles.jarIcon}>🫙</Text>
              <Text style={styles.memoryText}>"{day4.memoryContent}"</Text>
            </View>
          ) : (
            <View style={styles.memoryCard}>
              <Text style={styles.jarIcon}>🫙</Text>
              <Text style={styles.memoryText}>A memory is waiting inside.</Text>
            </View>
          )}
          {day4.tinyComplimentWord && (
            <View style={styles.complimentCard}>
              <Text style={styles.complimentLabel}>You sealed in</Text>
              <Text style={[styles.complimentWord, { color: colors.day4 }]}>
                {day4.tinyComplimentWord}
              </Text>
            </View>
          )}
        </View>

        {/* Zone 3 — Quote (no intention word on B4→5 per PRD) */}
        <View style={styles.zone3}>
          <Text style={styles.quote}>"{bridgeQuotes.bridge_4to5}"</Text>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.cta}
        activeOpacity={0.85}
        onPress={() => {
          haptics.success();
          navigation.navigate('Day5Celebration');
        }}
      >
        <Text style={styles.ctaLabel}>Continue to Day 5 →</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  content: { padding: 28, paddingBottom: 16, gap: 24 },
  zone1: { alignItems: 'center', gap: 12 },
  streakLabel: { color: c.textSecondary, fontSize: 15, fontFamily: 'PlayfairDisplay-Italic' },
  zone2: { gap: 12 },
  recapLabel: { color: c.textHint, fontSize: 12, fontFamily: 'Inter-SemiBold', letterSpacing: 1.5, textTransform: 'uppercase' },
  memoryCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 14,
    backgroundColor: c.surface, borderRadius: 16, padding: 20,
  },
  jarIcon: { fontSize: 32 },
  memoryText: { flex: 1, color: c.textSecondary, fontSize: 15, fontFamily: 'PlayfairDisplay-Italic', lineHeight: 24 },
  complimentCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: `${c.day4}15`, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: `${c.day4}40`,
  },
  complimentLabel: { color: c.textHint, fontSize: 13, fontFamily: 'Inter-Regular' },
  complimentWord: { fontSize: 18, fontFamily: 'PlayfairDisplay-Bold' },
  zone3: {
    backgroundColor: c.surface, borderRadius: 16, padding: 20,
    borderLeftWidth: 3, borderLeftColor: c.day5,
  },
  quote: { color: c.textSecondary, fontSize: 17, fontFamily: 'PlayfairDisplay-Italic', lineHeight: 28 },
  cta: {
    backgroundColor: c.day5, marginHorizontal: 28, marginBottom: 48,
    paddingVertical: 18, borderRadius: 100, alignItems: 'center',
  },
  ctaLabel: { color: c.dark, fontSize: 17, fontFamily: 'Inter-SemiBold', letterSpacing: 0.3 },
});
