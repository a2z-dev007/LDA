import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { useAppColors } from '../theme';
import { typography, fonts } from '../theme/typography';
import { metrics } from '../theme/metrics';
import {
  HeartIcon,
  LeafIcon,
  SparkleIcon,
  HeartFilledIcon,
  CheckIcon,
} from '../components/icons/CommitmentIcons';
import { GradientButton } from '../components/common/GradientButton';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { IMAGE } from '../assets/image/bg-images';

type Nav = StackNavigationProp<RootStackParamList, 'Commitment'>;

// ── Bullet row data ───────────────────────────────────────────
interface BulletItem {
  icon: React.ReactNode;
  text: (primary: string) => React.ReactNode;
}

const getBullets = (primary: string): BulletItem[] => [
  {
    icon: <HeartIcon size={metrics.iconSize.sm} color={primary} />,
    text: (_primary: string) => (
      <>
        <Text style={{ fontFamily: fonts.dmSansBold, fontWeight: '700' }}>
          Not perfectly. But honestly
        </Text>
        <Text> — with yourself and for your relationship.</Text>
      </>
    ),
  },
  {
    icon: <LeafIcon size={metrics.iconSize.sm} color={primary} />,
    text: (primary: string) => (
      <>
        <Text>It will ask </Text>
        <Text style={{ color: primary, fontFamily: fonts.dmSansBold, fontWeight: '700' }}>
          uncomfortable
        </Text>
        <Text> things.</Text>
      </>
    ),
  },
  {
    icon: <SparkleIcon size={metrics.iconSize.sm} color={primary} />,
    text: (primary: string) => (
      <>
        <Text>It will ask you to feel what you've been avoiding. </Text>
        <Text style={{ color: primary, fontFamily: fonts.playfairItalic, fontStyle: 'italic' }}>
          That's the point.
        </Text>
      </>
    ),
  },
];

