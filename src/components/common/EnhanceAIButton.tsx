import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Linking,
  Alert,
} from 'react-native';
import { useAppColors } from '../../theme';
import { typography, fonts } from '../../theme/typography';
import { metrics } from '../../theme/metrics';
import { haptics } from '../../utils/haptics';
import { Sparkles, Key, ExternalLink, Check, AlertCircle } from 'lucide-react-native';
import { CustomBottomSheet } from './CustomBottomSheet';
import {
  hasGeminiApiKey,
  getGeminiApiKey,
  setGeminiApiKey,
  validateApiKey,
  enhanceTextWithAI,
  AIPromptContext,
  HARDCODED_API_KEY,
} from '../../services/googleAI';

interface EnhanceAIButtonProps {
  text: string;
  onEnhanced: (newText: string) => void;
  context: AIPromptContext;
  maxLength: number;
  disabled?: boolean;
  question?: string;
}

export const EnhanceAIButton: React.FC<EnhanceAIButtonProps> = ({
  text,
  onEnhanced,
  context,
  maxLength,
  disabled = false,
  question,
}) => {
  const colors = useAppColors();
  const styles = makeStyles(colors);

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  
  // State for the API key setup modal
  const [apiKeyInput, setApiKeyInput] = useState(HARDCODED_API_KEY);
  const [validatingKey, setValidatingKey] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [validationSuccess, setValidationSuccess] = useState(false);

  const handleEnhance = async (overrideApiKey?: string) => {
    // Determine if we have a key configured (or if we are testing a newly inputted key)
    const keyToUse = overrideApiKey || getGeminiApiKey();
    
    if (!keyToUse) {
      haptics.warning();
      setApiKeyInput('');
      setValidationError('');
      setValidationSuccess(false);
      setModalVisible(true);
      return;
    }

    if (!text.trim()) {
      haptics.warning();
      Alert.alert('Empty Input', 'Please write something first so AI can enhance it!');
      return;
    }

    setLoading(true);
    haptics.light();

    try {
      const enhanced = await enhanceTextWithAI({
        text: text.trim(),
        context,
        maxLength,
        question,
      });
      onEnhanced(enhanced);
      haptics.success();
    } catch (error: any) {
      haptics.error();
      console.error('[EnhanceAI] Enhancement failed:', error);
      
      // If the error message suggests an invalid API key, prompt configuration again
      if (error?.message?.toLowerCase().includes('api key') || error?.message?.toLowerCase().includes('invalid')) {
        Alert.alert(
          'Gemini API Key Error',
          'It seems your API Key is invalid or expired. Would you like to reconfigure it?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Reconfigure',
              onPress: () => {
                setApiKeyInput(getGeminiApiKey());
                setValidationError('');
                setValidationSuccess(false);
                setModalVisible(true);
              },
            },
          ]
        );
      } else {
        Alert.alert('Enhancement Failed', error?.message || 'Something went wrong while improving the text.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveApiKey = async () => {
    if (!apiKeyInput.trim()) {
      setValidationError('Please enter a valid API key.');
      haptics.error();
      return;
    }

    setValidatingKey(true);
    setValidationError('');
    setValidationSuccess(false);
    haptics.light();

    const isValid = await validateApiKey(apiKeyInput.trim());

    setValidatingKey(false);
    if (isValid) {
      setGeminiApiKey(apiKeyInput.trim());
      setValidationSuccess(true);
      haptics.success();
      
      // Close the modal after a short success pause and trigger enhancement
      setTimeout(() => {
        setModalVisible(false);
        // Start the enhancement with the newly saved key
        handleEnhance(apiKeyInput.trim());
      }, 1000);
    } else {
      setValidationError('Invalid API Key. Please verify and try again.');
      haptics.error();
    }
  };

  const handleGetApiKeyLink = () => {
    haptics.light();
    Linking.openURL('https://aistudio.google.com/app/apikey').catch((err) => {
      console.error('Failed to open URL:', err);
      Alert.alert('Error', 'Could not open the link in your browser.');
    });
  };

  const isButtonDisabled = disabled || loading || !text.trim();

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.enhanceButton,
          isButtonDisabled && styles.disabledButton,
          loading && styles.loadingButton,
        ]}
        onPress={() => handleEnhance()}
        disabled={isButtonDisabled && !loading}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator size="small" color={colors.primary} style={styles.spinner} />
        ) : (
          <Sparkles size={13} color={isButtonDisabled ? colors.textHint : colors.primary} />
        )}
        <Text style={[styles.enhanceText, isButtonDisabled && styles.disabledText]}>
          {loading ? 'Enhancing...' : 'Enhance AI'}
        </Text>
      </TouchableOpacity>

      {/* API Key Configuration Bottom Sheet */}
      <CustomBottomSheet
        visible={modalVisible}
        onClose={() => !validatingKey && setModalVisible(false)}
        title="Setup Google Gemini AI"
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalSub}>
            Enhance AI uses Google Gemini to polish your entries, making them more authentic and emotionally intelligent.
          </Text>

          <TouchableOpacity
            style={styles.linkContainer}
            onPress={handleGetApiKeyLink}
            activeOpacity={0.7}
          >
            <ExternalLink size={14} color={colors.primary} />
            <Text style={styles.linkText}>Get a free API Key from Google AI Studio</Text>
          </TouchableOpacity>

          <View style={styles.inputWrapper}>
            <View style={styles.inputLabelContainer}>
              <Key size={14} color={colors.textHint} />
              <Text style={styles.inputLabel}>Gemini API Key</Text>
            </View>
            <TextInput
              style={styles.keyInput}
              placeholder="AIzaSy..."
              placeholderTextColor={colors.textHint}
              value={apiKeyInput}
              onChangeText={(t) => {
                setApiKeyInput(t);
                setValidationError('');
              }}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!validatingKey && !validationSuccess}
            />
          </View>

          {validationError ? (
            <View style={styles.errorContainer}>
              <AlertCircle size={14} color={colors.error} />
              <Text style={styles.errorText}>{validationError}</Text>
            </View>
          ) : null}

          {validationSuccess ? (
            <View style={styles.successContainer}>
              <Check size={14} color={colors.success} />
              <Text style={styles.successText}>Key validated! Enhancing now...</Text>
            </View>
          ) : null}

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
              disabled={validatingKey || validationSuccess}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalButton,
                styles.saveButton,
                (!apiKeyInput.trim() || validatingKey || validationSuccess) && styles.disabledSaveButton,
              ]}
              onPress={handleSaveApiKey}
              disabled={!apiKeyInput.trim() || validatingKey || validationSuccess}
            >
              {validatingKey ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.saveButtonText}>Validate & Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </CustomBottomSheet>
    </View>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) =>
  StyleSheet.create({
    enhanceButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(45, 212, 191, 0.08)',
      borderColor: 'rgba(45, 212, 191, 0.25)',
      borderWidth: 1,
      borderRadius: 14,
      paddingVertical: 5,
      paddingHorizontal: 10,
      gap: 5,
    },
    disabledButton: {
      backgroundColor: 'rgba(0, 0, 0, 0.02)',
      borderColor: 'rgba(0, 0, 0, 0.05)',
    },
    loadingButton: {
      backgroundColor: 'rgba(45, 212, 191, 0.12)',
    },
    enhanceText: {
      ...typography.buttonSmall,
      color: c.primary,
      fontFamily: fonts.dmSansMedium,
      fontSize: 11,
      lineHeight: 14,
    },
    disabledText: {
      color: c.textHint,
    },
    spinner: {
      marginRight: 2,
    },
    modalContent: {
      paddingVertical: metrics.spacing.xs,
    },
    modalSub: {
      ...typography.bodySmall,
      color: c.textSecondary || '#4B5563',
      lineHeight: 18,
      marginBottom: metrics.spacing.md,
    },
    linkContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: metrics.spacing.lg,
    },
    linkText: {
      ...typography.bodySmall,
      color: c.primary,
      fontFamily: fonts.dmSansMedium,
      textDecorationLine: 'underline',
    },
    inputWrapper: {
      marginBottom: metrics.spacing.md,
    },
    inputLabelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: metrics.spacing.xs,
    },
    inputLabel: {
      ...typography.caption,
      fontFamily: fonts.dmSansMedium,
      color: c.textSecondary || '#4B5563',
    },
    keyInput: {
      backgroundColor: 'rgba(0, 0, 0, 0.03)',
      borderWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0.08)',
      borderRadius: metrics.radius.md,
      paddingVertical: metrics.spacing.sm,
      paddingHorizontal: metrics.spacing.md,
      color: c.textDark || '#1A2332',
      fontFamily: fonts.dmSansRegular,
      fontSize: 14,
    },
    errorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: metrics.spacing.md,
    },
    errorText: {
      ...typography.caption,
      color: c.error,
      fontFamily: fonts.dmSansMedium,
    },
    successContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: metrics.spacing.md,
    },
    successText: {
      ...typography.caption,
      color: c.success,
      fontFamily: fonts.dmSansMedium,
    },
    modalActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: metrics.spacing.md,
      marginTop: metrics.spacing.md,
    },
    modalButton: {
      flex: 1,
      height: 46,
      borderRadius: metrics.radius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelButton: {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    cancelButtonText: {
      ...typography.button,
      color: c.textSecondary || '#4B5563',
      fontFamily: fonts.dmSansMedium,
    },
    saveButton: {
      backgroundColor: c.primary,
    },
    disabledSaveButton: {
      backgroundColor: 'rgba(45, 212, 191, 0.4)',
    },
    saveButtonText: {
      ...typography.button,
      color: '#FFFFFF',
      fontFamily: fonts.dmSansBold,
    },
  });
