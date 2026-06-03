import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/types';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { useAppColors } from '../../theme';
import { fonts, typography } from '../../theme/typography';
import { metrics } from '../../theme/metrics';
import { haptics } from '../../utils/haptics';
import { useDayStore } from '../../store/useDayStore';
import { useStreakStore } from '../../store/useStreakStore';
import { useUserStore } from '../../store/useUserStore';
import { personalityTypes } from '../../data/personalityTypes';
import { bridgeQuotes } from '../../data/quizData';
import { Flame, ChevronRight } from 'lucide-react-native';
import { GradientButton } from '../../components/common/GradientButton';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

type Nav = StackNavigationProp<RootStackParamList, 'Bridge1to2'>;

const TRAIT_EMOJIS: Record<string, string> = {
  'Emotionally present': '🧠',
  'Acts of care': '🤲',
  'Values depth': '🌊',
  'Loyal': '🛡️',
  'Adventure-driven': '🚀',
  'Expressive': '🗣️',
  'Spontaneous': '✨',
  'Enthusiastic': '🔋',
  'Reflective': '🪞',
  'Intentional': '🎯',
  'Emotionally intelligent': '💡',
  'Patient': '⏳',
  'Direct communicator': '🗣️',
  'Adaptable': '🔄',
  'Honest': '✨',
  'Growth-focused': '🌱',
};

