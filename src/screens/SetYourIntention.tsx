import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { useAppColors } from '../theme';
import { typography, fonts } from '../theme/typography';
import { metrics } from '../theme/metrics';
import { haptics } from '../utils/haptics';
import { useDayStore } from '../store/useDayStore';
import { intentionWords } from '../data/quizData';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react-native';
import { GradientButton } from '../components/common/GradientButton';

import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { RootStackParamList } from '../navigation/types';

type Nav = StackNavigationProp<RootStackParamList, 'SetYourIntention'>;

export const SetYourIntention: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const setIntentionWord = useDayStore((s) => s.setDay2IntentionWord);

  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const fadeAnims = useRef(intentionWords.map(() => new Animated.Value(0))).current;
  const ctaTranslateY = useRef(new Animated.Value(120)).current;
  const ctaOpacity    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(40, fadeAnims.map(anim =>
      Animated.timing(anim, { toValue: 1, duration: 350, useNativeDriver: true })
    )).start();
  }, []);

  useEffect(() => {
    if (selectedWord) {
      Animated.parallel([
        Animated.timing(ctaOpacity, { toValue: 1, duration: 280, useNativeDriver: true }),
        Animated.spring(ctaTranslateY, { toValue: 0, friction: 8, tension: 80, useNativeDriver: true }),
      ]).start();
    }
  }, [selectedWord]);

  const handleSelect = (word: string) => {
    setSelectedWord(word);
    haptics.medium();
    setIntentionWord(word);
  };

  const handleConfirm = () => {
    if (!selectedWord) return;
    haptics.heavy();
    navigation.navigate('ThisOrThat');
  };

  const renderItem = ({ item, index }: { item: typeof intentionWords[0]; index: number }) => {
    const isSelected = selectedWord === item.word;
    return (
      <Animated.View style={{ opacity: fadeAnims[index], flex: 1 }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleSelect(item.word)}
          style={[styles.tile, isSelected && styles.tileSelected]}
        >
          {isSelected && (
            <LinearGradient
              colors={['rgba(110,232,122,0.12)', 'rgba(45,212,191,0.12)']}
              style={StyleSheet.absoluteFill}
            />
          )}
          <View style={styles.emojiContainer}>
            <Text style={styles.tileEmoji}>{item.emoji}</Text>
          </View>
          <Text style={[styles.tileLabel, isSelected && styles.tileLabelSelected]}>
            {item.word}
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
      {/* Back button */}
      <TouchableOpacity
        style={[styles.backBtn, { top: insets.top + metrics.spacing.sm }]}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <ChevronLeft size={22} color={colors.text} />
      </TouchableOpacity>

      <FlatList
        data={intentionWords}
        renderItem={renderItem}
        keyExtractor={(item) => item.word}
        numColumns={2}
        style={styles.list}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop: insets.top + responsiveFontSize(2.5) },
        ]}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.eyebrowPill}>
              <Sparkles size={metrics.iconSize.xs} color={colors.primary} />
              <Text style={styles.eyebrow}>SET YOUR INTENTION</Text>
            </View>
            <Text style={styles.title}>
              {'"One word you want to bring into your relationship today."'}
            </Text>
            <Text style={styles.hint}>Tap to select · No confirmation needed</Text>
          </View>
        }
        ListFooterComponent={<View style={{ height: responsiveHeight(14) }} />}
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
        pointerEvents={selectedWord ? 'auto' : 'none'}
      >
        <GradientButton
          text={selectedWord ? `Confirm ${selectedWord}` : 'Confirm'}
          onPress={handleConfirm}
          showArrow={true}
          fullWidth={true}
          gradientColors={colors.gradientBtn}
        />

      </Animated.View>
    </ScreenWrapper>
  );
};

const makeStyles = (c: any) => StyleSheet.create({
  list: { flex: 1 },
  backBtn: {
    position: 'absolute',
    left: metrics.layout.screenPaddingHz,
    zIndex: 10,
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    borderRadius: responsiveWidth(5),
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingHorizontal: metrics.layout.screenPaddingHz,
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
    marginBottom: metrics.spacing.sm,
  },
  hint: {
    ...typography.caption,
    color: c.textHint,
  },
  listContent: {
    paddingBottom: metrics.spacing.md,
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
    overflow: 'hidden',
  },
  tileSelected: {
    borderColor: c.primary,
    backgroundColor: '#FFFFFF',
    shadowOpacity: 0.1,
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
  },
  confirmBtnText: {
    ...typography.buttonLarge,
    color: '#FFFFFF',
  },

});
