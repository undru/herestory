import { View } from 'react-native';

import { Body, Title } from '@/components/momentum/Type';
import { Tappable } from '@/components/momentum/Tappable';
import { cn } from '@/lib/utils';

interface OptionCardProps {
  title: string;
  subtitle: string;
  selected?: boolean;
  onPress: () => void;
}

/** Large stacked choice card used for the life-area step. */
export function OptionCard({ title, subtitle, selected = false, onPress }: OptionCardProps) {
  return (
    <Tappable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${title}. ${subtitle}`}
      onPress={onPress}
      pressScale={0.99}
      className={cn(
        'rounded-3xl border px-6 py-6',
        selected ? 'border-terracotta bg-terracotta-soft' : 'border-hairline bg-paper-raised',
      )}
    >
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1">
          <Title className={selected ? 'text-terracotta-deep' : undefined}>{title}</Title>
          <Body className="mt-2">{subtitle}</Body>
        </View>
        <View
          className={cn(
            'mt-1 h-[18px] w-[18px] rounded-full border',
            selected ? 'border-terracotta bg-terracotta' : 'border-hairline',
          )}
        />
      </View>
    </Tappable>
  );
}
