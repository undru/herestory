import { Text, View } from 'react-native';

import { ActionButton } from '@/components/momentum/ActionButton';
import { PillChip, type ChipFamily } from '@/components/momentum/PillChip';
import { StepShell } from '@/components/momentum/StepShell';
import { Caption } from '@/components/momentum/Type';
import {
  FEELING_GROUPS,
  FEELING_HEADLINE,
  FEELING_HELPER,
  FEELING_INTRO,
  FEELING_OPTIONS,
  MAX_FEELINGS,
  type FeelingGroupId,
} from '@/data/mock';
import { useMomentum } from '@/lib/momentum-context';
import { sans } from '@/lib/theme';

/** Heavy feelings read red, curious yellow, positive green; in-between stays neutral brand. */
const GROUP_FAMILY: Record<FeelingGroupId, ChipFamily> = {
  difficult: 'heavy',
  uncertain: 'brand',
  curious: 'curious',
  positive: 'hopeful',
};

export function FeelingStep() {
  const { feelings, progress, actions } = useMomentum();
  const atLimit = feelings.length >= MAX_FEELINGS;

  return (
    <StepShell
      transitionKey="feeling"
      progress={progress}
      eyebrow="1 of 6"
      headline={FEELING_HEADLINE}
      intro={FEELING_INTRO}
      footer={
        <ActionButton
          label="Continue"
          disabled={feelings.length === 0}
          onPress={actions.continueFromFeeling}
        />
      }
    >
      <Caption className="text-ink-soft">{FEELING_HELPER}</Caption>
      {FEELING_GROUPS.map((group) => (
        <View key={group.id} className="mt-6">
          <Text
            accessibilityRole="header"
            style={{ fontFamily: sans.medium }}
            className="text-ink mb-3 text-[13px] leading-[18px]"
          >
            {group.label}
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {FEELING_OPTIONS.filter((option) => option.group === group.id).map((option) => {
              const selected = feelings.includes(option.id);
              return (
                <PillChip
                  key={option.id}
                  label={option.label}
                  family={GROUP_FAMILY[group.id]}
                  selected={selected}
                  disabled={!selected && atLimit}
                  onPress={() => actions.toggleFeeling(option.id)}
                />
              );
            })}
          </View>
        </View>
      ))}
    </StepShell>
  );
}