export const Bridge1to2: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  const day1 = useDayStore((s) => s.day1);
  const streakCount = useStreakStore((s) => s.streakCount);
  const name = useUserStore((s) => s.name);

  const displayStreak = Math.max(streakCount, 2);

  const personality = personalityTypes.find((p) => p.id === day1.personalityType)
    ?? personalityTypes[0];

  const handleContinue = () => {
    haptics.medium();
    navigation.navigate('SetYourIntention');
  };

  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          // { paddingTop: insets.top + metrics.spacing.md },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Eyebrow pill ── */}
        <View style={styles.eyebrowPill}>
          <Text style={styles.eyebrowText}>Day 1 → Day 2 Bridge</Text>
        </View>

        {/* ── Streak card ── */}
        <View style={styles.streakCard}>
          <View style={styles.streakCircle}>
            <Text style={styles.streakNumber}>{displayStreak}</Text>
            <View style={styles.streakFireBadge}>
              <Flame size={12} color="#F97316" fill="#FED7AA" />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.streakTitle}>Welcome back, {name || 'there'}</Text>
            <Text style={styles.streakSub}>
              Day {displayStreak} streak · You're building something real.
            </Text>
          </View>
        </View>

        {/* ── Day 1 Result card ── */}
        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>YOUR DAY 1 RESULT</Text>

          {/* Personality pill */}
          <View style={[styles.personalityPill, { borderColor: colors.primary + '50' }]}>
            <Text style={styles.personalityEmoji}>
              {personality.id === 'steady_flame' ? '🔥'
                : personality.id === 'electric_spark' ? '⚡'
                : personality.id === 'deep_current' ? '🌊'
                : '🌀'}
            </Text>
            <Text style={[styles.personalityPillName, { color: colors.primary }]}>
              {personality.name}
            </Text>
          </View>

          {/* Traits */}
          <View style={styles.traitsContainer}>
            {personality.traits.slice(0, 3).map((trait) => (
              <View key={trait} style={[styles.traitPill, { backgroundColor: colors.primary + '15' }]}>
                <Text style={styles.traitEmoji}>{TRAIT_EMOJIS[trait] || '✨'}</Text>
                <Text style={[styles.traitText, { color: colors.primary }]}>{trait}</Text>
              </View>
            ))}
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Description */}
          <Text style={styles.descriptionText}>
            {bridgeQuotes.bridge_1to2}
          </Text>
        </View>

        {/* ── Teaser line ── */}
        <Text style={styles.teaserText}>
          Ready for Day 2? One quick intention before we dive in.
        </Text>

        {/* ── Progress dots ── */}
        <View style={styles.dotsRow}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </ScrollView>

      {/* ── Continue CTA ── */}
      <View
        style={[
          styles.ctaWrapper,
          { paddingBottom:  insets.bottom+responsiveFontSize(3) },
        ]}
      >
        <GradientButton
          text="Continue"
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
  content: {
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingBottom: responsiveHeight(16),
    gap: metrics.spacing.lg,
  },

  // ── Eyebrow ────────────────────────────────────────────
  eyebrowPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: metrics.radius.full,
    borderWidth: 1,
    borderColor: 'rgba(45,95,93,0.18)',
    paddingHorizontal: metrics.spacing.smMd,
    paddingVertical: metrics.spacing.xs,
    marginTop: metrics.spacing.md,
  },
  eyebrowText: {
    ...typography.captionSmall,
    color: c.text,
    letterSpacing: 0.3,
  },

  // ── Streak card ────────────────────────────────────────
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.md,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: metrics.radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(45,212,191,0.2)',
    padding: metrics.spacing.md,
    // shadowColor: '#2DD4BF',
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.06,
    // shadowRadius: 12,
    // elevation: 2,
  },
  streakCircle: {
    width: responsiveWidth(14),
    height: responsiveWidth(14),
    borderRadius: responsiveWidth(7),
    borderWidth: 2.5,
    borderColor: c.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  streakFireBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 2,
  },
  streakNumber: {
    fontSize: responsiveFontSize(3.5),
    fontFamily: fonts.dmSansBold,
    color: c.text,
    lineHeight: responsiveFontSize(4.2),
  },
  streakTitle: {
    ...typography.bodyBold,
    color: c.text,
    marginBottom: 2,
  },
  streakSub: {
    ...typography.bodySmall,
    color: c.textSecondary,
  },

  // ── Result card ────────────────────────────────────────
  resultCard: {
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderRadius: metrics.radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    padding: metrics.spacing.md,
    // shadowColor: '#2DD4BF',
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.06,
    // shadowRadius: 12,
    // elevation: 2,
  },
  resultLabel: {
    ...typography.captionSmall,
    color: c.textHint,
    letterSpacing: 1.8,
    marginBottom: metrics.spacing.sm,
  },
  personalityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.xs,
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderRadius: metrics.radius.full,
    paddingHorizontal: metrics.spacing.smMd,
    paddingVertical: metrics.spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.9)',
    marginBottom: metrics.spacing.sm,
  },
  personalityEmoji: {
    fontSize: responsiveFontSize(2.2),
  },
  personalityPillName: {
    ...typography.bodyBold,
  },
  traitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: metrics.spacing.xs,
    marginBottom: metrics.spacing.md,
  },
  traitPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: metrics.spacing.sm,
    paddingVertical: metrics.spacing.xs / 2,
    borderRadius: metrics.radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  traitEmoji: {
    fontSize: responsiveFontSize(1.6),
  },
  traitText: {
    fontSize: metrics.fontSize.caption * 0.9,
    fontFamily: fonts.dmSansBold,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginBottom: metrics.spacing.md,
  },
  descriptionText: {
    ...typography.bodyMedium,
    color: c.text,
    lineHeight: metrics.fontSize.body * 1.6,
    fontFamily: 'PlayfairDisplay-Italic',
  },

  // ── Teaser ─────────────────────────────────────────────
  teaserText: {
    ...typography.bodyMedium,
    color: c.textSecondary,
    textAlign: 'center',
    lineHeight: metrics.fontSize.body * 1.5,
  },

  // ── Progress dots ──────────────────────────────────────
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: metrics.spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(45,212,191,0.25)',
  },
  dotActive: {
    width: 24,
    backgroundColor: c.primary,
  },

  // ── CTA ────────────────────────────────────────────────
  ctaWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingTop: metrics.spacing.md,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
});

