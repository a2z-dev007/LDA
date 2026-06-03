import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { useUserStore } from '../store/useUserStore';
import { useStreakStore } from '../store/useStreakStore';

// Onboarding
import { SplashScreen } from '../screens/SplashScreen';
import { CommitmentScreen } from '../screens/CommitmentScreen';
import { NameKeeperScreen } from '../screens/NameKeeperScreen';
import { IntroSliderScreen } from '../screens/IntroSliderScreen';

// Day 1
import { Day1ConnectionSlider } from '../screens/day1/Day1ConnectionSlider';
import { Day1HonestMoment } from '../screens/day1/Day1HonestMoment';
import { Day1VibeCheck } from '../screens/day1/Day1VibeCheck';
import { Day1SparkQuiz } from '../screens/day1/Day1SparkQuiz';
import { Day1ResultScreen } from '../screens/day1/Day1ResultScreen';

// Bridges
import { Bridge1to2 } from '../screens/bridges/Bridge1to2';
import { Bridge2to3 } from '../screens/bridges/Bridge2to3';
import { Bridge3to4 } from '../screens/bridges/Bridge3to4';
import { Bridge4to5 } from '../screens/bridges/Bridge4to5';
import { SetYourIntention } from '../screens/SetYourIntention';
import { ThisOrThatScreen } from '../screens/ThisOrThatScreen';

// Day 2
import { Day2MoodPicker } from '../screens/day2/Day2MoodPicker';
import { Day2OneGoodThing } from '../screens/day2/Day2OneGoodThing';
import { Day2MoodFollowUp } from '../screens/day2/Day2MoodFollowUp';
import { Day2ResultScreen } from '../screens/day2/Day2ResultScreen';

// Day 3
import { Day3AppreciationSnap } from '../screens/day3/Day3AppreciationSnap';
import { Day3FinishMySentence } from '../screens/day3/Day3FinishMySentence';
import { Day3AssumptionsTest } from '../screens/day3/Day3AssumptionsTest';
import { Day3MirrorResults } from '../screens/day3/Day3MirrorResults';
import { Day3MoodBoard } from '../screens/day3/Day3MoodBoard';
import { Day3MoodBoardResult } from '../screens/day3/Day3MoodBoardResult';
import { Day3OneCertainty } from '../screens/day3/Day3OneCertainty';
import { Day3Complete } from '../screens/day3/Day3Complete';

// Day 4
import { Day4MemoryJar } from '../screens/day4/Day4MemoryJar';
import { Day4TinyCompliment } from '../screens/day4/Day4TinyCompliment';
import { Day4PriorityShuffle } from '../screens/day4/Day4PriorityShuffle';
import { Day4DailyTwo } from '../screens/day4/Day4DailyTwo';
import { Day4TriviaFact } from '../screens/day4/Day4TriviaFact';
import { Day4DropBox } from '../screens/day4/Day4DropBox';
import { Day4Complete } from '../screens/day4/Day4Complete'

// Day 5
import { Day5Celebration } from '../screens/day5/Day5Celebration';
import { Day5ReportCard } from '../screens/day5/Day5ReportCard';
import { Day5ThePromise } from '../screens/day5/Day5ThePromise';
import { Day5JarReveal } from '../screens/day5/Day5JarReveal';
import { Day5TheLetter } from '../screens/day5/Day5TheLetter';
import { Day5PartnerInvite } from '../screens/day5/Day5PartnerInvite';

// Hub
import { HomeScreen } from '../screens/HomeScreen';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const onboardingComplete = useUserStore((s) => s.onboardingComplete);
  const introSeen = useUserStore((s) => s.introSeen);
  const recordActivity = useStreakStore((s) => s.recordActivity);

  useEffect(() => {
    if (onboardingComplete) {
      recordActivity();
    }
  }, []);

  const initialRoute: keyof RootStackParamList = !introSeen
    ? 'Intro'
    : onboardingComplete
    ? 'Home'
    : 'Splash';

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false }}
    >
      {/* Onboarding */}
      <Stack.Screen name="Intro" component={IntroSliderScreen} />
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
      <Stack.Screen name="Day1VibeCheck" component={Day1VibeCheck} />

      {/* Bridges */}
      <Stack.Screen name="Bridge1to2" component={Bridge1to2} />
      <Stack.Screen name="SetYourIntention" component={SetYourIntention} />
      <Stack.Screen name="ThisOrThat" component={ThisOrThatScreen} />
      <Stack.Screen name="Bridge2to3" component={Bridge2to3} />
      <Stack.Screen name="Bridge3to4" component={Bridge3to4} />
      <Stack.Screen name="Bridge4to5" component={Bridge4to5} />

      {/* Day 2 */}
      <Stack.Screen name="Day2MoodPicker" component={Day2MoodPicker} />
      <Stack.Screen name="Day2OneGoodThing" component={Day2OneGoodThing} />
      <Stack.Screen name="Day2MoodFollowUp" component={Day2MoodFollowUp} />
      <Stack.Screen name="Day2Result" component={Day2ResultScreen} />

      {/* Day 3 */}
      <Stack.Screen name="Day3AppreciationSnap" component={Day3AppreciationSnap} />
      <Stack.Screen name="Day3FinishMySentence" component={Day3FinishMySentence} />
      <Stack.Screen name="Day3AssumptionsTest" component={Day3AssumptionsTest} />
      <Stack.Screen name="Day3MirrorResults" component={Day3MirrorResults} />
      <Stack.Screen name="Day3MoodBoard" component={Day3MoodBoard} />
      <Stack.Screen name="Day3MoodBoardResult" component={Day3MoodBoardResult} />
      <Stack.Screen name="Day3OneCertainty" component={Day3OneCertainty} />
      <Stack.Screen name="Day3Complete" component={Day3Complete} />

      {/* Day 4 */}
      <Stack.Screen name="Day4MemoryJar" component={Day4MemoryJar} />
      <Stack.Screen name="Day4TinyCompliment" component={Day4TinyCompliment} />
      <Stack.Screen name="Day4PriorityShuffle" component={Day4PriorityShuffle} />
      <Stack.Screen name="Day4DailyTwo" component={Day4DailyTwo} />
      <Stack.Screen name="Day4TriviaFact" component={Day4TriviaFact} />
      <Stack.Screen name="Day4DropBox" component={Day4DropBox} />
      <Stack.Screen name="Day4Complete" component={Day4Complete} />

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
