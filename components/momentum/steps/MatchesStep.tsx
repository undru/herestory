import { View } from 'react-native';

import { ActionButton, TextLink } from '@/components/momentum/ActionButton';
import { AnonymizedCardPreview } from '@/components/momentum/AnonymizedCardPreview';
import { Body, Caption, Title } from '@/components/momentum/Type';
import { ConfirmSheet } from '@/components/momentum/ConfirmSheet';
import { MentorCard } from '@/components/momentum/MentorCard';
import { StepShell } from '@/components/momentum/StepShell';
import { CONFIRM_SHEET_LINE } from '@/data/mock';
import { useMomentum } from '@/lib/momentum-context';

export function MatchesStep() {
  const { matches, selectedMentorId, anonymizedCard, isSending, progress, actions } = useMomentum();
  const selected = matches.find((mentor) => mentor.id === selectedMentorId) ?? null;

  return (
    <StepShell
      transitionKey="matches"
      progress={progress}
      onBack={actions.goBack}
      headline="Three women who have been where you are."
      intro="No companies, no job titles. Only what they have lived."
      overlay={
        <ConfirmSheet visible={selected !== null} onClose={actions.clearSelectedMentor}>
          <Title>{CONFIRM_SHEET_LINE}</Title>
          <Caption className="mt-3">
            {selected ? `${selected.firstName} sees this, and nothing else.` : ''}
          </Caption>

          {anonymizedCard ? (
            <AnonymizedCardPreview className="mt-6" card={anonymizedCard} compact />
          ) : (
            <Body className="mt-6">Preparing what she will see…</Body>
          )}

          <ActionButton
            className="mt-7"
            label="Send it"
            loading={isSending}
            loadingLabel="Sending…"
            disabled={anonymizedCard === null}
            onPress={() => void actions.sendRequest()}
          />
          <TextLink
            className="mt-2"
            label="Not yet"
            tone="muted"
            onPress={actions.clearSelectedMentor}
          />
        </ConfirmSheet>
      }
    >
      <View className="gap-5">
        {matches.map((mentor) => (
          <MentorCard
            key={mentor.id}
            mentor={mentor}
            onAsk={() => void actions.selectMentor(mentor.id)}
          />
        ))}
      </View>
    </StepShell>
  );
}
