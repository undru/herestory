import { View } from 'react-native';

import { PreviewReturn } from '@/components/momentum/PreviewReturn';
import {
  AnswerStep,
  BookedStep,
  BookStep,
  ChatStep,
  ConnectedStep,
  PeopleStep,
  SignalStep,
} from '@/components/momentum/steps/ContinuationSteps';
import { ContextStep } from '@/components/momentum/steps/ContextStep';
import { ConversationIntroStep } from '@/components/momentum/steps/ConversationIntroStep';
import { DeepeningStep } from '@/components/momentum/steps/DeepeningStep';
import { DestinationStep } from '@/components/momentum/steps/DestinationStep';
import { ExtrasStep } from '@/components/momentum/steps/ExtrasStep';
import { FeelingStep } from '@/components/momentum/steps/FeelingStep';
import { FinishStep, HelpAnswerStep, HelpOfferStep } from '@/components/momentum/steps/HelpSteps';
import { MatchesStep } from '@/components/momentum/steps/MatchesStep';
import { MatchingStep } from '@/components/momentum/steps/MatchingStep';
import { MomentStep } from '@/components/momentum/steps/MomentStep';
import { RedactionStep } from '@/components/momentum/steps/RedactionStep';
import { SentStep } from '@/components/momentum/steps/SentStep';
import { WelcomeStep } from '@/components/momentum/steps/WelcomeStep';
import { EXTRA_STEPS, useMomentum, type MenteeStep } from '@/lib/momentum-context';

function StepScreen({ step }: { step: MenteeStep }) {
  switch (step) {
    case 'welcome':
      return <WelcomeStep />;
    case 'feeling':
      return <FeelingStep />;
    case 'context':
      return <ContextStep />;
    case 'conversationIntro':
      return <ConversationIntroStep />;
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
    case 'helpOffer':
      return <HelpOfferStep />;
    case 'helpAnswer':
      return <HelpAnswerStep />;
    case 'finish':
      return <FinishStep />;
    case 'extras':
      return <ExtrasStep />;
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

/** The mentee flow. One question per screen, six steps, then the handover and one step ahead. */
export default function MenteeFlowScreen() {
  const { step, actions } = useMomentum();

  return (
    <View className="flex-1">
      <StepScreen step={step} />
      {EXTRA_STEPS.includes(step) ? <PreviewReturn onPress={actions.openExtras} /> : null}
    </View>
  );
}
