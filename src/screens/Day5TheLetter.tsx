import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Animated, TouchableOpacity, ScrollView, Share,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { ProgressStrip } from '../components/common/ProgressStrip';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { useAppColors } from '../theme';
import { useDayStore } from '../store/useDayStore';
import { useUserStore } from '../store/useUserStore';
import { generateLetter } from '../services/letterGenerator';
import { haptics } from '../utils/haptics';

type Nav = StackNavigationProp<RootStackParamList, 'Day5TheLetter'>;

export const Day5TheLetter: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const day1 = useDayStore((s) => s.day1);
  const day4 = useDayStore((s) => s.day4);
  const completeDay5 = useDayStore((s) => s.completeDay5);
  const day5 = useDayStore((s) => s.day5);
  const userName = useUserStore((s) => s.name);

  const letter = generateLetter(
    userName,
    day1.sliderScore,
    day1.personalityType ?? 'steady_flame',
    day4.memoryContent
  );

  const letterOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const [buttonsVisible, setButtonsVisible] = useState(false);

  useEffect(() => {
    haptics.light();
    Animated.timing(letterOpacity, { toValue: 1, duration: 800, useNativeDriver: true }).start();

    // No buttons for 6 seconds per PRD
    const timer = setTimeout(() => {
      setButtonsVisible(true);
      Animated.timing(buttonOpacity, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    haptics.success();
    if (!day5.letterGenerated) {
      completeDay5({
        badgeName: day5.badgeName,
        badgeTier: day5.badgeTier,
        dedicationScore: day5.dedicationScore,
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

  return (
    <ScreenWrapper>
      <ProgressStrip currentDay={5} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>Day 5 · The Letter</Text>
        <Animated.View style={[styles.letterCard, { opacity: letterOpacity }]}>
          <Text style={styles.letterText}>{letter}</Text>
        </Animated.View>
      </ScrollView>

      {buttonsVisible && (
        <Animated.View style={[styles.actions, { opacity: buttonOpacity }]}>
        <TouchableOpacity style={styles.saveBtnTouch} activeOpacity={0.85} onPress={handleSave}>
          <LinearGradient colors={[colors.buttonGradientStart, colors.buttonGradientEnd]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.saveBtn}>
            <Text style={styles.saveBtnLabel}>Save this</Text>
          </LinearGradient>
        </TouchableOpacity>
          <TouchableOpacity style={styles.shareBtn} activeOpacity={0.85} onPress={handleShare}>
            <Text style={styles.shareBtnLabel}>Share this</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </ScreenWrapper>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  content: { padding: 28, paddingBottom: 16 },
  eyebrow: { color: c.day5, fontSize: 12, fontFamily: 'Inter-SemiBold', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 24 },
  letterCard: {
    backgroundColor: c.white, borderRadius: 16, padding: 24,
    borderWidth: 1, borderColor: `${c.day5}40`,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  letterText: { color: c.textSecondary, fontSize: 16, fontFamily: 'PlayfairDisplay-Regular', lineHeight: 28 },
  actions: { paddingHorizontal: 28, paddingBottom: 48, gap: 12 },
  saveBtnTouch: { borderRadius: 100, shadowColor: c.glowPrimary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8 },
  saveBtn: { paddingVertical: 18, borderRadius: 100, alignItems: 'center' },
  saveBtnLabel: { color: c.onPrimary, fontSize: 17, fontFamily: 'Inter-SemiBold', letterSpacing: 0.3 },
  shareBtn: {
    backgroundColor: c.white, paddingVertical: 16, borderRadius: 100,
    alignItems: 'center', borderWidth: 1, borderColor: c.surfaceBorder,
  },
  shareBtnLabel: { color: c.text, fontSize: 16, fontFamily: 'Inter-SemiBold' },
});
