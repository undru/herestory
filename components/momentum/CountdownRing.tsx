import { useEffect, type ReactNode } from 'react';
import { View } from 'react-native';
import {
  createAnimatedComponent,
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { usePalette } from '@/lib/theme';

const AnimatedCircle = createAnimatedComponent(Circle);

interface CountdownRingProps {
  /** Elapsed seconds. */
  seconds: number;
  totalSeconds: number;
  size?: number;
  strokeWidth?: number;
  /** Whether the ring should be tracking time. */
  active: boolean;
  children: ReactNode;
}

/** Thin ring that empties over the 30 second voice reply. */
export function CountdownRing({
  seconds,
  totalSeconds,
  size = 168,
  strokeWidth = 2,
  active,
  children,
}: CountdownRingProps) {
  const palette = usePalette();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const elapsed = useSharedValue(0);

  useEffect(() => {
    const fraction = Math.min(Math.max(seconds / totalSeconds, 0), 1);
    if (!active) {
      elapsed.set(withTiming(0, { duration: 200 }));
      return;
    }
    elapsed.set(withTiming(fraction, { duration: 1000, easing: Easing.linear }));
  }, [active, elapsed, seconds, totalSeconds]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * elapsed.get(),
  }));

  return (
    <View className="items-center justify-center" style={{ width: size, height: size }}>
      <Svg
        width={size}
        height={size}
        style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}
      >
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={palette.hairline}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={palette.plum}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={animatedProps}
        />
      </Svg>
      {children}
    </View>
  );
}
