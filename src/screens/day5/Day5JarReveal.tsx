import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView } from 'react-native';
import { DayCTA } from '../../components/common/DayCTA';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { ProgressStrip } from '../../components/common/ProgressStrip';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { useAppColors } from '../../theme';
import { useJournalStore } from '../../store/useJournalStore';
import { useDayStore } from '../../store/useDayStore';
import { haptics } from '../../utils/haptics';
import { JarEnvelopeAnimation } from '../../components/common/JarEnvelopeAnimation';
import { 
  Heart, Sparkles, Flame, Star, Leaf, Award, 
  Smile, Activity, BookOpen, Lock, Gift 
} from 'lucide-react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';

type Nav = StackNavigationProp<RootStackParamList, 'Day5JarReveal'>;

export const Day5JarReveal: React.FC = () => {
  const colors = useAppColors();
  const styles = makeStyles(colors);
  const DAY_COLORS = [colors.day1, colors.day2, colors.day3, colors.day4, colors.day5];
  const navigation = useNavigation<Nav>();
  const jarMemories = useJournalStore((s) => s.jarMemories);
  const day4 = useDayStore((s) => s.day4);

  const totalNotesCount = jarMemories.length + (day4.dropBoxUsed ? 1 : 0) + (day4.loveDropUsed ? 1 : 0);
  const noteAnims = useRef(Array.from({ length: totalNotesCount }, () => new Animated.Value(0))).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    haptics.success();
    Animated.sequence([
      // Notes bounce in with stagger
      Animated.stagger(80, noteAnims.map((a) =>
        Animated.spring(a, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true })
      )),
      Animated.timing(buttonOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  // Helper to parse key-value contents
  const parseMemory = (content: string) => {
    if (content.includes(': ')) {
      const [title, body] = content.split(': ');
      return { title: title.trim(), body: body.trim() };
    }
    if (content.startsWith('Felt ')) {
      return { title: 'Vibe Check', body: content };
    }
    if (content.includes('Mirror Question')) {
      return { title: 'Mirror Connection', body: content };
    }
    if (content.includes('Mood Board')) {
      return { title: 'Creative Intimacy', body: content };
    }
    return { title: 'Memory Jar Entry', body: content };
  };

  // Helper to resolve a contextual Lucide icon
  const getMemoryIcon = (title: string, body: string) => {
    const t = title.toLowerCase();
    const b = body.toLowerCase();
    
    if (t.includes('honest') || t.includes('score')) return Star;
    if (t.includes('relationship type') || b.includes('steady flame') || b.includes('electric spark')) return Flame;
    if (t.includes('growing') || b.includes('growing') || b.includes('🌱')) return Leaf;
    if (t.includes('vibe') || b.includes('felt')) return Smile;
    if (t.includes('this or that') || t.includes('game')) return Award;
    if (t.includes('certainty')) return Activity;
    if (t.includes('compliment')) return Heart;
    if (t.includes('promise')) return Sparkles;
    if (t.includes('mirror') || b.includes('mirror')) return BookOpen;
    if (t.includes('mood board') || b.includes('mood board')) return Sparkles;
    
    return Heart;
  };

  // Filter out redundant "Safe" text if it matches the status pill
  const showComplimentWord = day4.tinyComplimentWord && day4.tinyComplimentWord.trim().toLowerCase() !== 'safe';

  return (
    <ScreenWrapper>
      <ProgressStrip currentDay={5} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Your Memory Jar</Text>
        <Text style={styles.subtitle}>Everything you dropped in this week.</Text>

        {/* Jar visual container */}
        <View style={styles.jarContainer}>
          <View style={styles.jarAnimationWrapper}>
            <JarEnvelopeAnimation initialCount={jarMemories.length} />
          </View>
          
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>✨ Safe & Sealed</Text>
          </View>
          
          {showComplimentWord && (
            <Text style={styles.complimentGlow}>
              ✨ {day4.tinyComplimentWord}
            </Text>
          )}
        </View>

        {/* Notes */}
        <View style={styles.notes}>
          {jarMemories.map((memory, i) => {
            const parsed = parseMemory(memory.content || '');
            const IconComponent = getMemoryIcon(parsed.title, parsed.body);
            const themeColor = memory.dayColor ?? DAY_COLORS[i % 5];
            
            return (
              <Animated.View
                key={memory.id}
                style={[styles.note, {
                  borderColor: `${themeColor}40`,
                  opacity: noteAnims[i] ?? 1,
                  transform: [{ scale: noteAnims[i] ?? new Animated.Value(1) }],
                }]}
              >
                <View style={styles.noteHeader}>
                  <View style={[styles.iconCircle, { backgroundColor: `${themeColor}15` }]}>
                    <IconComponent size={15} color={themeColor} strokeWidth={2} />
                  </View>
                  <Text style={[styles.noteTitle, { color: themeColor }]}>
                    {parsed.title.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.noteText}>
                  "{parsed.body}"
                </Text>
              </Animated.View>
            );
          })}

          {day4.dropBoxUsed && (
            <Animated.View 
              style={[
                styles.note, 
                { 
                  borderColor: '#E67E22', 
                  opacity: noteAnims[jarMemories.length] ?? 1,
                  transform: [{ scale: noteAnims[jarMemories.length] ?? new Animated.Value(1) }]
                }
              ]}
            >
              <View style={styles.noteHeader}>
                <View style={[styles.iconCircle, { backgroundColor: 'rgba(230,126,34,0.1)' }]}>
                  <Lock size={15} color="#E67E22" strokeWidth={2} />
                </View>
                <Text style={[styles.noteTitle, { color: '#E67E22' }]}>DROP BOX NOTE</Text>
              </View>
              <Text style={styles.noteText}>"Something you found the words for."</Text>
            </Animated.View>
          )}

          {day4.loveDropUsed && (
            <Animated.View 
              style={[
                styles.note, 
                { 
                  borderColor: '#FFD700', 
                  opacity: noteAnims[jarMemories.length + (day4.dropBoxUsed ? 1 : 0)] ?? 1,
                  transform: [{ scale: noteAnims[jarMemories.length + (day4.dropBoxUsed ? 1 : 0)] ?? new Animated.Value(1) }]
                }
              ]}
            >
              <View style={styles.noteHeader}>
                <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,215,0,0.1)' }]}>
                  <Gift size={15} color="#B07010" strokeWidth={2} />
                </View>
                <Text style={[styles.noteTitle, { color: '#B07010' }]}>LOVE DROP NOTE</Text>
              </View>
              <Text style={styles.noteText}>"Something waiting for them."</Text>
            </Animated.View>
          )}

          {jarMemories.length === 0 && !day4.dropBoxUsed && !day4.loveDropUsed && (
            <View style={styles.emptyJar}>
              <Text style={styles.emptyText}>Your jar holds this week's journey.</Text>
            </View>
          )}

          {/* Spacer to push content above footer button */}
          <View style={{ height: responsiveHeight(14) }} />
        </View>
      </ScrollView>

      <Animated.View style={{ opacity: buttonOpacity }}>
        <DayCTA title="Read your letter" onPress={() => { haptics.medium(); navigation.navigate('Day5TheLetter');} } />
      </Animated.View>
    </ScreenWrapper>
  );
};

const makeStyles = (c: ReturnType<typeof useAppColors>) => StyleSheet.create({
  content: { padding: 28, paddingBottom: 16 },
  title: { fontSize: 32, color: c.text, fontFamily: 'PlayfairDisplay-Bold', marginBottom: 8 },
  subtitle: { fontSize: 15, color: c.textSecondary, fontFamily: 'Inter-Regular', marginBottom: 24 },
  jarContainer: {
    alignItems: 'center', 
    backgroundColor: c.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.45)', 
    borderRadius: 24,
    paddingVertical: 32, 
    paddingHorizontal: 24,
    marginBottom: 28, 
    borderWidth: 1.5, 
    borderColor: c.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.4)',
  },
  jarAnimationWrapper: {
    transform: [{ scale: 1.75 }],
    marginVertical: responsiveHeight(4.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPill: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: `${c.day5}40`,
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 5,
    backgroundColor: `${c.day5}10`,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: c.day5,
    letterSpacing: 0.5,
  },
  complimentGlow: { 
    fontSize: 18, 
    fontFamily: 'PlayfairDisplay-Bold', 
    marginTop: 16,
    color: c.day5,
  },
  notes: { 
    gap: 14,
    width: '100%',
  },
  note: {
    borderWidth: 1.5, 
    borderRadius: 20, 
    padding: 18,
    backgroundColor: c.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.72)',
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteTitle: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    letterSpacing: 1.5,
  },
  noteText: { color: c.textSecondary, fontSize: 15, fontFamily: 'PlayfairDisplay-Italic', lineHeight: 22, paddingLeft: 2 },
  noteCompliment: { fontSize: 16, fontFamily: 'PlayfairDisplay-Bold' },
  notePrivate: { color: c.textHint, fontSize: 14, fontFamily: 'Inter-Regular' },
  emptyJar: { alignItems: 'center', padding: 24 },
  emptyText: { color: c.textHint, fontSize: 14, fontFamily: 'PlayfairDisplay-Italic' },
});
