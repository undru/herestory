import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';

import { StepShell } from '@/components/momentum/StepShell';
import { Tappable } from '@/components/momentum/Tappable';
import { Body, BodyStrong, Caption, Title } from '@/components/momentum/Type';
import {
  DEEPENING_QUESTIONS,
  FEELING_OPTIONS,
  PROFILE_HISTORY_EMPTY,
  PROFILE_HISTORY_TITLE,
  PROFILE_NOT_ADDED,
  PROFILE_PRIVACY_NOTE,
  SAMPLE_PROFILES,
} from '@/data/mock';
import { formatLocalDateTime } from '@/lib/format-date';
import { useMomentum } from '@/lib/momentum-context';
import { goBackOrReplace } from '@/lib/navigation';
import { usePalette } from '@/lib/theme';

function ProfileField({ label, value }: { label: string; value: string }) {
  const hasValue = value.trim().length > 0;
  const shown = hasValue ? value : PROFILE_NOT_ADDED;
  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${shown}`}
      className="border-hairline border-b py-3"
    >
      <Caption>{label}</Caption>
      <Body className={hasValue ? 'text-ink mt-0.5' : 'text-ink-faint mt-0.5'}>{shown}</Body>
    </View>
  );
}

interface HistoryRowProps {
  title: string;
  detail: string;
  accessibilityLabel: string;
  onPress: () => void;
}

function HistoryRow({ title, detail, accessibilityLabel, onPress }: HistoryRowProps) {
  const palette = usePalette();
  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      pressScale={0.99}
      className="border-hairline flex-row items-center gap-3 rounded-[20px] border p-[14px]"
    >
      <View className="flex-1">
        <BodyStrong>{title}</BodyStrong>
        <Caption className="text-ink-soft mt-0.5">{detail}</Caption>
      </View>
      <ChevronRight size={18} color={palette.inkFaint} strokeWidth={1.6} />
    </Tappable>
  );
}

const back = () => goBackOrReplace('/');

/** Private, view-only Profile & history, stored on this device. */
export default function ProfileHistoryScreen() {
  const router = useRouter();
  const { history, isHistoryLoaded } = useMomentum();

  if (!isHistoryLoaded) {
    return (
      <StepShell transitionKey="profile-loading" onBack={back} centered>
        <Caption className="text-center">Loading your history…</Caption>
      </StepShell>
    );
  }

  // Nothing to show until a first match has been saved.
  if (history.matchBatches.length === 0) {
    return (
      <StepShell
        transitionKey="profile-empty"
        onBack={back}
        centered
        headline={PROFILE_HISTORY_TITLE}
        intro={PROFILE_HISTORY_EMPTY}
      />
    );
  }

  const profile = history.profile;
  const feelings = (profile?.feelings ?? []).flatMap((id) => {
    const option = FEELING_OPTIONS.find((item) => item.id === id);
    return option ? [option.label] : [];
  });

  return (
    <StepShell
      transitionKey="profile"
      onBack={back}
      headline={PROFILE_HISTORY_TITLE}
      intro={PROFILE_PRIVACY_NOTE}
    >
      <Title accessibilityRole="header">Your profile</Title>
      <View className="mt-1">
        <ProfileField label="Current city or country" value={profile?.location ?? ''} />
        <ProfileField label="Origin or nationality" value={profile?.origin ?? ''} />
        <ProfileField label="Languages" value={(profile?.languages ?? []).join(', ')} />
        <ProfileField label="Feelings" value={feelings.join(', ')} />
        <ProfileField label="Career destination" value={profile?.destination ?? ''} />
        <ProfileField label="CV" value={profile?.cvFileName ?? ''} />
      </View>

      <Title accessibilityRole="header" className="mt-8">
        Your conversations
      </Title>
      {history.conversations.length === 0 ? (
        <Body className="mt-2">No finished conversations yet.</Body>
      ) : (
        <View className="mt-3 gap-2.5">
          {history.conversations.map((conversation) => {
            const date = formatLocalDateTime(conversation.completedAt);
            const answered = DEEPENING_QUESTIONS.filter(
              (question) => (conversation.answers[question.id] ?? '').length > 0,
            ).length;
            const detail = `${answered} of ${DEEPENING_QUESTIONS.length} questions answered`;
            return (
              <HistoryRow
                key={conversation.id}
                title={date}
                detail={detail}
                accessibilityLabel={`Conversation from ${date}. ${detail}. Opens the full conversation.`}
                onPress={() =>
                  router.push({
                    pathname: '/profile/conversation/[id]',
                    params: { id: conversation.id },
                  })
                }
              />
            );
          })}
        </View>
      )}

      <Title accessibilityRole="header" className="mt-8">
        Your matches
      </Title>
      <View className="mt-3 gap-2.5">
        {history.matchBatches.map((batch) => {
          const date = formatLocalDateTime(batch.matchedAt);
          const names = batch.results.flatMap((result) => {
            const match = SAMPLE_PROFILES.find((item) => item.id === result.profileId);
            return match ? [match.firstName] : [];
          });
          const detail = names.join(', ');
          return (
            <HistoryRow
              key={batch.id}
              title={date}
              detail={detail}
              accessibilityLabel={`Matches from ${date}: ${detail}. Opens why each was matched.`}
              onPress={() =>
                router.push({ pathname: '/profile/matches/[id]', params: { id: batch.id } })
              }
            />
          );
        })}
      </View>
    </StepShell>
  );
}
