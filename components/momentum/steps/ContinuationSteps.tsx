import { useState } from 'react';
import { View } from 'react-native';
import {
  CalendarDays,
  Check,
  LockKeyhole,
  MessageCircle,
  ShieldCheck,
  Users,
} from 'lucide-react-native';

import { ActionButton, TextLink } from '@/components/momentum/ActionButton';
import { StepShell } from '@/components/momentum/StepShell';
import { Tappable } from '@/components/momentum/Tappable';
import { TextField } from '@/components/momentum/TextField';
import {
  Body,
  BodyStrong,
  Caption,
  Display,
  Overline,
  Quote,
  Title,
} from '@/components/momentum/Type';
import {
  AVAILABILITY_SLOTS,
  CONVERSATION_MESSAGES,
  MENTOR_TEXT_REPLY,
  PEOPLE,
  REDACTION_ORIGINAL,
  REDACTION_SAFE_PARTS,
  WELCOME_HEADLINE,
  WELCOME_SUBHEAD,
} from '@/data/mock';
import { useMomentum } from '@/lib/momentum-context';
import { INK_FAINT, TERRACOTTA } from '@/lib/theme';

function Initial({ label, muted = false }: { label: string; muted?: boolean }) {
  return (
    <View
      className={`h-12 w-12 items-center justify-center rounded-full ${muted ? 'bg-stone' : 'bg-terracotta-soft'}`}
    >
      <Title className={muted ? 'text-ink-soft' : 'text-terracotta-deep'}>{label}</Title>
    </View>
  );
}

export function WelcomeStep() {
  const { actions } = useMomentum();
  return (
    <StepShell
      transitionKey="welcome"
      centered
      footer={<ActionButton label="Tell us where you are" onPress={actions.startJourney} />}
    >
      <View className="items-center">
        <View className="border-terracotta-soft bg-paper-raised mb-9 h-20 w-20 items-center justify-center rounded-full border">
          <MessageCircle color={TERRACOTTA} size={30} strokeWidth={1.4} />
        </View>
        <Display className="text-center">{WELCOME_HEADLINE}</Display>
        <Body className="mt-5 max-w-[320px] text-center">{WELCOME_SUBHEAD}</Body>
        <View className="mt-9 flex-row items-center gap-2">
          <LockKeyhole color={INK_FAINT} size={14} strokeWidth={1.7} />
          <Caption>Your details stay private until you choose otherwise.</Caption>
        </View>
      </View>
    </StepShell>
  );
}

export function RedactionStep() {
  const { isSending, actions } = useMomentum();
  return (
    <StepShell
      transitionKey="redaction"
      onBack={actions.goBack}
      eyebrow="Before it leaves your hands"
      headline="We take out the details that could identify you."
      intro="Her first read is about your moment, not your name, employer or manager."
      footer={
        <ActionButton
          label="Send this safely"
          loading={isSending}
          loadingLabel="Sending…"
          onPress={() => void actions.confirmRedaction()}
        />
      }
    >
      <View className="gap-5">
        <View className="border-hairline bg-paper-raised rounded-3xl border p-5">
          <Overline>What you said</Overline>
          <Body className="mt-4 line-through">{REDACTION_ORIGINAL}</Body>
        </View>
        <View className="border-terracotta-soft bg-terracotta-soft rounded-3xl border p-5">
          <View className="flex-row items-center gap-2">
            <ShieldCheck color={TERRACOTTA} size={17} />
            <Overline className="text-terracotta-deep">What she sees</Overline>
          </View>
          <BodyStrong className="mt-4">{REDACTION_SAFE_PARTS.join('')}</BodyStrong>
        </View>
        <Caption className="text-center">
          You can still go back. Nothing has been shared yet.
        </Caption>
      </View>
    </StepShell>
  );
}

export function SignalStep() {
  const { actions } = useMomentum();
  return (
    <StepShell
      transitionKey="signal"
      centered
      footer={<ActionButton label="Read her answer" onPress={actions.viewAnswer} />}
    >
      <View className="items-center">
        <Initial label="A" />
        <Overline className="text-terracotta-deep mt-7">A woman answered</Overline>
        <Display className="mt-4 text-center">She has been where you are.</Display>
        <Body className="mt-5 max-w-[300px] text-center">
          Adaeze read your challenge and left you a private note.
        </Body>
      </View>
    </StepShell>
  );
}

export function AnswerStep() {
  const { actions } = useMomentum();
  return (
    <StepShell
      transitionKey="answer"
      onBack={actions.goBack}
      eyebrow="Adaeze answered"
      headline="Her first note to you"
      footer={<ActionButton label="Let Adaeze know who I am" onPress={actions.acceptConnection} />}
    >
      <View className="border-hairline bg-paper-raised rounded-3xl border p-6">
        <Quote>“{MENTOR_TEXT_REPLY}”</Quote>
        <View className="border-hairline mt-6 flex-row items-center gap-3 border-t pt-5">
          <Initial label="A" />
          <View className="flex-1">
            <BodyStrong>Adaeze, 41</BodyStrong>
            <Caption>Returned to leadership after parental leave</Caption>
          </View>
        </View>
      </View>
      <View className="mt-5 flex-row items-center justify-center gap-2">
        <LockKeyhole color={INK_FAINT} size={13} />
        <Caption>She still cannot see your identity.</Caption>
      </View>
    </StepShell>
  );
}

