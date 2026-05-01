import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppColors } from '../theme';

export const FontTestScreen: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
    return (
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.container}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.header}>Font Test Screen</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>DM Sans Variants:</Text>
                    <Text style={styles.dmRegular}>DMSans-Regular: The quick brown fox</Text>
                    <Text style={styles.dmMedium}>DMSans-Medium: The quick brown fox</Text>
                    <Text style={styles.dmBold}>DMSans-Bold: The quick brown fox</Text>
                    <Text style={styles.dmItalic}>DMSans-Italic: The quick brown fox</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Playfair Display Variants:</Text>
                    <Text style={styles.pfRegular}>PlayfairDisplay-Regular: The quick brown fox</Text>
                    <Text style={styles.pfItalic}>PlayfairDisplay-Italic: The quick brown fox</Text>
                    <Text style={styles.pfSemiBold}>PlayfairDisplay-SemiBold: The quick brown fox</Text>
                    <Text style={styles.pfMediumItalic}>PlayfairDisplay-MediumItalic: The quick brown fox</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>System Font (Default):</Text>
                    <Text style={styles.systemFont}>System Font: The quick brown fox</Text>
                </View>

                <Text style={styles.note}>
                    If all fonts look the same, fonts are NOT loading.{'\n'}
                    Each line should look different.
                </Text>
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
    );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 20,
    },
    header: {
        fontSize: 24,
        color: c.text,
        marginBottom: 30,
        textAlign: 'center',
        fontFamily: 'DMSans-Bold',
        fontWeight: '700',
    },
    section: {
        marginBottom: 30,
        padding: 15,
        backgroundColor: c.glassLight,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: c.glassBorder,
    },
    sectionTitle: {
        fontSize: 14,
        color: c.primary,
        marginBottom: 15,
        fontFamily: 'DMSans-Bold',
        fontWeight: '700',
    },
    // DM Sans
    dmRegular: {
        fontFamily: 'DMSans-Regular',
        fontWeight: '400',
        fontSize: 16,
        color: c.text,
        marginBottom: 10,
    },
    dmMedium: {
        fontFamily: 'DMSans-Medium',
        fontWeight: '500',
        fontSize: 16,
        color: c.text,
        marginBottom: 10,
    },
    dmBold: {
        fontFamily: 'DMSans-Bold',
        fontWeight: '700',
        fontSize: 16,
        color: c.text,
        marginBottom: 10,
    },
    dmItalic: {
        fontFamily: 'DMSans-Italic',
        fontStyle: 'italic',
        fontSize: 16,
        color: c.text,
        marginBottom: 10,
    },
    // Playfair Display
    pfRegular: {
        fontFamily: 'PlayfairDisplay-Regular',
        fontSize: 18,
        color: c.text,
        marginBottom: 10,
    },
    pfItalic: {
        fontFamily: 'PlayfairDisplay-Italic',
        fontStyle: 'italic',
        fontSize: 18,
        color: c.text,
        marginBottom: 10,
    },
    pfSemiBold: {
        fontFamily: 'PlayfairDisplay-SemiBold',
        fontWeight: '600',
        fontSize: 18,
        color: c.text,
        marginBottom: 10,
    },
    pfMediumItalic: {
        fontFamily: 'PlayfairDisplay-MediumItalic',
        fontStyle: 'italic',
        fontSize: 18,
        color: c.text,
        marginBottom: 10,
    },
    // System
    systemFont: {
        fontSize: 16,
        color: c.text,
    },
    note: {
        fontSize: 12,
        color: c.textMuted,
        textAlign: 'center',
        marginTop: 20,
        fontFamily: 'DMSans-Italic',
        fontStyle: 'italic',
        lineHeight: 18,
    },
});
