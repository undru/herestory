import { View } from 'react-native';

import { MentorCard } from '@/components/momentum/MentorCard';
import { StepShell } from '@/components/momentum/StepShell';
import { useMomentum } from '@/lib/momentum-context';

export function MatchesStep() {
  const { matches, selectedMentorId, progress, actions } = useMomentum();

  return (
    <StepShell
      transitionKey="matches"
      progress={progress}
      onBack={actions.goBack}
      eyebrow="6 of 6"
      headline="Three women who have been where you are."
    >
      <View className="gap-2.5">
        {matches.map((mentor) => (
          <MentorCard
            key={mentor.id}
            mentor={mentor}
            expanded={mentor.id === selectedMentorId}
            onOpen={() => actions.openMentor(mentor.id)}
            onAsk={() => actions.askMentor(mentor.id)}
          />
        ))}
      </View>
    </StepShell>
  );
}
