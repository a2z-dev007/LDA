import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { ProgressStrip } from '../components/common/ProgressStrip';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { useAppColors } from '../theme';
import { moodOptions, MoodId } from '../data/quizData';
import { useDayStore } from '../store/useDayStore';
import { useStreakStore } from '../store/useStreakStore';
import { haptics } from '../utils/haptics';

type Nav = StackNavigationProp<RootStackParamList, 'Day2MoodPicker'>;

export const Day2MoodPicker: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const day2 = useDayStore((s) => s.day2);
  const recordMood = useStreakStore((s) => s.recordMood);
  const [selectedMood, setSelectedMood] = useState<MoodId | null>(null);

  const handleSelect = (id: MoodId) => {
    haptics.light();
    setSelectedMood(id);
    // Navigate after 400ms (candle animation time per PRD)
    setTimeout(() => {
      recordMood(id);
      navigation.navigate('Day2MoodFollowUp');
    }, 400);
  };

  return (
    <ScreenWrapper backgroundColor="#0F0E1C">
      <ProgressStrip currentDay={2} />
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Day 2 · The Mood Room</Text>
        {day2.intentionWord ? (
          <View style={[styles.intentionPill, { borderColor: colors.day2 }]}>
            <Text style={[styles.intentionText, { color: colors.day2 }]}>{day2.intentionWord}</Text>
          </View>
        ) : null}
        <Text style={styles.title}>How do you feel about{'\n'}your relationship today?</Text>
      </View>

      {/* SVG Candle placeholder — shows selected mood */}
      {selectedMood && (
        <View style={styles.candleContainer}>
          <Text style={styles.candleEmoji}>
            {moodOptions.find((m) => m.id === selectedMood)?.emoji ?? '🕯️'}
          </Text>
        </View>
      )}

      <ScrollView style={styles.scroll} contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {moodOptions.map((mood) => {
          const isSelected = selectedMood === mood.id;
          return (
            <TouchableOpacity
              key={mood.id}
              style={[
                styles.moodCard,
                { borderColor: isSelected ? mood.color : 'rgba(255,255,255,0.08)' },
                isSelected && { backgroundColor: `${mood.color}15` },
              ]}
              activeOpacity={0.8}
              onPress={() => handleSelect(mood.id as MoodId)}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Text style={[styles.moodLabel, isSelected && { color: mood.color }]}>{mood.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </ScreenWrapper>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  header: { paddingHorizontal: 28, paddingTop: 16, paddingBottom: 8, gap: 10 },
  eyebrow: { color: c.day2, fontSize: 12, fontFamily: 'Inter-SemiBold', letterSpacing: 2, textTransform: 'uppercase' },
  intentionPill: {
    alignSelf: 'flex-start', borderWidth: 1.5, borderRadius: 100,
    paddingHorizontal: 14, paddingVertical: 5,
  },
  intentionText: { fontSize: 13, fontFamily: 'Inter-SemiBold' },
  title: { fontSize: 24, color: c.text, fontFamily: 'PlayfairDisplay-Bold', lineHeight: 34 },
  candleContainer: { alignItems: 'center', paddingVertical: 12 },
  candleEmoji: { fontSize: 48 },
  scroll: { flex: 1, marginTop: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 12, paddingBottom: 16 },
  moodCard: {
    width: '46%', borderWidth: 1.5, borderRadius: 16, padding: 20,
    alignItems: 'center', gap: 8,
  },
  moodEmoji: { fontSize: 32 },
  moodLabel: { color: c.textSecondary, fontSize: 14, fontFamily: 'Inter-SemiBold', textAlign: 'center' },
});
