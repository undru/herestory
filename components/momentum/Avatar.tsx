import { View } from 'react-native';

import { Body } from '@/components/momentum/Type';

interface AvatarProps {
  name: string;
  size?: number;
}

/** Plain round placeholder with her initial. No photos until she shares one. */
export function Avatar({ name, size = 40 }: AvatarProps) {
  return (
    <View
      className="bg-hairline items-center justify-center rounded-full"
      style={{ width: size, height: size }}
    >
      <Body className="text-ink-soft">{name.charAt(0)}</Body>
    </View>
  );
}
