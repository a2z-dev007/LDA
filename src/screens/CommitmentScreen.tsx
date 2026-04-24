import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';

const { width } = Dimensions.get('window');
type Nav = StackNavigationProp<RootStackParamList, 'Commitment'>;

const lines = [
  "This isn't a quiz.",
  "It's not a test.",
  "It's 5 minutes a day",
  "to remember why you chose them.",
];

export const CommitmentScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const anims = lines.map(() => useRef(new Animated.Value(0)).current);
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const sequence = anims.map((anim, i) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 700,
        delay: i * 600,
        useNativeDriver: true,
      })
    );

    Animated.sequence([
      Animated.stagger(600, sequence),
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <View style={styles.accentBar} />
        {lines.map((line, i) => (
          <Animated.Text key={i} style={[styles.line, { opacity: anims[i] }]}>
            {line}
          </Animated.Text>
        ))}
      </View>

      <Animated.View style={[styles.footer, { opacity: buttonOpacity }]}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('NameKeeper')}
        >
          <Text style={styles.buttonLabel}>I'm ready</Text>
        </TouchableOpacity>
        <Text style={styles.footerNote}>No account. No judgment. Just you.</Text>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.dark,
    paddingHorizontal: 32,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  accentBar: {
    width: 40,
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
    marginBottom: 32,
  },
  line: {
    fontSize: 26,
    color: '#FFFFFF',
    fontFamily: 'PlayfairDisplay-Regular',
    lineHeight: 38,
    marginBottom: 6,
  },
  footer: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 56,
    borderRadius: 100,
    marginBottom: 16,
  },
  buttonLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    letterSpacing: 0.3,
  },
  footerNote: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    letterSpacing: 0.5,
  },
});
