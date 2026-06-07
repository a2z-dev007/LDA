import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { ProgressStrip } from '../../components/common/ProgressStrip';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { useAppColors } from '../../theme';
import { typography, fonts } from '../../theme/typography';
import { metrics } from '../../theme/metrics';
import { haptics } from '../../utils/haptics';
import { useDayStore } from '../../store/useDayStore';
import { Check, Database } from 'lucide-react-native';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { GradientButton } from '../../components/common/GradientButton';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { getMoodBoardCombo } from '../../data/moodBoardCombos';

type Nav = StackNavigationProp<RootStackParamList, 'Day3MoodBoard'>;

interface MoodTile {
  id: string;
  label: string;
  emoji: string;
}

const MOOD_TILES: MoodTile[] = [
  { id: 'comfort', label: 'Comfort', emoji: '☕' },
  { id: 'fresh_start', label: 'Fresh start', emoji: '🌅' },
  { id: 'our_world', label: 'Our world', emoji: '🎧' },
  { id: 'under_cloud', label: 'Under cloud', emoji: '🌧️' },
  { id: 'intimate', label: 'Intimate', emoji: '🕯️' },
  { id: 'peaceful', label: 'Peaceful', emoji: '🌿' },
  { id: 'up_down', label: 'Up & down', emoji: '📈' },
  { id: 'figuring_out', label: 'Figuring out', emoji: '🧩' },
  { id: 'blossoming', label: 'Blossoming', emoji: '🌻' },
  { id: 'safe_home', label: 'Safe home', emoji: '🏠' },
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

  const calculateTheme = (ids: string[]) => {
    // Count matches for Deeply Connected: intimate, our_world, comfort
    const deeplyConnectedCount = ids.filter(id => ['intimate', 'our_world', 'comfort'].includes(id)).length;
    if (deeplyConnectedCount >= 2) return 'Deeply Connected';

    // Count matches for Safe & Steady: safe_home, comfort, peaceful
    const safeSteadyCount = ids.filter(id => ['safe_home', 'comfort', 'peaceful'].includes(id)).length;
    if (safeSteadyCount >= 2) return 'Safe & Steady';

    // Count matches for Growing & Open: fresh_start, blossoming, peaceful
    const growingOpenCount = ids.filter(id => ['fresh_start', 'blossoming', 'peaceful'].includes(id)).length;
    if (growingOpenCount >= 2) return 'Growing & Open';

    // Count matches for Navigating Together: up_down, figuring_out, under_cloud
    const navigatingTogetherCount = ids.filter(id => ['up_down', 'figuring_out', 'under_cloud'].includes(id)).length;
    if (navigatingTogetherCount >= 2) return 'Navigating Together';

    return 'Mixed & Moving';
  };

  const handleNext = () => {
    const combo = getMoodBoardCombo(selectedIds);
    const theme = combo ? combo.title : calculateTheme(selectedIds);
    setDay3MoodBoard(selectedIds, theme);
    haptics.success();
    navigation.navigate('Day3MoodBoardResult');
  };

  return (
    <ScreenWrapper>
      {/* <ProgressStrip currentDay={3} /> */}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <ScreenHeader
            title="Mood Board Match"
            eyebrow=""
          />

          <Text style={styles.italicInstruction}>
            "You just answered 10 questions about them. Now — pick 3 tiles that describe your relationship this week."
          </Text>
          <Text style={styles.statusLabel}>
            Selected: {selectedIds.length} / 3 · CTA unlocks at exactly 3
          </Text>
        </View>

        {/* Grid of 10 items */}
        <View style={styles.gridContainer}>
          {MOOD_TILES.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            const isDisabled = !isSelected && selectedIds.length >= 3;
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                onPress={() => handleToggle(item.id)}
                disabled={isDisabled}
                style={[
                  styles.tile,
                  isSelected && styles.tileSelected,
                  isDisabled && styles.tileDisabled,
                ]}
              >
                <View style={styles.tileContent}>
                  <Text style={styles.tileEmoji}>{item.emoji}</Text>
                  <Text
                    numberOfLines={1}
                    style={[styles.tileLabel, isSelected && styles.tileLabelSelected]}
                  >
                    {item.label}
                  </Text>
                </View>
                {isSelected && (
                  <View style={styles.checkBadge}>
                    <Check size={10} color="#FFFFFF" strokeWidth={3} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.tapNote}>Tap to select · Tap again to deselect</Text>

        {/* Database indicator banner */}
        {/* <View style={styles.databaseBanner}>
          <Database size={16} color={colors.textHint} />
          <Text style={styles.databaseBannerText}>
            Stores: d3_mood_board (array 3) · d3_mood_board_theme
          </Text>
        </View> */}

        {/* Action Button */}
        <View style={styles.buttonContainer}>
          <GradientButton
            text={selectedIds.length === 3 ? "Save these 3 →" : "Save and unlocks at 3 selected"}
            disabled={selectedIds.length < 3}
            onPress={handleNext}
            fullWidth
            showArrow={false}

          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const makeStyles = (c: any) => StyleSheet.create({
  scrollContent: {
    paddingBottom: metrics.spacing.xl,
  },
  header: {
    paddingHorizontal: metrics.layout.screenPaddingHz,
    // marginTop: metrics.spacing.md,
    marginBottom: metrics.spacing.lg,
  },
  italicInstruction: {
    ...typography.bodyMedium,
    color: c.textSecondary,
    fontFamily: 'PlayfairDisplay-Italic',
    lineHeight: metrics.fontSize.body * 1.4,
    marginVertical: metrics.spacing.sm,
  },
  statusLabel: {
    ...typography.captionSmall,
    color: c.textHint,
    fontFamily: fonts.dmSansBold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: metrics.spacing.xs,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: metrics.layout.screenPaddingHz,
    gap: metrics.spacing.md,
  },
  tile: {
    // 2 columns, accounting for padding and gap spacing
    width: (responsiveWidth(100) - metrics.layout.screenPaddingHz * 2 - metrics.spacing.md) / 2,
    height: 64,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(45, 95, 93, 0.12)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: metrics.spacing.md,
    shadowColor: '#1A2E2A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
    position: 'relative',
  },
  tileSelected: {
    borderColor: '#2D5F5D',
    backgroundColor: '#EBFDF5',
    borderWidth: 2,
  },
  tileDisabled: {
    opacity: 0.4,
  },
  tileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: metrics.spacing.sm,
  },
  tileEmoji: {
    fontSize: 20,
  },
  tileLabel: {
    fontSize: 14,
    fontFamily: fonts.dmSansBold,
    color: '#1F3E3C', // Dark forest teal
    flex: 1,
  },
  tileLabelSelected: {
    color: '#2D5F5D', // Selected green text
  },
  checkBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#2D5F5D',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    zIndex: 10,
  },
  tapNote: {
    ...typography.captionSmall,
    color: c.textHint,
    textAlign: 'center',
    marginTop: metrics.spacing.md,
    marginBottom: metrics.spacing.xl,
  },
  databaseBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(45, 95, 93, 0.05)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: metrics.layout.screenPaddingHz,
    marginBottom: metrics.spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(45, 95, 93, 0.08)',
  },
  databaseBannerText: {
    ...typography.captionSmall,
    color: c.textSecondary,
    fontFamily: fonts.dmSansMedium,
  },
  buttonContainer: {
    paddingHorizontal: metrics.layout.screenPaddingHz,
    marginBottom: metrics.spacing.lg,
  },
});
