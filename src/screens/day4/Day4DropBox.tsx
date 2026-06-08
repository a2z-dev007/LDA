import React, { useState, useRef, useEffect } from 'react';
import { DayHeader } from '../../components/common/DayHeader';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Animated, ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { ProgressStrip } from '../../components/common/ProgressStrip';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { GradientButton } from '../../components/common/GradientButton';
import { EnhanceAIButton } from '../../components/common/EnhanceAIButton';
import { useAppColors } from '../../theme';
import { useDayStore } from '../../store/useDayStore';
import { useStreakStore } from '../../store/useStreakStore';
import { reframeTextAsync } from '../../services/toneReframer';
import { haptics } from '../../utils/haptics';
import { metrics } from '../../theme/metrics';
import { typography, fonts } from '../../theme/typography';
import { Lock, Sparkles, Heart, MessageSquare, Zap, MessageCircle, Check } from 'lucide-react-native';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Nav = StackNavigationProp<RootStackParamList, 'Day4DropBox'>;

const CONTAINER_WIDTH = responsiveWidth(88);
const TAB_WIDTH = (CONTAINER_WIDTH - 8) / 2;

const PRESETS: Record<string, string[]> = {
  compliment: [
    "You make hard days lighter.",
    "I notice the small things you do.",
    "You're my favourite person to do nothing with."
  ],
  memory: [
    "That late night drive when we got lost.",
    "Cooking together last Sunday, even though we burned the food.",
    "Walking in the rain last autumn."
  ],
  challenge: [
    "Let's go one whole day without our phones.",
    "I challenge you to plan our next surprise date.",
    "Let's try a new recipe together this weekend."
  ],
  unsaid: [
    "Sometimes I worry I don't say thank you enough.",
    "I really appreciate how hard you've been working.",
    "I'm so glad we started this 5-day journey."
  ]
};

