import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  withSpring,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  Easing,
  FadeInDown,
  withTiming,
} from 'react-native-reanimated';
import { JarEnvelopeAnimation, JarEnvelopeHandle } from './JarEnvelopeAnimation';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions';
import LinearGradient from 'react-native-linear-gradient';
import { ChevronRight, Heart } from 'lucide-react-native';
import { haptics } from '../../utils/haptics';
import { useAppColors } from '../../theme';
import { metrics } from '../../theme/metrics';
import { typography, fonts } from '../../theme/typography';

const { width: SCREEN_W } = Dimensions.get('window');

interface DayEndJarModalProps {
  visible: boolean;
  currentDay: number;
  onNext: () => void;
}

export const DayEndJarModal: React.FC<DayEndJarModalProps> = ({
  visible,
  currentDay,
  onNext,
}) => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const jarRef = useRef<JarEnvelopeHandle>(null);
  const [animationFinished, setAnimationFinished] = useState(false);
  const [modalActive, setModalActive] = useState(false);

  // For independent background animation
  const bgOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setModalActive(true);
      bgOpacity.value = withTiming(1, { duration: 500 });
      setAnimationFinished(false);
      // Wait for modal transition then trigger jar
      const timer = setTimeout(() => {
        jarRef.current?.triggerEnvelope(() => {
          setAnimationFinished(true);
          haptics.success();
        });
      }, 1200); // Slower entrance timing for premium feel
      return () => clearTimeout(timer);
    } else {
      bgOpacity.value = withSpring(0);
      setModalActive(false);
    }
  }, [visible]);

  const animatedBgStyle = useAnimatedStyle(() => ({
    opacity: bgOpacity.value,
  }));

  if (!visible && !modalActive) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.overlay}>
        {/* Layered Background: Tinted Overlay (Replaced BlurView to fix Android crash) */}
        <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, animatedBgStyle]} />
        
        <Animated.View 
          entering={ZoomIn.duration(600).easing(Easing.out(Easing.back(1.2)))} 
          exiting={FadeOut.duration(300)}
          style={styles.container}
        >
          <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.header}>
            <View style={styles.iconCircle}>
               <Heart size={responsiveWidth(8)} color="#2DD4BF" fill="#2DD4BF" opacity={0.8} />
            </View>
            <Text style={styles.title}>Day {currentDay} Complete</Text>
            <Text style={styles.subtitle}>
              Your honest reflection has been added to the jar.
            </Text>
          </Animated.View>

          <View style={styles.jarWrapper}>
            <JarEnvelopeAnimation 
              ref={jarRef} 
              initialCount={currentDay - 1} 
            />
          </View>

          <Animated.View entering={FadeIn.delay(2000)} style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, !animationFinished && styles.buttonDisabled]}
              onPress={animationFinished ? onNext : undefined}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={animationFinished ? ['#6EE87A', '#2DD4BF'] : ['#E0E0E0', '#D1D1D1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>
                  {currentDay === 5 ? 'Reveal Results' : 'Continue Journey'}
                </Text>
                <ChevronRight size={20} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const makeStyles = (c: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: metrics.layout.screenPaddingHz,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)', // Deep premium tint
  },
  container: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: metrics.radius.xxl,
    padding: metrics.spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  header: {
    alignItems: 'center',
    marginBottom: metrics.spacing.xl,
  },
  iconCircle: {
    width: responsiveWidth(16),
    height: responsiveWidth(16),
    borderRadius: responsiveWidth(8),
    backgroundColor: 'rgba(45, 212, 191, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: metrics.spacing.lg,
  },
  title: {
    ...typography.displaySmall,
    color: c.text,
    fontFamily: fonts.dmSansBold,
    marginBottom: metrics.spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.bodyMedium,
    color: c.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: metrics.spacing.md,
  },
  jarWrapper: {
    height: responsiveWidth(60),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: metrics.spacing.xl,
  },
  footer: {
    width: '100%',
    marginTop: metrics.spacing.lg,
  },
  button: {
    width: '100%',
    borderRadius: 100,
    overflow: 'hidden',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontFamily: fonts.dmSansBold,
  },
});
