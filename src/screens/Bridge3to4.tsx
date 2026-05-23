import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/types';
import { ScreenWrapper } from '../components/common/ScreenWrapper';

import { GradientButton } from '../components/common/GradientButton';
import { useAppColors } from '../theme';
import { bridgeQuotes } from '../data/quizData';
import { useDayStore } from '../store/useDayStore';
import { useStreakStore } from '../store/useStreakStore';
import { useUserStore } from '../store/useUserStore';
import { FMS_DATA } from '../data/fmsData';
import { haptics } from '../utils/haptics';
import { metrics } from '../theme/metrics';
import { fonts, typography } from '../theme/typography';
import { Flame, Heart, Star, Grid2x2, Anchor, Sparkles } from 'lucide-react-native';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

type Nav = StackNavigationProp<RootStackParamList, 'Bridge3to4'>;

export const Bridge3to4: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  const day3 = useDayStore((s) => s.day3);
  const day4 = useDayStore((s) => s.day4);

  const streakCount = useStreakStore((s) => s.streakCount);
  const name = useUserStore((s) => s.name) || 'there';

  const displayStreak = Math.max(streakCount, 4);
  const trueCount = Object.values(day3.mirrorAnswers).filter(Boolean).length;
  const total = Object.keys(day3.mirrorAnswers).length || 10;
  const theme = day3.d3_mood_board_theme ?? 'Mixed & Moving';

  const wordKey = day3.intentionWord?.toLowerCase();
  const intentionConfig = FMS_DATA[wordKey];
  const firstQuestion = intentionConfig?.sets[day3.d3_fms_stem_id ?? 0]?.qs[0];
  const fmsFullSentence = firstQuestion && day3.d3_fms_pick
    ? `"${firstQuestion.stem} ${day3.d3_fms_pick.replace(/^[….\s]+/, '').trim()}"`
    : null;

  const handleContinue = () => {
    haptics.medium();
    navigation.navigate('SetYourIntention', { day: 4 });
  };

  return (
    <ScreenWrapper>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Eyebrow pill ── */}
        <View style={styles.eyebrowPill}>
          <Text style={styles.eyebrowText}>Day 3 → Day 4 Bridge</Text>
        </View>

        {/* ── ZONE 1: STREAK ── */}
        <View style={styles.card}>
          <Text style={styles.cardZoneTitle}>ZONE 1 · STREAK</Text>
          <View style={styles.streakRow}>
            <View style={styles.streakRingContainer}>
              <View style={styles.streakRing}>
                <Text style={styles.streakNumber}>{displayStreak}</Text>
              </View>
              <View style={styles.streakFlameBadge}>
                <Text style={{ fontSize: 10 }}>🔥</Text>
              </View>
            </View>
            <View style={styles.streakInfo}>
              <Text style={styles.welcomeText}>Welcome back, {name}</Text>
              <Text style={styles.streakSubtext}>{displayStreak}-day streak · Keep going</Text>
            </View>
          </View>
        </View>

        {/* ── ZONE 2: DAY 3 RECAP ── */}
        <View style={styles.card}>
          <Text style={styles.cardZoneTitle}>ZONE 2 · DAY 3 RECAP</Text>

          <View style={styles.recapContainer}>
            {/* Horizontal Row of Info Pills */}
            <View style={styles.pillsRow}>
              {/* Assumptions/Mirror Result pill */}
              <View style={styles.recapPill}>
                <Star size={14} color="#0D9488" fill="#CCFBF1" style={{ marginRight: 6 }} />
                <Text style={styles.recapPillText}>
                  Mirror Game · {trueCount}/{total} Correct
                </Text>
              </View>

              {/* Intention Word pill */}
              {day3.intentionWord ? (
                <View style={styles.intentionWordPill}>
                  <Text style={styles.intentionWordIcon}>✦</Text>
                  <Text style={styles.intentionWordText}>{day3.intentionWord}</Text>
                </View>
              ) : null}

              {/* Mood Board Theme pill */}
              {day3.d3_mood_board_theme && (
                <View style={styles.themePill}>
                  <Grid2x2 size={14} color="#6B8F87" style={{ marginRight: 6 }} />
                  <Text style={styles.themePillText}>
                    Theme · {theme}
                  </Text>
                </View>
              )}
            </View>

            {/* FMS Selected Sentence */}
            {fmsFullSentence && (
              <View style={[
                styles.fmsBox, 
                { 
                  borderColor: intentionConfig?.color ? `${intentionConfig.color}25` : 'rgba(0,0,0,0.06)', 
                  backgroundColor: intentionConfig?.bg ? `${intentionConfig.bg}70` : '#F8FAFC' 
                }
              ]}>
                <Text style={[
                  styles.fmsLabel, 
                  { color: intentionConfig?.color ?? colors.textHint }
                ]}>
                  FINISH MY SENTENCE
                </Text>
                <Text style={styles.fmsText}>
                  {fmsFullSentence}
                </Text>
              </View>
            )}

            {/* Appreciation Snap text box */}
            {day3.appreciationSnap && (
              <View style={styles.snapBox}>
                <Text style={styles.snapLabel}>APPRECIATION SNAP</Text>
                <Text style={styles.snapText} numberOfLines={3}>
                  "{day3.appreciationSnap}"
                </Text>
              </View>
            )}

            {/* One Certainty pill */}
            {day3.oneCertainty && (
              <View style={styles.certaintyBox}>
                <Anchor size={14} color="#6B3291" style={{ marginRight: 6 }} />
                <Text style={styles.certaintyText} numberOfLines={2}>
                  "{day3.oneCertainty}"
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* ── Teaser card ── */}
        <View style={styles.teaserCard}>
          <Text style={styles.teaserText}>
            Tomorrow you build a memory jar, drop a compliment, and reveal what you really need. Ready? 💜
          </Text>
        </View>

        {/* ── Progress dots ── */}
        <View style={styles.dotsRow}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
        </View>

        {/* ── ZONE 3: BRIDGE QUOTE ── */}
        <View style={styles.quoteZone}>
          <Text style={styles.cardZoneTitle}>ZONE 3 · BRIDGE QUOTE</Text>
          <View style={styles.quoteCard}>
            <Text style={styles.quoteText}>
              "{bridgeQuotes.bridge_3to4}"
            </Text>
          </View>
        </View>



        <View style={{ height: metrics.spacing.xl }} />
      </ScrollView>

      {/* ── Continue CTA ── */}
      <View style={[styles.ctaWrapper, { paddingBottom: Math.max(insets.bottom + 8, metrics.spacing.md) }]}>
        <GradientButton
          text="Continue to Day 4"
          onPress={handleContinue}
          disabled={false}
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
    paddingBottom: responsiveHeight(14),
    gap: metrics.spacing.md,
  },

  // ── Eyebrow ────────────────────────────────────────────
  eyebrowPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: metrics.radius.full,
    borderWidth: 1,
    borderColor: 'rgba(45,95,93,0.18)',
    paddingHorizontal: metrics.spacing.smMd,
    paddingVertical: metrics.spacing.xs,
    marginTop: metrics.spacing.xs,
  },
  eyebrowText: {
    ...typography.captionSmall,
    color: c.text,
    letterSpacing: 0.3,
  },

  // ── Card (shared) ──────────────────────────────────────
  card: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: metrics.radius.xl,
    borderWidth: 1.5,
    borderColor: c.glassBorder,
    padding: metrics.spacing.md,
    gap: metrics.spacing.sm,
  },
  cardZoneTitle: {
    ...typography.captionSmall,
    color: c.textHint,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: metrics.spacing.xs,
  },

  // ── Streak (Zone 1) ───────────────────────────────────
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.md,
  },
  streakRingContainer: {
    position: 'relative',
    width: 64,
    height: 64,
  },
  streakRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: '#0D9488',
    backgroundColor: 'rgba(13, 148, 136, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakNumber: {
    fontSize: 24,
    fontFamily: fonts.dmSansBold,
    color: c.text,
  },
  streakFlameBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  streakInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  welcomeText: {
    ...typography.bodyBold,
    fontFamily: fonts.playfairSemiBold,
    fontSize: metrics.fontSize.h3 * 0.9,
    color: c.text,
  },
  streakSubtext: {
    ...typography.bodySmall,
    color: c.textSecondary,
    marginTop: 2,
  },

  // ── Recap (Zone 2) ────────────────────────────────────
  recapContainer: {
    gap: metrics.spacing.sm,
    alignItems: 'flex-start',
  },
  recapPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6FBF7',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    borderRadius: metrics.radius.full,
    paddingHorizontal: metrics.spacing.smMd,
    paddingVertical: metrics.spacing.xs,
  },
  recapPillText: {
    ...typography.captionSmall,
    color: '#0D9488',
    fontFamily: fonts.dmSansBold,
  },
  themePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(45,95,93,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(45,95,93,0.12)',
    borderRadius: metrics.radius.full,
    paddingHorizontal: metrics.spacing.smMd,
    paddingVertical: metrics.spacing.xs,
  },
  themePillText: {
    ...typography.captionSmall,
    color: c.text,
    fontFamily: fonts.dmSansBold,
  },
  snapBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: metrics.radius.lg,
    padding: metrics.spacing.md,
    width: '100%',
    gap: 6,
  },
  snapLabel: {
    ...typography.captionSmall,
    color: c.textHint,
    letterSpacing: 1.2,
    fontSize: 9,
  },
  snapText: {
    ...typography.bodyMedium,
    color: c.text,
    fontFamily: fonts.playfairItalic,
    lineHeight: 20,
  },
  certaintyBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(107,50,145,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(107,50,145,0.15)',
    borderRadius: metrics.radius.lg,
    padding: metrics.spacing.md,
    width: '100%',
  },
  certaintyText: {
    flex: 1,
    ...typography.bodyMedium,
    color: '#6B3291',
    fontFamily: fonts.playfairItalic,
    lineHeight: 20,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: metrics.spacing.xs,
    width: '100%',
    marginBottom: metrics.spacing.xs,
  },
  intentionWordPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: metrics.radius.full,
    paddingHorizontal: metrics.spacing.smMd,
    paddingVertical: metrics.spacing.xs,
  },
  intentionWordIcon: {
    fontSize: 10,
    color: '#78350F',
    marginRight: 6,
  },
  intentionWordText: {
    ...typography.captionSmall,
    color: '#78350F',
    fontFamily: fonts.dmSansBold,
  },
  fmsBox: {
    borderWidth: 1.5,
    borderRadius: metrics.radius.lg,
    padding: metrics.spacing.md,
    width: '100%',
    gap: 6,
  },
  fmsLabel: {
    ...typography.captionSmall,
    letterSpacing: 1.2,
    fontSize: 9,
    fontFamily: fonts.dmSansBold,
  },
  fmsText: {
    ...typography.bodyMedium,
    color: c.text,
    fontFamily: fonts.playfairItalic,
    lineHeight: 20,
  },

  // ── Teaser ─────────────────────────────────────────────
  teaserCard: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    borderRadius: metrics.radius.lg,
    padding: metrics.spacing.md,
  },
  teaserText: {
    ...typography.bodyMedium,
    color: '#78350F',
    fontFamily: fonts.playfairItalic,
    lineHeight: 20,
    textAlign: 'center',
  },

  // ── Dots ───────────────────────────────────────────────
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: metrics.spacing.xs,
    marginVertical: metrics.spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(45,212,191,0.25)',
  },
  dotActive: {
    width: 24,
    backgroundColor: '#0D9488',
  },

  // ── Quote (Zone 3) ────────────────────────────────────
  quoteZone: {
    gap: metrics.spacing.xs,
    width: '100%',
  },
  quoteCard: {
    backgroundColor: '#F8FAFC',
    borderLeftWidth: 4,
    borderLeftColor: '#0D9488',
    padding: metrics.spacing.md,
    borderRadius: metrics.radius.md,
    width: '100%',
  },
  quoteText: {
    ...typography.bodyMedium,
    color: c.textSecondary,
    fontFamily: fonts.playfairItalic,
    lineHeight: 22,
  },


  // ── CTA ────────────────────────────────────────────────
  ctaWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingTop: metrics.spacing.md,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.5)',
  },
});
