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
  textColor = '#FFFFFF',
  style,
  loading = false,
  disabled = false,
}) => {
  const colors = useAppColors();
  const btnColor = color ?? colors.primary;

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: btnColor }, style, disabled && styles.disabled]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
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
