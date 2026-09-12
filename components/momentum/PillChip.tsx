import { Text, View } from 'react-native';
import { X } from 'lucide-react-native';

import { Tappable } from '@/components/momentum/Tappable';
import { INK_FAINT, sans } from '@/lib/theme';
import { cn } from '@/lib/utils';

interface PillChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  /** Turns the chip into a "tap to remove" chip with a small cross. */
  onRemove?: () => void;
  disabled?: boolean;
  /** 'quiet' renders the grey, non-selectable summary chips. */
  tone?: 'select' | 'quiet';
  className?: string;
}

/** Selectable pill. Terracotta when chosen, hairline outline when not. */
export function PillChip({
  label,
  selected = false,
  onPress,
  onRemove,
  disabled = false,
  tone = 'select',
  className,
}: PillChipProps) {
  return (
    <Tappable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={onRemove ? `Remove ${label}` : label}
      disabled={disabled || (!onPress && !onRemove)}
      onPress={onRemove ?? onPress}
      pressScale={0.97}
      className={cn(
        'min-h-11 flex-row items-center justify-center rounded-full border px-[18px] py-[11px]',
        tone === 'quiet'
          ? 'bg-stone border-transparent'
          : selected
            ? 'border-terracotta bg-terracotta'
            : 'border-hairline bg-paper-raised',
        disabled && !selected && tone === 'select' && 'opacity-45',
        className,
      )}
    >
      <Text
        style={{ fontFamily: sans.regular }}
        className={cn(
          'text-[15px]',
          tone === 'quiet' ? 'text-ink-soft' : selected ? 'text-paper' : 'text-ink',
        )}
      >
        {label}
      </Text>
      {onRemove ? (
        <View className="ml-2">
          <X size={14} color={INK_FAINT} strokeWidth={1.8} />
        </View>
      ) : null}
    </Tappable>
  );
}
