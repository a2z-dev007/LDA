import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/types';
import { ProgressStrip } from '../components/common/ProgressStrip';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { useAppColors } from '../theme';
import { typography, fonts } from '../theme/typography';
import { metrics } from '../theme/metrics';
import { haptics } from '../utils/haptics';
import { useDayStore } from '../store/useDayStore';
import { useJournalStore } from '../store/useJournalStore';
import { Sparkles, ChevronRight, ArrowRight } from 'lucide-react-native';

import { GradientButton } from '../components/common/GradientButton';
import { JarEnvelopeAnimation, JarEnvelopeHandle } from '../components/common/JarEnvelopeAnimation';

import {
  responsiveWidth,

  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

type Nav = StackNavigationProp<RootStackParamList, 'Day1VibeCheck'>;

interface VibeOption {
  id: string;
  label: string;
  emoji: string;
  category: 'positive' | 'tender' | 'heavy';
}

const VIBE_OPTIONS: VibeOption[] = [
  { id: 'Growing', label: 'Growing', emoji: '🌱', category: 'positive' },
  { id: 'Drifting', label: 'Drifting', emoji: '🌊', category: 'heavy' },
  { id: 'Passionate', label: 'Passionate', emoji: '🔥', category: 'positive' },
  { id: 'Quiet', label: 'Quiet', emoji: '🌙', category: 'tender' },
  { id: 'Tired', label: 'Tired', emoji: '😮💨', category: 'heavy' },
  { id: 'Hopeful', label: 'Hopeful', emoji: '💫', category: 'positive' },
  { id: 'Tender', label: 'Tender', emoji: '🤍', category: 'tender' },
  { id: 'Energised', label: 'Energised', emoji: '⚡', category: 'positive' },
  { id: 'Playful', label: 'Playful', emoji: '✨', category: 'positive' },
  { id: 'Connected', label: 'Connected', emoji: '🤝', category: 'positive' },
  { id: 'Stagnant', label: 'Stagnant', emoji: '🕯️', category: 'heavy' },
  { id: 'Peaceful', label: 'Peaceful', emoji: '🍃', category: 'tender' },
];

export const Day1VibeCheck: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const setDay1Vibe = useDayStore((s) => s.setDay1Vibe);
  const completeDay1 = useDayStore((s) => s.completeDay1);
  const jarMemories = useJournalStore((s) => s.jarMemories);
  const addJarMemory = useJournalStore((s) => s.addJarMemory);
  const initialJarCount = jarMemories.length;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const jarRef = useRef<JarEnvelopeHandle>(null);
  const fadeAnims = VIBE_OPTIONS.map(() => useRef(new Animated.Value(0)).current);

  const ctaTranslateY = useRef(new Animated.Value(120)).current;
  const ctaOpacity    = useRef(new Animated.Value(0)).current;
  const headerAnim    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations for content (Jar remains hidden until Next is clicked)
    Animated.stagger(40, fadeAnims.map(anim => 
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      })
    )).start();
  }, []);




  useEffect(() => {
    if (selectedId) {
      Animated.parallel([
        Animated.timing(ctaOpacity, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.spring(ctaTranslateY, {
          toValue: 0,
          friction: 8,
          tension: 80,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [selectedId]);

  const handleSelect = (option: VibeOption) => {
    setSelectedId(option.id);
    haptics.medium();
    setDay1Vibe(option.id, option.category);
  };

  const handleNext = () => {
    if (!selectedId) return;
    const selectedOption = VIBE_OPTIONS.find(o => o.id === selectedId);
    
    haptics.heavy();

    // 1. Show the Jar first
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // 2. Trigger the envelope animation after a brief delay so user sees the jar appearing
    setTimeout(() => {
      jarRef.current?.triggerEnvelope(() => {
        // Callback after slip is in (usually ~1s into animation)
        addJarMemory({
          content: `Felt ${selectedId} ${selectedOption?.emoji || ''}`,
          type: 'text',
          tinyCompliment: null,
          dayColor: colors.primary,
        });
      });
    }, 450);

    // 3. Redirect only after the jar animation (open -> slip -> close) is finished
    setTimeout(() => {
      completeDay1();
      navigation.navigate('Home');
    }, 2000); // 2 seconds covers the full cinematic sequence
  };




  const handleComeBack = () => {
    haptics.light();
    navigation.navigate('Home');
  };

  const renderItem = ({ item, index }: { item: VibeOption; index: number }) => {
    const isSelected = selectedId === item.id;

    return (
      <Animated.View style={{ opacity: fadeAnims[index], flex: 1 }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleSelect(item)}
          style={[
            styles.tile,
            isSelected && styles.tileSelected,
          ]}
        >
          {isSelected && (
            <LinearGradient
              colors={['rgba(110,232,122,0.1)', 'rgba(45,212,191,0.1)']}
              style={StyleSheet.absoluteFill}
            />
          )}
          <View style={styles.emojiContainer}>
            <Text style={styles.tileEmoji}>{item.emoji}</Text>
          </View>
          <Text style={[styles.tileLabel, isSelected && styles.tileLabelSelected]}>
            {item.label}
          </Text>
          {isSelected && (
            <View style={styles.selectedBadge}>
              <Sparkles size={12} color={colors.primary} />
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <ScreenWrapper>
      <ProgressStrip currentDay={1} />

      {/* Jar moved into ListHeaderComponent below for consistent scrolling */}


      <FlatList
        data={VIBE_OPTIONS}

        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        ListHeaderComponent={
          <View style={styles.header}>
            <Animated.View style={[styles.jarWrapper, { opacity: headerAnim, top: responsiveHeight(-1), position: 'absolute', right: -10 }]}>
              <JarEnvelopeAnimation ref={jarRef} initialCount={initialJarCount} />
            </Animated.View>


            <View style={styles.eyebrowPill}>
              <Sparkles size={metrics.iconSize.xs} color={colors.primary} />
              <Text style={styles.eyebrow}>VIBE CHECK</Text>
            </View>
            <Text style={styles.title}>
              One card that captures how your relationship feels right now.
            </Text>
          </View>

        }
        // ListFooterComponent={<View style={styles.listFooterSpacer} />}
      />

      <Animated.View
        style={[
          styles.footer,
          {
            opacity: ctaOpacity,
            transform: [{ translateY: ctaTranslateY }],
            paddingBottom: Math.max(insets.bottom, responsiveHeight(7)),
          },
        ]}
        pointerEvents={selectedId ? 'auto' : 'none'}
      >
        <GradientButton
          text={selectedId ? `Confirm ${selectedId}` : 'Next'}
          onPress={handleNext}
          showArrow={true}
          fullWidth={true}
          gradientColors={colors.gradientBtn}
        />

        <TouchableOpacity
          style={styles.ghostBtn}
          onPress={handleComeBack}
          activeOpacity={0.7}
        >
          <Text style={styles.ghostBtnText}>Come back tomorrow</Text>
          <ArrowRight size={16} color={colors.textHint} />
        </TouchableOpacity>
      </Animated.View>
    </ScreenWrapper>
  );
};

const makeStyles = (c: any) => StyleSheet.create({
  list: {
    flex: 1,
    position: 'relative',
  },
  jarWrapper: {
    zIndex: 10,
    transform: [{ scale: 0.55 }],
  },


  header: {
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingTop: metrics.spacing.lg,
    marginBottom: metrics.spacing.xl,
  },
  eyebrowPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: metrics.radius.full,
    paddingHorizontal: metrics.spacing.smMd,
    paddingVertical: metrics.spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(45,95,93,0.15)',
    alignSelf: 'flex-start',
    marginBottom: metrics.spacing.md,
  },
  eyebrow: {
    ...typography.captionSmall,
    color: c.primary,
    letterSpacing: 1.5,
  },
  title: {
    ...typography.displaySmall,
    color: c.text,
    fontFamily: 'PlayfairDisplay-Italic',
    lineHeight: metrics.fontSize.h3 * 1.3,
  },
  listContent: {
    paddingBottom: responsiveHeight(20)
  },
  listFooterSpacer: {
    // height: responsiveHeight(2),
  },
  columnWrapper: {
    paddingHorizontal: metrics.layout.screenPaddingHz,
    justifyContent: 'space-between',
    gap: metrics.spacing.md,
    marginBottom: metrics.spacing.md,
  },
  tile: {
    flex: 1,
    height: responsiveWidth(40),
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: metrics.radius.xl,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: metrics.spacing.md,
    // shadowColor: '#2DD4BF',
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.05,
    // shadowRadius: 10,
    // elevation: 3,
    overflow: 'hidden',
  },
  tileSelected: {
    borderColor: c.primary,
    backgroundColor: '#FFFFFF',
    shadowOpacity: 0.1,
    // elevation: 6,
  },
  emojiContainer: {
    width: responsiveWidth(14),
    height: responsiveWidth(14),
    borderRadius: responsiveWidth(7),
    backgroundColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: metrics.spacing.sm,
  },
  tileEmoji: {
    fontSize: responsiveFontSize(3.5),
  },
  tileLabel: {
    ...typography.bodyMedium,
    color: c.textSecondary,
    fontFamily: fonts.dmSansBold,
    textAlign: 'center',
  },
  tileLabelSelected: {
    color: c.primary,
  },
  selectedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingTop: metrics.spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.5)',
    gap: metrics.spacing.md,
  },
  ghostBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: metrics.spacing.xs,
    paddingVertical: metrics.spacing.xs,
  },
  ghostBtnText: {
    ...typography.bodySmall,
    color: c.textHint,
    fontFamily: fonts.dmSansMedium,
  },
});
