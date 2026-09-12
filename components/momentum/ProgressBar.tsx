import { useEffect } from 'react';
import { View } from 'react-native';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { AnimatedView } from '@/components/ui/primitives/AnimatedView';

interface ProgressBarProps {
  /** 0 to 1. */
  value: number;
}

/** Thin hairline progress bar that sits at the very top of every step. */
export function ProgressBar({ value }: ProgressBarProps) {
  const progress = useSharedValue(Math.min(Math.max(value, 0), 1));

  useEffect(() => {
    progress.set(withTiming(Math.min(Math.max(value, 0), 1), { duration: 420 }));
  }, [progress, value]);

  const fillStyle = useAnimatedStyle(() => ({
    flexBasis: 0,
    flexGrow: Math.max(progress.get(), 0.0001),
  }));

  const remainderStyle = useAnimatedStyle(() => ({
    flexBasis: 0,
    flexGrow: Math.max(1 - progress.get(), 0.0001),
  }));

  return (
    <View className="bg-hairline h-[2px] w-full flex-row">
      <AnimatedView className="bg-ink h-full" style={fillStyle} />
      <AnimatedView className="h-full" style={remainderStyle} />
    </View>
  );
}
