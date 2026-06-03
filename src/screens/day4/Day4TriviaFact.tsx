import React, { useEffect, useRef } from 'react';
import { DayHeader } from '../../components/common/DayHeader';
import {
  View, Text, StyleSheet, Animated, PanResponder,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { ProgressStrip } from '../../components/common/ProgressStrip';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { useAppColors } from '../../theme';
import { triviaFacts } from '../../data/quizData';
import { personalityTypes } from '../../data/personalityTypes';
import { useDayStore } from '../../store/useDayStore';
import { haptics } from '../../utils/haptics';
import { metrics } from '../../theme/metrics';
import { fonts, typography } from '../../theme/typography';
import { responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';

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

  const navigateNext = () => {
    haptics.medium();
    navigation.navigate('Day4Complete');
  };

  useEffect(() => {
    haptics.light();
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, friction: 8, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      navigateNext();
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gs) => gs.dy < -20,
    onPanResponderRelease: (_, gs) => {
      if (gs.dy < -40) navigateNext();
    },
  });

  return (
    <ScreenWrapper {...panResponder.panHandlers}>
      <ProgressStrip currentDay={4} />
      
      <Animated.View style={[styles.body, { opacity, transform: [{ translateY }] }]}>
        {/* Flame/Type Circle */}
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarEmoji}>🔥</Text>
        </View>

        {personality && (
          <Text style={styles.eyebrow}>
            {personality.name.toUpperCase()}
          </Text>
        )}

        {/* Card Component matching wireframe */}
        <View style={styles.factCard}>
          <Text style={styles.factText}>"{fact}"</Text>
          <View style={styles.divider} />
          <Text style={styles.factMeta}>
            Based on relationship psychology research · Personalised to your type
          </Text>
        </View>

        {/* Swipe up hint */}
        <Text style={styles.swipeHint}>Swipe up to dismiss · No CTA needed</Text>
        
        {/* Bottom indicator decoration bar */}
        <View style={styles.bottomBar} />
      </Animated.View>
    </ScreenWrapper>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: metrics.layout.screenPaddingHz,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF1E6',
    borderWidth: 1.5,
    borderColor: 'rgba(217, 119, 6, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarEmoji: {
    fontSize: 26,
  },
  eyebrow: {
    fontSize: 11,
    fontFamily: fonts.dmSansBold,
    color: '#D97706',
    letterSpacing: 1.5,
    marginBottom: 24,
  },
  factCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.04)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 3,
    width: '100%',
    gap: 16,
  },
  factText: {
    fontSize: 18,
    color: c.text,
    fontFamily: 'PlayfairDisplay-Italic',
    lineHeight: 28,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
    width: '60%',
    alignSelf: 'center',
  },
  factMeta: {
    fontSize: 11,
    fontFamily: fonts.dmSansRegular,
    color: c.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  swipeHint: {
    color: c.textHint,
    fontSize: 11,
    fontFamily: fonts.dmSansMedium,
    marginTop: 48,
    letterSpacing: 0.8,
  },
  bottomBar: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.08)',
    marginTop: 16,
  },
});
