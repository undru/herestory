import { Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LayoutList } from 'lucide-react-native';

import { Tappable } from '@/components/momentum/Tappable';
import { sans, usePalette } from '@/lib/theme';

/**
 * Temporary: floats over the screens outside the mockup flow while you
 * preview them, and returns to the "Other screens" list.
 */
export function PreviewReturn({ onPress }: { onPress: () => void }) {
  const insets = useSafeAreaInsets();
  const palette = usePalette();

  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel="Back to the list of other screens"
      onPress={onPress}
      className="border-line-firm bg-paper absolute right-3 h-9 flex-row items-center gap-1.5 rounded-full border px-3"
      style={{ top: insets.top + 8 }}
    >
      <LayoutList size={14} color={palette.inkSoft} strokeWidth={1.6} />
      <Text style={{ fontFamily: sans.medium }} className="text-ink-soft text-[12px]">
        Screens
      </Text>
    </Tappable>
  );
}
