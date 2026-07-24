import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TextInputProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useAppColors } from '../../theme';
import { typography, fonts } from '../../theme/typography';
import { metrics } from '../../theme/metrics';
import { EnhanceAIButton } from './EnhanceAIButton';
import { AIPromptContext } from '../../services/googleAI';
import { Check } from 'lucide-react-native';

export interface AIInputProps extends Omit<TextInputProps, 'onChangeText'> {
  value: string;
  onChangeText: (text: string) => void;
  context: AIPromptContext;
  question: string;
  maxLength?: number;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  showCharCount?: boolean;
  showDedicationBadge?: boolean;
  dedicationThreshold?: number;
}

export const AIInput: React.FC<AIInputProps> = ({
  value,
  onChangeText,
  context,
  question,
  maxLength = 150,
  containerStyle,
  inputStyle,
  showCharCount = true,
  showDedicationBadge = false,
  dedicationThreshold = 10,
  placeholder,
  multiline = true,
  autoFocus = false,
  ...rest
}) => {
  const colors = useAppColors();
  const styles = makeStyles(colors);

  const isValidForDedication = value.trim().length >= dedicationThreshold;

  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        style={[styles.input, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor={colors.textHint}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        maxLength={maxLength}
        textAlignVertical="top"
        autoFocus={autoFocus}
        {...rest}
      />
      
      <View style={styles.charCountContainer}>
        {showCharCount ? (
          <Text style={styles.charCountText}>
            {value.length} / {maxLength} chars
          </Text>
        ) : (
          <View />
        )}
        
        <View style={styles.rightActions}>
          <EnhanceAIButton
            text={value}
            onEnhanced={onChangeText}
            context={context}
            maxLength={maxLength}
            disabled={value.trim().length < 5}
            question={question}
          />
          {showDedicationBadge && isValidForDedication && (
            <View style={styles.signalBadge}>
              <Check size={12} color={colors.primary} />
              <Text style={styles.signalText}>Dedication</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) =>
  StyleSheet.create({
    container: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderRadius: metrics.radius.lg,
      borderWidth: 1.5,
      borderColor: 'rgba(255, 255, 255, 0.9)',
      padding: metrics.spacing.md,
      marginBottom: metrics.spacing.xl,
    },
    input: {
      color: c.text,
      fontFamily: fonts.dmSansRegular || 'Inter-Regular',
      fontSize: 16,
      minHeight: 100,
      lineHeight: 24,
      padding: 0,
      marginBottom: metrics.spacing.sm,
    },
    charCountContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: 'rgba(0, 0, 0, 0.05)',
      paddingTop: metrics.spacing.sm,
    },
    charCountText: {
      fontSize: 11,
      color: c.textHint,
      fontFamily: fonts.dmSansRegular || 'Inter-Regular',
    },
    rightActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    signalBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    signalText: {
      fontSize: 11,
      color: c.primary,
      fontFamily: 'Inter-SemiBold',
    },
  });
