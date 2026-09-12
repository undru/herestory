import { ActionButton } from '@/components/momentum/ActionButton';
import { StepShell } from '@/components/momentum/StepShell';
import { WELCOME_HEADLINE, WELCOME_SUBHEAD } from '@/data/mock';
import { useMomentum } from '@/lib/momentum-context';

export function WelcomeStep() {
  const { actions } = useMomentum();
  return (
    <StepShell
      transitionKey="welcome"
      centered
      headline={WELCOME_HEADLINE}
      intro={WELCOME_SUBHEAD}
      footer={<ActionButton label="Start" onPress={actions.startJourney} />}
    />
  );
}
