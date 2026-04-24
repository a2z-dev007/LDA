import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Animated,
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

type Nav = StackNavigationProp<RootStackParamList, 'Day4MemoryJar'>;

// Module-level ref to pass memory forward
export const memoryRef = { current: '', type: 'text' as 'text' | 'emoji' | 'skipped' };

export const Day4MemoryJar: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const day4 = useDayStore((s) => s.day4);
  const addJarMemory = useJournalStore((s) => s.addJarMemory);
  const setJarFillLevel = useJournalStore((s) => s.setJarFillLevel);

  const [memory, setMemory] = useState('');
  const [dropped, setDropped] = useState(false);
  const jarShake = useRef(new Animated.Value(0)).current;
  const fillAnim = useRef(new Animated.Value(60)).current; // starts at 60%

  const handleDrop = () => {
    if (!memory.trim()) return;
    haptics.success();
    setDropped(true);
    memoryRef.current = memory.trim();
    memoryRef.type = 'text';

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

    setTimeout(() => navigation.navigate('Day4TinyCompliment'), 600);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScreenWrapper backgroundColor="#110A1A">
        <ProgressStrip currentDay={4} />
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.eyebrow}>Day 4 · The Memory Jar</Text>
          <Text style={styles.title}>Drop one memory here.</Text>
          <Text style={styles.subtitle}>A moment with your partner you never want to forget.</Text>

          {/* Jar visual */}
          <Animated.View style={[styles.jarContainer, { transform: [{ translateX: jarShake }] }]}>
            <Text style={styles.jarIcon}>🫙</Text>
            <View style={styles.jarFillBar}>
              <Animated.View style={[styles.jarFill, {
                width: fillAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
              }]} />
            </View>
            {dropped && (
              <Text style={styles.jarNote} numberOfLines={2}>"{memory.trim()}"</Text>
            )}
          </Animated.View>

          <TextInput
            style={styles.input}
            placeholder="Type a memory… a single moment, a look, a laugh"
            placeholderTextColor="rgba(255,255,255,0.2)"
            value={memory}
            onChangeText={setMemory}
            multiline
            textAlignVertical="top"
            maxLength={300}
          />
          <Text style={styles.charCount}>{memory.length}/300</Text>
          <Text style={styles.hint}>This stays in your private jar. You'll see it again on Day 5.</Text>
        </ScrollView>

        <TouchableOpacity
          style={[styles.cta, !memory.trim() && styles.ctaDim]}
          activeOpacity={0.85}
          onPress={handleDrop}
          disabled={!memory.trim()}
        >
          <Text style={styles.ctaLabel}>Drop it in the jar →</Text>
        </TouchableOpacity>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 28, paddingBottom: 8 },
  eyebrow: { color: colors.day4, fontSize: 12, fontFamily: 'Inter-SemiBold', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 },
  title: { fontSize: 28, color: '#FFFFFF', fontFamily: 'PlayfairDisplay-Bold', lineHeight: 38, marginBottom: 10 },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter-Regular', lineHeight: 24, marginBottom: 28 },
  jarContainer: {
    alignItems: 'center', marginBottom: 24, backgroundColor: `${colors.day4}10`,
    borderRadius: 20, padding: 24, borderWidth: 1, borderColor: `${colors.day4}30`,
  },
  jarIcon: { fontSize: 52, marginBottom: 12 },
  jarFillBar: { width: '80%', height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, marginBottom: 8 },
  jarFill: { height: '100%', backgroundColor: colors.day4, borderRadius: 2 },
  jarNote: { color: colors.day4, fontSize: 13, fontFamily: 'PlayfairDisplay-Italic', textAlign: 'center', marginTop: 8 },
  input: {
    color: '#FFFFFF', fontSize: 16, fontFamily: 'Inter-Regular',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12,
    padding: 16, minHeight: 120, lineHeight: 24, marginBottom: 8,
  },
  charCount: { color: 'rgba(255,255,255,0.2)', fontSize: 12, fontFamily: 'Inter-Regular', textAlign: 'right', marginBottom: 16 },
  hint: { color: 'rgba(255,255,255,0.25)', fontSize: 13, fontFamily: 'Inter-Regular', lineHeight: 20 },
  cta: {
    backgroundColor: colors.day4, marginHorizontal: 28, marginBottom: 48,
    paddingVertical: 18, borderRadius: 100, alignItems: 'center',
  },
  ctaDim: { opacity: 0.4 },
  ctaLabel: { color: '#FFFFFF', fontSize: 17, fontFamily: 'Inter-SemiBold', letterSpacing: 0.3 },
});
