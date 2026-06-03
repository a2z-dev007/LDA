import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { ProgressStrip } from '../../components/common/ProgressStrip';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { GradientButton } from '../../components/common/GradientButton';
import { useAppColors } from '../../theme';
import { useJournalStore } from '../../store/useJournalStore';
import { JarEnvelopeAnimation, JarEnvelopeHandle } from '../../components/common/JarEnvelopeAnimation';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { typography, fonts } from '../../theme/typography';
import { metrics } from '../../theme/metrics';
import { haptics } from '../../utils/haptics';
import { useDayStore } from '../../store/useDayStore';
import { Check, Lock, ArrowRight } from 'lucide-react-native';
import { getMoodBoardCombo } from '../../data/moodBoardCombos';

type Nav = StackNavigationProp<RootStackParamList, 'Day3MoodBoardResult'>;

// Emoji map for tiles
const TILE_EMOJI: Record<string, string> = {
  comfort: '☕',
  fresh_start: '🌅',
  our_world: '🎧',
  under_cloud: '🌧️',
  intimate: '🕯️',
  peaceful: '🌿',
  up_down: '📈',
  figuring_out: '🧩',
  blossoming: '🌻',
  safe_home: '🏠',
};

const TILE_LABEL: Record<string, string> = {
  comfort: 'Comfort',
  fresh_start: 'Fresh start',
  our_world: 'Our world',
  under_cloud: 'Under cloud',
  intimate: 'Intimate',
  peaceful: 'Peaceful',
  up_down: 'Up & down',
  figuring_out: 'Figuring out',
  blossoming: 'Blossoming',
  safe_home: 'Safe home',
};

// Theme description map
const THEME_DESCRIPTION: Record<string, string> = {
  'Deeply Connected': 'Comfort + Our world + Intimate → ≥2 from "Deeply Connected" group',
  'Safe & Steady': 'Comfort + Our world + Safe home → ≥2 from "Safe & Steady" group',
  'Growing & Open': 'Fresh start + Blossoming + Peaceful → ≥2 from "Growing & Open" group',
  'Navigating Together': 'Up & down + Figuring out + Under cloud → ≥2 from "Navigating Together" group',
  'Mixed & Moving': 'A mix of different emotional tones',
};

