import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';

type Nav = StackNavigationProp<RootStackParamList, 'Commitment'>;

export const CommitmentScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [isChecked, setIsChecked] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.root} edges={['bottom']}>
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              <Text style={styles.eyebrow}>BEFORE YOU BEGIN</Text>

              <Text style={styles.title}>
                This app works if you{'\n'}actually show up.
              </Text>

              <Text style={styles.description}>
                Not perfectly. But honestly — with yourself and for your relationship.
              </Text>

              <View style={styles.spacer} />

              <Text style={styles.description}>It will ask uncomfortable things.</Text>

              <Text style={styles.description}>
                It will ask you to feel what you've been avoiding. That's the point.
              </Text>
            </View>
          </ScrollView>

          {/* Fixed bottom section */}
          <View style={styles.bottomSection}>
            {/* Commitment checkbox */}
            <View style={styles.commitmentBox}>
              <Text style={styles.commitmentText}>I commit to showing up honestly.</Text>

              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setIsChecked(!isChecked)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                  {isChecked && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>I'm ready to be honest with myself</Text>
              </TouchableOpacity>
            </View>

            {/* Button */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.button, !isChecked && styles.buttonDisabled]}
                activeOpacity={0.85}
                onPress={() => isChecked && navigation.navigate('NameKeeper')}
                disabled={!isChecked}
              >
                <Text style={[styles.buttonText, !isChecked && styles.buttonTextDisabled]}>
                  I'm ready →
                </Text>
              </TouchableOpacity>

              <Text style={styles.footerNote}>• THE JOURNEY BEGINS WITH TRUTH •</Text>
            </View>
          </View>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  eyebrow: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    fontFamily: 'DMSans-Medium',
    fontWeight: '500',
    letterSpacing: 1.8,
    marginBottom: 20,
  },
  title: {
    fontSize: 34,
    color: colors.white,
    fontFamily: 'PlayfairDisplay-Italic',
    fontWeight: '400',
    fontStyle: 'italic',
    lineHeight: 44,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontFamily: 'DMSans-Regular',
    fontWeight: '400',
    lineHeight: 26,
    marginBottom: 14,
  },
  spacer: {
    height: 20,
  },
  bottomSection: {
    paddingHorizontal: 28,
    paddingBottom: 24,
  },
  commitmentBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  commitmentText: {
    fontSize: 17,
    color: colors.white,
    fontFamily: 'DMSans-Medium',
    fontWeight: '600',
    marginBottom: 18,
    letterSpacing: 0.2,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  checkboxChecked: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  checkmark: {
    color: '#7B5BA8',
    fontSize: 18,
    fontFamily: 'DMSans-Bold',
    fontWeight: '700',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 15,
    color: 'rgba(255,255,255,0.95)',
    fontFamily: 'DMSans-Regular',
    fontWeight: '400',
    lineHeight: 22,
  },
  footer: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 30,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#7B5BA8',
    fontSize: 18,
    fontFamily: 'DMSans-Bold',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  footerNote: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 10,
    fontFamily: 'DMSans-Medium',
    fontWeight: '500',
    letterSpacing: 2,
  },
});