export const CommitmentScreen: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const [isChecked, setIsChecked] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  
  // Individual element animations
  const heroAnim = useRef(new Animated.Value(0)).current;
  const bulletAnim = useRef(new Animated.Value(0)).current;
  const commitmentAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  
  // Checkbox animation
  const checkboxScale = useRef(new Animated.Value(1)).current;

  const BULLETS = getBullets(colors.primary);

  useEffect(() => {
    // Staggered entrance animations
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, { 
          toValue: 1, 
          duration: 600, 
          useNativeDriver: true 
        }),
        Animated.spring(slideAnim, { 
          toValue: 0, 
          friction: 8, 
          tension: 80, 
          useNativeDriver: true 
        }),
      ]),
    ]).start();

    // Staggered element animations
    Animated.stagger(150, [
      Animated.timing(heroAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(bulletAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(commitmentAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleCheckboxPress = () => {
    // Animate checkbox press
    Animated.sequence([
      Animated.spring(checkboxScale, {
        toValue: 0.85,
        useNativeDriver: true,
      }),
      Animated.spring(checkboxScale, {
        toValue: 1,
        friction: 3,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    setIsChecked(!isChecked);
  };

  return (
    <ImageBackground 
      source={IMAGE.bluePurple} 
      style={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={10}
    >
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
        <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* ── Hero section ─────────────────────────────── */}
            <Animated.View 
              style={[
                styles.hero,
                {
                  opacity: heroAnim,
                  transform: [
                    {
                      translateY: heroAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.heroContent}>
                {/* Decorative top accent */}
                <View style={styles.heroAccent}>
                  <View style={[styles.accentDot, { backgroundColor: colors.primary }]} />
                  <View style={[styles.accentLine, { backgroundColor: colors.primary }]} />
                </View>

                <Text style={styles.eyebrow}>BEFORE YOU BEGIN</Text>
                
                <Text style={styles.title}>
                  This app works{'\n'}if you actually{' '}
                  <Text style={styles.titleAccent}>show up.</Text>
                </Text>

                {/* Decorative bottom element */}
                <View style={styles.heroFooter}>
                  <View style={[styles.footerLine, { backgroundColor: colors.primary }]} />
                  <HeartIcon size={metrics.iconSize.xs} color={colors.primary} />
                  <View style={[styles.footerLine, { backgroundColor: colors.primary }]} />
                </View>
              </View>
            </Animated.View>

            {/* ── Bullet card ──────────────────────────────── */}
            <Animated.View
              style={{
                opacity: bulletAnim,
                transform: [
                  {
                    translateY: bulletAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              }}
            >
              <View style={styles.bulletCard}>
                {BULLETS.map((b, i) => (
                  <View key={i}>
                    <View style={styles.bulletRow}>
                      {/* Icon circle */}
                      <View style={styles.iconCircle}>
                        {b.icon}
                      </View>
                      {/* Text */}
                      <Text style={styles.bulletText}>
                        {b.text(colors.primary)}
                      </Text>
                    </View>
                    {i < BULLETS.length - 1 && <View style={styles.divider} />}
                  </View>
                ))}
              </View>
            </Animated.View>

            {/* ── Commitment box ───────────────────────────── */}
            <Animated.View
              style={{
                opacity: commitmentAnim,
                transform: [
                  {
                    translateY: commitmentAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              }}
            >
              <View style={styles.commitmentBox}>
                {/* Header row */}
                <View style={styles.commitmentHeader}>
                  <View style={styles.commitmentIconCircle}>
                    <HeartFilledIcon size={metrics.iconSize.md} color={colors.primary} />
                  </View>
                  <Text style={styles.commitmentText}>
                    I commit to showing up honestly.
                  </Text>
                </View>

                <View style={styles.divider} />

                {/* Checkbox row */}
                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={handleCheckboxPress}
                  activeOpacity={0.7}
                >
                  <Animated.View 
                    style={[
                      styles.checkbox, 
                      isChecked && styles.checkboxChecked,
                      { transform: [{ scale: checkboxScale }] }
                    ]}
                  >
                    {isChecked && <CheckIcon size={metrics.iconSize.xs} color="#FFFFFF" />}
                  </Animated.View>
                  <Text style={styles.checkboxLabel}>
                    I'm ready to be honest with myself
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* ── Button section ─────────────────────────────── */}
            <Animated.View 
              style={[
                styles.buttonSection,
                {
                  opacity: buttonAnim,
                  transform: [
                    {
                      translateY: buttonAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <GradientButton
                text="I'm ready →"
                onPress={() => navigation.navigate('NameKeeper')}
                disabled={!isChecked}
                showArrow={false}
                fullWidth={true}
              />

              <Text style={styles.footerNote}>• THE JOURNEY BEGINS WITH TRUTH •</Text>
            </Animated.View>
          </ScrollView>
        </Animated.View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  root: { flex: 1 },
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: metrics.spacing.md,
  },

  // ── Hero ─────────────────────────────────────────────────
  hero: {
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingTop: metrics.spacing.md,
    paddingBottom: metrics.spacing.lg,
  },
  heroContent: {
    alignItems: 'center',
    marginTop:responsiveHeight(3)
  },
  heroAccent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: metrics.spacing.sm,
    gap: metrics.spacing.xs,
  },
  accentDot: {
    width: metrics.spacing.xs * 1.5,
    height: metrics.spacing.xs * 1.5,
    borderRadius: metrics.spacing.xs * 0.75,
  },
  accentLine: {
    width: metrics.spacing.xl,
    height: metrics.spacing.xxs,
    borderRadius: metrics.spacing.xxs * 0.5,
  },
  eyebrow: {
    ...typography.captionSmall,
    color: '#B8A19C',
    marginBottom: metrics.spacing.sm,
    textAlign: 'center',
  },
  title: {
    ...typography.displayMedium,
    color: c.text,
    textAlign: 'center',
    marginBottom: metrics.spacing.md,
  },
  titleAccent: {
    ...typography.displayItalic,
    fontSize: typography.displayMedium.fontSize,
    color: c.primary,
  },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.sm,
  },
  footerLine: {
    width: metrics.spacing.lg,
    height: metrics.spacing.xxs * 0.75,
    borderRadius: metrics.spacing.xxs * 0.5,
  },

  // ── Bullet card ──────────────────────────────────────────
  bulletCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: metrics.radius.xl,
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
    borderLeftColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: metrics.layout.screenPaddingHz,
    marginBottom: metrics.spacing.md,
    paddingVertical: metrics.spacing.xs,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: metrics.card.paddingHz,
    paddingVertical: metrics.spacing.smMd,
    gap: metrics.spacing.smMd,
  },
  iconCircle: {
    width: metrics.iconSize.lg,
    height: metrics.iconSize.lg,
    borderRadius: metrics.iconSize.lg / 2,
    backgroundColor: 'rgba(227, 139, 155, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(227, 139, 155, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: metrics.spacing.xxs,
  },
  bulletText: {
    ...typography.bodySmall,
    flex: 1,
    color: c.text,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginHorizontal: metrics.card.paddingHz,
  },

  // ── Commitment box ───────────────────────────────────────
  commitmentBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: metrics.radius.xl,
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
    borderLeftColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: metrics.layout.screenPaddingHz,
    marginBottom: metrics.spacing.lg,
    paddingVertical: metrics.spacing.xs,
    overflow: 'hidden',
  },
  commitmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: metrics.card.paddingHz,
    paddingVertical: metrics.spacing.smMd,
    gap: metrics.spacing.smMd,
  },
  commitmentIconCircle: {
    width: metrics.iconSize.lg,
    height: metrics.iconSize.lg,
    borderRadius: metrics.iconSize.lg / 2,
    backgroundColor: 'rgba(227, 139, 155, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(227, 139, 155, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  commitmentText: {
    ...typography.bodyBold,
    flex: 1,
    fontSize: typography.bodyMedium.fontSize,
    color: c.text,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: metrics.card.paddingHz,
    paddingVertical: metrics.spacing.smMd,
    gap: metrics.spacing.smMd,
  },
  checkbox: {
    width: metrics.spacing.lg + metrics.spacing.xs,
    height: metrics.spacing.lg + metrics.spacing.xs,
    borderRadius: metrics.spacing.sm,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: c.primary,
    borderColor: c.primary,
  },
  checkboxLabel: {
    ...typography.bodySmall,
    flex: 1,
    color: c.text,
  },

  // ── Button Section ───────────────────────────────────────
  buttonSection: {
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingTop: metrics.spacing.xl,
    paddingBottom: metrics.spacing.lg,
    alignItems: 'center',
    gap: metrics.spacing.smMd,
  },
  buttonTextDisabled: {
    color: c.textMuted,
  },
  footerNote: {
    ...typography.captionSmall,
    color: c.textHint,
    textAlign: 'center',
  },
});
