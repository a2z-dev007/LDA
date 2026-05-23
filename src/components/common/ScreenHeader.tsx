import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppColors } from '../../theme';
import { fonts } from '../../theme/typography';
import { responsiveFontSize } from 'react-native-responsive-dimensions';

interface ScreenHeaderProps {
  /** The text to display as the primary screen title */
  title: string;
  /** Optional eyebrow text to show above or below the title */
  eyebrow?: string;
  /** Optional custom back button callback. If omitted, will default to navigation.goBack() */
  onBackPress?: () => void;
  /** Whether to render the back button. Defaults to true */
  showBackButton?: boolean;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  eyebrow,
  onBackPress,
  showBackButton = true,
}) => {
  const colors = useAppColors();
  const navigation = useNavigation();
  const styles = makeStyles(colors);

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        {showBackButton && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ChevronLeft size={20} color={colors.primary} />
          </TouchableOpacity>
        )}
        <Text style={[styles.headerTitle, !showBackButton && styles.titleNoButton]}>
          {title}
        </Text>
      </View>
      {eyebrow && (
        <Text style={styles.eyebrow}>
          {eyebrow.toUpperCase()}
        </Text>
      )}
    </View>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(45, 95, 93, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(45, 95, 93, 0.1)',
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.4),
    color: c.text,
    // fontFamily: fonts.playfairSemiBold,
  },
  titleNoButton: {
    marginLeft: 0,
  },
  eyebrow: {
    fontSize: 11,
    color: c.textHint,
    fontFamily: fonts.dmSansBold,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
});
