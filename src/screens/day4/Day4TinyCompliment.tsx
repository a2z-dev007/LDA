import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DayHeader } from '../../components/common/DayHeader';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/types';
import { ProgressStrip } from '../../components/common/ProgressStrip';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { useAppColors } from '../../theme';
import { useDayStore } from '../../store/useDayStore';
import { useJournalStore } from '../../store/useJournalStore';
import { haptics } from '../../utils/haptics';
import { metrics } from '../../theme/metrics';
import { typography, fonts } from '../../theme/typography';
import { Sparkles } from 'lucide-react-native';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { GradientButton } from '../../components/common/GradientButton';
import LinearGradient from 'react-native-linear-gradient';
import { JarEnvelopeAnimation, JarEnvelopeHandle } from '../../components/common/JarEnvelopeAnimation';

type Nav = StackNavigationProp<RootStackParamList, 'Day4TinyCompliment'>;

interface ComplimentWord {
  word: string;
  emoji: string;
}

const COMPLIMENT_WORDS: ComplimentWord[] = [
  { word: 'Seen', emoji: '👁️' },
  { word: 'Safe', emoji: '🛡️' },
  { word: 'Lighter', emoji: '🎈' },
  { word: 'Lucky', emoji: '🍀' },
  { word: 'Proud', emoji: '🏆' },
  { word: 'Loved', emoji: '❤️' },
  { word: 'Calm', emoji: '🧘' },
  { word: 'Home', emoji: '🏡' },
];

export const Day4TinyCompliment: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  
  const [selected, setSelected] = useState<string | null>(null);
  const setTinyCompliment = useDayStore((s) => s.setTinyCompliment);
  const addJarMemory = useJournalStore((s) => s.addJarMemory);
  const jarMemories = useJournalStore((s) => s.jarMemories);
  const initialJarCount = useRef(jarMemories.length).current;
  const jarRef = useRef<JarEnvelopeHandle>(null);

  const handleSelect = (word: string) => {
    haptics.medium();
    setSelected(word);
  };

  const handleSeal = () => {
    if (!selected) return;
    haptics.success();
    setTinyCompliment(selected);

    if (jarRef.current) {
      jarRef.current.triggerEnvelope(() => {
        addJarMemory({
          content: null,
          type: 'text',
          tinyCompliment: selected,
          dayColor: colors.day4,
        });
        navigation.navigate('Day4PriorityShuffle');
      });
    } else {
      addJarMemory({
        content: null,
        type: 'text',
        tinyCompliment: selected,
        dayColor: colors.day4,
      });
      navigation.navigate('Day4PriorityShuffle');
    }
  };

  return (
    <ScreenWrapper>
      <ProgressStrip currentDay={4} />

      {/* Animated Jar — top right corner */}
      <View style={styles.jarWrapper}>
        <JarEnvelopeAnimation ref={jarRef} initialCount={initialJarCount} />
      </View>

      <View style={styles.body}>
        <DayHeader eyebrow="Day 4 · Tiny Compliment" />
        
        {/* Status Capsule */}
        <View style={styles.statusCapsule}>
          <Text style={styles.statusCapsuleIcon}>🫙</Text>
          <Text style={styles.statusCapsuleText}>Your memory is sealed in the jar ✨</Text>
        </View>

        {/* Large Playfair Title */}
        <Text style={styles.title}>
          One word that describes how your partner makes you feel. Just one.
        </Text>

        {/* Pills Grid */}
        <View style={styles.grid}>
          {COMPLIMENT_WORDS.map((item) => {
            const isSelected = selected === item.word;
            return (
              <TouchableOpacity
                key={item.word}
                style={[
                  styles.pill,
                  isSelected && styles.pillSelected,
                ]}
                activeOpacity={0.8}
                onPress={() => handleSelect(item.word)}
              >
                {isSelected && (
                  <LinearGradient
                    colors={['rgba(110,232,122,0.12)', 'rgba(45,212,191,0.12)']}
                    style={StyleSheet.absoluteFill}
                  />
                )}
                <Text style={styles.pillEmoji}>{item.emoji}</Text>
                <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                  {item.word}
                </Text>
                {isSelected && (
                  <View style={styles.selectedBadge}>
                    <Sparkles size={10} color={colors.primary} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Bottom glowing tip card */}
        <View style={styles.tipCard}>
          <Sparkles size={13} color={colors.accent} style={{ marginRight: 6 }} />
          <Text style={styles.tipText}>Your word glows inside the jar on Day 5</Text>
        </View>
      </View>

      {/* CTA Button */}
      <View style={[styles.ctaWrapper, { paddingBottom: Math.max(insets.bottom + 8, metrics.spacing.md) }]}>
        {/* <TouchableOpacity
          style={[styles.mainBtn, !selected && styles.mainBtnDisabled]}
          onPress={handleSeal}
          disabled={!selected}
          activeOpacity={0.8}
        >
          <Text style={styles.mainBtnText}>Seal this word into the jar →</Text>
        </TouchableOpacity> */}
         <GradientButton
          text="Seal this word into the jar"
            onPress={handleSeal}
          disabled={!selected}
          fullWidth
          gradientColors={colors.gradientBtn}
        />
        
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => {
            haptics.light();
            navigation.navigate('Day4PriorityShuffle');
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.skipBtnText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  jarWrapper: {
    position: 'absolute',
    top: 48,
    right: metrics.layout.screenPaddingHz - 15,
    zIndex: 10,
    transform: [{ scale: 0.55 }],
  },
  body: {
    flex: 1,
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingTop: metrics.spacing.md,
  },
  statusCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderColor: c.glassBorder,
    borderRadius: metrics.radius.lg,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: metrics.spacing.lg,
    gap: 8,
  },
  statusCapsuleIcon: {
    fontSize: 16,
  },
  statusCapsuleText: {
    fontSize: 12,
    color: c.textSecondary,
    fontFamily: fonts.dmSansMedium,
  },
  title: {
    ...typography.displayMedium,
    color: c.text,
    fontFamily: 'PlayfairDisplay-Italic',
    lineHeight: metrics.fontSize.h3 * 1.3,
    marginBottom: metrics.spacing.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: metrics.spacing.xl,
    justifyContent: 'flex-start',
  },
  pill: {
    width: '31.3%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: c.surfaceBorder,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 18,
    paddingVertical: 14,
    gap: 6,
    shadowColor: 'rgba(0,0,0,0.03)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 1,
    overflow: 'hidden',
  },
  pillSelected: {
    borderColor: c.primary,
    backgroundColor: '#FFFFFF',
    shadowColor: c.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  pillEmoji: {
    fontSize: 22,
  },
  pillText: {
    color: c.textSecondary,
    fontSize: 13,
    fontFamily: fonts.dmSansBold,
    textAlign: 'center',
  },
  pillTextSelected: {
    color: c.primary,
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
    borderColor: c.glassBorder,
    borderRadius: metrics.radius.lg,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: metrics.spacing.md,
  },
  tipText: {
    fontSize: 11,
    color: c.textSecondary,
    fontFamily: fonts.dmSansMedium,
  },

  // ── CTA Wrapper ─────────────────────────────────────────
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
  mainBtn: {
    backgroundColor: c.primary,
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainBtnDisabled: {
    backgroundColor: c.textHint,
    opacity: 0.5,
  },
  mainBtnText: {
    ...typography.buttonLarge,
    color: '#FFFFFF',
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: metrics.spacing.smMd,
  },
  skipBtnText: {
    fontSize: 12,
    color: c.textHint,
    fontFamily: fonts.dmSansRegular,
    textDecorationLine: 'underline',
  },
});
