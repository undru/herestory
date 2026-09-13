import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, Check, MessageCircle } from 'lucide-react-native';

import { ActionButton, TextLink } from '@/components/momentum/ActionButton';
import { PreviewReturn } from '@/components/momentum/PreviewReturn';
import { AnonymizedCardPreview } from '@/components/momentum/AnonymizedCardPreview';
import { ChatThread, Composer, type ChatMessage } from '@/components/momentum/ChatThread';
import {
  Body,
  BodyStrong,
  Caption,
  Display,
  Overline,
  Quote,
  Title,
} from '@/components/momentum/Type';
import { StepShell } from '@/components/momentum/StepShell';
import { Tappable } from '@/components/momentum/Tappable';
import { Waveform } from '@/components/momentum/Waveform';
import { AVAILABILITY_SLOTS, MENTOR_REPLY_PROMPT, MENTOR_REPLY_SECONDS } from '@/data/mock';
import { useMockRecorder } from '@/hooks/useRecorder';
import { useMomentum, type MentorStage } from '@/lib/momentum-context';
import { goBackOrReplace } from '@/lib/navigation';
import { usePalette } from '@/lib/theme';
import { formatDuration } from '@/lib/utils';

function HandoffStage() {
  const palette = usePalette();
  const { actions } = useMomentum();
  return (
    <StepShell
      transitionKey="mentor-handoff"
      centered
      onBack={() => goBackOrReplace('/')}
      footer={<ActionButton label="Open the invitation" onPress={actions.openMentorNotification} />}
    >
      <View className="items-center">
        <View className="bg-brand-soft h-20 w-20 items-center justify-center rounded-full">
          <MessageCircle color={palette.brand} size={30} strokeWidth={1.5} />
        </View>
        <Overline className="text-brand mt-8">Momentum</Overline>
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
  const palette = usePalette();
  const { actions } = useMomentum();
  return (
    <StepShell
      transitionKey="mentor-notification"
      centered
      footer={<ActionButton label="Read her challenge" onPress={actions.openMentorInbox} />}
    >
      <View className="border-line-firm w-full rounded-3xl border p-5">
        <View className="flex-row items-center gap-4">
          <View className="bg-brand-soft h-12 w-12 items-center justify-center rounded-2xl">
            <Bell color={palette.brand} size={22} />
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

const REPLY_GUIDE: ChatMessage[] = [
  { id: 'reply-prompt', from: 'guide', text: MENTOR_REPLY_PROMPT },
  { id: 'reply-why', from: 'guide', text: 'No advice needed yet. Tell her you have been there.' },
];

function ReplyStage() {
  const { challenge, isSendingReply, actions } = useMomentum();
  const [text, setText] = useState('');
  const [reply, setReply] = useState<ChatMessage | null>(null);

  // Opened straight from the preview list: fetch the card for the top of the thread.
  const requested = useRef(false);
  useEffect(() => {
    if (requested.current || challenge) return;
    requested.current = true;
    void actions.loadChallenge();
  }, [actions, challenge]);

  const recorder = useMockRecorder('mentor-reply', {
    maxSeconds: MENTOR_REPLY_SECONDS,
    onResult: (result) => {
      setReply({
        id: 'reply-voice',
        from: 'her',
        text: result.transcript,
        voiceSeconds: result.durationSeconds,
      });
      void actions.submitVoiceReply(result);
    },
  });
  const remaining = Math.max(MENTOR_REPLY_SECONDS - recorder.seconds, 0);
  const isBusy =
    reply !== null ||
    isSendingReply ||
    recorder.state === 'recording' ||
    recorder.state === 'transcribing';

  const sendText = () => {
    const note = text.trim();
    if (!note) return;
    setReply({ id: 'reply-text', from: 'her', text: note });
    setText('');
    void actions.submitTextReply(note);
  };

  return (
    <ChatThread
      onBack={() => goBackOrReplace('/')}
      header={
        challenge ? (
          <View className="border-line-firm rounded-[20px] border p-4">
            <Overline>{challenge.label}</Overline>
            <Quote className="mt-2">“{challenge.quote}”</Quote>
          </View>
        ) : null
      }
      messages={reply ? [...REPLY_GUIDE, reply] : REPLY_GUIDE}
      revealFrom={0}
      composer={
        <Composer
          multiline
          value={text}
          onChangeText={setText}
          placeholder="Write the thing you wish someone had told you..."
          canSend={text.trim().length > 0 && !isBusy}
          onSend={sendText}
          recorder={{
            state: recorder.state,
            status:
              recorder.state === 'recording'
                ? `${formatDuration(remaining)} left`
                : 'Sending your voice note',
            onToggle: () => {
              // Once a note is on its way, the mic stays put.
              if (!reply && !isSendingReply) recorder.toggle();
            },
          }}
        />
      }
    />
  );
}

function OfferStage() {
  const palette = usePalette();
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
              className={`min-h-[66px] flex-row items-center justify-between rounded-[20px] border px-5 ${selected ? 'border-brand bg-brand-soft' : 'border-line-firm'}`}
            >
              <BodyStrong>{item}</BodyStrong>
              {selected ? <Check color={palette.brand} size={19} /> : null}
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
          She will see your first name only when she chooses to reply.
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
        <View className="bg-brand h-[6px] w-[6px] rounded-full" />
        <Body>{challenge.timeAsk}</Body>
      </View>
      <Caption className="mt-4">
        You will not see her name, employer or photo until she chooses to share them.
      </Caption>
    </StepShell>
  );
}

function MentorStageScreen({ stage }: { stage: MentorStage }) {
  switch (stage) {
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
      const exhaustiveCheck: never = stage;
      throw new Error(`Unhandled mentor stage: ${String(exhaustiveCheck)}`);
    }
  }
}

/** The mentor's side, only reachable from the "Other screens" preview list for now. */
export default function MentorScreen() {
  const { mentorStage, actions } = useMomentum();

  const backToList = () => {
    actions.openExtras();
    goBackOrReplace('/');
  };

  return (
    <View className="flex-1">
      <MentorStageScreen stage={mentorStage} />
      <PreviewReturn onPress={backToList} />
    </View>
  );
}
