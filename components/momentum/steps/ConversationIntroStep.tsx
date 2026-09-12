import { View } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';

import { ActionButton } from '@/components/momentum/ActionButton';
import { StepShell } from '@/components/momentum/StepShell';
import { Body } from '@/components/momentum/Type';
import { useMomentum } from '@/lib/momentum-context';
import { usePalette } from '@/lib/theme';

/** Sets the tone and the privacy promise before the first voice question. No mic here. */
export function ConversationIntroStep() {
  const { progress, actions } = useMomentum();
  const palette = usePalette();

  return (
    <StepShell
      transitionKey="conversationIntro"
      progress={progress}
      onBack={actions.goBack}
      eyebrow="3 of 6"
      headline="Now, let's actually talk."
      intro="A short voice conversation — think of it as a coffee chat, not an interview. We'll ask a few real questions to understand what you're looking for and what you have to offer."
      footer={<ActionButton label="Start the conversation" onPress={actions.startConversation} />}
    >
      <View className="border-line-firm flex-row gap-3 rounded-2xl border px-4 py-4">
        <View accessible accessibilityRole="image" accessibilityLabel="Privacy protected">
          <ShieldCheck size={20} color={palette.moss} strokeWidth={1.6} />
        </View>
        <Body className="text-ink flex-1">
          {
            "Your voice and answers stay on this platform. They're never shared, sold, or used to train other products."
          }
        </Body>
      </View>
    </StepShell>
  );
}
