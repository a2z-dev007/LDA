import React from 'react';
import Svg, { Path, Circle, G } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

// Heart icon for "Not perfectly. But honestly"
export const HeartIcon: React.FC<IconProps> = ({ size = 24, color = '#D88084' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

// Leaf/Plant icon for "uncomfortable things"
export const LeafIcon: React.FC<IconProps> = ({ size = 24, color = '#D88084' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C6.5 2 2 6.5 2 12c0 3.5 1.8 6.6 4.5 8.4"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 2c5.5 0 10 4.5 10 10 0 3.5-1.8 6.6-4.5 8.4"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 2v20"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Sparkle/Star icon for "That's the point"
export const SparkleIcon: React.FC<IconProps> = ({ size = 24, color = '#D88084' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Path
      d="M18 3L19 6L22 7L19 8L18 11L17 8L14 7L17 6L18 3Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

// Filled Heart icon for commitment box
export const HeartFilledIcon: React.FC<IconProps> = ({ size = 24, color = '#D88084' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      fill={color}
    />
  </Svg>
);

// Checkmark icon for checkbox
export const CheckIcon: React.FC<IconProps> = ({ size = 16, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Path
      d="M13.5 4L6 11.5L2.5 8"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
