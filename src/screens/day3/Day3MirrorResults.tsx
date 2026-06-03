import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Share, Linking, Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { ProgressStrip } from '../../components/common/ProgressStrip';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { useAppColors } from '../../theme';
import { assumptionsSets } from '../../data/quizData';
import { useDayStore } from '../../store/useDayStore';
import { useJournalStore } from '../../store/useJournalStore';
import { JarEnvelopeAnimation, JarEnvelopeHandle } from '../../components/common/JarEnvelopeAnimation';
import { metrics } from '../../theme/metrics';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { haptics } from '../../utils/haptics';
import { GradientButton } from '../../components/common/GradientButton';
import { Lock, UserPlus } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { captureRef } from 'react-native-view-shot';
import { fonts } from '../../theme/typography';
import { ScreenHeader } from '../../components/common/ScreenHeader';

type Nav = StackNavigationProp<RootStackParamList, 'Day3MirrorResults'>;

const WhatsAppIcon = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
      fill={color}
    />
  </Svg>
);

const ScreenshotIcon = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round">
    <Path d="M3 7V5a2 2 0 0 1 2-2h2" />
    <Path d="M17 3h2a2 2 0 0 1 2 2v2" />
    <Path d="M21 17v2a2 2 0 0 1-2 2h-2" />
    <Path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    <Path d="M9 9h6v6H9z" strokeDasharray="2 2" />
  </Svg>
);