export function ConnectedStep() {
  const { actions } = useMomentum();
  return (
    <StepShell
      transitionKey="connected"
      centered
      footer={<ActionButton label="Say hello" onPress={actions.openChat} />}
    >
      <View className="items-center">
        <View className="flex-row items-center">
          <Initial label="L" muted />
          <View className="-ml-2">
            <Initial label="A" />
          </View>
        </View>
        <Display className="mt-8 text-center">You can see each other now.</Display>
        <Body className="mt-5 max-w-[310px] text-center">
          Your first names are shared. Everything else stays between the two of you.
        </Body>
      </View>
    </StepShell>
  );
}

export function ChatStep() {
  const { actions } = useMomentum();
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState(CONVERSATION_MESSAGES.slice(0, 2));
  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((current) => [...current, { id: `local-${Date.now()}`, from: 'mentee', text }]);
    setDraft('');
  };
  return (
    <StepShell
      transitionKey="chat"
      onBack={actions.goBack}
      eyebrow="Adaeze"
      headline="A private conversation"
      footer={
        <View className="gap-3">
          <TextField value={draft} onChangeText={setDraft} placeholder="Write a message" />
          <View className="flex-row gap-3">
            <ActionButton className="flex-1" label="Send" disabled={!draft.trim()} onPress={send} />
            <Tappable
              accessibilityRole="button"
              accessibilityLabel="Choose a time"
              onPress={actions.openBooking}
              className="border-hairline h-[54px] w-[54px] items-center justify-center rounded-full border"
            >
              <CalendarDays color={TERRACOTTA} size={21} />
            </Tappable>
          </View>
        </View>
      }
    >
      <View className="gap-3">
        {messages.map((message) => (
          <View
            key={message.id}
            className={`max-w-[88%] rounded-3xl px-4 py-3 ${message.from === 'mentee' ? 'bg-terracotta-soft ml-auto' : 'bg-stone'}`}
          >
            <BodyStrong>{message.text}</BodyStrong>
          </View>
        ))}
        <TextLink label="Find a time to talk" onPress={actions.openBooking} />
      </View>
    </StepShell>
  );
}

export function BookStep() {
  const { actions } = useMomentum();
  const [slot, setSlot] = useState<string | null>(null);
  return (
    <StepShell
      transitionKey="book"
      onBack={actions.goBack}
      eyebrow="Make room for the real conversation"
      headline="When can you both talk?"
      footer={
        <ActionButton
          label="Confirm this time"
          disabled={!slot}
          onPress={() => slot && void actions.confirmBooking(slot)}
        />
      }
    >
      <View className="gap-3">
        {AVAILABILITY_SLOTS.map((item) => {
          const selected = slot === item;
          return (
            <Tappable
              key={item}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => setSlot(item)}
              className={`min-h-[68px] flex-row items-center justify-between rounded-2xl border px-5 ${selected ? 'border-terracotta bg-terracotta-soft' : 'border-hairline bg-paper-raised'}`}
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

export function BookedStep() {
  const { bookedSlot, actions } = useMomentum();
  return (
    <StepShell
      transitionKey="booked"
      centered
      footer={<ActionButton label="See my people" onPress={actions.openPeople} />}
    >
      <View className="items-center">
        <View className="bg-terracotta-soft h-20 w-20 items-center justify-center rounded-full">
          <CalendarDays color={TERRACOTTA} size={30} strokeWidth={1.5} />
        </View>
        <Display className="mt-8 text-center">It’s in the diary.</Display>
        <BodyStrong className="mt-5 text-center">{bookedSlot}</BodyStrong>
        <Caption className="mt-3 text-center">
          We will keep the details here for both of you.
        </Caption>
      </View>
    </StepShell>
  );
}

export function PeopleStep() {
  const { actions } = useMomentum();
  return (
    <StepShell
      transitionKey="people"
      onBack={actions.goBack}
      eyebrow="Your circle"
      headline="Women you have met here"
    >
      <View className="gap-3">
        {PEOPLE.map((person, index) => (
          <View
            key={person.name}
            className="border-hairline bg-paper-raised flex-row items-center gap-4 rounded-3xl border p-4"
          >
            <Initial label={person.name.charAt(0)} muted={index > 1} />
            <View className="flex-1">
              <BodyStrong>{person.name}</BodyStrong>
              <Caption className="mt-0.5">{person.context}</Caption>
              <Caption className="text-terracotta-deep mt-2">{person.status}</Caption>
            </View>
          </View>
        ))}
      </View>
      <View className="mt-8 flex-row items-center justify-center gap-2">
        <Users color={INK_FAINT} size={15} />
        <Caption>Private, small, and yours.</Caption>
      </View>
    </StepShell>
  );
}
