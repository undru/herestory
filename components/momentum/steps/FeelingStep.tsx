import { View } from 'react-native';

import { ActionButton } from '@/components/momentum/ActionButton';
import { Caption } from '@/components/momentum/Type';
import { PillChip } from '@/components/momentum/PillChip';
import { StepShell } from '@/components/momentum/StepShell';
import { TextField } from '@/components/momentum/TextField';
import { FEELING_OPTIONS, MAX_FEELINGS } from '@/data/mock';
import { useMomentum } from '@/lib/momentum-context';

export function FeelingStep() {
  const { feelings, feelingNote, progress, actions } = useMomentum();
  const somethingElse = feelings.includes('something-else');
  const atLimit = feelings.length >= MAX_FEELINGS;

  return (
    <StepShell
      transitionKey="feeling"
      progress={progress}
      eyebrow="Momentum"
      headline="How are you feeling right now?"
      intro={`Choose up to ${MAX_FEELINGS}. There is no wrong answer here.`}
      footer={
        <ActionButton
          label="Continue"
          disabled={feelings.length === 0}
          onPress={actions.continueFromFeeling}
        />
      }
    >
      <View className="flex-row flex-wrap gap-3">
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

      {somethingElse ? (
        <View className="mt-7">
          <TextField
            label="In your own words"
            placeholder="Say it however it comes out"
            value={feelingNote}
            onChangeText={actions.setFeelingNote}
            autoFocus
          />
        </View>
      ) : null}

      {atLimit ? (
        <Caption className="mt-6">
          Two is the limit. Tap a new one and the older choice steps aside.
        </Caption>
      ) : null}
    </StepShell>
  );
}
