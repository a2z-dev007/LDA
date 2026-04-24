import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { ProgressStrip } from '../components/common/ProgressStrip';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { colors } from '../theme';
import { useDayStore } from '../store/useDayStore';
import { calculateBadge } from '../services/badgeCalculator';
import { haptics } from '../utils/haptics';

type Nav = StackNavigationProp<RootStackParamList, 'Day5Celebration'>;

export const Day5Celebration: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const day1 = useDayStore((s) => s.day1);
  const day2 = useDayStore((s) => s.day2);
  const day3 = useDayStore((s) => s.day3);
  const day4 = useDayStore((s) => s.day4);
  const getDedicationScore = useDayStore((s) => s.getDedicationScore);

  const dedicationScore = getDedicationScore();
  const badgeResult = calculateBadge(day1, day2, day3, day4, dedicationScore);

  // Animations
  const pip1 = useRef(new Animated.Value(0)).current;
  const pip2 = useRef(new Animated.Value(0)).current;
  const pip3 = useRef(new Animated.Value(0)).current;
  const pip4 = useRef(new Animated.Value(0)).current;
  const pip5 = useRef(new Animated.Value(0)).current;
  const confettiOpacity = useRef(new Animated.Value(0)).current;
  const badgeScale = useRef(new Animated.Value(0.8)).current;
  const badgeOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  const pipAnims = [pip1, pip2, pip3, pip4, pip5];
  const pipColors = [colors.day1, colors.day2, colors.day3, colors.day4, colors.day5];

  useEffect(() => {
    haptics.success();
    Animated.sequence([
      // Fill all 5 pips L→R over 600ms
      Animated.stagger(120, pipAnims.map((p) =>
        Animated.timing(p, { toValue: 1, duration: 200, useNativeDriver: false })
      )),
      // Confetti
      Animated.timing(confettiOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      // Badge reveal
      Animated.parallel([
        Animated.spring(badgeScale, { toValue: 1, friction: 5, tension: 60, useNativeDriver: true }),
        Animated.timing(badgeOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.timing(buttonOpacity, { toValue: 1, duration: 400, delay: 200, useNativeDriver: true }),
    ]).start();
  }, []);

  const tierColor = badgeResult.tier === 'gold' ? colors.day5 : badgeResult.tier === 'standard' ? colors.day2 : colors.day3;

  return (
    <ScreenWrapper>
      {/* 5-pip progress strip — all filled */}
      <View style={styles.pipsRow}>
        {pipAnims.map((anim, i) => (
          <Animated.View
            key={i}
            style={[styles.pip, {
              backgroundColor: anim.interpolate({ inputRange: [0, 1], outputRange: ['rgba(255,255,255,0.15)', pipColors[i]] }),
            }]}
          />
        ))}
      </View>

      <View style={styles.body}>
        <Animated.Text style={[styles.confetti, { opacity: confettiOpacity }]}>🎉</Animated.Text>

        <Animated.View style={[styles.badgeContainer, { opacity: badgeOpacity, transform: [{ scale: badgeScale }] }]}>
          <View style={[styles.badgeRing, { borderColor: tierColor }]}>
            <Text style={styles.badgeIcon}>✦</Text>
          </View>
          <Text style={[styles.badgeName, { color: tierColor }]}>{badgeResult.badge.name}</Text>
          <View style={[styles.tierPill, { backgroundColor: `${tierColor}20`, borderColor: tierColor }]}>
            <Text style={[styles.tierText, { color: tierColor }]}>{badgeResult.tier.toUpperCase()}</Text>
          </View>
        </Animated.View>

        <Text style={styles.keyLine1}>"That's not nothing."</Text>
        <Text style={styles.keyLine2}>"Most people quit at Day 2."</Text>

        <View style={styles.traitPills}>
          {badgeResult.badge.traitPills.map((pill) => (
            <View key={pill} style={[styles.traitPill, { borderColor: `${tierColor}60` }]}>
              <Text style={[styles.traitPillText, { color: tierColor }]}>{pill}</Text>
            </View>
          ))}
        </View>
      </View>

      <Animated.View style={{ opacity: buttonOpacity }}>
        <TouchableOpacity
          style={[styles.cta, { backgroundColor: tierColor }]}
          activeOpacity={0.85}
          onPress={() => {
            haptics.medium();
            navigation.navigate('Day5ReportCard');
          }}
        >
          <Text style={styles.ctaLabel}>See your full report →</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  pipsRow: { flexDirection: 'row', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8, gap: 4 },
  pip: { flex: 1, height: 3, borderRadius: 2 },
  body: { flex: 1, paddingHorizontal: 28, justifyContent: 'center', alignItems: 'center', gap: 16 },
  confetti: { fontSize: 56 },
  badgeContainer: { alignItems: 'center', gap: 12 },
  badgeRing: {
    width: 100, height: 100, borderRadius: 50, borderWidth: 3,
    alignItems: 'center', justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 16, elevation: 10,
  },
  badgeIcon: { fontSize: 36, color: '#FFFFFF' },
  badgeName: { fontSize: 24, fontFamily: 'PlayfairDisplay-Bold', textAlign: 'center' },
  tierPill: {
    borderWidth: 1.5, borderRadius: 100, paddingHorizontal: 16, paddingVertical: 5,
  },
  tierText: { fontSize: 11, fontFamily: 'Inter-SemiBold', letterSpacing: 2 },
  keyLine1: { fontSize: 18, color: 'rgba(255,255,255,0.7)', fontFamily: 'PlayfairDisplay-Italic' },
  keyLine2: { fontSize: 15, color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter-Regular' },
  traitPills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  traitPill: { borderWidth: 1, borderRadius: 100, paddingHorizontal: 14, paddingVertical: 6 },
  traitPillText: { fontSize: 12, fontFamily: 'Inter-SemiBold' },
  cta: {
    marginHorizontal: 28, marginBottom: 48, paddingVertical: 18,
    borderRadius: 100, alignItems: 'center',
  },
  ctaLabel: { color: colors.dark, fontSize: 17, fontFamily: 'Inter-SemiBold', letterSpacing: 0.3 },
});
