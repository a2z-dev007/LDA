import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Modal, Pressable, Platform } from 'react-native';
import { DayCTA } from '../../components/common/DayCTA';
import { CommonJar, CommonJarHandle } from '../../components/common/CommonJar';
import { GradientButton } from '../../components/common/GradientButton';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { ProgressStrip } from '../../components/common/ProgressStrip';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { useAppColors } from '../../theme';
import { useDayStore } from '../../store/useDayStore';
import { useJournalStore } from '../../store/useJournalStore';
import { personalityTypes } from '../../data/personalityTypes';
import { haptics } from '../../utils/haptics';
import { metrics } from '../../theme/metrics';
import { typography, fonts } from '../../theme/typography';
import { 
  Heart, Cloud, Sparkles, Target, Award, 
  TrendingUp, Calendar, Lock, BookOpen, 
  Smile, Flame, Play, HelpCircle, Eye, Info,
  ChevronLeft, Lightbulb, CheckCircle2, ChevronRight, Star, Leaf, Gift
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
  const jarMemories = useJournalStore((s) => s.jarMemories);
  const personality = personalityTypes.find((p) => p.id === day1.personalityType);

  // Report Pages: 0 = Index, 1 = Mood Journey, 2 = Weather, 3 = Personality, 4 = Needs, 5 = Moments, 6 = Memory Jar, 7 = Badge, 8 = Couple Games
  const [currentPage, setCurrentPage] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'right' | 'left'>('right');
  const [showBadgeDetails, setShowBadgeDetails] = useState(false);
  const [showMemoriesModal, setShowMemoriesModal] = useState(false);

  // Transition animation values
  const pageAnim = useRef(new Animated.Value(1)).current;
  const jarGlowAnim = useRef(new Animated.Value(0.7)).current;
  const jarRef = useRef<CommonJarHandle>(null);

  // Jar breathing glow effect
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(jarGlowAnim, { toValue: 1.1, duration: 1200, useNativeDriver: true }),
        Animated.timing(jarGlowAnim, { toValue: 0.7, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Trigger jar tap magic automatically when transitioning to Page 6 (Memory Jar)
  useEffect(() => {
    if (currentPage === 6) {
      const timer = setTimeout(() => {
        jarRef.current?.triggerTap();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentPage]);

  const navigateToPage = (newPage: number, direction: 'right' | 'left' = 'right') => {
    haptics.medium();
    setSlideDirection(direction);
    pageAnim.setValue(0);
    setCurrentPage(newPage);
    Animated.spring(pageAnim, {
      toValue: 1,
      friction: 9,
      tension: 60,
      useNativeDriver: true,
    }).start();
  };

  const handleBack = () => {
    if (currentPage > 0) {
      navigateToPage(currentPage - 1, 'left');
    } else {
      haptics.light();
      navigation.goBack();
    }
  };

  // --- MASTER SCORE CALCULATION ---
  const reportData = useMemo(() => {
    return Day5Scoring.consolidate(day1, day2, day3, day4, day5.promise);
  }, [day1, day2, day3, day4, day5.promise]);

  // --- SECTION 1: MOOD JOURNEY GRAPH VALUES ---
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
    { label: 'Day 1', val: d1Val, color: colors.day1 },
    { label: 'Day 2', val: d2Val, color: colors.day2 },
    { label: 'Day 3', val: d3Val, color: colors.day3 },
    { label: 'Day 4', val: d4Val, color: colors.day4 },
    { label: 'Day 5', val: d5Val, color: colors.day5 },
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

  // --- SECTION 2: EMOTIONAL WEATHER PATTERNS ---
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
      return "You started and maintained a highly positive frequency. Your week felt grounded.";
    } else if (isD1Heavy && isD2Heavy) {
      return "It was a hard week with heavier weather. You showed up for each other anyway.";
    } else if (isD1Heavy && !isD2Heavy && day3.d3_mood_board_theme) {
      return `You came in at a heavy start and left at ${day3.d3_mood_board_theme}. That's growth.`;
    } else {
      return "Your week moved through various emotional patterns. So did you.";
    }
  }, [day1.vibe_d1_category, day2.mood, day3.d3_mood_board_theme]);

  // --- SECTION 4: RELATIONSHIP NEEDS DESCRIPTION ---
  const needDescription = useMemo(() => {
    const topNeed = day4.d4_top_need;
    if (topNeed === "More warmth & affection") return "You're craving closeness right now. Not grand gestures — just presence.";
    if (topNeed === "Deeper conversations") return "You're hungry for the real stuff. The kind of talk that doesn't happen by accident.";
    if (topNeed === "Laughter & lightness") return "You want to feel like you again — and like them again.";
    if (topNeed === "Dedicated time together") return "You need time that belongs only to you. Uninterrupted, chosen, real.";
    if (topNeed === "More calm, less stress") return "You need the relationship to feel like relief, not pressure.";
    return "You're focused on aligning your weekly priorities.";
  }, [day4.d4_top_need]);

  // Helper to parse key-value contents for Memory Jar Modal
  const parseMemory = (content: string) => {
    if (content.includes(': ')) {
      const [title, body] = content.split(': ');
      return { title: title.trim(), body: body.trim() };
    }
    if (content.startsWith('Felt ')) {
      return { title: 'Vibe Check', body: content };
    }
    if (content.includes('Mirror Question')) {
      return { title: 'Mirror Connection', body: content };
    }
    if (content.includes('Mood Board')) {
      return { title: 'Creative Intimacy', body: content };
    }
    return { title: 'Memory Jar Entry', body: content };
  };

  // Helper to resolve Lucide icon for memories
  const getMemoryIcon = (title: string, body: string) => {
    const t = title.toLowerCase();
    const b = body.toLowerCase();
    
    if (t.includes('honest') || t.includes('score')) return Star;
    if (t.includes('relationship type') || b.includes('steady flame') || b.includes('electric spark')) return Flame;
    if (t.includes('growing') || b.includes('growing') || b.includes('🌱')) return Leaf;
    if (t.includes('vibe') || b.includes('felt')) return Smile;
    if (t.includes('this or that') || t.includes('game')) return Award;
    if (t.includes('certainty')) return Info;
    if (t.includes('compliment')) return Heart;
    if (t.includes('promise')) return Sparkles;
    if (t.includes('mirror') || b.includes('mirror')) return BookOpen;
    if (t.includes('mood board') || b.includes('mood board')) return Sparkles;
    
    return Heart;
  };

  // Helper to render segment indicators for Pages 1-8
  const renderProgressDots = () => {
    if (currentPage === 0) return null;
    return (
      <View style={styles.indicatorRow}>
        {Array.from({ length: 8 }).map((_, idx) => {
          const isCurrent = idx + 1 === currentPage;
          const isPassed = idx + 1 < currentPage;
          return (
            <View
              key={idx}
              style={[
                styles.indicatorSegment,
                isPassed && { backgroundColor: colors.primary },
                isCurrent && { backgroundColor: colors.accent, width: 28 },
              ]}
            />
          );
        })}
      </View>
    );
  };

  // --- RENDER SECTION HEADER FOR PAGES 1-8 ---
  const renderPageHeader = (num: number, title: string, subtitle: string) => {
    return (
      <View style={styles.pageHeader}>
        <View style={styles.pageHeaderNumberCircle}>
          <Text style={styles.pageHeaderNumberText}>{num}</Text>
        </View>
        <View style={styles.pageHeaderTitleWrapper}>
          <Text style={styles.pageHeaderTitle}>{title}</Text>
          <Text style={styles.pageHeaderSubtitle}>{subtitle}</Text>
        </View>
      </View>
    );
  };

  // --- PAGE 0: REPORT INDEX ---
  const renderIndexPage = () => {
    const sections = [
      { id: 1, title: 'Mood Journey', sub: 'Your emotional ups & downs', icon: TrendingUp, color: colors.day1 },
      { id: 2, title: 'Emotional Weather', sub: 'The vibes you carried', icon: Cloud, color: colors.day2 },
      { id: 3, title: 'Personality Type Deep Dive', sub: 'Your strengths & growth edges', icon: Sparkles, color: colors.day3 },
      { id: 4, title: 'Your Relationship Needs', sub: 'What matters most to you', icon: Target, color: colors.day4 },
      { id: 5, title: 'Week in Moments', sub: 'A timeline of your week', icon: Calendar, color: colors.day5 },
      { id: 6, title: 'Memory Jar Full Reveal', sub: 'All the little things that mattered', icon: Award, color: colors.primary },
      { id: 7, title: 'Your Badge', sub: 'Your 5-day dedication', icon: Star, color: colors.accent },
      { id: 8, title: 'Couple Mode Unlock', sub: 'Fun games to try together', icon: Lock, color: '#E67E22', isNew: true },
    ];

    return (
      <View style={styles.slideContent}>
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.indexScrollContainer}>
          <View style={styles.ceremonialHeader}>
            <Text style={styles.indexTitle}>Your 5-Day Report</Text>
            <Text style={styles.indexSubtitle}>Here's what we discovered about you (and your relationship).</Text>
          </View>

          <View style={styles.indexList}>
            {sections.map((sec) => {
              const Icon = sec.icon;
              return (
                <TouchableOpacity
                  key={sec.id}
                  style={styles.indexItem}
                  onPress={() => navigateToPage(sec.id)}
                  activeOpacity={0.75}
                >
                  <View style={[styles.indexItemNumberCircle, { backgroundColor: `${sec.color}15`, borderColor: `${sec.color}40` }]}>
                    <Text style={[styles.indexItemNumberText, { color: sec.color }]}>{sec.id}</Text>
                  </View>
                  <View style={styles.indexItemContent}>
                    <View style={styles.indexItemHeaderRow}>
                      <Text style={styles.indexItemTitle}>{sec.title}</Text>
                      {sec.isNew && (
                        <View style={styles.newBadge}>
                          <Text style={styles.newBadgeText}>NEW</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.indexItemSubtitle}>{sec.sub}</Text>
                  </View>
                  <ChevronRight size={18} color={colors.textHint} />
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.footerCTAWrapper}>
          <GradientButton
            text="Start Your Report"
            onPress={() => navigateToPage(1)}
            gradientColors={colors.gradientBtn || [colors.buttonGradientStart, colors.buttonGradientEnd]}
            fullWidth
          />
        </View>
      </View>
    );
  };

  // --- PAGE 1: MOOD JOURNEY ---
  const renderMoodJourney = () => {
    return (
      <View style={styles.slideContent}>
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContentContainer}>
          {renderPageHeader(1, 'Mood Journey', 'Your emotional ups & downs')}

          <View style={styles.chartSectionCard}>
            <View style={styles.chartWrapper}>
              {/* Emojis Y-Axis */}
              <View style={styles.yAxis}>
                <Text style={styles.yAxisEmoji}>🥰</Text>
                <Text style={styles.yAxisEmoji}>🙂</Text>
                <Text style={styles.yAxisEmoji}>😐</Text>
                <Text style={styles.yAxisEmoji}>😢</Text>
              </View>
              {/* Chart Bars */}
              <View style={styles.chartBarsContainer}>
                {chartData.map((bar, i) => (
                  <View key={i} style={styles.chartColumn}>
                    <Text style={styles.barValueText}>{bar.val}/10</Text>
                    <View style={styles.barTrack}>
                      <View style={[styles.barFillProgress, { height: `${bar.val * 10}%`, backgroundColor: bar.color }]} />
                    </View>
                    <Text style={styles.barLabelText}>{bar.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Connection Score Card */}
            <View style={styles.scorePillCard}>
              <Text style={styles.scorePillLabel}>Connection Score</Text>
              <View style={styles.scorePillValueContainer}>
                <Text style={styles.scorePillValue}>{reportData.connectionScore}</Text>
                <Text style={styles.scorePillMax}>/100</Text>
              </View>
            </View>

            {/* Insight Statement */}
            <View style={styles.journeyInsightCard}>
              <View style={styles.insightIconRing}>
                <Lightbulb size={18} color={colors.primary} />
              </View>
              <Text style={styles.journeyInsightText}>
                "{moodInsightLine}"
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footerNavigation}>
          <GradientButton
            text="Next"
            onPress={() => navigateToPage(2)}
            gradientColors={colors.gradientBtn || [colors.buttonGradientStart, colors.buttonGradientEnd]}
            fullWidth
          />
          <TouchableOpacity onPress={() => navigateToPage(8)} style={styles.skipLink}>
            <Text style={styles.skipLinkLabel}>Skip to end</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // --- PAGE 2: EMOTIONAL WEATHER ---
  const renderEmotionalWeather = () => {
    return (
      <View style={styles.slideContent}>
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContentContainer}>
          {renderPageHeader(2, 'Emotional Weather', 'The vibes you carried')}

          <View style={styles.weatherCardLayout}>
            <View style={styles.weatherGrid}>
              {/* Tile 1: Day 1 */}
              <View style={styles.weatherTile}>
                <View style={styles.weatherTileIconCircle}>
                  <Text style={styles.weatherTileIcon}>☀️</Text>
                </View>
                <Text style={styles.weatherTileLabel}>Day 1 Vibe</Text>
                <Text style={styles.weatherTileValue} numberOfLines={1}>
                  {day1.vibe_d1 ? day1.vibe_d1.charAt(0).toUpperCase() + day1.vibe_d1.slice(1) : 'Hopeful'}
                </Text>
              </View>

              {/* Tile 2: Day 2 */}
              <View style={styles.weatherTile}>
                <View style={[styles.weatherTileIconCircle, { backgroundColor: `${colors.day2}12` }]}>
                  <Text style={styles.weatherTileIcon}>{d2Emoji}</Text>
                </View>
                <Text style={styles.weatherTileLabel}>Day 2 Mood</Text>
                <Text style={styles.weatherTileValue} numberOfLines={1}>
                  {day2.mood ? day2.mood.charAt(0).toUpperCase() + day2.mood.slice(1) : 'Reflective'}
                </Text>
              </View>

              {/* Tile 3: Day 3 */}
              <View style={styles.weatherTile}>
                <View style={[styles.weatherTileIconCircle, { backgroundColor: `${colors.day3}12` }]}>
                  <Text style={styles.weatherTileIcon}>🌱</Text>
                </View>
                <Text style={styles.weatherTileLabel}>Day 3 Theme</Text>
                <Text style={styles.weatherTileValue} numberOfLines={1}>
                  {day3.d3_mood_board_theme ? day3.d3_mood_board_theme.charAt(0).toUpperCase() + day3.d3_mood_board_theme.slice(1) : 'Growth'}
                </Text>
              </View>
            </View>

            {/* Insight Statement */}
            <View style={[styles.journeyInsightCard, { borderLeftColor: colors.day2 }]}>
              <View style={[styles.insightIconRing, { backgroundColor: `${colors.day2}15` }]}>
                <Sparkles size={18} color={colors.day2} />
              </View>
              <Text style={styles.journeyInsightText}>
                {weatherPattern}
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footerNavigation}>
          <GradientButton
            text="Next"
            onPress={() => navigateToPage(3)}
            gradientColors={colors.gradientBtn || [colors.buttonGradientStart, colors.buttonGradientEnd]}
            fullWidth
          />
          <TouchableOpacity onPress={() => navigateToPage(8)} style={styles.skipLink}>
            <Text style={styles.skipLinkLabel}>Skip to end</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // --- PAGE 3: PERSONALITY TYPE ---
  const renderPersonalityType = () => {
    return (
      <View style={styles.slideContent}>
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContentContainer}>
          {renderPageHeader(3, 'Personality Type Deep Dive', 'Your strengths & growth edges')}

          {personality ? (
            <View style={styles.personalitySectionWrapper}>
              <View style={[styles.personalityCardBox, { borderTopColor: colors.day3 }]}>
                <View style={styles.personalityHeaderRow}>
                  <View style={[styles.personalityIconWrapper, { backgroundColor: `${colors.day3}15` }]}>
                    <Award size={22} color={colors.day3} />
                  </View>
                  <View style={styles.personalityTextColumn}>
                    <Text style={styles.personalityTypeLabel}>Your Type</Text>
                    <Text style={styles.personalityTypeName}>{personality.name}</Text>
                  </View>
                </View>
                <Text style={styles.personalityDesc}>{personality.description}</Text>

                <View style={styles.strengthsDivider} />

                <Text style={styles.strengthsLabel}>Your Strengths</Text>
                <View style={styles.strengthsGrid}>
                  {personality.traits.map((trait, idx) => {
                    const parts = trait.split(': ');
                    const title = parts[0] || 'Strength';
                    const desc = parts[1] || '';
                    return (
                      <View key={idx} style={styles.strengthRow}>
                        <Smile size={18} color={colors.day3} style={styles.strengthBulletIcon} />
                        <View style={styles.strengthContent}>
                          <Text style={styles.strengthTitle}>{title}</Text>
                          {desc ? <Text style={styles.strengthDesc}>{desc}</Text> : null}
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* Growth Edge */}
              <View style={styles.growthInvitationCard}>
                <View style={styles.growthHeader}>
                  <Target size={16} color={colors.primary} style={{ marginRight: 6 }} />
                  <Text style={styles.growthLabelText}>Growth Edge</Text>
                </View>
                <Text style={styles.growthBodyText}>{personality.growth}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Info size={32} color={colors.textHint} />
              <Text style={styles.emptyLabel}>Personality type details not resolved yet.</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.footerNavigation}>
          <GradientButton
            text="Next"
            onPress={() => navigateToPage(4)}
            gradientColors={colors.gradientBtn || [colors.buttonGradientStart, colors.buttonGradientEnd]}
            fullWidth
          />
          <TouchableOpacity onPress={() => navigateToPage(8)} style={styles.skipLink}>
            <Text style={styles.skipLinkLabel}>Skip to end</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // --- PAGE 4: RELATIONSHIP NEEDS ---
  const renderRelationshipNeeds = () => {
    return (
      <View style={styles.slideContent}>
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContentContainer}>
          {renderPageHeader(4, 'Your Relationship Needs', 'What matters most to you')}

          <View style={styles.needsPageLayout}>
            {day4.d4_priority_picks.length > 0 ? (
              <View style={styles.needsRankContainer}>
                {day4.d4_priority_picks.map((pick, i) => {
                  let desc = "A priority item shuffeled during Day 4's activity.";
                  if (pick.includes("warmth")) desc = "I want to feel closer, share warmth and tender touches daily.";
                  if (pick.includes("conversations")) desc = "I want to feel mentally stimulated and connect deeply on thoughts.";
                  if (pick.includes("lightness")) desc = "I want to bring fun, laughter and ease into our routine.";
                  if (pick.includes("time together")) desc = "I want distraction-free dates where we focus purely on us.";
                  if (pick.includes("calm")) desc = "I want peace, space to breathe, and safety from daily anxiety.";

                  return (
                    <View key={i} style={styles.needRankItemCard}>
                      <View style={[styles.needRankBadge, { backgroundColor: `${colors.day4}12` }]}>
                        <Text style={[styles.needRankNumber, { color: colors.day4 }]}>{i + 1}</Text>
                      </View>
                      <View style={styles.needRankTextContainer}>
                        <Text style={styles.needRankItemTitle}>{pick}</Text>
                        <Text style={styles.needRankItemDesc}>{desc}</Text>
                      </View>
                    </View>
                  );
                })}

                <Text style={styles.needsFooterText}>
                  These are your top needs. Day 5 shows if they felt the same.
                </Text>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Target size={32} color={colors.textHint} />
                <Text style={styles.emptyLabel}>No priorities shuffled this week.</Text>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.footerNavigation}>
          <GradientButton
            text="Next"
            onPress={() => navigateToPage(5)}
            gradientColors={colors.gradientBtn || [colors.buttonGradientStart, colors.buttonGradientEnd]}
            fullWidth
          />
          <TouchableOpacity onPress={() => navigateToPage(8)} style={styles.skipLink}>
            <Text style={styles.skipLinkLabel}>Skip to end</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // --- PAGE 5: WEEK IN MOMENTS ---
  const renderWeekInMoments = () => {
    const timelineItems = [
      {
        day: 'Mon',
        title: 'DAY 1 · THE SPARK CHECK',
        vibe: `Completed Check-in (You felt ${day1.vibe_d1 ? day1.vibe_d1.charAt(0).toUpperCase() + day1.vibe_d1.slice(1) : 'Open'})`,
        content: `Entered the week with a score of ${day1.sliderScore}/10`,
        color: colors.day1,
        icon: Star,
      },
      {
        day: 'Tue',
        title: 'DAY 2 · THE MOOD ROOM',
        vibe: `Played This or That (Vibe: ${day2.mood ? day2.mood.charAt(0).toUpperCase() + day2.mood.slice(1) : 'Gentle'})`,
        content: day2.oneGoodThing ? `One good thing: "${day2.oneGoodThing}"` : `Intention Word: ${day2.intentionWord || 'Connected'}`,
        color: colors.day2,
        icon: Play,
      },
      {
        day: 'Wed',
        title: 'DAY 3 · THE MIRROR GAME',
        vibe: `Mood Board Theme: ${day3.d3_mood_board_theme ? day3.d3_mood_board_theme.toUpperCase() : 'GROWTH'}`,
        content: day3.oneCertainty ? `Certainty: "${day3.oneCertainty}"` : `Completed Finished My Sentence`,
        color: colors.day3,
        icon: BookOpen,
      },
      {
        day: 'Thu',
        title: 'DAY 4 · THE MEMORY JAR',
        vibe: `Priority Shuffle (Top Need: ${day4.d4_top_need || 'Validation'})`,
        content: day4.memoryContent ? `Added Memory: "${day4.memoryContent.slice(0, 48)}..."` : `Tiny Compliment: "${day4.tinyComplimentWord || 'Safe'}"`,
        color: colors.day4,
        icon: Target,
      },
      {
        day: 'Fri',
        title: 'DAY 5 · THE PROMISE',
        vibe: `Memory Jar Full Reveal (Calculated Badge)`,
        content: day5.promise ? `Your Promise: "${day5.promise}"` : `Finalized your 5-Day report`,
        color: colors.day5,
        icon: Award,
      },
    ];

    return (
      <View style={styles.slideContent}>
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContentContainer}>
          {renderPageHeader(5, 'Week in Moments', 'A timeline of your week')}

          <View style={styles.timelineContainer}>
            {timelineItems.map((item, idx) => {
              const ItemIcon = item.icon;
              return (
                <View key={idx} style={styles.timelineItem}>
                  {/* Vertical line connection */}
                  {idx < timelineItems.length - 1 && (
                    <View style={[styles.timelineVerticalLine, { backgroundColor: item.color }]} />
                  )}

                  {/* Date Badge Left */}
                  <View style={styles.timelineDateCol}>
                    <Text style={styles.timelineDayText}>{item.day}</Text>
                  </View>

                  {/* Circular Node */}
                  <View style={[styles.timelineNode, { borderColor: item.color, backgroundColor: colors.dark }]}>
                    <ItemIcon size={12} color={item.color} />
                  </View>

                  {/* Content Card */}
                  <View style={styles.timelineContentCard}>
                    <Text style={[styles.timelineItemHeader, { color: item.color }]}>{item.title}</Text>
                    <Text style={styles.timelineItemVibe}>{item.vibe}</Text>
                    <Text style={styles.timelineItemContent} numberOfLines={2}>{item.content}</Text>
                  </View>
                </View>
              );
            })}

            <Text style={styles.momentsFooterText}>Small moments. Big meaning.</Text>
          </View>
        </ScrollView>

        <View style={styles.footerNavigation}>
          <GradientButton
            text="Next"
            onPress={() => navigateToPage(6)}
            gradientColors={colors.gradientBtn || [colors.buttonGradientStart, colors.buttonGradientEnd]}
            fullWidth
          />
          <TouchableOpacity onPress={() => navigateToPage(8)} style={styles.skipLink}>
            <Text style={styles.skipLinkLabel}>Skip to end</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // --- PAGE 6: MEMORY JAR REVEAL ---
  const renderMemoryJarPage = () => {
    return (
      <View style={styles.slideContent}>
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContentContainer}>
          {renderPageHeader(6, 'Memory Jar Full Reveal', 'All the little things that mattered')}

          <View style={styles.jarMockCardWrapper}>
            <CommonJar 
              ref={jarRef}
              scale={2.2}
              primaryColor="#FBBF24"
              secondaryColor="#FFA500"
              colors={{
                glassStroke: '#FBBF24',            // Rich gold border outline
                glassInsideBgStart: 'rgba(254, 243, 199, 0.12)', // Warm gold interior shade
                glow: 'rgba(251, 191, 36, 0.45)',  // Golden magic aura
                sparkPrimary: '#FFFFFF',
                sparkSecondary: '#FEF08A',
                sparkGlow: '#FBBF24',
              }}
              onPress={() => {
                haptics.success();
                setShowMemoriesModal(true);
              }}
            />

            {day4.loveDropUsed && (
              <View style={styles.jarUnlockBanner}>
                <Text style={styles.jarUnlockText}>Love Drop note unlocked! + A sweet surprise from you.</Text>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.footerNavigation}>
          <GradientButton
            text="Open All Memories"
            onPress={() => {
              haptics.success();
              setShowMemoriesModal(true);
            }}
            gradientColors={colors.gradientBtn || [colors.buttonGradientStart, colors.buttonGradientEnd]}
            fullWidth
          />
          <TouchableOpacity onPress={() => navigateToPage(8)} style={styles.skipLink}>
            <Text style={styles.skipLinkLabel}>Skip to end</Text>
          </TouchableOpacity>
        </View>

        {/* --- FULLSCREEN MEMORIES DETAIL MODAL --- */}
        <Modal visible={showMemoriesModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeaderRow}>
                <Text style={styles.modalTitle}>Your Memories</Text>
                <Text style={styles.modalSubtitle}>All the notes you dropped into the jar this week.</Text>
              </View>

              <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.modalNotesList}>
                  {jarMemories.map((memory, i) => {
                    const parsed = parseMemory(memory.content || '');
                    const IconComp = getMemoryIcon(parsed.title, parsed.body);
                    const themeColor = memory.dayColor ?? colors.primary;

                    return (
                      <View key={memory.id} style={[styles.modalNoteCard, { borderColor: `${themeColor}40` }]}>
                        <View style={styles.modalNoteHeader}>
                          <View style={[styles.modalNoteIconCircle, { backgroundColor: `${themeColor}12` }]}>
                            <IconComp size={14} color={themeColor} strokeWidth={2} />
                          </View>
                          <Text style={[styles.modalNoteTitle, { color: themeColor }]}>
                            {parsed.title.toUpperCase()}
                          </Text>
                        </View>
                        <Text style={styles.modalNoteText}>"{parsed.body}"</Text>
                      </View>
                    );
                  })}

                  {day4.dropBoxUsed && (
                    <View style={[styles.modalNoteCard, { borderColor: '#E67E22' }]}>
                      <View style={styles.modalNoteHeader}>
                        <View style={[styles.modalNoteIconCircle, { backgroundColor: 'rgba(230,126,34,0.1)' }]}>
                          <Lock size={14} color="#E67E22" strokeWidth={2} />
                        </View>
                        <Text style={[styles.modalNoteTitle, { color: '#E67E22' }]}>DROP BOX NOTE</Text>
                      </View>
                      <Text style={styles.modalNoteText}>"Something you found the words for."</Text>
                    </View>
                  )}

                  {day4.loveDropUsed && (
                    <View style={[styles.modalNoteCard, { borderColor: '#FFD700' }]}>
                      <View style={styles.modalNoteHeader}>
                        <View style={[styles.modalNoteIconCircle, { backgroundColor: 'rgba(255,215,0,0.1)' }]}>
                          <Gift size={14} color="#B07010" strokeWidth={2} />
                        </View>
                        <Text style={[styles.modalNoteTitle, { color: '#B07010' }]}>LOVE DROP NOTE</Text>
                      </View>
                      <Text style={styles.modalNoteText}>"Something waiting for them."</Text>
                    </View>
                  )}

                  {jarMemories.length === 0 && !day4.dropBoxUsed && !day4.loveDropUsed && (
                    <View style={styles.modalEmptyJar}>
                      <Text style={styles.modalEmptyText}>Your jar holds this week's journey.</Text>
                    </View>
                  )}
                </View>
              </ScrollView>

              <View style={styles.modalFooter}>
                <GradientButton
                  text="Close & Continue"
                  onPress={() => {
                    haptics.medium();
                    setShowMemoriesModal(false);
                    navigateToPage(7);
                  }}
                  gradientColors={colors.gradientBtn || [colors.buttonGradientStart, colors.buttonGradientEnd]}
                  fullWidth
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  // --- PAGE 7: YOUR BADGE ---
  const renderBadgePage = () => {
    const tierColor = reportData.badgeTier === 'gold' 
      ? colors.accent 
      : reportData.badgeTier === 'standard' 
      ? colors.day2 
      : colors.day3;

    return (
      <View style={styles.slideContent}>
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContentContainer}>
          {renderPageHeader(7, 'Your Badge', 'Your 5-day dedication')}

          <View style={styles.badgeLayout}>
            {/* Shield Badge Container */}
            <View style={styles.shieldEmblemCard}>
              <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.badgeShieldHalo}>
                <Award size={48} color="#FFFFFF" strokeWidth={1.5} />
              </LinearGradient>
              <Text style={styles.badgeNameLabel}>{reportData.badge.name}</Text>
              <View style={[styles.badgeTierPillBadge, { borderColor: tierColor, backgroundColor: `${tierColor}15` }]}>
                <Text style={[styles.badgeTierTextLabel, { color: tierColor }]}>{reportData.badgeTier.toUpperCase()} TIER</Text>
              </View>
              <Text style={styles.badgeDescriptionText}>
                {reportData.badge.description}
              </Text>
            </View>

            {/* Badge Traits display */}
            <View style={styles.badgeTraitsContainer}>
              {reportData.badge.traitPills.map((trait, idx) => (
                <View key={idx} style={styles.badgeTraitPillItem}>
                  <Text style={styles.badgeTraitPillText}>{trait}</Text>
                </View>
              ))}
            </View>

            {/* Sub-Scores expandable panel */}
            {showBadgeDetails ? (
              <Animated.View style={styles.expandedSubScoresCard}>
                <Text style={styles.expandedSubScoresTitle}>Score Details</Text>
                
                {/* Dedication score row */}
                <View style={styles.subScoreItemRow}>
                  <View style={styles.subScoreLabelCol}>
                    <Text style={styles.subScoreItemLabel}>Dedication Score</Text>
                    <Text style={styles.subScoreItemDesc}>Streak consistency and game checks</Text>
                  </View>
                  <Text style={styles.subScoreItemValueText}>
                    {reportData.dedicationScore} <Text style={styles.subScoreItemMax}>/7</Text>
                  </Text>
                </View>
                <View style={styles.progressBarTrack}>
                  <View style={[styles.progressBarFill, { width: `${(reportData.dedicationScore / 7) * 100}%`, backgroundColor: colors.primary }]} />
                </View>

                <View style={styles.scoreRowSpacer} />

                {/* Partner Knowledge score row */}
                <View style={styles.subScoreItemRow}>
                  <View style={styles.subScoreLabelCol}>
                    <Text style={styles.subScoreItemLabel}>Partner Knowledge</Text>
                    <Text style={styles.subScoreItemDesc}>Correct predictions and choices</Text>
                  </View>
                  <Text style={styles.subScoreItemValueText}>
                    {reportData.partnerKnowledgeScore} <Text style={styles.subScoreItemMax}>/10</Text>
                  </Text>
                </View>
                <View style={styles.progressBarTrack}>
                  <View style={[styles.progressBarFill, { width: `${(reportData.partnerKnowledgeScore / 10) * 100}%`, backgroundColor: colors.accent }]} />
                </View>
              </Animated.View>
            ) : null}
          </View>
        </ScrollView>

        <View style={styles.footerNavigation}>
          {showBadgeDetails ? (
            <GradientButton
              text="Next"
              onPress={() => navigateToPage(8)}
              gradientColors={colors.gradientBtn || [colors.buttonGradientStart, colors.buttonGradientEnd]}
              fullWidth
            />
          ) : (
            <GradientButton
              text="See Badge Details"
              onPress={() => {
                haptics.medium();
                setShowBadgeDetails(true);
              }}
              gradientColors={colors.gradientBtn || [colors.buttonGradientStart, colors.buttonGradientEnd]}
              fullWidth
            />
          )}
          <TouchableOpacity onPress={() => navigateToPage(8)} style={styles.skipLink}>
            <Text style={styles.skipLinkLabel}>Skip to end</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // --- PAGE 8: COUPLE MODE UNLOCK ---
  const renderCoupleModeUnlock = () => {
    return (
      <View style={styles.slideContent}>
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContentContainer}>
          {renderPageHeader(8, 'Couple Mode Unlock', 'Two-player games to grow closer')}

          <View style={styles.unlockPageWrapper}>
            <Text style={styles.unlockDescription}>
              Activities ready for your partner to join:
            </Text>

            <View style={styles.gamesListStack}>
              {/* Game 1 */}
              <View style={styles.gameCardItem}>
                <View style={[styles.gameIconCircleBadge, { backgroundColor: 'rgba(143,161,177,0.12)' }]}>
                  <BookOpen size={20} color={colors.secondary} />
                </View>
                <View style={styles.gameInfoCol}>
                  <View style={styles.gameTitleRow}>
                    <Text style={styles.gameCardTitle}>G01 Deep Talk</Text>
                    <View style={styles.unlockLabelPill}>
                      <Text style={styles.unlockLabelText}>READY</Text>
                    </View>
                  </View>
                  <Text style={styles.gameCardSubtitle}>Start real conversations with deep cards</Text>
                </View>
              </View>

              {/* Game 2 */}
              <View style={styles.gameCardItem}>
                <View style={[styles.gameIconCircleBadge, { backgroundColor: `${colors.day3}12` }]}>
                  <HelpCircle size={20} color={colors.day3} />
                </View>
                <View style={styles.gameInfoCol}>
                  <View style={styles.gameTitleRow}>
                    <Text style={styles.gameCardTitle}>G02 Would You Rather</Text>
                    <View style={styles.unlockLabelPill}>
                      <Text style={styles.unlockLabelText}>READY</Text>
                    </View>
                  </View>
                  <Text style={styles.gameCardSubtitle}>Discover new sides and guess preferences</Text>
                </View>
              </View>
            </View>

            <Text style={styles.unlockFooterAnnotation}>
              * Invite your partner and keep the connection going.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footerNavigation}>
          <GradientButton
            text="Invite Partner"
            onPress={() => {
              haptics.success();
              navigation.navigate('Day5PartnerInvite');
            }}
            gradientColors={colors.gradientBtn || [colors.buttonGradientStart, colors.buttonGradientEnd]}
            fullWidth
          />
          <TouchableOpacity 
            onPress={() => {
              haptics.light();
              navigation.navigate('Day5TheLetter');
            }} 
            style={styles.skipLink}
          >
            <Text style={styles.skipLinkLabel}>Maybe Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderActivePage = () => {
    switch (currentPage) {
      case 0: return renderIndexPage();
      case 1: return renderMoodJourney();
      case 2: return renderEmotionalWeather();
      case 3: return renderPersonalityType();
      case 4: return renderRelationshipNeeds();
      case 5: return renderWeekInMoments();
      case 6: return renderMemoryJarPage();
      case 7: return renderBadgePage();
      case 8: return renderCoupleModeUnlock();
      default: return renderIndexPage();
    }
  };

  return (
    <ScreenWrapper>
      {/* Page Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        {currentPage > 0 ? (
          <View style={styles.topDayPill}>
            <Text style={styles.topDayPillLabel}>DAY 5 OF 5</Text>
          </View>
        ) : null}
        <View style={styles.headerSpacer} />
      </View>

      {/* Segment dots progress bar */}
      {renderProgressDots()}

      {/* Animated content body */}
      <Animated.View style={[styles.mainBody, {
        opacity: pageAnim,
        transform: [{
          translateX: pageAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [slideDirection === 'right' ? 30 : -30, 0],
          })
        }]
      }]}>
        {renderActivePage()}
      </Animated.View>

      {/* Magical Screen-wide Particles Overlay (mounts only on Memory Jar Page) */}
      {currentPage === 6 && <ScreenParticles />}
    </ScreenWrapper>
  );
};

interface ScreenParticle {
  id: number;
  left: number;
  size: number;
  color: string;
  opacity: Animated.Value;
  translateY: Animated.Value;
  translateX: Animated.Value;
  scale: Animated.Value;
}

const ScreenParticles: React.FC = () => {
  const colors = useAppColors();
  const [particles, setParticles] = useState<ScreenParticle[]>([]);
  const idRef = useRef(0);

  const particleColors = [
    colors.day1,
    colors.day2,
    colors.day3,
    colors.day4,
    colors.day5,
    colors.accent,
    '#FFFFFF',
    '#FFE082',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const id = idRef.current++;
      const opacity = new Animated.Value(0);
      const translateY = new Animated.Value(0);
      const translateX = new Animated.Value(0);
      const scaleVal = new Animated.Value(1);

      const particleSize = 4 + Math.random() * 8;
      const startLeft = Math.random() * responsiveWidth(100);
      const swayDist = (Math.random() - 0.5) * responsiveWidth(18);
      const duration = 4500 + Math.random() * 2500;

      const p: ScreenParticle = {
        id,
        left: startLeft,
        size: particleSize,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        opacity,
        translateY,
        translateX,
        scale: scaleVal,
      };

      setParticles((prev) => [...prev.slice(-20), p]);

      Animated.parallel([
        Animated.sequence([
          Animated.timing(opacity, { toValue: 0.65, duration: 800, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: duration - 800, useNativeDriver: true }),
        ]),
        Animated.timing(translateY, { toValue: -responsiveHeight(100), duration, useNativeDriver: true }),
        Animated.timing(translateX, { toValue: swayDist, duration, useNativeDriver: true }),
      ]).start(() => {
        setParticles((prev) => prev.filter((item) => item.id !== id));
      });
    }, 400);

    return () => clearInterval(interval);
  }, [colors]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p) => (
        <Animated.View
          key={p.id}
          style={{
            position: 'absolute',
            left: p.left,
            bottom: -30,
            width: p.size,
            height: p.size,
            borderRadius: p.size / 2,
            backgroundColor: p.color,
            opacity: p.opacity,
            transform: [
              { translateY: p.translateY },
              { translateX: p.translateX },
              { scale: p.scale },
            ],
          }}
        />
      ))}
    </View>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => {
  const isDark = c.isDark;
  const cardBg = isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.72)';
  const borderBg = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.55)';
  

  return StyleSheet.create({
    headerBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingTop: Platform.OS === 'ios' ? 8 : 12,
      height: 48,
      zIndex: 10,
    },
    backButton: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    topDayPill: {
      borderWidth: 1.2,
      borderColor: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.1)',
      borderRadius: 100,
      paddingHorizontal: 12,
      paddingVertical: 4,
      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.6)',
    },
    topDayPillLabel: {
      fontSize: 10,
      fontFamily: fonts.dmSansBold,
      color: c.textSecondary,
      letterSpacing: 1,
    },
    headerSpacer: {
      width: 38,
    },

    // Segment indicators
    indicatorRow: {
      flexDirection: 'row',
      paddingHorizontal: 28,
      paddingTop: 12,
      paddingBottom: 4,
      gap: 6,
    },
    indicatorSegment: {
      flex: 1,
      height: 4,
      borderRadius: 2,
      backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
    },

    mainBody: {
      flex: 1,
    },
    scroll: {
      flex: 1,
    },
    scrollContentContainer: {
      paddingBottom: 110,
    },
    slideContent: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 8,
    },

    // Page Header
    pageHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 18,
      gap: 12,
    },
    pageHeaderNumberCircle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.03)',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.05)',
    },
    pageHeaderNumberText: {
      fontSize: 20,
      fontFamily: 'PlayfairDisplay-Bold',
      color: c.primary,
    },
    pageHeaderTitleWrapper: {
      flex: 1,
    },
    pageHeaderTitle: {
      fontSize: 22,
      fontFamily: 'PlayfairDisplay-Bold',
      color: c.text,
      lineHeight: 28,
    },
    pageHeaderSubtitle: {
      fontSize: 13,
      fontFamily: 'Inter-Regular',
      color: c.textSecondary,
      marginTop: 2,
    },

    // Footer actions
    footerCTAWrapper: {
      paddingBottom: Platform.OS === 'ios' ? 34 : 24,
      paddingTop: 12,
    },
    footerNavigation: {
      paddingBottom: Platform.OS === 'ios' ? 34 : 24,
      paddingTop: 12,
      alignItems: 'center',
    },
    skipLink: {
      marginTop: 14,
      paddingVertical: 4,
    },
    skipLinkLabel: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: c.textSecondary,
      textDecorationLine: 'underline',
    },

    // Page 0: Index Page
    indexScrollContainer: {
      paddingBottom: 120,
    },
    ceremonialHeader: {
      alignItems: 'center',
      marginVertical: 20,
      paddingHorizontal: 8,
    },
    indexTitle: {
      fontSize: 32,
      fontFamily: 'PlayfairDisplay-Bold',
      color: c.text,
      textAlign: 'center',
      lineHeight: 40,
    },
    indexSubtitle: {
      fontSize: 15,
      fontFamily: 'Inter-Regular',
      color: c.textSecondary,
      textAlign: 'center',
      marginTop: 8,
      lineHeight: 22,
    },
    indexList: {
      gap: 12,
      marginTop: 8,
    },
    indexItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: cardBg,
      borderRadius: 20,
      borderCurve: 'continuous',
      padding: 16,
      borderWidth: 1.5,
      borderColor: borderBg,
    },
    indexItemNumberCircle: {
      width: 38,
      height: 38,
      borderRadius: 19,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      marginRight: 14,
    },
    indexItemNumberText: {
      fontSize: 15,
      fontFamily: fonts.dmSansBold,
    },
    indexItemContent: {
      flex: 1,
      justifyContent: 'center',
    },
    indexItemHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    indexItemTitle: {
      fontSize: 15,
      fontFamily: 'Inter-SemiBold',
      color: c.text,
    },
    newBadge: {
      backgroundColor: c.accent,
      borderRadius: 6,
      paddingHorizontal: 6,
      paddingVertical: 2,
    },
    newBadgeText: {
      fontSize: 8,
      fontFamily: fonts.dmSansBold,
      color: c.dark,
    },
    indexItemSubtitle: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: c.textSecondary,
      marginTop: 2,
    },

    // Page 1: Mood Journey
    chartSectionCard: {
      gap: 20,
      marginVertical: 8,
    },
    chartWrapper: {
      flexDirection: 'row',
      backgroundColor: cardBg,
      borderRadius: 24,
      borderCurve: 'continuous',
      borderWidth: 1.5,
      borderColor: borderBg,
      padding: 18,
      height: 220,
      alignItems: 'center',
    },
    yAxis: {
      height: '80%',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginRight: 12,
      paddingVertical: 6,
    },
    yAxisEmoji: {
      fontSize: 16,
    },
    chartBarsContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      height: '80%',
      paddingHorizontal: 4,
    },
    chartColumn: {
      alignItems: 'center',
      flex: 1,
    },
    barValueText: {
      fontSize: 10,
      fontFamily: fonts.dmSansBold,
      color: c.textSecondary,
      marginBottom: 6,
    },
    barTrack: {
      height: 110,
      width: 14,
      backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
      borderRadius: 8,
      overflow: 'hidden',
      justifyContent: 'flex-end',
    },
    barFillProgress: {
      width: '100%',
      borderRadius: 8,
    },
    barLabelText: {
      fontSize: 11,
      fontFamily: fonts.dmSansBold,
      color: c.textHint,
      marginTop: 8,
    },
    scorePillCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: isDark ? 'rgba(13, 148, 136, 0.04)' : 'rgba(13, 148, 136, 0.06)',
      borderRadius: 20,
      borderCurve: 'continuous',
      paddingHorizontal: 20,
      paddingVertical: 14,
      borderWidth: 1.2,
      borderColor: 'rgba(13, 148, 136, 0.20)',
    },
    scorePillLabel: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: c.text,
    },
    scorePillValueContainer: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },
    scorePillValue: {
      fontSize: 26,
      fontFamily: fonts.dmSansBold,
      color: c.primary,
    },
    scorePillMax: {
      fontSize: 14,
      fontFamily: fonts.dmSansMedium,
      color: c.textHint,
    },
    journeyInsightCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? 'rgba(45,212,191,0.02)' : 'rgba(45,212,191,0.06)',
      borderLeftWidth: 4,
      borderLeftColor: c.primary,
      borderRadius: 18,
      borderCurve: 'continuous',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(45,212,191,0.1)' : 'rgba(45,212,191,0.2)',
      padding: 16,
      gap: 12,
    },
    insightIconRing: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: 'rgba(45,212,191,0.08)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    journeyInsightText: {
      flex: 1,
      fontSize: 14,
      fontFamily: 'PlayfairDisplay-Italic',
      fontStyle: 'italic',
      color: c.textSecondary,
      lineHeight: 20,
    },

    // Page 2: Emotional Weather
    weatherCardLayout: {
      gap: 20,
      marginVertical: 8,
    },
    weatherGrid: {
      flexDirection: 'row',
      gap: 8,
    },
    weatherTile: {
      flex: 1,
      backgroundColor: cardBg,
      borderRadius: 20,
      borderCurve: 'continuous',
      padding: 14,
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: borderBg,
    },
    weatherTileIconCircle: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: 'rgba(255,255,255,0.06)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
    },
    weatherTileIcon: {
      fontSize: 20,
    },
    weatherTileLabel: {
      fontSize: 9,
      fontFamily: fonts.dmSansBold,
      color: c.textHint,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    weatherTileValue: {
      fontSize: 13,
      fontFamily: fonts.dmSansBold,
      color: c.textSecondary,
      marginTop: 4,
    },

    // Page 3: Personality Type
    personalitySectionWrapper: {
      gap: 16,
      marginVertical: 8,
    },
    personalityCardBox: {
      backgroundColor: cardBg,
      borderRadius: 24,
      borderCurve: 'continuous',
      borderWidth: 1.5,
      borderColor: borderBg,
      borderTopWidth: 5,
      padding: 20,
    },
    personalityHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 12,
    },
    personalityIconWrapper: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
    },
    personalityTextColumn: {
      flex: 1,
    },
    personalityTypeLabel: {
      fontSize: 10,
      fontFamily: 'Inter-SemiBold',
      color: c.textHint,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
    },
    personalityTypeName: {
      fontSize: 20,
      fontFamily: 'PlayfairDisplay-Bold',
      color: c.text,
      marginTop: 1,
    },
    personalityDesc: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: c.textSecondary,
      lineHeight: 20,
      marginBottom: 16,
    },
    strengthsDivider: {
      height: 1,
      backgroundColor: borderBg,
      marginVertical: 14,
    },
    strengthsLabel: {
      fontSize: 11,
      fontFamily: 'Inter-SemiBold',
      color: c.textHint,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
      marginBottom: 12,
    },
    strengthsGrid: {
      gap: 12,
    },
    strengthRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
    },
    strengthBulletIcon: {
      marginTop: 2,
    },
    strengthContent: {
      flex: 1,
    },
    strengthTitle: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: c.text,
    },
    strengthDesc: {
      fontSize: 12.5,
      fontFamily: 'Inter-Regular',
      color: c.textSecondary,
      marginTop: 2,
      lineHeight: 18,
    },
    growthInvitationCard: {
      backgroundColor: 'rgba(216,128,132,0.03)',
      borderWidth: 1.2,
      borderColor: 'rgba(216,128,132,0.15)',
      borderRadius: 18,
      padding: 16,
    },
    growthHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },
    growthLabelText: {
      fontSize: 11,
      fontFamily: fonts.dmSansBold,
      color: c.day1,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    growthBodyText: {
      fontSize: 13,
      fontFamily: 'Inter-Regular',
      color: c.textSecondary,
      lineHeight: 18,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 60,
      gap: 12,
    },
    emptyLabel: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: c.textHint,
      textAlign: 'center',
    },

    // Page 4: Relationship Needs
    needsPageLayout: {
      marginVertical: 8,
    },
    needsRankContainer: {
      gap: 12,
    },
    needRankItemCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: cardBg,
      borderRadius: 20,
      borderCurve: 'continuous',
      padding: 16,
      borderWidth: 1.5,
      borderColor: borderBg,
    },
    needRankBadge: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
    },
    needRankNumber: {
      fontSize: 14,
      fontFamily: fonts.dmSansBold,
    },
    needRankTextContainer: {
      flex: 1,
    },
    needRankItemTitle: {
      fontSize: 15,
      fontFamily: 'Inter-SemiBold',
      color: c.text,
    },
    needRankItemDesc: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: c.textSecondary,
      marginTop: 2,
      lineHeight: 16,
    },
    needsFooterText: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: c.textHint,
      textAlign: 'center',
      marginTop: 12,
      lineHeight: 18,
    },

    // Page 5: Timeline
    timelineContainer: {
      marginVertical: 8,
      paddingLeft: 4,
    },
    timelineItem: {
      flexDirection: 'row',
      paddingBottom: 24,
      position: 'relative',
    },
    timelineVerticalLine: {
      position: 'absolute',
      left: 60,
      top: 14,
      bottom: -14,
      width: 2,
      opacity: 0.35,
    },
    timelineDateCol: {
      width: 44,
      marginRight: 12,
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      paddingTop: 2,
    },
    timelineDayText: {
      fontSize: 13,
      fontFamily: fonts.dmSansBold,
      color: c.textHint,
    },
    timelineNode: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2.5,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2,
      marginRight: 14,
      marginTop: 1,
    },
    timelineContentCard: {
      flex: 1,
      backgroundColor: cardBg,
      borderRadius: 20,
      borderCurve: 'continuous',
      padding: 14,
      borderWidth: 1.5,
      borderColor: borderBg,
    },
    timelineItemHeader: {
      fontSize: 9,
      fontFamily: fonts.dmSansBold,
      letterSpacing: 0.5,
    },
    timelineItemVibe: {
      fontSize: 13,
      fontFamily: 'Inter-SemiBold',
      color: c.text,
      marginTop: 4,
    },
    timelineItemContent: {
      fontSize: 12,
      fontFamily: 'PlayfairDisplay-Italic',
      fontStyle: 'italic',
      color: c.textSecondary,
      marginTop: 4,
    },
    momentsFooterText: {
      fontSize: 13,
      fontFamily: 'Inter-Regular',
      color: c.textHint,
      textAlign: 'center',
      marginTop: 6,
    },

    // Page 6: Memory Jar
    jarMockCardWrapper: {
      alignItems: 'center',
      marginTop: responsiveHeight(5),
      marginBottom: responsiveHeight(4),
    },
    jarMockGlass: {
      width: responsiveWidth(58),
      height: responsiveWidth(68),
      borderRadius: 45,
      borderWidth: 3,
      borderColor: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.95)',
      alignItems: 'center',
      paddingVertical: 20,
      position: 'relative',
      overflow: 'hidden',
    },
    jarGlowEffect: {
      position: 'absolute',
      bottom: -35,
      width: responsiveWidth(58),
      height: responsiveWidth(38),
      borderRadius: 50,
      backgroundColor: 'rgba(216,128,132,0.15)',
      filter: 'blur(20px)',
    },
    jarMockTitle: {
      fontSize: 14,
      fontFamily: 'PlayfairDisplay-Bold',
      color: c.text,
    },
    jarMockFillPercent: {
      fontSize: 10,
      fontFamily: fonts.dmSansBold,
      color: c.primary,
      letterSpacing: 1,
      marginTop: 2,
    },
    jarMockNotesIllust: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 8,
      paddingHorizontal: 20,
      marginTop: 'auto',
      marginBottom: 10,
    },
    illustNote: {
      width: 32,
      height: 32,
      borderRadius: 8,
    },
    jarUnlockBanner: {
      marginTop: 24,
      backgroundColor: 'rgba(0,0,0,0.02)',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 100,
      borderWidth: 1,
      borderColor: borderBg,
    },
    jarUnlockText: {
      fontSize: 12,
      fontFamily: fonts.dmSansMedium,
      color: c.textSecondary,
      textAlign: 'center',
    },

    // Modal Style
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.72)',
      justifyContent: 'flex-end',
    },
    modalContainer: {
      backgroundColor: isDark ? c.darkMid : '#FFFFFF',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: Platform.OS === 'ios' ? 34 : 24,
      height: responsiveHeight(80),
      borderWidth: 1.5,
      borderColor: borderBg,
    },
    modalHeaderRow: {
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 22,
      fontFamily: 'PlayfairDisplay-Bold',
      color: c.text,
    },
    modalSubtitle: {
      fontSize: 13.5,
      fontFamily: 'Inter-Regular',
      color: c.textSecondary,
      marginTop: 2,
    },
    modalScrollView: {
      flex: 1,
    },
    modalNotesList: {
      gap: 12,
      paddingBottom: 24,
    },
    modalNoteCard: {
      borderWidth: 1.5,
      borderRadius: 20,
      padding: 16,
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.65)',
    },
    modalNoteHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 8,
    },
    modalNoteIconCircle: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalNoteTitle: {
      fontSize: 10,
      fontFamily: 'Inter-SemiBold',
      letterSpacing: 1,
    },
    modalNoteText: {
      fontSize: 14,
      fontFamily: 'PlayfairDisplay-Italic',
      fontStyle: 'italic',
      color: c.textSecondary,
      lineHeight: 20,
      paddingLeft: 2,
    },
    modalEmptyJar: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    modalEmptyText: {
      fontSize: 14,
      fontFamily: 'PlayfairDisplay-Italic',
      color: c.textHint,
    },
    modalFooter: {
      paddingTop: 12,
    },

    // Page 7: Badge
    badgeLayout: {
      gap: 16,
      marginVertical: 8,
      alignItems: 'center',
    },
    shieldEmblemCard: {
      alignItems: 'center',
      backgroundColor: cardBg,
      borderRadius: 24,
      borderCurve: 'continuous',
      borderWidth: 1.5,
      borderColor: borderBg,
      padding: 24,
      width: '100%',
    },
    badgeShieldHalo: {
      width: 84,
      height: 84,
      borderRadius: 42,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    badgeNameLabel: {
      fontSize: 22,
      fontFamily: 'PlayfairDisplay-Bold',
      color: c.text,
      textAlign: 'center',
    },
    badgeTierPillBadge: {
      borderWidth: 1.2,
      borderRadius: 100,
      paddingHorizontal: 12,
      paddingVertical: 4,
      marginTop: 6,
      marginBottom: 12,
    },
    badgeTierTextLabel: {
      fontSize: 10,
      fontFamily: fonts.dmSansBold,
      letterSpacing: 1.5,
    },
    badgeDescriptionText: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: c.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
    badgeTraitsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      justifyContent: 'center',
      width: '100%',
    },
    badgeTraitPillItem: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 100,
      backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
      borderWidth: 1,
      borderColor: borderBg,
    },
    badgeTraitPillText: {
      fontSize: 11,
      fontFamily: fonts.dmSansBold,
      color: c.textSecondary,
    },
    expandedSubScoresCard: {
      backgroundColor: cardBg,
      borderRadius: 22,
      borderCurve: 'continuous',
      borderWidth: 1.5,
      borderColor: borderBg,
      padding: 16,
      width: '100%',
      marginTop: 8,
    },
    expandedSubScoresTitle: {
      fontSize: 13,
      fontFamily: 'Inter-SemiBold',
      color: c.textHint,
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      marginBottom: 16,
    },
    subScoreItemRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    subScoreLabelCol: {
      flex: 1,
    },
    subScoreItemLabel: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: c.text,
    },
    subScoreItemDesc: {
      fontSize: 11,
      fontFamily: 'Inter-Regular',
      color: c.textSecondary,
      marginTop: 2,
    },
    subScoreItemValueText: {
      fontSize: 16,
      fontFamily: fonts.dmSansBold,
      color: c.text,
    },
    subScoreItemMax: {
      fontSize: 11,
      fontFamily: fonts.dmSansRegular,
      color: c.textHint,
    },
    progressBarTrack: {
      height: 6,
      backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
      borderRadius: 100,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      borderRadius: 100,
    },
    scoreRowSpacer: {
      height: 16,
    },

    // Page 8: Couple Games
    unlockPageWrapper: {
      gap: 16,
      marginVertical: 8,
    },
    unlockDescription: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: c.textSecondary,
      lineHeight: 20,
    },
    gamesListStack: {
      gap: 10,
    },
    gameCardItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: cardBg,
      borderRadius: 20,
      borderCurve: 'continuous',
      padding: 16,
      borderWidth: 1.5,
      borderColor: borderBg,
      gap: 14,
    },
    gameIconCircleBadge: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
    },
    gameInfoCol: {
      flex: 1,
    },
    gameTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    gameCardTitle: {
      fontSize: 15,
      fontFamily: 'Inter-SemiBold',
      color: c.text,
    },
    unlockLabelPill: {
      backgroundColor: 'rgba(45,212,191,0.08)',
      borderColor: 'rgba(45,212,191,0.25)',
      borderWidth: 1,
      borderRadius: 6,
      paddingHorizontal: 6,
      paddingVertical: 2,
    },
    unlockLabelText: {
      fontSize: 8,
      fontFamily: fonts.dmSansBold,
      color: c.primary,
    },
    gameCardSubtitle: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: c.textSecondary,
      marginTop: 2,
      lineHeight: 16,
    },
    unlockFooterAnnotation: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: c.textHint,
      textAlign: 'center',
      marginTop: 8,
    },
  });
};
