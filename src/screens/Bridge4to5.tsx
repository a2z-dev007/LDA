import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { DayCTA } from '../components/common/DayCTA';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { useAppColors } from '../theme';
import { bridgeQuotes } from '../data/quizData';
import { useDayStore } from '../store/useDayStore';
import { useStreakStore } from '../store/useStreakStore';
import { haptics } from '../utils/haptics';
import { DayHeader } from '../components/common/DayHeader';
import {
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { metrics } from '../theme/metrics';
import { fonts, typography } from '../theme/typography';
import { 
  Leaf, Heart, Target, Box
} from 'lucide-react-native';

type Nav = StackNavigationProp<RootStackParamList, 'Bridge4to5'>;

export const Bridge4to5: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const day4 = useDayStore((s) => s.day4);
  const streakCount = useStreakStore((s) => s.streakCount);

  const displayStreak = Math.max(streakCount, 5);

  const pillars = [
    { label: 'Reflection', Icon: Leaf, color: colors.day1, pos: styles.satLeft },
    { label: 'Growth', Icon: Heart, color: '#E85C7A', pos: styles.satRight },
    { label: 'Intention', Icon: Target, color: colors.primary, pos: styles.satBottom },
  ];

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <DayHeader eyebrow="BRIDGE · TO DAY 5" />

        {/* Zone 1 — Journey Visualization */}
        <View style={styles.journeyZone}>
          <Text style={styles.journeyTitle}>Your Journey ✨</Text>
          <View style={styles.ringWrapper}>
            <View style={styles.orbitalPath} />

            {pillars.map((item, idx) => (
              <View key={idx} style={[styles.satellite, item.pos]}>
                <View style={styles.satIconBox}><item.Icon size={16} color={item.color} /></View>
                <Text style={styles.satLabel}>{item.label}</Text>
              </View>
            ))}

            <View style={styles.ringInner}>
              <View style={styles.dayHexagon}>
                <Text style={styles.dayNumber}>{displayStreak}</Text>
                <Text style={styles.dayLabel}>DAY</Text>
              </View>
              <View style={styles.ringProgress} />
            </View>
          </View>
        </View>

        {/* Zone 2 — Rich Recap Card */}
        <View style={styles.zone2}>
          <Text style={styles.recapLabel}>What's in the jar</Text>
          <View style={styles.richRecapCard}>
            {/* Jar Section */}
            <View style={styles.recapCol}>
              <View style={[styles.statCircle, { backgroundColor: colors.day4 + '15' }]}>
                <Box size={22} color={colors.day4} />
              </View>
              <Text style={styles.moodLabelSmall}>Memory</Text>
              <Text style={styles.moodValueText}>Saved</Text>
            </View>

            <View style={styles.recapDivider} />

            {/* Memory Section */}
            <View style={[styles.recapCol, { flex: 1.2, alignItems: 'flex-start' }]}>
              <Text style={styles.scoreLabelSmall}>You sealed in</Text>
              <Text style={styles.answerPreview} numberOfLines={3}>
                {day4.memoryContent || "A beautiful memory of us."}
              </Text>
            </View>

            <View style={styles.recapDivider} />

            {/* Quote Section */}
            <View style={styles.quoteBox}>
              <Text style={styles.quoteMiniText}>
                {bridgeQuotes.bridge_4to5}
              </Text>
            </View>
          </View>
        </View>

        {/* Note: Per PRD, no IntentionWordSelector on final bridge to day 5 */}
      </ScrollView>

      <DayCTA title="Continue to Day 5" onPress={() => { haptics.success(); navigation.navigate('Day5Celebration');} } />
    </ScreenWrapper>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  content: { paddingHorizontal: metrics.layout.screenPaddingHz, paddingBottom: metrics.spacing.lg, gap: metrics.spacing.md, paddingTop: metrics.spacing.sm },
  
  journeyZone: { alignItems: 'center', marginVertical: metrics.spacing.sm },
  journeyTitle: { 
    color: c.textSecondary, 
    ...typography.labelBold,
    textTransform: 'uppercase', 
    marginBottom: metrics.spacing.lg 
  },
  ringWrapper: { width: responsiveWidth(75), height: responsiveWidth(65), justifyContent: 'center', alignItems: 'center' },
  
  orbitalPath: {
    position: 'absolute', width: responsiveWidth(55), height: responsiveWidth(55),
    borderRadius: responsiveWidth(27.5), borderWidth: 1, borderColor: `${c.primary}20`,
    borderStyle: 'dashed',
  },

  ringInner: { 
    width: responsiveWidth(28), height: responsiveWidth(28), borderRadius: responsiveWidth(14),
    backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 1,
    borderWidth: 6, borderColor: '#F0F9F9'
  },
  dayHexagon: { alignItems: 'center', justifyContent: 'center' },
  dayNumber: { 
    fontSize: metrics.fontSize.h1 * 1.5, 
    fontFamily: fonts.dmSansBold, 
    color: c.text 
  },
  dayLabel: { 
    ...typography.labelBold,
    fontSize: metrics.fontSize.micro,
    color: c.textHint, 
    marginBottom: -2 
  },
  ringProgress: {
    position: 'absolute', width: responsiveWidth(32), height: responsiveWidth(32),
    borderRadius: responsiveWidth(16), borderWidth: 3, borderColor: c.primary,
    opacity: 0.7,
  },
  
  satellite: { position: 'absolute', alignItems: 'center', gap: 4 },
  satIconBox: { 
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF', 
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
    borderWidth: 1, borderColor: '#F0F9F9'
  },
  satLabel: { 
    ...typography.labelSmall,
    fontSize: metrics.fontSize.micro,
    color: c.textSecondary 
  },
  satLeft: { left: metrics.spacing.sm, top: '35%' },
  satRight: { right: metrics.spacing.sm, top: '35%' },
  satBottom: { bottom: 0, alignSelf: 'center' },

  zone2: { gap: metrics.spacing.sm },
  recapLabel: { 
    color: c.primary, 
    ...typography.labelBold,
    textTransform: 'uppercase' 
  },
  richRecapCard: {
    flexDirection: 'row', backgroundColor: '#FFF', borderRadius: metrics.radius.xl, padding: metrics.spacing.md,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 15, elevation: 1,
    alignItems: 'center'
  },
  recapCol: { alignItems: 'center', gap: 4, flex: 1 },
  statCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  moodLabelSmall: { 
    ...typography.labelBold,
    fontSize: metrics.fontSize.micro,
    color: c.textHint, 
    textTransform: 'uppercase' 
  },
  moodValueText: { 
    ...typography.bodyBold,
    fontSize: metrics.fontSize.micro + 2,
    color: c.text 
  },
  
  recapDivider: { width: 1, height: '60%', backgroundColor: '#F3F4F6', marginHorizontal: 8 },
  
  scoreLabelSmall: { 
    ...typography.labelBold,
    fontSize: metrics.fontSize.micro,
    color: c.textHint, 
    textTransform: 'uppercase' 
  },
  answerPreview: {
    ...typography.bodySmall,
    color: c.text,
    fontFamily: fonts.playfairItalic,
    lineHeight: 16
  },
  
  quoteBox: { flex: 1.5, backgroundColor: '#F0FDF4', borderRadius: metrics.radius.md, padding: metrics.spacing.sm, position: 'relative' },
  quoteMiniText: { 
    ...typography.quoteItalic,
    fontSize: metrics.fontSize.caption,
    color: '#064E3B', 
  },
});
