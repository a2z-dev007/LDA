import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { ProgressStrip } from '../../components/common/ProgressStrip';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { useAppColors } from '../../theme';
import { typography, fonts } from '../../theme/typography';
import { metrics } from '../../theme/metrics';
import { haptics } from '../../utils/haptics';
import { useDayStore } from '../../store/useDayStore';
import { Sparkles, Info, HelpCircle } from 'lucide-react-native';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { SHUFFLE_INTENTIONS, mapPicksToCategories, CARD_CATEGORY_MAPPING } from '../../data/priorityShuffleData';
import { DayHeader } from '../../components/common/DayHeader';
import { GradientButton } from '../../components/common/GradientButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Nav = StackNavigationProp<RootStackParamList, 'Day4PriorityShuffle'>;

const CATEGORY_THEMES: Record<string, {
  borderColor: string;
  bgColor: string;
  textColor: string;
  subtitle: string;
}> = {
  'More warmth & affection': {
    borderColor: '#E8799D', // pink
    bgColor: 'rgba(232, 121, 157, 0.08)',
    textColor: '#9F1239',
    subtitle: "You're craving closeness right now",
  },
  'Dedicated time together': {
    borderColor: '#F5A67A', // orange
    bgColor: 'rgba(245, 166, 122, 0.08)',
    textColor: '#92400E',
    subtitle: "You want undivided presence",
  },
  'More calm, less stress': {
    borderColor: '#3B82F6', // blue
    bgColor: 'rgba(59, 130, 246, 0.08)',
    textColor: '#1E40AF',
    subtitle: "You need the relationship to feel like relief",
  },
  'Laughter & lightness': {
    borderColor: '#10B981', // green
    bgColor: 'rgba(16, 185, 129, 0.08)',
    textColor: '#065F46',
    subtitle: "You want to feel like you again",
  },
  'Deeper conversations': {
    borderColor: '#B8A8D8', // lavender-purple
    bgColor: 'rgba(184, 168, 216, 0.08)',
    textColor: '#5B21B6',
    subtitle: "You want to talk about what matters",
  },
};

