import { Text, View } from 'react-native';
import { X } from 'lucide-react-native';

import { Tappable } from '@/components/momentum/Tappable';
import { sans, usePalette } from '@/lib/theme';
import { cn } from '@/lib/utils';

interface PillChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  /** Turns the chip into a "tap to remove" chip with a small cross. */
  onRemove?: () => void;
  disabled?: boolean;
  /** 'quiet' renders a plain, non-selectable summary chip. */
  tone?: 'select' | 'quiet';
  className?: string;
}

/** Selectable pill. Soft plum when chosen, firm outline when not. */
export function PillChip({
  label,
  selected = false,
  onPress,
  onRemove,
  disabled = false,
  tone = 'select',
  className,
}: PillChipProps) {
  const palette = usePalette();
  const isChosen = tone === 'select' && selected;

  return (
    <Tappable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={onRemove ? `Remove ${label}` : label}
      disabled={disabled || (!onPress && !onRemove)}
      onPress={onRemove ?? onPress}
      pressScale={0.97}
      className={cn(
        'min-h-11 flex-row items-center justify-center rounded-full border px-[14px] py-[9px]',
        isChosen ? 'border-plum bg-plum-soft' : 'border-line-firm bg-transparent',
        disabled && !selected && tone === 'select' && 'opacity-40',
        className,
      )}
    >
      <Text
        style={{ fontFamily: sans.regular }}
        className={cn('text-[14px]', isChosen ? 'text-plum' : 'text-ink')}
      >
        {label}
      </Text>
      {onRemove ? (
        <View className="ml-2">
          <X size={14} color={palette.inkFaint} strokeWidth={1.8} />
        </View>
      ) : null}
    </Tappable>
  );
}
