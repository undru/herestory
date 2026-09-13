import { View } from 'react-native';

import { TextLink } from '@/components/momentum/ActionButton';
import { ProfileHistoryButton } from '@/components/momentum/ProfileHistoryButton';
import { StepShell } from '@/components/momentum/StepShell';
import { Body, Display, Overline, Title } from '@/components/momentum/Type';
import { MATCHED_MENTOR } from '@/data/mock';
import { useMomentum } from '@/lib/momentum-context';

/** The last screen of the flow: who she is matched with. */
export function MatchedStep() {
  const { progress, actions } = useMomentum();

  return (
    <StepShell
      transitionKey="matched"
      progress={progress}
      centered
      headerAction={<ProfileHistoryButton />}
      footer={<TextLink label="Preview other screens" tone="muted" onPress={actions.openExtras} />}
    >
      <View className="items-center">
        <View className="bg-brand-soft h-20 w-20 items-center justify-center rounded-full">
          <Title className="text-brand text-[26px]">{MATCHED_MENTOR.initials}</Title>
        </View>
        <Overline className="text-brand mt-7">{"You're matched"}</Overline>
        <Display className="mt-4 text-center">{`You're matched with ${MATCHED_MENTOR.name}.`}</Display>
        <Body className="mt-5 max-w-[310px] text-center">{MATCHED_MENTOR.description}</Body>
      </View>
    </StepShell>
  );
}
