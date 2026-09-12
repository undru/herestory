import { View } from 'react-native';

import { ActionButton } from '@/components/momentum/ActionButton';
import { Body, BodyStrong, Caption, Overline, Quote, Title } from '@/components/momentum/Type';
import type { Mentor } from '@/data/mock';

interface MentorCardProps {
  mentor: Mentor;
  onAsk: () => void;
  busy?: boolean;
}

function Bullet({ children }: { children: string }) {
  return (
    <View className="flex-row gap-3">
      <View className="bg-terracotta mt-[9px] h-[5px] w-[5px] rounded-full" />
      <Body className="flex-1">{children}</Body>
    </View>
  );
}

/** A matched mentor: first name, age, her own words, and why she fits. */
export function MentorCard({ mentor, onAsk, busy = false }: MentorCardProps) {
  return (
    <View className="border-hairline bg-paper-raised rounded-3xl border p-6">
      <View className="flex-row items-center gap-4">
        <View className="bg-stone h-14 w-14 items-center justify-center rounded-full">
          <Title className="text-ink-faint">{mentor.firstName.charAt(0)}</Title>
        </View>
        <View className="flex-1">
          <BodyStrong className="text-[17px]">
            {mentor.firstName}, {mentor.age}
          </BodyStrong>
          <Caption className="mt-1">{mentor.transition}</Caption>
        </View>
      </View>

      <Quote className="mt-6 text-[21px] leading-[32px]">“{mentor.quote}”</Quote>

      <View className="bg-hairline mt-6 h-[1px] w-full" />

      <Overline className="mt-6">Why her, for you</Overline>
      <View className="mt-4 gap-3">
        {mentor.whyHer.map((line) => (
          <Bullet key={line}>{line}</Bullet>
        ))}
      </View>

      <View className="mt-6 flex-row items-center gap-2">
        <View className="bg-terracotta h-[6px] w-[6px] rounded-full" />
        <BodyStrong>{mentor.availability}</BodyStrong>
      </View>

      <ActionButton
        className="mt-6"
        label="Ask her for 30 minutes"
        onPress={onAsk}
        loading={busy}
        loadingLabel="Opening…"
      />
    </View>
  );
}
