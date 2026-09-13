import { Path, Svg } from '@/components/ui/primitives/Svg';
import type { FeelingFamily } from '@/lib/theme';

const ICON_PATHS: Record<FeelingFamily, readonly string[]> = {
  heavy: ['M6.5 16h11a3.5 3.5 0 0 0 .4-7 5 5 0 0 0-9.6-1.2A3.9 3.9 0 0 0 6.5 16Z', 'M9 19.5h6'],
  curious: [
    'M12 3v5M12 16v5M3 12h5M16 12h5',
    'M6.4 6.4 9 9M15 15l2.6 2.6M17.6 6.4 15 9M9 15l-2.6 2.6',
  ],
  uncertain: [
    'M11.9 21.8V3.2',
    'M11.9 4.8H5.6L3.1 6.6l2.5 1.8h6.3',
    'M11.9 10.4h6.3l2.5 1.8-2.5 1.8h-6.3',
    'M11.9 16H5.6l-2.5 1.8 2.5 1.8h6.3',
  ],
  hopeful: [
    'M12 3.5v2.8M5.6 7.4l1.9 1.9M18.4 7.4l-1.9 1.9M2.8 16.5h18.4',
    'M7 16.5a5 5 0 0 1 10 0',
    'M6 20h12',
  ],
};

/** Decorative line icon identifying a feeling family on its group bubble. */
export function FeelingGroupIcon({ family }: { family: FeelingFamily }) {
  return (
    <Svg accessible={false} accessibilityElementsHidden height={20} viewBox="0 0 24 24" width={20}>
      {ICON_PATHS[family].map((d) => (
        <Path
          key={d}
          d={d}
          fill="none"
          opacity={0.62}
          stroke="#2C2560"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={family === 'uncertain' ? 1.15 : 1.35}
        />
      ))}
    </Svg>
  );
}
