import { Text } from 'react-native';
import { useRouter } from 'expo-router';
import { History } from 'lucide-react-native';

import { Tappable } from '@/components/momentum/Tappable';
import { PROFILE_HISTORY_TITLE } from '@/data/mock';
import { sans, usePalette } from '@/lib/theme';

/** Opens the private Profile & history screen. Shown on post-match screens only. */
export function ProfileHistoryButton() {
  const router = useRouter();
  const palette = usePalette();

  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={PROFILE_HISTORY_TITLE}
      accessibilityHint="Opens your private profile, conversations and matches."
      hitSlop={6}
      onPress={() => router.push('/profile')}
      className="bg-brand-soft h-9 flex-row items-center gap-1.5 rounded-full px-3"
    >
      <History size={15} color={palette.brand} strokeWidth={1.8} />
      <Text style={{ fontFamily: sans.medium }} className="text-brand text-[13px]">
        {PROFILE_HISTORY_TITLE}
      </Text>
    </Tappable>
  );
}
