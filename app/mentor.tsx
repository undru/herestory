import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';

import { ActionButton, TextLink } from '@/components/momentum/ActionButton';
import { AnonymizedCardPreview } from '@/components/momentum/AnonymizedCardPreview';
import { Body, Caption, Display } from '@/components/momentum/Type';
import { CountdownRing } from '@/components/momentum/CountdownRing';
import { MicButton } from '@/components/momentum/MicButton';
import { StepShell } from '@/components/momentum/StepShell';
import { Waveform } from '@/components/momentum/Waveform';
import { MENTOR_REPLY_PROMPT, MENTOR_REPLY_SECONDS, MENTOR_SENT_LINE } from '@/data/mock';
import { useMockRecorder } from '@/hooks/useRecorder';
import { useMomentum } from '@/lib/momentum-context';
import { goBackOrReplace } from '@/lib/navigation';
import { formatDuration } from '@/lib/utils';

function ReplyStage() {
  const { isSendingReply, actions } = useMomentum();

  const recorder = useMockRecorder('mentor-reply', {
    maxSeconds: MENTOR_REPLY_SECONDS,
    onResult: (result) => {
      void actions.submitVoiceReply(result);
    },
  });

  const remaining = Math.max(MENTOR_REPLY_SECONDS - recorder.seconds, 0);
  const status =
    recorder.state === 'recording'
      ? `${formatDuration(remaining)} left`
      : recorder.state === 'transcribing' || isSendingReply
        ? 'Sending your voice note'
        : 'Tap to speak';

  return (
    <StepShell
      transitionKey="mentor-reply"
      progress={null}
      onBack={() => goBackOrReplace('/')}
      eyebrow="Your reply"
      headline={MENTOR_REPLY_PROMPT}
      intro="No advice needed yet. Tell her you have been there."
    >
      <View className="items-center pt-4">
        <CountdownRing
          seconds={recorder.seconds}
          totalSeconds={MENTOR_REPLY_SECONDS}
          active={recorder.state === 'recording'}
        >
          <MicButton
            state={recorder.state}
            seconds={recorder.seconds}
            onPress={recorder.toggle}
            size={124}
            showLabel={false}
          />
        </CountdownRing>
        <Caption className="mt-7">{status}</Caption>
      </View>
    </StepShell>
  );
}

function SentStage() {
  const router = useRouter();
  const { replyDurationSeconds } = useMomentum();

  return (
    <StepShell transitionKey="mentor-sent" progress={null} centered>
      <View className="items-center">
        <Waveform className="w-full" />
        <Display className="mt-9 text-center">{MENTOR_SENT_LINE}</Display>
        <Caption className="mt-4">
          Voice note, {formatDuration(replyDurationSeconds)}. Sent as you, first name only.
        </Caption>
        <TextLink
          className="mt-9"
          label="Back to the start"
          onPress={() => router.replace('/reset')}
        />
      </View>
    </StepShell>
  );
}

function DeclinedStage() {
  const router = useRouter();

  return (
    <StepShell transitionKey="mentor-declined" progress={null} centered>
      <View className="items-center">
        <Display className="text-center">Understood.</Display>
        <Body className="mt-5 max-w-[290px] text-center">
          She will be shown to someone else this week. Nothing is sent back to her.
        </Body>
        <TextLink
          className="mt-9"
          label="Back to the start"
          onPress={() => router.replace('/reset')}
        />
      </View>
    </StepShell>
  );
}

function InboxStage() {
  const { challenge, isLoadingChallenge, actions } = useMomentum();
  const requested = useRef(false);

  useEffect(() => {
    if (requested.current || challenge) return;
    requested.current = true;
    void actions.loadChallenge();
  }, [actions, challenge]);

  if (!challenge || isLoadingChallenge) {
    return (
      <StepShell transitionKey="mentor-loading" progress={null} centered>
        <Body className="text-ink text-center">Opening her card.</Body>
      </StepShell>
    );
  }

  return (
    <StepShell
      transitionKey="mentor-inbox"
      progress={null}
      onBack={() => goBackOrReplace('/')}
      headline="One woman needs you this week."
      footer={
        <View className="gap-3">
          <ActionButton
            label="I have 30 minutes this week"
            onPress={() => void actions.openReply()}
          />
          <ActionButton
            label="Not me right now"
            variant="secondary"
            onPress={() => void actions.dismissChallenge()}
          />
        </View>
      }
    >
      <AnonymizedCardPreview
        card={challenge}
        extraRows={[{ label: 'Why you might be her person', value: challenge.whyYou }]}
      />
      <View className="mt-5 flex-row items-center gap-2">
        <View className="bg-terracotta h-[6px] w-[6px] rounded-full" />
        <Body className="text-ink">{challenge.timeAsk}</Body>
      </View>
      <Caption className="mt-4">
        You will not see her name, her employer or her photo until she chooses to share them.
      </Caption>
    </StepShell>
  );
}

/** The mentor side of the handover. */
export default function MentorScreen() {
  const { mentorStage } = useMomentum();

  switch (mentorStage) {
    case 'reply':
      return <ReplyStage />;
    case 'sent':
      return <SentStage />;
    case 'declined':
      return <DeclinedStage />;
    case 'inbox':
      return <InboxStage />;
    default: {
      const exhaustiveCheck: never = mentorStage;
      throw new Error(`Unhandled mentor stage: ${String(exhaustiveCheck)}`);
    }
  }
}
