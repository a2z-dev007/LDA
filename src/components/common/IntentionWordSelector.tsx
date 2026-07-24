import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { intentionWords } from '../../data/quizData';
import { useAppColors, fonts, typography } from '../../theme';
import { haptics } from '../../utils/haptics';
import { Plus } from 'lucide-react-native';

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
      <Text style={styles.label}>Set your intention for today 🌿</Text>
      <View style={styles.pills}>
        {intentionWords.map(({ word, emoji }) => {
          const isSelected = selected === word;
          
          return (
            <TouchableOpacity
              key={word}
              style={[
                styles.pill,
                isSelected && { 
                  backgroundColor: `${accentColor}10`, 
                  borderColor: accentColor,
                  borderWidth: 1.5,
                  shadowColor: accentColor,
                  shadowOpacity: 0.15
                }
              ]}
              onPress={() => handleSelect(word)}
              activeOpacity={0.75}
            >
              <Text style={styles.chipEmoji}>{emoji}</Text>
              <Text style={[
                styles.pillText, 
                isSelected && { color: colors.text, fontFamily: fonts.dmSansBold }
              ]}>{word}</Text>
            </TouchableOpacity>
          );
        })}

        {/* Custom button */}
        <TouchableOpacity
          style={[
            styles.pill,
            showCustom && { 
              backgroundColor: `${accentColor}10`, 
              borderColor: accentColor,
              borderWidth: 1.5
            }
          ]}
          onPress={() => setShowCustom(true)}
          activeOpacity={0.75}
        >
          <Plus size={14} color={showCustom ? accentColor : colors.textHint} style={{marginRight: 4}} />
          <Text style={[
            styles.pillText, 
            showCustom && { color: colors.text, fontFamily: fonts.dmSansBold }
          ]}>Custom</Text>
        </TouchableOpacity>
      </View>

      {showCustom && (
        <View style={styles.customRow}>
          <TextInput
            style={[styles.customInput, { borderColor: accentColor }]}
            placeholder="Your word (max 12)"
            placeholderTextColor={colors.textHint}
            value={customWord}
            onChangeText={setCustomWord}
            maxLength={12}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleCustomSubmit}
          />
          <TouchableOpacity activeOpacity={0.85} onPress={handleCustomSubmit} style={styles.customBtnTouch}>
            <LinearGradient
              colors={[accentColor, `${accentColor}BB`]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.customBtn}
            >
              <Text style={styles.customBtnText}>Set</Text>
            </LinearGradient>
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
  container: { gap: 14 },
  label: {
    color: c.textHint, fontSize: 12, fontFamily: 'Inter-SemiBold',
    letterSpacing: 1.5, textTransform: 'uppercase',
  },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'space-between' },

  // Unselected pill — solid white card with theme border
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '31.5%',
    borderWidth: 1.5,
    borderColor: c.surfaceBorder,
    borderRadius: 100,
    paddingHorizontal: 8,
    justifyContent:'center',
    paddingVertical: 10,
    backgroundColor: c.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  pillText: {
    color: c.text,
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    flexShrink: 1,
  },
  chipEmoji: {
    fontSize: 16,
    marginRight: 6,
  },

  // Custom input row
  customRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  customInput: {
    flex: 1,
    color: c.text,
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: c.white,
  },
  customBtnTouch: {
    borderRadius: 12,
    shadowColor: c.glowPrimary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  customBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  customBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },

  subtext: {
    fontSize: 13,
    fontFamily: 'PlayfairDisplay-Italic',
    lineHeight: 20,
  },
});
