import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/types';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { useAppColors } from '../theme';
import { useDayStore } from '../store/useDayStore';
import { useUserStore } from '../store/useUserStore';
import { useStreakStore } from '../store/useStreakStore';
import { resolveRoute } from '../services/dayRouter';
import { haptics } from '../utils/haptics';

type Nav = StackNavigationProp<RootStackParamList, 'Home'>;

// Colors are injected at render time via getDayInfo(colors)
const DAY_ROUTES = [
  { number: 1, title: 'The Spark Check',     route: 'Day1Slider' as keyof RootStackParamList },
  { number: 2, title: 'The Mood Room',        route: 'Bridge1to2' as keyof RootStackParamList },
  { number: 3, title: 'The Assumptions Test', route: 'Bridge2to3' as keyof RootStackParamList },
  { number: 4, title: 'The Memory Jar',       route: 'Bridge3to4' as keyof RootStackParamList },
  { number: 5, title: 'The Reveal',           route: 'Bridge4to5' as keyof RootStackParamList },
];

function getDayInfo(c: ReturnType<typeof useAppColors>) {
  return DAY_ROUTES.map((d, i) => ({
    ...d,
    color: [c.day1, c.day2, c.day3, c.day4, c.day5][i],
  }));
}

export const HomeScreen = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const DAY_INFO = getDayInfo(colors);
  const navigation = useNavigation<Nav>();
  const userName    = useUserStore((s) => s.name);
  const nextDay     = useDayStore((s) => s.nextDay());
  const completed   = useDayStore((s) => s.completedDayCount());
  const streakCount = useStreakStore((s) => s.streakCount);

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

  const activeDay = DAY_INFO[nextDay - 1];
  const insets = useSafeAreaInsets();

  // Bottom padding = safe area inset (nav bar) + breathing room
  const ctaBottomPadding = insets.bottom + 12;

  return (
    <ScreenWrapper backgroundColor={colors.dark}>
      {/* ── Scrollable content ─────────────────────────────── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            {getGreeting()}{userName ? `, ${userName}` : ''}
          </Text>
          <Text style={styles.title}>Let's Date Again</Text>

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

        {/* Day cards */}
        <View style={styles.cards}>
          {DAY_INFO.map((day) => {
            const isCompleted = day.number < nextDay;
            const isActive    = day.number === nextDay;
            const isLocked    = day.number > nextDay;

            return (
              <View
                key={day.number}
                style={[
                  styles.card,
                  isActive    && { borderColor: day.color, borderWidth: 1.5 },
                  isCompleted && styles.cardCompleted,
                  isLocked    && styles.cardLocked,
                ]}
              >
                <View style={styles.cardHeader}>
                  <Text style={[styles.dayNumber, isActive && { color: day.color }]}>
                    Day {day.number}
                  </Text>
                  {isCompleted && <Text style={[styles.statusIcon, { color: colors.success }]}>✓</Text>}
                  {isLocked    && <Text style={styles.statusIcon}>🔒</Text>}
                  {isActive    && <View style={[styles.activePip, { backgroundColor: day.color }]} />}
                </View>
                <Text style={styles.cardTitle}>{day.title}</Text>
              </View>
            );
          })}
        </View>

        {/* Extra bottom space so last card clears the fixed CTA */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* ── Fixed bottom CTA ───────────────────────────────── */}
      <View style={[styles.ctaContainer, { paddingBottom: ctaBottomPadding }]}>
        {completed < 5 ? (
          <TouchableOpacity
            style={styles.continueBtn}
            activeOpacity={0.88}
            onPress={handleContinue}
          >
            <View style={styles.continueBtnInner}>
              <Text style={styles.continueBtnSub}>CONTINUE</Text>
              <Text style={styles.continueBtnTitle}>
                Day {nextDay} · {activeDay?.title ?? 'The Reveal'}
              </Text>
            </View>
            <Text style={styles.continueBtnArrow}>→</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.continueBtn}
            activeOpacity={0.88}
            onPress={() => navigation.navigate('Day5PartnerInvite')}
          >
            <Text style={styles.continueBtnTitle}>Invite your partner</Text>
            <Text style={styles.continueBtnArrow}>→</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScreenWrapper>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  // ── Layout ─────────────────────────────────────────────────
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },

  // ── Header ─────────────────────────────────────────────────
  header: {
    marginBottom: 20,
    gap: 6,
  },
  greeting: {
    color: c.textHint,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  title: {
    fontSize: 30,
    color: c.text,
    fontFamily: 'PlayfairDisplay-Bold',
    lineHeight: 36,
  },
  streakBadge: {
    alignSelf: 'flex-start',
    backgroundColor: c.surface,
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  streakText: {
    color: c.textSecondary,
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
  },
  subtitle: {
    fontSize: 14,
    color: c.textHint,
    fontFamily: 'Inter-Regular',
  },

  // ── Day cards ──────────────────────────────────────────────
  cards: {
    gap: 10,
  },
  card: {
    backgroundColor: c.surface,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cardCompleted: {
    opacity: 0.65,
    backgroundColor: c.surface,
  },
  cardLocked: {
    opacity: 0.3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  dayNumber: {
    color: c.textHint,
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  statusIcon: {
    fontSize: 13,
    color: c.textHint,
  },
  activePip: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  cardTitle: {
    color: c.text,
    fontSize: 18,
    fontFamily: 'PlayfairDisplay-Bold',
  },

  // ── Bottom spacer ──────────────────────────────────────────
  bottomSpacer: {
    height: 100,
  },

  // ── Fixed CTA ─────────────────────────────────────────────
  ctaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: `${c.dark}E8`,
  },
  continueBtn: {
    backgroundColor: c.primary,
    borderRadius: 100,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  continueBtnInner: {
    gap: 2,
  },
  continueBtnSub: {
    color: c.textSecondary,
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    letterSpacing: 2,
  },
  continueBtnTitle: {
    color: c.text,
    fontSize: 17,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  continueBtnArrow: {
    color: c.text,
    fontSize: 22,
  },
});
