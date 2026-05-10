import React, { useState } from 'react';
import { DayHeader } from '../components/common/DayHeader';
import { DayCTA } from '../components/common/DayCTA';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform,
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
import { DayEndJarModal } from '../components/common/DayEndJarModal';

type Nav = StackNavigationProp<RootStackParamList, 'Day3OneCertainty'>;

export const Day3OneCertainty: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const setOneCertainty = useDayStore((s) => s.setOneCertainty);
  const addEntry = useJournalStore((s) => s.addEntry);
  const [text, setText] = useState('');
  const [showJarModal, setShowJarModal] = useState(false);

  const handleSave = () => {
    haptics.success();
    const trimmed = text.trim();
    if (trimmed) {
      setOneCertainty(trimmed);
      addEntry({ day: 3, type: 'certainty', content: trimmed });
    }
    setShowJarModal(true);
  };

  const handleModalNext = () => {
    setShowJarModal(false);
    navigation.navigate('Home');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScreenWrapper>
        <ProgressStrip currentDay={3} />
        <View style={styles.body}>
          <DayHeader eyebrow="Day 3 · Quick Win 2" />
          <Text style={styles.title}>
            What's the one thing you know for certain?
          </Text>
          <Text style={styles.subtitle}>
            After all those assumptions — what do you know is absolutely true about your partner?
          </Text>

          <TextInput
            style={styles.input}
            placeholder="I know for certain that…"
        placeholderTextColor={colors.textHint}
            value={text}
            onChangeText={setText}
            multiline
            textAlignVertical="top"
            autoFocus
          />
          <Text style={styles.hint}>This will appear in your Day 5 report.</Text>
        </View>

        <DayCTA title={text.trim() ? 'Save this ' : 'Skip '} onPress={handleSave} />
      </ScreenWrapper>

      <DayEndJarModal 
        visible={showJarModal}
        currentDay={3}
        onNext={handleModalNext}
      />
    </KeyboardAvoidingView>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  body: { flex: 1, paddingHorizontal: 28, paddingTop: 24 },
  eyebrow: { color: c.day3, fontSize: 12, fontFamily: 'Inter-SemiBold', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 },
  title: { fontSize: 26, color: c.text, fontFamily: 'PlayfairDisplay-Bold', lineHeight: 36, marginBottom: 12 },
  subtitle: { fontSize: 16, color: c.textSecondary, fontFamily: 'Inter-Regular', lineHeight: 24, marginBottom: 28 },
  input: {
    color: c.text, fontSize: 16, fontFamily: 'Inter-Regular',
    borderWidth: 1, borderColor: c.surfaceBorder, borderRadius: 12,
    padding: 16, minHeight: 120, lineHeight: 24, marginBottom: 12,
  },
  hint: { color: c.textHint, fontSize: 12, fontFamily: 'Inter-Regular' },
});