export const Day3MoodBoardResult: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const day3 = useDayStore(s => s.day3);

  const selectedTiles = day3.d3_mood_board;
  const combo = getMoodBoardCombo(selectedTiles);
  const theme = combo?.title ?? day3.d3_mood_board_theme ?? 'Mixed & Moving';
  const themeDesc = combo?.emotionalRead ?? THEME_DESCRIPTION[theme] ?? '';

  const jarRef = useRef<JarEnvelopeHandle>(null);
  const headerAnim = useRef(new Animated.Value(0)).current;
  const addJarMemory = useJournalStore((s) => s.addJarMemory);
  const jarMemories = useJournalStore((s) => s.jarMemories);
  const initialJarCount = useRef(jarMemories.length).current;

  useEffect(() => {
    // Fade in
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Trigger envelope animation
    const timer = setTimeout(() => {
      if (jarRef.current) {
        jarRef.current.triggerEnvelope(() => {
          addJarMemory({
            content: `Mood Board Theme: ${theme}`,
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
    navigation.navigate('Day3OneCertainty');
  };

  return (
    <ScreenWrapper>
      <ProgressStrip currentDay={3} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.jarWrapper, { opacity: headerAnim, top: responsiveHeight(-1) }]}>
          <JarEnvelopeAnimation ref={jarRef} initialCount={initialJarCount} />
        </Animated.View>

        <View style={styles.header}>
          <ScreenHeader title="Mood Board Match" />
          {/* Confirmation badge */}
          <View style={styles.confirmBadge}>
            <Check size={12} color="#2D5F5D" strokeWidth={3} />
            <Text style={styles.confirmBadgeText}>Your 3 tiles saved</Text>
          </View>
        </View>

        {/* Split card: Your picks + Their sealed */}
        <View style={styles.splitRow}>
          {/* Left: Your Picks */}
          <View style={styles.yourPicksCard}>
            <Text style={styles.cardLabel}>YOUR PICKS</Text>
            <View style={styles.tileList}>
              {selectedTiles.map(id => (
                <View key={id} style={styles.tileRow}>
                  <Text style={styles.tileEmoji}>{TILE_EMOJI[id] ?? '●'}</Text>
                  <Text style={styles.tileText}>{TILE_LABEL[id] ?? id}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Right: Their sealed */}
          <View style={styles.sealedCard}>
            <View style={styles.sealedIconCircle}>
              <Lock size={22} color="rgba(45,95,93,0.35)" strokeWidth={1.5} />
            </View>
            <Text style={styles.sealedLabel}>Their 3 tiles{'\n'}— sealed</Text>
          </View>
        </View>

        {/* Computed Emotional Theme */}
        <View style={styles.themeCard}>
          <Text style={styles.themeEyebrow}>COMPUTED EMOTIONAL THEME</Text>
          <Text style={styles.themeName}>{theme}</Text>
          <Text style={styles.themeDesc}>{themeDesc}</Text>
        </View>

        {/* Day 5 Feed */}
        <View style={styles.day5Card}>
          <Text style={styles.day5Eyebrow}>DAY 5 FEED</Text>
          <Text style={styles.day5Text}>
            "Your Emotional Theme This Week" · Partner tiles as "3 picks waiting" · Connection Score
          </Text>
        </View>

        {/* See their board CTA (ghost) */}
        <TouchableOpacity style={styles.seeTheirBoard} activeOpacity={0.7} onPress={() => haptics.light()}>
          <ArrowRight size={14} color={colors.textSecondary} />
          <Text style={styles.seeTheirBoardText}>See their board when they join</Text>
          <ArrowRight size={14} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Continue CTA */}
        <View style={styles.buttonContainer}>
          <GradientButton
            text="Continue to One Certainty →"
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
    paddingBottom: metrics.spacing.xl,
    position: 'relative',
  },
  jarWrapper: {
    position: 'absolute',
    right: metrics.layout.screenPaddingHz - 15,
    zIndex: 10,
    transform: [{ scale: 0.55 }],
  },
  header: {
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingTop: metrics.spacing.md,
    marginBottom: metrics.spacing.md,
  },
  confirmBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  confirmBadgeText: {
    fontSize: 12,
    fontFamily: fonts.dmSansMedium,
    color: '#2D5F5D',
  },
  splitRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: metrics.layout.screenPaddingHz,
    marginBottom: 16,
  },
  yourPicksCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(45,95,93,0.1)',
    padding: 16,
    shadowColor: '#1A2E2A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardLabel: {
    fontSize: 9,
    fontFamily: fonts.dmSansBold,
    color: 'rgba(45,95,93,0.5)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  tileList: {
    gap: 10,
  },
  tileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tileEmoji: {
    fontSize: 18,
  },
  tileText: {
    fontSize: 14,
    fontFamily: fonts.dmSansMedium,
    color: '#1F3E3C',
  },
  sealedCard: {
    flex: 1,
    backgroundColor: 'rgba(45,95,93,0.03)',
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(45,95,93,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    minHeight: 120,
  },
  sealedIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(45,95,93,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  sealedLabel: {
    fontSize: 12,
    fontFamily: fonts.dmSansMedium,
    color: 'rgba(45,95,93,0.5)',
    textAlign: 'center',
    lineHeight: 18,
  },
  themeCard: {
    marginHorizontal: metrics.layout.screenPaddingHz,
    backgroundColor: '#FFFBF0',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(184,140,60,0.2)',
    padding: 16,
    marginBottom: 12,
  },
  themeEyebrow: {
    fontSize: 9,
    fontFamily: fonts.dmSansBold,
    color: '#B08C3C',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  themeName: {
    fontSize: 18,
    fontFamily: fonts.playfairSemiBold,
    color: '#7A5C00',
    marginBottom: 6,
  },
  themeDesc: {
    fontSize: 12,
    fontFamily: fonts.dmSansRegular,
    color: '#8C7040',
    lineHeight: 18,
  },
  day5Card: {
    marginHorizontal: metrics.layout.screenPaddingHz,
    backgroundColor: '#FFFBF0',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(184,140,60,0.2)',
    padding: 16,
    marginBottom: 20,
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
  seeTheirBoard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: metrics.layout.screenPaddingHz,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(45,95,93,0.15)',
    backgroundColor: 'rgba(45,95,93,0.03)',
    marginBottom: 16,
  },
  seeTheirBoardText: {
    fontSize: 13,
    fontFamily: fonts.dmSansMedium,
    color: c.textSecondary,
  },
  buttonContainer: {
    paddingHorizontal: metrics.layout.screenPaddingHz,
  },
});
