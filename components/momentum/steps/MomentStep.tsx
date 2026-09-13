import { View } from 'react-native';

import { ActionButton, TextLink } from '@/components/momentum/ActionButton';
import { Body, Caption, Overline, Title } from '@/components/momentum/Type';
import { EditableChip, EditableField } from '@/components/momentum/EditableField';
import { StepShell } from '@/components/momentum/StepShell';
import { GuideThreadStep } from '@/components/momentum/steps/GuideThreadStep';
import { useMomentum } from '@/lib/momentum-context';

export function MomentStep() {
  const { momentCard, isGeneratingCard, cardError, progress, actions } = useMomentum();

  // The closing line and typing indicator stay in the thread only while the card is really being built.
  if (isGeneratingCard || (!momentCard && !cardError)) {
    return <GuideThreadStep />;
  }

  if (cardError || !momentCard) {
    return (
      <StepShell
        transitionKey="moment-error"
        progress={progress}
        onBack={actions.goBack}
        centered
        footer={<ActionButton label="Try again" onPress={() => void actions.retryMomentCard()} />}
      >
        <View role="alert" accessibilityLiveRegion="assertive" className="items-center">
          <Title className="text-center">We couldn’t put this together just now.</Title>
          <Body className="mt-3 text-center">
            Your answers are still here. Try again, or go back to change them.
          </Body>
        </View>
      </StepShell>
    );
  }

  const replaceChip = (key: 'inTheWay' | 'whatYouBring', index: number, value: string) => {
    const next = [...momentCard[key]];
    next[index] = value;
    actions.updateMomentCard({ [key]: next });
  };

  return (
    <StepShell
      transitionKey="moment"
      progress={progress}
      onBack={actions.goBack}
      eyebrow="4 of 6"
      headline="Here's what I heard."
      footer={
        <View>
          <ActionButton
            label="That's me"
            onPress={() => {
              void actions.commitMomentCard();
              actions.confirmMomentCard();
            }}
          />
          <TextLink
            className="mt-1"
            label="Not quite, let me add to that"
            tone="muted"
            onPress={actions.addToAnswers}
          />
        </View>
      }
    >
      <View className="border-line-firm rounded-[20px] border p-4">
        <EditableField
          variant="quote"
          value={momentCard.quote}
          accessibilityLabel="Your sentence"
          onChange={(value) => actions.updateMomentCard({ quote: value })}
        />

        <Overline className="mt-4">Where you are</Overline>
        <View className="mt-1">
          <EditableField
            value={momentCard.whereYouAre}
            accessibilityLabel="Where you are"
            onChange={(value) => actions.updateMomentCard({ whereYouAre: value })}
          />
        </View>

        <Overline className="mt-3">{"What's in the way"}</Overline>
        <View className="mt-2 flex-row flex-wrap gap-2">
          {momentCard.inTheWay.map((chip, index) => (
            <EditableChip
              // fixed-length, in-place-edited list; keying on content would remount
              // the input (and drop focus) on every keystroke, so index is the stable key
              key={`way-${index}`} // oxlint-disable-line react/no-array-index-key
              value={chip}
              accessibilityLabel="What's in the way"
              onChange={(value) => replaceChip('inTheWay', index, value)}
            />
          ))}
        </View>

        <Overline className="mt-4">What you bring</Overline>
        <View className="mt-2 flex-row flex-wrap gap-2">
          {momentCard.whatYouBring.map((chip, index) => (
            <EditableChip
              // fixed-length, in-place-edited list; keying on content would remount
              // the input (and drop focus) on every keystroke, so index is the stable key
              key={`bring-${index}`} // oxlint-disable-line react/no-array-index-key
              value={chip}
              accessibilityLabel="What you bring"
              onChange={(value) => replaceChip('whatYouBring', index, value)}
            />
          ))}
        </View>
      </View>

      <Caption className="mt-4 text-center">Tap any line to change it.</Caption>
    </StepShell>
  );
}
