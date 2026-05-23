import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { ProgressStrip } from '../components/common/ProgressStrip';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { GradientButton } from '../components/common/GradientButton';
import { useAppColors } from '../theme';
import { typography, fonts } from '../theme/typography';
import { metrics } from '../theme/metrics';
import { haptics } from '../utils/haptics';
import { useDayStore } from '../store/useDayStore';
import { useJournalStore } from '../store/useJournalStore';
import { Database, Star, ArrowRight, Heart, Zap, BarChart2, Eye, Anchor } from 'lucide-react-native';

type Nav = StackNavigationProp<RootStackParamList, 'Day3OneCertainty'>;

// Narrative arc chips for Day 3
const NARRATIVE_CHIPS = [
  { label: 'Expressive', color: '#D4537E', bg: 'rgba(212,83,126,0.08)' },
  { label: 'Predictive', color: '#4A8FD4', bg: 'rgba(74,143,212,0.08)' },
  { label: 'Analytical', color: '#6B8F87', bg: 'rgba(107,143,135,0.08)' },
  { label: 'Visual', color: '#B07010', bg: 'rgba(176,112,16,0.08)' },
  { label: 'Anchoring', color: '#2D5F5D', bg: 'rgba(45,95,93,0.08)' },
];

export const Day3OneCertainty: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const setOneCertainty = useDayStore(s => s.setOneCertainty);
  const addEntry = useJournalStore(s => s.addEntry);
  const [text, setText] = useState('');

  const handleSave = () => {
    haptics.success();
    const trimmed = text.trim();
    if (trimmed) {
      setOneCertainty(trimmed);
      addEntry({ day: 3, type: 'certainty', content: trimmed });
    }
    navigation.navigate('Day3Complete');
  };

  return (
    <ScreenWrapper>
      <ProgressStrip currentDay={3} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <ScreenHeader title="One Certainty" />
          </View>

          {/* Main question — italic serif */}
          <Text style={styles.question}>
            "Despite everything you're not sure about — what's the one thing you know for certain?"
          </Text>

          {/* Text input */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="I know that they always show up, even when it's hard."
              placeholderTextColor={colors.textHint}
              value={text}
              onChangeText={setText}
              multiline
              textAlignVertical="top"
              autoFocus={false}
            />
          </View>

          {/* Dedication badge + hint */}
          <View style={styles.metaRow}>
            <View style={styles.dedicationBadge}>
              <Star size={12} color="#6B3291" fill="#6B3291" />
              <Text style={styles.dedicationText}>Dedication +0.5</Text>
            </View>
            {/* <Text style={styles.openTextLabel}>Open text</Text> */}
          </View>

          {/* Narrative arc of Day 3 */}
          {/* <View style={styles.narrativeCard}>
            <Text style={styles.narrativeEyebrow}>Narrative arc of Day 3</Text>
            <View style={styles.chipsGrid}>
              <View style={styles.arcFlow}>
                <View style={[styles.chip, { backgroundColor: 'rgba(212,83,126,0.08)' }]}>
                  <Heart size={12} color="#D4537E" style={{ marginRight: 4 }} />
                  <Text style={[styles.chipText, { color: '#D4537E' }]}>Expressive</Text>
                </View>
                <ArrowRight size={12} color={colors.textHint} />
                <View style={[styles.chip, { backgroundColor: 'rgba(74,143,212,0.08)' }]}>
                  <Zap size={12} color="#4A8FD4" style={{ marginRight: 4 }} />
                  <Text style={[styles.chipText, { color: '#4A8FD4' }]}>Predictive</Text>
                </View>
              </View>
              <View style={styles.arcFlow}>
                <View style={[styles.chip, { backgroundColor: 'rgba(107,143,135,0.08)' }]}>
                  <BarChart2 size={12} color="#6B8F87" style={{ marginRight: 4 }} />
                  <Text style={[styles.chipText, { color: '#6B8F87' }]}>Analytical</Text>
                </View>
                <ArrowRight size={12} color={colors.textHint} />
                <View style={[styles.chip, { backgroundColor: 'rgba(176,112,16,0.08)' }]}>
                  <Eye size={12} color="#B07010" style={{ marginRight: 4 }} />
                  <Text style={[styles.chipText, { color: '#B07010' }]}>Visual</Text>
                </View>
              </View>
              <View style={[styles.chip, { backgroundColor: 'rgba(45,95,93,0.08)', alignSelf: 'flex-start' }]}>
                <Anchor size={12} color="#2D5F5D" style={{ marginRight: 4 }} />
                <Text style={[styles.chipText, { color: '#2D5F5D' }]}>Anchoring</Text>
              </View>
            </View>
          </View> */}

          {/* Storage banner */}
          {/* <View style={styles.storageBanner}>
            <Database size={14} color={colors.textHint} />
            <Text style={styles.storageText}>
              Stores: d3_one_certainty · d3_complete: true · streak_count: 3
            </Text>
          </View> */}

          {/* CTA */}
          <View style={styles.buttonContainer}>
            <GradientButton
              text="Complete Day 3 →"
              onPress={handleSave}
              fullWidth
              showArrow={false}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  scrollContent: {
    paddingBottom: metrics.spacing.xl * 2,
  },
  header: {
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingTop: metrics.spacing.md,
    marginBottom: metrics.spacing.sm,
  },
  question: {
    ...typography.quoteItalicLarge,
    color: c.text,
    paddingHorizontal: metrics.layout.screenPaddingHz,
    marginBottom: 20,
    lineHeight: 28,
  },
  inputWrapper: {
    marginHorizontal: metrics.layout.screenPaddingHz,
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(45,95,93,0.15)',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  input: {
    color: c.text,
    fontSize: 16,
    fontFamily: fonts.playfairSemiBold,
    padding: 18,
    minHeight: 130,
    lineHeight: 26,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: metrics.layout.screenPaddingHz,
    marginBottom: 20,
  },
  dedicationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(107,50,145,0.08)',
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  dedicationText: {
    fontSize: 12,
    fontFamily: fonts.dmSansBold,
    color: '#6B3291',
  },
  openTextLabel: {
    fontSize: 11,
    fontFamily: fonts.dmSansRegular,
    color: c.textHint,
  },
  narrativeCard: {
    marginHorizontal: metrics.layout.screenPaddingHz,
    backgroundColor: 'rgba(45,95,93,0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(45,95,93,0.1)',
    padding: 16,
    marginBottom: 16,
  },
  narrativeEyebrow: {
    fontSize: 10,
    fontFamily: fonts.dmSansBold,
    color: c.textHint,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  chipsGrid: {
    gap: 8,
  },
  arcFlow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
  },
  chipText: {
    fontSize: 12,
    fontFamily: fonts.dmSansBold,
  },
  storageBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(45,95,93,0.04)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: metrics.layout.screenPaddingHz,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(45,95,93,0.08)',
  },
  storageText: {
    fontSize: 11,
    fontFamily: fonts.dmSansMedium,
    color: c.textSecondary,
    flex: 1,
    lineHeight: 16,
  },
  buttonContainer: {
    paddingHorizontal: metrics.layout.screenPaddingHz,
  },
});
