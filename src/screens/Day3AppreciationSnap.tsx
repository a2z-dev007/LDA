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
import { useJournalStore } from '../store/useJournalStore';
import { haptics } from '../utils/haptics';

type Nav = StackNavigationProp<RootStackParamList, 'Day3AppreciationSnap'>;

export const Day3AppreciationSnap: React.FC = () => {
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
      <ScreenWrapper backgroundColor="#0B1020">
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
              placeholderTextColor="rgba(255,255,255,0.2)"
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

        <TouchableOpacity style={styles.cta} activeOpacity={0.85} onPress={handleSave}>
          <Text style={styles.ctaLabel}>{text.trim() ? 'Save this →' : 'Skip for now →'}</Text>
        </TouchableOpacity>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: 28, paddingTop: 24 },
  eyebrow: { color: colors.day3, fontSize: 12, fontFamily: 'Inter-SemiBold', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 },
  title: { fontSize: 22, color: '#FFFFFF', fontFamily: 'PlayfairDisplay-Bold', lineHeight: 32, marginBottom: 8 },
  subtitle: { fontSize: 18, color: 'rgba(255,255,255,0.6)', fontFamily: 'PlayfairDisplay-Italic', lineHeight: 28, marginBottom: 28 },
  inputCard: {},
  input: {
    color: '#FFFFFF', fontSize: 16, fontFamily: 'Inter-Regular',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12,
    padding: 16, minHeight: 120, lineHeight: 24,
  },
  savedNote: { color: colors.day3, fontSize: 14, fontFamily: 'Inter-SemiBold', marginTop: 12 },
  hint: { color: 'rgba(255,255,255,0.2)', fontSize: 12, fontFamily: 'Inter-Regular', marginTop: 16 },
  cta: {
    backgroundColor: colors.day3, marginHorizontal: 28, marginBottom: 48,
    paddingVertical: 18, borderRadius: 100, alignItems: 'center',
  },
  ctaLabel: { color: colors.dark, fontSize: 17, fontFamily: 'Inter-SemiBold', letterSpacing: 0.3 },
});
