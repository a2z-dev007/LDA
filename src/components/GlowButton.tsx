import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAppColors } from '../theme';

interface GlowButtonProps {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    variant?: 'gradient' | 'solid';
}

export const GlowButton: React.FC<GlowButtonProps> = ({
    title,
    onPress,
    disabled = false,
    style,
    textStyle,
    variant = 'gradient',
}) => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
    if (variant === 'gradient') {
        return (
            <TouchableOpacity
                activeOpacity={0.85}
                onPress={onPress}
                disabled={disabled}
                style={[styles.container, style]}
            >
                <LinearGradient
                    colors={
                        disabled
                            ? [colors.glassLight, colors.glassLight]
                            : [colors.buttonGradientStart, colors.buttonGradientEnd]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                        styles.gradient,
                        disabled && styles.gradientDisabled,
                    ]}
                >
                    <Text style={[styles.text, disabled && styles.textDisabled, textStyle]}>
                        {title}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    // Solid variant
    return (
        <TouchableOpacity
            activeOpacity={0.85}
            onPress={onPress}
            disabled={disabled}
            style={[
                styles.container,
                styles.solidButton,
                disabled && styles.solidButtonDisabled,
                style,
            ]}
        >
            <Text style={[styles.text, disabled && styles.textDisabled, textStyle]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
    container: {
        width: '100%',
    },
    gradient: {
        paddingVertical: 18,
        paddingHorizontal: 32,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: c.glowPrimary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.45,
        shadowRadius: 18,
        elevation: 10,
    },
    gradientDisabled: {
        shadowOpacity: 0,
        elevation: 0,
    },
    solidButton: {
        backgroundColor: c.white,
        paddingVertical: 18,
        paddingHorizontal: 32,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 8,
    },
    solidButtonDisabled: {
        backgroundColor: c.glassHeavy,
        shadowOpacity: 0,
        elevation: 0,
    },
    text: {
        color: c.text,
        fontSize: 18,
        fontFamily: 'DMSans-Bold',
        fontWeight: '700',
        letterSpacing: 0.8,
    },
    textDisabled: {
        color: c.textMuted,
    },
});
