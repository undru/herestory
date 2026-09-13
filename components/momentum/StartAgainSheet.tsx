import { Modal, Pressable, View } from 'react-native';

import { ActionButton, TextLink } from '@/components/momentum/ActionButton';
import { Body, Title } from '@/components/momentum/Type';

interface StartAgainSheetProps {
  visible: boolean;
  onKeep: () => void;
  onClear: () => void;
  onCancel: () => void;
}

/** Asked on "Start again" when history is saved: keep it, or clear it with the answers. */
export function StartAgainSheet({ visible, onKeep, onClear, onCancel }: StartAgainSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <View className="flex-1 justify-end">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cancel"
          onPress={onCancel}
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(16, 16, 24, 0.4)' }}
        />
        <View
          accessibilityViewIsModal
          className="bg-paper w-full max-w-[430px] self-center rounded-t-[28px] px-6 pt-3 pb-8"
        >
          <View className="bg-hairline mb-5 h-1 w-10 self-center rounded-full" />
          <Title>Start again?</Title>
          <Body className="mt-2">Your answers for this run will be cleared.</Body>
          <ActionButton className="mt-5" label="Keep my history" onPress={onKeep} />
          <TextLink className="mt-1" label="Clear my history too" onPress={onClear} />
          <TextLink label="Cancel" tone="muted" onPress={onCancel} />
        </View>
      </View>
    </Modal>
  );
}
