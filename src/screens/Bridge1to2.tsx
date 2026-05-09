import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { DayCTA } from '../components/common/DayCTA';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { StreakRing } from '../components/common/StreakRing';
import { IntentionWordSelector } from '../components/common/IntentionWordSelector';
import { useAppColors } from '../theme';
import { bridgeQuotes } from '../data/quizData';
import { useDayStore } from '../store/useDayStore';
import { useStreakStore } from '../store/useStreakStore';
import { personalityTypes } from '../data/personalityTypes';
import { haptics } from '../utils/haptics';
import { DayHeader } from '../components/common/DayHeader';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { metrics } from '../theme/metrics';
import { fonts, typography } from '../theme/typography';
import { 
  Sparkles, ShieldCheck, Leaf, Heart, Target, Star, Waves, ChevronRight, Flame
} from 'lucide-react-native';

type Nav = StackNavigationProp<RootStackParamList, 'Bridge1to2'>;

export const Bridge1to2: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const day1 = useDayStore((s) => s.day1);
  const setIntentionWord = useDayStore((s) => s.setDay2IntentionWord);
  const streakCount = useStreakStore((s) => s.streakCount);
  const shieldUsed = useStreakStore((s) => s.shieldUsed);

  const personality = personalityTypes.find((p) => p.id === day1.personalityType);

  const pillars = [
    { label: 'Reflection', Icon: Leaf, color: colors.day1, pos: styles.satLeft },
    { label: 'Growth', Icon: Heart, color: '#E85C7A', pos: styles.satRight },
    { label: 'Intention', Icon: Target, color: colors.primary, pos: styles.satBottom },
  ];

  const getDerivedMood = (score: number) => {
    if (score >= 9) return { emoji: '🔥', label: 'Inspired', color: '#FEF3C7' };
    if (score >= 7) return { emoji: '😊', label: 'Hopeful', color: '#D1FAE5' };
    if (score >= 5) return { emoji: '🌿', label: 'Open', color: '#ECFDF5' };
    if (score >= 3) return { emoji: '🙏', label: 'Honest', color: '#F3F4F6' };
    return { emoji: '🛡️', label: 'Brave', color: '#FEE2E2' };
  };

  const derivedMood = getDerivedMood(day1.sliderScore);

  const renderStars = (score: number) => {
    const stars = [];
    const normalizedScore = Math.round(score / 2); // 10 -> 5 stars
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          size={14} 
          color={i <= normalizedScore ? '#FBBF24' : '#E5E7EB'} 
          fill={i <= normalizedScore ? '#FBBF24' : 'transparent'} 
          style={{marginHorizontal: 1}}
        />
      );
    }
    return stars;
  };

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <DayHeader eyebrow="BRIDGE · TO DAY 2" />

        {/* Zone 1 — Journey Visualization */}
        <View style={styles.journeyZone}>
          <Text style={styles.journeyTitle}>Your Journey</Text>
          <View >
            {/* Orbital Path */}
           

            {/* Dynamic Satellites */}
            {/* {pillars.map((item, idx) => (
              <View key={idx} style={[styles.satellite, item.pos]}>
                <View style={styles.satIconBox}><item.Icon size={16} color={item.color} /></View>
                <Text style={styles.satLabel}>{item.label}</Text>
              </View>
            ))} */}

            {/* Central Streak Ring */}
            <View style={styles.ringInner}>
              <View style={styles.dayHexagon}>
                <Text style={styles.dayNumber}>{streakCount}</Text>
                <Text style={styles.dayLabel}>DAY</Text>
              </View>
              <View style={styles.ringProgress} />
            </View>
          </View>
        </View>

        {/* Zone 2 — Rich Recap Card */}
        <View style={styles.zone2}>
          <Text style={styles.recapLabel}>Yesterday you said</Text>
          <View style={styles.richRecapCard}>
            {/* Mood Face Section */}
            <View style={styles.recapCol}>
              <View style={[styles.moodFace]}>
                <Text style={{ fontSize: responsiveFontSize(4) }}>{derivedMood.emoji}</Text>
              </View>
              <Text style={styles.moodLabelSmall}>Mood</Text>
              <Text style={styles.moodValueText}>{derivedMood.label}</Text>
            </View>

            <View style={styles.recapDivider} />

            {/* Score Section */}
            <View style={[styles.recapCol, { flex: 1.2 }]}>
              <Text style={styles.scoreLabelSmall}>Your Score</Text>
              <View style={styles.scoreRow}>
                <Text style={styles.scoreBig}>{day1.sliderScore}</Text>
                <Text style={styles.scoreOf}>/ 10</Text>
              </View>
              <View style={styles.starsRow}>
                {renderStars(day1.sliderScore)}
              </View>
            </View>

            <View style={styles.recapDivider} />

            {/* Quote Section */}
            <View style={styles.quoteBox}>
              <Text style={styles.quoteMiniText}>
                {bridgeQuotes.bridge_1to2}
              </Text>
            </View>
          </View>

          {personality && (
            <TouchableOpacity activeOpacity={0.9} style={[styles.personalityCard]}>
              <View style={[styles.personalityIconBox, { backgroundColor: personality.color + '15' }]}>
                <Waves size={20} color={personality.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.personalityName, { color: personality.color }]}>{personality.name}</Text>
                <Text style={styles.personalitySub}>{personality.subLabel}</Text>
              </View>
              {/* <ChevronRight size={18} color={colors.textHint} /> */}
            </TouchableOpacity>
          )}

          {shieldUsed && (
            <View style={styles.shieldCard}>
              <ShieldCheck size={metrics.iconSize.xs} color={colors.primary} style={{marginRight: 6}} />
              <Text style={styles.shieldText}>Life happened today. Your streak is safe.</Text>
            </View>
          )}
        </View>

        {/* Zone 3 — Intention Word */}
        <View style={styles.zone2b}>
          <IntentionWordSelector accentColor={colors.day2} onSelect={setIntentionWord} />
        </View>
      </ScrollView>

      <DayCTA title="Continue to Day 2" onPress={() => { haptics.medium(); navigation.navigate('Day2MoodPicker');} } />
    </ScreenWrapper>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  content: { paddingHorizontal: metrics.layout.screenPaddingHz, paddingBottom: metrics.spacing.lg, gap: metrics.spacing.md, paddingTop: metrics.spacing.sm },
  
  // Journey Zone
  journeyZone: { alignItems: 'center',  },
  journeyTitle: { 
    color: c.textSecondary, 
    ...typography.labelBold,
    textTransform: 'uppercase', 
    marginBottom: responsiveHeight(3)
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
  
  // Satellites
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
  satBottom: { bottom: 12, alignSelf: 'center' },

  // Recap Card
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
  moodFace: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  moodLabelSmall: { 
    ...typography.labelBold,
    fontSize: metrics.fontSize.micro,
    color: c.textHint, 
    textTransform: 'uppercase' 
  },
  moodValueText: { 
    ...typography.bodyBold,
    fontSize: metrics.fontSize.bodySm,
    color: c.text 
  },
  
  recapDivider: { width: 1, height: '60%', backgroundColor: '#F3F4F6', marginHorizontal: 8 },
  
  scoreLabelSmall: { 
    ...typography.labelBold,
    fontSize: metrics.fontSize.micro,
    color: c.textHint, 
    textTransform: 'uppercase' 
  },
  scoreRow: { flexDirection: 'row', alignItems: 'baseline' },
  scoreBig: { 
    fontSize: metrics.fontSize.h1 * 1.2, 
    fontFamily: fonts.playfairSemiBold, 
    color: c.text 
  },
  scoreOf: { 
    ...typography.bodyMedium,
    fontSize: metrics.fontSize.caption,
    color: c.textHint, 
    marginLeft: 2 
  },
  starsRow: { flexDirection: 'row', marginTop: 2 },
  
  quoteBox: { flex: 1.5, backgroundColor: '#F0FDF4', borderRadius: metrics.radius.md, padding: metrics.spacing.sm, position: 'relative' },
  quoteMiniText: { 
    ...typography.quoteItalic,
    fontSize: metrics.fontSize.caption,
    color: '#064E3B', 
  },

  // Personality Card
  personalityCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FFF', borderRadius: 100, padding: 10,
    borderWidth: 1, borderColor: '#F3F4F6',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2, gap: 12
  },
  personalityIconBox: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  personalityTitleRow: { flexDirection: 'row', alignItems: 'center' },
  personalityName: { 
    ...typography.bodyBold,
    color: c.text 
  },
  personalitySub: { 
    ...typography.caption,
    fontSize: metrics.fontSize.micro,
    color: c.textSecondary 
  },

  shieldCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: `${c.primary}10`, borderRadius: metrics.radius.md, padding: 6,
    borderWidth: 1, borderColor: `${c.primary}20`
  },
  shieldText: { 
    ...typography.quoteItalic,
    fontSize: metrics.fontSize.micro,
    color: c.textSecondary 
  },
  zone2b: { marginTop: metrics.spacing.xs },
});
