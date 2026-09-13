import { View } from 'react-native';
import { Check } from 'lucide-react-native';

import { usePalette } from '@/lib/theme';
import { cn } from '@/lib/utils';

/** Small cobalt circle with a tick, for "it's sent" moments. */
export function Seal({ className }: { className?: string }) {
  const palette = usePalette();
  return (
    <View
      className={cn(
        'bg-brand-soft h-[42px] w-[42px] items-center justify-center rounded-full',
        className,
      )}
    >
      <Check size={20} color={palette.brand} strokeWidth={1.8} />
    </View>
  );
}