export const Day4DropBox: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  
  const day4 = useDayStore((s) => s.day4);
  const setLoveDrop = useDayStore((s) => s.setLoveDrop);
  const setDay4DropBoxUsed = useDayStore((s) => s.setDay4DropBoxUsed);

  // Mode: 'seal' is Love Drop, 'reframe' is Drop Box
  const [mode, setMode] = useState<'seal' | 'reframe'>('seal');
  const [rawText, setRawText] = useState('');
  const [reframed, setReframed] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sealType, setSealType] = useState<'compliment' | 'memory' | 'challenge' | 'unsaid' | null>(null);

  // Tab indicator sliding animation
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: mode === 'seal' ? 0 : 1,
      tension: 100,
      friction: 12,
      useNativeDriver: true,
    }).start();
  }, [mode]);

  const indicatorTranslateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, TAB_WIDTH],
  });

  const handleReframe = async () => {
    if (rawText.trim().length < 20) return;
    haptics.light();
    setLoading(true);
    const result = await reframeTextAsync(rawText);
    setReframed(result);
    setLoading(false);
    haptics.success();
  };

  const handleSeal = () => {
    if (!sealType || !rawText.trim()) return;
    haptics.success();
    // Save to store
    setLoveDrop(sealType, rawText.trim());
    // Navigate to Trivia Fact
    navigation.navigate('Day4TriviaFact');
  };

  const handleKeepReframe = () => {
    if (!reframed) return;
    haptics.success();
    // Save to store
    setDay4DropBoxUsed(true, reframed);
    // Navigate to Trivia Fact
    navigation.navigate('Day4TriviaFact');
  };

  const handleEditBeforeKeeping = () => {
    haptics.light();
    if (reframed) {
      setRawText(reframed);
      setReframed(null);
    }
  };

  const handleSelectSealType = (type: 'compliment' | 'memory' | 'challenge' | 'unsaid') => {
    haptics.light();
    setSealType(type);
    setRawText(''); // clear input on type switch
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handlePresetTap = (text: string) => {
    haptics.light();
    setRawText(text);
  };

  const isLoveDropReady = sealType !== null && rawText.trim().length > 0;

  const sealOptions = [
    {
      id: 'compliment' as const,
      title: 'A compliment',
      desc: 'Tell them something that goes unsaid',
      Icon: Heart,
      color: '#E8799D',
      bgColor: '#FFF0F3'
    },
    {
      id: 'memory' as const,
      title: 'A memory only you two share',
      desc: 'Capture a moment in time',
      Icon: MessageSquare,
      color: '#3B82F6',
      bgColor: '#F0F6FF'
    },
    {
      id: 'challenge' as const,
      title: 'A challenge for them',
      desc: 'Keep things playful and moving forward',
      Icon: Zap,
      color: '#F5A67A',
      bgColor: '#FFF7F2'
    },
    {
      id: 'unsaid' as const,
      title: "Something I've been meaning to say",
      desc: 'Quiet thoughts that need a safe space',
      Icon: MessageCircle,
      color: '#B8A8D8',
      bgColor: '#F6F3FC'
    }
  ];

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenWrapper>
        <ProgressStrip currentDay={4} />
        
        <ScrollView 
          ref={scrollRef}
          style={styles.scroll} 
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <DayHeader eyebrow="Game 04 · Love Drop" />

          {/* Redesigned Tab Selector */}
          <View style={styles.tabContainer}>
            <Animated.View style={[styles.slidingIndicator, { transform: [{ translateX: indicatorTranslateX }] }]} />
            
            <TouchableOpacity 
              style={styles.tabBtn} 
              activeOpacity={0.8}
              onPress={() => { haptics.light(); setMode('seal'); }}
            >
              <Text style={[styles.tabBtnText, mode === 'seal' && styles.tabBtnTextActive]}>
                🧡 Love Drop
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.tabBtn} 
              activeOpacity={0.8}
              onPress={() => { haptics.light(); setMode('reframe'); }}
            >
              <Text style={[styles.tabBtnText, mode === 'reframe' && styles.tabBtnTextActive]}>
                📦 Drop Box
              </Text>
            </TouchableOpacity>
          </View>

          {mode === 'seal' ? (
            /* LOVE DROP TAB */
            <View style={styles.flowContainer}>
              <Text style={styles.mainTitle}>Leave something for your partner.</Text>
              <Text style={styles.serifSubtitle}>They'll find it when they join.</Text>

              {/* Vertical Theme Cards */}
              <View style={styles.sealCardsContainer}>
                {sealOptions.map((opt) => {
                  const isSelected = sealType === opt.id;
                  return (
                    <TouchableOpacity
                      key={opt.id}
                      activeOpacity={0.8}
                      onPress={() => handleSelectSealType(opt.id)}
                      style={[
                        styles.sealCard,
                        isSelected ? { borderColor: opt.color, backgroundColor: opt.bgColor } : null
                      ]}
                    >
                      <View style={[styles.sealCardIconBg, { backgroundColor: opt.color + '15' }]}>
                        <opt.Icon size={18} color={opt.color} />
                      </View>
                      
                      <View style={styles.sealCardBody}>
                        <Text style={[styles.sealCardTitle, isSelected && { color: opt.color, fontFamily: fonts.dmSansBold }]}>
                          {opt.title}
                        </Text>
                        <Text style={styles.sealCardDesc}>{opt.desc}</Text>
                      </View>

                      <View style={[
                        styles.checkmarkCircle, 
                        isSelected ? { backgroundColor: opt.color, borderColor: opt.color } : null
                      ]}>
                        {isSelected && <Check size={11} color="#FFFFFF" strokeWidth={3} />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Presets and Custom Input Section */}
              {sealType && (() => {
                const activeOption = sealOptions.find(opt => opt.id === sealType);
                return (
                  <View style={[
                    styles.presetsInputSection,
                    activeOption && {
                      borderColor: activeOption.color,
                      borderWidth: 1.5,
                      backgroundColor: activeOption.bgColor,
                    }
                  ]}>
                    <Text style={[styles.sectionHeader, activeOption && { color: activeOption.color }]}>TAP A PRESET OR TYPE YOUR OWN</Text>
                  
                  <View style={styles.presetsGrid}>
                    {PRESETS[sealType].map((preset, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={styles.presetPill}
                        onPress={() => handlePresetTap(preset)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.presetPillText}>{preset}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <TextInput
                    style={styles.customTextInput}
                    placeholder="or write your own message..."
                    placeholderTextColor={colors.textHint}
                    value={rawText}
                    onChangeText={setRawText}
                    multiline
                    maxLength={200}
                    textAlignVertical="top"
                  />
                  <Text style={styles.charLimitText}>{rawText.length}/200 chars</Text>
                </View>
                );
              })()}
            </View>
          ) : (
            /* DROP BOX TAB */
            <View style={styles.flowContainer}>
              <Text style={styles.mainTitle}>"Something you've been carrying — but haven't said yet."</Text>
              <Text style={styles.subtitleText}>Write it as it is. Messy is fine. We'll help you find the right words.</Text>

              {!reframed ? (
                /* Raw Input State */
                <View style={styles.reframeInputSection}>
                  <View style={{ position: 'relative' }}>
                    <TextInput
                      style={styles.rawTextInput}
                      placeholder="Type anything..."
                      placeholderTextColor={colors.textHint}
                      value={rawText}
                      onChangeText={setRawText}
                      multiline
                      maxLength={300}
                      textAlignVertical="top"
                      editable={!loading}
                    />
                    <View style={styles.bottomActionRow}>
                      <EnhanceAIButton
                        text={rawText}
                        onEnhanced={setRawText}
                        context="a thoughtful, honest, and kind way to express difficult feelings to a partner"
                        maxLength={300}
                        disabled={rawText.trim().length < 5 || loading}
                      />
                      <Text style={styles.charCountText}>{rawText.length}/300 ✦</Text>
                    </View>
                  </View>
                </View>
              ) : (
                /* Reframed Result State */
                <View style={styles.reframeResultContainer}>
                  <Text style={styles.sublabelTeal}>WHAT YOU WROTE</Text>
                  <View style={styles.rawTextBubble}>
                    <Text style={styles.rawTextBubbleContent}>"{rawText}"</Text>
                  </View>

                  <Text style={styles.sublabelTeal}>A DIFFERENT WAY TO SAY IT</Text>
                  <View style={styles.reframedTextBubble}>
                    <Text style={styles.reframedBubbleContent}>"{reframed}"</Text>
                  </View>
                </View>
              )}
            </View>
          )}
           <View style={styles.sealedNoteRow}>
                <Lock size={12} color="#D97706" style={{ marginRight: 6 }} />
                <Text style={styles.sealedNoteText}>Sealed - They find it when they join. You won't see it again.</Text>
              </View>
          <View style={{ height: 180 }} />
        </ScrollView>

        {/* Sticky Bottom Footer */}
        <View style={[styles.ctaWrapper, { paddingBottom: Math.max(insets.bottom + 8, metrics.spacing.md) }]}>
          {mode === 'seal' ? (
            <>
             

              <GradientButton
                text="Seal & drop 🩷 "
                onPress={handleSeal}
                disabled={!isLoveDropReady}
                fullWidth
                gradientColors={colors.gradientBtn}
              />

              <TouchableOpacity 
                style={styles.skipLinkBtn} 
                onPress={() => { haptics.light(); navigation.navigate('Day4TriviaFact'); }}
              >
                <Text style={styles.skipLinkText}>Skip</Text>
              </TouchableOpacity>
            </>
          ) : !reframed ? (
            <>
              <TouchableOpacity 
                style={[styles.reframeBtn, (rawText.trim().length < 20 || loading) && styles.reframeBtnDisabled]}
                onPress={handleReframe}
                disabled={rawText.trim().length < 20 || loading}
                activeOpacity={0.8}
              >
                <Text style={styles.reframeBtnText}>
                  {loading ? 'Finding the words...' : 'Help me say this better →'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.skipLinkBtn} 
                onPress={() => { haptics.light(); navigation.navigate('Day4TriviaFact'); }}
              >
                <Text style={styles.skipLinkText}>Skip</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.sealedNoteRow}>
                <Lock size={12} color="#D97706" style={{ marginRight: 6 }} />
                <Text style={styles.sealedNoteText}>
                  Your original words are deleted once we reframe. Only the reframed version is stored.
                </Text>
              </View>

              <GradientButton
                text="Keep this →"
                onPress={handleKeepReframe}
                fullWidth
                gradientColors={colors.gradientBtn}
              />

              <TouchableOpacity 
                style={styles.skipLinkBtn} 
                onPress={handleEditBeforeKeeping}
              >
                <Text style={styles.skipLinkText}>Edit before keeping</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingTop: metrics.spacing.md,
    paddingBottom: metrics.spacing.xl,
  },
  
  // ── Tab selector ──────────────────────────────────────────
  tabContainer: {
    flexDirection: 'row',
    width: CONTAINER_WIDTH,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderRadius: 100,
    padding: 4,
    marginBottom: metrics.spacing.lg,
    position: 'relative',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  slidingIndicator: {
    position: 'absolute',
    width: TAB_WIDTH,
    height: '100%',
    top: 4,
    left: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  tabBtnText: {
    fontSize: 13,
    fontFamily: fonts.dmSansBold,
    color: 'rgba(26, 54, 53, 0.55)',
  },
  tabBtnTextActive: {
    color: c.primary,
  },

  // ── Flow components ───────────────────────────────────────
  flowContainer: {
    gap: metrics.spacing.sm,
  },
  mainTitle: {
    fontSize: 24,
    color: c.text,
    fontFamily: 'PlayfairDisplay-Bold',
    lineHeight: 32,
    marginBottom: 4,
  },
  serifSubtitle: {
    fontSize: 18,
    color: c.textSecondary,
    fontFamily: 'PlayfairDisplay-Italic',
    lineHeight: 26,
    marginBottom: metrics.spacing.sm,
  },
  subtitleText: {
    ...typography.bodySmall,
    color: c.textSecondary,
    lineHeight: 18,
    marginBottom: metrics.spacing.md,
  },

  // ── Seal theme cards ──────────────────────────────────────
  sealCardsContainer: {
    gap: 12,
    marginBottom: metrics.spacing.md,
  },
  sealCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.06)',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  sealCardIconBg: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sealCardBody: {
    flex: 1,
    gap: 2,
  },
  sealCardTitle: {
    fontSize: 14,
    fontFamily: fonts.dmSansMedium,
    color: c.text,
  },
  sealCardDesc: {
    fontSize: 11,
    fontFamily: fonts.dmSansRegular,
    color: c.textSecondary,
  },
  checkmarkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Presets & Input ───────────────────────────────────────
  presetsInputSection: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: c.glassBorder,
    padding: 16,
    gap: 12,
    marginTop: metrics.spacing.xs,
  },
  sectionHeader: {
    fontSize: 10,
    fontFamily: fonts.dmSansBold,
    color: '#D97706',
    letterSpacing: 1.2,
  },
  presetsGrid: {
    gap: 8,
  },
  presetPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  presetPillText: {
    fontSize: 12,
    fontFamily: fonts.dmSansRegular,
    color: c.textSecondary,
    lineHeight: 16,
  },
  customTextInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    padding: 12,
    minHeight: 80,
    color: c.text,
    fontFamily: fonts.dmSansRegular,
    fontSize: 13,
    marginTop: 4,
  },
  charLimitText: {
    fontSize: 10,
    color: c.textHint,
    textAlign: 'right',
    marginTop: -4,
  },

  // ── Reframe Box ───────────────────────────────────────────
  reframeInputSection: {
    gap: 14,
  },
  rawTextInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.06)',
    padding: 16,
    paddingBottom: 48,
    minHeight: 150,
    color: c.text,
    fontFamily: fonts.dmSansRegular,
    fontSize: 15,
  },
  charCountText: {
    fontSize: 10,
    color: c.textHint,
    fontFamily: fonts.dmSansMedium,
    marginBottom: 4,
  },
  bottomActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
  reframeBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#0D9488',
    borderRadius: 100,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  reframeBtnDisabled: {
    opacity: 0.5,
  },
  reframeBtnText: {
    fontSize: 14,
    fontFamily: fonts.dmSansBold,
    color: '#0D9488',
  },

  // ── Reframe Result ────────────────────────────────────────
  reframeResultContainer: {
    gap: 12,
    marginTop: metrics.spacing.xs,
  },
  sublabelTeal: {
    fontSize: 10,
    fontFamily: fonts.dmSansBold,
    color: '#0D9488',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  rawTextBubble: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  rawTextBubbleContent: {
    fontSize: 13,
    fontFamily: fonts.dmSansRegular,
    color: c.textSecondary,
    lineHeight: 18,
  },
  reframedTextBubble: {
    backgroundColor: '#E6F4EA',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#A3E635',
  },
  reframedBubbleContent: {
    fontSize: 15,
    fontFamily: 'PlayfairDisplay-Italic',
    color: '#1E4620',
    lineHeight: 22,
  },

  // ── Actions ───────────────────────────────────────────────
  actionContainer: {
    gap: 14,
    marginTop: metrics.spacing.md,
  },
  sealedNoteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginVertical: 10,
  },
  sealedNoteText: {
    flex: 1,
    fontSize: 11,
    fontFamily: fonts.dmSansMedium,
    color: '#D97706',
    lineHeight: 15,
  },
  skipLinkBtn: {
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 4,
  },
  skipLinkText: {
    fontSize: 13,
    color: c.primary,
    fontFamily: fonts.dmSansBold,
    textDecorationLine: 'underline',
  },
  ctaWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: metrics.layout.screenPaddingHz,
    paddingTop: metrics.spacing.md,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.5)',
  },
});
