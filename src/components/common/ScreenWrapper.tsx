import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme';

interface Props {
  children: React.ReactNode;
  backgroundColor?: string;
  style?: ViewStyle;
}

export const ScreenWrapper: React.FC<Props> = ({
  children,
  backgroundColor = colors.dark,
  style,
}) => (
  <SafeAreaView 
    style={[styles.root, { backgroundColor }, style]} 
    edges={['top', 'bottom', 'left', 'right']}
  >
    {children}
  </SafeAreaView>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});