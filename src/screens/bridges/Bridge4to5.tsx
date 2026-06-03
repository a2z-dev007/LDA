import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {
  Archive,
  CheckCircle2,
  Flame,
  Gift,
  Heart,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Target,
  Quote,
} from 'lucide-react-native';
import { RootStackParamList } from '../../navigation/types';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { GradientButton } from '../../components/common/GradientButton';
import { useAppColors } from '../../theme';
import { bridgeQuotes } from '../../data/quizData';
import { useDayStore } from '../../store/useDayStore';
import { useStreakStore } from '../../store/useStreakStore';
import { useUserStore } from '../../store/useUserStore';
import { haptics } from '../../utils/haptics';
import { metrics } from '../../theme/metrics';
import { fonts, typography } from '../../theme/typography';

type Nav = StackNavigationProp<RootStackParamList, 'Bridge4to5'>;

const memoryLabels = {
  text: 'Text memory',
  photo: 'Photo memory',
  emoji: 'Emoji memory',
  skipped: 'Memory pending',
};

export const Bridge4to5: React.FC = () => {
  const colors = useAppColors();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  const day4 = useDayStore((s) => s.day4);
  const streakCount = useStreakStore((s) => s.streakCount);
  const name = useUserStore((s) => s.name) || 'there';

  const displayStreak = Math.max(streakCount, 5);
  const memoryLabel = memoryLabels[day4.memoryType];
  const topNeed = day4.d4_top_need || day4.d4_priority_picks[0] || 'Clarity';
  const hasDailyTwo = day4.daily2Status !== 'skipped';
  const dailyTwoSummary = day4.daily2Status === 'both'
    ? 'Both reflections shared'
    : day4.daily2Status === 'one'
      ? 'One reflection shared'
      : 'Reflection saved for later';

  const recapPills = React.useMemo(() => [
    {
      label: memoryLabel,
      Icon: Archive,
      tint: colors.day4,
      bg: `${colors.day4}14`,
      border: `${colors.day4}24`,
    },
    {
      label: `Top need · ${topNeed}`,
      Icon: Target,
      tint: colors.primary,
      bg: 'rgba(13,148,136,0.08)',
      border: 'rgba(13,148,136,0.18)',
    },
    day4.tinyComplimentWord
      ? {
          label: day4.tinyComplimentWord,
          Icon: Heart,
          tint: '#BE185D',
          bg: 'rgba(244,114,182,0.1)',
          border: 'rgba(244,114,182,0.22)',
        }
      : {
          label: day4.intentionWord || 'Intention held',
          Icon: Sparkles,
          tint: '#78350F',
          bg: '#FEF3C7',
          border: '#FDE68A',
        },
  ], [colors.day4, colors.primary, day4.intentionWord, day4.tinyComplimentWord, memoryLabel, topNeed]);

  const handleContinue = React.useCallback(() => {
    haptics.success();
    navigation.navigate('Day5Celebration');
  }, [navigation]);

  return (
    <ScreenWrapper>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.eyebrowPill}>
          <Text style={styles.eyebrowText}>Day 4 → Day 5 Bridge</Text>
        </View>

        {/* Streak Card */}
        <View style={styles.card}>
          <Text style={styles.cardZoneTitle}>ZONE 1 · STREAK</Text>
          <View style={styles.streakRow}>
            <View style={styles.streakRingContainer}>
              <View style={styles.streakRing}>
                <Text style={styles.streakNumber}>{displayStreak}</Text>
              </View>
              <View style={styles.streakFlameBadge}>
                <Flame size={12} color="#F97316" fill="#FED7AA" />
              </View>
            </View>
            <View style={styles.streakInfo}>
              <Text style={styles.welcomeText}>Welcome back, {name}</Text>
              <Text style={styles.streakSubtext}>
                {displayStreak}-day streak · Final day is ready
              </Text>
            </View>
          </View>
        </View>

        {/* Recap Card */}
        <View style={styles.card}>
          <Text style={styles.cardZoneTitle}>ZONE 2 · DAY 4 RECAP</Text>

          <View style={styles.pillsRow}>
            {recapPills.map(({ label, Icon, tint, bg, border }) => (
              <View key={label} style={[styles.recapPill, { backgroundColor: bg, borderColor: border }]}>
                <Icon size={14} color={tint} style={styles.pillIcon} />
                <Text style={[styles.recapPillText, { color: tint }]} numberOfLines={1}>
                  {label}
                </Text>
              </View>
            ))}
          </View>

          {/* Glowing Memory Box */}
          <LinearGradient
            colors={[`${colors.day4}18`, 'rgba(255, 255, 255, 0.02)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.memoryBox}
          >
            <View style={styles.boxHeaderRow}>
              <Archive size={14} color={colors.day4} />
              <Text style={[styles.boxLabel, { color: colors.day4 }]}>MEMORY JAR</Text>
            </View>
            <Text style={styles.memoryText} numberOfLines={3}>
              "{day4.memoryContent || 'A beautiful memory of us.'}"
            </Text>
          </LinearGradient>

          {/* Mini Cards */}
          <View style={styles.twoColumnRow}>
            <View style={styles.miniCard}>
              <View style={styles.miniIcon}>
                <Target size={16} color={colors.primary} />
              </View>
              <View style={styles.miniCardTextContainer}>
                <Text style={styles.miniLabel}>PRIORITY SHUFFLE</Text>
                <Text style={styles.miniValue} numberOfLines={2}>
                  {day4.d4_priority_picks.length
                    ? day4.d4_priority_picks.join(' · ')
                    : topNeed}
                </Text>
              </View>
            </View>

            <View style={styles.miniCard}>
              <View style={styles.miniIconPurple}>
                <MessageCircle size={16} color="#C084FC" />
              </View>
              <View style={styles.miniCardTextContainer}>
                <Text style={styles.miniLabel}>DAILY TWO</Text>
                <Text style={styles.miniValue} numberOfLines={2}>
                  {dailyTwoSummary}
                </Text>
              </View>
            </View>
          </View>

          {/* Status Indicators */}
          <View style={styles.statusRow}>
            <View style={[styles.statusChip, day4.dropBoxUsed ? styles.statusChipActive : null]}>
              <ShieldCheck size={13} color={day4.dropBoxUsed ? '#2DD4BF' : colors.textHint} />
              <Text style={[styles.statusText, day4.dropBoxUsed ? styles.statusTextActive : null]}>
                Drop Box {day4.dropBoxUsed ? 'used' : 'open'}
              </Text>
            </View>

            <View style={[styles.statusChip, day4.loveDropUsed ? styles.statusChipActive : null]}>
              <Gift size={13} color={day4.loveDropUsed ? '#2DD4BF' : colors.textHint} />
              <Text style={[styles.statusText, day4.loveDropUsed ? styles.statusTextActive : null]}>
                Love Drop {day4.loveDropUsed ? 'sent' : 'ready'}
              </Text>
            </View>

            <View style={[styles.statusChip, hasDailyTwo ? styles.statusChipActive : null]}>
              <CheckCircle2 size={13} color={hasDailyTwo ? '#2DD4BF' : colors.textHint} />
              <Text style={[styles.statusText, hasDailyTwo ? styles.statusTextActive : null]}>
                {hasDailyTwo ? 'Reflected' : 'Optional'}
              </Text>
            </View>
          </View>
        </View>

        {/* Teaser Card */}
        <LinearGradient
          colors={['rgba(249, 185, 92, 0.12)', 'rgba(255, 255, 255, 0.02)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.teaserCard}
        >
          <Text style={styles.teaserText}>
            Day 5 turns everything you saved into your reveal, report card, letter, and promise.
          </Text>
        </LinearGradient>

        <View style={styles.dotsRow}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
        </View>

        {/* Bridge Quote */}
        <View style={styles.quoteZone}>
          <Text style={styles.cardZoneTitle}>ZONE 3 · BRIDGE QUOTE</Text>
          <View style={styles.quoteCard}>
            <View style={styles.quoteIconWrapper}>
              <Quote size={26} color={colors.primary} strokeWidth={1.2} />
            </View>
            <Text style={styles.quoteText}>"{bridgeQuotes.bridge_4to5}"</Text>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Dynamic theme-adapted bottom CTA bar */}
      <View style={[styles.ctaWrapper, { paddingBottom: Math.max(insets.bottom + 8, metrics.spacing.md) }]}>
        <GradientButton
          text="Continue to Day 5"
          onPress={handleContinue}
          showArrow={true}
          fullWidth={true}
          gradientColors={colors.gradientBtn}
        />
      </View>
    </ScreenWrapper>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => {
  const cardBg = c.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.75)';
  const cardBorder = c.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(45, 95, 93, 0.12)';
  const miniCardBg = c.isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.65)';
  const statusChipBg = c.isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.6)';
  const quoteCardBg = c.isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.65)';
  const ctaBg = c.isDark ? `${c.dark}d8` : 'rgba(255, 255, 255, 0.85)';
  const ctaBorder = c.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)';

  return StyleSheet.create({
    scroll: {
      flex: 1,
    },
    content: {
      paddingHorizontal: metrics.layout.screenPaddingHz,
      paddingBottom: responsiveHeight(15),
      gap: 20, // Clean vertical gap instead of individual margins
    },
    eyebrowPill: {
      alignSelf: 'flex-start',
      backgroundColor: c.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.7)',
      borderRadius: 100,
      borderCurve: 'continuous',
      borderWidth: 1,
      borderColor: c.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0, 0, 0, 0.04)',
      paddingHorizontal: 12,
      paddingVertical: 4,
      marginTop: 8,
    },
    eyebrowText: {
      fontSize: 11,
      fontFamily: fonts.dmSansBold,
      color: c.textSecondary,
      letterSpacing: 0.5,
    },
    card: {
      backgroundColor: cardBg,
      borderRadius: 24,
      borderCurve: 'continuous',
      borderWidth: 1.5,
      borderColor: cardBorder,
      padding: 20,
      gap: 16,
      boxShadow: c.isDark ? '0 8px 32px rgba(0, 0, 0, 0.15)' : '0 8px 24px rgba(26, 54, 53, 0.06)',
    },
    cardZoneTitle: {
      fontSize: 10,
      fontFamily: fonts.dmSansBold,
      color: c.textHint,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
    },
    streakRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    streakRingContainer: {
      position: 'relative',
      width: 64,
      height: 64,
    },
    streakRing: {
      width: 64,
      height: 64,
      borderRadius: 32,
      borderCurve: 'continuous',
      borderWidth: 3,
      borderColor: '#0D9488',
      backgroundColor: 'rgba(13, 148, 136, 0.05)',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 0 15px rgba(13, 148, 136, 0.15)',
    },
    streakNumber: {
      fontSize: 24,
      fontFamily: fonts.dmSansBold,
      color: c.text,
    },
    streakFlameBadge: {
      position: 'absolute',
      top: -4,
      right: -4,
      width: 22,
      height: 22,
      borderRadius: 11,
      borderCurve: 'continuous',
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: '#E2E8F0',
    },
    streakInfo: {
      flex: 1,
      justifyContent: 'center',
    },
    welcomeText: {
      fontFamily: 'PlayfairDisplay-Bold',
      fontSize: 20,
      color: c.text,
    },
    streakSubtext: {
      fontSize: 13,
      fontFamily: 'Inter-Regular',
      color: c.textSecondary,
      marginTop: 2,
    },
    pillsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      width: '100%',
    },
    recapPill: {
      maxWidth: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 100,
      borderCurve: 'continuous',
      paddingHorizontal: 12,
      paddingVertical: 5,
    },
    pillIcon: {
      marginRight: 6,
    },
    recapPillText: {
      fontSize: 11,
      maxWidth: responsiveWidth(72),
      fontFamily: fonts.dmSansBold,
    },
    memoryBox: {
      borderWidth: 1.5,
      borderColor: c.isDark ? `${c.day4}30` : `${c.day4}40`,
      borderRadius: 16,
      borderCurve: 'continuous',
      padding: 16,
      width: '100%',
      gap: 8,
      boxShadow: c.isDark ? `0 4px 12px ${c.day4}10` : `0 4px 12px ${c.day4}15`,
    },
    boxHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    boxLabel: {
      letterSpacing: 1.2,
      fontSize: 9,
      fontFamily: fonts.dmSansBold,
    },
    memoryText: {
      fontSize: 15,
      color: c.text,
      fontFamily: 'PlayfairDisplay-Italic',
      lineHeight: 22,
    },
    twoColumnRow: {
      flexDirection: 'row',
      gap: 12,
    },
    miniCard: {
      flex: 1,
      minHeight: 110,
      backgroundColor: miniCardBg,
      borderWidth: 1.5,
      borderColor: c.isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.9)',
      borderRadius: 16,
      borderCurve: 'continuous',
      padding: 14,
      gap: 8,
      justifyContent: 'space-between',
      boxShadow: c.isDark ? '0 4px 12px rgba(0, 0, 0, 0.04)' : '0 4px 12px rgba(26, 54, 53, 0.03)',
    },
    miniCardTextContainer: {
      gap: 2,
    },
    miniIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      borderCurve: 'continuous',
      backgroundColor: 'rgba(13,148,136,0.1)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    miniIconPurple: {
      width: 32,
      height: 32,
      borderRadius: 16,
      borderCurve: 'continuous',
      backgroundColor: 'rgba(192, 132, 252, 0.1)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    miniLabel: {
      color: c.textHint,
      letterSpacing: 1.1,
      fontSize: 9,
      fontFamily: fonts.dmSansBold,
    },
    miniValue: {
      fontSize: 12,
      color: c.text,
      fontFamily: fonts.dmSansBold,
      lineHeight: 16,
    },
    statusRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    statusChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: statusChipBg,
      borderWidth: 1.5,
      borderColor: c.isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.9)',
      borderRadius: 100,
      borderCurve: 'continuous',
      paddingHorizontal: 12,
      paddingVertical: 6,
      boxShadow: c.isDark ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.02)',
    },
    statusChipActive: {
      backgroundColor: c.isDark ? 'rgba(13, 148, 136, 0.10)' : '#E6FBF7',
      borderColor: c.isDark ? 'rgba(13, 148, 136, 0.25)' : '#CCFBF1',
    },
    statusText: {
      fontSize: 11,
      color: c.textHint,
      fontFamily: fonts.dmSansBold,
      letterSpacing: 0.5,
    },
    statusTextActive: {
      color: c.isDark ? '#2DD4BF' : '#0D9488',
    },
    teaserCard: {
      borderWidth: 1.5,
      borderColor: c.isDark ? 'rgba(249, 185, 92, 0.25)' : 'rgba(212, 112, 16, 0.2)',
      borderStyle: 'dashed',
      borderRadius: 18,
      borderCurve: 'continuous',
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: c.isDark ? '0 4px 15px rgba(249, 185, 92, 0.03)' : '0 4px 12px rgba(212, 112, 16, 0.02)',
    },
    teaserText: {
      fontSize: 14,
      color: c.isDark ? '#F9B95C' : '#B07010',
      fontFamily: 'PlayfairDisplay-Italic',
      lineHeight: 20,
      textAlign: 'center',
    },
    dotsRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 6,
      marginVertical: 12,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: c.isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)',
    },
    dotActive: {
      width: 20,
      borderRadius: 3,
      backgroundColor: c.primary,
      boxShadow: `0 0 8px ${c.primary}50`,
    },
    quoteZone: {
      gap: 8,
      width: '100%',
    },
    quoteCard: {
      backgroundColor: quoteCardBg,
      borderWidth: 1.5,
      borderColor: c.isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.9)',
      padding: 20,
      borderRadius: 20,
      borderCurve: 'continuous',
      width: '100%',
      alignItems: 'center',
      gap: 12,
      boxShadow: c.isDark ? '0 4px 15px rgba(0, 0, 0, 0.08)' : '0 4px 12px rgba(26, 54, 53, 0.03)',
    },
    quoteIconWrapper: {
      opacity: 0.4,
    },
    quoteText: {
      fontSize: 16,
      color: c.textSecondary,
      fontFamily: 'PlayfairDisplay-Italic',
      lineHeight: 24,
      textAlign: 'center',
    },
    bottomSpacer: {
      height: 24,
    },
    ctaWrapper: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: metrics.layout.screenPaddingHz,
      paddingTop: metrics.spacing.md,
      backgroundColor: ctaBg,
      borderTopWidth: 1,
      borderTopColor: ctaBorder,
    },
  });
};
