import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { ProgressStrip } from '../components/common/ProgressStrip';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { colors } from '../theme';
import { useJournalStore } from '../store/useJournalStore';
import { useDayStore } from '../store/useDayStore';
import { haptics } from '../utils/haptics';

type Nav = StackNavigationProp<RootStackParamList, 'Day5JarReveal'>;

const DAY_COLORS = [colors.day1, colors.day2, colors.day3, colors.day4, colors.day5];

export const Day5JarReveal: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const jarMemories = useJournalStore((s) => s.jarMemories);
  const day4 = useDayStore((s) => s.day4);

  const fillAnim = useRef(new Animated.Value(80)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const noteAnims = useRef(jarMemories.map(() => new Animated.Value(0))).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    haptics.success();
    Animated.sequence([
      // Jar fills to 100%
      Animated.timing(fillAnim, { toValue: 100, duration: 1200, useNativeDriver: false }),
      // Golden glow pulse
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 0.4, duration: 800, useNativeDriver: true }),
        ]),
        { iterations: 2 }
      ),
      // Notes bounce in with stagger
      Animated.stagger(80, noteAnims.map((a) =>
        Animated.spring(a, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true })
      )),
      Animated.timing(buttonOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <ScreenWrapper>
      <ProgressStrip currentDay={5} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Your Memory Jar</Text>
        <Text style={styles.subtitle}>Everything you dropped in this week.</Text>

        {/* Jar visual */}
        <Animated.View style={[styles.jarContainer, {
          shadowOpacity: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.6] }),
        }]}>
          <Text style={styles.jarIcon}>🫙</Text>
          <View style={styles.jarFillBar}>
            <Animated.View style={[styles.jarFill, {
              width: fillAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
            }]} />
          </View>
          {day4.tinyComplimentWord && (
            <Text style={[styles.complimentGlow, { color: colors.day5 }]}>
              ✨ {day4.tinyComplimentWord}
            </Text>
          )}
        </Animated.View>

        {/* Notes */}
        <View style={styles.notes}>
          {jarMemories.map((memory, i) => (
            <Animated.View
              key={memory.id}
              style={[styles.note, {
                borderColor: memory.dayColor ?? DAY_COLORS[i % 5],
                opacity: noteAnims[i] ?? 1,
                transform: [{ scale: noteAnims[i] ?? new Animated.Value(1) }],
              }]}
            >
              {memory.content ? (
                <Text style={styles.noteText}>"{memory.content}"</Text>
              ) : memory.tinyCompliment ? (
                <Text style={[styles.noteCompliment, { color: memory.dayColor ?? colors.day4 }]}>
                  ✨ {memory.tinyCompliment}
                </Text>
              ) : (
                <Text style={styles.notePrivate}>🌹 Private note</Text>
              )}
            </Animated.View>
          ))}
          {jarMemories.length === 0 && (
            <View style={styles.emptyJar}>
              <Text style={styles.emptyText}>Your jar holds this week's journey.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <Animated.View style={{ opacity: buttonOpacity }}>
        <TouchableOpacity
          style={styles.cta}
          activeOpacity={0.85}
          onPress={() => {
            haptics.medium();
            navigation.navigate('Day5TheLetter');
          }}
        >
          <Text style={styles.ctaLabel}>Read your letter →</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: { padding: 28, paddingBottom: 16 },
  title: { fontSize: 28, color: '#FFFFFF', fontFamily: 'PlayfairDisplay-Bold', marginBottom: 8 },
  subtitle: { fontSize: 15, color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter-Regular', marginBottom: 28 },
  jarContainer: {
    alignItems: 'center', backgroundColor: `${colors.day5}10`, borderRadius: 20,
    padding: 24, marginBottom: 28, borderWidth: 1, borderColor: `${colors.day5}30`,
    shadowColor: colors.day5, shadowOffset: { width: 0, height: 0 }, shadowRadius: 20, elevation: 10,
  },
  jarIcon: { fontSize: 64, marginBottom: 12 },
  jarFillBar: { width: '80%', height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, marginBottom: 8 },
  jarFill: { height: '100%', backgroundColor: colors.day5, borderRadius: 2 },
  complimentGlow: { fontSize: 18, fontFamily: 'PlayfairDisplay-Bold', marginTop: 8 },
  notes: { gap: 12 },
  note: {
    borderWidth: 1.5, borderRadius: 14, padding: 16,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  noteText: { color: 'rgba(255,255,255,0.8)', fontSize: 15, fontFamily: 'PlayfairDisplay-Italic', lineHeight: 24 },
  noteCompliment: { fontSize: 16, fontFamily: 'PlayfairDisplay-Bold' },
  notePrivate: { color: 'rgba(255,255,255,0.3)', fontSize: 14, fontFamily: 'Inter-Regular' },
  emptyJar: { alignItems: 'center', padding: 24 },
  emptyText: { color: 'rgba(255,255,255,0.3)', fontSize: 14, fontFamily: 'PlayfairDisplay-Italic' },
  cta: {
    backgroundColor: colors.day5, marginHorizontal: 28, marginBottom: 48,
    paddingVertical: 18, borderRadius: 100, alignItems: 'center',
  },
  ctaLabel: { color: colors.dark, fontSize: 17, fontFamily: 'Inter-SemiBold', letterSpacing: 0.3 },
});
