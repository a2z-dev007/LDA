import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { useAppColors } from '../theme';
import { useUserStore } from '../store/useUserStore';
import { SlideToBeginButton } from '../components/common/SlideToBeginButton';
import { IMAGE } from '../assets/image/bg-images';

type Nav = StackNavigationProp<RootStackParamList, 'Splash'>;

export const SplashScreen: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
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
    <ImageBackground 
      source={IMAGE.lavenderBg} 
      style={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={10}
    >
      <SafeAreaView style={styles.root} edges={['bottom']}>
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <Animated.View style={[styles.logoClip, { transform: [{ scale: pulseAnim }] }]}>
              <Animated.Image
                source={require('../assets/image/logo-transparent.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
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
            <SlideToBeginButton
              text="Slide to Begin"
              onSlideComplete={handleBegin}
            />

            <Text style={styles.footer}>NO SIGNUP. NO DATA. JUST YOU.</Text>
          </View>
        </Animated.View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  backgroundImage: {
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
    paddingBottom: 40,
  },
  // Clip container — cuts off the bottom shadow baked into the PNG
  logoClip: {
    width: 220,
    height: 200,          // intentionally less than image height — clips bottom shadow
    overflow: 'hidden',
    alignItems: 'center',
  },
  logoImage: {
    width: 220,
    height: 220,
    marginTop: 0,
  },
  title: {
    fontSize: 15,
    color: c.primary,
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
    backgroundColor: c.glassLight,
    borderRadius: 24,
    padding: 32,
    marginBottom: 56,
    borderWidth: 1,
    borderColor: c.glassBorder,
  },
  factLabel: {
    fontSize: 11,
    color: c.primary,
    fontFamily: 'DMSans-Bold',
    fontWeight: '700',
    letterSpacing: 1.8,
    marginBottom: 16,
  },
  factText: {
    fontSize: 16,
    color: c.text,
    fontFamily: 'DMSans-Regular',
    fontWeight: '400',
    lineHeight: 26,
  },
  quoteContainer: {
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  quote: {
    fontSize: 26,
    color: c.text,
    fontFamily: 'PlayfairDisplay-Italic',
    fontStyle: 'italic',
    lineHeight: 38,
    textAlign: 'center',
  },
  // Button Section
  buttonSection: {
    paddingTop: 10,
  },
  footer: {
    color: c.textSubtle,
    fontSize: 10,
    fontFamily: 'DMSans-Regular',
    fontWeight: '400',
    letterSpacing: 2.2,
    textAlign: 'center',
    marginTop: 24,
  },
});
