import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { useUserStore } from '../store/useUserStore';
import { useStreakStore } from '../store/useStreakStore';

// Onboarding
import { SplashScreen } from '../screens/SplashScreen';
import { CommitmentScreen } from '../screens/CommitmentScreen';
import { NameKeeperScreen } from '../screens/NameKeeperScreen';

// Day 1
import { Day1ConnectionSlider } from '../screens/Day1ConnectionSlider';
import { Day1HonestMoment } from '../screens/Day1HonestMoment';
import { Day1SparkQuiz } from '../screens/Day1SparkQuiz';
import { Day1ResultScreen } from '../screens/Day1ResultScreen';

// Bridges
import { Bridge1to2 } from '../screens/Bridge1to2';
import { Bridge2to3 } from '../screens/Bridge2to3';
import { Bridge3to4 } from '../screens/Bridge3to4';
import { Bridge4to5 } from '../screens/Bridge4to5';

// Day 2
import { Day2MoodPicker } from '../screens/Day2MoodPicker';
import { Day2MoodFollowUp } from '../screens/Day2MoodFollowUp';

// Day 3
import { Day3AppreciationSnap } from '../screens/Day3AppreciationSnap';
import { Day3AssumptionsTest } from '../screens/Day3AssumptionsTest';
import { Day3OneCertainty } from '../screens/Day3OneCertainty';
import { Day3MirrorResults } from '../screens/Day3MirrorResults';

// Day 4
import { Day4MemoryJar } from '../screens/Day4MemoryJar';
import { Day4TinyCompliment } from '../screens/Day4TinyCompliment';
import { Day4DailyTwo } from '../screens/Day4DailyTwo';
import { Day4TriviaFact } from '../screens/Day4TriviaFact';
import { Day4DropBox } from '../screens/Day4DropBox';

// Day 5
import { Day5Celebration } from '../screens/Day5Celebration';
import { Day5ReportCard } from '../screens/Day5ReportCard';
import { Day5ThePromise } from '../screens/Day5ThePromise';
import { Day5JarReveal } from '../screens/Day5JarReveal';
import { Day5TheLetter } from '../screens/Day5TheLetter';
import { Day5PartnerInvite } from '../screens/Day5PartnerInvite';

// Hub
import { HomeScreen } from '../screens/HomeScreen';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const onboardingComplete = useUserStore((s) => s.onboardingComplete);
  const recordActivity = useStreakStore((s) => s.recordActivity);

  useEffect(() => {
    if (onboardingComplete) {
      recordActivity();
    }
  }, []);

  // All screens live in one stack at all times.
  // initialRouteName controls where the user starts — this avoids the
  // conditional-render re-mount bug where completing onboarding tears down
  // the stack and lands back on Splash.
  const initialRoute: keyof RootStackParamList = onboardingComplete ? 'Home' : 'Splash';

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false }}
    >
      {/* Onboarding */}
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Commitment" component={CommitmentScreen} />
      <Stack.Screen name="NameKeeper" component={NameKeeperScreen} />

      {/* Hub */}
      <Stack.Screen name="Home" component={HomeScreen} />

      {/* Day 1 */}
      <Stack.Screen name="Day1Slider" component={Day1ConnectionSlider} />
      <Stack.Screen name="Day1HonestMoment" component={Day1HonestMoment} />
      <Stack.Screen name="Day1Quiz" component={Day1SparkQuiz} />
      <Stack.Screen name="Day1Result" component={Day1ResultScreen} />

      {/* Bridges */}
      <Stack.Screen name="Bridge1to2" component={Bridge1to2} />
      <Stack.Screen name="Bridge2to3" component={Bridge2to3} />
      <Stack.Screen name="Bridge3to4" component={Bridge3to4} />
      <Stack.Screen name="Bridge4to5" component={Bridge4to5} />

      {/* Day 2 */}
      <Stack.Screen name="Day2MoodPicker" component={Day2MoodPicker} />
      <Stack.Screen name="Day2MoodFollowUp" component={Day2MoodFollowUp} />

      {/* Day 3 */}
      <Stack.Screen name="Day3AppreciationSnap" component={Day3AppreciationSnap} />
      <Stack.Screen name="Day3AssumptionsTest" component={Day3AssumptionsTest} />
      <Stack.Screen name="Day3OneCertainty" component={Day3OneCertainty} />
      <Stack.Screen name="Day3MirrorResults" component={Day3MirrorResults} />

      {/* Day 4 */}
      <Stack.Screen name="Day4MemoryJar" component={Day4MemoryJar} />
      <Stack.Screen name="Day4TinyCompliment" component={Day4TinyCompliment} />
      <Stack.Screen name="Day4DailyTwo" component={Day4DailyTwo} />
      <Stack.Screen name="Day4TriviaFact" component={Day4TriviaFact} />
      <Stack.Screen name="Day4DropBox" component={Day4DropBox} />

      {/* Day 5 */}
      <Stack.Screen name="Day5Celebration" component={Day5Celebration} />
      <Stack.Screen name="Day5ReportCard" component={Day5ReportCard} />
      <Stack.Screen name="Day5ThePromise" component={Day5ThePromise} />
      <Stack.Screen name="Day5JarReveal" component={Day5JarReveal} />
      <Stack.Screen name="Day5TheLetter" component={Day5TheLetter} />
      <Stack.Screen name="Day5PartnerInvite" component={Day5PartnerInvite} />
    </Stack.Navigator>
  );
};
