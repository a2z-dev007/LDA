import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';
import { useUserStore } from '../store/useUserStore';

type Nav = StackNavigationProp<RootStackParamList, 'NameKeeper'>;

export const NameKeeperScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const setName = useUserStore((s) => s.setName);
  const setOnboardingComplete = useUserStore((s) => s.setOnboardingComplete);

  const [userName, setUserNameInput] = useState('');
  const shake = useRef(new Animated.Value(0)).current;

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
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={styles.inner} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.content}>
          <Text style={styles.eyebrow}>Before we begin</Text>
          <Text style={styles.title}>What's your name?</Text>
          <Text style={styles.subtitle}>
            Your name stays only on your phone.{'\n'}Private. Always.
          </Text>

          <Animated.View style={[styles.inputWrapper, { transform: [{ translateX: shake }] }]}>
            <TextInput
              style={styles.input}
              placeholder="Your name…"
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={userName}
              onChangeText={setUserNameInput}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleContinue}
              maxLength={30}
            />
          </Animated.View>

          <Text style={styles.hint}>This is the name that will appear in your rituals.</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, !userName.trim() && styles.buttonDim]}
          activeOpacity={0.85}
          onPress={handleContinue}
        >
          <Text style={styles.buttonLabel}>Begin the ritual →</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.dark,
  },
inner: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  title: {
    fontSize: 30,
    color: '#FFFFFF',
    fontFamily: 'PlayfairDisplay-Bold',
    lineHeight: 40,
    marginBottom: 14,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.45)',
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
    marginBottom: 40,
  },
  inputWrapper: {
    borderBottomWidth: 1.5,
    borderBottomColor: colors.primary,
    marginBottom: 16,
  },
  input: {
    fontSize: 26,
    color: '#FFFFFF',
    fontFamily: 'PlayfairDisplay-Regular',
    paddingVertical: 12,
  },
  hint: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 100,
    alignItems: 'center',
  },
  buttonDim: {
    backgroundColor: '#6B3D55',
  },
  buttonLabel: {
    color: '#FFFFFF',
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
    letterSpacing: 0.3,
  },
});
