import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { ProgressStrip } from '../components/common/ProgressStrip';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { colors } from '../theme';
import { useDayStore } from '../store/useDayStore';
import { reframeTextAsync } from '../services/toneReframer';
import { haptics } from '../utils/haptics';

type Nav = StackNavigationProp<RootStackParamList, 'Day4DropBox'>;

export const Day4DropBox: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const day4 = useDayStore((s) => s.day4);
  const completeDay4 = useDayStore((s) => s.completeDay4);

  const [rawText, setRawText] = useState('');
  const [reframed, setReframed] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [kept, setKept] = useState(false);
  const loadingOpacity = useRef(new Animated.Value(0)).current;

  const showReframeButton = rawText.length >= 20 && !reframed;

  const handleReframe = async () => {
    haptics.light();
    setLoading(true);
    Animated.timing(loadingOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();

    const result = await reframeTextAsync(rawText);
    // NEVER store rawText — clear it immediately
    setRawText('');
    setReframed(result);
    setLoading(false);
    haptics.success();
  };

  const handleKeep = () => {
    haptics.success();
    setKept(true);
    // Store only the reframe, never the original
    completeDay4({
      memoryContent: day4.memoryContent,
      memoryType: day4.memoryType,
      tinyComplimentWord: day4.tinyComplimentWord,
      daily2Q1: day4.daily2Q1,
      daily2Q2: day4.daily2Q2,
      daily2Status: day4.daily2Status,
      dropBoxUsed: true,
      dropBoxReframedText: reframed,
    });
    setTimeout(() => navigation.navigate('Home'), 400);
  };

  const handleSkip = () => {
    navigation.navigate('Home');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScreenWrapper backgroundColor="#110A1A">
        <ProgressStrip currentDay={4} />
        <View style={styles.body}>
          <Text style={styles.eyebrow}>Day 4 · Drop Box</Text>
          <Text style={styles.title}>Something you need to say?</Text>
          <Text style={styles.subtitle}>
            Write it raw. We'll help you say it better.{'\n'}
            The original is never saved.
          </Text>

          {!reframed ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Write what's on your mind…"
                placeholderTextColor="rgba(255,255,255,0.2)"
                value={rawText}
                onChangeText={setRawText}
                multiline
                textAlignVertical="top"
                editable={!loading}
              />
              <Text style={styles.privacyNote}>🔒 Original text is never stored or saved.</Text>

              {showReframeButton && (
                <TouchableOpacity style={styles.reframeBtn} activeOpacity={0.85} onPress={handleReframe} disabled={loading}>
                  <Text style={styles.reframeBtnLabel}>
                    {loading ? 'Reframing…' : 'Help me say this better →'}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <View style={styles.reframeResult}>
              <Text style={styles.reframeLabel}>A gentler way to say it</Text>
              <Text style={styles.reframeText}>"{reframed}"</Text>
              <View style={styles.reframeActions}>
                <TouchableOpacity style={styles.keepBtn} activeOpacity={0.85} onPress={handleKeep}>
                  <Text style={styles.keepBtnLabel}>{kept ? '✓ Saved' : 'Keep this'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.discardBtn} activeOpacity={0.7} onPress={handleSkip}>
                  <Text style={styles.discardBtnLabel}>Discard</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {!reframed && (
          <TouchableOpacity style={styles.skipLink} activeOpacity={0.7} onPress={handleSkip}>
            <Text style={styles.skipLinkLabel}>Skip Drop Box</Text>
          </TouchableOpacity>
        )}
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: 28, paddingTop: 24 },
  eyebrow: { color: colors.day4, fontSize: 12, fontFamily: 'Inter-SemiBold', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 },
  title: { fontSize: 26, color: '#FFFFFF', fontFamily: 'PlayfairDisplay-Bold', lineHeight: 36, marginBottom: 10 },
  subtitle: { fontSize: 15, color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter-Regular', lineHeight: 24, marginBottom: 24 },
  input: {
    color: '#FFFFFF', fontSize: 16, fontFamily: 'Inter-Regular',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12,
    padding: 16, minHeight: 140, lineHeight: 24, marginBottom: 12,
  },
  privacyNote: { color: 'rgba(255,255,255,0.25)', fontSize: 12, fontFamily: 'Inter-Regular', marginBottom: 16 },
  reframeBtn: {
    backgroundColor: `${colors.day4}30`, borderWidth: 1.5, borderColor: colors.day4,
    paddingVertical: 14, borderRadius: 100, alignItems: 'center',
  },
  reframeBtnLabel: { color: colors.day4, fontSize: 15, fontFamily: 'Inter-SemiBold' },
  reframeResult: {
    backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: 24, gap: 16,
  },
  reframeLabel: { color: 'rgba(255,255,255,0.35)', fontSize: 12, fontFamily: 'Inter-SemiBold', letterSpacing: 1.5, textTransform: 'uppercase' },
  reframeText: { color: '#FFFFFF', fontSize: 18, fontFamily: 'PlayfairDisplay-Italic', lineHeight: 28 },
  reframeActions: { flexDirection: 'row', gap: 12 },
  keepBtn: {
    flex: 1, backgroundColor: colors.day4, paddingVertical: 14, borderRadius: 100, alignItems: 'center',
  },
  keepBtnLabel: { color: '#FFFFFF', fontSize: 15, fontFamily: 'Inter-SemiBold' },
  discardBtn: {
    flex: 1, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', paddingVertical: 14, borderRadius: 100, alignItems: 'center',
  },
  discardBtnLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 15, fontFamily: 'Inter-Regular' },
  skipLink: { alignItems: 'center', paddingBottom: 40 },
  skipLinkLabel: { color: 'rgba(255,255,255,0.25)', fontSize: 13, fontFamily: 'Inter-Regular' },
});
