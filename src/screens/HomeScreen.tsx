import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { RootStackParamList } from '../navigation/types';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { useAppColors } from '../theme';
import { typography } from '../theme/typography';
import { fontSize, metrics } from '../theme/metrics';
import { useDayStore } from '../store/useDayStore';
import { useUserStore } from '../store/useUserStore';
import { useStreakStore } from '../store/useStreakStore';
import { resolveRoute } from '../services/dayRouter';
import { haptics } from '../utils/haptics';
import { Heart, Sparkles, Lock } from 'lucide-react-native';

type Nav = StackNavigationProp<RootStackParamList, 'Home'>;

const DAY_DATA = [
  {
    number: 1,
    title: 'The Spark Check',
    subtitle: 'Reignite connection and curiosity',
    route: 'Day1Slider' as keyof RootStackParamList,
    iconColors: ['#6EE87A', '#2DD4BF'] as [string, string],
    iconEmoji: '✦',
  },
  {
    number: 2,
    title: 'The Mood Room',
    subtitle: 'Explore feelings and set the vibe',
    route: 'Bridge1to2' as keyof RootStackParamList,
    iconColors: ['#7EC8E3', '#4A90D9'] as [string, string],
    iconEmoji: '☁',
  },
  {
    number: 3,
    title: 'The Assumptions Test',
    subtitle: 'Challenge stories, build understanding',
    route: 'Bridge2to3' as keyof RootStackParamList,
    iconColors: ['#C084FC', '#818CF8'] as [string, string],
    iconEmoji: '💬',
  },
  {
    number: 4,
    title: 'The Memory Jar',
    subtitle: 'Celebrate moments, rebuild closeness',
    route: 'Bridge3to4' as keyof RootStackParamList,
    iconColors: ['#2DD4BF', '#0EA5E9'] as [string, string],
    iconEmoji: '🫙',
  },
  {
    number: 5,
    title: 'The Reveal',
    subtitle: 'Share, appreciate and dream ahead',
    route: 'Bridge4to5' as keyof RootStackParamList,
    iconColors: ['#86EFAC', '#4ADE80'] as [string, string],
    iconEmoji: '🎁',
  },
];

