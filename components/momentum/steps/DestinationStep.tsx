import { View } from 'react-native';

import { ActionButton } from '@/components/momentum/ActionButton';
import { Overline } from '@/components/momentum/Type';
import { PillChip } from '@/components/momentum/PillChip';
import { StepShell } from '@/components/momentum/StepShell';
import { TextField } from '@/components/momentum/TextField';
import { DESTINATION_PLACEHOLDER, DESTINATION_SUGGESTIONS } from '@/data/mock';
import { useMomentum } from '@/lib/momentum-context';

export function DestinationStep() {
  const { destination, progress, actions } = useMomentum();

  return (
    <StepShell
      transitionKey="destination"
      progress={progress}
      onBack={actions.goBack}
      eyebrow="5 of 6"
      headline="Where do you want to go from here?"
      footer={
        <ActionButton
          label="Find my people"
          disabled={destination.trim().length === 0}
          onPress={actions.startMatching}
        />
      }
    >
      <TextField
        textarea
        className="min-h-[112px]"
        placeholder={DESTINATION_PLACEHOLDER}
        value={destination}
        onChangeText={actions.setDestination}
      />

      <Overline className="mt-4">Or start from one of these</Overline>
      <View className="mt-2 flex-row flex-wrap gap-2">
        {DESTINATION_SUGGESTIONS.map((suggestion) => (
          <PillChip
            key={suggestion}
            label={suggestion}
            selected={destination === suggestion}
            onPress={() => actions.setDestination(suggestion)}
          />
        ))}
      </View>
    </StepShell>
  );
}
