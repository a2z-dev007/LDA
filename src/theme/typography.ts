import { Platform } from 'react-native';

export const typography = {
  h1: {
    fontSize: 32,
    fontFamily: Platform.select({ ios: 'Playfair Display', android: 'PlayfairDisplay-Bold' }),
    fontWeight: '700' as const,
  },
  h2: {
    fontSize: 26,
    fontFamily: Platform.select({ ios: 'Playfair Display', android: 'PlayfairDisplay-SemiBold' }),
    fontWeight: '600' as const,
  },
  emotional: {
    fontSize: 20,
    fontFamily: Platform.select({ ios: 'Playfair Display', android: 'PlayfairDisplay-Italic' }),
    fontStyle: 'italic' as const,
  },
  body: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  button: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    letterSpacing: 0.5,
  },
};
