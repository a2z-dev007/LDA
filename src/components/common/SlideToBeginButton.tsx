/**
 * SlideToBeginButton Component
 * ─────────────────────────────
 * Premium 3D slide-to-unlock button with realistic shadows and glossy gradient.
 * Matches the reference design with clean depth and smooth shine.
 * User must slide the arrow from left to right to activate.
 */

import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ChevronsRight } from 'lucide-react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { useAppColors } from '../../theme';
import { metrics } from '../../theme/metrics';
import { typography } from '../../theme/typography';
import { responsiveHeight } from 'react-native-responsive-dimensions';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BUTTON_WIDTH = SCREEN_WIDTH * 0.85;
const SLIDER_SIZE = 50;
const SLIDE_THRESHOLD = BUTTON_WIDTH - SLIDER_SIZE - 20;

interface SlideToBeginButtonProps {
  /** Text to display */
  text?: string;
  /** Callback when slide is completed */
  onSlideComplete: () => void;
}

export const SlideToBeginButton: React.FC<SlideToBeginButtonProps> = ({
  text = 'Slide to Begin',
  onSlideComplete,
}) => {
  const colors = useAppColors();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const arrowAnim = useRef(new Animated.Value(0)).current;
  const hasReachedThreshold = useRef(false);

  // Haptic feedback options
  const hapticOptions = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  // Animate arrow continuously
  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(arrowAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(arrowAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        ReactNativeHapticFeedback.trigger('impactLight', hapticOptions);
        hasReachedThreshold.current = false;
      },
      onPanResponderMove: (_, gestureState) => {
        const newValue = Math.max(0, Math.min(gestureState.dx, SLIDE_THRESHOLD));
        slideAnim.setValue(newValue);

        if (gestureState.dx >= SLIDE_THRESHOLD && !hasReachedThreshold.current) {
          ReactNativeHapticFeedback.trigger('notificationSuccess', hapticOptions);
          hasReachedThreshold.current = true;
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx >= SLIDE_THRESHOLD) {
          Animated.spring(slideAnim, {
            toValue: SLIDE_THRESHOLD,
            useNativeDriver: false,
          }).start(() => {
            onSlideComplete();
          });
        } else {
          ReactNativeHapticFeedback.trigger('impactLight', hapticOptions);
          Animated.spring(slideAnim, {
            toValue: 0,
            friction: 8,
            tension: 80,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const arrowTranslateX = arrowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 8],
  });

  const textOpacity = slideAnim.interpolate({
    inputRange: [0, SLIDE_THRESHOLD * 0.5, SLIDE_THRESHOLD],
    outputRange: [1, 0.5, 0],
  });

  return (
    <View style={styles.container}>
      {/* Shadow container */}
      <View style={styles.shadowContainer}>
        {/* Track container */}
        <View style={styles.trackContainer}>
          {/* Gradient background */}
          <LinearGradient
            colors={[colors.buttonGradientStart, colors.buttonGradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            {/* Glossy overlay */}
            <LinearGradient
              colors={[
                'rgba(255,255,255,0.5)',
                'rgba(255,255,255,0.25)',
                'rgba(255,255,255,0.05)',
                'rgba(255,255,255,0)',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.glossOverlay}
            />
          </LinearGradient>

          {/* Text */}
          <Animated.Text
            style={[
              styles.text,
              { opacity: textOpacity },
            ]}
          >
            {text}
          </Animated.Text>

          {/* Slider thumb */}
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.slider,
              { transform: [{ translateX: slideAnim }] },
            ]}
          >
            {/* Slider shadow container */}
            <View style={styles.sliderShadowContainer}>
              <View style={styles.sliderInner}>
                {/* Slider gloss */}
                <LinearGradient
                  colors={[
                    'rgba(255,255,255,0.6)',
                    'rgba(255,255,255,0.3)',
                    'rgba(255,255,255,0.1)',
                    'rgba(255,255,255,0)',
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.sliderGloss}
                />
                
                <Animated.View
                  style={{
                    transform: [{ translateX: arrowTranslateX }],
                    zIndex: 10,
                  }}
                >
                  <ChevronsRight size={28} color={colors.primary} strokeWidth={2.5} />
                </Animated.View>
              </View>
            </View>
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  // Shadow container for track
  shadowContainer: {
    borderRadius: metrics.radius.full,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  trackContainer: {
    width: BUTTON_WIDTH,
    height: responsiveHeight(6.7),
    borderRadius: metrics.radius.full,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: metrics.radius.full,
    // Subtle border for definition
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    borderLeftColor: 'rgba(255, 255, 255, 0.2)',
    borderBottomColor: 'rgba(0, 0, 0, 0.15)',
    borderRightColor: 'rgba(0, 0, 0, 0.1)',
  },
  // Glossy overlay
  glossOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60%',
    borderTopLeftRadius: metrics.radius.full,
    borderTopRightRadius: metrics.radius.full,
  },
  text: {
    ...typography.buttonLarge,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    zIndex: 5,
  },
  slider: {
    position: 'absolute',
    left: 10,
    top: (responsiveHeight(6.7) - SLIDER_SIZE) / 2,
    width: SLIDER_SIZE,
    height: SLIDER_SIZE,
    zIndex: 20,
  },
  // Slider shadow container
  sliderShadowContainer: {
    width: SLIDER_SIZE,
    height: SLIDER_SIZE,
    borderRadius: SLIDER_SIZE / 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 10,
  },
  sliderInner: {
    width: '100%',
    height: '100%',
    borderRadius: SLIDER_SIZE / 2,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    // Subtle border
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.5)',
    borderLeftColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderRightColor: 'rgba(0, 0, 0, 0.08)',
  },
  // Slider gloss
  sliderGloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '65%',
    borderTopLeftRadius: SLIDER_SIZE / 2,
    borderTopRightRadius: SLIDER_SIZE / 2,
  },
});
