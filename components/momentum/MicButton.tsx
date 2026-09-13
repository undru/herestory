import { useEffect } from 'react';
import { View } from 'react-native';
import {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Mic, Square } from 'lucide-react-native';

import { AnimatedView } from '@/components/ui/primitives/AnimatedView';
import { Caption } from '@/components/momentum/Type';
import { Tappable } from '@/components/momentum/Tappable';
import type { RecorderState } from '@/hooks/useRecorder';
import { usePalette } from '@/lib/theme';
import { cn, formatDuration } from '@/lib/utils';

interface MicButtonProps {
  state: RecorderState;
  seconds: number;
  onPress: () => void;
  size?: number;
  idleLabel?: string;
  /** Hide the label when a countdown ring already shows the time. */
  showLabel?: boolean;
}

/**
 * The primary input of the deepening step: a large circular mic with a slow
 * pulse while "recording". Recording itself is mocked in lib/api.ts.
 */
export function MicButton({
  state,
  seconds,
  onPress,
  size = 116,
  idleLabel = 'Tap to speak',
  showLabel = true,
}: MicButtonProps) {
  const palette = usePalette();
  const pulse = useSharedValue(0);
  const isRecording = state === 'recording';

  useEffect(() => {
    if (isRecording) {
      pulse.set(0);
      pulse.set(
        withRepeat(withTiming(1, { duration: 2200, easing: Easing.out(Easing.ease) }), -1, false),
      );
      return;
    }
    cancelAnimation(pulse);
    pulse.set(withTiming(0, { duration: 240 }));
  }, [isRecording, pulse]);

  const firstRing = useAnimatedStyle(() => {
    const phase = pulse.get();
    return {
      opacity: 0.35 * (1 - phase),
      transform: [{ scale: 1 + phase * 0.4 }],
    };
  });

  const secondRing = useAnimatedStyle(() => {
    const phase = (pulse.get() + 0.5) % 1;
    return {
      opacity: pulse.get() === 0 ? 0 : 0.22 * (1 - phase),
      transform: [{ scale: 1 + phase * 0.55 }],
    };
  });

  const label =
    state === 'recording'
      ? formatDuration(seconds)
      : state === 'transcribing'
        ? 'Writing it down'
        : state === 'done'
          ? 'Tap to add more'
          : idleLabel;

  return (
    <View className="items-center">
      <View className="items-center justify-center" style={{ width: size, height: size }}>
        <AnimatedView
          pointerEvents="none"
          className="bg-brand absolute rounded-full"
          style={[{ width: size, height: size }, firstRing]}
        />
        <AnimatedView
          pointerEvents="none"
          className="bg-brand absolute rounded-full"
          style={[{ width: size, height: size }, secondRing]}
        />
        <Tappable
          accessibilityRole="button"
          accessibilityLabel={isRecording ? 'Stop recording' : 'Start recording'}
          accessibilityState={{ busy: state === 'transcribing' }}
          disabled={state === 'transcribing'}
          onPress={onPress}
          pressScale={0.95}
          className={cn(
            'items-center justify-center rounded-full border',
            isRecording ? 'border-brand bg-brand' : 'border-brand bg-paper-raised',
            state === 'transcribing' && 'border-hairline bg-bubble',
          )}
          style={{ width: size, height: size }}
        >
          {isRecording ? (
            <Square size={size * 0.24} color={palette.paper} fill={palette.paper} strokeWidth={1} />
          ) : (
            <Mic size={size * 0.3} color={palette.brand} strokeWidth={1.4} />
          )}
        </Tappable>
      </View>

      {showLabel ? <Caption className="mt-5 text-center">{label}</Caption> : null}
    </View>
  );
}
