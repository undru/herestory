import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { StepShell } from '@/components/momentum/StepShell';
import { BodyStrong, Caption, Quote } from '@/components/momentum/Type';
import { DEEPENING_QUESTIONS, PROFILE_PRIVACY_NOTE } from '@/data/mock';
import { formatLocalDateTime } from '@/lib/format-date';
import { useMomentum } from '@/lib/momentum-context';
import { goBackOrReplace } from '@/lib/navigation';

const back = () => goBackOrReplace('/profile');

/** One saved conversation, read-only: the four prompts and her answers. */
export default function ConversationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { history, isHistoryLoaded } = useMomentum();
  const conversation = history.conversations.find((item) => item.id === id);

  if (!isHistoryLoaded) {
    return (
      <StepShell transitionKey="conversation-loading" onBack={back} centered>
        <Caption className="text-center">Loading your history…</Caption>
      </StepShell>
    );
  }

  if (!conversation) {
    return (
      <StepShell
        transitionKey="conversation-missing"
        onBack={back}
        centered
        headline="Conversation not found"
        intro="It isn’t saved on this device anymore."
      />
    );
  }

  return (
    <StepShell
      transitionKey={`conversation-${conversation.id}`}
      onBack={back}
      eyebrow={formatLocalDateTime(conversation.completedAt)}
      headline="Your conversation"
      intro={PROFILE_PRIVACY_NOTE}
    >
      <View className="gap-7">
        {DEEPENING_QUESTIONS.map((question, index) => {
          const answer = conversation.answers[question.id] ?? '';
          const shown = answer.length > 0 ? answer : 'Not answered';
          const position = `Question ${index + 1} of ${DEEPENING_QUESTIONS.length}`;
          return (
            <View
              key={question.id}
              accessible
              accessibilityLabel={`${position}. ${question.headline} Your answer: ${shown}`}
            >
              <Caption>{position}</Caption>
              <BodyStrong className="mt-1">{question.headline}</BodyStrong>
              <Quote
                className={
                  answer.length > 0
                    ? 'mt-2 text-[16px] leading-[24px]'
                    : 'text-ink-faint mt-2 text-[16px] leading-[24px]'
                }
              >
                {shown}
              </Quote>
            </View>
          );
        })}
      </View>
    </StepShell>
  );
}
