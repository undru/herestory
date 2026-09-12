import { View } from 'react-native';
import { Check } from 'lucide-react-native';

import { usePalette } from '@/lib/theme';
import { cn } from '@/lib/utils';

/** Small moss circle with a tick, for "it's sent" moments. */
export function Seal({ className }: { className?: string }) {
  const palette = usePalette();
  return (
    <View
      className={cn(
        'bg-moss-soft h-[42px] w-[42px] items-center justify-center rounded-full',
        className,
      )}
    >
      <Check size={20} color={palette.moss} strokeWidth={1.8} />
    </View>
  );
}
