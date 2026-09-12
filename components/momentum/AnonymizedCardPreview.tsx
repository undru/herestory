import { View } from 'react-native';

import { Body, Overline, Quote } from '@/components/momentum/Type';
import type { AnonymizedCard } from '@/data/mock';
import { cn } from '@/lib/utils';

interface Row {
  label: string;
  value: string;
}

interface AnonymizedCardPreviewProps {
  card: AnonymizedCard;
  /** Extra row appended below, e.g. "Why you might be her person". */
  extraRows?: Row[];
  compact?: boolean;
  className?: string;
}

/**
 * What the mentor receives: her challenge, never her name.
 * Shared by the send confirmation sheet and the mentor inbox.
 */
export function AnonymizedCardPreview({
  card,
  extraRows = [],
  compact = false,
  className,
}: AnonymizedCardPreviewProps) {
  const rows: Row[] = [
    { label: 'Her challenge', value: card.herChallenge },
    { label: 'What she needs', value: card.whatSheNeeds },
    { label: 'What she brings', value: card.whatSheBrings },
    ...extraRows,
  ];

  return (
    <View className={cn('border-line-firm rounded-2xl border', compact ? 'p-5' : 'p-6', className)}>
      <Overline className="text-plum">{card.label}</Overline>

      <Quote
        className={compact ? 'mt-3 text-[17px] leading-[24px]' : 'mt-4 text-[21px] leading-[29px]'}
      >
        “{card.quote}”
      </Quote>

      <View className={compact ? 'mt-4 gap-3' : 'mt-5 gap-4'}>
        {rows.map((row) => (
          <View key={row.label}>
            <Overline>{row.label}</Overline>
            <Body className="text-ink mt-1">{row.value}</Body>
          </View>
        ))}
      </View>
    </View>
  );
}
