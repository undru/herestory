import { useEffect } from 'react';
import { View } from 'react-native';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { AnimatedView } from '@/components/ui/primitives/AnimatedView';
import { LinearGradient } from '@/components/ui/primitives/LinearGradient';
import { GRADIENT_END, GRADIENT_START, usePalette } from '@/lib/theme';

interface ProgressBarProps {
  /** 0 to 1. */
  value: number;
}

/** Slim gradient progress line that sits at the very top of every step. */
export function ProgressBar({ value }: ProgressBarProps) {
  const palette = usePalette();
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
    <View className="bg-hairline h-[3px] w-full flex-row">
      <AnimatedView className="h-full overflow-hidden" style={fillStyle}>
        <LinearGradient
          colors={palette.gradient}
          start={GRADIENT_START}
          end={GRADIENT_END}
          className="absolute inset-0"
        />
      </AnimatedView>
      <AnimatedView className="h-full" style={remainderStyle} />
    </View>
  );
}
