import { View } from 'react-native';
import { useRouter } from 'expo-router';

import { Body, Display } from '@/components/momentum/Type';
import { StepShell } from '@/components/momentum/StepShell';
import { TextLink } from '@/components/momentum/ActionButton';
import { SENT_HEADLINE } from '@/data/mock';
import { useMomentum } from '@/lib/momentum-context';

export function SentStep() {
  const router = useRouter();
  const { progress } = useMomentum();

  return (
    <StepShell transitionKey="sent" progress={progress} centered>
      <View className="items-center">
        <View className="bg-terracotta h-[6px] w-[6px] rounded-full" />
        <Display className="mt-8 text-center">{SENT_HEADLINE}</Display>
        <Body className="mt-5 max-w-[300px] text-center">
          She hears your card as a voice note first. You will get one back before the day is out.
        </Body>
        <TextLink
          className="mt-9"
          label="See what she sees"
          onPress={() => router.push('/mentor')}
        />
      </View>
    </StepShell>
  );
}
