import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../../theme';

interface Props {
  streakCount: number;
  size?: number;
}

export const StreakRing: React.FC<Props> = ({ streakCount, size = 80 }) => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.15, friction: 4, tension: 100, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 4, tension: 100, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.ring, { width: size, height: size, borderRadius: size / 2, transform: [{ scale }] }]}>
      <Text style={styles.number}>{streakCount}</Text>
      <Text style={styles.label}>day{streakCount !== 1 ? 's' : ''}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  ring: {
    borderWidth: 3,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.primary}15`,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  number: {
    fontSize: 26,
    color: colors.primary,
    fontFamily: 'PlayfairDisplay-Bold',
    lineHeight: 30,
  },
  label: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    fontFamily: 'Inter-Regular',
  },
});
