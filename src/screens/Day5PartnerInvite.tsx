import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { useAppColors } from '../theme';
import { useDayStore } from '../store/useDayStore';
import { useUserStore } from '../store/useUserStore';
import { useStreakStore } from '../store/useStreakStore';
import { haptics } from '../utils/haptics';

type Nav = StackNavigationProp<RootStackParamList, 'Day5PartnerInvite'>;

export const Day5PartnerInvite: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const setPartnerInviteSent = useDayStore((s) => s.setPartnerInviteSent);
  const day5 = useDayStore((s) => s.day5);
  const userName = useUserStore((s) => s.name);

  const handleInvite = async () => {
    haptics.success();
    setPartnerInviteSent(5);
    try {
      await Share.share({
        message: `${userName || 'Someone special'} has completed a 5-day relationship journey on Let's Date Again and wants you to join. Download the app and enter their invite code to see what they discovered about you. 💕`,
      });
    } catch {}
  };

  const handleSolo = () => {
    haptics.light();
    // Day 6+ — Daily 2 becomes ongoing habit
    Alert.alert(
      'Continue Solo',
      'From Day 6, the Daily 2 becomes your ongoing habit. Come back tomorrow.',
      [{ text: 'Got it', onPress: () => navigation.navigate('Home') }]
    );
  };

  return (
    <ScreenWrapper>
      <View style={styles.body}>
        <Text style={styles.title}>What do you want to do next?</Text>
        <Text style={styles.subtitle}>
          You've done the solo work. Now you can bring them in.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardIcon}>💌</Text>
          <Text style={styles.cardTitle}>Invite your partner</Text>
          <Text style={styles.cardDesc}>
            They'll see what you discovered about yourself — and you'll finally see their side of the mirror.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardIcon}>🌱</Text>
          <Text style={styles.cardTitle}>Continue solo for now</Text>
          <Text style={styles.cardDesc}>
            The Daily 2 becomes your ongoing habit from Day 6. Keep showing up.
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.inviteBtn} activeOpacity={0.85} onPress={handleInvite}>
          <Text style={styles.inviteBtnLabel}>Invite your partner →</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.soloBtn} activeOpacity={0.7} onPress={handleSolo}>
          <Text style={styles.soloBtnLabel}>Continue solo for now</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  body: { flex: 1, paddingHorizontal: 28, paddingTop: 60, gap: 24 },
  title: { fontSize: 28, color: c.text, fontFamily: 'PlayfairDisplay-Bold', lineHeight: 38 },
  subtitle: { fontSize: 16, color: c.textSecondary, fontFamily: 'Inter-Regular', lineHeight: 24 },
  card: {
    backgroundColor: c.surface, borderRadius: 16, padding: 20, gap: 8,
    borderWidth: 1, borderColor: c.surfaceBorder,
  },
  cardIcon: { fontSize: 28 },
  cardTitle: { fontSize: 18, color: c.text, fontFamily: 'PlayfairDisplay-Bold' },
  cardDesc: { fontSize: 14, color: c.textSecondary, fontFamily: 'Inter-Regular', lineHeight: 22 },
  actions: { paddingHorizontal: 28, paddingBottom: 48, gap: 12 },
  inviteBtn: {
    backgroundColor: c.primary, paddingVertical: 18, borderRadius: 100, alignItems: 'center',
  },
  inviteBtnLabel: { color: c.text, fontSize: 17, fontFamily: 'Inter-SemiBold', letterSpacing: 0.3 },
  soloBtn: { alignItems: 'center', paddingVertical: 12 },
  soloBtnLabel: { color: c.textHint, fontSize: 15, fontFamily: 'Inter-Regular' },
});
