import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAppColors } from '../../theme';

interface Props {
  currentDay: number; // 1–5
  totalDays?: number;
}

export const ProgressStrip: React.FC<Props> = ({ currentDay, totalDays = 5 }) => {
  const colors = useAppColors();

  return (
    <View style={styles.container}>
      {Array.from({ length: totalDays }, (_, i) => {
        const day = i + 1;
        const isCompleted = day < currentDay;
        const isActive = day === currentDay;

        if (isActive || isCompleted) {
          return (
            <LinearGradient
              key={day}
              colors={['#6EE87A', '#2DD4BF', '#1E90FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.segment, { marginRight: i < totalDays - 1 ? 4 : 0 }]}
            />
          );
        }

        return (
          <View
            key={day}
            style={[
              styles.segment,
              { marginRight: i < totalDays - 1 ? 4 : 0 },
              { backgroundColor: colors.surface },
            ]}
          />
        );
      })}
    </View>
  );
};

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
});
