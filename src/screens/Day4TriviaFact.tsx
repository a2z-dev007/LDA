import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, PanResponder,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { ProgressStrip } from '../components/common/ProgressStrip';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { useAppColors } from '../theme';
import { triviaFacts } from '../data/quizData';
import { personalityTypes } from '../data/personalityTypes';
import { useDayStore } from '../store/useDayStore';
import { haptics } from '../utils/haptics';

type Nav = StackNavigationProp<RootStackParamList, 'Day4TriviaFact'>;

export const Day4TriviaFact: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const day1 = useDayStore((s) => s.day1);

  const personalityKey = day1.personalityType ?? 'steady_flame';
  const fact = triviaFacts[personalityKey] ?? triviaFacts['steady_flame'];
  const personality = personalityTypes.find((p) => p.id === personalityKey);

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    haptics.light();
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, friction: 8, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.navigate('Day4DropBox');
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gs) => gs.dy < -20,
    onPanResponderRelease: (_, gs) => {
      if (gs.dy < -40) navigation.navigate('Day4DropBox');
    },
  });

  return (
    <ScreenWrapper {...panResponder.panHandlers}>
      <ProgressStrip currentDay={4} />
      <Animated.View style={[styles.body, { opacity, transform: [{ translateY }] }]}>
        <Text style={styles.eyebrow}>Psychology Fact</Text>
        {personality && (
          <View style={[styles.typePill, { borderColor: personality.color }]}>
            <Text style={[styles.typePillText, { color: personality.color }]}>{personality.name}</Text>
          </View>
        )}
        <Text style={styles.fact}>"{fact}"</Text>
        <Text style={styles.swipeHint}>swipe up to continue</Text>
      </Animated.View>
    </ScreenWrapper>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  body: { flex: 1, paddingHorizontal: 32, justifyContent: 'center', alignItems: 'center' },
  eyebrow: {
    color: c.textHint, fontSize: 12, fontFamily: 'Inter-SemiBold',
    letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20,
  },
  typePill: {
    borderWidth: 1.5, borderRadius: 100, paddingHorizontal: 16, paddingVertical: 6, marginBottom: 32,
  },
  typePillText: { fontSize: 13, fontFamily: 'Inter-SemiBold' },
  fact: {
    fontSize: 20, color: c.textSecondary, fontFamily: 'PlayfairDisplay-Italic',
    lineHeight: 32, textAlign: 'center',
  },
  swipeHint: {
    color: c.textHint, fontSize: 12, fontFamily: 'Inter-Regular',
    marginTop: 48, letterSpacing: 1,
  },
});
