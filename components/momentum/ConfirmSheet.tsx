import { useEffect, type ReactNode } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { AnimatedView } from '@/components/ui/primitives/AnimatedView';

interface ConfirmSheetProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}

/**
 * Bottom sheet rendered inside the phone column, so it stays inside the frame
 * when the app is projected. Backdrop tap closes it.
 */
export function ConfirmSheet({ visible, onClose, children }: ConfirmSheetProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.set(withTiming(visible ? 1 : 0, { duration: 260 }));
  }, [progress, visible]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: progress.get() * 0.35 }));

  const panelStyle = useAnimatedStyle(() => ({
    opacity: progress.get(),
    transform: [{ translateY: (1 - progress.get()) * 320 }],
  }));

  if (!visible) return null;

  return (
    <View className="absolute inset-0 justify-end">
      <AnimatedView className="bg-ink absolute inset-0" style={backdropStyle}>
        <Pressable
          className="flex-1"
          accessibilityRole="button"
          accessibilityLabel="Close"
          onPress={onClose}
        />
      </AnimatedView>

      <AnimatedView
        className="border-hairline bg-paper max-h-[86%] rounded-t-[28px] border-t"
        style={panelStyle}
      >
        <View className="items-center pt-3">
          <View className="bg-stone-deep h-[3px] w-10 rounded-full" />
        </View>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 28 }}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </AnimatedView>
    </View>
  );
}
