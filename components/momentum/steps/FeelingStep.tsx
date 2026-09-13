import { useState } from 'react';
import { Text, View } from 'react-native';
import { ArrowRight } from 'lucide-react-native';

import { ActionButton } from '@/components/momentum/ActionButton';
import { FeelingBubble, FeelingGroupBubble } from '@/components/momentum/FeelingBubble';
import { StepShell } from '@/components/momentum/StepShell';
import { Tappable } from '@/components/momentum/Tappable';
import { Caption } from '@/components/momentum/Type';
import {
  FEELING_GROUPS,
  FEELING_HEADLINE,
  FEELING_HELPER,
  FEELING_INTRO,
  FEELING_OPTIONS,
  MAX_FEELINGS,
  type FeelingGroup,
  type FeelingGroupId,
} from '@/data/mock';
import { useMomentum } from '@/lib/momentum-context';
import { FEELING_BUBBLES, sans, usePalette, type FeelingFamily } from '@/lib/theme';
import { cn } from '@/lib/utils';

/** Heavy feelings read red, in-between blue, curious yellow, positive green. */
const GROUP_FAMILY: Record<FeelingGroupId, FeelingFamily> = {
  difficult: 'heavy',
  uncertain: 'uncertain',
  curious: 'curious',
  positive: 'hopeful',
};

/** Reading order of the 2×2 grid: heavy and curious on top, in-between and positive below. */
const QUADRANT_ORDER: FeelingGroupId[] = ['difficult', 'curious', 'uncertain', 'positive'];

/** Splits items into alternating rows of 2 and 1 so circles nest like a honeycomb. */
function honeycombRows<T>(items: T[]): T[][] {
  const rows: T[][] = [];
  let size = items.length % 2 === 0 ? 1 : 2;
  let start = 0;
  while (start < items.length) {
    rows.push(items.slice(start, start + size));
    start += size;
    size = 3 - size;
  }
  return rows;
}

/** Dark pill docked at the bottom: the latest feeling, how many are chosen, and the way forward. */
function FeelingSummary() {
  const palette = usePalette();
  const { feelings, actions } = useMomentum();
  const latest = FEELING_OPTIONS.find((option) => option.id === feelings.at(-1));
  const canContinue = feelings.length > 0;

  return (
    <View className="bg-ink min-h-[76px] flex-row items-center gap-3 rounded-full py-2 pr-2 pl-6">
      <View className="flex-1">
        {latest ? (
          <>
            <View className="flex-row items-center gap-2">
              <View
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor: FEELING_BUBBLES[GROUP_FAMILY[latest.group]].gradient[0],
                }}
              />
              <Text
                numberOfLines={1}
                style={{ fontFamily: sans.semibold }}
                className="text-paper shrink text-[16px] leading-[22px]"
              >
                {latest.label}
              </Text>
            </View>
            <Text
              style={{ fontFamily: sans.regular }}
              className="text-paper text-[14px] leading-[20px] opacity-80"
            >
              {`${feelings.length} of ${MAX_FEELINGS} chosen`}
            </Text>
          </>
        ) : (
          <Text
            style={{ fontFamily: sans.regular }}
            className="text-paper text-[15px] leading-[21px]"
          >
            {FEELING_HELPER}
          </Text>
        )}
      </View>
      {/* Dim on a wrapper: Tappable's animated press opacity overrides an opacity class on itself. */}
      <View className={cn(!canContinue && 'opacity-40')}>
        <Tappable
          accessibilityRole="button"
          accessibilityLabel="Continue"
          accessibilityState={{ disabled: !canContinue }}
          disabled={!canContinue}
          onPress={actions.continueFromFeeling}
          pressScale={0.94}
          className="bg-paper h-[60px] w-[60px] items-center justify-center rounded-full"
        >
          <ArrowRight size={24} color={palette.ink} strokeWidth={1.8} />
        </Tappable>
      </View>
    </View>
  );
}

/** One family opened up: its feelings as a honeycomb of shaded circles. */
function FeelingGroupView({ group, onClose }: { group: FeelingGroup; onClose: () => void }) {
  const { feelings, progress, actions } = useMomentum();
  const atLimit = feelings.length >= MAX_FEELINGS;
  const options = FEELING_OPTIONS.filter((option) => option.group === group.id);
  const rows = honeycombRows(options);

  return (
    <StepShell
      transitionKey={`feeling-${group.id}`}
      progress={progress}
      onBack={onClose}
      eyebrow="1 of 6"
      headline={group.label}
      footer={<FeelingSummary />}
    >
      {rows.map((row, rowIndex) => (
        <View
          key={row.map((option) => option.id).join()}
          className="flex-row justify-center gap-2"
          style={rowIndex > 0 ? { marginTop: '-6%' } : undefined}
        >
          {row.map((option) => {
            const selected = feelings.includes(option.id);
            const position = options.indexOf(option);
            return (
              <View key={option.id} className="w-[47%]">
                <FeelingBubble
                  label={option.label}
                  family={GROUP_FAMILY[group.id]}
                  shade={options.length > 1 ? position / (options.length - 1) : 0.5}
                  selected={selected}
                  disabled={!selected && atLimit}
                  onPress={() => actions.toggleFeeling(option.id)}
                />
              </View>
            );
          })}
        </View>
      ))}
    </StepShell>
  );
}

export function FeelingStep() {
  const { feelings, progress, actions } = useMomentum();
  const [openGroupId, setOpenGroupId] = useState<FeelingGroupId | null>(null);
  const openGroup = FEELING_GROUPS.find((group) => group.id === openGroupId);

  if (openGroup) {
    return <FeelingGroupView group={openGroup} onClose={() => setOpenGroupId(null)} />;
  }

  const quadrants = [...FEELING_GROUPS].sort(
    (a, b) => QUADRANT_ORDER.indexOf(a.id) - QUADRANT_ORDER.indexOf(b.id),
  );
  const chosenIn = (groupId: FeelingGroupId) =>
    FEELING_OPTIONS.filter((option) => option.group === groupId && feelings.includes(option.id))
      .length;

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
      <View className="mt-4">
        {[quadrants.slice(0, 2), quadrants.slice(2, 4)].map((row, rowIndex) => (
          <View
            key={row.map((group) => group.id).join()}
            className="flex-row"
            style={rowIndex > 0 ? { marginTop: '-4%' } : undefined}
          >
            {row.map((group, index) => (
              <View key={group.id} className="w-1/2">
                <FeelingGroupBubble
                  label={group.label}
                  family={GROUP_FAMILY[group.id]}
                  count={chosenIn(group.id)}
                  index={rowIndex * 2 + index}
                  onPress={() => setOpenGroupId(group.id)}
                />
              </View>
            ))}
          </View>
        ))}
      </View>
    </StepShell>
  );
}
