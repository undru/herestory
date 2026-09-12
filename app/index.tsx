import {
  AnswerStep,
  BookedStep,
  BookStep,
  ChatStep,
  ConnectedStep,
  PeopleStep,
  RedactionStep,
  SignalStep,
  WelcomeStep,
} from '@/components/momentum/steps/ContinuationSteps';
import { ContextStep } from '@/components/momentum/steps/ContextStep';
import { DeepeningStep } from '@/components/momentum/steps/DeepeningStep';
import { DestinationStep } from '@/components/momentum/steps/DestinationStep';
import { FeelingStep } from '@/components/momentum/steps/FeelingStep';
import { LifeAreaStep } from '@/components/momentum/steps/LifeAreaStep';
import { MatchesStep } from '@/components/momentum/steps/MatchesStep';
import { MatchingStep } from '@/components/momentum/steps/MatchingStep';
import { MomentStep } from '@/components/momentum/steps/MomentStep';
import { SentStep } from '@/components/momentum/steps/SentStep';
import { useMomentum } from '@/lib/momentum-context';

/** The mentee flow. One question per screen, eight steps, then the handover. */
export default function MenteeFlowScreen() {
  const { step } = useMomentum();

  switch (step) {
    case 'welcome':
      return <WelcomeStep />;
    case 'feeling':
      return <FeelingStep />;
    case 'lifeArea':
      return <LifeAreaStep />;
    case 'context':
      return <ContextStep />;
    case 'deepening':
      return <DeepeningStep />;
    case 'moment':
      return <MomentStep />;
    case 'destination':
      return <DestinationStep />;
    case 'matching':
      return <MatchingStep />;
    case 'matches':
      return <MatchesStep />;
    case 'redaction':
      return <RedactionStep />;
    case 'sent':
      return <SentStep />;
    case 'signal':
      return <SignalStep />;
    case 'answer':
      return <AnswerStep />;
    case 'connected':
      return <ConnectedStep />;
    case 'chat':
      return <ChatStep />;
    case 'book':
      return <BookStep />;
    case 'booked':
      return <BookedStep />;
    case 'people':
      return <PeopleStep />;
    default: {
      const exhaustiveCheck: never = step;
      throw new Error(`Unhandled mentee step: ${String(exhaustiveCheck)}`);
    }
  }
}
