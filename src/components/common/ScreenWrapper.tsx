import React from 'react';
import { StyleSheet, View, ViewStyle, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppColors } from '../../theme';
import { IMAGE } from '../../assets/image/bg-images';

interface Props {
  children: React.ReactNode;
  backgroundColor?: string;
  style?: ViewStyle;
  [key: string]: any;
  blurValue?: number;
  source?: any;
}

/**
 * ScreenWrapper
 * ─────────────
 * Green background image for every screen.
 */
export const ScreenWrapper: React.FC<Props> = ({
  children,
  backgroundColor,
  style,
  blurValue = 2,
  source = IMAGE.greenBg3,
  ...rest
}) => {
  const colors = useAppColors();
  return (
    <ImageBackground
      source={source}
      style={styles.gradient}
      resizeMode="cover"
      blurRadius={blurValue}
    >
      <SafeAreaView
        style={[styles.root, style]}
        edges={['top', 'bottom', 'left', 'right']}
        {...rest}
      >
        {children}
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
