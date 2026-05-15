import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { useAppColors } from '../theme';
import { typography, fonts } from '../theme/typography';
import { metrics } from '../theme/metrics';
import { useDayStore } from '../store/useDayStore';
import { useStreakStore } from '../store/useStreakStore';
import { Check, Target, Smile, BookOpen, Lock, Hourglass } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import { haptics } from '../utils/haptics';

type Nav = StackNavigationProp<RootStackParamList, 'Day2Result'>;

export const Day2ResultScreen: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  
  const day2 = useDayStore(s => s.day2);
  const streakCount = useStreakStore(s => s.streakCount);

  const handleFinish = () => {
    haptics.heavy();
    navigation.navigate('Home');
  };

  return (
    <ScreenWrapper>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Header Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Check size={32} color="#FFFFFF" strokeWidth={3} />
          </View>
        </View>

        {/* Title Section */}
        <Text style={styles.title}>Day 2 Complete</Text>
        <Text style={styles.subtitle}>The Mood Room was yours today.</Text>
        <Text style={styles.streakText}>Streak: {streakCount} days 🔥</Text>

        {/* Contributions Box */}
        <View style={styles.contributionsBox}>
          <Text style={styles.contributionsTitle}>TODAY'S CONTRIBUTIONS</Text>

          <View style={styles.contributionRow}>
            <View style={styles.rowIcon}>
              <Target size={16} color={colors.primary} />
            </View>
            <Text style={styles.rowText}>
              <Text style={styles.rowLabel}>Intention Word</Text> — Stored
            </Text>
          </View>

          <View style={styles.contributionRow}>
            <View style={styles.rowIcon}>
              <Smile size={16} color={colors.primary} />
            </View>
            <Text style={styles.rowText}>
              <Text style={styles.rowLabel}>Mood Check-in</Text> {day2.mood ? day2.mood.charAt(0).toUpperCase() + day2.mood.slice(1) : ''} — Score {day2.moodScore}
            </Text>
          </View>

          <View style={styles.contributionRow}>
            <View style={styles.rowIcon}>
              <BookOpen size={16} color={colors.primary} />
            </View>
            <Text style={styles.rowText}>
              <Text style={styles.rowLabel}>One Good Thing</Text> — Journal saved
            </Text>
          </View>

          <View style={styles.contributionRow}>
            <View style={styles.rowIcon}>
              <Lock size={16} color={colors.primary} />
            </View>
            <Text style={styles.rowText}>
              <Text style={styles.rowLabel}>This or That</Text> {day2.b2_tot_rounds.length} answers sealed for partner
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
        <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={handleFinish}>
          <Text style={styles.buttonText}>See you tomorrow</Text>
        </TouchableOpacity>
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
    backgroundColor: '#86EFAC', // Soft green from design
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#86EFAC',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 4,
  },
  title: {
    ...typography.h2,
    color: c.text,
    fontFamily: 'PlayfairDisplay-Bold',
    marginBottom: metrics.spacing.xs,
  },
  subtitle: {
    ...typography.bodyMedium,
    color: c.textSecondary,
    marginBottom: metrics.spacing.xs,
  },
  streakText: {
    ...typography.bodyMedium,
    color: c.text,
    fontFamily: 'Inter-SemiBold',
    marginBottom: metrics.spacing.xxl,
  },
  contributionsBox: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: metrics.radius.xl,
    padding: metrics.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    marginBottom: metrics.spacing.lg,
  },
  contributionsTitle: {
    ...typography.captionSmall,
    color: c.textHint,
    fontFamily: 'Inter-SemiBold',
    letterSpacing: 1.2,
    marginBottom: metrics.spacing.lg,
  },
  contributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: metrics.spacing.md,
    gap: metrics.spacing.md,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(45,212,191,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    ...typography.caption,
    color: c.textSecondary,
    flex: 1,
  },
  rowLabel: {
    color: c.text,
    fontFamily: 'Inter-SemiBold',
  },
  previewBox: {
    width: '100%',
    backgroundColor: '#FEF3C7', // amber-50
    borderRadius: metrics.radius.lg,
    padding: metrics.spacing.md,
    borderWidth: 1,
    borderColor: '#FDE68A', // amber-200
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
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    ...typography.buttonLarge,
    color: c.text,
    fontFamily: 'Inter-SemiBold',
  },
});
