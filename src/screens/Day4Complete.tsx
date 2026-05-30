import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { ProgressStrip } from '../components/common/ProgressStrip';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { GradientButton } from '../components/common/GradientButton';
import { useAppColors } from '../theme';
import { typography, fonts } from '../theme/typography';
import { metrics } from '../theme/metrics';
import { haptics } from '../utils/haptics';
import { useDayStore } from '../store/useDayStore';
import { useJournalStore } from '../store/useJournalStore';
import { useStreakStore } from '../store/useStreakStore';
import {
  Check, Heart, Target, Box, BookOpen, Sparkles
} from 'lucide-react-native';
import { responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { JarEnvelopeAnimation, JarEnvelopeHandle } from '../components/common/JarEnvelopeAnimation';

type Nav = StackNavigationProp<RootStackParamList, 'Day4Complete'>;

interface ContributionRowProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  pillText: string;
  pillColor: string;
  pillBg: string;
  isSkipped: boolean;
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  rowMuted: {
    opacity: 0.55,
  },
  rowIconBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowBody: {
    flex: 1,
    paddingRight: 8,
  },
  rowTitle: {
    fontSize: 13,
    fontFamily: fonts.dmSansBold,
    color: '#1A3635',
    lineHeight: 16,
  },
  rowSubtitle: {
    fontSize: 11,
    fontFamily: fonts.dmSansRegular,
    color: 'rgba(26, 54, 53, 0.6)',
    marginTop: 2,
  },
  rowPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rowPillText: {
    fontSize: 9.5,
    fontFamily: fonts.dmSansBold,
  },
});

const ContributionRow: React.FC<ContributionRowProps> = ({
  icon,
  iconBg,
  title,
  subtitle,
  pillText,
  pillColor,
  pillBg,
  isSkipped,
}) => {
  return (
    <View style={[rowStyles.row, isSkipped && rowStyles.rowMuted]}>
      <View style={[rowStyles.rowIconBg, { backgroundColor: iconBg }]}>
        {icon}
      </View>
      <View style={rowStyles.rowBody}>
        <Text style={rowStyles.rowTitle}>{title}</Text>
        <Text style={rowStyles.rowSubtitle}>{subtitle}</Text>
      </View>
      <View style={[rowStyles.rowPill, { backgroundColor: pillBg }]}>
        <Text style={[rowStyles.rowPillText, { color: pillColor }]}>{pillText}</Text>
      </View>
    </View>
  );
};

