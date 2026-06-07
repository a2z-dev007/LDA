import React, { useMemo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { DayCTA } from '../../components/common/DayCTA';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { ProgressStrip } from '../../components/common/ProgressStrip';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { useAppColors } from '../../theme';
import { useDayStore } from '../../store/useDayStore';
import { personalityTypes } from '../../data/personalityTypes';
import { haptics } from '../../utils/haptics';
import { metrics } from '../../theme/metrics';
import { typography, fonts } from '../../theme/typography';
import { 
  Heart, Cloud, Sparkles, Target, Award, 
  TrendingUp, Calendar, Lock, BookOpen, 
  Smile, Flame, Play, HelpCircle, Eye, Info 
} from 'lucide-react-native';
import { Day5Scoring } from '../../services/scoring/day5Scoring';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

type Nav = StackNavigationProp<RootStackParamList, 'Day5ReportCard'>;

export const Day5ReportCard: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  
  const { day1, day2, day3, day4, day5 } = useDayStore();
  const personality = personalityTypes.find((p) => p.id === day1.personalityType);

  // --- 1. MASTER SCORE CALCULATION ---
  const reportData = useMemo(() => {
    return Day5Scoring.consolidate(day1, day2, day3, day4, day5.promise);
  }, [day1, day2, day3, day4, day5.promise]);

  // --- 2. SECTION 1: MOOD JOURNEY GRAPH VALUES ---
  const getDay4Tone = (text: string | null) => {
    if (!text) return 5;
    const lower = text.toLowerCase();
    const positiveWords = ['grateful', 'happy', 'calm', 'loved', 'good', 'joy', 'peace', 'warm', 'seen', 'safe', 'light'];
    const negativeWords = ['tired', 'frustrated', 'anxious', 'distant', 'heavy', 'lonely', 'sad', 'angry', 'stress', 'overwhelm'];
    for (const word of positiveWords) {
      if (lower.includes(word)) return 7;
    }
    for (const word of negativeWords) {
      if (lower.includes(word)) return 4;
    }
    return 5;
  };

  const d1Val = day1.sliderScore;
  const d2Val = day2.moodScore || 5;
  const d3Val = parseFloat(((d1Val + d2Val) / 2).toFixed(1));
  const d4Val = getDay4Tone(day4.daily2Q1);
  const d5Val = parseFloat(((d1Val + d2Val + d3Val + d4Val) / 4).toFixed(1));

  const chartData = [
    { label: 'D1', val: d1Val, color: colors.day1 },
    { label: 'D2', val: d2Val, color: colors.day2 },
    { label: 'D3', val: d3Val, color: colors.day3 },
    { label: 'D4', val: d4Val, color: colors.day4 },
    { label: 'D5', val: d5Val, color: colors.day5 },
  ];

  const moodInsightLine = useMemo(() => {
    if (d4Val > d1Val) {
      return "Your connection grew warmer as the days went by. That's a beautiful trajectory.";
    } else if (d4Val < d1Val) {
      return "This week had its weight. Sometimes facing the gap is the first step toward closing it.";
    } else if (d3Val < d1Val && d3Val < d4Val) {
      return "You hit an honest dip midweek, but you stayed with it and climbed back up. That's resilience.";
    } else {
      return "Your emotional path remained steady and grounded this week.";
    }
  }, [d1Val, d2Val, d3Val, d4Val]);

  // --- 3. SECTION 2: EMOTIONAL WEATHER PATTERNS ---
  const d2Emoji = useMemo(() => {
    switch(day2.mood) {
      case 'connected': return '🤝';
      case 'grateful': return '🤍';
      case 'loved': return '🔥';
      case 'playful': return '✨';
      case 'overwhelmed': return '😮💨';
      case 'frustrated': return '🕯️';
      case 'distant': return '🌊';
      case 'missed': return '🌙';
      default: return '🍃';
    }
  }, [day2.mood]);

  const weatherPattern = useMemo(() => {
    const isD1Positive = day1.vibe_d1_category === 'positive';
    const isD2Positive = ['connected', 'grateful', 'loved', 'playful'].includes(day2.mood || '');
    const isD1Heavy = day1.vibe_d1_category === 'heavy';
    const isD2Heavy = ['overwhelmed', 'frustrated', 'distant', 'missed'].includes(day2.mood || '');

    if (isD1Positive && isD2Positive) {
      return "Your week felt grounded.";
    } else if (isD1Heavy && isD2Heavy) {
      return "It was a hard week. You showed up anyway.";
    } else if (isD1Heavy && !isD2Heavy && day3.d3_mood_board_theme) {
      return `You came in at a heavy start and left at ${day3.d3_mood_board_theme}. That's growth.`;
    } else {
      return "Your week moved. So did you.";
    }
  }, [day1.vibe_d1_category, day2.mood, day3.d3_mood_board_theme]);

  // --- 4. SECTION 4: RELATIONSHIP NEEDS DESCRIPTION ---
  const needDescription = useMemo(() => {
    const topNeed = day4.d4_top_need;
    if (topNeed === "More warmth & affection") return "You're craving closeness right now. Not grand gestures — just presence.";
    if (topNeed === "Deeper conversations") return "You're hungry for the real stuff. The kind of talk that doesn't happen by accident.";
    if (topNeed === "Laughter & lightness") return "You want to feel like you again — and like them again.";
    if (topNeed === "Dedicated time together") return "You need time that belongs only to you. Uninterrupted, chosen, real.";
    if (topNeed === "More calm, less stress") return "You need the relationship to feel like relief, not pressure.";
    return "You're focused on aligning your weekly priorities.";
  }, [day4.d4_top_need]);

  // --- 5. SECTION 6: JAR REVEAL ANIMATIONS ---
  const glowAnim = useRef(new Animated.Value(0.7)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1.1, duration: 1000, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.7, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <ScreenWrapper>
      <ProgressStrip currentDay={5} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Ceremonial Header */}
        <View style={styles.header}>
          <Text style={styles.title}>The Reveal</Text>
          <Text style={styles.subtitle}>Your 5-day relationship profile is ready.</Text>
        </View>

        {/* Section 1: Mood Journey */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>SECTION 1 · MOOD JOURNEY</Text>
          </View>
          
          <View style={styles.chartContainer}>
            {chartData.map((bar, i) => (
              <View key={i} style={styles.chartCol}>
                <Text style={styles.barVal}>{bar.val}/10</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { height: `${bar.val * 10}%`, backgroundColor: bar.color }]} />
                </View>
                <Text style={styles.barLabel}>{bar.label}</Text>
              </View>
            ))}
          </View>

          {/* Connection Score Total display */}
          <View style={styles.connectionScoreContainer}>
            <Text style={styles.connectionScoreLabel}>Connection Score</Text>
            <View style={styles.connectionScoreBadge}>
              <Text style={styles.connectionScoreVal}>{reportData.connectionScore}</Text>
              <Text style={styles.connectionScoreMax}>/100</Text>
            </View>
          </View>

          <View style={styles.insightBox}>
            <Text style={styles.insightText}>"{moodInsightLine}"</Text>
          </View>
        </View>

        {/* Section 2: Emotional Weather */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Cloud size={18} color={colors.day2} />
            <Text style={[styles.sectionTitle, { color: colors.day2 }]}>SECTION 2 · EMOTIONAL WEATHER</Text>
          </View>
          <Text style={styles.description}>Emotional theme of Days 1, 2, and 3:</Text>
          <View style={styles.weatherRow}>
            <View style={styles.weatherTile}>
              <Text style={styles.tileIcon}>🎭</Text>
              <Text style={styles.tileTitle}>Day 1 Vibe</Text>
              <Text style={styles.tileVal}>{day1.vibe_d1 || 'Open'}</Text>
            </View>
            <View style={styles.weatherTile}>
              <Text style={styles.tileIcon}>{d2Emoji}</Text>
              <Text style={styles.tileTitle}>Day 2 Mood</Text>
              <Text style={styles.tileVal}>{day2.mood ? day2.mood.charAt(0).toUpperCase() + day2.mood.slice(1) : 'None'}</Text>
            </View>
            <View style={styles.weatherTile}>
              <Text style={styles.tileIcon}>🎨</Text>
              <Text style={styles.tileTitle}>Day 3 Theme</Text>
              <Text style={styles.tileVal}>{day3.d3_mood_board_theme || 'Mixed'}</Text>
            </View>
          </View>
          <View style={[styles.insightBox, { borderLeftColor: colors.day2 }]}>
            <Text style={[styles.insightText, { color: colors.textSecondary }]}>{weatherPattern}</Text>
          </View>
        </View>

        {/* Section 3: Personality Type Deep Dive */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Sparkles size={18} color={colors.day1} />
            <Text style={[styles.sectionTitle, { color: colors.day1 }]}>SECTION 3 · PERSONALITY PROFILE</Text>
          </View>
          {personality ? (
            <View style={styles.personalityBody}>
              <LinearGradient colors={['rgba(255,45,85,0.08)', 'rgba(255,255,255,0.1)']} style={styles.personalityHero}>
                <Text style={styles.personalityName}>{personality.name}</Text>
                <Text style={styles.personalitySub}>{personality.description}</Text>
              </LinearGradient>
              <Text style={styles.subLabel}>Core Strengths:</Text>
              {personality.traits.map((str, idx) => (
                <View key={idx} style={styles.bulletRow}>
                  <Heart size={14} color={colors.day1} fill={colors.day1} style={{ marginTop: 2, marginRight: 8, opacity: 0.8 }} />
                  <Text style={styles.bulletText}>{str}</Text>
                </View>
              ))}
              <View style={styles.growthCard}>
                <Text style={styles.growthLabel}>Growth Invitation:</Text>
                <Text style={styles.growthText}>{personality.growth}</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.emptyText}>Personality type not resolved.</Text>
          )}
        </View>

        {/* Section 4: Your Relationship Needs This Week */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Target size={18} color={colors.day4} />
            <Text style={[styles.sectionTitle, { color: colors.day4 }]}>SECTION 4 · RELATIONSHIP NEEDS</Text>
          </View>
          {day4.d4_priority_picks.length > 0 ? (
            <View style={styles.needsContainer}>
              <Text style={styles.topNeedLabel}>YOUR TOP NEED</Text>
              <LinearGradient colors={['rgba(212,112,16,0.1)', 'rgba(255,255,255,0.05)']} style={styles.topNeedCard}>
                <Text style={styles.topNeedTitle}>{day4.d4_top_need}</Text>
                <Text style={styles.topNeedDesc}>{needDescription}</Text>
              </LinearGradient>
              <Text style={styles.subLabel}>Ranked Priorities:</Text>
              {day4.d4_priority_picks.map((pick, i) => (
                <View key={i} style={styles.needRankRow}>
                  <View style={styles.rankBadge}><Text style={styles.rankNum}>{i + 1}</Text></View>
                  <Text style={styles.needRankText}>{pick}</Text>
                </View>
              ))}
              
              {/* Partner glass sealed placeholder */}
              <View style={styles.partnerSealedCard}>
                <Lock size={16} color={colors.textHint} style={{ marginRight: 8 }} />
                <Text style={styles.partnerSealedText}>Partner's needs are sealed until they join</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.emptyText}>No priorities shuffeled.</Text>
          )}
        </View>

        {/* Section 5: Week in Moments */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Calendar size={18} color={colors.day3} />
            <Text style={[styles.sectionTitle, { color: colors.day3 }]}>SECTION 5 · WEEK IN MOMENTS</Text>
          </View>
          <View style={styles.timeline}>
            
            {/* Day 1 Moment */}
            <View style={styles.timelineItem}>
              <View style={[styles.timelineLine, { backgroundColor: colors.day1 }]} />
              <View style={[styles.timelineNode, { borderColor: colors.day1 }]} />
              <View style={styles.momentCard}>
                <Text style={[styles.momentDay, { color: colors.day1 }]}>DAY 1 · THE SPARK CHECK</Text>
                <Text style={styles.momentTitle}>"Came in at {day1.sliderScore}/10"</Text>
                <Text style={styles.momentQuote}>Vibe: {day1.vibe_d1 || 'Open'} · Profile: {personality?.name || 'Resolving'}</Text>
              </View>
            </View>

            {/* Day 2 Moment */}
            <View style={styles.timelineItem}>
              <View style={[styles.timelineLine, { backgroundColor: colors.day2 }]} />
              <View style={[styles.timelineNode, { borderColor: colors.day2 }]} />
              <View style={styles.momentCard}>
                <Text style={[styles.momentDay, { color: colors.day2 }]}>DAY 2 · THE MOOD ROOM</Text>
                <Text style={styles.momentTitle}>Intention: {day2.intentionWord || 'Gentle'}</Text>
                {day2.oneGoodThing && <Text style={styles.momentQuote}>"{day2.oneGoodThing}"</Text>}
                <Text style={styles.momentMeta}>Mood: {day2.mood ? day2.mood.toUpperCase() : 'None'}</Text>
              </View>
            </View>

            {/* Day 3 Moment */}
            <View style={styles.timelineItem}>
              <View style={[styles.timelineLine, { backgroundColor: colors.day3 }]} />
              <View style={[styles.timelineNode, { borderColor: colors.day3 }]} />
              <View style={styles.momentCard}>
                <Text style={[styles.momentDay, { color: colors.day3 }]}>DAY 3 · THE MIRROR GAME</Text>
                {day3.d3_fms_pick && <Text style={styles.momentQuote}>"{day3.d3_fms_pick}"</Text>}
                {day3.oneCertainty && <Text style={styles.momentCertainty}>Certainty: "{day3.oneCertainty}"</Text>}
                <Text style={styles.momentMeta}>Appreciation Snap: {day3.appreciationSnap || 'None'}</Text>
              </View>
            </View>

            {/* Day 4 Moment */}
            <View style={styles.timelineItem}>
              <View style={[styles.timelineLine, { opacity: 0 }]} />
              <View style={[styles.timelineNode, { borderColor: colors.day4 }]} />
              <View style={styles.momentCard}>
                <Text style={[styles.momentDay, { color: colors.day4 }]}>DAY 4 · THE MEMORY JAR</Text>
                {day4.memoryContent && <Text style={styles.momentQuote}>"{day4.memoryContent.slice(0, 60)}..."</Text>}
                <Text style={styles.momentMeta}>Compliment: {day4.tinyComplimentWord || 'None'} · dropbox: {day4.dropBoxUsed ? 'Used' : 'Skipped'}</Text>
              </View>
            </View>

          </View>
        </View>

        {/* Section 6: Memory Jar Full Reveal */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Award size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>SECTION 6 · MEMORY JAR REVEAL</Text>
          </View>
          <View style={styles.jarMockContainer}>
            <LinearGradient colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.02)']} style={styles.jarGlass}>
              <Animated.View style={[styles.jarGlow, { opacity: glowAnim }]} />
              <Text style={styles.jarTitle}>Memory Jar</Text>
              <Text style={styles.jarFillLabel}>100% FILLED</Text>
              
              {day4.tinyComplimentWord && (
                <View style={styles.floatingCompliment}>
                  <Sparkles size={10} color="#FFF" style={{ marginRight: 4 }} />
                  <Text style={styles.floatingComplimentText}>{day4.tinyComplimentWord.toUpperCase()}</Text>
                </View>
              )}

              <View style={styles.notesGrid}>
                {day1.vibe_d1 && <View style={[styles.jarMiniNote, { backgroundColor: colors.day1 }]}><Text style={styles.miniNoteText}>D1 Vibe</Text></View>}
                {day2.oneGoodThing && <View style={[styles.jarMiniNote, { backgroundColor: colors.day2 }]}><Text style={styles.miniNoteText}>D2 Note</Text></View>}
                {day3.appreciationSnap && <View style={[styles.jarMiniNote, { backgroundColor: colors.day3 }]}><Text style={styles.miniNoteText}>D3 Snap</Text></View>}
                {day4.memoryContent && <View style={[styles.jarMiniNote, { backgroundColor: colors.day4 }]}><Text style={styles.miniNoteText}>D4 Memory</Text></View>}
                
                {day4.dropBoxUsed && (
                  <View style={[styles.jarMiniNote, { backgroundColor: '#FBEAF0', borderColor: colors.day2, borderWidth: 1 }]} pointerEvents="none">
                    <Text style={[styles.miniNoteText, { color: colors.day2 }]}>Dropbox</Text>
                  </View>
                )}
                {day4.loveDropUsed && (
                  <View style={[styles.jarMiniNote, { backgroundColor: '#FFFBEA', borderColor: colors.day4, borderWidth: 1 }]} pointerEvents="none">
                    <Text style={[styles.miniNoteText, { color: colors.day4 }]}>Love Drop</Text>
                  </View>
                )}
              </View>
            </LinearGradient>
          </View>
          <View style={styles.notesDetailsRow}>
            {day4.dropBoxUsed && <Text style={styles.tagNotePill}>🌹 Something you found the words for</Text>}
            {day4.loveDropUsed && <Text style={styles.tagNotePill}>✨ Something waiting for them</Text>}
          </View>
        </View>

        {/* Section 7: Your Badge */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Award size={18} color={colors.day5} />
            <Text style={[styles.sectionTitle, { color: colors.day5 }]}>SECTION 7 · YOUR BADGE</Text>
          </View>
          <View style={styles.badgeRevealCard}>
            <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.badgeHalo}>
              <Award size={48} color="#FFF" />
            </LinearGradient>
            <Text style={styles.badgeName}>{reportData.badge.name}</Text>
            <View style={styles.tierPill}>
               <Text style={styles.tierPillText}>{reportData.badgeTier.toUpperCase()} TIER</Text>
            </View>
            <Text style={styles.badgeDesc}>{reportData.badge.description}</Text>
            
            <View style={styles.badgeTraitsRow}>
              {reportData.badge.traitPills.map((tr, idx) => (
                <View key={idx} style={styles.traitBadge}>
                  <Text style={styles.traitText}>{tr}</Text>
                </View>
              ))}
            </View>

            {/* Sub-scores Row */}
            <View style={styles.subScoresContainer}>
              <View style={styles.subScoreItem}>
                <Text style={styles.subScoreLabel}>DEDICATION SCORE</Text>
                <Text style={styles.subScoreVal}>{reportData.dedicationScore} <Text style={styles.subScoreMax}>/7</Text></Text>
              </View>
              <View style={styles.subScoreDivider} />
              <View style={styles.subScoreItem}>
                <Text style={styles.subScoreLabel}>PARTNER KNOWLEDGE</Text>
                <Text style={styles.subScoreVal}>{reportData.partnerKnowledgeScore} <Text style={styles.subScoreMax}>/10</Text></Text>
              </View>
            </View>
          </View>
        </View>

        {/* Section 8: Couple Mode Unlock */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Lock size={18} color="#E67E22" />
            <Text style={[styles.sectionTitle, { color: '#E67E22' }]}>SECTION 8 · COUPLE MODE GAMES UNLOCKED</Text>
          </View>
          <Text style={styles.description}>Activities ready for your partner to join:</Text>
          
          <View style={styles.gameList}>
            <View style={styles.gameItem}>
              <HelpCircle size={16} color={colors.textHint} />
              <View style={styles.gameBody}>
                <Text style={styles.gameTitle}>G01 Prediction Game</Text>
                <Text style={styles.gameStatus}>Locked Preview · Awaits partner predictions</Text>
              </View>
            </View>

            <View style={styles.gameItem}>
              <BookOpen size={16} color={colors.day3} />
              <View style={styles.gameBody}>
                <Text style={styles.gameTitle}>G02 Finish My Sentence</Text>
                <Text style={styles.gameStatus}>
                  Your answer: "{day3.d3_fms_pick ? day3.d3_fms_pick.slice(0, 30) + '...' : 'Completed'}" · Partner card sealed 🔒
                </Text>
              </View>
            </View>

            <View style={styles.gameItem}>
              <Info size={16} color={colors.textHint} />
              <View style={styles.gameBody}>
                <Text style={styles.gameTitle}>G03 Us vs. The Question</Text>
                <Text style={styles.gameStatus}>Locked Preview · Awaits partner invite</Text>
              </View>
            </View>

            <View style={styles.gameItem}>
              <Play size={16} color={colors.day2} />
              <View style={styles.gameBody}>
                <Text style={styles.gameTitle}>G06 This or That: Us Edition</Text>
                <Text style={styles.gameStatus}>
                  Your rounds: {day2.b2_tot_rounds.length} picks · Partner predictions sealed 🔒
                </Text>
              </View>
            </View>

            {day4.loveDropUsed && (
              <View style={styles.gameItem}>
                <Heart size={16} color={colors.day4} fill={colors.day4} style={{ opacity: 0.7 }} />
                <View style={styles.gameBody}>
                  <Text style={styles.gameTitle}>Love Drop Sealed Message</Text>
                  <Text style={styles.gameStatus}>Sealed note waiting on partner's device 🔒</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Closing statement of the report card */}
        <View style={styles.closingStatementContainer}>
          <Text style={styles.closingStatementLabel}>YOUR PROMISE FOR THE RELATIONSHIP</Text>
          <Text style={styles.closingStatementText}>
            {day5.promise && day5.promise.trim() 
              ? `"${day5.promise}"` 
               : `"A new week begins tomorrow."`}
          </Text>
        </View>
      </ScrollView>

      <DayCTA 
        title="Reveal Memory Jar" 
        onPress={() => { 
          haptics.medium(); 
          navigation.navigate('Day5JarReveal');
        }} 
      />
    </ScreenWrapper>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  content: { padding: 20, paddingBottom: 110 },
  header: { marginBottom: 24, paddingHorizontal: 4 },
  title: { ...typography.displayLarge, color: c.text, fontFamily: 'PlayfairDisplay-Bold' },
  subtitle: { ...typography.bodyMedium, color: c.textSecondary, fontFamily: 'PlayfairDisplay-Italic' },
  
  // Section Shell
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    marginBottom: 20,
    shadowColor: '#1A2E2A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    ...typography.captionSmall,
    color: c.primary,
    fontFamily: fonts.dmSansBold,
    letterSpacing: 1,
  },
  description: {
    ...typography.bodySmall,
    color: c.textSecondary,
    marginBottom: 12,
  },
  emptyText: {
    ...typography.caption,
    color: c.textHint,
    fontStyle: 'italic',
  },

  // Section 1: Mood Chart
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: responsiveHeight(15),
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  chartCol: {
    alignItems: 'center',
    flex: 1,
  },
  barVal: {
    fontSize: 9,
    fontFamily: fonts.dmSansBold,
    color: c.textSecondary,
    marginBottom: 4,
  },
  barTrack: {
    height: '75%',
    width: 14,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: 8,
  },
  barLabel: {
    ...typography.captionSmall,
    color: c.textHint,
    marginTop: 6,
    fontFamily: fonts.dmSansBold,
  },
  insightBox: {
    borderLeftWidth: 3,
    borderLeftColor: c.primary,
    paddingLeft: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(45,212,191,0.03)',
    borderRadius: 4,
  },
  insightText: {
    ...typography.bodySmall,
    color: c.primary,
    fontStyle: 'italic',
  },

  // Section 2: Emotional Weather
  weatherRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  weatherTile: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  tileIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  tileTitle: {
    fontSize: 9,
    fontFamily: fonts.dmSansBold,
    color: c.textHint,
    textTransform: 'uppercase',
  },
  tileVal: {
    ...typography.captionSmall,
    color: c.textSecondary,
    fontFamily: fonts.dmSansBold,
    marginTop: 2,
  },

  // Section 3: Personality Profile
  personalityBody: {
    gap: 12,
  },
  personalityHero: {
    borderRadius: 14,
    padding: 16,
  },
  personalityName: {
    ...typography.displaySmall,
    color: c.text,
    fontFamily: 'PlayfairDisplay-Bold',
    marginBottom: 4,
  },
  personalitySub: {
    ...typography.bodySmall,
    color: c.textSecondary,
  },
  subLabel: {
    ...typography.caption,
    fontFamily: fonts.dmSansBold,
    color: c.textHint,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 4,
  },
  bulletText: {
    ...typography.bodySmall,
    color: c.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  growthCard: {
    backgroundColor: 'rgba(255,45,85,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,45,85,0.1)',
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
  },
  growthLabel: {
    fontSize: 10,
    fontFamily: fonts.dmSansBold,
    color: c.day1,
    marginBottom: 2,
  },
  growthText: {
    ...typography.caption,
    color: c.textSecondary,
  },

  // Section 4: Needs
  needsContainer: {
    gap: 10,
  },
  topNeedLabel: {
    fontSize: 9,
    fontFamily: fonts.dmSansBold,
    color: c.day4,
    letterSpacing: 1,
  },
  topNeedCard: {
    borderRadius: 14,
    padding: 16,
  },
  topNeedTitle: {
    fontSize: 18,
    fontFamily: fonts.dmSansBold,
    color: c.text,
    marginBottom: 4,
  },
  topNeedDesc: {
    ...typography.caption,
    color: c.textSecondary,
    lineHeight: 16,
  },
  needRankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingLeft: 4,
  },
  rankBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(212,112,16,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNum: {
    fontSize: 10,
    fontFamily: fonts.dmSansBold,
    color: c.day4,
  },
  needRankText: {
    ...typography.bodySmall,
    color: c.textSecondary,
    fontFamily: fonts.dmSansMedium,
  },
  partnerSealedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.02)',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    marginTop: 4,
  },
  partnerSealedText: {
    fontSize: 11,
    fontFamily: fonts.dmSansMedium,
    color: c.textHint,
  },

  // Section 5: Timeline
  timeline: {
    paddingLeft: 12,
    marginTop: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    paddingBottom: 24,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 4,
    top: 14,
    bottom: -14,
    width: 2,
    opacity: 0.5,
  },
  timelineNode: {
    position: 'absolute',
    left: 0,
    top: 4,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
    zIndex: 2,
  },
  momentCard: {
    marginLeft: 24,
    backgroundColor: 'rgba(0,0,0,0.015)',
    borderRadius: 12,
    padding: 12,
    flex: 1,
  },
  momentDay: {
    fontSize: 9,
    fontFamily: fonts.dmSansBold,
    marginBottom: 4,
  },
  momentTitle: {
    fontSize: 13,
    fontFamily: fonts.dmSansBold,
    color: c.text,
  },
  momentQuote: {
    ...typography.caption,
    fontFamily: 'PlayfairDisplay-Italic',
    color: c.textSecondary,
    marginTop: 4,
  },
  momentCertainty: {
    ...typography.caption,
    fontFamily: 'PlayfairDisplay-Italic',
    color: c.primary,
    marginTop: 4,
  },
  momentMeta: {
    fontSize: 9,
    fontFamily: fonts.dmSansRegular,
    color: c.textHint,
    marginTop: 6,
  },

  // Section 6: Memory Jar
  jarMockContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  jarGlass: {
    width: responsiveWidth(55),
    height: responsiveWidth(65),
    borderRadius: 45,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.8)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    alignItems: 'center',
    paddingVertical: 18,
    position: 'relative',
    overflow: 'hidden',
  },
  jarGlow: {
    position: 'absolute',
    bottom: -30,
    width: responsiveWidth(55),
    height: responsiveWidth(35),
    borderRadius: 50,
    backgroundColor: 'rgba(212,112,16,0.15)',
    filter: 'blur(20px)',
  },
  jarTitle: {
    fontSize: 13,
    fontFamily: 'PlayfairDisplay-Bold',
    color: c.text,
  },
  jarFillLabel: {
    fontSize: 9,
    fontFamily: fonts.dmSansBold,
    color: c.primary,
    letterSpacing: 1,
    marginTop: 2,
  },
  floatingCompliment: {
    position: 'absolute',
    top: '35%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: c.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    shadowColor: c.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
    zIndex: 10,
  },
  floatingComplimentText: {
    color: '#FFF',
    fontSize: 9,
    fontFamily: fonts.dmSansBold,
  },
  notesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 16,
    marginTop: 'auto',
    marginBottom: 8,
  },
  jarMiniNote: {
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  miniNoteText: {
    fontSize: 7,
    fontFamily: fonts.dmSansBold,
    color: '#FFF',
  },
  notesDetailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
    marginTop: 8,
  },
  tagNotePill: {
    fontSize: 10,
    fontFamily: fonts.dmSansMedium,
    color: c.textSecondary,
    backgroundColor: 'rgba(0,0,0,0.03)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
  },

  // Section 7: Badge Reveal
  badgeRevealCard: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  badgeHalo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFA500',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 16,
  },
  badgeName: {
    fontSize: 22,
    fontFamily: 'PlayfairDisplay-Bold',
    color: c.text,
  },
  tierPill: {
    backgroundColor: 'rgba(212,112,16,0.1)',
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 6,
    marginBottom: 12,
  },
  tierPillText: {
    fontSize: 9,
    fontFamily: fonts.dmSansBold,
    color: c.day4,
  },
  badgeDesc: {
    ...typography.bodyMedium,
    color: c.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  badgeTraitsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  traitBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  traitText: {
    fontSize: 10,
    fontFamily: fonts.dmSansBold,
    color: c.textSecondary,
  },

  // Section 8: Couple Games
  gameList: {
    gap: 10,
    marginTop: 8,
  },
  gameItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(0,0,0,0.015)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  gameBody: {
    flex: 1,
  },
  gameTitle: {
    fontSize: 12,
    fontFamily: fonts.dmSansBold,
    color: c.text,
  },
  gameStatus: {
    fontSize: 10,
    color: c.textSecondary,
    marginTop: 1,
  },
  connectionScoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 148, 136, 0.05)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(13, 148, 136, 0.1)',
  },
  connectionScoreLabel: {
    fontSize: 15,
    fontFamily: fonts.dmSansBold,
    color: c.text,
  },
  connectionScoreBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  connectionScoreVal: {
    fontSize: 24,
    fontFamily: fonts.dmSansBold,
    color: c.primary,
  },
  connectionScoreMax: {
    fontSize: 13,
    fontFamily: fonts.dmSansMedium,
    color: c.textHint,
  },
  subScoresContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.015)',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    width: '100%',
    justifyContent: 'space-between',
  },
  subScoreItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  subScoreDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  subScoreLabel: {
    fontSize: 9,
    fontFamily: fonts.dmSansBold,
    color: c.textHint,
    letterSpacing: 0.5,
  },
  subScoreVal: {
    fontSize: 16,
    fontFamily: fonts.dmSansBold,
    color: c.text,
  },
  subScoreMax: {
    fontSize: 11,
    fontFamily: fonts.dmSansRegular,
    color: c.textHint,
  },
  closingStatementContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
    marginBottom: 20,
  },
  closingStatementLabel: {
    fontSize: 9,
    fontFamily: fonts.dmSansBold,
    color: c.textHint,
    letterSpacing: 1.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  closingStatementText: {
    fontSize: 16,
    fontFamily: 'PlayfairDisplay-Italic',
    fontStyle: 'italic',
    color: c.primary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
