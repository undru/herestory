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
    <View
      className={cn(
        'border-hairline bg-paper-raised rounded-3xl border',
        compact ? 'p-5' : 'p-6',
        className,
      )}
    >
      <Overline className="text-terracotta">{card.label}</Overline>

      <Quote
        className={compact ? 'mt-4 text-[19px] leading-[29px]' : 'mt-5 text-[25px] leading-[37px]'}
      >
        “{card.quote}”
      </Quote>

      <View className={compact ? 'mt-5 gap-4' : 'mt-7 gap-5'}>
        {rows.map((row) => (
          <View key={row.label}>
            <Overline>{row.label}</Overline>
            <Body className="text-ink mt-2">{row.value}</Body>
          </View>
        ))}
      </View>
    </View>
  );
}
