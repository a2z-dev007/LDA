import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, ScrollView, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { useAppColors } from '../../theme';
import { useDayStore } from '../../store/useDayStore';
import { useUserStore } from '../../store/useUserStore';
import { haptics } from '../../utils/haptics';
import { GradientButton } from '../../components/common/GradientButton';
import { ChevronLeft, Clock, Heart, CheckCircle2 } from 'lucide-react-native';

type Nav = StackNavigationProp<RootStackParamList, 'Day5PartnerInvite'>;

export const Day5PartnerInvite: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const setPartnerInviteSent = useDayStore((s) => s.setPartnerInviteSent);
  const userName = useUserStore((s) => s.name);
  
  const [inviteCode, setInviteCode] = useState('');
  const [partnerCode, setPartnerCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(3540); // 59 minutes
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Generate random 8-digit code
    const code = Math.floor(10000000 + Math.random() * 90000000).toString();
    setInviteCode(code);

    // Countdown timer
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 3540));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleSendCode = async () => {
    haptics.medium();
    try {
      await Share.share({
        message: `Here is my invite code to connect on Let's Date Again: ${inviteCode}. Enter this code in the app to connect and unlock our shared journey! 💕`,
      });
    } catch {}
  };

  const handleConnect = () => {
    haptics.medium();
    setIsConnecting(true);
    
    // Simulate API pairing request
    setTimeout(() => {
      haptics.success();
      setIsConnecting(false);
      setIsConnected(true);
      setPartnerInviteSent(5);
    }, 1500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `Expires in ${mins} minute${mins !== 1 ? 's' : ''}`;
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header row with back button */}
          <View style={styles.headerRow}>
            <TouchableOpacity 
              style={styles.backBtn} 
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <ChevronLeft size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <Text style={styles.title}>Connect with Your Partner</Text>
            <Text style={styles.subtitle}>
              All your details, including answers and journal entries will be shared with your partner.
            </Text>

            {/* Card 1: Send Code */}
            <View style={styles.card}>
              <Text style={styles.cardHeaderTitle}>Send this code to your partner</Text>
              
              <Text style={styles.codeText}>{inviteCode}</Text>
              
              <View style={styles.expiryRow}>
                <Clock size={14} color={colors.textSecondary} style={{ marginRight: 6 }} />
                <Text style={styles.expiryText}>{formatTime(timeLeft)}</Text>
              </View>

              <TouchableOpacity 
                style={styles.outlineBtn} 
                onPress={handleSendCode}
                activeOpacity={0.75}
              >
                <Text style={styles.outlineBtnLabel}>Send code</Text>
              </TouchableOpacity>
            </View>

            {/* Card 2: Enter Partner's Code */}
            <View style={styles.card}>
              <Text style={styles.cardHeaderTitle}>Enter your partner's code</Text>
              
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.codeInput}
                  placeholder="Enter the code"
                  placeholderTextColor={colors.textHint}
                  value={partnerCode}
                  onChangeText={(val) => {
                    const cleaned = val.replace(/[^0-9]/g, '').slice(0, 8);
                    setPartnerCode(cleaned);
                  }}
                  keyboardType="numeric"
                  maxLength={8}
                />
              </View>

              <GradientButton
                text={isConnecting ? "Connecting..." : "Connect"}
                onPress={handleConnect}
                disabled={isConnecting || partnerCode.length !== 8}
                gradientColors={colors.gradientBtn || [colors.buttonGradientStart, colors.buttonGradientEnd]}
                showArrow={false}
                fullWidth
                style={{ marginTop: 8 }}
              />
            </View>

            <TouchableOpacity
              style={[styles.outlineBtn, { marginTop: 12, marginBottom: 16 }]}
              onPress={() => {
                haptics.light();
                navigation.navigate('Home');
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.outlineBtnLabel}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <Modal
        transparent
        visible={isConnected}
        animationType="fade"
      >
        <View style={styles.successOverlay}>
          <View style={styles.successContainer}>
            <View style={styles.successIconCircle}>
              <CheckCircle2 size={40} color="#2DD4BF" />
              <Heart size={20} color="#2DD4BF" fill="#2DD4BF" style={{ position: 'absolute' }} />
            </View>
            <Text style={styles.successTitle}>Connected!</Text>
            <Text style={styles.successDesc}>
              You are now connected with your partner. Together, you will see both sides of the mirror.
            </Text>
            <GradientButton
              text="Go to Dashboard"
              onPress={() => {
                setIsConnected(false);
                navigation.navigate('Home');
              }}
              showArrow={false}
              gradientColors={colors.gradientBtn || [colors.buttonGradientStart, colors.buttonGradientEnd]}
              fullWidth
            />
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  headerRow: {
    paddingHorizontal: 24,
    // paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: c.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 24,
  },
  title: {
    fontSize: 32,
    color: c.text,
    fontFamily: 'PlayfairDisplay-Bold',
    lineHeight: 42,
  },
  subtitle: {
    fontSize: 16,
    color: c.textSecondary,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
  },
  card: {
    backgroundColor: c.glassCardBg || 'rgba(255, 255, 255, 0.72)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1.5,
    borderColor: c.glassBorder || 'rgba(255, 255, 255, 0.3)',
    shadowColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
    gap: 16,
  },
  cardHeaderTitle: {
    fontSize: 17,
    color: c.text,
    fontFamily: 'Inter-SemiBold',
  },
  codeText: {
    fontSize: 38,
    color: c.primary,
    fontFamily: 'DMSans-Bold',
    textAlign: 'center',
    letterSpacing: 3,
    marginVertical: 4,
  },
  expiryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expiryText: {
    fontSize: 14,
    color: c.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  outlineBtn: {
    borderWidth: 1.5,
    borderColor: c.primary,
    borderRadius: 100,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  outlineBtnLabel: {
    color: c.primary,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  inputWrapper: {
    backgroundColor: c.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: c.glassBorder || 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'ios' ? 14 : 4,
    justifyContent: 'center',
  },
  codeInput: {
    color: c.text,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    letterSpacing: 1,
  },
  successOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  successContainer: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: c.glassCardBg || 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: c.glassBorder || 'rgba(255, 255, 255, 0.4)',
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(45, 212, 191, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 22,
    color: c.text,
    fontFamily: 'PlayfairDisplay-Bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  successDesc: {
    fontSize: 15,
    color: c.textSecondary,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
  },
});

