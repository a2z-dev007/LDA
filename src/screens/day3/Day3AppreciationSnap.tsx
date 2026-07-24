import React, { useState, useRef } from 'react';
import { DayHeader } from '../../components/common/DayHeader';
import { DayCTA } from '../../components/common/DayCTA';
import {
  View, Text, StyleSheet,
  KeyboardAvoidingView, Platform, Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { ProgressStrip } from '../../components/common/ProgressStrip';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { useAppColors } from '../../theme';
import { useDayStore } from '../../store/useDayStore';
import { useJournalStore } from '../../store/useJournalStore';
import { haptics } from '../../utils/haptics';
import { AIInput } from '../../components/common/AIInput';

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
      navigation.navigate('Day3FinishMySentence');
      return;
    }
    haptics.success();
    setAppreciationSnap(text.trim());
    addEntry({ day: 3, type: 'appreciation', content: text.trim() });

    setSaved(true);
    Animated.sequence([
      Animated.timing(flyAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start(() => {
      setTimeout(() => navigation.navigate('Day3FinishMySentence'), 200);
    });
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ProgressStrip currentDay={3} />
        <View style={styles.body}>
          <DayHeader eyebrow="Day 3 · The Mirror Game" />
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
            <AIInput
              value={text}
              onChangeText={setText}
              context="appreciation"
              question="Before we test what you know about them — What do you want them to know about you right now?"
              placeholder="Write something true…"
              maxLength={150}
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

        <DayCTA title={text.trim() ? "Save to Journal" : "Skip for now"} onPress={handleSave} />
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  body: { flex: 1, paddingHorizontal: 28, paddingTop: 24 },
  title: { fontSize: 22, color: c.text, fontFamily: 'PlayfairDisplay-Bold', lineHeight: 32, marginBottom: 8 },
  subtitle: { fontSize: 18, color: c.textSecondary, fontFamily: 'PlayfairDisplay-Italic', lineHeight: 28, marginBottom: 28 },
  inputCard: {},
  savedNote: { color: c.day3, fontSize: 14, fontFamily: 'Inter-SemiBold', marginTop: 12 },
  hint: { color: c.textHint, fontSize: 12, fontFamily: 'Inter-Regular', marginTop: 16 },
});
