/**
 * IntroSliderScreen
 * ─────────────────
 * Premium full-screen image slides with glass morphism content overlay.
 * Full background image with gradient fade and white glass content cards.
 */

import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { useAppColors } from '../theme';
import { metrics } from '../theme/metrics';
import { useUserStore } from '../store/useUserStore';
import { AppColors } from '../theme/ThemeContext';
import { GradientButton } from '../components/common/GradientButton';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';

type Nav = StackNavigationProp<RootStackParamList, 'Intro'>;

const { width: W, height: H } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────
//  Onboarding images
// ─────────────────────────────────────────────────────────────
const SLIDE_IMAGES = [
  require('../assets/image/onboarding/slide-1.png'),
  require('../assets/image/onboarding/slide-2.png'),
  require('../assets/image/onboarding/slide-3.png'),
];

// ─────────────────────────────────────────────────────────────
//  Slide content
// ─────────────────────────────────────────────────────────────
const SLIDE_CONTENT = [
  {
    headline: 'Reignite the\nconnection.',
    body: 'A 5-day solo journey of honest moments, small rituals, and real reflection.',
  },
  {
    headline: 'Daily rituals\nthat actually work.',
    body: 'Mood check-ins, appreciation prompts, and questions that bring you closer.',
  },
  {
    headline: 'Discover your\nrelationship style.',
    body: 'Earn your connection badge and write a promise that lasts beyond 5 days.',
  },
];

// ─────────────────────────────────────────────────────────────
//  Theme-aware styles
// ─────────────────────────────────────────────────────────────
function makeStyles(c: AppColors) {
  return StyleSheet.create({
    page: {
      width: W,
      height: H,
    },
    backgroundImage: {
      width: W,
      height: H,
      justifyContent: 'space-between',
    },
    // Gradient overlay for readability
    imageOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    // Content container - middle section
    contentContainer: {
      paddingHorizontal: metrics.layout.screenPaddingHz,
      paddingTop: H * 0.55, // Push content to middle-bottom area
      flex: 1,
      justifyContent: 'flex-start',
    },
    // Headline
    headline: {
      fontSize: metrics.fontSize.h1 * 1.15,
      fontFamily: 'PlayfairDisplay-SemiBold',
      color: '#FFFFFF',
      lineHeight: metrics.fontSize.h1 * 1.45,
      marginBottom: metrics.spacing.md,
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 8,
    },
    // Glass card for body text
    bodyCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: metrics.radius.xl,
      paddingVertical: metrics.spacing.md,
      paddingHorizontal: metrics.spacing.md,
      marginTop: metrics.spacing.xs,
      borderWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.4)',
      borderLeftColor: 'rgba(255, 255, 255, 0.3)',
      borderBottomColor: 'rgba(255, 255, 255, 0.1)',
      borderRightColor: 'rgba(255, 255, 255, 0.1)',
    },
    body: {
      fontSize: metrics.fontSize.body,
      fontFamily: 'DMSans-Regular',
      color: '#FFFFFF',
      lineHeight: metrics.fontSize.body * 1.6,
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    // Bottom controls container
    bottomControls: {
      paddingHorizontal: metrics.layout.screenPaddingHz,
      paddingBottom: metrics.spacing.lg,
      paddingTop: metrics.spacing.md,
      gap: metrics.spacing.sm,
    },
    // Progress dots container
    dotsContainer: {
      alignItems: 'center',
      marginBottom: metrics.spacing.md,
      
    },
    dots: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: metrics.spacing.sm,
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      paddingHorizontal: metrics.spacing.md,
      paddingVertical: metrics.spacing.sm,
      borderRadius: metrics.radius.full,
      borderWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.3)',
      borderLeftColor: 'rgba(255, 255, 255, 0.2)',
      borderBottomColor: 'rgba(255, 255, 255, 0.1)',
      borderRightColor: 'rgba(255, 255, 255, 0.1)',
    },
    dot: {
      height: 6,
      borderRadius: 3,
    },
    // Button row
    btnRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: metrics.spacing.md,
    },
    skipBtn: {
      paddingVertical: metrics.spacing.smMd,
      paddingHorizontal: metrics.spacing.lg,
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      borderRadius: metrics.radius.full,
      borderWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.3)',
      borderLeftColor: 'rgba(255, 255, 255, 0.2)',
      borderBottomColor: 'rgba(255, 255, 255, 0.1)',
      borderRightColor: 'rgba(255, 255, 255, 0.1)',
    },
    skipText: {
      color: '#FFFFFF',
      fontSize: metrics.fontSize.body,
      fontFamily: 'DMSans-Medium',
      letterSpacing: 0.3,
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    nextBtnTouch: {
      // Width is animated
    },
    // Privacy text
    privacyContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: metrics.spacing.xs,
      marginTop:responsiveHeight(1)
    },
    privacyDot: {
      width: 3,
      height: 3,
      borderRadius: 1.5,
      backgroundColor: '#FFFFFF',
      opacity: 0.5,
    },
    privacy: {
      color: '#FFFFFF',
      fontSize:responsiveFontSize(1.6),
      fontFamily: 'DMSans-Medium',
      letterSpacing: 1.8,
      textAlign: 'center',
      opacity: 0.7,
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
  });
}

