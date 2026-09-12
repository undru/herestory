import { View } from 'react-native';

import { cn } from '@/lib/utils';

/** Fixed pattern so the waveform reads as one recording, not random noise. */
const BAR_HEIGHTS = [
  8, 14, 22, 34, 26, 18, 30, 44, 52, 38, 24, 16, 28, 40, 56, 46, 32, 20, 12, 22, 36, 48, 58, 42, 30,
  18, 26, 38, 50, 34, 22, 14, 20, 30, 24, 16, 10, 18, 12, 8,
];

/** Each bar carries its own stable id so the list never keys off its position. */
const BARS = BAR_HEIGHTS.map((height, position) => ({ key: `bar-${position}`, height }));

interface WaveformProps {
  className?: string;
}

/** Static visual stand-in for the recorded voice note. */
export function Waveform({ className }: WaveformProps) {
  return (
    <View className={cn('h-16 flex-row items-center justify-between', className)}>
      {BARS.map((bar) => (
        <View
          key={bar.key}
          className={cn(
            'w-[3px] rounded-full',
            bar.height > 34 ? 'bg-terracotta' : 'bg-terracotta-soft',
          )}
          style={{ height: bar.height }}
        />
      ))}
    </View>
  );
}
