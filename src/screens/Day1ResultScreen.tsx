import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, TouchableOpacity, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { useAppColors } from '../theme';
import { personalityTypes } from '../data/personalityTypes';
import { useDayStore } from '../store/useDayStore';
import { useStreakStore } from '../store/useStreakStore';
import { haptics } from '../utils/haptics';

type Nav = StackNavigationProp<RootStackParamList, 'Day1Result'>;

export const Day1ResultScreen: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const day1 = useDayStore((s) => s.day1);
  const recordActivity = useStreakStore((s) => s.recordActivity);

  const personality = personalityTypes.find((p) => p.id === day1.personalityType)
    ?? personalityTypes[0];

  // Animation refs
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.88)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const pill1 = useRef(new Animated.Value(0)).current;
  const pill2 = useRef(new Animated.Value(0)).current;
  const pill3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    haptics.success();
    recordActivity();

    Animated.sequence([
      Animated.timing(titleOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.parallel([
        Animated.spring(cardScale, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
        Animated.timing(cardOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      Animated.timing(contentOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.stagger(80, [
        Animated.timing(pill1, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(pill2, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(pill3, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const pillAnims = [pill1, pill2, pill3];

  const handleSave = () => {
    haptics.medium();
    navigation.navigate('Home');
  };

  const handleTomorrow = () => {
    haptics.light();
    navigation.navigate('Home');
  };

  return (
    <ScreenWrapper>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.Text style={[styles.reveal, { opacity: titleOpacity }]}>
          Your relationship type is
        </Animated.Text>

        {/* Personality Card */}
        <Animated.View style={[styles.card, { borderColor: personality.color }, { opacity: cardOpacity, transform: [{ scale: cardScale }] }]}>
          <View style={[styles.cardAccent, { backgroundColor: personality.color }]} />
          <Text style={[styles.typeName, { color: personality.color }]}>{personality.name}</Text>
          <Text style={styles.typeSubLabel}>{personality.subLabel}</Text>
          <Text style={styles.typeDescription}>{personality.description}</Text>
        </Animated.View>

        <Animated.View style={[styles.details, { opacity: contentOpacity }]}>
          {/* Trait pills */}
          <View style={styles.pillRow}>
            {personality.traits.map((trait, i) => (
              <Animated.View key={i} style={[styles.pill, { borderColor: personality.color, opacity: pillAnims[i] ?? contentOpacity }]}>
                <Text style={[styles.pillText, { color: personality.color }]}>{trait}</Text>
              </Animated.View>
            ))}
          </View>

          {/* Growth area */}
          <View style={[styles.growthCard, { borderColor: `${personality.color}40` }]}>
            <Text style={styles.growthLabel}>One invitation for you</Text>
            <Text style={styles.growthText}>{personality.growth}</Text>
          </View>

          {/* Key Playfair line */}
          <Text style={styles.keyLine}>
            "Would your partner say the same thing about themselves?"
          </Text>
        </Animated.View>
      </ScrollView>

      <TouchableOpacity style={[styles.cta, { backgroundColor: personality.color }]} activeOpacity={0.85} onPress={handleSave}>
        <Text style={styles.ctaLabel}>Save my result</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.ghostCta} activeOpacity={0.7} onPress={handleTomorrow}>
        <Text style={styles.ghostCtaLabel}>Come back tomorrow →</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: 28, paddingTop: 60, paddingBottom: 20 },
  reveal: {
    color: c.textHint, fontSize: 14, fontFamily: 'Inter-Regular',
    letterSpacing: 1, marginBottom: 20, textAlign: 'center',
  },
  card: {
    borderWidth: 1.5, borderRadius: 20, padding: 28, marginBottom: 28, overflow: 'hidden',
  },
  cardAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 3 },
  typeName: { fontSize: 28, fontFamily: 'PlayfairDisplay-Bold', marginTop: 8, marginBottom: 6 },
  typeSubLabel: {
    fontSize: 14, color: c.textSecondary, fontFamily: 'PlayfairDisplay-Italic',
    marginBottom: 14, lineHeight: 22,
  },
  typeDescription: { fontSize: 15, color: c.textSecondary, fontFamily: 'Inter-Regular', lineHeight: 23 },
  details: { gap: 16 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: {
    borderWidth: 1, borderRadius: 100, paddingHorizontal: 14, paddingVertical: 6,
  },
  pillText: { fontSize: 13, fontFamily: 'Inter-SemiBold' },
  growthCard: {
    borderWidth: 1, borderRadius: 12, padding: 20,
  },
  growthLabel: {
    color: c.textHint, fontSize: 11, fontFamily: 'Inter-SemiBold',
    letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8,
  },
  growthText: { color: c.textSecondary, fontSize: 15, fontFamily: 'Inter-Regular', lineHeight: 22 },
  keyLine: {
    color: c.textSecondary, fontSize: 17, fontFamily: 'PlayfairDisplay-Italic',
    lineHeight: 28, textAlign: 'center', marginVertical: 8,
  },
  cta: {
    marginHorizontal: 28, marginBottom: 12, paddingVertical: 18,
    borderRadius: 100, alignItems: 'center',
  },
  ctaLabel: { color: c.dark, fontSize: 17, fontFamily: 'Inter-SemiBold', letterSpacing: 0.3 },
  ghostCta: { alignItems: 'center', marginBottom: 40 },
  ghostCtaLabel: { color: c.textHint, fontSize: 15, fontFamily: 'Inter-Regular' },
});
