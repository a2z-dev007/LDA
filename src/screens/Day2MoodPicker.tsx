import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';

import { DayHeader } from '../components/common/DayHeader';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { ProgressStrip } from '../components/common/ProgressStrip';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { useAppColors } from '../theme';
import { moodOptions, MoodId } from '../data/quizData';
import { useDayStore } from '../store/useDayStore';
import { useStreakStore } from '../store/useStreakStore';
import { haptics } from '../utils/haptics';
import {
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { metrics } from '../theme/metrics';
import { typography } from '../theme/typography';
import { Flame } from 'lucide-react-native';
import { GradientButton } from '../components/common/GradientButton';
import { AnimatedCandle } from '../components/common/AnimatedCandle';

type Nav = StackNavigationProp<RootStackParamList, 'Day2MoodPicker'>;

export const Day2MoodPicker: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const day2 = useDayStore((s) => s.day2);
  const setDay2Mood = useDayStore((s) => s.setDay2Mood);
  const recordMood = useStreakStore((s) => s.recordMood);
  const [selectedMood, setSelectedMood] = useState<MoodId | null>(null);

  // Button slide-in animation
  const slideAnim = useRef(new Animated.Value(100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (selectedMood) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [selectedMood]);

  const handleSelect = (id: MoodId) => {
    haptics.light();
    setSelectedMood(id);
  };

  const handleContinue = () => {
    if (selectedMood) {
      haptics.success();
      recordMood(selectedMood);
      setDay2Mood(selectedMood);
      navigation.navigate('Day2OneGoodThing');
    }
  };

  return (
    <ScreenWrapper>
      <ProgressStrip currentDay={2} />

      <View style={styles.header}>
        <DayHeader eyebrow="Day 2 · The Mood Room" />
        {day2.intentionWord ? (
          <View style={[styles.intentionPill, { borderColor: colors.day2 }]}>
            <Flame size={metrics.iconSize.xs} color={colors.day2} style={{ marginRight: 4 }} />
            <Text style={[styles.intentionText, { color: colors.day2 }]}>{day2.intentionWord}</Text>
          </View>
        ) : null}
        <Text style={styles.title}>How do you feel about{'\n'}your relationship today? ☁️</Text>
        <Text style={styles.subtitle}>No right answer · Only your truth</Text>
      </View>

      {/* ── Animated Candle ── */}
      <View style={styles.candleContainer}>
        <AnimatedCandle
          moodId={selectedMood}
          size={110}
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {moodOptions.map((mood) => {
          const isSelected = selectedMood === mood.id;
          return (
            <TouchableOpacity
              key={mood.id}
              style={[
                styles.moodCard,
                { borderColor: isSelected ? mood.color : colors.surfaceBorder },
                isSelected && { backgroundColor: `${mood.color}15` },
              ]}
              activeOpacity={0.8}
              onPress={() => handleSelect(mood.id as MoodId)}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Text style={[styles.moodLabel, isSelected && { color: mood.color }]}>
                {mood.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Footer Button — animated slide-up */}
      {selectedMood && (
        <Animated.View
          style={[
            styles.footer,
            { opacity: opacityAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <GradientButton
            text="Continue"
            onPress={handleContinue}
            showArrow
            fullWidth
            gradientColors={colors.gradientBtn}
          />
        </Animated.View>
      )}
    </ScreenWrapper>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) =>
  StyleSheet.create({
    header: {
      paddingHorizontal: metrics.layout.screenPaddingHz,
      paddingTop: metrics.spacing.md,
      paddingBottom: metrics.spacing.sm,
      gap: metrics.spacing.sm,
    },
    intentionPill: {
      alignSelf: 'flex-start',
      borderWidth: 1.5,
      borderRadius: metrics.radius.full,
      paddingHorizontal: metrics.spacing.smMd,
      paddingVertical: metrics.spacing.xs,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.7)',
    },
    intentionText: { ...typography.labelSmall, fontFamily: 'Inter-SemiBold' },
    title: {
      ...typography.displayMedium,
      color: c.text,
      fontFamily: 'PlayfairDisplay-Bold',
      lineHeight: metrics.fontSize.h2 * 1.35,
    },
    subtitle: { ...typography.bodySmall, color: c.textSecondary, marginBottom: metrics.spacing.sm },
    candleContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: metrics.spacing.sm,
      height: responsiveHeight(18),
    },
    scroll: { flex: 1, marginTop: metrics.spacing.xs },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: metrics.layout.screenPaddingHz,
      gap: metrics.spacing.sm,
      paddingBottom: responsiveHeight(4),
    },
    moodCard: {
      width: '48%',
      borderWidth: 1.5,
      borderRadius: metrics.radius.lg,
      padding: metrics.spacing.md,
      alignItems: 'center',
      gap: metrics.spacing.sm,
      backgroundColor: 'rgba(255,255,255,0.5)',
    },
    moodEmoji: { fontSize: responsiveFontSize(4.5) },
    moodLabel: {
      color: c.textSecondary,
      ...typography.bodySmall,
      fontFamily: 'Inter-SemiBold',
      textAlign: 'center',
    },
    footer: {
      paddingHorizontal: metrics.layout.screenPaddingHz,
      paddingBottom: metrics.spacing.xl,
      paddingTop: metrics.spacing.md,
    },
  });