// ─────────────────────────────────────────────────────────────
//  Main screen
// ─────────────────────────────────────────────────────────────
export const IntroSliderScreen: React.FC = () => {
  const colors = useAppColors();
  const s = makeStyles(colors);

  const navigation = useNavigation<Nav>();
  const setIntroSeen = useUserStore((st) => st.setIntroSeen);

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const slideAnim = useRef(new Animated.Value(1)).current;
  const buttonWidthAnim = useRef(new Animated.Value(0)).current;
  
  // Individual animation values for staggered entrance
  const headlineOpacity = useRef(new Animated.Value(0)).current;
  const headlineTranslateY = useRef(new Animated.Value(30)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(40)).current;
  const controlsOpacity = useRef(new Animated.Value(0)).current;
  const controlsTranslateY = useRef(new Animated.Value(30)).current;

  const activateSlide = useCallback(
    (idx: number) => {
      // Reset all animations to start state
      headlineOpacity.setValue(0);
      headlineTranslateY.setValue(30);
      cardOpacity.setValue(0);
      cardTranslateY.setValue(40);
      controlsOpacity.setValue(0);
      controlsTranslateY.setValue(30);
      
      // Animate button width on last slide
      Animated.spring(buttonWidthAnim, {
        toValue: idx === SLIDE_CONTENT.length - 1 ? 1 : 0,
        useNativeDriver: false,
        tension: 100,
        friction: 12,
      }).start();
      
      // Staggered entrance animation sequence
      Animated.sequence([
        Animated.delay(100),
        Animated.parallel([
          // Headline entrance
          Animated.parallel([
            Animated.timing(headlineOpacity, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.spring(headlineTranslateY, {
              toValue: 0,
              tension: 80,
              friction: 10,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]).start();
      
      // Card entrance (delayed)
      Animated.sequence([
        Animated.delay(250),
        Animated.parallel([
          Animated.timing(cardOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.spring(cardTranslateY, {
            toValue: 0,
            tension: 80,
            friction: 10,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
      
      // Controls entrance (delayed)
      Animated.sequence([
        Animated.delay(400),
        Animated.parallel([
          Animated.timing(controlsOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.spring(controlsTranslateY, {
            toValue: 0,
            tension: 80,
            friction: 10,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    },
    [
      buttonWidthAnim,
      headlineOpacity,
      headlineTranslateY,
      cardOpacity,
      cardTranslateY,
      controlsOpacity,
      controlsTranslateY,
    ],
  );

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const idx = Math.round(e.nativeEvent.contentOffset.x / W);
      if (idx !== activeIndex) {
        setActiveIndex(idx);
        activateSlide(idx);
      }
    },
    [activeIndex, activateSlide],
  );

  const goNext = () => {
    if (activeIndex < SLIDE_CONTENT.length - 1) {
      scrollRef.current?.scrollTo({ x: W * (activeIndex + 1), animated: true });
    } else {
      finish();
    }
  };

  const finish = () => {
    setIntroSeen(true);
    navigation.replace('Splash');
  };

  const isLast = activeIndex === SLIDE_CONTENT.length - 1;

  // Trigger initial animation on mount
  React.useEffect(() => {
    activateSlide(0);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* ── Paged scroll ─────────────────────────────────── */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
        bounces={false}
        style={StyleSheet.absoluteFill}
      >
        {SLIDE_CONTENT.map((content, idx) => (
          <View key={idx} style={s.page}>
            {/* Full background image */}
            <ImageBackground
              source={SLIDE_IMAGES[idx]}
              style={s.backgroundImage}
              resizeMode="cover"
            >
              {/* Gradient overlay for readability */}
              <LinearGradient
                colors={[
                  'rgba(0, 0, 0, 0)',
                  'rgba(0, 0, 0, 0.1)',
                  'rgba(0, 0, 0, 0.3)',
                  'rgba(0, 0, 0, 0.5)',
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={s.imageOverlay}
              />

              {/* Content section - middle area */}
              <View style={s.contentContainer}>
                {/* Headline with entrance animation */}
                <Animated.View
                  style={{
                    opacity: headlineOpacity,
                    transform: [{ translateY: headlineTranslateY }],
                  }}
                >
                  <Text style={s.headline}>{content.headline}</Text>
                </Animated.View>

                {/* Body card with entrance animation */}
                <Animated.View
                  style={{
                    opacity: cardOpacity,
                    transform: [{ translateY: cardTranslateY }],
                  }}
                >
                  <View style={s.bodyCard}>
                    <Text style={s.body}>{content.body}</Text>
                  </View>
                </Animated.View>
              </View>

              {/* Bottom controls section */}
              <SafeAreaView edges={['bottom']} style={s.bottomControls}>
                <Animated.View
                  style={{
                    opacity: controlsOpacity,
                    transform: [{ translateY: controlsTranslateY }],
                  }}
                >
                  {/* Progress dots */}
                  <View style={s.dotsContainer}>
                    <View style={s.dots}>
                      {SLIDE_CONTENT.map((_, i) => (
                        <View
                          key={i}
                          style={[
                            s.dot,
                            {
                              backgroundColor: i === activeIndex 
                                ? colors.primary 
                                : 'rgba(255, 255, 255, 0.3)',
                              width: i === activeIndex ? 32 : 6,
                            },
                          ]}
                        />
                      ))}
                    </View>
                  </View>

                  {/* Skip / Next buttons */}
                  <View style={s.btnRow}>
                    {!isLast && (
                      <Animated.View
                        style={{
                          opacity: buttonWidthAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 0],
                          }),
                          transform: [
                            {
                              translateX: buttonWidthAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, -20],
                              }),
                            },
                          ],
                        }}
                      >
                        <TouchableOpacity onPress={finish} activeOpacity={0.7} style={s.skipBtn}>
                          <Text style={s.skipText}>Skip</Text>
                        </TouchableOpacity>
                      </Animated.View>
                    )}

                    <Animated.View
                      style={[
                        s.nextBtnTouch,
                        {
                          width: buttonWidthAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['70%', '100%'],
                          }),
                        },
                      ]}
                    >
                      <GradientButton
                        text={isLast ? "Let's Begin" : 'Next'}
                        onPress={goNext}
                        showArrow={true}
                        fullWidth={true}
                      />
                    </Animated.View>
                  </View>

                  {/* Privacy text */}
                  <View style={s.privacyContainer}>
                    <Text style={s.privacy}>No signup</Text>
                    <View style={s.privacyDot} />
                    <Text style={s.privacy}>No data</Text>
                    <View style={s.privacyDot} />
                    <Text style={s.privacy}>Just you two</Text>
                  </View>
                </Animated.View>
              </SafeAreaView>
            </ImageBackground>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
