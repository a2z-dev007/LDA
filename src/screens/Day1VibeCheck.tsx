import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { ProgressStrip } from '../components/common/ProgressStrip';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { useAppColors } from '../theme';
import { typography, fonts } from '../theme/typography';
import { metrics } from '../theme/metrics';
import { haptics } from '../utils/haptics';
import { useDayStore } from '../store/useDayStore';
import { Sparkles, ChevronRight, ArrowRight } from 'lucide-react-native';
import { DayEndJarModal } from '../components/common/DayEndJarModal';
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
  const setDay1Vibe = useDayStore((s) => s.setDay1Vibe);
  const completeDay1 = useDayStore((s) => s.completeDay1);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showJarModal, setShowJarModal] = useState(false);
  const fadeAnims = useRef(VIBE_OPTIONS.map(() => new Animated.Value(0))).current;
  const ctaOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered entrance for tiles
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
      Animated.timing(ctaOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [selectedId]);

  const handleSelect = (option: VibeOption) => {
    setSelectedId(option.id);
    haptics.medium();
    setDay1Vibe(option.id, option.category);
  };

  const handleNext = () => {
    if (!selectedId) return;
    haptics.heavy();
    setShowJarModal(true);
  };

  const handleModalNext = () => {
    setShowJarModal(false);
    completeDay1();
    navigation.navigate('Bridge1to2');
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
      
      <View style={styles.container}>
        <FlatList
          data={VIBE_OPTIONS}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.header}>
              <View style={styles.eyebrowPill}>
                <Sparkles size={metrics.iconSize.xs} color={colors.primary} />
                <Text style={styles.eyebrow}>VIBE CHECK</Text>
              </View>
              <Text style={styles.title}>
                One card that captures how your relationship feels right now.
              </Text>
            </View>
          }
          ListFooterComponent={<View style={{ height: responsiveHeight(20) }} />}
        />

        <Animated.View style={[styles.footer, { opacity: ctaOpacity }]}>
          <TouchableOpacity
            style={styles.nextBtnTouch}
            onPress={handleNext}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={colors.gradientBtn}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextBtn}
            >
              <Text style={styles.nextBtnText}>Next</Text>
              <ChevronRight size={20} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ghostBtn}
            onPress={handleComeBack}
            activeOpacity={0.7}
          >
            <Text style={styles.ghostBtnText}>Come back tomorrow</Text>
            <ArrowRight size={16} color={colors.textHint} />
          </TouchableOpacity>
        </Animated.View>
      </View>

      <DayEndJarModal 
        visible={showJarModal}
        currentDay={1}
        onNext={handleModalNext}
      />
    </ScreenWrapper>
  );
};

const makeStyles = (c: any) => StyleSheet.create({
  container: {
    flex: 1,
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
    paddingBottom: metrics.spacing.xxl,
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
    paddingBottom: responsiveHeight(4),
    paddingTop: metrics.spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.5)',
  },
  nextBtnTouch: {
    borderRadius: metrics.radius.full,
    shadowColor: '#2DD4BF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: metrics.spacing.md,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: metrics.spacing.md,
    borderRadius: metrics.radius.full,
    gap: metrics.spacing.sm,
  },
  nextBtnText: {
    ...typography.buttonLarge,
    color: '#FFFFFF',
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
