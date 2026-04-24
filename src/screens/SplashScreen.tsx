import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';
import { useUserStore } from '../store/useUserStore';

type Nav = StackNavigationProp<RootStackParamList, 'Splash'>;

export const SplashScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const onboardingComplete = useUserStore((s) => s.onboardingComplete);

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      if (onboardingComplete) {
        navigation.replace('Home');
      } else {
        navigation.replace('Commitment');
      }
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <Animated.View style={{ opacity, transform: [{ scale }], alignItems: 'center' }}>
        {/* Heart / logo mark */}
        <Text style={styles.logo}>♡</Text>
        <Text style={styles.title}>Let's Date Again</Text>
        <Text style={styles.sub}>a ritual for two</Text>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 56,
    color: colors.primary,
    marginBottom: 16,
  },
  title: {
    fontSize: 34,
    color: '#FFFFFF',
    fontFamily: 'PlayfairDisplay-Bold',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  sub: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.45)',
    fontFamily: 'Inter-Regular',
    marginTop: 10,
    letterSpacing: 2,
    textTransform: 'lowercase',
  },
});
