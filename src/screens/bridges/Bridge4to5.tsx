import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import {
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import {
  CheckCircle2,
  Flame,
  Gift,
  Heart,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Target,
  Menu,
  Smile,
  ChevronRight,
} from 'lucide-react-native';
import { RootStackParamList } from '../../navigation/types';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { GradientButton } from '../../components/common/GradientButton';
import { useAppColors } from '../../theme';
import { useDayStore } from '../../store/useDayStore';
import { useStreakStore } from '../../store/useStreakStore';
import { useUserStore } from '../../store/useUserStore';
import { haptics } from '../../utils/haptics';
import { metrics } from '../../theme/metrics';
import { fonts, typography } from '../../theme/typography';
import { CommonJar } from '../../components/common/CommonJar';
import { bridgeQuotes } from '../../data/quizData';

type Nav = StackNavigationProp<RootStackParamList, 'Bridge4to5'>;

const memoryLabels = {
  text: 'Text memory',
  photo: 'Photo memory',
  emoji: 'Emoji memory',
  skipped: 'Memory pending',
};

// Custom Bridge Icon SVG
const BridgeIcon: React.FC<{ color?: string; size?: number }> = ({ color = '#0D9488', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 17h18" />
    <Path d="M6 10v7" />
    <Path d="M18 10v7" />
    <Path d="M6 10c3 3 9 3 12 0" />
    <Path d="M10 12v5" />
    <Path d="M14 12v5" />
  </Svg>
);

// Custom Jar Icon SVG
const JarIcon: React.FC<{ color?: string; size?: number }> = ({ color = '#3B82F6', size = 14 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M6 9a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V9z" />
    <Path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <Path d="M9 12h6" />
    <Path d="M9 16h6" />
  </Svg>
);

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
      Icon: day4.memoryType === 'emoji' ? Smile : Smile,
      tint: '#3B82F6',
      bg: '#EFF6FF',
      border: '#DBEAFE',
    },
    {
      label: `Top need · ${topNeed}`,
      Icon: Target,
      tint: '#0D9488',
      bg: '#E6FBF7',
      border: '#CCFBF1',
    },
    day4.tinyComplimentWord
      ? {
          label: day4.tinyComplimentWord,
          Icon: Heart,
          tint: '#EC4899',
          bg: '#FFF1F2',
          border: '#FFE4E6',
        }
      : {
          label: day4.intentionWord || 'Intention held',
          Icon: Sparkles,
          tint: '#B45309',
          bg: '#FEF3C7',
          border: '#FDE68A',
        },
  ], [day4.intentionWord, day4.tinyComplimentWord, day4.memoryType, memoryLabel, topNeed]);

  const dateInfo = React.useMemo(() => {
    const timestamp = day4.completionTimestamp || new Date().toISOString();
    const d = new Date(timestamp);
    const monthsShort = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const monthsLong = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return {
      day: d.getDate().toString(),
      monthShort: monthsShort[d.getMonth()],
      monthLong: monthsLong[d.getMonth()],
      year: d.getFullYear().toString(),
    };
  }, [day4.completionTimestamp]);

  const handleContinue = React.useCallback(() => {
    haptics.success();
    navigation.navigate('Day5ThePromise');
  }, [navigation]);

  return (
    <ScreenWrapper >
      {/* Visual background gradient to match screenshot perfectly */}
      {/* <LinearGradient
        colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      /> */}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Custom Header with Pill & Hamburger */}
        <View style={styles.headerRow}>
          {/* <View style={styles.headerPill}>
            <BridgeIcon color="#0D9488" size={16} />
            <Text style={styles.headerPillText}>Day 4 → Day 5 Bridge</Text>
          </View> */}
                  <View style={styles.eyebrowPill}>
                    <Text style={styles.eyebrowText}>Day 3 → Day 4 Bridge</Text>
                  </View>
          {/* <View style={styles.menuButton}>
            <Menu size={18} color="#6B7280" />
          </View> */}
        </View>

        {/* Streak Card */}
        <View style={styles.card}>
          <Text style={styles.cardZoneTitle}>ZONE 1 · STREAK</Text>
          <View style={styles.streakRow}>
            <View style={styles.streakRingContainer}>
              <View style={styles.streakRing}>
                <Text style={styles.streakNumber}>{displayStreak}</Text>
                <Text style={styles.streakLabel}>DAYS</Text>
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

              {/* Custom 5-Day Progress Bar */}
              <View style={styles.streakProgressRow}>
                <View style={styles.streakProgressSegment} />
                <View style={styles.streakProgressSegment} />
                <View style={styles.streakProgressSegment} />
                <View style={styles.streakProgressSegment} />
                <View style={styles.streakProgressCheck}>
                  <Text style={styles.checkIcon}>✓</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Recap Card */}
        <View style={styles.card}>
          <Text style={styles.cardZoneTitle}>ZONE 2 · DAY 4 RECAP</Text>

          {/* Pills Row */}
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

          {/* Memory Jar Box */}
          <View style={styles.memoryBox}>
            <View style={styles.boxHeaderRow}>
              <JarIcon color="#3B82F6" size={14} />
              <Text style={styles.boxLabel}>MEMORY JAR (80% FILLED)</Text>
            </View>
            
            <View style={styles.memoryBodyRow}>
              {/* Calendar Icon & Memory Text */}
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={styles.calendarContainer}>
                  <View style={styles.calendarHeader}>
                    <Text style={styles.calendarMonthText}>{dateInfo.monthShort}</Text>
                  </View>
                  <View style={styles.calendarBody}>
                    <Text style={styles.calendarDayText}>{dateInfo.day}</Text>
                  </View>
                </View>
                <Text style={styles.memoryMainText} numberOfLines={3}>
                  <Text style={styles.memoryItalicText}>
                    "{day4.memoryContent ? day4.memoryContent.slice(0, 60) + (day4.memoryContent.length > 60 ? '...' : '') : 'A beautiful memory of us.'}"
                  </Text>
                </Text>
              </View>

              {/* Jar preview at 80% */}
              <View style={styles.jarPreviewContainer}>
                <CommonJar scale={0.55} count={4} primaryColor={colors.day4} />
                {day4.tinyComplimentWord && (
                  <View style={styles.jarGlowTextContainer}>
                    <Text style={styles.jarGlowText}>{day4.tinyComplimentWord.toUpperCase()}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Mini Cards (2 Column Grid) */}
          <View style={styles.twoColumnRow}>
            {/* Priority Shuffle Card */}
            <View style={styles.miniCard}>
              <View style={styles.miniCardTop}>
                <View style={styles.miniIconCircle}>
                  <Target size={16} color="#0D9488" />
                </View>
              </View>
              
              <View style={styles.miniCardBottomRow}>
                <View style={styles.miniCardTextContainer}>
                  <Text style={styles.miniLabel}>PRIORITY SHUFFLE</Text>
                  <Text style={styles.miniValue} numberOfLines={1}>
                    {day4.d4_priority_picks.length
                      ? day4.d4_priority_picks[0]
                      : topNeed}
                  </Text>
                  <Text style={styles.miniSubtext} numberOfLines={1}>
                    Day 5 shows if they felt the same.
                  </Text>
                </View>
                <ChevronRight size={14} color="#0D9488" style={styles.miniChevron} />
              </View>
            </View>

            {/* Daily Two Card */}
            <View style={styles.miniCard}>
              <View style={styles.miniCardTop}>
                <View style={[styles.miniIconCircle, styles.purpleCircle]}>
                  <MessageCircle size={16} color="#A855F7" />
                </View>
              </View>
              
              <View style={styles.miniCardBottomRow}>
                <View style={styles.miniCardTextContainer}>
                  <Text style={styles.miniLabel}>DAILY TWO</Text>
                  <Text style={styles.miniValue} numberOfLines={2}>
                    {dailyTwoSummary}
                  </Text>
                </View>
                <ChevronRight size={14} color="#A855F7" style={styles.miniChevron} />
              </View>
            </View>
          </View>

          {/* Status Indicators */}
          <View style={styles.statusRow}>
            {/* Drop Box Badge */}
            <View style={[styles.statusChip, day4.dropBoxUsed ? styles.statusChipActive : null]}>
              <ShieldCheck size={13} color={day4.dropBoxUsed ? '#0D9488' : '#64748B'} />
              <Text style={[styles.statusText, day4.dropBoxUsed ? styles.statusTextActive : null]}>
                Drop Box {day4.dropBoxUsed ? 'used' : 'open'}
              </Text>
            </View>

            {/* Love Drop Badge */}
            <View style={[styles.statusChip, day4.loveDropUsed ? styles.statusChipActive : null]}>
              <Gift size={13} color={day4.loveDropUsed ? '#0D9488' : '#64748B'} />
              <Text style={[styles.statusText, day4.loveDropUsed ? styles.statusTextActive : null]}>
                Love Drop {day4.loveDropUsed ? 'sent' : 'ready'}
              </Text>
            </View>

            {/* Reflection Badge */}
            <View style={[styles.statusChip, hasDailyTwo ? styles.statusChipActive : null]}>
              <CheckCircle2 size={13} color={hasDailyTwo ? '#0D9488' : '#64748B'} />
              <Text style={[styles.statusText, hasDailyTwo ? styles.statusTextActive : null]}>
                {hasDailyTwo ? 'Reflected' : 'Optional'}
              </Text>
            </View>
          </View>
        </View>

        {/* Teaser Card (Sparkles Box) */}
        <View style={styles.teaserCard}>
          <View style={styles.teaserContent}>
            <Sparkles size={20} color="#0D9488" style={styles.teaserSparkle} />
            <Text style={styles.teaserText}>
              Day 5 turns everything you saved{'\n'}into your reveal, report card, letter, and promise.
            </Text>
          </View>
        </View>

        {/* Progress Dots */}
        <View style={styles.dotsRow}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
        </View>

        {/* Zone 3: Bridge Quote & Significance Line */}
        <View style={styles.quoteZone}>
          <Text style={styles.cardZoneTitle}>ZONE 3 · BRIDGE QUOTE</Text>
          <View style={styles.quoteCard}>
            <Text style={styles.quoteText}>
              "{bridgeQuotes.bridge_4to5}"
            </Text>
            <View style={styles.quoteDivider} />
            <Text style={styles.significanceText}>
              "Day 5 is the one that matters. Everything you built this week becomes visible today."
            </Text>
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
  const cardBg = c.isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF';
  const cardBorder = c.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.03)';
  const ctaBg = c.isDark ? `${c.dark}d8` : 'rgba(255, 255, 255, 0.85)';
  const ctaBorder = c.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)';

  return StyleSheet.create({
    scroll: {
      flex: 1,
    },
    content: {
      paddingHorizontal: metrics.layout.screenPaddingHz,
      paddingBottom: responsiveHeight(15),
      gap: 20,
    },
     eyebrowPill: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: metrics.radius.full,
        borderWidth: 1,
        borderColor: 'rgba(45,95,93,0.18)',
        paddingHorizontal: metrics.spacing.smMd,
        paddingVertical: metrics.spacing.xs,
        marginTop: metrics.spacing.xs,
      },
      eyebrowText: {
        ...typography.captionSmall,
        color: c.text,
        letterSpacing: 0.3,
      },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
      marginBottom: 4,
    },
    headerPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: '#FFFFFF',
      borderRadius: 100,
      borderWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0.05)',
      paddingHorizontal: 16,
      paddingVertical: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.03,
      shadowRadius: 6,
      elevation: 1,
    },
    headerPillText: {
      fontSize: 12,
      fontFamily: fonts.dmSansBold,
      color: '#334155',
      letterSpacing: 0.2,
    },
    menuButton: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0.05)',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.03,
      shadowRadius: 6,
      elevation: 1,
    },
    card: {
      backgroundColor: cardBg,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: cardBorder,
      padding: 20,
      gap: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.03,
      shadowRadius: 12,
      elevation: 2,
    },
    cardZoneTitle: {
      fontSize: 10,
      fontFamily: fonts.dmSansBold,
      color: '#94A3B8',
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
      width: 72,
      height: 72,
    },
    streakRing: {
      width: 72,
      height: 72,
      borderRadius: 36,
      borderWidth: 3,
      borderColor: '#0D9488',
      backgroundColor: 'rgba(13, 148, 136, 0.03)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    streakNumber: {
      fontSize: 26,
      fontFamily: fonts.dmSansBold,
      color: '#1E293B',
      lineHeight: 28,
    },
    streakLabel: {
      fontSize: 9,
      fontFamily: fonts.dmSansBold,
      color: '#64748B',
      letterSpacing: 0.5,
      marginTop: -2,
    },
    streakFlameBadge: {
      position: 'absolute',
      top: -2,
      right: -2,
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0.05)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    streakInfo: {
      flex: 1,
      justifyContent: 'center',
    },
    welcomeText: {
      fontFamily: fonts.dmSansBold,
      fontSize: 20,
      color: '#1E293B',
    },
    streakSubtext: {
      fontSize: 13,
      fontFamily: fonts.dmSansRegular,
      color: '#64748B',
      marginTop: 2,
    },
    streakProgressRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 10,
    },
    streakProgressSegment: {
      width: 24,
      height: 6,
      borderRadius: 3,
      backgroundColor: '#0D9488',
    },
    streakProgressCheck: {
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: '#0D9488',
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkIcon: {
      color: '#FFFFFF',
      fontSize: 10,
      fontFamily: fonts.dmSansBold,
      lineHeight: 12,
    },
    pillsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      width: '100%',
    },
    recapPill: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 100,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    recapPillText: {
      fontSize: 11,
      fontFamily: fonts.dmSansBold,
    },
    pillIcon: {
      marginRight: 6,
    },
    memoryBox: {
      backgroundColor: '#F0F7FF',
      borderWidth: 1,
      borderColor: 'rgba(59, 130, 246, 0.15)',
      borderRadius: 16,
      padding: 14,
      width: '100%',
      gap: 10,
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
      color: '#3B82F6',
    },
    memoryBodyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    calendarContainer: {
      width: 32,
      height: 36,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: '#E2E8F0',
      overflow: 'hidden',
      backgroundColor: '#FFFFFF',
    },
    calendarHeader: {
      height: 11,
      backgroundColor: '#EF4444',
      alignItems: 'center',
      justifyContent: 'center',
    },
    calendarMonthText: {
      color: '#FFFFFF',
      fontSize: 7,
      fontFamily: fonts.dmSansBold,
      lineHeight: 9,
    },
    calendarBody: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    calendarDayText: {
      color: '#1E293B',
      fontSize: 14,
      fontFamily: fonts.dmSansBold,
      lineHeight: 16,
    },
    memoryMainText: {
      flex: 1,
      fontSize: 14,
      fontFamily: fonts.dmSansMedium,
      color: '#334155',
      lineHeight: 18,
    },
    memoryDivider: {
      color: '#CBD5E1',
      marginHorizontal: 4,
    },
    memoryItalicText: {
      fontFamily: fonts.playfairItalic,
      fontStyle: 'italic',
      color: '#1E293B',
    },
    twoColumnRow: {
      flexDirection: 'row',
      gap: 12,
    },
    miniCard: {
      flex: 1,
      minHeight: 110,
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0.03)',
      borderRadius: 16,
      padding: 14,
      justifyContent: 'space-between',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.02,
      shadowRadius: 6,
      elevation: 1,
    },
    miniCardTop: {
      alignSelf: 'flex-start',
    },
    miniIconCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#E6FBF7',
      alignItems: 'center',
      justifyContent: 'center',
    },
    purpleCircle: {
      backgroundColor: '#F3E8FF',
    },
    miniCardBottomRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 4,
    },
    miniCardTextContainer: {
      flex: 1,
      gap: 2,
    },
    miniLabel: {
      color: '#94A3B8',
      letterSpacing: 1.1,
      fontSize: 9,
      fontFamily: fonts.dmSansBold,
    },
    miniValue: {
      fontSize: 13,
      color: '#1E293B',
      fontFamily: fonts.dmSansBold,
      lineHeight: 16,
    },
    miniSubtext: {
      fontSize: 10,
      color: '#64748B',
      fontFamily: fonts.dmSansRegular,
      lineHeight: 12,
    },
    miniChevron: {
      marginBottom: 2,
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
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0.04)',
      borderRadius: 100,
      paddingHorizontal: 12,
      paddingVertical: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.01,
      shadowRadius: 2,
      elevation: 1,
    },
    statusChipActive: {
      backgroundColor: '#E6FBF7',
      borderColor: '#CCFBF1',
    },
    statusText: {
      fontSize: 11,
      color: '#64748B',
      fontFamily: fonts.dmSansMedium,
    },
    statusTextActive: {
      color: '#0D9488',
      fontFamily: fonts.dmSansBold,
    },
    teaserCard: {
      backgroundColor: '#FFFDF9',
      borderWidth: 1.5,
      borderColor: '#E2B670',
      borderStyle: 'dashed',
      borderRadius: 18,
      padding: 16,
      marginHorizontal: 2,
    },
    teaserContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    teaserSparkle: {
      alignSelf: 'center',
    },
    teaserText: {
      flex: 1,
      fontSize: 14,
      color: '#B45309',
      fontFamily: fonts.playfairItalic,
      fontStyle: 'italic',
      lineHeight: 22,
      textAlign: 'center',
    },
    dotsRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
      marginVertical: 4,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#D1D5DB',
    },
    dotActive: {
      backgroundColor: '#0D9488',
    },
    quoteZone: {
      gap: 12,
      width: '100%',
      alignItems: 'center',
      marginTop: 8,
    },
    quoteCard: {
      backgroundColor: cardBg,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: cardBorder,
      padding: 20,
      width: '100%',
      alignItems: 'center',
      gap: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.02,
      shadowRadius: 6,
      elevation: 1,
    },
    quoteText: {
      fontSize: 16,
      color: c.text,
      fontFamily: fonts.playfairItalic,
      fontStyle: 'italic',
      textAlign: 'center',
      lineHeight: 24,
    },
    quoteDivider: {
      width: 40,
      height: 1,
      backgroundColor: c.textHint,
      opacity: 0.2,
      marginVertical: 4,
    },
    significanceText: {
      fontSize: 13,
      color: c.primary,
      fontFamily: fonts.dmSansBold,
      textAlign: 'center',
      lineHeight: 18,
    },
    jarPreviewContainer: {
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
      width: 70,
      height: 90,
      marginLeft: 8,
    },
    jarGlowTextContainer: {
      position: 'absolute',
      backgroundColor: c.day5,
      paddingHorizontal: 6,
      paddingVertical: 3,
      borderRadius: 8,
      shadowColor: c.day5,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 3,
      top: '40%',
      zIndex: 10,
    },
    jarGlowText: {
      color: '#FFFFFF',
      fontSize: 7,
      fontFamily: fonts.dmSansBold,
      letterSpacing: 0.5,
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

