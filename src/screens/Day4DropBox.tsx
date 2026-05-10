import React, { useState, useRef } from 'react';
import { DayHeader } from '../components/common/DayHeader';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { ProgressStrip } from '../components/common/ProgressStrip';
import { ScreenWrapper } from '../components/common/ScreenWrapper';
import { useAppColors } from '../theme';
import { useDayStore } from '../store/useDayStore';
import { reframeTextAsync } from '../services/toneReframer';
import { haptics } from '../utils/haptics';
import { metrics } from '../theme/metrics';
import { typography, fonts } from '../theme/typography';
import { Lock, Sparkles, Send } from 'lucide-react-native';
import { DayEndJarModal } from '../components/common/DayEndJarModal';

type Nav = StackNavigationProp<RootStackParamList, 'Day4DropBox'>;

export const Day4DropBox: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const navigation = useNavigation<Nav>();
  const day4 = useDayStore((s) => s.day4);
  const completeDay4 = useDayStore((s) => s.completeDay4);
  const setLoveDrop = useDayStore((s) => s.setLoveDrop);

  const [mode, setMode] = useState<'reframe' | 'seal'>('reframe');
  const [rawText, setRawText] = useState('');
  const [reframed, setReframed] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sealType, setSealType] = useState<'compliment' | 'memory' | 'challenge' | 'unsaid' | null>(null);
  const [showJarModal, setShowJarModal] = useState(false);

  const handleReframe = async () => {
    haptics.light();
    setLoading(true);
    const result = await reframeTextAsync(rawText);
    setRawText('');
    setReframed(result);
    setLoading(false);
    haptics.success();
  };

  const handleSeal = () => {
    if (!sealType || !rawText.trim()) return;
    haptics.success();
    setLoveDrop(sealType, rawText.trim());
    completeDay4({
      ...day4,
      dropBoxUsed: true,
    });
    setShowJarModal(true);
  };

  const handleModalNext = () => {
    setShowJarModal(false);
    navigation.navigate('Home');
  };

  const handleKeepReframe = () => {
    haptics.success();
    completeDay4({
      ...day4,
      dropBoxUsed: true,
      dropBoxReframedText: reframed,
    });
    setShowJarModal(true);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScreenWrapper>
        <ProgressStrip currentDay={4} />
        <View style={styles.body}>
          <DayHeader eyebrow="Game 04 · Love Drop" />
          
          <View style={styles.modeToggle}>
            <TouchableOpacity 
              style={[styles.modeBtn, mode === 'reframe' && styles.modeBtnActive]}
              onPress={() => setMode('reframe')}
            >
              <Text style={[styles.modeBtnText, mode === 'reframe' && styles.modeBtnTextActive]}>Reframer</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modeBtn, mode === 'seal' && styles.modeBtnActive]}
              onPress={() => setMode('seal')}
            >
              <Text style={[styles.modeBtnText, mode === 'seal' && styles.modeBtnTextActive]}>Seal It</Text>
            </TouchableOpacity>
          </View>

          {mode === 'reframe' ? (
            <View style={styles.contentCol}>
              <Text style={styles.title}>Something you need to say?</Text>
              <Text style={styles.subtitle}>Write it raw. We'll help you say it better. The original is never saved.</Text>
              
              {!reframed ? (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Write what's on your mind…"
                    placeholderTextColor={colors.textHint}
                    value={rawText}
                    onChangeText={setRawText}
                    multiline
                    textAlignVertical="top"
                    editable={!loading}
                  />
                  {rawText.length >= 20 && (
                    <TouchableOpacity style={styles.ctaBtn} onPress={handleReframe} disabled={loading}>
                      <Text style={styles.ctaBtnText}>{loading ? 'Reframing...' : 'Help me say this better'}</Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <View style={styles.resultCard}>
                   <Text style={styles.resultLabel}>A GENTLER WAY TO SAY IT</Text>
                   <Text style={styles.resultText}>"{reframed}"</Text>
                   <TouchableOpacity style={styles.ctaBtn} onPress={handleKeepReframe}>
                      <Text style={styles.ctaBtnText}>Keep this</Text>
                   </TouchableOpacity>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.contentCol}>
              <Text style={styles.title}>Seal a secret message</Text>
              <Text style={styles.subtitle}>Choose a theme. It stays locked until your partner joins.</Text>
              
              <View style={styles.sealTypeRow}>
                {['compliment', 'memory', 'challenge', 'unsaid'].map((type: any) => (
                  <TouchableOpacity 
                    key={type}
                    style={[styles.sealPill, sealType === type && styles.sealPillActive]}
                    onPress={() => setSealType(type)}
                  >
                    <Text style={[styles.sealPillText, sealType === type && styles.sealPillTextActive]}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={styles.input}
                placeholder="Write your sealed message..."
                placeholderTextColor={colors.textHint}
                value={rawText}
                onChangeText={setRawText}
                multiline
                textAlignVertical="top"
              />

              <TouchableOpacity 
                style={[styles.ctaBtn, (!sealType || !rawText.trim()) && styles.ctaBtnDisabled]} 
                onPress={handleSeal}
                disabled={!sealType || !rawText.trim()}
              >
                <Lock size={16} color="#FFF" style={{marginRight: 8}} />
                <Text style={styles.ctaBtnText}>Seal and send</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScreenWrapper>

      <DayEndJarModal 
        visible={showJarModal}
        currentDay={4}
        onNext={handleModalNext}
      />
    </KeyboardAvoidingView>
  );
};

const makeStyles = (c: any) => StyleSheet.create({
  body: { flex: 1, paddingHorizontal: 28, paddingTop: 24 },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 100,
    padding: 4,
    marginBottom: 24,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 100,
  },
  modeBtnActive: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  modeBtnText: {
    ...typography.caption,
    fontFamily: fonts.dmSansBold,
    color: c.textHint,
  },
  modeBtnTextActive: {
    color: c.primary,
  },
  contentCol: {
    gap: metrics.spacing.sm,
  },
  title: {
    ...typography.displaySmall,
    color: c.text,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  subtitle: {
    ...typography.bodySmall,
    color: c.textSecondary,
    marginBottom: metrics.spacing.md,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: metrics.radius.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.05)',
    padding: metrics.spacing.md,
    minHeight: 140,
    color: c.text,
    fontFamily: fonts.dmSansRegular,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  ctaBtn: {
    backgroundColor: c.primary,
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: metrics.spacing.md,
  },
  ctaBtnDisabled: {
    backgroundColor: c.textHint,
    opacity: 0.5,
  },
  ctaBtnText: {
    ...typography.buttonLarge,
    color: '#FFF',
  },
  resultCard: {
    backgroundColor: '#FFF',
    borderRadius: metrics.radius.xl,
    padding: metrics.spacing.lg,
    borderWidth: 1,
    borderColor: c.primary,
    gap: 12,
  },
  resultLabel: {
    ...typography.labelBold,
    color: c.primary,
    fontSize: 10,
    letterSpacing: 1,
  },
  resultText: {
    ...typography.bodyMedium,
    fontFamily: 'PlayfairDisplay-Italic',
    fontSize: 18,
    color: c.text,
  },
  sealTypeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: metrics.spacing.sm,
  },
  sealPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  sealPillActive: {
    borderColor: c.primary,
    backgroundColor: 'rgba(45,212,191,0.1)',
  },
  sealPillText: {
    ...typography.caption,
    color: c.textSecondary,
  },
  sealPillTextActive: {
    color: c.primary,
    fontFamily: fonts.dmSansBold,
  },
});
