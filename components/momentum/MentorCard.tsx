import { View } from 'react-native';
import { FadeIn } from 'react-native-reanimated';

import { ActionButton } from '@/components/momentum/ActionButton';
import { Avatar } from '@/components/momentum/Avatar';
import { Tappable } from '@/components/momentum/Tappable';
import { Body, BodyStrong, Caption, Overline, Quote } from '@/components/momentum/Type';
import { AnimatedView } from '@/components/ui/primitives/AnimatedView';
import type { Mentor } from '@/data/mock';

interface MentorCardProps {
  mentor: Mentor;
  /** Only one card is open at a time; the rest collapse to a single line. */
  expanded: boolean;
  onOpen: () => void;
  onAsk: () => void;
}

/** A matched mentor: first name and age, and when open, her words and why she fits. */
export function MentorCard({ mentor, expanded, onOpen, onAsk }: MentorCardProps) {
  const name = `${mentor.firstName}, ${mentor.age}`;

  if (!expanded) {
    return (
      <Tappable
        accessibilityRole="button"
        accessibilityState={{ expanded: false }}
        accessibilityLabel={`${name}. ${mentor.transition}. Tap to open.`}
        onPress={onOpen}
        pressScale={0.99}
        className="border-hairline flex-row items-center gap-3 rounded-2xl border p-[14px]"
      >
        <Avatar name={mentor.firstName} />
        <View className="flex-1">
          <BodyStrong>{name}</BodyStrong>
          <Caption className="text-ink-soft mt-0.5">{mentor.transition}</Caption>
        </View>
      </Tappable>
    );
  }

  return (
    <AnimatedView
      entering={FadeIn.duration(220)}
      accessibilityState={{ expanded: true }}
      className="border-line-firm rounded-2xl border p-[14px]"
    >
      <View className="flex-row items-center gap-3">
        <Avatar name={mentor.firstName} />
        <View className="flex-1">
          <BodyStrong>{name}</BodyStrong>
          <Caption className="text-moss mt-0.5">{mentor.availability}</Caption>
        </View>
      </View>

      <Quote className="mt-3 text-[16px] leading-[23px]">“{mentor.quote}”</Quote>

      <Overline className="mt-4">Why her, for you</Overline>
      <Body className="text-ink mt-1">{mentor.whyHer}</Body>

      <ActionButton className="mt-4" label={`Ask ${mentor.firstName}`} onPress={onAsk} />
    </AnimatedView>
  );
}
