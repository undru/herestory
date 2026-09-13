import { Image, View } from 'react-native';

import { TextLink } from '@/components/momentum/ActionButton';
import { ProfileHistoryButton } from '@/components/momentum/ProfileHistoryButton';
import { StepShell } from '@/components/momentum/StepShell';
import { Body, Display, Overline } from '@/components/momentum/Type';
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
        <Image
          source={MATCHED_MENTOR.photo}
          accessibilityLabel={`Photo of ${MATCHED_MENTOR.name}`}
          resizeMode="cover"
          style={{ width: 96, height: 96, borderRadius: 48 }}
        />
        <Overline className="text-brand mt-7">{"You're matched"}</Overline>
        <Display className="mt-4 text-center">{`You're matched with ${MATCHED_MENTOR.name}.`}</Display>
        <Body className="mt-5 max-w-[310px] text-center">{MATCHED_MENTOR.description}</Body>
      </View>
    </StepShell>
  );
}
