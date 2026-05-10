import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useAppColors } from '../../theme';
import { metrics } from '../../theme/metrics';
import { typography, fonts } from '../../theme/typography';
import { haptics } from '../../utils/haptics';
import { responsiveWidth, responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import { PalmTree, Mountain, Coffee, Car, User, Heart, Lock } from 'lucide-react-native';
import { useDayStore, ThisOrThatRound } from '../../store/useDayStore';

interface Round {
  id: number;
  prompt: string;
  optionA: { label: string; icon: any; id: string };
  optionB: { label: string; icon: any; id: string };
}

const ROUNDS: Round[] = [
  {
    id: 1,
    prompt: 'For our next trip together...',
    optionA: { label: 'Beach & do nothing', icon: PalmTree, id: 'A' },
    optionB: { label: 'Trek & explore', icon: Mountain, id: 'B' },
  },
  {
    id: 2,
    prompt: 'On a quiet Sunday...',
    optionA: { label: 'Slow morning at home', icon: Coffee, id: 'A' },
    optionB: { label: 'Spontaneous day out', icon: Car, id: 'B' },
  },
  {
    id: 3,
    prompt: 'When I need to recharge...',
    optionA: { label: 'Need space alone', icon: User, id: 'A' },
    optionB: { label: 'Need you close', icon: Heart, id: 'B' },
  },
];

interface ThisOrThatBridgeProps {
  onComplete: () => void;
}

export const ThisOrThatBridge: React.FC<ThisOrThatBridgeProps> = ({ onComplete }) => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const setB2ThisOrThat = useDayStore(s => s.setB2ThisOrThat);

  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [step, setStep] = useState<'pick' | 'predict'>('pick');
  const [selections, setSelections] = useState<ThisOrThatRound[]>([]);
  const [currentPick, setCurrentPick] = useState<string | null>(null);

  const currentRound = ROUNDS[currentRoundIdx];

  const handleSelect = (optionId: string) => {
    haptics.light();
    if (step === 'pick') {
      setCurrentPick(optionId);
      setStep('predict');
    } else {
      const newRound: ThisOrThatRound = {
        round: currentRound.id,
        my_pick: currentPick!,
        my_pred_of_partner: optionId,
      };
      const updatedSelections = [...selections, newRound];
      setSelections(updatedSelections);

      if (currentRoundIdx < ROUNDS.length - 1) {
        setStep('pick');
        setCurrentPick(null);
        setCurrentRoundIdx(currentRoundIdx + 1);
      } else {
        setB2ThisOrThat(updatedSelections);
        onComplete();
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>3 quick rounds. Pick yours — then predict theirs.</Text>
        <Text style={styles.subtitle}>Your partner's answer is locked until they join.</Text>
      </View>

      <View style={styles.roundCard}>
        <Text style={styles.prompt}>{currentRound.prompt}</Text>
        <Text style={styles.stepIndicator}>
          {step === 'pick' ? 'Pick yours' : 'Predict theirs'}
        </Text>

        <View style={styles.optionsRow}>
          <OptionCard
            option={currentRound.optionA}
            onPress={() => handleSelect('A')}
            isSelected={step === 'predict' && currentPick === 'A'}
            isPredicting={step === 'predict'}
          />
          <OptionCard
            option={currentRound.optionB}
            onPress={() => handleSelect('B')}
            isSelected={step === 'predict' && currentPick === 'B'}
            isPredicting={step === 'predict'}
          />
        </View>
      </View>

      <View style={styles.progressRow}>
        {ROUNDS.map((_, i) => (
          <View
            key={i}
            style={[
              styles.progressDot,
              i === currentRoundIdx && styles.progressDotActive,
              i < currentRoundIdx && styles.progressDotDone,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const OptionCard = ({ option, onPress, isSelected, isPredicting }: any) => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const Icon = option.icon;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.optionCard,
        isSelected && styles.optionCardSelected,
      ]}
    >
      <View style={styles.iconBox}>
        <Icon size={responsiveWidth(8)} color={isSelected ? colors.primary : colors.textSecondary} />
      </View>
      <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
        {option.label}
      </Text>
      {isPredicting && !isSelected && (
        <View style={styles.predictionOverlay}>
           <Lock size={16} color={colors.textHint} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const makeStyles = (c: any) => StyleSheet.create({
  container: {
    paddingVertical: metrics.spacing.md,
  },
  header: {
    marginBottom: metrics.spacing.lg,
  },
  title: {
    ...typography.bodyBold,
    color: c.text,
    fontSize: metrics.fontSize.body,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.caption,
    color: c.textHint,
    textAlign: 'center',
    marginTop: 4,
  },
  roundCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: metrics.radius.xl,
    padding: metrics.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  prompt: {
    ...typography.displaySmall,
    fontSize: responsiveFontSize(2.5),
    fontFamily: 'PlayfairDisplay-Italic',
    color: c.text,
    textAlign: 'center',
    marginBottom: metrics.spacing.sm,
  },
  stepIndicator: {
    ...typography.labelBold,
    color: c.primary,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: metrics.spacing.lg,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: metrics.spacing.md,
  },
  optionCard: {
    flex: 1,
    aspectRatio: 0.85,
    backgroundColor: '#F9FAFB',
    borderRadius: metrics.radius.lg,
    borderWidth: 1.5,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    padding: metrics.spacing.sm,
  },
  optionCardSelected: {
    borderColor: c.primary,
    backgroundColor: 'rgba(45,212,191,0.05)',
  },
  iconBox: {
    marginBottom: metrics.spacing.sm,
  },
  optionLabel: {
    ...typography.caption,
    fontFamily: fonts.dmSansBold,
    color: c.textSecondary,
    textAlign: 'center',
  },
  optionLabelSelected: {
    color: c.primary,
  },
  predictionOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    opacity: 0.5,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: metrics.spacing.lg,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  progressDotActive: {
    backgroundColor: c.primary,
    width: 20,
  },
  progressDotDone: {
    backgroundColor: c.primary,
    opacity: 0.4,
  },
});
