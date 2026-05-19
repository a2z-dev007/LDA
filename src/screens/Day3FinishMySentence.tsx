import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/types';
import { ProgressStrip } from '../components/common/ProgressStrip';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { useAppColors } from '../theme';
import { typography, fonts } from '../theme/typography';
import { metrics } from '../theme/metrics';
import { haptics } from '../utils/haptics';
import { useDayStore } from '../store/useDayStore';
import { ChevronLeft } from 'lucide-react-native';
import { GradientButton } from '../components/common/GradientButton';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

type Nav = StackNavigationProp<RootStackParamList, 'Day3FinishMySentence'>;

interface FMSOption {
  id: string;
  label: string;
  emoji: string;
  tag: string;
  axisA: string;
  axisB: string;
}

const OPTIONS: FMSOption[] = [
  { 
    id: '1', 
    label: '...the way we find each other after every storm', 
    emoji: '🌊', 
    tag: 'resilience', 
    axisA: 'Deep +1', 
    axisB: 'Deep +1' 
  },
  { 
    id: '2', 
    label: '...the ordinary moments that feel like enough', 
    emoji: '☕', 
    tag: 'simple', 
    axisA: 'Present +1', 
    axisB: 'Present +1' 
  },
  { 
    id: '3', 
    label: '...the way we make each other laugh without trying', 
    emoji: '⚡', 
    tag: 'laughter', 
    axisA: 'Active +1', 
    axisB: 'Playful +1' 
  },
  { 
    id: '4', 
    label: '...the quiet safety of knowing they\'re there', 
    emoji: '🕯️', 
    tag: 'safety', 
    axisA: 'Deep +1', 
    axisB: 'Protective +1' 
  },
];

export const Day3FinishMySentence: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const setDay3FMS = useDayStore(s => s.setDay3FMS);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (option: FMSOption) => {
    setSelectedId(option.id);
    haptics.medium();
    setDay3FMS(parseInt(option.id), option.label, option.tag);
  };

  const handleContinue = () => {
    haptics.success();
    navigation.navigate('Day3AssumptionsTest');
  };

  const selectedOption = OPTIONS.find(o => o.id === selectedId);

  const renderCard = (option: FMSOption) => {
    const isSelected = selectedId === option.id;
    return (
      <TouchableOpacity
        key={option.id}
        activeOpacity={0.85}
        onPress={() => handleSelect(option)}
        style={[
          styles.optionCard,
          isSelected && styles.optionCardSelected,
        ]}
      >
        <Text style={styles.optionEmoji}>{option.emoji}</Text>
        <Text style={[
          styles.optionLabel,
          isSelected && styles.optionLabelSelected
        ]}>
          {option.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper>
      <ProgressStrip currentDay={3} />
      
      <ScrollView 
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          // { paddingTop: Math.max(insets.top + metrics.spacing.xs, metrics.spacing.sm) }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header row */}
        <View style={styles.headerRow}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ChevronLeft size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Finish My Sentence</Text>
        </View>

        {/* Eyebrow */}
        <Text style={styles.eyebrow}>
          GAME 02 · SOLO MODE · ~25 SECONDS
        </Text>

        {/* Prompt */}
        <Text style={styles.prompt}>
          "The thing I love most about us is..."
        </Text>

        {/* Stems rotators sub-info */}
        <Text style={styles.stemsSubtitle}>
          Stem #1 of bank · 6 stems rotate across the week
        </Text>

        {/* 2x2 Grid */}
        <View style={styles.gridContainer}>
          <View style={styles.gridRow}>
            {renderCard(OPTIONS[0])}
            {renderCard(OPTIONS[1])}
          </View>
          <View style={styles.gridRow}>
            {renderCard(OPTIONS[2])}
            {renderCard(OPTIONS[3])}
          </View>
        </View>

      

        <View style={{ height: responsiveHeight(14) }} />
      </ScrollView>

      {/* Floating Footer CTA */}
      <View style={[
        styles.footer,
        { paddingBottom: Math.max(insets.bottom + 8, metrics.spacing.md) }
      ]}>
        <GradientButton
          text="Continue to Mirror Game"
          onPress={handleContinue}
          disabled={!selectedId}
          showArrow={true}
          fullWidth={true}
          gradientColors={colors.gradientBtn}
        />
      </View>
    </ScreenWrapper>
  );
};

const makeStyles = (c: any) => StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingBottom: metrics.spacing.xl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: metrics.spacing.md,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    color: c.text,
    fontFamily: fonts.playfairSemiBold,
  },
  eyebrow: {
    ...typography.captionSmall,
    color: c.textHint,
    letterSpacing: 1.5,
    marginBottom: metrics.spacing.sm,
  },
  prompt: {
    fontSize: 24,
    color: c.text,
    fontFamily: 'PlayfairDisplay-Italic',
    lineHeight: 34,
    marginBottom: 6,
  },
  stemsSubtitle: {
    ...typography.caption,
    color: c.textHint,
    marginBottom: metrics.spacing.lg,
  },
  gridContainer: {
    gap: 12,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  optionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.06)',
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 124,
  },
  optionCardSelected: {
    borderColor: '#0D9488',
    backgroundColor: '#E6FBF7',
  },
  optionEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  optionLabel: {
    ...typography.bodySmall,
    fontFamily: fonts.dmSansBold,
    color: c.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  optionLabelSelected: {
    color: '#0F766E',
  },
  selectedFeedback: {
    marginTop: metrics.spacing.md,
    gap: metrics.spacing.sm,
    alignItems: 'flex-start',
  },
  selectedStatusText: {
    ...typography.captionSmall,
    color: '#15803D',
    fontFamily: fonts.dmSansBold,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  feedbackTagPill: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: metrics.radius.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  feedbackTagText: {
    ...typography.captionSmall,
    color: '#475569',
    fontFamily: fonts.dmSansRegular,
  },
  storageHintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    borderRadius: metrics.radius.lg,
    padding: metrics.spacing.md,
    gap: metrics.spacing.sm,
    width: '100%',
    marginTop: metrics.spacing.xl,
  },
  databaseIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storageHintText: {
    flex: 1,
    ...typography.captionSmall,
    color: '#1B5E20',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingTop: metrics.spacing.md,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.5)',
  },
});
