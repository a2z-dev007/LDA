import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { ProgressStrip } from '../components/common/ProgressStrip';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { useAppColors } from '../theme';
import { useDayStore } from '../store/useDayStore';
import { useJournalStore } from '../store/useJournalStore';
import { haptics } from '../utils/haptics';

type Nav = StackNavigationProp<RootStackParamList, 'Day3OneCertainty'>;

export const Day3OneCertainty: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const setOneCertainty = useDayStore((s) => s.setOneCertainty);
  const addEntry = useJournalStore((s) => s.addEntry);
  const [text, setText] = useState('');

  const handleSave = () => {
    haptics.success();
    const trimmed = text.trim();
    if (trimmed) {
      setOneCertainty(trimmed);
      addEntry({ day: 3, type: 'certainty', content: trimmed });
    }
    navigation.navigate('Day3MirrorResults');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScreenWrapper>
        <ProgressStrip currentDay={3} />
        <View style={styles.body}>
          <Text style={styles.eyebrow}>Day 3 · Quick Win 2</Text>
          <Text style={styles.title}>
            What's the one thing you know for certain?
          </Text>
          <Text style={styles.subtitle}>
            After all those assumptions — what do you know is absolutely true about your partner?
          </Text>

          <TextInput
            style={styles.input}
            placeholder="I know for certain that…"
        placeholderTextColor={colors.textHint}
            value={text}
            onChangeText={setText}
            multiline
            textAlignVertical="top"
            autoFocus
          />
          <Text style={styles.hint}>This will appear in your Day 5 report.</Text>
        </View>

        <TouchableOpacity style={styles.ctaTouch} activeOpacity={0.85} onPress={handleSave}>
          <LinearGradient colors={[colors.buttonGradientStart, colors.buttonGradientEnd]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cta}>
            <Text style={styles.ctaLabel}>{text.trim() ? 'Save this →' : 'Skip →'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  body: { flex: 1, paddingHorizontal: 28, paddingTop: 24 },
  eyebrow: { color: c.day3, fontSize: 12, fontFamily: 'Inter-SemiBold', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 },
  title: { fontSize: 26, color: c.text, fontFamily: 'PlayfairDisplay-Bold', lineHeight: 36, marginBottom: 12 },
  subtitle: { fontSize: 16, color: c.textSecondary, fontFamily: 'Inter-Regular', lineHeight: 24, marginBottom: 28 },
  input: {
    color: c.text, fontSize: 16, fontFamily: 'Inter-Regular',
    borderWidth: 1, borderColor: c.surfaceBorder, borderRadius: 12,
    padding: 16, minHeight: 120, lineHeight: 24, marginBottom: 12,
  },
  hint: { color: c.textHint, fontSize: 12, fontFamily: 'Inter-Regular' },
  ctaTouch: { marginHorizontal: 28, marginBottom: 48, borderRadius: 100, shadowColor: c.glowPrimary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8 },
  cta: { paddingVertical: 18, borderRadius: 100, alignItems: 'center' },
  ctaLabel: { color: c.onPrimary, fontSize: 17, fontFamily: 'Inter-SemiBold', letterSpacing: 0.3 },
});
