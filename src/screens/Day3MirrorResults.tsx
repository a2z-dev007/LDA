import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Share,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { ProgressStrip } from '../components/common/ProgressStrip';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { useAppColors } from '../theme';
import { assumptionsSets } from '../data/quizData';
import { useDayStore } from '../store/useDayStore';
import { haptics } from '../utils/haptics';

type Nav = StackNavigationProp<RootStackParamList, 'Day3MirrorResults'>;

export const Day3MirrorResults: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const day1 = useDayStore((s) => s.day1);
  const day3 = useDayStore((s) => s.day3);
  const setPartnerInviteSent = useDayStore((s) => s.setPartnerInviteSent);

  const personalityKey = day1.personalityType ?? 'default';
  const questions = assumptionsSets[personalityKey] ?? assumptionsSets['default'];
  const trueCount = Object.values(day3.mirrorAnswers).filter(Boolean).length;

  const handleShareCard = async () => {
    haptics.medium();
    try {
      await Share.share({
        message: `I just completed the Assumptions Test on Let's Date Again. ${trueCount} of 10 — how well do you know me? 💕 #LetsDateAgain`,
      });
    } catch {}
  };

  const handleInvitePartner = () => {
    haptics.success();
    setPartnerInviteSent(3);
    navigation.navigate('Home');
  };

  return (
    <ScreenWrapper backgroundColor="#0B1020">
      <ProgressStrip currentDay={3} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>Day 3 · Mirror Results</Text>
        <Text style={styles.title}>Your answers</Text>
        <Text style={styles.subtitle}>
          The right column is waiting for your partner.
        </Text>

        {/* Split screen */}
        <View style={styles.splitContainer}>
          {/* Left — user answers */}
          <View style={styles.column}>
            <Text style={styles.colHeader}>You said</Text>
            {questions.map((q, i) => (
              <View key={q.id} style={styles.answerRow}>
                <View style={[
                  styles.answerPill,
                  day3.mirrorAnswers[q.id] ? styles.truePill : styles.falsePill,
                ]}>
                  <Text style={styles.answerPillText}>
                    {day3.mirrorAnswers[q.id] ? 'TRUE' : 'FALSE'}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Right — blurred/locked */}
          <View style={styles.column}>
            <Text style={styles.colHeader}>They'd say</Text>
            {questions.map((q) => (
              <View key={q.id} style={styles.answerRow}>
                <View style={styles.lockedPill}>
                  <Text style={styles.lockIcon}>🔒</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            Since your partner isn't onboarded yet, you can still share this card.
          </Text>
        </View>
      </ScrollView>

      {/* Screenshot icon top-right handled by OS */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.shareBtn} activeOpacity={0.85} onPress={handleShareCard}>
          <Text style={styles.shareBtnLabel}>Share this card</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.inviteBtn} activeOpacity={0.85} onPress={handleInvitePartner}>
          <Text style={styles.inviteBtnLabel}>Invite my partner →</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.skipBtn} activeOpacity={0.7} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.skipBtnLabel}>Continue solo</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  content: { padding: 28, paddingBottom: 16 },
  eyebrow: { color: c.day3, fontSize: 12, fontFamily: 'Inter-SemiBold', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 },
  title: { fontSize: 26, color: c.text, fontFamily: 'PlayfairDisplay-Bold', marginBottom: 8 },
  subtitle: { fontSize: 15, color: c.textSecondary, fontFamily: 'Inter-Regular', marginBottom: 24 },
  splitContainer: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  column: { flex: 1, gap: 8 },
  colHeader: { color: c.textHint, fontSize: 11, fontFamily: 'Inter-SemiBold', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 },
  answerRow: { height: 36, justifyContent: 'center' },
  answerPill: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, alignSelf: 'flex-start' },
  truePill: { backgroundColor: `${c.day3}30`, borderWidth: 1, borderColor: c.day3 },
  falsePill: { backgroundColor: c.surface, borderWidth: 1, borderColor: c.surfaceBorder },
  answerPillText: { color: c.text, fontSize: 12, fontFamily: 'Inter-SemiBold' },
  lockedPill: {
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, alignSelf: 'flex-start',
    backgroundColor: c.surface, borderWidth: 1, borderColor: c.surfaceBorder,
  },
  lockIcon: { fontSize: 14 },
  banner: {
    backgroundColor: c.surface, borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: c.surfaceBorder,
  },
  bannerText: { color: c.textSecondary, fontSize: 13, fontFamily: 'Inter-Regular', lineHeight: 20, textAlign: 'center' },
  actions: { paddingHorizontal: 28, paddingBottom: 40, gap: 10 },
  shareBtn: {
    backgroundColor: c.surface, paddingVertical: 16, borderRadius: 100,
    alignItems: 'center', borderWidth: 1, borderColor: c.surfaceBorder,
  },
  shareBtnLabel: { color: c.text, fontSize: 16, fontFamily: 'Inter-SemiBold' },
  inviteBtn: {
    backgroundColor: c.day3, paddingVertical: 16, borderRadius: 100, alignItems: 'center',
  },
  inviteBtnLabel: { color: c.dark, fontSize: 16, fontFamily: 'Inter-SemiBold' },
  skipBtn: { alignItems: 'center', paddingVertical: 8 },
  skipBtnLabel: { color: c.textHint, fontSize: 14, fontFamily: 'Inter-Regular' },
});
