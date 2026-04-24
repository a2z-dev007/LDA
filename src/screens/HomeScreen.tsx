import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { colors } from '../theme';
import { useDayStore } from '../store/useDayStore';
import { useUserStore } from '../store/useUserStore';
import { useStreakStore } from '../store/useStreakStore';
import { resolveRoute } from '../services/dayRouter';
import { haptics } from '../utils/haptics';

type Nav = StackNavigationProp<RootStackParamList, 'Home'>;

const DAY_INFO = [
  { number: 1, title: 'The Spark Check', color: colors.day1, route: 'Day1Slider' as keyof RootStackParamList },
  { number: 2, title: 'The Mood Room', color: colors.day2, route: 'Bridge1to2' as keyof RootStackParamList },
  { number: 3, title: 'The Assumptions Test', color: colors.day3, route: 'Bridge2to3' as keyof RootStackParamList },
  { number: 4, title: 'The Memory Jar', color: colors.day4, route: 'Bridge3to4' as keyof RootStackParamList },
  { number: 5, title: 'The Reveal', color: colors.day5, route: 'Bridge4to5' as keyof RootStackParamList },
];

export const HomeScreen = () => {
  const navigation = useNavigation<Nav>();
  const userName = useUserStore((s) => s.name);
  const nextDay = useDayStore((s) => s.nextDay());
  const completed = useDayStore((s) => s.completedDayCount());
  const streakCount = useStreakStore((s) => s.streakCount);

  const handleContinue = () => {
    haptics.medium();
    const { screen } = resolveRoute();
    navigation.navigate(screen as any);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <ScreenWrapper backgroundColor={colors.dark}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.greeting}>{getGreeting()}{userName ? `, ${userName}` : ''}</Text>
          <Text style={styles.title}>Let's Date Again</Text>
          {streakCount > 0 && (
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>🔥 {streakCount} day streak</Text>
            </View>
          )}
          <Text style={styles.subtitle}>
            {completed === 5
              ? 'You completed the solo journey. Invite your partner to unlock the rest.'
              : `Day ${nextDay} of 5 · ${5 - completed} day${5 - completed !== 1 ? 's' : ''} remaining`}
          </Text>
        </View>

        {/* Continue CTA */}
        {completed < 5 && (
          <TouchableOpacity style={styles.continueCard} activeOpacity={0.85} onPress={handleContinue}>
            <View>
              <Text style={styles.continueLabel}>Continue</Text>
              <Text style={styles.continueDayTitle}>
                Day {nextDay} · {DAY_INFO[nextDay - 1]?.title ?? 'The Reveal'}
              </Text>
            </View>
            <Text style={styles.continueArrow}>→</Text>
          </TouchableOpacity>
        )}

        {/* Day cards */}
        <View style={styles.cards}>
          {DAY_INFO.map((day) => {
            const isCompleted = day.number < nextDay;
            const isActive = day.number === nextDay;
            const isLocked = day.number > nextDay;

            return (
              <View
                key={day.number}
                style={[
                  styles.card,
                  isActive && { borderColor: day.color, borderWidth: 1.5 },
                  isCompleted && styles.cardCompleted,
                  isLocked && styles.cardLocked,
                ]}
              >
                <View style={styles.cardHeader}>
                  <Text style={[styles.dayNumber, isActive && { color: day.color }]}>
                    Day {day.number}
                  </Text>
                  {isCompleted && <Text style={styles.checkmark}>✓</Text>}
                  {isLocked && <Text style={styles.lockIcon}>🔒</Text>}
                  {isActive && (
                    <View style={[styles.activePip, { backgroundColor: day.color }]} />
                  )}
                </View>
                <Text style={styles.cardTitle}>{day.title}</Text>
              </View>
            );
          })}
        </View>

        {completed === 5 && (
          <TouchableOpacity
            style={styles.inviteBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Day5PartnerInvite')}
          >
            <Text style={styles.inviteLabel}>Invite your partner →</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: { padding: 24, paddingTop: 72, paddingBottom: 40 },
  header: { marginBottom: 28, gap: 8 },
  greeting: { color: 'rgba(255,255,255,0.4)', fontSize: 14, fontFamily: 'Inter-Regular' },
  title: { fontSize: 32, color: '#FFFFFF', fontFamily: 'PlayfairDisplay-Bold' },
  streakBadge: {
    alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 100, paddingHorizontal: 14, paddingVertical: 6,
  },
  streakText: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontFamily: 'Inter-SemiBold' },
  subtitle: { fontSize: 15, color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter-Regular' },
  continueCard: {
    backgroundColor: colors.primary, borderRadius: 20, padding: 24,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 24,
  },
  continueLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontFamily: 'Inter-SemiBold', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 },
  continueDayTitle: { color: '#FFFFFF', fontSize: 20, fontFamily: 'PlayfairDisplay-Bold' },
  continueArrow: { color: '#FFFFFF', fontSize: 24 },
  cards: { gap: 12 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)', padding: 20, borderRadius: 16,
    borderWidth: 1, borderColor: 'transparent',
  },
  cardCompleted: { opacity: 0.7, backgroundColor: 'rgba(255,255,255,0.03)' },
  cardLocked: { opacity: 0.35 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  dayNumber: { color: 'rgba(255,255,255,0.35)', fontSize: 12, fontFamily: 'Inter-SemiBold', textTransform: 'uppercase', letterSpacing: 1.5 },
  checkmark: { color: colors.success, fontSize: 14 },
  lockIcon: { fontSize: 12 },
  activePip: { width: 8, height: 8, borderRadius: 4 },
  cardTitle: { color: '#FFFFFF', fontSize: 20, fontFamily: 'PlayfairDisplay-Bold' },
  inviteBtn: {
    marginTop: 24, backgroundColor: colors.primary, padding: 18,
    borderRadius: 100, alignItems: 'center',
  },
  inviteLabel: { color: '#FFFFFF', fontSize: 17, fontFamily: 'Inter-SemiBold' },
});
