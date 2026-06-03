import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { GradientButton } from '../../components/common/GradientButton';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { useAppColors } from '../../theme';
import { typography, fonts } from '../../theme/typography';
import { metrics } from '../../theme/metrics';
import { useDayStore } from '../../store/useDayStore';
import { useStreakStore } from '../../store/useStreakStore';
import { useJournalStore } from '../../store/useJournalStore';
import { JarEnvelopeAnimation, JarEnvelopeHandle } from '../../components/common/JarEnvelopeAnimation';
import { moodOptions } from '../../data/quizData';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, Target, Smile, BookOpen, Lock, Hourglass } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import { haptics } from '../../utils/haptics';

type Nav = StackNavigationProp<RootStackParamList, 'Day2Result'>;

export const Day2ResultScreen: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  
  const day2 = useDayStore(s => s.day2);
  const streakCount = useStreakStore(s => s.streakCount);
  const completedCount = useDayStore(s => s.completedDayCount());
  const displayStreak = Math.max(streakCount, completedCount);
  const recordActivity = useStreakStore(s => s.recordActivity);
  const jarMemories = useJournalStore(s => s.jarMemories);
  const initialJarCount = useRef(jarMemories.length).current;

  const jarRef = useRef<JarEnvelopeHandle>(null);
  const headerAnim = useRef(new Animated.Value(0)).current;

  const moodData = useMemo(() => 
    moodOptions.find((m) => m.id === day2.mood), 
    [day2.mood]
  );

  useEffect(() => {
    haptics.success();
    recordActivity();

    // Fade in
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Trigger the envelope animation on mount
    const timer = setTimeout(() => {
      if (jarRef.current) {
        jarRef.current.triggerEnvelope(() => {
          useJournalStore.getState().addJarMemory({
            content: `Day 2 Reflection: ${moodData?.label || 'Unknown'}`,
            type: 'text',
            tinyCompliment: null,
            dayColor: colors.primary,
          });
        });
      }
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleFinish = () => {
    haptics.heavy();
    navigation.navigate('Home');
  };

  return (
    <ScreenWrapper>
      <ScrollView 
        style={styles.scroll} 
        contentContainerStyle={[
          styles.content,
          { paddingTop: Math.max(insets.top + responsiveHeight(1), responsiveHeight(6)) }
        ]} 
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.jarWrapper, { opacity: headerAnim, top: responsiveHeight(-1) }]}>
          <JarEnvelopeAnimation ref={jarRef} initialCount={initialJarCount} />
        </Animated.View>
        
        {/* Header Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Check size={40} color="#2DD4BF" strokeWidth={3} />
          </View>
        </View>

        {/* Title Section */}
        <Text style={styles.title}>Day 2 Complete</Text>
        <Text style={styles.subtitle}>The Mood Room was yours today.</Text>
        <Text style={styles.streakText}>Streak: {displayStreak} days 🔥</Text>

        {/* Contributions Box */}
        <View style={styles.contributionsBox}>
          <Text style={styles.contributionsTitle}>TODAY'S CONTRIBUTIONS</Text>

          <View style={styles.contributionRow}>
            <View style={styles.rowIconCircle}>
              <Target size={16} color="#2D5F5D" opacity={0.6} />
            </View>
            <Text style={styles.rowText}>
              <Text style={styles.rowLabel}>Intention Word</Text> — Stored
            </Text>
          </View>

          <View style={styles.contributionRow}>
            <View style={styles.rowIconCircle}>
              <Smile size={16} color="#2D5F5D" opacity={0.6} />
            </View>
            <Text style={styles.rowText}>
              <Text style={styles.rowLabel}>Mood Check-in</Text> {day2.mood ? day2.mood.charAt(0).toUpperCase() + day2.mood.slice(1) : 'Connected'} · Score {day2.moodScore || 9}
            </Text>
          </View>

          <View style={styles.contributionRow}>
            <View style={styles.rowIconCircle}>
              <BookOpen size={16} color="#2D5F5D" opacity={0.6} />
            </View>
            <Text style={styles.rowText}>
              <Text style={styles.rowLabel}>One Good Thing</Text> — Journal saved
            </Text>
          </View>

          <View style={styles.contributionRow}>
            <View style={styles.rowIconCircle}>
              <Lock size={16} color="#2D5F5D" opacity={0.6} />
            </View>
            <Text style={styles.rowText}>
              <Text style={styles.rowLabel}>This or That</Text> {day2.b2_tot_rounds.length || 3} answers sealed for partner
            </Text>
          </View>
        </View>

        {/* Day 5 Preview */}
        <View style={styles.previewBox}>
          <View style={styles.previewHeader}>
            <Hourglass size={14} color="#D97706" />
            <Text style={styles.previewTitle}>Day 5 Preview</Text>
          </View>
          <Text style={styles.previewText}>
            Your This or That answers will appear in the Couple Mode unlock screen. Partner predictions reveal when they join.
          </Text>
        </View>

      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <GradientButton
          text="See you tomorrow"
          onPress={handleFinish}
          showArrow={true}
          fullWidth={true}
          gradientColors={colors.gradientBtn}
        />
      </View>
    </ScreenWrapper>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingTop: responsiveHeight(8),
    paddingBottom: metrics.spacing.xxl,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: metrics.spacing.lg,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DEF7EC', // Light green mint
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 6,
    borderColor: '#F3FBF8',
  },
  title: {
    ...typography.displayMedium,
    color: c.text,
    fontFamily: fonts.playfairSemiBold,
    marginBottom: metrics.spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.bodyMedium,
    color: '#86A69F',
    marginBottom: metrics.spacing.xs,
    textAlign: 'center',
  },
  streakText: {
    ...typography.bodyMedium,
    color: c.text,
    fontFamily: 'Inter-SemiBold',
    marginBottom: metrics.spacing.xxl,
  },
  contributionsBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: metrics.radius.xl,
    padding: metrics.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    marginBottom: metrics.spacing.lg,
  },
  contributionsTitle: {
    ...typography.captionSmall,
    color: '#86A69F',
    fontFamily: fonts.dmSansBold,
    letterSpacing: 1.2,
    marginBottom: metrics.spacing.lg,
  },
  contributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: metrics.spacing.md,
    gap: metrics.spacing.md,
  },
  rowIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F3FBF8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    ...typography.caption,
    color: '#86A69F',
    flex: 1,
  },
  rowLabel: {
    color: c.text,
    fontFamily: fonts.dmSansBold,
  },
  previewBox: {
    width: '100%',
    backgroundColor: '#FFFCF0', // Very light amber
    borderRadius: metrics.radius.lg,
    padding: metrics.spacing.md,
    borderWidth: 1,
    borderColor: '#FFF3C4',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  previewTitle: {
    ...typography.captionSmall,
    color: '#D97706', // amber-600
    fontFamily: 'Inter-SemiBold',
  },
  previewText: {
    ...typography.caption,
    color: '#92400E', // amber-800
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingBottom: metrics.spacing.xl,
  },
  jarWrapper: {
    position: 'absolute',
    right: metrics.layout.screenPaddingHz - 15,
    zIndex: 10,
    transform: [{ scale: 0.55 }],
  },
});
