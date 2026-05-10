import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { DayCTA } from '../components/common/DayCTA';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { ProgressStrip } from '../components/common/ProgressStrip';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { useAppColors } from '../theme';
import { useDayStore } from '../store/useDayStore';
import { personalityTypes } from '../data/personalityTypes';
import { haptics } from '../utils/haptics';
import { metrics } from '../theme/metrics';
import { typography, fonts } from '../theme/typography';
import { Heart, Cloud, Sparkles, Target, Award } from 'lucide-react-native';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

type Nav = StackNavigationProp<RootStackParamList, 'Day5ReportCard'>;

const DAY_LABELS = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'];

export const Day5ReportCard: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const DAY_COLORS = [colors.day1, colors.day2, colors.day3, colors.day4, colors.day5];
  const navigation = useNavigation<Nav>();
  
  const { day1, day2, day3, day4, day5, getDedicationScore } = useDayStore();

  const personality = personalityTypes.find((p) => p.id === day1.personalityType);

  // --- CALCULATE SCORES ---
  const scores = useMemo(() => {
    // 1. Connection Score (/100)
    let connectionScore = 0;
    connectionScore += (day1.sliderScore / 10) * 20; // 20
    
    const vibePts = day1.vibe_d1_category === 'positive' ? 10 : day1.vibe_d1_category === 'tender' ? 7 : 3;
    connectionScore += vibePts; // 10
    
    connectionScore += (day2.moodScore / 9) * 10; // 10
    connectionScore += (day3.d3_mood_board.length / 3) * 10; // 10
    connectionScore += (day4.d4_priority_picks.length / 3) * 10; // 10
    
    const dedication = getDedicationScore();
    connectionScore += (dedication / 7.0) * 40; // 40
    
    // 2. Partner Knowledge Score (/10)
    const knowledgeScore = day3.trueRatio * 10;

    return {
      connection: Math.round(connectionScore),
      knowledge: Math.round(knowledgeScore * 10) / 10,
      dedication: Math.round(dedication * 10) / 10,
    };
  }, [day1, day2, day3, day4, getDedicationScore]);

  // --- DERIVE THEMES ---
  const emotionalWeather = useMemo(() => {
    const vibe = day1.vibe_d1 ?? 'Open';
    const theme = day3.d3_mood_board_theme ?? 'Flow';
    return `${vibe} & ${theme}`;
  }, [day1.vibe_d1, day3.d3_mood_board_theme]);

  const topNeeds = useMemo(() => {
    return day4.d4_priority_picks.slice(0, 2);
  }, [day4.d4_priority_picks]);

  return (
    <ScreenWrapper>
      <ProgressStrip currentDay={5} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
            <Text style={styles.title}>The Reveal</Text>
            <Text style={styles.subtitle}>Your 5-day emotional fingerprint.</Text>
        </View>

        {/* Section 1: Hero Scores */}
        <View style={styles.heroRow}>
            <View style={styles.scoreCard}>
                <Text style={styles.scoreValue}>{scores.connection}</Text>
                <Text style={styles.scoreLabel}>Connection Score</Text>
                <View style={styles.scoreBar}><View style={[styles.scoreFill, { width: `${scores.connection}%` }]} /></View>
            </View>
            <View style={styles.scoreCard}>
                <Text style={styles.scoreValue}>{scores.knowledge}/10</Text>
                <Text style={styles.scoreLabel}>Knowledge Score</Text>
                <View style={styles.scoreBar}><View style={[styles.scoreFill, { width: `${scores.knowledge * 10}%`, backgroundColor: colors.day3 }]} /></View>
            </View>
        </View>

        {/* Section 2: Emotional Weather */}
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Cloud size={16} color={colors.primary} />
                <Text style={styles.sectionTitle}>EMOTIONAL WEATHER</Text>
            </View>
            <LinearGradient colors={['#F0FDF4', '#FFFFFF']} style={styles.weatherCard}>
                <Text style={styles.weatherValue}>{emotionalWeather}</Text>
                <Text style={styles.weatherDesc}>Based on your Day 1 Vibe and Day 3 Mood Board.</Text>
            </LinearGradient>
        </View>

        {/* Section 3: Relationship Needs */}
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Target size={16} color={colors.day4} />
                <Text style={[styles.sectionTitle, { color: colors.day4 }]}>TOP NEEDS</Text>
            </View>
            <View style={styles.needsRow}>
                {topNeeds.map((need, i) => (
                    <View key={i} style={styles.needPill}>
                        <Text style={styles.needText}>{need}</Text>
                    </View>
                ))}
                {topNeeds.length === 0 && <Text style={styles.emptyText}>No priorities selected.</Text>}
            </View>
        </View>

        {/* Section 4: Badge Reveal */}
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Award size={16} color={colors.day5} />
                <Text style={[styles.sectionTitle, { color: colors.day5 }]}>YOUR BADGE</Text>
            </View>
            <View style={styles.badgeCard}>
                <Sparkles size={32} color={colors.day5} style={styles.badgeIcon} />
                <Text style={styles.badgeName}>The Explorer</Text>
                <Text style={styles.badgeDesc}>You value discovery and novelty in your connection.</Text>
            </View>
        </View>

      </ScrollView>

      <DayCTA title="Continue to the Promise" onPress={() => { haptics.medium(); navigation.navigate('Day5ThePromise');} } />
    </ScreenWrapper>
  );
};

const makeStyles = (c: any) => StyleSheet.create({
  content: { padding: 24, paddingBottom: 100 },
  header: { marginBottom: 32 },
  title: { ...typography.displayLarge, color: c.text, fontFamily: 'PlayfairDisplay-Bold' },
  subtitle: { ...typography.bodyMedium, color: c.textSecondary, fontFamily: 'PlayfairDisplay-Italic' },
  heroRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  scoreCard: { 
    flex: 1, backgroundColor: '#FFF', borderRadius: 16, padding: 16, 
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2
  },
  scoreValue: { fontSize: 32, fontFamily: fonts.dmSansBold, color: c.text },
  scoreLabel: { ...typography.caption, color: c.textSecondary, marginTop: 4 },
  scoreBar: { height: 4, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 2, marginTop: 12 },
  scoreFill: { height: '100%', backgroundColor: c.primary, borderRadius: 2 },
  section: { marginBottom: 32 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { ...typography.labelBold, color: c.primary, letterSpacing: 1 },
  weatherCard: { padding: 20, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(45,212,191,0.1)' },
  weatherValue: { fontSize: 24, fontFamily: 'PlayfairDisplay-Bold', color: c.text },
  weatherDesc: { ...typography.caption, color: c.textHint, marginTop: 4 },
  needsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  needPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 100, backgroundColor: 'rgba(45,212,191,0.1)', borderWidth: 1, borderColor: 'rgba(45,212,191,0.2)' },
  needText: { ...typography.caption, fontFamily: fonts.dmSansBold, color: c.textSecondary },
  badgeCard: { alignItems: 'center', backgroundColor: '#FFF', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  badgeIcon: { marginBottom: 12 },
  badgeName: { fontSize: 22, fontFamily: 'PlayfairDisplay-Bold', color: c.text },
  badgeDesc: { ...typography.caption, color: c.textSecondary, textAlign: 'center', marginTop: 4 },
  emptyText: { ...typography.caption, color: c.textHint, fontStyle: 'italic' },
});
