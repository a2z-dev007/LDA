import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView,
} from 'react-native';
import { intentionWords } from '../../data/quizData';
import { useAppColors } from '../../theme';
import { haptics } from '../../utils/haptics';

interface Props {
  accentColor: string;
  onSelect: (word: string) => void;
}

export const IntentionWordSelector: React.FC<Props> = ({ accentColor, onSelect }) => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const [selected, setSelected] = useState<string | null>(null);
  const [customWord, setCustomWord] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const handleSelect = (word: string) => {
    haptics.light();
    setSelected(word);
    setShowCustom(false);
    onSelect(word);
  };

  const handleCustomSubmit = () => {
    const trimmed = customWord.trim().slice(0, 12);
    if (!trimmed) return;
    haptics.medium();
    setSelected(trimmed);
    onSelect(trimmed);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Set your intention for today</Text>
      <View style={styles.pills}>
        {intentionWords.map(({ word }) => (
          <TouchableOpacity
            key={word}
            style={[
              styles.pill,
              { borderColor: selected === word ? accentColor : 'rgba(255,255,255,0.15)' },
              selected === word && { backgroundColor: `${accentColor}20` },
            ]}
            onPress={() => handleSelect(word)}
            activeOpacity={0.8}
          >
            <Text style={[styles.pillText, selected === word && { color: accentColor }]}>
              {word}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.pill, { borderColor: showCustom ? accentColor : 'rgba(255,255,255,0.15)' }]}
          onPress={() => setShowCustom(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.pillText}>+ Custom</Text>
        </TouchableOpacity>
      </View>

      {showCustom && (
        <View style={styles.customRow}>
          <TextInput
            style={[styles.customInput, { borderColor: accentColor }]}
            placeholder="Your word (max 12)"
            placeholderTextColor="rgba(255,255,255,0.25)"
            value={customWord}
            onChangeText={setCustomWord}
            maxLength={12}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleCustomSubmit}
          />
          <TouchableOpacity style={[styles.customBtn, { backgroundColor: accentColor }]} onPress={handleCustomSubmit}>
            <Text style={styles.customBtnText}>Set</Text>
          </TouchableOpacity>
        </View>
      )}

      {selected && (
        <Text style={[styles.subtext, { color: accentColor }]}>
          {intentionWords.find((w) => w.word === selected)?.subtext ?? `"${selected}" — your word for today.`}
        </Text>
      )}
    </View>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  container: { gap: 12 },
  label: {
    color: c.textHint, fontSize: 12, fontFamily: 'Inter-SemiBold',
    letterSpacing: 1.5, textTransform: 'uppercase',
  },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: {
    borderWidth: 1.5, borderRadius: 100, paddingHorizontal: 16, paddingVertical: 8,
  },
  pillText: { color: c.textSecondary, fontSize: 14, fontFamily: 'Inter-SemiBold' },
  customRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  customInput: {
    flex: 1, color: c.text, fontSize: 15, fontFamily: 'Inter-Regular',
    borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10,
  },
  customBtn: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12,
  },
  customBtnText: { color: c.dark, fontSize: 14, fontFamily: 'Inter-SemiBold' },
  subtext: { fontSize: 13, fontFamily: 'PlayfairDisplay-Italic', lineHeight: 20 },
});
