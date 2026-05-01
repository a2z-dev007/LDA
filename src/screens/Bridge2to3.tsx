import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { StreakRing } from '../components/common/StreakRing';
import { IntentionWordSelector } from '../components/common/IntentionWordSelector';
import { useAppColors } from '../theme';
import { bridgeQuotes, moodOptions } from '../data/quizData';
import { useDayStore } from '../store/useDayStore';
import { useStreakStore } from '../store/useStreakStore';
import { haptics } from '../utils/haptics';

type Nav = StackNavigationProp<RootStackParamList, 'Bridge2to3'>;

export const Bridge2to3: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const day2 = useDayStore((s) => s.day2);
  const setIntentionWord = useDayStore((s) => s.setDay3IntentionWord);
  const streakCount = useStreakStore((s) => s.streakCount);

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
          <Text style={styles.recapLabel}>Yesterday you felt</Text>
          {moodData && (
            <View style={[styles.moodCard, { borderColor: moodData.color }]}>
              <Text style={styles.moodEmoji}>{moodData.emoji}</Text>
              <View>
                <Text style={[styles.moodLabel, { color: moodData.color }]}>{moodData.label}</Text>
                {day2.intentionWord ? (
                  <Text style={styles.intentionText}>Intention: {day2.intentionWord}</Text>
                ) : null}
              </View>
            </View>
          )}
          {day2.followUpAnswer ? (
            <View style={styles.answerCard}>
              <Text style={styles.answerLabel}>You wrote</Text>
              <Text style={styles.answerText}>"{day2.followUpAnswer}"</Text>
            </View>
          ) : null}
        </View>

        {/* Zone 2b — Intention Word */}
        <IntentionWordSelector accentColor={colors.day3} onSelect={setIntentionWord} />

        {/* Zone 3 — Quote */}
        <View style={styles.zone3}>
          <Text style={styles.quote}>"{bridgeQuotes.bridge_2to3}"</Text>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.ctaTouch} activeOpacity={0.85} onPress={() => { haptics.medium(); navigation.navigate('Day3AppreciationSnap'); }}>
        <LinearGradient colors={[colors.buttonGradientStart, colors.buttonGradientEnd]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cta}>
          <Text style={styles.ctaLabel}>Continue to Day 3 →</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  content: { padding: 28, paddingBottom: 16, gap: 24 },
  zone1: { alignItems: 'center' },
  zone2: { gap: 12 },
  recapLabel: { color: c.textHint, fontSize: 12, fontFamily: 'Inter-SemiBold', letterSpacing: 1.5, textTransform: 'uppercase' },
  moodCard: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    borderWidth: 1.5, borderRadius: 16, padding: 18,
  },
  moodEmoji: { fontSize: 36 },
  moodLabel: { fontSize: 20, fontFamily: 'PlayfairDisplay-Bold' },
  intentionText: { fontSize: 13, color: c.textHint, fontFamily: 'Inter-Regular', marginTop: 2 },
  answerCard: {
    backgroundColor: c.white, borderRadius: 14, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  answerLabel: { color: c.textHint, fontSize: 11, fontFamily: 'Inter-SemiBold', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 },
  answerText: { color: c.textSecondary, fontSize: 15, fontFamily: 'PlayfairDisplay-Italic', lineHeight: 24 },
  zone3: {
    backgroundColor: c.white, borderRadius: 16, padding: 20,
    borderLeftWidth: 3, borderLeftColor: c.day3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  quote: { color: c.textSecondary, fontSize: 17, fontFamily: 'PlayfairDisplay-Italic', lineHeight: 28 },
  ctaTouch: { marginHorizontal: 28, marginBottom: 48, borderRadius: 100, shadowColor: c.glowPrimary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8 },
  cta: { paddingVertical: 18, borderRadius: 100, alignItems: 'center' },
  ctaLabel: { color: c.onPrimary, fontSize: 17, fontFamily: 'Inter-SemiBold', letterSpacing: 0.3 },
});
