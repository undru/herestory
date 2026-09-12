import { View } from 'react-native';

import { ActionButton } from '@/components/momentum/ActionButton';
import { OptionCard } from '@/components/momentum/OptionCard';
import { StepShell } from '@/components/momentum/StepShell';
import { LIFE_AREA_OPTIONS } from '@/data/mock';
import { useMomentum } from '@/lib/momentum-context';

export function LifeAreaStep() {
  const { lifeArea, progress, actions } = useMomentum();

  return (
    <StepShell
      transitionKey="lifeArea"
      progress={progress}
      onBack={actions.goBack}
      headline="Where is this coming from?"
      footer={
        <ActionButton
          label="Continue"
          disabled={lifeArea === null}
          onPress={actions.continueFromLifeArea}
        />
      }
    >
      <View className="gap-4">
        {LIFE_AREA_OPTIONS.map((option) => (
          <OptionCard
            key={option.id}
            title={option.title}
            subtitle={option.subtitle}
            selected={lifeArea === option.id}
            onPress={() => actions.chooseLifeArea(option.id)}
          />
        ))}
      </View>
    </StepShell>
  );
}
