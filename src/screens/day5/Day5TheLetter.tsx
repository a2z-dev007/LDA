import React, { useEffect, useRef, useState } from 'react';
import { DayHeader } from '../../components/common/DayHeader';
import {
  View, Text, StyleSheet, Animated, ScrollView, Share,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { ProgressStrip } from '../../components/common/ProgressStrip';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { useAppColors } from '../../theme';
import { useDayStore } from '../../store/useDayStore';
import { useStreakStore } from '../../store/useStreakStore';
import { useUserStore } from '../../store/useUserStore';
import { generateLetter } from '../../services/letterGenerator';
import { haptics } from '../../utils/haptics';
import { GradientButton } from '../../components/common/GradientButton';
import { Heart, Share2 } from 'lucide-react-native';

type Nav = StackNavigationProp<RootStackParamList, 'Day5TheLetter'>;

export const Day5TheLetter: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const day1 = useDayStore((s) => s.day1);
  const day3 = useDayStore((s) => s.day3);
  const day4 = useDayStore((s) => s.day4);
  const completeDay5 = useDayStore((s) => s.completeDay5);
  const recordActivity = useStreakStore((s) => s.recordActivity);
  const day5 = useDayStore((s) => s.day5);
  const userName = useUserStore((s) => s.name);

  const letter = generateLetter(
    userName,
    day1.sliderScore,
    day1.personalityType ?? 'steady_flame',
    day4.memoryContent,
    day3.oneCertainty
  );

  const letterOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const [buttonsVisible, setButtonsVisible] = useState(false);

  useEffect(() => {
    haptics.light();
    Animated.timing(letterOpacity, { toValue: 1, duration: 800, useNativeDriver: true }).start();

    // No buttons for 6 seconds per PRD to let the user read first
    const timer = setTimeout(() => {
      setButtonsVisible(true);
      Animated.timing(buttonOpacity, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    haptics.success();
    if (!day5.letterGenerated) {
      recordActivity();
      completeDay5({
        badgeName: day5.badgeName,
        badgeTier: day5.badgeTier,
        dedicationScore: day5.dedicationScore,
        connectionScore: day5.connectionScore,
        partnerKnowledgeScore: day5.partnerKnowledgeScore,
        promise: day5.promise,
        letterGenerated: true,
        averageScore: day5.averageScore,
      });
    }
    navigation.navigate('Day5PartnerInvite');
  };

  const handleShare = async () => {
    haptics.medium();
    try {
      await Share.share({ message: letter });
    } catch {}
  };

  // Split letter by double newlines to render beautifully as paragraphs
  const paragraphs = letter.split('\n\n');

  // Resolve gradients safely across different themes
  const primaryGradient = colors.gradientBtn || [colors.buttonGradientStart, colors.buttonGradientEnd];
  const secondaryGradient = colors.gradientBtn2 || (colors.isDark ? ['#3A4D6B', '#23314A'] : ['#8CB8D8', '#B8A8D8']);

  return (
    <ScreenWrapper>
      <ProgressStrip currentDay={5} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <DayHeader eyebrow="Day 5 · The Letter" />
        
        <Animated.View style={[styles.letterCard, { opacity: letterOpacity }]}>
          {/* Subtle Decorative Seal */}
          <View style={styles.sealContainer}>
            <View style={styles.sealLine} />
            <View style={styles.sealCircle}>
              <Heart size={15} color={colors.primary} fill={colors.primary} />
            </View>
          </View>

          {paragraphs.map((para, index) => {
            const isFirst = index === 0;
            const isLast = index === paragraphs.length - 1;

            if (isFirst) {
              return (
                <Text key={index} style={styles.letterSalutation}>
                  {para}
                </Text>
              );
            }
            if (isLast) {
              return (
                <View key={index} style={styles.signoffContainer}>
                  <Text style={styles.letterSignoff}>
                    {para}
                  </Text>
                </View>
              );
            }
            return (
              <Text key={index} style={styles.letterBodyParagraph}>
                {para}
              </Text>
            );
          })}
        </Animated.View>
        
        {/* Scroll spacer to prevent overlapping when buttons show */}
        {buttonsVisible && <View style={styles.bottomSpacer} />}
      </ScrollView>

      {buttonsVisible && (
        <Animated.View style={[styles.actions, { opacity: buttonOpacity }]}>
          <GradientButton
            text="Save this"
            onPress={handleSave}
            showArrow={false}
            gradientColors={primaryGradient}
            icon={<Heart size={18} color="#FFFFFF" fill="#FFFFFF" />}
            fullWidth
          />
          <GradientButton
            text="Share this"
            onPress={handleShare}
            showArrow={false}
            gradientColors={secondaryGradient}
            icon={<Share2 size={18} color="#FFFFFF" />}
            fullWidth
          />
        </Animated.View>
      )}
    </ScreenWrapper>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  content: { padding: 24, paddingBottom: 32 },
  letterCard: {
    backgroundColor: c.glassCardBg || 'rgba(255, 255, 255, 0.72)',
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 28,
    borderWidth: 1.5,
    borderColor: c.glassBorder || 'rgba(255, 255, 255, 0.3)',
    shadowColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
    marginTop: 8,
  },
  sealContainer: {
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
    justifyContent: 'center',
  },
  sealCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${c.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: `${c.primary}30`,
    zIndex: 2,
  },
  sealLine: {
    position: 'absolute',
    left: 12,
    right: 12,
    height: 1,
    backgroundColor: `${c.primary}15`,
    zIndex: 1,
  },
  letterSalutation: {
    fontSize: 19,
    fontFamily: 'PlayfairDisplay-Italic',
    color: c.text,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  letterBodyParagraph: {
    fontSize: 16.5,
    fontFamily: 'PlayfairDisplay-Regular',
    color: c.textSecondary,
    lineHeight: 28,
    marginBottom: 16,
  },
  signoffContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: `${c.primary}10`,
    paddingTop: 16,
    alignItems: 'flex-start',
  },
  letterSignoff: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay-Italic',
    color: c.text,
    fontStyle: 'italic',
    lineHeight: 28,
  },
  actions: {
    paddingHorizontal: 24,
    paddingBottom: 36,
    gap: 12,
  },
  bottomSpacer: {
    height: 140,
  },
});

