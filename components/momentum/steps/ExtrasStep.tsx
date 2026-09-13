import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';

import { StepShell } from '@/components/momentum/StepShell';
import { Tappable } from '@/components/momentum/Tappable';
import { Body, BodyStrong, Overline } from '@/components/momentum/Type';
import { useMomentum, type MenteeStep, type MentorStage } from '@/lib/momentum-context';
import { usePalette } from '@/lib/theme';

/*
 * Temporary: a list of the screens built before the mockup, so they can be
 * reviewed in the app before deciding whether to keep or delete them.
 */

const MENTEE_SCREENS: { step: MenteeStep; title: string; description: string }[] = [
  { step: 'signal', title: 'A woman answered', description: 'Notice that a mentor left a note.' },
  {
    step: 'answer',
    title: 'Her first note',
    description: 'The note itself, and a button to reveal who you are.',
  },
  {
    step: 'connected',
    title: 'You can see each other now',
    description: 'First names shared on both sides.',
  },
  {
    step: 'chat',
    title: 'Private conversation',
    description: 'Message thread with a calendar shortcut.',
  },
  { step: 'book', title: 'When can you both talk?', description: 'Pick one of three times.' },
  { step: 'booked', title: 'It’s in the diary', description: 'Confirmation of the chosen time.' },
  {
    step: 'people',
    title: 'Your circle',
    description: 'Everyone you have met here, with a status each.',
  },
];

const MENTOR_SCREENS: { stage: MentorStage; title: string; description: string }[] = [
  {
    stage: 'handoff',
    title: 'Invitation',
    description: 'Someone needs the version of you who has been here.',
  },
  {
    stage: 'notification',
    title: 'Notification',
    description: 'A phone notification: one woman needs you this week.',
  },
  {
    stage: 'inbox',
    title: 'Her challenge',
    description: 'The anonymised card, with “I can answer her” or “Not me right now”.',
  },
  {
    stage: 'reply',
    title: 'Voice reply',
    description: 'Big mic with a 30-second countdown, or type instead.',
  },
  { stage: 'offer', title: 'Offer a time', description: 'Three time slots, or send without one.' },
  { stage: 'done', title: 'Note sent', description: 'Waveform and “Your note is on its way.”' },
  {
    stage: 'declined',
    title: 'Declined',
    description: '“Understood. She will be shown to someone else.”',
  },
];

interface ScreenRowProps {
  title: string;
  description: string;
  onPress: () => void;
}

function ScreenRow({ title, description, onPress }: ScreenRowProps) {
  const palette = usePalette();
  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${description}`}
      onPress={onPress}
      pressScale={0.99}
      className="border-hairline flex-row items-center gap-3 rounded-[20px] border px-4 py-3"
    >
      <View className="flex-1">
        <BodyStrong>{title}</BodyStrong>
        <Body className="mt-0.5 text-[14px] leading-[20px]">{description}</Body>
      </View>
      <ChevronRight size={16} color={palette.inkFaint} strokeWidth={1.6} />
    </Tappable>
  );
}

export function ExtrasStep() {
  const router = useRouter();
  const { actions } = useMomentum();

  const openMentorStage = (stage: MentorStage) => {
    actions.previewMentorStage(stage);
    router.push('/mentor');
  };

  return (
    <StepShell
      transitionKey="extras"
      onBack={actions.goBack}
      eyebrow="Temporary"
      headline="Other screens"
      intro="Built earlier, not part of the mockup. Tap one to open it, then use “Screens” at the top right to come back here."
    >
      <Overline>After a mentor answers</Overline>
      <View className="mt-2 gap-2">
        {MENTEE_SCREENS.map((screen) => (
          <ScreenRow
            key={screen.step}
            title={screen.title}
            description={screen.description}
            onPress={() => actions.previewStep(screen.step)}
          />
        ))}
      </View>

      <Overline className="mt-7">The mentor’s side</Overline>
      <View className="mt-2 gap-2">
        {MENTOR_SCREENS.map((screen) => (
          <ScreenRow
            key={screen.stage}
            title={screen.title}
            description={screen.description}
            onPress={() => openMentorStage(screen.stage)}
          />
        ))}
      </View>

      <Overline className="mt-7">Utility</Overline>
      <View className="mt-2">
        <ScreenRow
          title="Reset"
          description="Clears every answer and returns to the welcome screen."
          onPress={() => router.push('/reset')}
        />
      </View>
    </StepShell>
  );
}
