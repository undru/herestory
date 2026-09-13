import { useLocalSearchParams } from 'expo-router';

import { ChatMessageList, type ChatMessage } from '@/components/momentum/ChatThread';
import { StepShell } from '@/components/momentum/StepShell';
import { Caption } from '@/components/momentum/Type';
import { DEEPENING_QUESTIONS, PROFILE_PRIVACY_NOTE } from '@/data/mock';
import { formatLocalDateTime } from '@/lib/format-date';
import { useMomentum } from '@/lib/momentum-context';
import { goBackOrReplace } from '@/lib/navigation';

const back = () => goBackOrReplace('/profile');

/** One saved conversation as a read-only thread: the four prompts and her answers. */
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

  const messages = DEEPENING_QUESTIONS.flatMap((question): ChatMessage[] => {
    const answer = conversation.answers[question.id] ?? '';
    return [
      { id: question.id, from: 'guide', text: question.headline },
      answer.length > 0
        ? { id: `${question.id}-answer`, from: 'her', text: answer }
        : { id: `${question.id}-answer`, from: 'her', text: 'Not answered', muted: true },
    ];
  });

  return (
    <StepShell
      transitionKey={`conversation-${conversation.id}`}
      onBack={back}
      eyebrow={formatLocalDateTime(conversation.completedAt)}
      headline="Your conversation"
      intro={PROFILE_PRIVACY_NOTE}
    >
      <ChatMessageList messages={messages} />
    </StepShell>
  );
}
