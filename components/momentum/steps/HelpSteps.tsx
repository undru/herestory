import { useState } from 'react';
import { View } from 'react-native';

import { ActionButton, TextLink } from '@/components/momentum/ActionButton';
import { Avatar } from '@/components/momentum/Avatar';
import { Seal } from '@/components/momentum/Seal';
import { StepShell } from '@/components/momentum/StepShell';
import { TextField } from '@/components/momentum/TextField';
import {
  Body,
  BodyStrong,
  Caption,
  Headline,
  Overline,
  Quote,
  Title,
} from '@/components/momentum/Type';
import {
  FEELING_OPTIONS,
  HELP_ANSWER_PLACEHOLDER,
  HELP_REQUEST,
  MENTOR_FIRST_REPLY,
} from '@/data/mock';
import { useMomentum } from '@/lib/momentum-context';

/** One woman a little further behind: can she say something? */
export function HelpOfferStep() {
  const { progress, actions } = useMomentum();

  return (
    <StepShell
      transitionKey="help-offer"
      progress={progress}
      eyebrow="One woman. Not a list."
      headline="Someone is three years behind you."
      intro="You don't have to be through it to be ahead of someone."
      footer={
        <View>
          <ActionButton label="Yes, I can say something" onPress={actions.offerHelp} />
          <View className="mt-1 flex-row justify-center gap-4">
            <TextLink label="Not me" tone="muted" onPress={actions.skipHelp} />
            <TextLink label="Ask me another time" tone="muted" onPress={actions.skipHelp} />
          </View>
        </View>
      }
    >
      <View className="border-line-firm rounded-2xl border p-4">
        <Overline>Her challenge, not her name</Overline>
        <Quote className="mt-2">“{HELP_REQUEST.quote}”</Quote>
        <Overline className="mt-4">What she needs</Overline>
        <Body className="text-ink mt-1">{HELP_REQUEST.whatSheNeeds}</Body>
      </View>
      <Title className="mt-5 text-[17px]">Have you lived this?</Title>
    </StepShell>
  );
}

export function HelpAnswerStep() {
  const { isSending, progress, actions } = useMomentum();
  const [text, setText] = useState('');

  return (
    <StepShell
      transitionKey="help-answer"
      progress={progress}
      onBack={actions.goBack}
      eyebrow="Your answer"
      headline="Tell her the one thing you know."
      intro="Three sentences is plenty. You're not solving her life."
      footer={
        <ActionButton
          label="Send it"
          disabled={!text.trim()}
          loading={isSending}
          loadingLabel="Sending…"
          onPress={() => void actions.sendHelp(text)}
        />
      }
    >
      <TextField
        textarea
        autoFocus
        placeholder={HELP_ANSWER_PLACEHOLDER}
        value={text}
        onChangeText={setText}
      />
      <Caption className="text-ink-soft mt-3">
        {"She sees your words. She will never see what you're going through."}
      </Caption>
    </StepShell>
  );
}

/** The close of the flow, with the first reply from the mentor she asked. */
export function FinishStep() {
  const { feelings, helped, selectedMentor, progress, actions } = useMomentum();
  const name = selectedMentor?.firstName ?? 'Katrin';
  const feeling =
    FEELING_OPTIONS.find((option) => option.id === feelings[0])?.label.toLowerCase() ?? 'stuck';

  return (
    <StepShell
      transitionKey="finish"
      progress={progress}
      centered
      footer={
        <View>
          <ActionButton label="Start again" onPress={actions.resetAll} />
          <TextLink
            className="mt-1"
            label="Preview other screens"
            tone="muted"
            onPress={actions.openExtras}
          />
        </View>
      }
    >
      <Seal />
      <Headline className="mt-4">{helped ? "She'll read that today." : "That's alright."}</Headline>
      <Body className="mt-3">
        {helped
          ? `You came here ${feeling}. You left having told someone the truth.`
          : `Not every story is yours to answer. You came here ${feeling}, and someone already wrote back.`}
      </Body>

      <View className="border-line-firm mt-6 rounded-2xl border p-4">
        <View className="flex-row items-center gap-3">
          <Avatar name={name} />
          <View className="flex-1">
            <BodyStrong>{`${name} replied`}</BodyStrong>
            <Caption className="text-moss mt-0.5">{MENTOR_FIRST_REPLY.delay}</Caption>
          </View>
        </View>
        <Quote className="mt-3 text-[16px] leading-[23px]">“{MENTOR_FIRST_REPLY.text}”</Quote>
      </View>
    </StepShell>
  );
}
