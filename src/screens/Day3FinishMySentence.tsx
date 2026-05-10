import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { ProgressStrip } from '../components/common/ProgressStrip';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { useAppColors } from '../theme';
import { typography, fonts } from '../theme/typography';
import { metrics } from '../theme/metrics';
import { haptics } from '../utils/haptics';
import { useDayStore } from '../store/useDayStore';
import { Sparkles } from 'lucide-react-native';
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
}

const OPTIONS: FMSOption[] = [
  { id: '1', label: 'Stay in bed all day', emoji: '🛌', tag: 'Cozy' },
  { id: '2', label: 'Go on a random adventure', emoji: '🏔️', tag: 'Explorer' },
  { id: '3', label: 'Spend it at a cute cafe', emoji: '☕', tag: 'Chill' },
  { id: '4', label: 'Try a new fancy restaurant', emoji: '🍱', tag: 'Foodie' },
];

export const Day3FinishMySentence: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const setDay3FMS = useDayStore(s => s.setDay3FMS);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (option: FMSOption) => {
    setSelectedId(option.id);
    haptics.medium();
    setDay3FMS(parseInt(option.id), option.label, option.tag);
    
    setTimeout(() => {
      navigation.navigate('Day3AssumptionsTest');
    }, 400);
  };

  return (
    <ScreenWrapper>
      <ProgressStrip currentDay={3} />
      
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.eyebrowPill}>
            <Sparkles size={metrics.iconSize.xs} color={colors.day3} />
            <Text style={[styles.eyebrow, { color: colors.day3 }]}>GAME 02 · FINISH MY SENTENCE</Text>
          </View>
          <Text style={styles.prompt}>
            "If we had a whole day with no responsibilities, I'd want us to..."
          </Text>
        </View>

        <View style={styles.optionsList}>
          {OPTIONS.map((option) => {
            const isSelected = selectedId === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                activeOpacity={0.8}
                onPress={() => handleSelect(option)}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                ]}
              >
                <Text style={styles.optionEmoji}>{option.emoji}</Text>
                <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                  {option.label}
                </Text>
                <View style={[styles.tagPill, isSelected && styles.tagPillSelected]}>
                  <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>{option.tag}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScreenWrapper>
  );
};

const makeStyles = (c: any) => StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingTop: metrics.spacing.lg,
  },
  header: {
    marginBottom: metrics.spacing.xl,
  },
  eyebrowPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: metrics.radius.full,
    paddingHorizontal: metrics.spacing.smMd,
    paddingVertical: metrics.spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(232,92,122,0.15)',
    alignSelf: 'flex-start',
    marginBottom: metrics.spacing.md,
  },
  eyebrow: {
    ...typography.captionSmall,
    letterSpacing: 1.5,
  },
  prompt: {
    ...typography.displaySmall,
    color: c.text,
    fontFamily: 'PlayfairDisplay-Italic',
    lineHeight: metrics.fontSize.h3 * 1.4,
  },
  optionsList: {
    gap: metrics.spacing.md,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: metrics.radius.lg,
    padding: metrics.spacing.md,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  optionCardSelected: {
    borderColor: '#E85C7A',
    backgroundColor: 'rgba(232,92,122,0.05)',
  },
  optionEmoji: {
    fontSize: responsiveFontSize(3),
    marginRight: metrics.spacing.md,
  },
  optionLabel: {
    ...typography.bodyMedium,
    fontFamily: fonts.dmSansBold,
    color: c.text,
    flex: 1,
  },
  optionLabelSelected: {
    color: '#E85C7A',
  },
  tagPill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: metrics.spacing.sm,
    paddingVertical: 2,
    borderRadius: metrics.radius.full,
  },
  tagPillSelected: {
    backgroundColor: 'rgba(232,92,122,0.1)',
  },
  tagText: {
    ...typography.caption,
    fontSize: metrics.fontSize.micro,
    color: c.textHint,
  },
  tagTextSelected: {
    color: '#E85C7A',
  },
});
