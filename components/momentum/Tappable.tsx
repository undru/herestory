import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import {
  createAnimatedComponent,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { withUniwind } from 'uniwind';

const AnimatedPressable = withUniwind(createAnimatedComponent(Pressable));

interface TappableProps extends Omit<PressableProps, 'style'> {
  className?: string;
  /** Scale at full press. 1 disables the scale, keeping only the fade. */
  pressScale?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Quiet press feedback used across the app: a small scale and fade, no ripple,
 * no shadow. Runs on the UI thread so long lists stay smooth.
 */
export function Tappable({
  className,
  pressScale = 0.985,
  disabled,
  style,
  ...rest
}: TappableProps) {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 1 - pressed.get() * 0.25,
    transform: [{ scale: 1 - pressed.get() * (1 - pressScale) }],
  }));

  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled}
      className={className}
      style={[style, animatedStyle]}
      onPressIn={(event) => {
        pressed.set(withTiming(1, { duration: 90 }));
        rest.onPressIn?.(event);
      }}
      onPressOut={(event) => {
        pressed.set(withTiming(0, { duration: 180 }));
        rest.onPressOut?.(event);
      }}
    />
  );
}
