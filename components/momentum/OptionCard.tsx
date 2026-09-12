import { Body, BodyStrong } from '@/components/momentum/Type';
import { Tappable } from '@/components/momentum/Tappable';
import { cn } from '@/lib/utils';

interface OptionCardProps {
  title: string;
  subtitle: string;
  selected?: boolean;
  onPress: () => void;
}

/** Stacked choice card used for the life-area step. */
export function OptionCard({ title, subtitle, selected = false, onPress }: OptionCardProps) {
  return (
    <Tappable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${title}. ${subtitle}`}
      onPress={onPress}
      pressScale={0.99}
      className={cn(
        'rounded-[14px] border px-4 py-[14px]',
        selected ? 'border-plum bg-plum-soft' : 'border-line-firm bg-transparent',
      )}
    >
      <BodyStrong className={selected ? 'text-plum' : undefined}>{title}</BodyStrong>
      <Body className={cn('mt-0.5 text-[13px] leading-[19px]', selected && 'text-plum')}>
        {subtitle}
      </Body>
    </Tappable>
  );
}
