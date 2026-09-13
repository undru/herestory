import { useState } from 'react';
import { Text, View } from 'react-native';

import { ActionButton, TextLink } from '@/components/momentum/ActionButton';
import { StepShell } from '@/components/momentum/StepShell';
import { Body, Caption, Overline } from '@/components/momentum/Type';
import { REDACTION_PARTS } from '@/data/mock';
import { useMomentum } from '@/lib/momentum-context';
import { sans } from '@/lib/theme';

export function RedactionStep() {
  const { selectedMentor, isSending, progress, actions } = useMomentum();
  // Identifying details she chose to put back, by their original word.
  const [restored, setRestored] = useState<string[]>([]);
  const name = selectedMentor?.firstName ?? 'she';

  const toggle = (original: string) =>
    setRestored((current) =>
      current.includes(original)
        ? current.filter((item) => item !== original)
        : [...current, original],
    );

  const written = REDACTION_PARTS.map((part) =>
    typeof part === 'string' ? part : part.original,
  ).join('');

  const message = REDACTION_PARTS.map((part) => {
    if (typeof part === 'string') return part;
    return restored.includes(part.original) ? part.original : part.safe;
  }).join('');

  return (
    <StepShell
      transitionKey="redaction"
      progress={progress}
      onBack={actions.goBack}
      eyebrow="Before it goes"
      headline={`This is what ${name} will read.`}
      footer={
        <View>
          <ActionButton
            label="Send it this way"
            loading={isSending}
            loadingLabel="Sending…"
            onPress={() => void actions.confirmRedaction(message)}
          />
          <TextLink className="mt-1" label="Go back" tone="muted" onPress={actions.goBack} />
        </View>
      }
    >
      <Overline>You wrote</Overline>
      <View className="border-hairline mt-1.5 rounded-[20px] border p-4">
        <Body>{written}</Body>
      </View>

      <Overline className="mt-4">She receives</Overline>
      <View className="border-line-firm mt-1.5 rounded-[20px] border p-4">
        <Body className="text-ink leading-[24px]">
          {REDACTION_PARTS.map((part) => {
            if (typeof part === 'string') return part;
            const isRestored = restored.includes(part.original);
            return (
              <Text
                key={part.original}
                accessibilityRole="button"
                accessibilityLabel={
                  isRestored
                    ? `${part.original}. Tap to hide it again.`
                    : `${part.safe}. Tap to put the real word back.`
                }
                onPress={() => toggle(part.original)}
                style={{ fontFamily: sans.medium }}
                className={isRestored ? 'text-ink underline' : 'bg-brand-soft text-brand'}
              >
                {isRestored ? part.original : ` ${part.safe} `}
              </Text>
            );
          })}
        </Body>
      </View>

      <Caption className="text-ink-soft mt-4">
        She gets the truth without the details that would identify you. Tap any of them to put the
        real word back, and again to take it out.
      </Caption>
    </StepShell>
  );
}
