import { View } from 'react-native';

import { ActionButton } from '@/components/momentum/ActionButton';
import { Seal } from '@/components/momentum/Seal';
import { StepShell } from '@/components/momentum/StepShell';
import { Body, Headline } from '@/components/momentum/Type';
import { useMomentum } from '@/lib/momentum-context';

export function SentStep() {
  const { selectedMentor, progress, actions } = useMomentum();
  const name = selectedMentor?.firstName ?? 'She';

  return (
    <StepShell
      transitionKey="sent"
      progress={progress}
      centered
      footer={
        <View className="border-hairline border-t pt-4">
          <Body>{"While you wait, there's someone I'd like you to see."}</Body>
          <ActionButton className="mt-3" label="Show me" onPress={actions.openHelpOffer} />
        </View>
      }
    >
      <Seal />
      <Headline className="mt-4">{"It's with her."}</Headline>
      <Body className="mt-3">
        {`${name} sees your challenge, not your name. She usually answers within a day.`}
      </Body>
    </StepShell>
  );
}
