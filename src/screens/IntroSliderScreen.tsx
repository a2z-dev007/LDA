/**
 * IntroSliderScreen
 * ─────────────────
 * Premium onboarding slides with rounded image cards and sage green theme.
 * Matches the design with icons, features, and gradient buttons.
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
  Image,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ImageBackground,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { useAppColors } from '../theme';
import { metrics } from '../theme/metrics';
import { useUserStore } from '../store/useUserStore';
import { AppColors } from '../theme/ThemeContext';
import { GradientButton } from '../components/common/GradientButton';
import { Heart, Flame, Leaf, Sun, MessageCircle, HelpCircle } from 'lucide-react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { IMAGE } from '../assets/image/bg-images';

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

const CONNECTION_BADGE = require('../assets/image/onboarding/connection.png');

// ─────────────────────────────────────────────────────────────
//  Slide content matching the actual design
// ─────────────────────────────────────────────────────────────
const SLIDE_CONTENT = [
  {
    headlineTeal: 'Reignite',
    headlineBlack: 'the connection.',
    showHeartIcon: true,
    body: 'A 5-day solo journey of honest moments, small rituals, and real reflection.',
    features: [
      { icon: 'heart', label: 'Reconnect\nwith yourself' },
      { icon: 'flame', label: 'Build rituals\nthat ground you' },
      { icon: 'leaf', label: 'Reflect & grow\nevery day' },
    ],
  },
  {
    headlineTeal: 'Daily rituals',
    headlineItalic: 'that actually work.',
    showHeartIcon: true,
    body: 'Mood check-ins, appreciation prompts, and questions that bring you closer.',
    features: [
      { icon: 'sun', label: 'Mood\ncheck-ins' },
      { icon: 'message', label: 'Appreciation\nprompts' },
      { icon: 'help', label: 'Questions\nthat bring you closer' },
    ],
  },
  {
    headlineBlack: 'Discover your',
    headlineTeal: 'relationship',
    headlineBlackSuffix: ' style.',
    showHeartIcon: false,
    showDecorativeUnderline: true,
    body: 'Earn your connection badge and write a promise that lasts beyond 5 days.',
    features: [],
    isSlide3: true,
  },
];

// ─────────────────────────────────────────────────────────────
//  Theme-aware styles
// ─────────────────────────────────────────────────────────────
function makeStyles(c: AppColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    page: {
      width: W,
      backgroundColor: 'transparent',
    },
    contentWrapper: {
      // paddingHorizontal: metrics.layout.screenPaddingHz,
      backgroundColor: 'transparent',
    },
    topSection: {
      flex: 0,
    },
    // Rounded image card
    imageCard: {
      // width: '100%',
      // aspectRatio: 1.2,
      height:responsiveHeight(40),
      borderRadius: metrics.radius.xxl,
      overflow: 'hidden',
      // marginBottom: metrics.spacing.xs,
      // backgroundColor: c.white,
      // shadowColor: c.primary,
      // shadowOffset: { width: 0, height: 8 },
      // shadowOpacity: 0.12,
      // shadowRadius: 20,
      // elevation: 8,
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode:'contain',
    },
    // Heart icon overlay
    heartIcon: {
      position: 'absolute',
      bottom: metrics.spacing.md,
      right: metrics.spacing.md,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: c.white,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    // Content section
    contentSection: {
      marginBottom: 0,
      marginTop:responsiveHeight(3),
      paddingHorizontal: metrics.layout.screenPaddingHz,
      
    },
    // Headline
    headlineRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: metrics.spacing.sm,
      marginBottom: metrics.spacing.xs,
    },
    headlineWithIcon: {
      flex: 1,
    },
    heartIconInline: {
      marginTop: metrics.spacing.xs,
    },
    headlineInTeal: {
      fontSize: 36,
      fontFamily: 'PlayfairDisplay-Bold',
      color: c.primary,
      lineHeight: 42,
    },
    headlineBlack: {
      fontSize: 36,
       fontFamily: 'PlayfairDisplay-Italic',
      color: c.text,
      lineHeight: 42,
    },
    headlineAccent: {
      fontSize: 32,
      fontFamily: 'PlayfairDisplay-Italic',
      color: c.text,
      lineHeight: 42,
    },
    // Body text
    body: {
      fontSize: 15,
      fontFamily: 'DMSans-Regular',
      color: c.text,
      lineHeight: 22,
      marginBottom: metrics.spacing.xs,
      marginTop: metrics.spacing.sm,
      opacity: 0.85,
    },
    // Features row
    featuresRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: metrics.spacing.md,
      marginBottom: metrics.spacing.xs,
      backgroundColor: 'rgba(255,255,255,0.55)',
      paddingVertical: responsiveWidth(4),
      paddingHorizontal: responsiveWidth(3),
      borderRadius: metrics.radius.md,
    },
    featureItem: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: metrics.spacing.xs,
    },
    featureIconContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      borderWidth: 1.5,
      borderColor: c.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 4,
    },
    featureLabel: {
      fontSize: 11,
      fontFamily: 'DMSans-Regular',
      color: c.text,
      textAlign: 'center',
      lineHeight: 15,
    },
    // Bottom section - fixed at bottom of screen
    bottomSection: {
      paddingHorizontal: metrics.layout.screenPaddingHz,
    },
    // Progress dots
    dotsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: metrics.spacing.xs,
      marginBottom: metrics.spacing.lg,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: 'rgba(255,255,255,0.5)',
    },
    dotActive: {
      width: 28,
      backgroundColor: c.primary,
    },
    // Button row
    btnRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: metrics.spacing.sm,
      marginBottom: metrics.spacing.sm,
    },
    skipBtn: {
      paddingVertical: 14,
      paddingHorizontal: metrics.spacing.xl,
      backgroundColor: 'rgba(255,255,255,0.85)',
      borderRadius: metrics.radius.full,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.9)',
    },
    skipText: {
      color: c.text,
      fontSize: 16,
      fontFamily: 'DMSans-Medium',
    },
    nextBtnContainer: {
      flex: 1,
    },
    // Privacy text
    privacyContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: metrics.spacing.xs,
      paddingBottom: metrics.spacing.sm,
    },
    privacy: {
      color: c.textMuted,
      fontSize: 12,
      fontFamily: 'DMSans-Regular',
    },
    // ── Slide 3 specific ──
    slide3HeadlineBlack: {
      fontSize: 36,
      fontFamily: 'PlayfairDisplay-Bold',
      color: c.text,
      lineHeight: 44,
    },
    slide3HeadlineTeal: {
      fontSize: 36,
      fontFamily: 'PlayfairDisplay-Italic',
      color: c.primary,
      lineHeight: 44,
    },
    decorativeUnderline: {
      width: 120,
      height: 4,
      borderRadius: 2,
      backgroundColor: c.primary,
      opacity: 0.6,
      marginTop: 2,
      marginBottom: metrics.spacing.md,
    },
    slide3BodyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    slide3BodyText: {
      flex: 1,
      fontSize: 15,
      fontFamily: 'DMSans-Regular',
      color: c.text,
      lineHeight: 22,
      opacity: 0.85,
      paddingRight: metrics.spacing.md,
    },
    connectionBadge: {
      width: responsiveWidth(28),
      height: responsiveWidth(28),
    },
  });
}

// ─────────────────────────────────────────────────────────────
//  Main screen
// ─────────────────────────────────────────────────────────────
export const IntroSliderScreen: React.FC = () => {
  const colors = useAppColors();
  const insets = useSafeAreaInsets();
  const s = makeStyles(colors);

  const navigation = useNavigation<Nav>();
  const setIntroSeen = useUserStore((st) => st.setIntroSeen);

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const contentAnim = useRef(new Animated.Value(1)).current;

  const activateSlide = useCallback(
    () => {
      // Simple fade and scale animation
      Animated.sequence([
        Animated.timing(contentAnim, {
          toValue: 0.7,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(contentAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [contentAnim],
  );

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const idx = Math.round(e.nativeEvent.contentOffset.x / W);
      if (idx !== activeIndex) {
        setActiveIndex(idx);
        activateSlide();
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

  const renderIcon = (icon: string, size: number = 24) => {
    const iconColor = colors.primary;
    switch (icon) {
      case 'heart':
        return <Heart size={size} color={iconColor} />;
      case 'flame':
        return <Flame size={size} color={iconColor} />;
      case 'leaf':
        return <Leaf size={size} color={iconColor} />;
      case 'sun':
        return <Sun size={size} color={iconColor} />;
      case 'message':
        return <MessageCircle size={size} color={iconColor} />;
      case 'help':
        return <HelpCircle size={size} color={iconColor} />;
      default:
        return null;
    }
  };

  return (
    <ImageBackground 
      source={IMAGE.greenBg} 
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      {/* Full screen flex column: scroll content on top, buttons pinned at bottom */}
      <View style={{ flex: 1, flexDirection: 'column' }}>

        {/* Scrollable slide content */}
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={onScroll}
          bounces={false}
          style={s.scrollView}
        >
          {SLIDE_CONTENT.map((content, idx) => (
            <View key={idx} style={s.page}>
              <View style={[s.contentWrapper, {
                paddingTop: Math.max(insets.top, 20),
              }]}>
                {/* Rounded Image Card */}
                <View style={s.imageCard}>
                  <Image
                    source={SLIDE_IMAGES[idx]}
                    style={s.image}
                    resizeMode="cover"
                  />
                </View>

                {/* Content Section */}
                <View style={s.contentSection}>
                  {/* ── Slide 3 special layout ── */}
                  {content.isSlide3 ? (
                    <>
                      <Text style={s.slide3HeadlineBlack}>
                        {content.headlineBlack}{'\n'}
                        <Text style={s.slide3HeadlineTeal}>{content.headlineTeal}</Text>
                        <Text style={s.slide3HeadlineBlack}>{content.headlineBlackSuffix}</Text>
                      </Text>
                      <View style={s.decorativeUnderline} />
                      <View style={s.slide3BodyRow}>
                        <Text style={s.slide3BodyText}>{content.body}</Text>
                        <Image
                          source={CONNECTION_BADGE}
                          style={s.connectionBadge}
                          resizeMode="contain"
                        />
                      </View>
                    </>
                  ) : (
                    <>
                      {/* Slide 1: "Reignite" teal / "the connection." black + heart
                          Slide 2: "Daily rituals" teal / "that actually work." italic + heart */}
                      <View style={s.headlineRow}>
                        <View style={s.headlineWithIcon}>
                          {/* Line 1 - always teal */}
                          <Text style={s.headlineInTeal}>{content.headlineTeal}</Text>
                          {/* Line 2 - italic accent OR black, with heart inline */}
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            {content.headlineItalic ? (
                              <Text style={s.headlineAccent}>{content.headlineItalic}</Text>
                            ) : content.headlineBlack ? (
                              <Text style={s.headlineBlack}>{content.headlineBlack}</Text>
                            ) : null}
                            {content.showHeartIcon && (
                              <Heart size={26} color={colors.primary} strokeWidth={1.5} />
                            )}
                          </View>
                        </View>
                      </View>

                      <Text style={s.body}>{content.body}</Text>

                      {content.features.length > 0 && (
                        <View style={s.featuresRow}>
                          {content.features.map((feature, i) => (
                            <View key={i} style={s.featureItem}>
                              <View style={s.featureIconContainer}>
                                {renderIcon(feature.icon, 22)}
                              </View>
                              <Text style={s.featureLabel}>{feature.label}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </>
                  )}
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Buttons pinned at bottom */}
        <View style={[s.bottomSection, { paddingBottom: Math.max(insets.bottom, 12) + 4 }]}>
          <View style={s.dotsContainer}>
            {SLIDE_CONTENT.map((_, i) => (
              <View key={i} style={[s.dot, i === activeIndex && s.dotActive]} />
            ))}
          </View>
          <View style={s.btnRow}>
            <TouchableOpacity onPress={finish} activeOpacity={0.7} style={s.skipBtn}>
              <Text style={s.skipText}>Skip</Text>
            </TouchableOpacity>
            <View style={s.nextBtnContainer}>
              <GradientButton
                text={isLast ? "Let's Begin" : 'Next'}
                onPress={goNext}
                showArrow={true}
                fullWidth={true}
                variant="sageBlue"
              />
            </View>
          </View>
          <View style={s.privacyContainer}>
            <Text style={s.privacy}>🔒 No signup • No data • Just you two</Text>
          </View>
        </View>

      </View>
    </ImageBackground>
  );
};
