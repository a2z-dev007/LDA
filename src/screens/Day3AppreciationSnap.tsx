import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { ProgressStrip } from '../components/common/ProgressStrip';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { useAppColors } from '../theme';
import { useDayStore } from '../store/useDayStore';
import { useJournalStore } from '../store/useJournalStore';
import { haptics } from '../utils/haptics';

type Nav = StackNavigationProp<RootStackParamList, 'Day3AppreciationSnap'>;

export const Day3AppreciationSnap: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const setAppreciationSnap = useDayStore((s) => s.setAppreciationSnap);
  const addEntry = useJournalStore((s) => s.addEntry);
  const [text, setText] = useState('');
  const flyAnim = useRef(new Animated.Value(0)).current;
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!text.trim()) {
      navigation.navigate('Day3AssumptionsTest');
      return;
    }
    haptics.success();
    setAppreciationSnap(text.trim());
    addEntry({ day: 3, type: 'appreciation', content: text.trim() });

    // Arc animation — card flies to journal
    setSaved(true);
    Animated.sequence([
      Animated.timing(flyAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start(() => {
      setTimeout(() => navigation.navigate('Day3AssumptionsTest'), 200);
    });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScreenWrapper>
        <ProgressStrip currentDay={3} />
        <View style={styles.body}>
          <Text style={styles.eyebrow}>Day 3 · Quick Win</Text>
          <Text style={styles.title}>
            Before we test what you know about them —
          </Text>
          <Text style={styles.subtitle}>
            What do you want them to know about you right now?
          </Text>

          <Animated.View style={[styles.inputCard, {
            opacity: flyAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
            transform: [{
              translateY: flyAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -80] }),
            }],
          }]}>
            <TextInput
              style={styles.input}
              placeholder="Write something true…"
          placeholderTextColor={colors.textHint}
              value={text}
              onChangeText={setText}
              multiline
              textAlignVertical="top"
              autoFocus
            />
          </Animated.View>

          {saved && (
            <Text style={styles.savedNote}>✓ Saved to your journal</Text>
          )}

          <Text style={styles.hint}>
            +0.5 dedication points for this quick win
          </Text>
        </View>

        <TouchableOpacity style={styles.ctaTouch} activeOpacity={0.85} onPress={handleSave}>
          <LinearGradient colors={[colors.buttonGradientStart, colors.buttonGradientEnd]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cta}>
            <Text style={styles.ctaLabel}>{text.trim() ? 'Save this →' : 'Skip for now →'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  body: { flex: 1, paddingHorizontal: 28, paddingTop: 24 },
  eyebrow: { color: c.day3, fontSize: 12, fontFamily: 'Inter-SemiBold', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 },
  title: { fontSize: 22, color: c.text, fontFamily: 'PlayfairDisplay-Bold', lineHeight: 32, marginBottom: 8 },
  subtitle: { fontSize: 18, color: c.textSecondary, fontFamily: 'PlayfairDisplay-Italic', lineHeight: 28, marginBottom: 28 },
  inputCard: {},
  input: {
    color: c.text, fontSize: 16, fontFamily: 'Inter-Regular',
    borderWidth: 1, borderColor: c.surfaceBorder, borderRadius: 12,
    padding: 16, minHeight: 120, lineHeight: 24,
  },
  savedNote: { color: c.day3, fontSize: 14, fontFamily: 'Inter-SemiBold', marginTop: 12 },
  hint: { color: c.textHint, fontSize: 12, fontFamily: 'Inter-Regular', marginTop: 16 },
  ctaTouch: { marginHorizontal: 28, marginBottom: 48, borderRadius: 100, shadowColor: c.glowPrimary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8 },
  cta: { paddingVertical: 18, borderRadius: 100, alignItems: 'center' },
  ctaLabel: { color: c.onPrimary, fontSize: 17, fontFamily: 'Inter-SemiBold', letterSpacing: 0.3 },
});
