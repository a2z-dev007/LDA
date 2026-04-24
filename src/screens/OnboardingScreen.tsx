import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useUserStore } from '../store/useUserStore';

export const OnboardingScreen = () => {
  const setName = useUserStore((state) => state.setName);
  const setComplete = useUserStore((state) => state.setOnboardingComplete);

  return (
    <View className="flex-1 bg-light justify-center items-center px-6">
      <Text className="text-4xl font-playfair-bold text-dark text-center">
        Welcome to Let's Date Again
      </Text>
      <Text className="text-lg font-inter text-grey mt-4 text-center">
        A 5-day journey to rediscover your connection.
      </Text>
      <TouchableOpacity 
        onPress={() => {
          setName('User');
          setComplete(true);
        }}
        className="bg-primary px-8 py-4 rounded-full mt-10"
      >
        <Text className="text-white font-inter-bold text-lg">Start Journey</Text>
      </TouchableOpacity>
    </View>
  );
};