export const HomeScreen = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const userName    = useUserStore((s) => s.name);
  const nextDay     = useDayStore((s) => s.nextDay());
  const completed   = useDayStore((s) => s.completedDayCount());
  const streakCount = useStreakStore((s) => s.streakCount);
  const insets      = useSafeAreaInsets();

  const handleContinue = () => {
    haptics.medium();
    const { screen } = resolveRoute();
    navigation.navigate(screen as any);
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const activeDay = DAY_DATA[nextDay - 1];
  const ctaBottomPadding = insets.bottom + metrics.spacing.sm;

  return (
    <ScreenWrapper>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ─────────────────────────────────────── */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            {getGreeting()}{userName ? `, ${userName}` : ''} 👋
          </Text>

          {/* Title row with sparkles + heart */}
          <View style={styles.titleRow}>
            <Text style={styles.title}>Let's Date Again</Text>
            <View style={styles.titleIcons}>
              <Sparkles size={metrics.iconSize.sm} color={colors.primary} strokeWidth={1.5} />
              {/* <Sparkles size={metrics.iconSize.xs} color={colors.accent} strokeWidth={1.5} /> */}
              <Heart size={metrics.iconSize.sm} color={colors.primary} strokeWidth={1.5} />
            </View>
          </View>

          {streakCount > 0 && (
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>🔥 {streakCount} day streak</Text>
            </View>
          )}

          <Text style={styles.subtitle}>
            {completed === 5
              ? 'Solo journey complete. Invite your partner.'
              : `Day ${nextDay} of 5 · ${5 - completed} day${5 - completed !== 1 ? 's' : ''} remaining`}
          </Text>
        </View>

        {/* ── Day cards ──────────────────────────────────── */}
        <View style={styles.cards}>
          {DAY_DATA.map((day) => {
            const isCompleted = day.number < nextDay;
            const isActive    = day.number === nextDay;
            const isLocked    = day.number > nextDay;

            return (
              <TouchableOpacity
                key={day.number}
                activeOpacity={isLocked ? 1 : 0.8}
                onPress={() => {
                  if (!isLocked) {
                    haptics.light();
                    navigation.navigate(day.route as any);
                  }
                }}
                style={[
                  styles.card,
                  isActive && styles.cardActive,
                  isLocked && styles.cardLocked,
                ]}
              >
                {/* Left icon circle */}
                <LinearGradient
                  colors={isLocked ? ['#D0E8E4', '#C0D8D4'] : day.iconColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.iconCircle}
                >
                  <Text style={styles.iconEmoji}>{day.iconEmoji}</Text>
                </LinearGradient>

                {/* Card content */}
                <View style={styles.cardContent}>
                  <Text style={[
                    styles.dayLabel,
                    isLocked && styles.dayLabelLocked,
                  ]}>
                    DAY {day.number}
                  </Text>
                  <Text style={[
                    styles.cardTitle,
                    isLocked && styles.cardTitleLocked,
                  ]}>
                    {day.title}
                  </Text>
                  <Text style={[
                    styles.cardSubtitle,
                    isLocked && styles.cardSubtitleLocked,
                  ]}>
                    {day.subtitle}
                  </Text>
                </View>

                {/* Right status */}
                <View style={styles.cardRight}>
                  {isCompleted && (
                    <View style={[styles.checkCircle, { backgroundColor: '#2DD4BF' }]}>
                      <Text style={styles.checkIcon}>✓</Text>
                    </View>
                  )}
                  {isActive && (
                    <View style={[styles.activeDotOuter, { borderColor: '#2DD4BF' }]}>
                      <View style={[styles.activeDotInner, { backgroundColor: '#2DD4BF' }]} />
                    </View>
                  )}
                  {isLocked && (
                    <Lock size={metrics.iconSize.sm} color="#B0C8C4" strokeWidth={2} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* ── Fixed bottom CTA ───────────────────────────── */}
      <View style={[styles.ctaContainer, { paddingBottom: ctaBottomPadding }]}>
        {completed < 5 ? (
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={handleContinue}
            style={styles.continueBtnTouch}
          >
            <LinearGradient
              colors={['#6EE87A', '#2DD4BF', '#1E90FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.continueBtn}
            >
              <View style={styles.continueBtnLeft}>
                <View style={styles.sparkleCircle}>
                  <Sparkles size={metrics.iconSize.sm} color="#FFFFFF" strokeWidth={2} />
                </View>
              </View>
              <View style={styles.continueBtnCenter}>
                <Text style={styles.continueBtnSub}>CONTINUE</Text>
                <Text style={styles.continueBtnTitle}>
                  Day {nextDay} · {activeDay?.title ?? 'The Reveal'}
                </Text>
              </View>
              <View style={styles.continueBtnRight}>
                <Text style={styles.continueBtnArrow}>→</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => navigation.navigate('Day5PartnerInvite')}
            style={styles.continueBtnTouch}
          >
            <LinearGradient
              colors={['#6EE87A', '#2DD4BF', '#1E90FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.continueBtn}
            >
              <Text style={styles.continueBtnTitle}>Invite your partner</Text>
              <Text style={styles.continueBtnArrow}>→</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </ScreenWrapper>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingTop: metrics.spacing.md,
    paddingBottom: metrics.spacing.sm,
  },

  // ── Header ───────────────────────────────────────────────
  header: {
    marginBottom: metrics.spacing.lg,
    gap: metrics.spacing.xs,
  },
  greeting: {
    ...typography.labelMedium,
    color: c.primary,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.sm,
    flexWrap: 'wrap',
  },
  title: {
    ...typography.displayLarge,
    color: c.text,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  titleIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.xs,
    marginTop: metrics.spacing.xs,
  },
  streakBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(45,95,93,0.1)',
    borderRadius: metrics.radius.full,
    paddingHorizontal: metrics.spacing.smMd,
    paddingVertical: metrics.spacing.xxs,
    marginTop: metrics.spacing.xs,
  },
  streakText: {
    ...typography.labelSmall,
    color: c.primary,
  },
  subtitle: {
    ...typography.bodySmall,
    color: c.primary,
  },

  // ── Day cards ────────────────────────────────────────────
  cards: {
    gap: metrics.spacing.sm,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    paddingVertical: metrics.spacing.smMd,
    paddingHorizontal: metrics.spacing.smMd,
    borderRadius: metrics.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.smMd,
    // shadowColor: '#2D5F5D',
    // shadowOffset: { width: 0, height: responsiveHeight(0.25) },
    // shadowOpacity: 0.06,
    // shadowRadius: responsiveWidth(2),
    // elevation: 2,
  },
  cardActive: {
    borderColor: '#2DD4BF',
    borderWidth: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  cardLocked: {
    opacity: 0.55,
  },

  // Icon circle
  iconCircle: {
    width: responsiveWidth(13),
    height: responsiveWidth(13),
    borderRadius: responsiveWidth(6.5),
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconEmoji: {
    fontSize: metrics.fontSize.h3,
    color: '#FFFFFF',
  },

  // Card text
  cardContent: {
    flex: 1,
    gap: metrics.spacing.xxs,
  },
  dayLabel: {
    ...typography.captionSmall,
    color: '#2DD4BF',
    letterSpacing: 1.2,
  },
  dayLabelLocked: {
    color: c.textHint,
  },
  cardTitle: {
    ...typography.displaySmall,
    color: c.text,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  cardTitleLocked: {
    color: c.textSecondary,
  },
  cardSubtitle: {
     fontSize:responsiveFontSize(1.5 ),
        fontFamily: 'DMSans-Regular',
        fontWeight: '400' as const,
        lineHeight: fontSize.body * 1.5,
    color: c.textSecondary,
  },
  cardSubtitleLocked: {
    color: c.textHint,
  },

  // Right status
  cardRight: {
    alignItems: 'center',
    justifyContent: 'center',
    width: responsiveWidth(6),
    flexShrink: 0,
  },
  activeDotOuter: {
    width: responsiveWidth(4.5),
    height: responsiveWidth(4.5),
    borderRadius: responsiveWidth(2.25),
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDotInner: {
    width: responsiveWidth(2),
    height: responsiveWidth(2),
    borderRadius: responsiveWidth(1),
  },
  activeDot: {
    width: responsiveWidth(2.5),
    height: responsiveWidth(2.5),
    borderRadius: responsiveWidth(1.25),
  },
  // Completed check circle
  checkCircle: {
    width: responsiveWidth(6),
    height: responsiveWidth(6),
    borderRadius: responsiveWidth(3),
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    color: '#FFFFFF',
    fontSize: responsiveWidth(3.5),
    fontFamily: 'DMSans-Bold',
    lineHeight: responsiveWidth(4),
    includeFontPadding: false,
  },

  // ── Bottom spacer ────────────────────────────────────────
  bottomSpacer: { height: responsiveHeight(12) },

  // ── Fixed CTA ───────────────────────────────────────────
  ctaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingTop: metrics.spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  continueBtnTouch: {
    borderRadius: metrics.radius.full,
    // iOS multi-layer shadow
    shadowColor: '#0D5C4A',
    shadowOffset: { width: 0, height: responsiveHeight(1.2) },
    shadowOpacity: 0.6,
    shadowRadius: responsiveWidth(6),
    // Android elevation with colored background trick
    elevation: 18,
    backgroundColor: '#1A9B7A', // dark teal — shows as colored shadow on Android
  },
  continueBtn: {
    borderRadius: metrics.radius.full,
    paddingVertical: metrics.spacing.smMd,
    paddingHorizontal: metrics.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: metrics.button.height,
  },
  btnShadowLayer: {
    display: 'none' as any,
  },
  continueBtnLeft: {
    marginRight: metrics.spacing.smMd,
  },
  sparkleCircle: {
    width: responsiveWidth(9),
    height: responsiveWidth(9),
    borderRadius: responsiveWidth(4.5),
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnCenter: {
    flex: 1,
    gap: metrics.spacing.xxs,
  },
  continueBtnSub: {
    ...typography.captionSmall,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 2,
  },
  continueBtnTitle: {
    ...typography.displaySmall,
    color: '#FFFFFF',
    fontFamily: 'PlayfairDisplay-Bold',
  },
  continueBtnRight: {
    marginLeft: metrics.spacing.sm,
  },
  continueBtnArrow: {
    ...typography.buttonLarge,
    color: '#FFFFFF',
  },
});
