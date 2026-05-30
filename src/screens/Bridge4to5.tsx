import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
} from 'lucide-react-native';
import { RootStackParamList } from '../navigation/types';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { GradientButton } from '../components/common/GradientButton';
import { useAppColors } from '../theme';
import { bridgeQuotes } from '../data/quizData';
import { useDayStore } from '../store/useDayStore';
import { useStreakStore } from '../store/useStreakStore';
import { useUserStore } from '../store/useUserStore';
import { haptics } from '../utils/haptics';
import { metrics } from '../theme/metrics';
import { fonts, typography } from '../theme/typography';

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

          <View style={styles.memoryBox}>
            <View style={styles.boxHeaderRow}>
              <Archive size={14} color={colors.day4} />
              <Text style={[styles.boxLabel, { color: colors.day4 }]}>MEMORY JAR</Text>
            </View>
            <Text style={styles.memoryText} numberOfLines={3}>
              "{day4.memoryContent || 'A beautiful memory of us.'}"
            </Text>
          </View>

          <View style={styles.twoColumnRow}>
            <View style={styles.miniCard}>
              <View style={styles.miniIcon}>
                <Target size={16} color={colors.primary} />
              </View>
              <Text style={styles.miniLabel}>PRIORITY SHUFFLE</Text>
              <Text style={styles.miniValue} numberOfLines={2}>
                {day4.d4_priority_picks.length
                  ? day4.d4_priority_picks.join(' · ')
                  : topNeed}
              </Text>
            </View>

            <View style={styles.miniCard}>
              <View style={styles.miniIcon}>
                <MessageCircle size={16} color="#6B3291" />
              </View>
              <Text style={styles.miniLabel}>DAILY TWO</Text>
              <Text style={styles.miniValue} numberOfLines={2}>
                {dailyTwoSummary}
              </Text>
            </View>
          </View>

          <View style={styles.statusRow}>
            <View style={[styles.statusChip, day4.dropBoxUsed && styles.statusChipActive]}>
              <ShieldCheck size={13} color={day4.dropBoxUsed ? '#0D9488' : colors.textHint} />
              <Text style={[styles.statusText, day4.dropBoxUsed && styles.statusTextActive]}>
                Drop Box {day4.dropBoxUsed ? 'used' : 'open'}
              </Text>
            </View>

            <View style={[styles.statusChip, day4.loveDropUsed && styles.statusChipActive]}>
              <Gift size={13} color={day4.loveDropUsed ? '#0D9488' : colors.textHint} />
              <Text style={[styles.statusText, day4.loveDropUsed && styles.statusTextActive]}>
                Love Drop {day4.loveDropUsed ? 'sent' : 'ready'}
              </Text>
            </View>

            <View style={[styles.statusChip, hasDailyTwo && styles.statusChipActive]}>
              <CheckCircle2 size={13} color={hasDailyTwo ? '#0D9488' : colors.textHint} />
              <Text style={[styles.statusText, hasDailyTwo && styles.statusTextActive]}>
                {hasDailyTwo ? 'Reflected' : 'Optional'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.teaserCard}>
          <Text style={styles.teaserText}>
            Day 5 turns everything you saved into your reveal, report card, letter, and promise.
          </Text>
        </View>

        <View style={styles.dotsRow}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
        </View>

        <View style={styles.quoteZone}>
          <Text style={styles.cardZoneTitle}>ZONE 3 · BRIDGE QUOTE</Text>
          <View style={styles.quoteCard}>
            <Text style={styles.quoteText}>"{bridgeQuotes.bridge_4to5}"</Text>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

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

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingBottom: responsiveHeight(14),
    gap: metrics.spacing.md,
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
  card: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: metrics.radius.xl,
    borderWidth: 1.5,
    borderColor: c.glassBorder,
    padding: metrics.spacing.md,
    gap: metrics.spacing.sm,
  },
  cardZoneTitle: {
    ...typography.captionSmall,
    color: c.textHint,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: metrics.spacing.xs,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.md,
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
    borderWidth: 3,
    borderColor: '#0D9488',
    backgroundColor: 'rgba(13, 148, 136, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
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
    ...typography.bodyBold,
    fontFamily: fonts.playfairSemiBold,
    fontSize: metrics.fontSize.h3 * 0.9,
    color: c.text,
  },
  streakSubtext: {
    ...typography.bodySmall,
    color: c.textSecondary,
    marginTop: 2,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: metrics.spacing.xs,
    width: '100%',
  },
  recapPill: {
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: metrics.radius.full,
    paddingHorizontal: metrics.spacing.smMd,
    paddingVertical: metrics.spacing.xs,
  },
  pillIcon: {
    marginRight: 6,
  },
  recapPillText: {
    ...typography.captionSmall,
    maxWidth: responsiveWidth(72),
    fontFamily: fonts.dmSansBold,
  },
  memoryBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: metrics.radius.lg,
    padding: metrics.spacing.md,
    width: '100%',
    gap: 6,
  },
  boxHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.xs,
  },
  boxLabel: {
    ...typography.captionSmall,
    letterSpacing: 1.2,
    fontSize: 9,
    fontFamily: fonts.dmSansBold,
  },
  memoryText: {
    ...typography.bodyMedium,
    color: c.text,
    fontFamily: fonts.playfairItalic,
    lineHeight: 20,
  },
  twoColumnRow: {
    flexDirection: 'row',
    gap: metrics.spacing.sm,
  },
  miniCard: {
    flex: 1,
    minHeight: responsiveHeight(11),
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(45,95,93,0.12)',
    borderRadius: metrics.radius.lg,
    padding: metrics.spacing.smMd,
    gap: 4,
  },
  miniIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(13,148,136,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  miniLabel: {
    ...typography.captionSmall,
    color: c.textHint,
    letterSpacing: 1.1,
    fontSize: 9,
    fontFamily: fonts.dmSansBold,
  },
  miniValue: {
    ...typography.bodySmall,
    color: c.text,
    fontFamily: fonts.dmSansBold,
    lineHeight: 18,
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: metrics.spacing.xs,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: metrics.radius.full,
    paddingHorizontal: metrics.spacing.sm,
    paddingVertical: metrics.spacing.xs,
  },
  statusChipActive: {
    backgroundColor: '#E6FBF7',
    borderColor: '#CCFBF1',
  },
  statusText: {
    ...typography.captionSmall,
    color: c.textHint,
    fontFamily: fonts.dmSansBold,
    letterSpacing: 0.5,
  },
  statusTextActive: {
    color: '#0D9488',
  },
  teaserCard: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    borderRadius: metrics.radius.lg,
    padding: metrics.spacing.md,
  },
  teaserText: {
    ...typography.bodyMedium,
    color: '#78350F',
    fontFamily: fonts.playfairItalic,
    lineHeight: 20,
    textAlign: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: metrics.spacing.xs,
    marginVertical: metrics.spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(45,212,191,0.25)',
  },
  dotActive: {
    width: 24,
    backgroundColor: '#0D9488',
  },
  quoteZone: {
    gap: metrics.spacing.xs,
    width: '100%',
  },
  quoteCard: {
    backgroundColor: '#F8FAFC',
    borderLeftWidth: 4,
    borderLeftColor: '#0D9488',
    padding: metrics.spacing.md,
    borderRadius: metrics.radius.md,
    width: '100%',
  },
  quoteText: {
    ...typography.bodyMedium,
    color: c.textSecondary,
    fontFamily: fonts.playfairItalic,
    lineHeight: 22,
  },
  bottomSpacer: {
    height: metrics.spacing.xl,
  },
  ctaWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingTop: metrics.spacing.md,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.5)',
  },
});
