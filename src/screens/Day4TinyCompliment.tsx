import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { ProgressStrip } from '../components/common/ProgressStrip';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { useAppColors } from '../theme';
import { useDayStore } from '../store/useDayStore';
import { useJournalStore } from '../store/useJournalStore';
import { haptics } from '../utils/haptics';
import { memoryRef } from './Day4MemoryJar';

type Nav = StackNavigationProp<RootStackParamList, 'Day4TinyCompliment'>;

const COMPLIMENT_WORDS = ['Seen', 'Safe', 'Lighter', 'Lucky', 'Proud', 'Loved', 'Calm', 'Home'];

export const Day4TinyCompliment: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const [selected, setSelected] = useState<string | null>(null);
  const setTinyCompliment = useDayStore((s) => s.setTinyCompliment);
  const addJarMemory = useJournalStore((s) => s.addJarMemory);

  const handleSelect = (word: string) => {
    haptics.success();
    setSelected(word);
    setTinyCompliment(word);

    // Update jar memory with compliment
    addJarMemory({
      content: null,
      type: 'text',
      tinyCompliment: word,
      dayColor: colors.day4,
    });

    // Store the compliment word in day4 store via a partial update
    // We'll pass it forward through navigation to Day4DailyTwo
    setTimeout(() => navigation.navigate('Day4DailyTwo'), 600);
  };

  return (
    <ScreenWrapper backgroundColor="#110A1A">
      <ProgressStrip currentDay={4} />
      <View style={styles.body}>
        <Text style={styles.eyebrow}>Day 4 · Tiny Compliment</Text>
        <Text style={styles.title}>
          How does your partner make you feel?
        </Text>
        <Text style={styles.subtitle}>One word. Seal it into the jar.</Text>

        {/* Jar with sparkle */}
        <View style={styles.jarContainer}>
          <Text style={styles.jarIcon}>🫙</Text>
          {selected && (
            <Text style={[styles.sealedWord, { color: colors.day4 }]}>✨ {selected}</Text>
          )}
        </View>

        <View style={styles.pills}>
          {COMPLIMENT_WORDS.map((word) => (
            <TouchableOpacity
              key={word}
              style={[
                styles.pill,
                selected === word && { backgroundColor: `${colors.day4}30`, borderColor: colors.day4 },
              ]}
              activeOpacity={0.8}
              onPress={() => handleSelect(word)}
            >
              <Text style={[styles.pillText, selected === word && { color: colors.day4 }]}>
                {word}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.skipBtn}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('Day4DailyTwo')}
      >
        <Text style={styles.skipBtnLabel}>Skip for now</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  body: { flex: 1, paddingHorizontal: 28, paddingTop: 24 },
  eyebrow: { color: c.day4, fontSize: 12, fontFamily: 'Inter-SemiBold', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 },
  title: { fontSize: 26, color: c.text, fontFamily: 'PlayfairDisplay-Bold', lineHeight: 36, marginBottom: 8 },
  subtitle: { fontSize: 16, color: c.textSecondary, fontFamily: 'Inter-Regular', marginBottom: 32 },
  jarContainer: { alignItems: 'center', marginBottom: 32 },
  jarIcon: { fontSize: 56 },
  sealedWord: { fontSize: 18, fontFamily: 'PlayfairDisplay-Bold', marginTop: 8 },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  pill: {
    borderWidth: 1.5, borderColor: c.surfaceBorder, borderRadius: 100,
    paddingHorizontal: 20, paddingVertical: 12,
  },
  pillText: { color: c.textSecondary, fontSize: 15, fontFamily: 'Inter-SemiBold' },
  skipBtn: { alignItems: 'center', paddingBottom: 40 },
  skipBtnLabel: { color: c.textHint, fontSize: 14, fontFamily: 'Inter-Regular' },
});