export const Day4PriorityShuffle: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  
  const day4 = useDayStore(s => s.day4);
  const setDay4PriorityShuffle = useDayStore(s => s.setDay4PriorityShuffle);
  
  // Retrieve selected intention word from Day 4. Fallback to 'warm' if not found.
  const intentionWord = day4.intentionWord || 'Warm';
  const intentionKey = intentionWord.toLowerCase();
  const config = SHUFFLE_INTENTIONS[intentionKey] || SHUFFLE_INTENTIONS.warm;
  
  // Track selected card indices (0 to 4)
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  
  // Animation for the trivia fact box reveal
  const factOpacity = useRef(new Animated.Value(0)).current;
  const factScale = useRef(new Animated.Value(0.97)).current;

  useEffect(() => {
    if (selectedCards.length === 3) {
      Animated.parallel([
        Animated.timing(factOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(factScale, {
          toValue: 1,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(factOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(factScale, {
          toValue: 0.97,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [selectedCards.length]);

  const handleToggle = (index: number) => {
    if (selectedCards.includes(index)) {
      setSelectedCards(selectedCards.filter(i => i !== index));
      haptics.light();
    } else if (selectedCards.length < 3) {
      setSelectedCards([...selectedCards, index]);
      haptics.medium();
    }
  };

  const resetCards = () => {
    setSelectedCards([]);
    haptics.light();
  };

  // Generate combination fact
  const getFact = () => {
    if (selectedCards.length < 3) return '';
    // Sort selected indices ascending, then map to 1-based index (e.g. 0,1,2 -> '123')
    const key = [...selectedCards]
      .sort((a, b) => a - b)
      .map(x => x + 1)
      .join('');
    return config.facts[key] || 'Psychology combination fact not found.';
  };

  const handleNext = () => {
    if (selectedCards.length < 3) return;
    
    // Map selected indices to baseline categories (warmth, time, calm, laughter, conversations)
    const categories = mapPicksToCategories(intentionKey, selectedCards);
    const topNeed = categories[0];
    
    setDay4PriorityShuffle(categories, topNeed);
    haptics.success();
    navigation.navigate('Day4DailyTwo');
  };

  const factText = getFact();

  return (
    <ScreenWrapper>
      <ProgressStrip currentDay={4} />
      
      <ScrollView 
        style={styles.scroll} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.eyebrowRow}>
             <DayHeader eyebrow="Day 4 · Priority Shuffle" />
            {/* Intention Pill */}
           
          </View>
           <View style={[styles.intentionPill, { backgroundColor: config.bg, borderColor: config.color }]}>
              <Text style={[styles.intentionText, { color: config.textColor }]}>
                Intention: {config.label}
              </Text>
            </View>
          <Text style={styles.title}>
            5 cards. Tap your top 3 — in order of what you need most right now.
          </Text>
          <Text style={styles.selectionStatus}>
            {selectedCards.length} of 3 selected · Tap to rank
          </Text>
        </View>

        {/* Cards Grid */}
        <View style={styles.cardsGrid}>
          {config.cards.map((card, i) => {
            const isSelected = selectedCards.includes(i);
            const selectionIndex = selectedCards.indexOf(i);
            const isDisabled = !isSelected && selectedCards.length >= 3;

            const cardCategory = CARD_CATEGORY_MAPPING[intentionKey]?.[i] || 'Deeper conversations';
            const theme = CATEGORY_THEMES[cardCategory];

            return (
              <TouchableOpacity
                key={i}
                activeOpacity={0.8}
                onPress={() => handleToggle(i)}
                disabled={isDisabled}
                style={[
                  styles.card,
                  isSelected ? {
                    borderColor: theme.borderColor,
                    // backgroundColor: theme.bgColor,
                    shadowColor: theme.borderColor,
                    shadowOpacity: 0.1,
                    shadowRadius: 6,
                  } : {
                    borderColor: 'rgba(0, 0, 0, 0.08)',
                    backgroundColor: 'rgba(255, 255, 255, 0.45)',
                  },
                  isDisabled && styles.cardDisabled,
                ]}
              >
                <View style={styles.cardMain}>
                  <View style={styles.cardLeft}>
                    <Text style={styles.cardEmoji}>{card.icon}</Text>
                    <View style={styles.cardTexts}>
                      <Text 
                        style={[
                          styles.cardLabel, 
                          isSelected && { color: theme.textColor, fontFamily: fonts.dmSansBold }
                        ]}
                      >
                        {card.title}
                      </Text>
                      {isSelected && (
                        <Text style={[styles.cardSubText, { color: theme.textColor }]}>
                          {theme.subtitle}
                        </Text>
                      )}
                    </View>
                  </View>
                  
                  <View style={[
                    styles.rankBadge, 
                    isSelected ? {
                      backgroundColor: theme.borderColor,
                      borderColor: theme.borderColor,
                    } : {
                      backgroundColor: 'transparent',
                      borderColor: 'rgba(0, 0, 0, 0.15)',
                      borderWidth: 1.5,
                    }
                  ]}>
                    {isSelected ? (
                      <Text style={styles.rankText}>{selectionIndex + 1}</Text>
                    ) : null}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Unique Psychology Fact Block */}
        {selectedCards.length === 3 && (
          <Animated.View 
            style={[
              styles.factBox, 
              { 
                opacity: factOpacity, 
                transform: [{ scale: factScale }],
                borderColor: config.color + '40',
                backgroundColor: '#FFFFFF',
              }
            ]}
          >
            <Text style={[styles.factTag, { color: config.textColor }]}>
              {config.label} — your trivia
            </Text>
            
            {/* Pills selected recap */}
            <View style={styles.pillsContainer}>
              {selectedCards.map((idx, rank) => (
                <View 
                  key={idx} 
                  style={[styles.comboPill, { backgroundColor: config.bg }]}
                >
                  <Text style={[styles.comboPillText, { color: config.textColor }]}>
                    {rank + 1}. {config.cards[idx].title}
                  </Text>
                </View>
              ))}
            </View>

            <Text style={styles.factText}>{factText}</Text>
            
            <Text style={styles.factSource}>
              Sources: Gottman Institute · Brené Brown · Sue Johnson · Barbara Fredrickson · Arthur Aron · Jaak Panksepp · John Cacioppo
            </Text>
          </Animated.View>
        )}

        <View style={{ height: responsiveHeight(12) }} />
      </ScrollView>

      {/* CTA Button Wrapper matching the wireframe */}
      <View style={[styles.ctaWrapper, { paddingBottom: Math.max(insets.bottom + 8, metrics.spacing.md) }]}>
        <GradientButton
          text="Save my top 3"
          onPress={handleNext}
          disabled={selectedCards.length < 3}
          fullWidth={true}
          gradientColors={colors.gradientBtn}
          style={{ marginBottom: metrics.spacing.xs }}
        />
        
        <TouchableOpacity
          style={styles.lockBtn}
          onPress={() => {
            haptics.medium();
            Alert.alert("Locked 🔒", "This will unlock on Day 5 when both of you complete the shuffle!");
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.lockBtnText}>See what they need → (locked 🔒)</Text>
        </TouchableOpacity>
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
    paddingBottom: responsiveHeight(16),
  },
  header: {
    marginBottom: metrics.spacing.md,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    // gap: metrics.spacing.sm,
    // marginBottom: metrics.spacing.smMd,
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
    borderColor: 'rgba(45,212,191,0.15)',
    alignSelf: 'flex-start',
  },
  eyebrow: {
    ...typography.captionSmall,
    letterSpacing: 1.2,
  },
  intentionPill: {
    borderRadius: metrics.radius.full,
    paddingHorizontal: metrics.spacing.smMd,
    paddingVertical: metrics.spacing.xs,
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginBottom: metrics.spacing.md,
  },
  intentionText: {
    fontSize: metrics.fontSize.micro,
    fontFamily: fonts.dmSansBold,
  },
  title: {
    ...typography.displaySmall,
    color: c.text,
    fontFamily: 'PlayfairDisplay-Bold',
    lineHeight: metrics.fontSize.h3 * 1.25,
    marginBottom: 4,
  },
  selectionStatus: {
    fontSize: 13,
    color: c.textHint || '#9CA3AF',
    fontFamily: fonts.dmSansMedium,
    marginBottom: metrics.spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: metrics.spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  infoText: {
    ...typography.caption,
    color: c.textHint,
  },
  resetBtn: {
    ...typography.caption,
    color: c.textSecondary,
    textDecorationLine: 'underline',
    fontFamily: fonts.dmSansBold,
  },
  cardsGrid: {
    gap: metrics.spacing.smMd,
    marginBottom: metrics.spacing.lg,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: metrics.spacing.md,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.04,
    // shadowRadius: 5,
    // elevation: 2,
  },
  cardSelected: {
    backgroundColor: 'rgba(45,212,191,0.05)',
  },
  cardDisabled: {
    opacity: 0.35,
  },
  cardMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: metrics.spacing.sm,
  },
  cardTexts: {
    flex: 1,
    flexDirection: 'column',
    gap: 2,
  },
  cardEmoji: {
    fontSize: responsiveFontSize(2.8),
    marginRight: metrics.spacing.smMd,
  },
  cardLabel: {
    ...typography.bodyMedium,
    fontFamily: fonts.dmSansMedium,
    color: c.textSecondary,
  },
  cardSubText: {
    fontSize: 10,
    fontFamily: fonts.dmSansRegular,
    marginTop: 1,
  },
  rankBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: metrics.spacing.sm,
  },
  rankText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: fonts.dmSansBold,
  },
  factBox: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginTop: metrics.spacing.xs,
  },
  factTag: {
    fontSize: 12,
    fontFamily: fonts.dmSansBold,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  comboPill: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  comboPillText: {
    fontSize: 10,
    fontFamily: fonts.dmSansBold,
  },
  factText: {
    fontSize: 13,
    color: c.text,
    lineHeight: 20,
    fontFamily: fonts.dmSansRegular,
    marginBottom: 12,
  },
  factSource: {
    fontSize: 9.5,
    color: c.textHint,
    fontStyle: 'italic',
    lineHeight: 14,
  },
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
  lockBtn: {
    alignItems: 'center',
    paddingVertical: metrics.spacing.smMd,
  },
  lockBtnText: {
    fontSize: 12,
    color: c.textHint || '#9CA3AF',
    fontFamily: fonts.dmSansBold,
  },
});
