import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { DayHeader } from '../components/common/DayHeader';
import { ProgressStrip } from '../components/common/ProgressStrip';
import { useAppColors } from '../theme';
import { typography, fonts } from '../theme/typography';
import { metrics } from '../theme/metrics';
import { haptics } from '../utils/haptics';
import { useDayStore } from '../store/useDayStore';
import { useJournalStore } from '../store/useJournalStore';
import { Check, BookOpen } from 'lucide-react-native';
import { GradientButton } from '../components/common/GradientButton';
import {
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

type Nav = StackNavigationProp<RootStackParamList, 'Day2OneGoodThing'>;

export const Day2OneGoodThing: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const setDay2OneGoodThing = useDayStore((s) => s.setDay2OneGoodThing);
  const addEntry = useJournalStore((s) => s.addEntry);
  const [text, setText] = useState('');

  const isValid = text.trim().length >= 10 && text.trim().length <= 80;

  const handleSave = () => {
    if (isValid) {
      haptics.success();
      const trimmed = text.trim();
      setDay2OneGoodThing(trimmed);
      addEntry({ day: 2, type: 'one_good_thing', content: trimmed });
      navigation.navigate('Day2MoodFollowUp');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenWrapper>
        <ProgressStrip currentDay={2} />
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <DayHeader eyebrow="One Good Thing" />
          
          <Text style={styles.prompt}>
            "Before anything else — name one thing about your partner that made you feel something good recently. It can be tiny."
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="The way they laughed at my terrible joke last night."
              placeholderTextColor={colors.textHint}
              value={text}
              onChangeText={setText}
              multiline
              maxLength={80}
              textAlignVertical="top"
              autoFocus
            />
            <View style={styles.charCountContainer}>
              <Text style={styles.charCountText}>
                {text.length} / 80 chars
              </Text>
              {text.trim().length >= 10 && (
                <View style={styles.signalBadge}>
                  <Check size={12} color={colors.primary} />
                  <Text style={styles.signalText}>Dedication signal</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.journalAnimHint}>
            <View style={styles.hintIconBox}>
              <Text style={styles.hintIconEmoji}>💬</Text>
            </View>
            <Text style={styles.hintArrow}>→</Text>
            <View style={[styles.hintIconBox, { backgroundColor: 'rgba(45,212,191,0.1)' }]}>
              <BookOpen size={20} color={colors.primary} />
            </View>
            <Text style={styles.hintDesc}>animates to journal</Text>
          </View>

        </ScrollView>
        
        <View style={styles.footer}>
          <GradientButton
            text="Save to Journal"
            onPress={handleSave}
            disabled={!isValid}
            showArrow={true}
            fullWidth={true}
            gradientColors={colors.gradientBtn}
          />
        </View>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: metrics.layout.screenPaddingHz, paddingTop: metrics.spacing.md, paddingBottom: metrics.spacing.xl },
  prompt: {
    ...typography.displaySmall,
    color: c.text,
    fontFamily: 'PlayfairDisplay-Italic',
    lineHeight: responsiveFontSize(3.8),
    marginBottom: metrics.spacing.xl,
  },
  inputContainer: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: metrics.radius.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.9)',
    padding: metrics.spacing.md,
    marginBottom: metrics.spacing.xl,
  },
  input: {
    color: c.text,
    ...typography.bodyMedium,
    minHeight: responsiveHeight(15),
    lineHeight: 24,
    marginBottom: metrics.spacing.sm,
  },
  charCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: metrics.spacing.sm,
  },
  charCountText: {
    ...typography.captionSmall,
    color: c.textHint,
  },
  signalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  signalText: {
    ...typography.captionSmall,
    color: c.primary,
    fontFamily: 'Inter-SemiBold',
  },
  journalAnimHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: metrics.spacing.md,
    opacity: 0.6,
  },
  hintIconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: c.surfaceBorder,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintIconEmoji: {
    fontSize: 18,
  },
  hintArrow: {
    color: c.textHint,
  },
  hintDesc: {
    ...typography.captionSmall,
    color: c.textHint,
  },
  footer: {
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingBottom: metrics.spacing.xl,
    paddingTop: metrics.spacing.sm,
  },
});
