import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { ProgressStrip } from '../../components/common/ProgressStrip';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { GradientButton } from '../../components/common/GradientButton';
import { useAppColors } from '../../theme';
import { typography, fonts } from '../../theme/typography';
import { metrics } from '../../theme/metrics';
import { haptics } from '../../utils/haptics';
import { useDayStore } from '../../store/useDayStore';
import { useJournalStore } from '../../store/useJournalStore';
import { useStreakStore } from '../../store/useStreakStore';
import {
  CheckCircle, Heart, Lock, Grid2x2, Anchor, Star,
} from 'lucide-react-native';
import { JarEnvelopeAnimation, JarEnvelopeHandle } from '../../components/common/JarEnvelopeAnimation';
import { responsiveHeight } from 'react-native-responsive-dimensions';

type Nav = StackNavigationProp<RootStackParamList, 'Day3Complete'>;

interface ContributionItem {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  dedication: string;
}

export const Day3Complete: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const day3 = useDayStore(s => s.day3);
  const streakCount = useStreakStore(s => s.streakCount);
  const recordActivity = useStreakStore(s => s.recordActivity);
  const addJarMemory = useJournalStore(s => s.addJarMemory);
  const jarMemories = useJournalStore(s => s.jarMemories);
  const initialJarCount = useRef(jarMemories.length).current;

  const jarRef = useRef<JarEnvelopeHandle>(null);
  const headerAnim = useRef(new Animated.Value(0)).current;

  const trueCount = Object.values(day3.mirrorAnswers).filter(Boolean).length;
  const theme = day3.d3_mood_board_theme ?? 'Mixed & Moving';
  const certainty = day3.oneCertainty ?? '';

  const contributions: ContributionItem[] = [
    {
      icon: <Heart size={16} color="#D4537E" strokeWidth={2} />,
      title: 'Appreciation Snap',
      subtitle: 'Journal saved',
      dedication: 'Dedication +0.5',
    },
    {
      icon: <Lock size={16} color="#4A8FD4" strokeWidth={2} />,
      title: 'Finish My Sentence',
      subtitle: 'Partner side sealed',
      dedication: 'Dedication +0.5',
    },
    {
      icon: <Grid2x2 size={16} color="#6B8F87" strokeWidth={2} />,
      title: `Mirror Game 10/10`,
      subtitle: `${trueCount} for 10 → true_ratio ${day3.trueRatio.toFixed(1)} · Deep +2 · Protecting +1`,
      dedication: '',
    },
    {
      icon: <Grid2x2 size={16} color="#2D5F5D" strokeWidth={2} />,
      title: 'Mood Board',
      subtitle: `${theme} · Dedication`,
      dedication: 'Dedication +0.5',
    },
    {
      icon: <Anchor size={16} color="#6B3291" strokeWidth={2} />,
      title: 'One Certainty',
      subtitle: 'Saved',
      dedication: 'Dedication +0.5',
    },
  ];

  useEffect(() => {
    haptics.success();
    recordActivity();

    // Fade in header
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Trigger jar envelope animation
    const timer = setTimeout(() => {
      if (jarRef.current) {
        jarRef.current.triggerEnvelope(() => {
          addJarMemory({
            content: certainty ? `One Certainty: ${certainty}` : 'Day 3 Complete',
            type: 'text',
            tinyCompliment: null,
            dayColor: colors.day3,
          });
        });
      }
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    haptics.success();
    navigation.navigate('Home');
  };

  return (
    <ScreenWrapper>
      <ProgressStrip currentDay={3} />

      {/* Animated Jar — top right positioned absolutely over the screen */}
      <Animated.View style={[styles.jarContainer, { opacity: headerAnim, top: 48 }]}>
        <JarEnvelopeAnimation ref={jarRef} initialCount={initialJarCount} />
      </Animated.View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.heroSection}>

          <View style={styles.checkCircle}>
            <CheckCircle size={44} color="#2D5F5D" strokeWidth={1.5} />
          </View>
          <Text style={styles.heroTitle}>Day 3 Complete</Text>
          <Text style={styles.heroSubtitle}>The Mirror Game is done.</Text>
          <View style={styles.streakRow}>
            <Text style={styles.streakText}>Streak: {streakCount} days</Text>
            <Text style={styles.streakFire}>🔥</Text>
          </View>
        </View>

        {/* Today's Contributions */}
        <View style={styles.contributionsCard}>
          <Text style={styles.sectionEyebrow}>TODAY'S CONTRIBUTIONS</Text>
          <View style={styles.contributionsList}>
            {contributions.map((item, index) => (
              <View key={index} style={[styles.contributionRow, index < contributions.length - 1 && styles.contributionRowBorder]}>
                <View style={styles.contributionIcon}>{item.icon}</View>
                <View style={styles.contributionBody}>
                  <Text style={styles.contributionTitle}>
                    {item.title}
                    {item.subtitle ? <Text style={styles.contributionSubtitle}> → {item.subtitle}</Text> : null}
                    {item.dedication ? <Text style={styles.contributionDedication}> · {item.dedication}</Text> : null}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Day 5 Preview */}
        <View style={styles.day5Card}>
          <Text style={styles.day5Eyebrow}>DAY 5 PREVIEW</Text>
          <Text style={styles.day5Text}>
            Sentence Jar · Emotional Theme · Mirror match reveal when partner joins
          </Text>
        </View>

        {/* CTA */}
        <View style={styles.buttonContainer}>
          <GradientButton
            text="See you tomorrow"
            onPress={handleContinue}
            fullWidth
            showArrow={false}
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: metrics.spacing.xl,
    paddingBottom: metrics.spacing.xl,
    paddingHorizontal: metrics.layout.screenPaddingHz,
    position: 'relative',
  },
  jarContainer: {
    position: 'absolute',
    top: metrics.spacing.md,
    right: metrics.layout.screenPaddingHz - 15,
    zIndex: 10,
    transform: [{ scale: 0.55 }],
  },
  checkCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#EBFDF5',
    borderWidth: 2,
    borderColor: 'rgba(45,95,93,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: metrics.spacing.lg,
  },
  heroTitle: {
    ...typography.displayMedium,
    color: c.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 14,
    fontFamily: fonts.dmSansRegular,
    color: c.textSecondary,
    marginBottom: 8,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakText: {
    fontSize: 13,
    fontFamily: fonts.dmSansBold,
    color: c.textSecondary,
  },
  streakFire: {
    fontSize: 14,
  },
  contributionsCard: {
    marginHorizontal: metrics.layout.screenPaddingHz,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(45,95,93,0.1)',
    padding: 16,
    marginBottom: 14,
    shadowColor: '#1A2E2A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionEyebrow: {
    fontSize: 9,
    fontFamily: fonts.dmSansBold,
    color: 'rgba(45,95,93,0.5)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 14,
    textAlign: 'center',
  },
  contributionsList: {
    gap: 0,
  },
  contributionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 10,
  },
  contributionRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(45,95,93,0.07)',
  },
  contributionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(45,95,93,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  contributionBody: {
    flex: 1,
    justifyContent: 'center',
  },
  contributionTitle: {
    fontSize: 13,
    fontFamily: fonts.dmSansBold,
    color: c.text,
    lineHeight: 20,
  },
  contributionSubtitle: {
    fontSize: 12,
    fontFamily: fonts.dmSansRegular,
    color: c.textSecondary,
    fontWeight: '400',
  },
  contributionDedication: {
    fontSize: 12,
    fontFamily: fonts.dmSansMedium,
    color: '#6B3291',
    fontWeight: '500',
  },
  day5Card: {
    marginHorizontal: metrics.layout.screenPaddingHz,
    backgroundColor: '#FFFBF0',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(184,140,60,0.2)',
    padding: 16,
    marginBottom: 24,
  },
  day5Eyebrow: {
    fontSize: 9,
    fontFamily: fonts.dmSansBold,
    color: '#B08C3C',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  day5Text: {
    fontSize: 12,
    fontFamily: fonts.dmSansRegular,
    color: '#8C7040',
    lineHeight: 18,
  },
  buttonContainer: {
    paddingHorizontal: metrics.layout.screenPaddingHz,
    marginTop: 'auto',
    marginBottom: metrics.spacing.lg,
  },
});
