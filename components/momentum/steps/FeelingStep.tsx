import { View } from 'react-native';

import { ActionButton } from '@/components/momentum/ActionButton';
import { PillChip } from '@/components/momentum/PillChip';
import { StepShell } from '@/components/momentum/StepShell';
import { FEELING_OPTIONS, MAX_FEELINGS } from '@/data/mock';
import { useMomentum } from '@/lib/momentum-context';

export function FeelingStep() {
  const { feelings, progress, actions } = useMomentum();
  const atLimit = feelings.length >= MAX_FEELINGS;

  return (
    <StepShell
      transitionKey="feeling"
      progress={progress}
      eyebrow="1 of 7"
      headline="How are you feeling right now?"
      intro="Pick up to two."
      footer={
        <ActionButton
          label="Continue"
          disabled={feelings.length === 0}
          onPress={actions.continueFromFeeling}
        />
      }
    >
      <View className="flex-row flex-wrap gap-2">
        {FEELING_OPTIONS.map((option) => {
          const selected = feelings.includes(option.id);
          return (
            <PillChip
              key={option.id}
              label={option.label}
              selected={selected}
              disabled={!selected && atLimit}
              onPress={() => actions.toggleFeeling(option.id)}
            />
          );
        })}
      </View>
    </StepShell>
  );
}
