import { Text, View } from 'react-native';
import { X } from 'lucide-react-native';

import { Tappable } from '@/components/momentum/Tappable';
import { sans, usePalette } from '@/lib/theme';
import { cn } from '@/lib/utils';

/** Color family for selectable chips. 'plum' is the neutral default. */
export type ChipFamily = 'plum' | 'heavy' | 'curious' | 'hopeful';

const FAMILY_CLASSES: Record<ChipFamily, { idle: string; chosen: string; chosenText: string }> = {
  plum: {
    idle: 'border-line-firm bg-transparent',
    chosen: 'border-plum bg-plum-soft',
    chosenText: 'text-plum',
  },
  heavy: {
    idle: 'border-heavy-line bg-heavy-tint',
    chosen: 'border-heavy bg-heavy-soft',
    chosenText: 'text-heavy',
  },
  curious: {
    idle: 'border-curious-line bg-curious-tint',
    chosen: 'border-curious bg-curious-soft',
    chosenText: 'text-curious',
  },
  hopeful: {
    idle: 'border-hopeful-line bg-hopeful-tint',
    chosen: 'border-hopeful bg-hopeful-soft',
    chosenText: 'text-hopeful',
  },
};

interface PillChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  /** Turns the chip into a "tap to remove" chip with a small cross. */
  onRemove?: () => void;
  disabled?: boolean;
  /** 'quiet' renders a plain, non-selectable summary chip. */
  tone?: 'select' | 'quiet';
  /** Color family for 'select' chips. */
  family?: ChipFamily;
  className?: string;
}

/** Selectable pill. Soft fill in its color family when chosen, outline when not. */
export function PillChip({
  label,
  selected = false,
  onPress,
  onRemove,
  disabled = false,
  tone = 'select',
  family = 'plum',
  className,
}: PillChipProps) {
  const palette = usePalette();
  const isChosen = tone === 'select' && selected;
  const colors = FAMILY_CLASSES[tone === 'select' ? family : 'plum'];

  return (
    // Dim on a wrapper: Tappable's animated press opacity overrides an opacity class on itself.
    <View className={cn('max-w-full', disabled && !selected && tone === 'select' && 'opacity-40')}>
      <Tappable
        accessibilityRole="button"
        accessibilityState={{ selected, disabled }}
        accessibilityLabel={onRemove ? `Remove ${label}` : label}
        disabled={disabled || (!onPress && !onRemove)}
        onPress={onRemove ?? onPress}
        pressScale={0.97}
        className={cn(
          'min-h-11 flex-row items-center justify-center rounded-full border px-[14px] py-[9px]',
          isChosen ? colors.chosen : colors.idle,
          className,
        )}
      >
        <Text
          style={{ fontFamily: sans.regular }}
          className={cn('shrink text-[14px]', isChosen ? colors.chosenText : 'text-ink')}
        >
          {label}
        </Text>
        {onRemove ? (
          <View className="ml-2">
            <X size={14} color={palette.inkFaint} strokeWidth={1.8} />
          </View>
        ) : null}
      </Tappable>
    </View>
  );
}
