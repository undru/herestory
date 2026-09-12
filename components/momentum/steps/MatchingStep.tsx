import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { FadeIn } from 'react-native-reanimated';

import { AnimatedView } from '@/components/ui/primitives/AnimatedView';
import { StepShell } from '@/components/momentum/StepShell';
import { Title } from '@/components/momentum/Type';
import { MATCHING_LINES } from '@/data/mock';
import { useMomentum } from '@/lib/momentum-context';

const LINE_DELAY_MS = 700;

export function MatchingStep() {
  const { progress, actions } = useMomentum();
  const runMatchingRef = useRef(actions.runMatching);

  useEffect(() => {
    runMatchingRef.current = actions.runMatching;
  }, [actions.runMatching]);

  useEffect(() => {
    const timer = setTimeout(
      () => {
        void runMatchingRef.current();
      },
      LINE_DELAY_MS * (MATCHING_LINES.length - 1) + 200,
    );
    return () => clearTimeout(timer);
  }, []);

  return (
    <StepShell transitionKey="matching" progress={progress} centered>
      <View className="gap-6">
        {MATCHING_LINES.map((line, index) => (
          <AnimatedView key={line} entering={FadeIn.duration(800).delay(index * LINE_DELAY_MS)}>
            <Title className="text-ink">{line}</Title>
          </AnimatedView>
        ))}
      </View>
    </StepShell>
  );
}
