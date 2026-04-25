import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../theme';

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
                    end={{ x: 1, y: 0 }}
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

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    gradient: {
        paddingVertical: 18,
        paddingHorizontal: 32,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.glowPrimary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.6,
        shadowRadius: 16,
        elevation: 12,
    },
    gradientDisabled: {
        shadowOpacity: 0,
        elevation: 0,
    },
    solidButton: {
        backgroundColor: colors.white,
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
        backgroundColor: colors.glassHeavy,
        shadowOpacity: 0,
        elevation: 0,
    },
    text: {
        color: colors.white,
        fontSize: 18,
        fontFamily: 'DMSans-Bold',
        fontWeight: '700',
        letterSpacing: 0.8,
    },
    textDisabled: {
        color: colors.textMuted,
    },
});
