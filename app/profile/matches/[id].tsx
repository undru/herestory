import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { Avatar } from '@/components/momentum/Avatar';
import { StepShell } from '@/components/momentum/StepShell';
import { Body, BodyStrong, Caption, Overline, Quote } from '@/components/momentum/Type';
import { MATCHES_DEMO_NOTE, SAMPLE_PROFILES } from '@/data/mock';
import { formatLocalDateTime } from '@/lib/format-date';
import { useMomentum } from '@/lib/momentum-context';
import { goBackOrReplace } from '@/lib/navigation';

const back = () => goBackOrReplace('/profile');

/** One saved match batch, read-only, in the order the matches were returned. */
export default function MatchBatchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { history, isHistoryLoaded } = useMomentum();
  const batch = history.matchBatches.find((item) => item.id === id);

  if (!isHistoryLoaded) {
    return (
      <StepShell transitionKey="matches-loading" onBack={back} centered>
        <Caption className="text-center">Loading your history…</Caption>
      </StepShell>
    );
  }

  if (!batch) {
    return (
      <StepShell
        transitionKey="matches-missing"
        onBack={back}
        centered
        headline="Matches not found"
        intro="They aren’t saved on this device anymore."
      />
    );
  }

  const results = batch.results.flatMap((result) => {
    const profile = SAMPLE_PROFILES.find((item) => item.id === result.profileId);
    return profile ? [{ profile, reason: result.reason }] : [];
  });

  return (
    <StepShell
      transitionKey={`matches-${batch.id}`}
      onBack={back}
      eyebrow={formatLocalDateTime(batch.matchedAt)}
      headline="Your matches"
      intro={MATCHES_DEMO_NOTE}
    >
      <View className="gap-3">
        {results.map(({ profile, reason }, index) => {
          const name = `${profile.firstName}, ${profile.age}`;
          const position = `Match ${index + 1} of ${results.length}`;
          return (
            <View
              key={profile.id}
              accessible
              accessibilityLabel={`${position}: ${name}. ${profile.title}. ${profile.story} Why her, for you: ${reason}`}
              className="border-line-firm rounded-[20px] border p-[14px]"
            >
              <View className="flex-row items-center gap-3">
                <Avatar name={profile.firstName} />
                <View className="flex-1">
                  <BodyStrong>{name}</BodyStrong>
                  <Caption className="text-ink-soft mt-0.5">{profile.title}</Caption>
                </View>
                <Caption>{position}</Caption>
              </View>
              <Quote className="mt-3 text-[16px] leading-[23px]">“{profile.story}”</Quote>
              <Overline className="mt-4">Why her, for you</Overline>
              <Body className="text-ink mt-1">{reason}</Body>
            </View>
          );
        })}
      </View>
    </StepShell>
  );
}
