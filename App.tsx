import React from 'react';
import { StatusBar, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ThemeProvider, useAppColors } from './src/theme';

function AppContent() {
  // useAppColors() re-renders this component — and therefore the
  // StatusBar + NavigationContainer background — whenever the
  // system switches light ↔ dark.
  const colors = useAppColors();

  return (
    <View style={{ flex: 1, backgroundColor: colors.dark }}>
      <StatusBar
        barStyle={colors.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.dark}
        translucent={false}
      />
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      {/* ThemeProvider listens to Appearance and pushes live colors
          down to every useAppColors() call in the tree */}
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
