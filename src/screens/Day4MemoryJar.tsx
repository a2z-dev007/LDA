import React, { useState, useRef, useEffect } from 'react';
import { DayHeader } from '../components/common/DayHeader';
import {
  View, Text, StyleSheet, TextInput,
  KeyboardAvoidingView, Platform, ScrollView, Animated, Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/types';
import { ProgressStrip } from '../components/common/ProgressStrip';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { GradientButton } from '../components/common/GradientButton';
import { useAppColors } from '../theme';
import { typography, fonts } from '../theme/typography';
import { metrics } from '../theme/metrics';
import { useDayStore } from '../store/useDayStore';
import { useJournalStore } from '../store/useJournalStore';
import { haptics } from '../utils/haptics';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

type Nav = StackNavigationProp<RootStackParamList, 'Day4MemoryJar'>;

// Module-level ref to pass memory forward
export const memoryRef = { current: '', type: 'text' as 'text' | 'emoji' | 'skipped' };

export const Day4MemoryJar: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const day4 = useDayStore((s) => s.day4);
  const addJarMemory = useJournalStore((s) => s.addJarMemory);
  const setJarFillLevel = useJournalStore((s) => s.setJarFillLevel);

  const [memory, setMemory] = useState('');
  const [dropped, setDropped] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const jarShake = useRef(new Animated.Value(0)).current;
  const fillAnim = useRef(new Animated.Value(60)).current; // starts at 60%
  const noteDropAnim = useRef(new Animated.Value(0)).current;

  // Keyboard listeners
  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setIsKeyboardVisible(true),
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setIsKeyboardVisible(false),
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleDrop = () => {
    if (!memory.trim()) return;
    haptics.success();
    Keyboard.dismiss();
    setDropped(true);
    memoryRef.current = memory.trim();
    memoryRef.type = 'text';

    // Note drop animation
    Animated.timing(noteDropAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Jar shake animation
    Animated.sequence([
      Animated.timing(jarShake, { toValue: 8, duration: 80, useNativeDriver: true }),
      Animated.timing(jarShake, { toValue: -8, duration: 80, useNativeDriver: true }),
      Animated.timing(jarShake, { toValue: 5, duration: 80, useNativeDriver: true }),
      Animated.timing(jarShake, { toValue: -5, duration: 80, useNativeDriver: true }),
      Animated.timing(jarShake, { toValue: 0, duration: 80, useNativeDriver: true }),
    ]).start();

    // Fill to 80%
    Animated.timing(fillAnim, { toValue: 80, duration: 800, useNativeDriver: false }).start();
    setJarFillLevel(80);

    addJarMemory({
      content: memory.trim(),
      type: 'text',
      tinyCompliment: null,
      dayColor: colors.day4,
    });

    setTimeout(() => navigation.navigate('Day4TinyCompliment'), 900);
  };

  const charCount = memory.length;
  const isReady = memory.trim().length > 0;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenWrapper>
        <ProgressStrip currentDay={4} />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <DayHeader eyebrow="Day 4 · The Memory Jar" />

          {/* Title Section */}
          <Text style={styles.title}>Drop one memory here.</Text>
          <Text style={styles.subtitle}>
            A moment with your partner you never want to forget.
          </Text>

          {/* Jar Visual */}
          <Animated.View style={[styles.jarContainer, { transform: [{ translateX: jarShake }] }]}>
            {/* Decorative sparkles */}
            <Text style={styles.jarSparkle1}>✦</Text>
            <Text style={styles.jarSparkle2}>✧</Text>

            <Text style={styles.jarIcon}>🫙</Text>

            {/* Fill Bar */}
            <View style={styles.jarFillBar}>
              <Animated.View style={[styles.jarFill, {
                width: fillAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
              }]} />
            </View>

            {/* Fill Label */}
            <Text style={styles.jarFillLabel}>
              {dropped ? '80% full' : '60% full · 3 notes inside'}
            </Text>

            {/* Dropped note preview */}
            {dropped && (
              <Animated.View style={[styles.jarNoteCard, {
                opacity: noteDropAnim,
                transform: [{
                  translateY: noteDropAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                }],
              }]}>
                <Text style={styles.jarNoteIcon}>📝</Text>
                <Text style={styles.jarNoteText} numberOfLines={2}>"{memory.trim()}"</Text>
              </Animated.View>
            )}
          </Animated.View>

          {/* Input Area */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type a memory… a single moment, a look, a laugh"
              placeholderTextColor={colors.textHint}
              value={memory}
              onChangeText={setMemory}
              multiline
              textAlignVertical="top"
              maxLength={300}
              editable={!dropped}
            />
            <View style={styles.inputFooter}>
              <Text style={styles.hint}>
                🔒 Stays private · You'll see it on Day 5
              </Text>
              <Text style={[
                styles.charCount,
                charCount > 250 && { color: '#E67E22' },
                charCount >= 300 && { color: '#E74C3C' },
              ]}>
                {charCount}/300
              </Text>
            </View>
          </View>

          {/* Bottom spacer for CTA */}
          <View style={{ height: responsiveHeight(12) }} />
        </ScrollView>

        {/* CTA — hidden when keyboard is visible */}
        {!isKeyboardVisible && (
          <View style={[
            styles.ctaWrapper,
            { paddingBottom: Math.max(insets.bottom + 8, metrics.spacing.md) },
          ]}>
            <GradientButton
              text={dropped ? 'Dropping…' : 'Drop it in the jar 🫙'}
              onPress={handleDrop}
              disabled={!isReady || dropped}
              showArrow={!dropped}
              fullWidth
              gradientColors={colors.gradientBtn}
            />
          </View>
        )}
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingBottom: metrics.spacing.md,
  },

  // ── Title ───────────────────────────────────────────────
  title: {
    ...typography.displayMedium,
    color: c.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: responsiveFontSize(1.9),
    color: c.textSecondary,
    fontFamily: fonts.dmSansRegular,
    lineHeight: responsiveFontSize(1.9) * 1.5,
    marginBottom: metrics.spacing.lg,
  },

  // ── Jar ─────────────────────────────────────────────────
  jarContainer: {
    alignItems: 'center',
    marginBottom: metrics.spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(45,95,93,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  jarSparkle1: {
    position: 'absolute',
    top: 14,
    right: 20,
    fontSize: 12,
    color: 'rgba(45,95,93,0.2)',
  },
  jarSparkle2: {
    position: 'absolute',
    bottom: 18,
    left: 16,
    fontSize: 10,
    color: 'rgba(45,95,93,0.15)',
  },
  jarIcon: {
    fontSize: 56,
    marginBottom: 14,
  },
  jarFillBar: {
    width: '70%',
    height: 6,
    backgroundColor: 'rgba(45,95,93,0.08)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  jarFill: {
    height: '100%',
    backgroundColor: '#2DD4BF',
    borderRadius: 3,
  },
  jarFillLabel: {
    fontSize: 11,
    fontFamily: fonts.dmSansMedium,
    color: c.textHint,
    letterSpacing: 0.3,
  },
  jarNoteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: 'rgba(45,212,191,0.2)',
    gap: 8,
    maxWidth: '90%',
    shadowColor: '#2DD4BF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  jarNoteIcon: {
    fontSize: 16,
  },
  jarNoteText: {
    flex: 1,
    fontSize: 12,
    fontFamily: fonts.playfairItalic,
    color: c.text,
    lineHeight: 18,
  },

  // ── Input ───────────────────────────────────────────────
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(45,95,93,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  input: {
    color: c.text,
    fontSize: responsiveFontSize(1.9),
    fontFamily: fonts.dmSansRegular,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 12,
    minHeight: 130,
    lineHeight: responsiveFontSize(1.9) * 1.55,
  },
  inputFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingBottom: 14,
    paddingTop: 4,
  },
  charCount: {
    fontSize: 11,
    fontFamily: fonts.dmSansMedium,
    color: c.textHint,
  },
  hint: {
    fontSize: 11,
    fontFamily: fonts.dmSansRegular,
    color: c.textHint,
    flex: 1,
  },

  // ── CTA ─────────────────────────────────────────────────
  ctaWrapper: {
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingTop: metrics.spacing.md,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.04)',
  },
});
