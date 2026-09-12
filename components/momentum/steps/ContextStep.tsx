import { View } from 'react-native';

import { ActionButton, TextLink } from '@/components/momentum/ActionButton';
import { StepShell } from '@/components/momentum/StepShell';
import { TextField } from '@/components/momentum/TextField';
import { WORK_LIFE_PLACEHOLDER } from '@/data/mock';
import { useMomentum } from '@/lib/momentum-context';

export function ContextStep() {
  const { workLife, progress, actions } = useMomentum();

  return (
    <StepShell
      transitionKey="context"
      progress={progress}
      onBack={actions.goBack}
      eyebrow="2 of 6"
      headline="Give me a sense of your work life."
      intro="A few lines is enough. This stays private."
      footer={
        <View>
          <ActionButton
            label="Continue"
            disabled={workLife.trim().length === 0}
            onPress={actions.continueFromWorkLife}
          />
          <TextLink
            className="mt-1"
            label="Skip this"
            tone="muted"
            onPress={actions.skipWorkLife}
          />
        </View>
      }
    >
      <TextField
        textarea
        placeholder={WORK_LIFE_PLACEHOLDER}
        value={workLife}
        onChangeText={actions.setWorkLife}
      />
    </StepShell>
  );
}
