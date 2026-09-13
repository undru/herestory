import { Text, View } from 'react-native';
import { Check } from 'lucide-react-native';

import { FeelingGroupIcon } from '@/components/momentum/FeelingGroupIcon';
import { Tappable } from '@/components/momentum/Tappable';
import { LinearGradient } from '@/components/ui/primitives/LinearGradient';
import {
  FEELING_BUBBLE_TEXT,
  FEELING_BUBBLES,
  sans,
  usePalette,
  type FeelingFamily,
} from '@/lib/theme';
import { cn } from '@/lib/utils';

/** Where the back circle sits, cycled so neighbouring bubbles don't look stamped. */
const BACK_OFFSETS = [
  { left: '0%', top: '7%' },
  { left: '8%', top: '1%' },
  { left: '2%', top: '0%' },
  { left: '7%', top: '8%' },
] as const;

const GROUP_FILL_START = { x: 0, y: 0 } as const;
const GROUP_FILL_END = { x: 1, y: 1 } as const;
const FEELING_FILL_START = { x: 0.5, y: 0 } as const;
const FEELING_FILL_END = { x: 0.5, y: 1 } as const;

/** Reads one channel (0 red, 1 green, 2 blue) of a #RRGGBB color. */
function channel(hex: string, i: number) {
  return Number.parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
}

/** Blends two #RRGGBB colors; t = 0 is `from`, 1 is `to`. */
function mixHex(from: string, to: string, t: number) {
  const mixed = [0, 1, 2].map((i) =>
    Math.round(channel(from, i) + (channel(to, i) - channel(from, i)) * t)
      .toString(16)
      .padStart(2, '0'),
  );
  return `#${mixed.join('')}`;
}

/** Small ink disc in the top-right corner: a tick, or how many feelings are chosen. */
function CornerBadge({ count }: { count?: number }) {
  const palette = usePalette();
  return (
    <View
      pointerEvents="none"
      className="bg-ink absolute top-[2%] right-[2%] h-7 min-w-7 items-center justify-center rounded-full px-1.5"
    >
      {count === undefined ? (
        <Check size={16} color={palette.paper} strokeWidth={2.6} />
      ) : (
        <Text style={{ fontFamily: sans.semibold }} className="text-paper text-[13px]">
          {count}
        </Text>
      )}
    </View>
  );
}

interface FeelingGroupBubbleProps {
  label: string;
  family: FeelingFamily;
  /** How many feelings in this group are already chosen. */
  count: number;
  onPress: () => void;
  /** Position on the grid; varies the layered shape. */
  index?: number;
}

/** Large layered gradient bubble that opens one family of feelings. Square, full width. */
export function FeelingGroupBubble({
  label,
  family,
  count,
  onPress,
  index = 0,
}: FeelingGroupBubbleProps) {
  const colors = FEELING_BUBBLES[family];
  const offset = BACK_OFFSETS[index % BACK_OFFSETS.length];

  return (
    <View className="aspect-square w-full">
      <Tappable
        accessibilityRole="button"
        accessibilityLabel={count > 0 ? `${label}, ${count} chosen` : label}
        onPress={onPress}
        pressScale={0.95}
        className="flex-1"
      >
        <View
          pointerEvents="none"
          className="absolute rounded-full"
          style={{ width: '92%', height: '92%', ...offset, backgroundColor: colors.deep }}
        />
        <LinearGradient
          pointerEvents="none"
          colors={[colors.light, colors.deep]}
          start={GROUP_FILL_START}
          end={GROUP_FILL_END}
          className="absolute items-center justify-center overflow-hidden rounded-full"
          style={{ width: '92%', height: '92%', left: '4%', top: '4%' }}
        >
          <View className="items-center gap-[9px] px-[14%]">
            <FeelingGroupIcon family={family} />
            <Text
              numberOfLines={3}
              style={{ fontFamily: sans.semibold, color: FEELING_BUBBLE_TEXT }}
              className="text-center text-[17px] leading-[22px]"
            >
              {label}
            </Text>
          </View>
        </LinearGradient>
        {count > 0 ? <CornerBadge count={count} /> : null}
      </Tappable>
    </View>
  );
}

interface FeelingBubbleProps {
  label: string;
  family: FeelingFamily;
  /** 0 to 1: where this bubble sits in its family's color range. */
  shade: number;
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
}

/** One selectable feeling: a gradient circle in its family's shade, ringed and ticked when chosen. */
export function FeelingBubble({
  label,
  family,
  shade,
  selected,
  disabled = false,
  onPress,
}: FeelingBubbleProps) {
  const palette = usePalette();
  const { light, deep } = FEELING_BUBBLES[family];
  const fill = [
    mixHex(light, deep, Math.max(shade - 0.3, 0)),
    mixHex(light, deep, Math.min(shade + 0.3, 1)),
  ] as const;

  return (
    // Dim on a wrapper: Tappable's animated press opacity overrides an opacity class on itself.
    <View className={cn('aspect-square w-full', disabled && !selected && 'opacity-40')}>
      <Tappable
        accessibilityRole="button"
        accessibilityState={{ selected, disabled }}
        accessibilityLabel={label}
        disabled={disabled}
        onPress={onPress}
        pressScale={0.94}
        className="flex-1"
      >
        <LinearGradient
          pointerEvents="none"
          colors={fill}
          start={FEELING_FILL_START}
          end={FEELING_FILL_END}
          // Border only when chosen: a transparent border lets the gradient bleed past the curve.
          className={cn(
            'absolute inset-0 items-center justify-center overflow-hidden rounded-full',
            selected && 'border-[3px]',
          )}
          style={selected ? { borderColor: palette.ink } : undefined}
        >
          <Text
            numberOfLines={3}
            style={{ fontFamily: sans.semibold, color: FEELING_BUBBLE_TEXT }}
            className="px-[12%] text-center text-[17px] leading-[22px]"
          >
            {label}
          </Text>
        </LinearGradient>
        {selected ? <CornerBadge /> : null}
      </Tappable>
    </View>
  );
}
