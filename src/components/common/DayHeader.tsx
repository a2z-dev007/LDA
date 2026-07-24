import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { useAppColors } from '../../theme';
import { metrics } from '../../theme/metrics';
import { typography } from '../../theme/typography';

interface DayHeaderProps {
  eyebrow: string;
  onAction?: () => void;
}

export const DayHeader: React.FC<DayHeaderProps> = ({ eyebrow, onAction }) => {
  const colors = useAppColors();
  const styles = makeStyles(colors);

  return (
    <View style={styles.topRow}>
      <View style={styles.eyebrowPill}>
        {/* <Sparkles size={metrics.iconSize.xs} color={colors.primary} strokeWidth={2} /> */}
        <Text >✨</Text>
        <Text style={styles.eyebrow}>{eyebrow.toUpperCase()}</Text>
      </View>
      {onAction ? (
        <TouchableOpacity style={styles.sparkleCircle} onPress={onAction} activeOpacity={0.7}>
          <Sparkles size={metrics.iconSize.sm} color={colors.primary} strokeWidth={1.5} />
        </TouchableOpacity>
      ) : (
        <View style={styles.sparkleCircle}>
          {/* <Sparkles size={metrics.iconSize.sm} color={colors.primary} strokeWidth={1.5} /> */}
          <Text style={{ fontSize: responsiveFontSize(2) }}>✨</Text>
        </View>
      )}
    </View>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: metrics.spacing.md,
  },
  eyebrowPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: metrics.radius.full,
    paddingHorizontal: metrics.spacing.smMd,
    paddingVertical: metrics.spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(45,95,93,0.15)',
  },
  eyebrow: {
    ...typography.captionSmall,
    color: c.primary,
    letterSpacing: 1.5,
  },
  sparkleCircle: {
    width: responsiveWidth(11),
    height: responsiveWidth(11),
    borderRadius: responsiveWidth(5.5),
    // backgroundColor: 'rgba(255,255,255,0.8)',
    // borderWidth: 1,
    // borderColor: 'rgba(45,95,93,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