export const Day3MirrorResults: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const day1 = useDayStore((s) => s.day1);
  const day3 = useDayStore((s) => s.day3);
  const viewRef = useRef<View>(null);

  const personalityKey = day1.personalityType ?? 'default';
  const questions = assumptionsSets[personalityKey] ?? assumptionsSets['default'];
  const trueCount = Object.values(day3.mirrorAnswers).filter(Boolean).length;
  const totalCount = questions.length || 10;

  const jarRef = useRef<JarEnvelopeHandle>(null);
  const headerAnim = useRef(new Animated.Value(0)).current;
  const addJarMemory = useJournalStore((s) => s.addJarMemory);
  const jarMemories = useJournalStore((s) => s.jarMemories);
  const initialJarCount = useRef(jarMemories.length).current;

  useEffect(() => {
    // Fade in
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Trigger envelope animation
    const timer = setTimeout(() => {
      if (jarRef.current) {
        jarRef.current.triggerEnvelope(() => {
          addJarMemory({
            content: `Mirror Game Score: ${trueCount}/${totalCount}`,
            type: 'text',
            tinyCompliment: null,
            dayColor: colors.day3,
          });
        });
      }
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppInvite = async () => {
    haptics.medium();
    const message = `I just completed the Assumptions Test on Let's Date Again! How well do you know me? Play with me here: https://letsdateagain.com/download`;
    const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;
    try {
      const supported = await Linking.canOpenURL(whatsappUrl);
      if (supported) {
        await Linking.openURL(whatsappUrl);
      } else {
        await Share.share({ message });
      }
    } catch {
      await Share.share({ message });
    }
  };

  const handleScreenshot = async () => {
    haptics.medium();
    try {
      if (viewRef.current) {
        const uri = await captureRef(viewRef, {
          format: 'png',
          quality: 0.9,
        });
        await Share.share({
          url: uri,
          title: 'My Results',
          message: `Here are my results from the Assumptions Test on Let's Date Again! 💕`,
        });
      }
    } catch (error) {
      console.error('Screenshot capture failed', error);
      await Share.share({
        message: `I just completed the Assumptions Test on Let's Date Again! I scored ${trueCount} out of 10. 💕`,
      });
    }
  };

  const handleInvite = () => {
    haptics.medium();
    // To be implemented later
  };

  const handleContinue = () => {
    haptics.medium();
    navigation.navigate('Day3MoodBoard');
  };

  const getBadgeText = (count: number) => {
    if (count >= 7) {
      return 'Badge: Deep +2 - Protecting +1';
    } else if (count <= 4) {
      return 'Badge: Present +2';
    } else {
      return 'Badge: Balanced';
    }
  };

  return (
    <ScreenWrapper>
      <ProgressStrip currentDay={3} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.jarWrapper, { opacity: headerAnim, top: responsiveHeight(-1) }]}>
          <JarEnvelopeAnimation ref={jarRef} initialCount={initialJarCount} />
        </Animated.View>

        <ScreenHeader 
          title="Your Results" 
          eyebrow="D3-2 · SPLIT SCREEN · OPEN LOOP"
        />

        {/* Card wrapper to screenshot */}
        <View ref={viewRef} collapsable={false} style={styles.captureContainer}>
          <View style={styles.splitContainer}>
            {/* Left Card: YOUR ANSWERS */}
            <View style={styles.answersCard}>
              <Text style={styles.cardHeader}>YOUR ANSWERS</Text>
              <View style={styles.answersList}>
                {questions.map((q, idx) => {
                  const isTrue = !!day3.mirrorAnswers[q.id];
                  return (
                    <View key={q.id} style={styles.cardAnswerRow}>
                      <Text style={styles.cardQuestionNumber}>Q{idx + 1}</Text>
                      <View style={[
                        styles.cardAnswerCircle,
                        isTrue ? styles.cardTruePill : styles.cardFalsePill
                      ]}>
                        <Text style={[
                          styles.cardAnswerText,
                          isTrue ? styles.cardTrueText : styles.cardFalseText
                        ]}>
                          {isTrue ? 'T' : 'F'}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Right Card: waiting for partner */}
            <View style={styles.lockedCard}>
              <View style={styles.lockedIconCircle}>
                <Lock size={28} color={colors.primary} opacity={0.6} strokeWidth={1.5} />
              </View>
              <Text style={styles.lockedCardText}>
                Their answers sealed{"\n"}until they join
              </Text>
            </View>
          </View>
        </View>

        {/* Action Grid */}
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={[styles.gridBtn, styles.whatsappBtn]}
            activeOpacity={0.8}
            onPress={handleWhatsAppInvite}
          >
            <View style={[styles.gridIconCircle, styles.whatsappIconCircle]}>
              <WhatsAppIcon color="#059669" />
            </View>
            <Text style={[styles.gridBtnLabel, styles.whatsappBtnLabel]}>WhatsApp{"\n"}invite</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.gridBtn, styles.screenshotBtn]}
            activeOpacity={0.8}
            onPress={handleScreenshot}
          >
            <View style={[styles.gridIconCircle, styles.screenshotIconCircle]}>
              <ScreenshotIcon color="#2563EB" />
            </View>
            <Text style={[styles.gridBtnLabel, styles.screenshotBtnLabel]}>Screenshot</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.gridBtn, styles.inviteBtn]}
            activeOpacity={0.8}
            onPress={handleInvite}
          >
            <View style={[styles.gridIconCircle, styles.inviteIconCircle]}>
              <UserPlus size={22} color="#EA580C" strokeWidth={2} />
            </View>
            <Text style={[styles.gridBtnLabel, styles.inviteBtnLabel]}>Invite</Text>
          </TouchableOpacity>
        </View>


      </ScrollView>

      {/* Main Gradient Button Action at the bottom */}
      <View style={styles.footer}>
        <GradientButton
          text="Next: Mood Board Match"
          onPress={handleContinue}
          showArrow={true}
          fullWidth={true}
          gradientColors={colors.gradientBtn}
        />
      </View>
    </ScreenWrapper>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  content: { padding: 20, paddingBottom: 16, position: 'relative' },
  jarWrapper: {
    position: 'absolute',
    right: metrics.layout.screenPaddingHz - 15,
    zIndex: 10,
    transform: [{ scale: 0.55 }],
  },
  captureContainer: {
    backgroundColor: '#F5FAF9',
    borderRadius: 24,
    padding: 4,
    marginBottom: 20,
  },
  splitContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  answersCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  cardHeader: {
    fontSize: 10,
    color: '#86A69F',
    fontFamily: fonts.dmSansBold,
    letterSpacing: 1.2,
    textAlign: 'center',
    marginBottom: 16,
  },
  answersList: {
    gap: 6,
  },
  cardAnswerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    height: 28,
  },
  cardQuestionNumber: {
    fontSize: 13,
    color: 'rgba(45,95,93,0.5)',
    fontFamily: fonts.dmSansBold,
  },
  cardAnswerCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTruePill: {
    backgroundColor: 'rgba(45,95,93,0.08)',
  },
  cardFalsePill: {
    backgroundColor: 'rgba(200,90,84,0.08)',
  },
  cardAnswerText: {
    fontSize: 11,
    fontFamily: fonts.dmSansBold,
  },
  cardTrueText: {
    color: '#2D5F5D',
  },
  cardFalseText: {
    color: '#C85A54',
  },
  lockedCard: {
    flex: 1,
    backgroundColor: 'rgba(45,95,93,0.02)',
    borderRadius: 20,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(45,95,93,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  lockedIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(45,95,93,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  lockedCardText: {
    fontSize: 12,
    color: 'rgba(45,95,93,0.6)',
    fontFamily: fonts.dmSansMedium,
    lineHeight: 18,
    textAlign: 'center',
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  gridBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  gridIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridBtnLabel: {
    fontSize: 11,
    fontFamily: fonts.dmSansBold,
    textAlign: 'center',
    lineHeight: 14,
  },
  whatsappBtn: {
    backgroundColor: '#EBFDF5',
    borderColor: '#A7F3D0',
  },
  whatsappIconCircle: {
    backgroundColor: '#D1FAE5',
  },
  whatsappBtnLabel: {
    color: '#047857',
  },
  screenshotBtn: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  screenshotIconCircle: {
    backgroundColor: '#DBEAFE',
  },
  screenshotBtnLabel: {
    color: '#1D4ED8',
  },
  inviteBtn: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FFEDD5',
  },
  inviteIconCircle: {
    backgroundColor: '#FFEDD5',
  },
  inviteBtnLabel: {
    color: '#C2410C',
  },
  badgeText: {
    fontSize: 12,
    color: 'rgba(45,95,93,0.6)',
    fontFamily: fonts.dmSansMedium,
    textAlign: 'center',
    marginBottom: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 34,
  },
});
