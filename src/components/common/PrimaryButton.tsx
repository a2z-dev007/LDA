import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { useAppColors } from '../../theme';

interface Props {
  label: string;
  onPress: () => void;
  color?: string;
  textColor?: string;
  style?: ViewStyle;
  loading?: boolean;
  disabled?: boolean;
}

export const PrimaryButton: React.FC<Props> = ({
  label,
  onPress,
  color,
  textColor,
  style,
  loading = false,
  disabled = false,
}) => {
  const colors = useAppColors();
  const btnColor = color ?? colors.primary;
  const lblColor = textColor ?? colors.onPrimary;

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: btnColor }, style, disabled && styles.disabled]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={lblColor} />
      ) : (
        <Text style={[styles.label, { color: lblColor }]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  label: {
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
    letterSpacing: 0.3,
  },
  disabled: {
    opacity: 0.5,
  },
});
