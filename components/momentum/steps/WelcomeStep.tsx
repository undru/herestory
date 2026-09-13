import { View } from 'react-native';
import { useRouter } from 'expo-router';

import { ActionButton, TextLink } from '@/components/momentum/ActionButton';
import { StepShell } from '@/components/momentum/StepShell';
import { PROFILE_HISTORY_TITLE, WELCOME_HEADLINE, WELCOME_SUBHEAD } from '@/data/mock';
import { useMomentum } from '@/lib/momentum-context';

export function WelcomeStep() {
  const router = useRouter();
  const { history, actions } = useMomentum();
  // Only people who have already matched get a way back to their history here.
  const hasMatched = history.matchBatches.length > 0;

  return (
    <StepShell
      transitionKey="welcome"
      centered
      headline={WELCOME_HEADLINE}
      intro={WELCOME_SUBHEAD}
      footer={
        <View>
          <ActionButton label="Start" onPress={actions.startJourney} />
          {hasMatched ? (
            <TextLink
              className="mt-1"
              label={PROFILE_HISTORY_TITLE}
              onPress={() => router.push('/profile')}
            />
          ) : null}
        </View>
      }
    />
  );
}
