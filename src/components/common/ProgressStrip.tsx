import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../theme';

const DAY_COLORS = [
  colors.day1,
  colors.day2,
  colors.day3,
  colors.day4,
  colors.day5,
];

interface Props {
  currentDay: number; // 1–5
  totalDays?: number;
}

export const ProgressStrip: React.FC<Props> = ({ currentDay, totalDays = 5 }) => (
  <View style={styles.container}>
    {Array.from({ length: totalDays }, (_, i) => {
      const day = i + 1;
      const isCompleted = day < currentDay;
      const isActive = day === currentDay;
      return (
        <View
          key={day}
          style={[
            styles.segment,
            { marginRight: i < totalDays - 1 ? 4 : 0 },
            isCompleted && { backgroundColor: DAY_COLORS[i], opacity: 1 },
            isActive && { backgroundColor: DAY_COLORS[i], opacity: 1 },
            !isCompleted && !isActive && styles.inactive,
          ]}
        />
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  segment: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
  inactive: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
});
