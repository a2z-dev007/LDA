import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Sparkles } from 'lucide-react-native';
import {
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import { metrics } from '../../theme/metrics';
import { typography } from '../../theme/typography';

interface DayCTAProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

export const DayCTA: React.FC<DayCTAProps> = ({ title, onPress, disabled }) => {
  return (
    <View style={[styles.ctaWrapper, { paddingBottom: responsiveHeight(3) }]}>
      <TouchableOpacity
        style={[styles.ctaTouch, disabled && styles.ctaDim]}
        activeOpacity={0.88}
        onPress={onPress}
        disabled={disabled}
      >
        <LinearGradient
          colors={['#6EE87A', '#2DD4BF', '#1E90FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.cta}
        >
          <View style={styles.ctaLeft}>
            <Sparkles size={metrics.iconSize.sm} color="#FFFFFF" strokeWidth={2} />
          </View>
          <Text style={styles.ctaLabel}>{title}</Text>
          <Text style={styles.ctaArrow}>→</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  ctaWrapper: {
    paddingHorizontal: metrics.layout.screenPaddingHz,
  },
  ctaTouch: {
    borderRadius: metrics.radius.full,
    backgroundColor: '#1A9B7A',
    shadowColor: '#0D5C4A',
    shadowOffset: { width: 0, height: responsiveHeight(1.0) },
    shadowOpacity: 0.5,
    shadowRadius: responsiveWidth(5),
    elevation: 14,
  },
  ctaDim: {
    opacity: 0.5,
  },
  cta: {
    borderRadius: metrics.radius.full,
    paddingVertical: metrics.spacing.smMd,
    paddingHorizontal: metrics.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: metrics.button.height,
  },
  ctaLeft: {
    width: responsiveWidth(9),
    height: responsiveWidth(9),
    borderRadius: responsiveWidth(4.5),
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: metrics.spacing.smMd,
  },
  ctaLabel: {
    ...typography.buttonLarge,
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  ctaArrow: {
    ...typography.buttonLarge,
    color: '#FFFFFF',
  },
});
