import { View } from 'react-native';

import { ActionButton } from '@/components/momentum/ActionButton';
import { Body, Caption, Overline } from '@/components/momentum/Type';
import { EditableChip, EditableField } from '@/components/momentum/EditableField';
import { StepShell } from '@/components/momentum/StepShell';
import { useMomentum } from '@/lib/momentum-context';

export function MomentStep() {
  const { momentCard, isGeneratingCard, progress, actions } = useMomentum();

  if (!momentCard || isGeneratingCard) {
    return (
      <StepShell transitionKey="moment-loading" progress={progress} centered>
        <View className="items-center">
          <Body className="text-ink text-center">Putting it into words.</Body>
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
      headline="Here is what I heard."
      footer={
        <View className="gap-3">
          <ActionButton
            label="That's me"
            onPress={() => {
              void actions.commitMomentCard();
              actions.confirmMomentCard();
            }}
          />
          <ActionButton label="Not quite" variant="secondary" onPress={actions.rejectMomentCard} />
        </View>
      }
    >
      <View className="border-hairline bg-paper-raised rounded-[28px] border px-6 py-8">
        <EditableField
          variant="quote"
          value={momentCard.quote}
          accessibilityLabel="Your sentence"
          onChange={(value) => actions.updateMomentCard({ quote: value })}
        />

        <View className="bg-hairline mt-8 h-[1px] w-full" />

        <View className="mt-7">
          <Overline>Where you are</Overline>
          <View className="mt-2">
            <EditableField
              value={momentCard.whereYouAre}
              accessibilityLabel="Where you are"
              onChange={(value) => actions.updateMomentCard({ whereYouAre: value })}
            />
          </View>
        </View>

        <View className="mt-7">
          <Overline>What is in the way</Overline>
          <View className="mt-3 flex-row flex-wrap gap-2">
            {momentCard.inTheWay.map((chip, index) => (
              <EditableChip
                // fixed-length, in-place-edited list; keying on content would remount
                // the input (and drop focus) on every keystroke, so index is the stable key
                key={`way-${index}`} // oxlint-disable-line react/no-array-index-key
                value={chip}
                accessibilityLabel="What is in the way"
                onChange={(value) => replaceChip('inTheWay', index, value)}
              />
            ))}
          </View>
        </View>

        <View className="mt-7">
          <Overline>What you bring</Overline>
          <View className="mt-3 flex-row flex-wrap gap-2">
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
      </View>

      <Caption className="mt-5 text-center">Tap any line to change it.</Caption>
    </StepShell>
  );
}
