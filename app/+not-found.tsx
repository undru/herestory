import { Link, Stack } from 'expo-router';
import { View } from 'react-native';

import { Body, Display } from '@/components/momentum/Type';
import { SafeAreaView } from '@/components/ui/primitives/SafeAreaView';
import { sans, usePalette } from '@/lib/theme';

export default function NotFoundScreen() {
  const palette = usePalette();
  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <SafeAreaView className="bg-paper flex-1">
        <View className="flex-1 items-center justify-center px-6">
          <Display className="text-center">Nothing here.</Display>
          <Body className="mt-4 text-center">This screen does not exist.</Body>
          <Link
            href="/"
            style={{
              fontFamily: sans.medium,
              color: palette.brand,
              textDecorationLine: 'underline',
              marginTop: 32,
              fontSize: 14,
            }}
          >
            Back to the start
          </Link>
        </View>
      </SafeAreaView>
    </>
  );
}
