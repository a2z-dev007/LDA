import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute, StackActions } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { ProgressStrip } from '../components/common/ProgressStrip';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { useAppColors } from '../theme';
import { honestMomentCopy, resolveSegment } from '../data/quizData';
import { haptics } from '../utils/haptics';

type Nav = StackNavigationProp<RootStackParamList, 'Day1HonestMoment'>;
type RouteProps = StackScreenProps<RootStackParamList, 'Day1HonestMoment'>['route'];

export const Day1HonestMoment: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProps>();
  const { sliderScore } = route.params;

  const segment = resolveSegment(sliderScore);
  const rawCopy = honestMomentCopy[segment];
  const copy = rawCopy.replace('{score}', String(sliderScore));

  const numberOpacity = useRef(new Animated.Value(0)).current;
  const copyOpacity = useRef(new Animated.Value(0)).current;
  const ctaOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    haptics.medium();
    Animated.sequence([
      Animated.timing(numberOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(copyOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(ctaOpacity, { toValue: 1, duration: 400, delay: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <ScreenWrapper>
      <ProgressStrip currentDay={1} />
      <View style={styles.body}>
        {/* Large score — same position as slider, creates continuity */}
        <Animated.Text style={[styles.scoreNumber, { opacity: numberOpacity }]}>
          {sliderScore}
        </Animated.Text>

        <Animated.Text style={[styles.copy, { opacity: copyOpacity }]}>
          {copy}
        </Animated.Text>
      </View>

      <Animated.View style={{ opacity: ctaOpacity }}>
      <TouchableOpacity style={styles.ctaTouch} activeOpacity={0.85} onPress={() => { haptics.medium(); navigation.navigate('Day1Quiz', { sliderScore }); }}>
        <LinearGradient colors={[colors.buttonGradientStart, colors.buttonGradientEnd]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cta}>
          <Text style={styles.ctaLabel}>Take the Spark Quiz</Text>
          <Text style={styles.ctaSub}>7 questions · 90 seconds</Text>
        </LinearGradient>
      </TouchableOpacity>
      </Animated.View>
    </ScreenWrapper>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
  scoreNumber: {
    fontSize: 96,
    color: c.day1,
    fontFamily: 'PlayfairDisplay-Bold',
    lineHeight: 100,
    marginBottom: 32,
  },
  copy: {
    fontSize: 20,
    color: c.textSecondary,
    fontFamily: 'PlayfairDisplay-Italic',
    lineHeight: 32,
  },
  ctaTouch: {
    marginHorizontal: 32, marginBottom: 48, borderRadius: 100,
    shadowColor: c.glowPrimary, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4, shadowRadius: 16, elevation: 8,
  },
  cta: { paddingVertical: 18, borderRadius: 100, alignItems: 'center' },
  ctaLabel: { color: c.onPrimary, fontSize: 17, fontFamily: 'Inter-SemiBold', letterSpacing: 0.3 },
  ctaSub: { color: `${c.onPrimary}99`, fontSize: 12, fontFamily: 'Inter-Regular', marginTop: 3 },
});