export const Day4Complete: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  
  const day4 = useDayStore(s => s.day4);
  const completeDay4 = useDayStore(s => s.completeDay4);
  const recordActivity = useStreakStore(s => s.recordActivity);
  const addJarMemory = useJournalStore(s => s.addJarMemory);
  const jarMemories = useJournalStore(s => s.jarMemories);
  const initialJarCount = useRef(jarMemories.length).current;

  const jarRef = useRef<JarEnvelopeHandle>(null);
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    haptics.success();

    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      if (jarRef.current) {
        jarRef.current.triggerEnvelope(() => {
          addJarMemory({
            content: day4.d4_top_need ? `Top Need: ${day4.d4_top_need}` : 'Day 4 Complete',
            type: 'text',
            tinyCompliment: null,
            dayColor: colors.day4,
          });
        });
      }
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleComeBackTomorrow = () => {
    haptics.success();
    // Complete Day 4 in store
    completeDay4({
      memoryContent: day4.memoryContent,
      memoryType: day4.memoryType,
      tinyComplimentWord: day4.tinyComplimentWord,
      daily2Q1: day4.daily2Q1,
      daily2Q2: day4.daily2Q2,
      daily2Status: day4.daily2Status,
      dropBoxUsed: day4.dropBoxUsed,
      dropBoxReframedText: day4.dropBoxReframedText,
    });
    // Streak check
    recordActivity();
    // Go to Home
    navigation.navigate('Home');
  };

  // Compile contributions dynamically based on state
  const isMemorySaved = day4.memoryType !== 'skipped';
  const isComplimentSaved = day4.tinyComplimentWord !== null;
  const isShuffleSaved = day4.d4_priority_picks.length === 3;
  const isDaily2Saved = day4.daily2Status !== 'skipped';
  
  const jarFillPercent = isMemorySaved ? 80 : 60;

  return (
    <ScreenWrapper>
      <ProgressStrip currentDay={4} />

      <ScrollView 
        style={styles.scroll} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Checkmark Circle Hero */}
        <View style={styles.heroSection}>
          {/* Animated Jar — top right */}
          <Animated.View style={[styles.jarWrapper, { opacity: headerAnim }]}>
            <JarEnvelopeAnimation ref={jarRef} initialCount={initialJarCount} />
          </Animated.View>

          <View style={styles.checkCircle}>
            <Check size={36} color={colors.primary} strokeWidth={3} />
          </View>
          <Text style={styles.eyebrow}>DAY 4 COMPLETE</Text>
          <Text style={styles.title}>Four days in.</Text>
          <Text style={styles.subtitle}>
            One more tomorrow — and the full story becomes visible.
          </Text>
        </View>

        {/* Contributions Card */}
        <View style={styles.contributionsCard}>
          <Text style={styles.cardHeader}>WHAT YOU DID TODAY</Text>
          
          {/* Row 1: Memory */}
          <ContributionRow
            icon={<Box size={16} color="#6B8A87" />}
            iconBg="rgba(107, 138, 135, 0.08)"
            title="Memory dropped into the jar"
            subtitle={isMemorySaved ? "A precious memory preserved" : "Skipped memory option"}
            pillText={isMemorySaved ? "Dedication +1" : "Skipped"}
            pillColor={isMemorySaved ? "#0D9488" : "#9CA3AF"}
            pillBg={isMemorySaved ? "#E6FBF7" : "#F3F4F6"}
            isSkipped={!isMemorySaved}
          />

          <View style={styles.rowDivider} />

          {/* Row 2: Tiny Compliment */}
          <ContributionRow
            icon={<Sparkles size={16} color="#E29A4D" />}
            iconBg="rgba(226, 154, 77, 0.08)"
            title="Tiny compliment sealed inside"
            subtitle={isComplimentSaved ? `Word: "${day4.tinyComplimentWord}"` : "Skipped compliment option"}
            pillText={isComplimentSaved ? "Shows on Day 5" : "Skipped"}
            pillColor={isComplimentSaved ? "#D97706" : "#9CA3AF"}
            pillBg={isComplimentSaved ? "#FEF3C7" : "#F3F4F6"}
            isSkipped={!isComplimentSaved}
          />

          <View style={styles.rowDivider} />

          {/* Row 3: Priority Shuffle */}
          <ContributionRow
            icon={<Target size={16} color="#3B82F6" />}
            iconBg="rgba(59, 130, 246, 0.08)"
            title="Top needs ranked"
            subtitle={isShuffleSaved ? `Primary need: ${day4.d4_top_need}` : "Shuffle not completed"}
            pillText="Section 4 of report"
            pillColor="#2563EB"
            pillBg="#DBEAFE"
            isSkipped={!isShuffleSaved}
          />

          <View style={styles.rowDivider} />

          {/* Row 4: Daily 2 */}
          <ContributionRow
            icon={<BookOpen size={16} color="#8B5CF6" />}
            iconBg="rgba(139, 92, 246, 0.08)"
            title="Daily 2 saved"
            subtitle={isDaily2Saved ? "Private journal entry saved" : "Skipped journaling"}
            pillText={isDaily2Saved ? "Feeds mood chart" : "Skipped"}
            pillColor={isDaily2Saved ? "#7C3AED" : "#9CA3AF"}
            pillBg={isDaily2Saved ? "#EDE9FE" : "#F3F4F6"}
            isSkipped={!isDaily2Saved}
          />

          <View style={styles.rowDivider} />

          {/* Row 5: Love Drop / Drop Box */}
          {day4.loveDropUsed ? (
            <ContributionRow
              icon={<Heart size={16} color="#EC4899" />}
              iconBg="rgba(236, 72, 153, 0.08)"
              title="Love Drop sealed for them"
              subtitle={`Sealed: ${day4.loveDropType}`}
              pillText="Unlocks when they join"
              pillColor="#DB2777"
              pillBg="#FCE7F3"
              isSkipped={false}
            />
          ) : day4.dropBoxUsed ? (
            <ContributionRow
              icon={<Heart size={16} color="#10B981" />}
              iconBg="rgba(16, 185, 129, 0.08)"
              title="Drop Box reframe saved"
              subtitle="Reframed a hard message"
              pillText="Words reframed"
              pillColor="#059669"
              pillBg="#D1FAE5"
              isSkipped={false}
            />
          ) : (
            <ContributionRow
              icon={<Heart size={16} color="#9CA3AF" />}
              iconBg="#F3F4F6"
              title="Love Drop sealed for them"
              subtitle="Skipped Love Drop option"
              pillText="Skipped"
              pillColor="#9CA3AF"
              pillBg="#F3F4F6"
              isSkipped={true}
            />
          )}
        </View>

        {/* Jar Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeaderRow}>
            <Text style={styles.progressTitle}>Jar at {jarFillPercent}%</Text>
            <View style={styles.progressCircleMini} />
          </View>
          <View style={styles.progressBarBg}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: `${jarFillPercent}%`, backgroundColor: colors.primary }
              ]} 
            />
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Fixed Bottom CTA */}
      <View style={[styles.ctaWrapper, { paddingBottom: Math.max(insets.bottom + 8, metrics.spacing.md) }]}>
        <GradientButton
          text="Come back tomorrow →"
          onPress={handleComeBackTomorrow}
          fullWidth
        />
      </View>
    </ScreenWrapper>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingTop: metrics.spacing.lg,
  },

  // ── Hero ────────────────────────────────────────────────
  heroSection: {
    alignItems: 'center',
    marginBottom: metrics.spacing.lg,
    paddingTop: 10,
    position: 'relative',
  },
  jarWrapper: {
    position: 'absolute',
    top: 0,
    right: metrics.layout.screenPaddingHz - 15,
    zIndex: 10,
    transform: [{ scale: 0.55 }],
  },
  checkCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#EBFDF5',
    borderWidth: 1.5,
    borderColor: 'rgba(45, 95, 93, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: metrics.spacing.md,
    shadowColor: c.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  eyebrow: {
    fontSize: 10,
    fontFamily: fonts.dmSansBold,
    color: c.primary,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#1A3635',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: fonts.dmSansRegular,
    color: 'rgba(26, 54, 53, 0.65)',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 12,
  },

  // ── Contributions Card ──────────────────────────────────
  contributionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.04)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: metrics.spacing.md,
  },
  cardHeader: {
    fontSize: 10,
    fontFamily: fonts.dmSansBold,
    color: '#8FB8A8',
    letterSpacing: 1.2,
    marginBottom: 16,
    textAlign: 'center',
  },

  rowDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },

  // ── Progress Card ───────────────────────────────────────
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.04)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.01,
    shadowRadius: 4,
    elevation: 1,
    gap: 10,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressTitle: {
    fontSize: 12,
    fontFamily: fonts.dmSansBold,
    color: c.primary,
  },
  progressCircleMini: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: c.primary,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: `${c.primary}15`,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },

  // ── Fixed CTA ───────────────────────────────────────────
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
