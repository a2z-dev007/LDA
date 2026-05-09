import React, { useState, useRef, useEffect } from 'react';
import { DayHeader } from '../components/common/DayHeader';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, Animated, ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { useAppColors } from '../theme';
import { typography } from '../theme/typography';
import { metrics } from '../theme/metrics';
import { useUserStore } from '../store/useUserStore';
import {
  UserIcon,
  ShieldIcon,
  HeartIcon,
  SparkleIcon,
} from '../components/icons/NameKeeperIcons';
import { GradientButton } from '../components/common/GradientButton';
import { IMAGE } from '../assets/image/bg-images';

type Nav = StackNavigationProp<RootStackParamList, 'NameKeeper'>;

export const NameKeeperScreen: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const setName = useUserStore((s) => s.setName);
  const setOnboardingComplete = useUserStore((s) => s.setOnboardingComplete);

  const [userName, setUserNameInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  const shake = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for decorative elements
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
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
    <ImageBackground
      source={IMAGE.greenBg}
      style={styles.gradient}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
        <KeyboardAvoidingView style={styles.inner} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Animated.View 
            style={[
              styles.container, 
              { 
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ]
              }
            ]}
          >
            {/* Decorative floating elements */}
            <View style={styles.decorativeContainer}>
              <Animated.View 
                style={[
                  styles.floatingIcon,
                  styles.floatingIcon1,
                  { transform: [{ scale: pulseAnim }] }
                ]}
              >
                <HeartIcon size={24} color={colors.primary} />
              </Animated.View>
              <Animated.View 
                style={[
                  styles.floatingIcon,
                  styles.floatingIcon2,
                  { 
                    transform: [{ 
                      scale: pulseAnim.interpolate({
                        inputRange: [1, 1.1],
                        outputRange: [1, 1.15]
                      })
                    }] 
                  }
                ]}
              >
                <SparkleIcon size={20} color={colors.primary} />
              </Animated.View>
            </View>

            <View style={styles.content}>
              {/* Hero section with large icon */}
              <View style={styles.heroSection}>
                <View style={styles.heroIconContainer}>
                  <View style={styles.heroIconInner}>
                    <UserIcon size={52} color={colors.primary} />
                  </View>
                  {/* Glow effect */}
                  <View style={[styles.heroIconGlow, { backgroundColor: colors.primary }]} />
                </View>

                <DayHeader eyebrow="ONE LAST THING" />

                <Text style={styles.title}>
                  What should we{'\n'}call you?
                </Text>

                <Text style={styles.subtitle}>
                  Just your first name.{'\n'}That's all we'll ever ask.
                </Text>
              </View>

              {/* Input section */}
              <View style={styles.inputSection}>
                <Animated.View 
                  style={[
                    styles.inputCard,
                    isFocused && styles.inputCardFocused,
                    { transform: [{ translateX: shake }] }
                  ]}
                >
                  <View style={styles.inputIconWrapper}>
                    <UserIcon size={24} color={colors.primary} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Your name here..."
                    placeholderTextColor={colors.textHint}
                    value={userName}
                    onChangeText={setUserNameInput}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    autoFocus
                    returnKeyType="done"
                    onSubmitEditing={handleContinue}
                    maxLength={30}
                  />
                  {userName.length > 0 && (
                    <View style={styles.inputCheckmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </Animated.View>

                {/* Privacy note */}
                <View style={styles.privacyCard}>
                  <View style={styles.privacyIconWrapper}>
                    <ShieldIcon size={18} color="#96C7B3" />
                  </View>
                  <Text style={styles.privacyText}>
                    <Text style={styles.privacyTextBold}>Private & secure.</Text>
                    {' '}Your name stays on your device only.
                  </Text>
                </View>
              </View>
            </View>

            {/* Footer with button */}
            <View style={styles.footer}>
              <GradientButton
                text="Continue to Day 1"
                onPress={handleContinue}
                disabled={!userName.trim()}
                showArrow={true}
                fullWidth={true}
              />

              {/* Progress indicator */}
              <View style={styles.progressContainer}>
                <View style={styles.progressDots}>
                  <View style={[styles.dot, styles.dotComplete]} />
                  <View style={[styles.dot, styles.dotComplete]} />
                  <View style={[styles.dot, styles.dotActive]} />
                </View>
                <Text style={styles.progressText}>Step 3 of 3</Text>
              </View>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
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
    paddingHorizontal: metrics.layout.screenPaddingHz,
    justifyContent: 'space-between',
    paddingTop: metrics.spacing.xl,
    paddingBottom: metrics.spacing.md,
  },
  
  // Decorative elements
  decorativeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    zIndex: 0,
  },
  floatingIcon: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(45, 95, 93, 0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(45, 95, 93, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingIcon1: {
    top: 50,
    right: 25,
  },
  floatingIcon2: {
    top: 140,
    left: 15,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    zIndex: 1,
  },

  // Hero section
  heroSection: {
    alignItems: 'center',
    marginBottom: metrics.spacing.xxl,
  },
  heroIconContainer: {
    position: 'relative',
    marginBottom: metrics.spacing.lg,
  },
  heroIconInner: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 2.5,
    borderColor: 'rgba(45, 95, 93, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    // shadowColor: c.primary,
    // shadowOffset: { width: 0, height: 8 },
    // shadowOpacity: 0.2,
    // shadowRadius: 20,
    // elevation: 8,Shahh
  },
  heroIconGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.15,
    top: -8,
    left: -8,
    zIndex: 1,
  },
  title: {
    ...typography.displayLarge,
    color: c.text,
    textAlign: 'center',
    marginBottom: metrics.spacing.smMd,
  },
  subtitle: {
    ...typography.bodyMedium,
    color: c.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },

  // Input section
  inputSection: {
    gap: metrics.spacing.md,
  },
  inputCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: metrics.radius.xl,
    borderWidth: 2,
    borderColor: 'rgba(45, 95, 93, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: metrics.spacing.md,
    paddingVertical: metrics.spacing.xs,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  inputCardFocused: {
    borderColor: c.primary,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: c.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  inputIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(45, 95, 93, 0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(45, 95, 93, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: metrics.spacing.smMd,
  },
  input: {
    ...typography.bodyLarge,
    flex: 1,
    color: c.text,
    paddingVertical: metrics.spacing.md,
  },
  inputCheckmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: c.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  // Privacy card
  privacyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: metrics.radius.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(45, 95, 93, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: metrics.spacing.md,
    gap: metrics.spacing.smMd,
  },
  privacyIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(45, 95, 93, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(45, 95, 93, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  privacyText: {
    ...typography.bodySmall,
    flex: 1,
    color: c.textSecondary,
    lineHeight: 20,
  },
  privacyTextBold: {
    fontFamily: 'DMSans-Bold',
    fontWeight: '700',
    color: c.primary,
  },

  // Footer
  footer: {
    gap: metrics.spacing.md,
    zIndex: 1,
  },

  // Progress
  progressContainer: {
    alignItems: 'center',
    gap: metrics.spacing.sm,
  },
  progressDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotComplete: {
    backgroundColor: 'rgba(45, 95, 93, 0.3)',
  },
  dotActive: {
    backgroundColor: c.primary,
    width: 24,
    borderRadius: 4,
  },
  progressText: {
    ...typography.caption,
    color: c.textHint,
  },
});
