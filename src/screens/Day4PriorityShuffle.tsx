import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
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
import { Sparkles, Check, Info } from 'lucide-react-native';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { DayCTA } from '../components/common/DayCTA';

type Nav = StackNavigationProp<RootStackParamList, 'Day4PriorityShuffle'>;

interface PriorityOption {
  id: string;
  label: string;
  emoji: string;
  description: string;
}

const PRIORITIES: PriorityOption[] = [
  { id: '1', label: 'Quality Time', emoji: '⏳', description: 'Undivided attention and shared activities.' },
  { id: '2', label: 'Physical Touch', emoji: '🤝', description: 'Holding hands, hugs, and physical closeness.' },
  { id: '3', label: 'Acts of Service', emoji: '🧹', description: 'Doing things to ease the burden of responsibilities.' },
  { id: '4', label: 'Words of Affirmation', emoji: '💬', description: 'Compliments, appreciation, and verbal support.' },
  { id: '5', label: 'Gifts', emoji: '🎁', description: 'Thoughtful tokens of affection and surprises.' },
];

export const Day4PriorityShuffle: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const setDay4PriorityShuffle = useDayStore(s => s.setDay4PriorityShuffle);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
      haptics.light();
    } else if (selectedIds.length < 3) {
      setSelectedIds([...selectedIds, id]);
      haptics.medium();
    }
  };

  const handleNext = () => {
    const topNeed = PRIORITIES.find(p => p.id === selectedIds[0])?.label ?? '';
    setDay4PriorityShuffle(selectedIds, topNeed);
    haptics.success();
    navigation.navigate('Day4DailyTwo');
  };

  const renderItem = ({ item }: { item: PriorityOption }) => {
    const isSelected = selectedIds.includes(item.id);
    const selectionIndex = selectedIds.indexOf(item.id);
    const isDisabled = !isSelected && selectedIds.length >= 3;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleToggle(item.id)}
        disabled={isDisabled}
        style={[
          styles.card,
          isSelected && styles.cardSelected,
          isDisabled && styles.cardDisabled,
        ]}
      >
        <View style={styles.cardMain}>
          <Text style={styles.cardEmoji}>{item.emoji}</Text>
          <View style={styles.cardTextCol}>
            <Text style={[styles.cardLabel, isSelected && styles.cardLabelSelected]}>{item.label}</Text>
            <Text style={styles.cardDesc}>{item.description}</Text>
          </View>
          {isSelected && (
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>{selectionIndex + 1}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper>
      <ProgressStrip currentDay={4} />
      
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.eyebrowPill}>
            <Sparkles size={metrics.iconSize.xs} color={colors.day4} />
            <Text style={[styles.eyebrow, { color: colors.day4 }]}>GAME 08 · PRIORITY SHUFFLE</Text>
          </View>
          <Text style={styles.title}>
            Pick your top 3 relationship needs in order of importance.
          </Text>
          <View style={styles.infoRow}>
            <Info size={14} color={colors.textHint} />
            <Text style={styles.infoText}>The first one you tap is #1</Text>
          </View>
        </View>

        <FlatList
          data={PRIORITIES}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          scrollEnabled={false}
        />
      </View>

      <DayCTA 
        title="These are my priorities" 
        disabled={selectedIds.length < 3}
        onPress={handleNext} 
      />
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
    marginBottom: metrics.spacing.lg,
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
    borderColor: 'rgba(45,212,191,0.15)',
    alignSelf: 'flex-start',
    marginBottom: metrics.spacing.md,
  },
  eyebrow: {
    ...typography.captionSmall,
    letterSpacing: 1.5,
  },
  title: {
    ...typography.displaySmall,
    color: c.text,
    fontFamily: 'PlayfairDisplay-Bold',
    lineHeight: metrics.fontSize.h3 * 1.3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: metrics.spacing.sm,
  },
  infoText: {
    ...typography.caption,
    color: c.textHint,
  },
  listContent: {
    gap: metrics.spacing.smMd,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: metrics.radius.lg,
    padding: metrics.spacing.smMd,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardSelected: {
    borderColor: '#2DD4BF',
    backgroundColor: 'rgba(45,212,191,0.05)',
  },
  cardDisabled: {
    opacity: 0.5,
  },
  cardMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardEmoji: {
    fontSize: responsiveFontSize(3),
    marginRight: metrics.spacing.md,
  },
  cardTextCol: {
    flex: 1,
    gap: 2,
  },
  cardLabel: {
    ...typography.bodyMedium,
    fontFamily: fonts.dmSansBold,
    color: c.text,
  },
  cardLabelSelected: {
    color: '#2DD4BF',
  },
  cardDesc: {
    ...typography.caption,
    color: c.textSecondary,
    fontSize: metrics.fontSize.micro,
  },
  rankBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2DD4BF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: metrics.spacing.sm,
  },
  rankText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: fonts.dmSansBold,
  },
});
