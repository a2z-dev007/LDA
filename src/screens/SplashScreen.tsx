import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { useUserStore } from '../store/useUserStore';

type Nav = StackNavigationProp<RootStackParamList, 'Splash'>;

export const SplashScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const onboardingComplete = useUserStore((s) => s.onboardingComplete);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Pulse animation for logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
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

  const handleBegin = () => {
    if (onboardingComplete) {
      navigation.replace('Home');
    } else {
      navigation.replace('Commitment');
    }
  };

  return (
    <LinearGradient
      colors={['#1A0B2E', '#2D1B4E', '#1A0B2E']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.root} edges={['bottom']}>
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <Animated.View
              style={[
                styles.logoContainer,
                { transform: [{ scale: pulseAnim }] }
              ]}
            >
              <View style={styles.logoOuterRing}>
                <View style={styles.logoMiddleRing}>
                  <View style={styles.logoInnerCircle} />
                </View>
              </View>
            </Animated.View>
            <Text style={styles.title}>LET'S DATE AGAIN</Text>
          </View>

          {/* Content Section */}
          <View style={styles.contentSection}>
            <View style={styles.factCard}>
              <Text style={styles.factLabel}>DID YOU KNOW?</Text>
              <Text style={styles.factText}>
                Couples who laugh together daily report{'\n'}40% higher relationship satisfaction
              </Text>
            </View>

            <View style={styles.quoteContainer}>
              <Text style={styles.quote}>
                "A daily practice for the{'\n'}relationship you want to{'\n'}keep."
              </Text>
            </View>
          </View>

          {/* Button Section */}
          <View style={styles.buttonSection}>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.85}
              onPress={handleBegin}
            >
              <Text style={styles.buttonText}>Begin</Text>
              <Text style={styles.buttonIcon}>›</Text>
            </TouchableOpacity>

            <Text style={styles.footer}>NO SIGNUP. NO DATA. JUST YOU.</Text>
          </View>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 28,
  },
  // Logo Section
  logoSection: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 50,
  },
  logoContainer: {
    marginBottom: 28,
  },
  logoOuterRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(219, 112, 147, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoMiddleRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(219, 112, 147, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoInnerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DB7093',
  },
  title: {
    fontSize: 15,
    color: '#DB7093',
    fontFamily: 'DMSans-Medium',
    fontWeight: '500',
    letterSpacing: 3.5,
  },
  // Content Section
  contentSection: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  factCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 24,
    padding: 32,
    marginBottom: 48,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  factLabel: {
    fontSize: 11,
    color: '#DB7093',
    fontFamily: 'DMSans-Bold',
    fontWeight: '700',
    letterSpacing: 1.8,
    marginBottom: 16,
  },
  factText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
    fontFamily: 'DMSans-Regular',
    fontWeight: '400',
    lineHeight: 26,
  },
  quoteContainer: {
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  quote: {
    fontSize: 22,
    color: 'rgba(255, 255, 255, 0.95)',
    fontFamily: 'PlayfairDisplay-Italic',
    fontStyle: 'italic',
    lineHeight: 32,
    textAlign: 'center',
  },
  // Button Section
  buttonSection: {
    paddingTop: 10,
  },
  button: {
    backgroundColor: '#DB7093',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#DB7093',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    flexDirection: 'row',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'DMSans-Bold',
    fontWeight: '700',
    letterSpacing: 0.8,
    marginRight: 8,
  },
  buttonIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'DMSans-Bold',
    fontWeight: '700',
  },
  footer: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 10,
    fontFamily: 'DMSans-Regular',
    fontWeight: '400',
    letterSpacing: 2.2,
    textAlign: 'center',
  },
});
