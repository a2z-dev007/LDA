import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, PanResponder,
  TouchableOpacity, Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { ProgressStrip } from '../components/common/ProgressStrip';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { useAppColors } from '../theme';
import { haptics } from '../utils/haptics';
import { useDayStore } from '../store/useDayStore';
import { resolveSegment } from '../data/quizData';

type Nav = StackNavigationProp<RootStackParamList, 'Day1Slider'>;
const { width } = Dimensions.get('window');
const TRACK_WIDTH = width - 64;

export const Day1ConnectionSlider: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const setDay1Slider = useDayStore((s) => s.setDay1Slider);
  const [score, setScore] = useState(5);
  const thumbX = useRef(new Animated.Value(((5 - 1) / 9) * TRACK_WIDTH)).current;

  const handleScoreChange = (newScore: number) => {
    if (newScore === score) return;
    setScore(newScore);
    Animated.spring(thumbX, {
      toValue: ((newScore - 1) / 9) * TRACK_WIDTH,
      friction: 8, tension: 120, useNativeDriver: false,
    }).start();
    haptics.light();
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gs) => {
      const rawX = gs.moveX - 32;
      const clamped = Math.max(0, Math.min(TRACK_WIDTH, rawX));
      const newScore = Math.round((clamped / TRACK_WIDTH) * 9) + 1;
      handleScoreChange(newScore);
    },
  });

  const handleNext = () => {
    haptics.medium();
    const segment = resolveSegment(score);
    setDay1Slider(score, segment);
    navigation.navigate('Day1HonestMoment', { sliderScore: score });
  };

  return (
    <ScreenWrapper>
      <ProgressStrip currentDay={1} />
      <View style={styles.body}>
        <Text style={styles.eyebrow}>Day 1 · The Spark Check</Text>
        <Text style={styles.question}>
          On a scale of 1–10, how connected do you feel to your partner right now?
        </Text>

        {/* Large animated score */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreNumber}>{score}</Text>
        </View>

        {/* Slider */}
        <View style={styles.trackWrapper} {...panResponder.panHandlers}>
          <View style={styles.track}>
            <Animated.View
              style={[styles.fill, {
                width: thumbX.interpolate({ inputRange: [0, TRACK_WIDTH], outputRange: [0, TRACK_WIDTH] }),
              }]}
            />
          </View>
          <Animated.View style={[styles.thumb, { left: thumbX }]} />
        </View>

        <View style={styles.scaleLabels}>
          <Text style={styles.scaleEnd}>1</Text>
          <Text style={styles.scaleEnd}>10</Text>
        </View>

        <Text style={styles.honesty}>no right answer · only your truth</Text>
      </View>

      <TouchableOpacity style={styles.cta} activeOpacity={0.85} onPress={handleNext}>
        <Text style={styles.ctaLabel}>That's my number</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  body: { flex: 1, paddingHorizontal: 32, justifyContent: 'center' },
  eyebrow: {
    color: c.day1, fontSize: 12, fontFamily: 'Inter-SemiBold',
    letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20,
  },
  question: {
    fontSize: 24, color: c.text, fontFamily: 'PlayfairDisplay-Bold',
    lineHeight: 34, marginBottom: 40,
  },
  scoreContainer: { alignItems: 'center', marginBottom: 48 },
  scoreNumber: {
    fontSize: 96, color: c.day1, fontFamily: 'PlayfairDisplay-Bold', lineHeight: 100,
  },
  trackWrapper: { height: 44, justifyContent: 'center' },
  track: {
    height: 4, backgroundColor: c.surface, borderRadius: 2, overflow: 'hidden',
  },
  fill: { height: '100%', backgroundColor: c.day1, borderRadius: 2 },
  thumb: {
    position: 'absolute', width: 28, height: 28, borderRadius: 14,
    backgroundColor: c.day1, top: 8, marginLeft: -14,
    shadowColor: c.day1, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, shadowRadius: 8, elevation: 6,
  },
  scaleLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  scaleEnd: { color: c.textHint, fontSize: 13, fontFamily: 'Inter-Regular' },
  honesty: {
    color: c.textHint, fontSize: 13, fontFamily: 'Inter-Regular',
    textAlign: 'center', marginTop: 32, letterSpacing: 1,
  },
  cta: {
    backgroundColor: c.day1, marginHorizontal: 32, marginBottom: 48,
    paddingVertical: 18, borderRadius: 100, alignItems: 'center',
  },
  ctaLabel: { color: c.dark, fontSize: 17, fontFamily: 'Inter-SemiBold', letterSpacing: 0.3 },
});
