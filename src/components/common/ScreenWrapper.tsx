import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppColors } from '../../theme';

interface Props {
  children: React.ReactNode;
  backgroundColor?: string;
  style?: ViewStyle;
  [key: string]: any; // allow panHandlers spread
}

export const ScreenWrapper: React.FC<Props> = ({
  children,
  backgroundColor,
  style,
  ...rest
}) => {
  const colors = useAppColors();
  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: backgroundColor ?? colors.dark }, style]}
      edges={['top', 'bottom', 'left', 'right']}
      {...rest}
    >
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
