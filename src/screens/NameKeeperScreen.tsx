import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { useAppColors } from '../theme';
import { useUserStore } from '../store/useUserStore';

type Nav = StackNavigationProp<RootStackParamList, 'NameKeeper'>;

export const NameKeeperScreen: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const setName = useUserStore((s) => s.setName);
  const setOnboardingComplete = useUserStore((s) => s.setOnboardingComplete);

  const [userName, setUserNameInput] = useState('');
  const shake = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shake, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleContinue = () => {
    if (!userName.trim()) {
      triggerShake();
      return;
    }
    setName(userName.trim());
    setOnboardingComplete(true);
    navigation.replace('Home');
  };

  return (
    <LinearGradient
      colors={[colors.light, '#FFFFFF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
        <KeyboardAvoidingView style={styles.inner} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <View style={styles.content}>
              <Text style={styles.eyebrow}>One last thing</Text>

              <Text style={styles.title}>What should we call you?</Text>

              <Text style={styles.subtitle}>
                Just your first name. That's all we'll ever ask.
              </Text>

              <Animated.View style={[styles.inputWrapper, { transform: [{ translateX: shake }] }]}>
                <TextInput
                  style={styles.input}
                  placeholder="Your name here..."
                  placeholderTextColor="rgba(45, 27, 105, 0.3)"
                  value={userName}
                  onChangeText={setUserNameInput}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleContinue}
                  maxLength={30}
                />
              </Animated.View>

              <View style={styles.privacyNote}>
                <Text style={styles.privacyText}>
                  We don't create accounts. Your name stays on your device only.
                </Text>
              </View>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.button, !userName.trim() && styles.buttonDisabled]}
                activeOpacity={0.85}
                onPress={handleContinue}
              >
                <Text style={styles.buttonText}>That's me → Start Day 1</Text>
              </TouchableOpacity>

              {/* Progress dots */}
              <View style={styles.progressDots}>
                <View style={[styles.dot, styles.dotInactive]} />
                <View style={[styles.dot, styles.dotInactive]} />
                <View style={[styles.dot, styles.dotActive]} />
              </View>

              <Text style={styles.footerNote}>no right answer - only your truth</Text>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  gradient: {
    flex: 1,
  },
  root: {
    flex: 1,
  },
  inner: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  eyebrow: {
    color: c.primary,
    fontSize: 11,
    fontFamily: 'DMSans-Medium',
    fontWeight: '500',
    letterSpacing: 1.5,
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    color: c.textDark,
    fontFamily: 'PlayfairDisplay-Italic',
    fontWeight: '400',
    fontStyle: 'italic',
    lineHeight: 46,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(45, 27, 105, 0.6)',
    fontFamily: 'DMSans-Regular',
    fontWeight: '400',
    lineHeight: 24,
    marginBottom: 40,
  },
  inputWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 4,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 157, 0.2)',
  },
  input: {
    fontSize: 18,
    color: c.textDark,
    fontFamily: 'DMSans-Regular',
    fontWeight: '400',
    paddingVertical: 16,
  },
  privacyNote: {
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 157, 0.2)',
  },
  privacyText: {
    color: c.primary,
    fontSize: 13,
    fontFamily: 'DMSans-Regular',
    fontWeight: '400',
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: c.primary,
    paddingVertical: 18,
    borderRadius: 100,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    shadowColor: c.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: 'rgba(255, 107, 157, 0.3)',
    shadowOpacity: 0,
  },
  buttonText: {
    color: c.text,
    fontSize: 17,
    fontFamily: 'DMSans-Medium',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  progressDots: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dotInactive: {
    backgroundColor: 'rgba(45, 27, 105, 0.2)',
  },
  dotActive: {
    backgroundColor: c.primary,
  },
  footerNote: {
    color: 'rgba(45, 27, 105, 0.5)',
    fontSize: 12,
    fontFamily: 'DMSans-Regular',
    fontWeight: '400',
    fontStyle: 'italic',
  },
});
