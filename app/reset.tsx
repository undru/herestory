import { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';

import { Body } from '@/components/momentum/Type';
import { SafeAreaView } from '@/components/ui/primitives/SafeAreaView';
import { useMomentum } from '@/lib/momentum-context';

/** Demo reset: clears every answer and returns to step one. */
export default function ResetScreen() {
  const router = useRouter();
  const { actions } = useMomentum();

  useEffect(() => {
    actions.resetAll();
    const timer = setTimeout(() => router.replace('/'), 320);
    return () => clearTimeout(timer);
  }, [actions, router]);

  return (
    <SafeAreaView className="bg-paper flex-1">
      <View className="flex-1 items-center justify-center px-6">
        <Body className="text-center">Clearing everything.</Body>
      </View>
    </SafeAreaView>
  );
}
