import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Pressable, ScrollView } from 'react-native';
import { DayCTA } from '../../components/common/DayCTA';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { useAppColors } from '../../theme';
import { useDayStore } from '../../store/useDayStore';
import { calculateBadge } from '../../services/badgeCalculator';
import { haptics } from '../../utils/haptics';
import LottieView from 'lottie-react-native';
import { LOTTIE } from '../../assets/lottie';
import { Sparkles, Trophy, Award, Quote } from 'lucide-react-native';

type Nav = StackNavigationProp<RootStackParamList, 'Day5Celebration'>;

export const Day5Celebration: React.FC = () => {
  const colors = useAppColors();
  const navigation = useNavigation<Nav>();
  const day1 = useDayStore((s) => s.day1);
  const day2 = useDayStore((s) => s.day2);
  const day3 = useDayStore((s) => s.day3);
  const day4 = useDayStore((s) => s.day4);
  const getDedicationScore = useDayStore((s) => s.getDedicationScore);

  const dedicationScore = getDedicationScore();
  const badgeResult = calculateBadge(day1, day2, day3, day4, dedicationScore);

  const tierColor = badgeResult.tier === 'gold' 
    ? colors.day5 
    : badgeResult.tier === 'standard' 
    ? colors.day2 
    : colors.day3;

  const styles = makeStyles(colors, tierColor);

  // Animations
  const pip1 = useRef(new Animated.Value(0)).current;
  const pip2 = useRef(new Animated.Value(0)).current;
  const pip3 = useRef(new Animated.Value(0)).current;
  const pip4 = useRef(new Animated.Value(0)).current;
  const pip5 = useRef(new Animated.Value(0)).current;
  const badgeScale = useRef(new Animated.Value(0.8)).current;
  const badgeOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const lottieRef = useRef<LottieView>(null);

  const pipAnims = [pip1, pip2, pip3, pip4, pip5];
  const pipColors = [colors.day1, colors.day2, colors.day3, colors.day4, colors.day5];

  const BadgeIcon = badgeResult.tier === 'gold' 
    ? Trophy 
    : badgeResult.tier === 'standard' 
    ? Award 
    : Sparkles;

  useEffect(() => {
    haptics.success();
    lottieRef.current?.play();
    Animated.sequence([
      // Fill all 5 pips L→R over 600ms
      Animated.stagger(120, pipAnims.map((p) =>
        Animated.timing(p, { toValue: 1, duration: 200, useNativeDriver: false })
      )),
      // Badge reveal
      Animated.parallel([
        Animated.spring(badgeScale, { toValue: 1, friction: 5, tension: 60, useNativeDriver: true }),
        Animated.timing(badgeOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.timing(buttonOpacity, { toValue: 1, duration: 400, delay: 200, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <ScreenWrapper>
      <LottieView
        ref={lottieRef}
        source={LOTTIE.confetti}
        style={styles.confetti}
        autoPlay={false}
        loop={false}
        resizeMode="cover"
      />

      {/* 5-pip progress strip — all filled */}
      <View style={styles.pipsRow}>
        {pipAnims.map((anim, i) => (
          <Animated.View
            key={i}
            style={[styles.pip, {
              backgroundColor: anim.interpolate({ 
                inputRange: [0, 1], 
                outputRange: ['rgba(255,255,255,0.15)', pipColors[i]] 
              }),
            }]}
          />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          {/* Glowing Badge Component */}
          <Animated.View style={[styles.badgeWrapper, { opacity: badgeOpacity, transform: [{ scale: badgeScale }] }]}>
            <View style={styles.badgeGlowRing}>
              <View style={styles.badgeMidRing}>
                <LinearGradient
                  colors={[tierColor, `${tierColor}bb`]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.badgeCircle}
                >
                  <BadgeIcon size={40} color="#FFFFFF" strokeWidth={1.5} />
                </LinearGradient>
              </View>
            </View>
            <Text style={styles.badgeName}>{badgeResult.badge.name}</Text>
            <View style={styles.tierPill}>
              <Text style={styles.tierText}>{badgeResult.tier.toUpperCase()} TIER</Text>
            </View>
            <Text style={styles.badgeDesc}>{badgeResult.badge.description}</Text>
          </Animated.View>

          {/* Glassmorphic Quotes Card */}
          <View style={styles.quoteCard}>
            <View style={styles.quoteIconWrapper}>
              <Quote size={24} color={tierColor} strokeWidth={1.5} />
            </View>
            <Text style={styles.quoteText1}>"That's not nothing."</Text>
            <Text style={styles.quoteText2}>"Most people quit at Day 2."</Text>
          </View>

          {/* Traits Section */}
          <View style={styles.traitSection}>
            <Text style={styles.traitLabel}>Your Relationship Traits</Text>
            <View style={styles.traitPills}>
              {badgeResult.badge.traitPills.map((pill) => (
                <View key={pill} style={[styles.traitPill, { borderColor: `${tierColor}40` }]}>
                  <Text style={[styles.traitPillText, { color: tierColor }]}>{pill}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <Animated.View style={{ opacity: buttonOpacity }}>
        <DayCTA 
          title="See your full report" 
          onPress={() => { 
            haptics.medium(); 
            navigation.navigate('Day5ReportCard');
          }} 
        />
      </Animated.View>
    </ScreenWrapper>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>, tierColor: string) => {
  const quoteCardBg = c.isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.75)';
  const quoteCardBorder = c.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(45, 95, 93, 0.12)';
  const badgeMidRingBg = c.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.6)';
  const traitPillBg = c.isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.65)';

  return StyleSheet.create({
    pipsRow: { 
      flexDirection: 'row', 
      paddingHorizontal: 24, 
      paddingTop: 16, 
      paddingBottom: 8, 
      gap: 6 
    },
    pip: { 
      flex: 1, 
      height: 4, 
      borderRadius: 2 
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
    },
    body: { 
      flex: 1, 
      paddingHorizontal: 28, 
      paddingVertical: 24,
      alignItems: 'center', 
      gap: 28 
    },
    confetti: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      zIndex: 999,
      pointerEvents: 'none',
    },
    
    // Badge Visuals
    badgeWrapper: {
      alignItems: 'center',
      gap: 16,
      width: '100%',
    },
    badgeGlowRing: {
      width: 140,
      height: 140,
      borderRadius: 70,
      borderCurve: 'continuous',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: `${tierColor}08`,
      borderWidth: 1.5,
      borderColor: `${tierColor}30`,
      borderStyle: 'dashed',
      boxShadow: `0 0 20px ${tierColor}20`,
    },
    badgeMidRing: {
      width: 116,
      height: 116,
      borderRadius: 58,
      borderCurve: 'continuous',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: badgeMidRingBg,
      borderWidth: 1.5,
      borderColor: `${tierColor}50`,
    },
    badgeCircle: {
      width: 90,
      height: 90,
      borderRadius: 45,
      borderCurve: 'continuous',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0 8px 16px ${tierColor}40`,
    },
    badgeName: { 
      fontSize: 26, 
      fontFamily: 'PlayfairDisplay-Bold', 
      color: tierColor,
      textAlign: 'center',
      marginTop: 8,
    },
    tierPill: {
      borderWidth: 1.5, 
      borderRadius: 100,
      borderCurve: 'continuous',
      paddingHorizontal: 16, 
      paddingVertical: 6,
      backgroundColor: `${tierColor}15`,
      borderColor: tierColor,
    },
    tierText: { 
      fontSize: 12, 
      fontFamily: 'Inter-SemiBold', 
      color: tierColor,
      letterSpacing: 2.5 
    },
    badgeDesc: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: c.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
      paddingHorizontal: 16,
    },

    // Quote Card
    quoteCard: {
      backgroundColor: quoteCardBg,
      borderRadius: 20,
      borderCurve: 'continuous',
      borderWidth: 1.5,
      borderColor: quoteCardBorder,
      padding: 20,
      width: '100%',
      alignItems: 'center',
      gap: 12,
      boxShadow: c.isDark ? '0 4px 12px rgba(0, 0, 0, 0.04)' : '0 4px 12px rgba(26, 54, 53, 0.03)',
    },
    quoteIconWrapper: {
      opacity: 0.4,
    },
    quoteText1: {
      fontSize: 17,
      color: c.text,
      fontFamily: 'PlayfairDisplay-Italic',
      textAlign: 'center',
      lineHeight: 24,
    },
    quoteText2: {
      fontSize: 13,
      color: c.textSecondary,
      fontFamily: 'Inter-Regular',
      textAlign: 'center',
    },

    // Traits Section
    traitSection: {
      alignItems: 'center',
      gap: 12,
      width: '100%',
    },
    traitLabel: {
      fontSize: 10,
      fontFamily: 'Inter-SemiBold',
      color: c.textHint,
      letterSpacing: 2,
      textTransform: 'uppercase',
    },
    traitPills: { 
      flexDirection: 'row', 
      flexWrap: 'wrap', 
      gap: 10, 
      justifyContent: 'center' 
    },
    traitPill: { 
      borderWidth: 1, 
      borderRadius: 100, 
      borderCurve: 'continuous',
      paddingHorizontal: 14, 
      paddingVertical: 7,
      backgroundColor: traitPillBg,
    },
    traitPillText: { 
      fontSize: 12, 
      fontFamily: 'Inter-SemiBold' 
    },
  });
};
