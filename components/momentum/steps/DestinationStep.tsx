import { View } from 'react-native';

import { ActionButton } from '@/components/momentum/ActionButton';
import { Caption } from '@/components/momentum/Type';
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
      headline="Where do you want to go from here?"
      footer={
        <ActionButton
          label="Find my three"
          disabled={destination.trim().length === 0}
          onPress={actions.startMatching}
        />
      }
    >
      <TextField
        textarea
        className="min-h-[150px]"
        placeholder={DESTINATION_PLACEHOLDER}
        value={destination}
        onChangeText={actions.setDestination}
      />

      <Caption className="mt-6">Or start from one of these.</Caption>
      <View className="mt-3 flex-row flex-wrap gap-3">
        {DESTINATION_SUGGESTIONS.map((suggestion) => (
          <PillChip
            key={suggestion}
            label={suggestion}
            onPress={() => actions.appendDestinationSuggestion(suggestion)}
          />
        ))}
      </View>
    </StepShell>
  );
}
