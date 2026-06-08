import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { colors, useAppColors } from '../../theme';
import { moodOptions } from '../../data/quizData';
import { useDayStore } from '../../store/useDayStore';
import { useStreakStore } from '../../store/useStreakStore';
import { useUserStore } from '../../store/useUserStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { haptics } from '../../utils/haptics';
import { metrics } from '../../theme/metrics';
import { fonts, typography } from '../../theme/typography';
import { Heart } from 'lucide-react-native';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { GradientButton } from '../../components/common/GradientButton';

type Nav = StackNavigationProp<RootStackParamList, 'Bridge2to3'>;

export const Bridge2to3: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  
  const day2 = useDayStore((s) => s.day2);
  const streakCount = useStreakStore((s) => s.streakCount);
  const name = useUserStore((s) => s.name) || 'Maya';
  
  const displayStreak = Math.max(streakCount, 3);
  const moodData = moodOptions.find((m) => m.id === day2.mood);

  const handleConfirm = () => {
    haptics.heavy();
    navigation.navigate('SetYourIntention', { day: 3 });
  };

  return (
    <ScreenWrapper>
      <ScrollView 
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
        ]} 
        showsVerticalScrollIndicator={false}
      >
        {/* Eyebrow pill */}
        <View style={styles.eyebrowPill}>
          <Text style={styles.eyebrowText}>Day 2 → Day 3 Bridge</Text>
        </View>

        {/* ZONE 1: STREAK */}
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

        {/* ZONE 2: DAY 2 RECAP */}
        <View style={styles.card}>
          <Text style={styles.cardZoneTitle}>ZONE 2 · DAY 2 RECAP</Text>
          
          <View style={styles.recapContainer}>
            {/* Mood pill */}
            <View style={styles.moodPill}>
              <Heart size={14} color="#0D9488" fill="#CCFBF1" style={{ marginRight: 6 }} />
              <Text style={styles.moodText}>
                {moodData?.label || 'Connected'} · Score {day2.moodScore || 9}
              </Text>
            </View>

            {/* One Good Thing text box */}
            <View style={styles.oneGoodThingBox}>
              <Text style={styles.oneGoodThingText}>
                "{day2.oneGoodThing || 'The way they laughed at my terrible joke last night.'}"
              </Text>
            </View>

            {/* Intention Word pill */}
            {day2.intentionWord && (
              <View style={styles.intentionWordPill}>
                <Text style={styles.intentionWordIcon}>✦</Text>
                <Text style={styles.intentionWordText}>{day2.intentionWord}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Teaser section */}
        <View style={styles.teaserCard}>
          <Text style={styles.teaserText}>
            Today we test what you think you know about each other. Get ready — it might surprise you. 💍
          </Text>
        </View>

        {/* Dots row */}
        <View style={styles.dotsRow}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
        </View>

        {/* ZONE 3: BRIDGE QUOTE */}
        <View style={styles.quoteZone}>
          <Text style={styles.cardZoneTitle}>ZONE 3 · BRIDGE QUOTE</Text>
          <View style={styles.quoteCard}>
            <Text style={styles.quoteText}>
              "The couples who know each other best aren't the ones who've been together longest — they're the ones who keep asking."
            </Text>
          </View>
        </View>
        

        <View style={{ height: metrics.spacing.xl }} />
      </ScrollView>

      {/* Continue CTA */}
      <View style={[styles.ctaWrapper, { paddingBottom: Math.max(insets.bottom + 8, metrics.spacing.md) }]}>
        <GradientButton
          text="Set today's intention"
          onPress={handleConfirm}
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
  card: {
    backgroundColor:"rgba(255,255,255,0.5)" ,
    borderRadius: metrics.radius.xl,
    borderWidth: 1.5,
    borderColor: colors.glassBorder,
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
  recapContainer: {
    gap: metrics.spacing.sm,
    alignItems: 'flex-start',
  },
  moodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6FBF7',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    borderRadius: metrics.radius.full,
    paddingHorizontal: metrics.spacing.smMd,
    paddingVertical: metrics.spacing.xs,
  },
  moodText: {
    ...typography.captionSmall,
    color: '#0D9488',
    fontFamily: fonts.dmSansBold,
  },
  oneGoodThingBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: metrics.radius.lg,
    padding: metrics.spacing.md,
    width: '100%',
  },
  oneGoodThingText: {
    ...typography.bodyMedium,
    color: c.text,
    fontFamily: fonts.playfairItalic,
    lineHeight: 20,
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
  storageHintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    borderRadius: metrics.radius.lg,
    padding: metrics.spacing.md,
    gap: metrics.spacing.sm,
    width: '100%',
  },
  databaseIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storageHintText: {
    flex: 1,
    ...typography.captionSmall,
    color: '#1B5E20',
  },
  ctaWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingTop: metrics.spacing.md,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.5)',
  },
});
