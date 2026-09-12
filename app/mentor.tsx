import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, Check, MessageCircle } from 'lucide-react-native';

import { ActionButton, TextLink } from '@/components/momentum/ActionButton';
import { AnonymizedCardPreview } from '@/components/momentum/AnonymizedCardPreview';
import { Body, BodyStrong, Caption, Display, Overline, Title } from '@/components/momentum/Type';
import { CountdownRing } from '@/components/momentum/CountdownRing';
import { MicButton } from '@/components/momentum/MicButton';
import { StepShell } from '@/components/momentum/StepShell';
import { Tappable } from '@/components/momentum/Tappable';
import { TextField } from '@/components/momentum/TextField';
import { Waveform } from '@/components/momentum/Waveform';
import { AVAILABILITY_SLOTS, MENTOR_REPLY_PROMPT, MENTOR_REPLY_SECONDS } from '@/data/mock';
import { useMockRecorder } from '@/hooks/useRecorder';
import { useMomentum } from '@/lib/momentum-context';
import { goBackOrReplace } from '@/lib/navigation';
import { TERRACOTTA } from '@/lib/theme';
import { formatDuration } from '@/lib/utils';

function HandoffStage() {
  const { actions } = useMomentum();
  return (
    <StepShell
      transitionKey="mentor-handoff"
      centered
      onBack={() => goBackOrReplace('/')}
      footer={<ActionButton label="Open the invitation" onPress={actions.openMentorNotification} />}
    >
      <View className="items-center">
        <View className="bg-terracotta-soft h-20 w-20 items-center justify-center rounded-full">
          <MessageCircle color={TERRACOTTA} size={30} strokeWidth={1.5} />
        </View>
        <Overline className="text-terracotta-deep mt-8">Momentum</Overline>
        <Display className="mt-4 text-center">
          Someone needs the version of you who has been here.
        </Display>
        <Body className="mt-5 max-w-[310px] text-center">
          Her identity is protected. You will see the challenge she chose to share.
        </Body>
      </View>
    </StepShell>
  );
}

function NotificationStage() {
  const { actions } = useMomentum();
  return (
    <StepShell
      transitionKey="mentor-notification"
      centered
      footer={<ActionButton label="Read her challenge" onPress={actions.openMentorInbox} />}
    >
      <View className="border-hairline bg-paper-raised w-full rounded-3xl border p-5">
        <View className="flex-row items-center gap-4">
          <View className="bg-terracotta-soft h-12 w-12 items-center justify-center rounded-2xl">
            <Bell color={TERRACOTTA} size={22} />
          </View>
          <View className="flex-1">
            <BodyStrong>One woman needs you this week.</BodyStrong>
            <Caption className="mt-1">She asked for 30 honest minutes.</Caption>
          </View>
          <Caption>now</Caption>
        </View>
      </View>
      <Caption className="mt-5 text-center">No name. No employer. No public profile.</Caption>
    </StepShell>
  );
}

function ReplyStage() {
  const { isSendingReply, actions } = useMomentum();
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState('');
  const recorder = useMockRecorder('mentor-reply', {
    maxSeconds: MENTOR_REPLY_SECONDS,
    onResult: (result) => void actions.submitVoiceReply(result),
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
      footer={
        typing ? (
          <ActionButton
            label="Send my note"
            loading={isSendingReply}
            disabled={!text.trim()}
            onPress={() => void actions.submitTextReply(text)}
          />
        ) : undefined
      }
    >
      {typing ? (
        <View className="gap-5">
          <TextField
            textarea
            autoFocus
            value={text}
            onChangeText={setText}
            placeholder="Write the thing you wish someone had told you..."
          />
          <TextLink label="I'd rather speak" onPress={() => setTyping(false)} />
        </View>
      ) : (
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
          <TextLink className="mt-4" label="I'd rather type" onPress={() => setTyping(true)} />
        </View>
      )}
    </StepShell>
  );
}

function OfferStage() {
  const { isSendingReply, actions } = useMomentum();
  const [slot, setSlot] = useState<string | null>(null);
  return (
    <StepShell
      transitionKey="mentor-offer"
      eyebrow="One more thing"
      headline="Could you make time for a real conversation?"
      intro="Choose one opening, or send your note without offering a time."
      footer={
        <View className="gap-3">
          <ActionButton
            label="Offer this time"
            disabled={!slot}
            loading={isSendingReply}
            onPress={() => void actions.chooseAvailability(slot)}
          />
          <ActionButton
            label="Send without a time"
            variant="secondary"
            onPress={() => void actions.chooseAvailability(null)}
          />
        </View>
      }
    >
      <View className="gap-3">
        {AVAILABILITY_SLOTS.map((item) => {
          const selected = item === slot;
          return (
            <Tappable
              key={item}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => setSlot(item)}
              className={`min-h-[66px] flex-row items-center justify-between rounded-2xl border px-5 ${selected ? 'border-terracotta bg-terracotta-soft' : 'border-hairline bg-paper-raised'}`}
            >
              <BodyStrong>{item}</BodyStrong>
              {selected ? <Check color={TERRACOTTA} size={19} /> : null}
            </Tappable>
          );
        })}
      </View>
    </StepShell>
  );
}

function DoneStage() {
  const router = useRouter();
  const { offeredSlot, actions } = useMomentum();
  const finish = () => {
    actions.openSignal();
    router.replace('/');
  };
  return (
    <StepShell
      transitionKey="mentor-done"
      centered
      footer={<ActionButton label="Return to her side" onPress={finish} />}
    >
      <View className="items-center">
        <Waveform className="w-full" />
        <Display className="mt-9 text-center">Your note is on its way.</Display>
        <Body className="mt-5 max-w-[300px] text-center">
          She will see Adaeze and your first name only when she chooses to reply.
        </Body>
        {offeredSlot ? <Title className="mt-7 text-center">{offeredSlot}</Title> : null}
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
        <Body className="text-center">Opening her card.</Body>
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
          <ActionButton label="I can answer her" onPress={() => void actions.openReply()} />
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
        <Body>{challenge.timeAsk}</Body>
      </View>
      <Caption className="mt-4">
        You will not see her name, employer or photo until she chooses to share them.
      </Caption>
    </StepShell>
  );
}

export default function MentorScreen() {
  const { mentorStage } = useMomentum();
  switch (mentorStage) {
    case 'handoff':
      return <HandoffStage />;
    case 'notification':
      return <NotificationStage />;
    case 'inbox':
      return <InboxStage />;
    case 'reply':
      return <ReplyStage />;
    case 'offer':
      return <OfferStage />;
    case 'done':
      return <DoneStage />;
    case 'declined':
      return <DeclinedStage />;
    default: {
      const exhaustiveCheck: never = mentorStage;
      throw new Error(`Unhandled mentor stage: ${String(exhaustiveCheck)}`);
    }
  }
}
