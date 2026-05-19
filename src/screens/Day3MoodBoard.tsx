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
import { Sparkles, Check } from 'lucide-react-native';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { DayCTA } from '../components/common/DayCTA';
import { DayHeader } from '../components/common/DayHeader';

type Nav = StackNavigationProp<RootStackParamList, 'Day3MoodBoard'>;

interface MoodTile {
  id: string;
  label: string;
  emoji: string;
  group: 'safety' | 'flow' | 'spark';
}

const MOOD_TILES: MoodTile[] = [
  { id: 'protected', label: 'Protected', emoji: '🛡️', group: 'safety' },
  { id: 'fluid', label: 'Fluid', emoji: '🌊', group: 'flow' },
  { id: 'inspired', label: 'Inspired', emoji: '🔥', group: 'spark' },
  { id: 'grounded', label: 'Grounded', emoji: '🏔️', group: 'safety' },
  { id: 'light', label: 'Light', emoji: '☁️', group: 'flow' },
  { id: 'valued', label: 'Valued', emoji: '💎', group: 'safety' },
  { id: 'natural', label: 'Natural', emoji: '🌿', group: 'flow' },
  { id: 'alive', label: 'Alive', emoji: '⚡', group: 'spark' },
];

export const Day3MoodBoard: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const setDay3MoodBoard = useDayStore(s => s.setDay3MoodBoard);

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

  const calculateTheme = () => {
    const counts = { safety: 0, flow: 0, spark: 0 };
    selectedIds.forEach(id => {
      const tile = MOOD_TILES.find(t => t.id === id);
      if (tile) counts[tile.group]++;
    });

    if (counts.safety >= 2) return 'Safety';
    if (counts.flow >= 2) return 'Flow';
    if (counts.spark >= 2) return 'Spark';
    return 'Clarity'; // Default for mixed
  };

  const handleNext = () => {
    const theme = calculateTheme();
    setDay3MoodBoard(selectedIds, theme);
    haptics.success();
    navigation.navigate('Day3OneCertainty');
  };

  const renderItem = ({ item }: { item: MoodTile }) => {
    const isSelected = selectedIds.includes(item.id);
    const isDisabled = !isSelected && selectedIds.length >= 3;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleToggle(item.id)}
        disabled={isDisabled}
        style={[
          styles.tile,
          isSelected && styles.tileSelected,
          isDisabled && styles.tileDisabled,
        ]}
      >
        <Text style={styles.tileEmoji}>{item.emoji}</Text>
        <Text style={[styles.tileLabel, isSelected && styles.tileLabelSelected]}>
          {item.label}
        </Text>
        {isSelected && (
          <View style={styles.checkBadge}>
            <Check size={12} color="#FFFFFF" strokeWidth={3} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper>
      <ProgressStrip currentDay={3} />
      
      <View style={styles.container}>
        <View style={styles.header}>
          {/* <View style={styles.eyebrowPill}>
            <Sparkles size={metrics.iconSize.xs} color={colors.day3} />
            <Text style={[styles.eyebrow, { color: colors.day3 }]}>GAME 07 · MOOD BOARD MATCH</Text>
          </View> */}
          <DayHeader eyebrow="GAME 07 · MOOD BOARD MATCH" />
          <Text style={styles.title}>
            3 tiles that match how you want to feel with your partner this month.
          </Text>
          <Text style={styles.subtitle}>
            Selection: {selectedIds.length}/3
          </Text>
        </View>

        <FlatList
          data={MOOD_TILES}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          scrollEnabled={false}
        />
      </View>

      <DayCTA 
        title="Lock it in" 
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
  title: {
    ...typography.displaySmall,
    color: c.text,
    fontFamily: 'PlayfairDisplay-Italic',
    lineHeight: metrics.fontSize.h3 * 1.4,
  },
  subtitle: {
    ...typography.labelBold,
    color: c.textHint,
    marginTop: metrics.spacing.sm,
    textTransform: 'uppercase',
  },
  listContent: {
    gap: metrics.spacing.md,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: metrics.spacing.md,
  },
  tile: {
    width: (responsiveWidth(100) - metrics.layout.screenPaddingHz * 2 - metrics.spacing.md) / 2,
    aspectRatio: 1,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: metrics.radius.xl,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: metrics.spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    position: 'relative',
  },
  tileSelected: {
    borderColor: '#E85C7A',
    backgroundColor: 'rgba(232,92,122,0.03)',
    borderWidth: 2,
  },
  tileDisabled: {
    opacity: 0.4,
  },
  tileEmoji: {
    fontSize: responsiveFontSize(4.5),
    marginBottom: metrics.spacing.sm,
  },
  tileLabel: {
    ...typography.bodyMedium,
    color: c.textSecondary,
    fontFamily: fonts.dmSansBold,
  },
  tileLabelSelected: {
    color: '#E85C7A',
  },
  checkBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E85C7A',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
