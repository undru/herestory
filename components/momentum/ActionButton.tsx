import { Text } from 'react-native';

import { Tappable } from '@/components/momentum/Tappable';
import { sans } from '@/lib/theme';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary';

interface ActionButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  className?: string;
}

/** Full-width bottom action. Ink for primary, firm outline for secondary. */
export function ActionButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  loadingLabel,
  className,
}: ActionButtonProps) {
  const isBlocked = disabled || loading;
  const isPrimary = variant === 'primary';

  return (
    <Tappable
      accessibilityRole="button"
      accessibilityState={{ disabled: isBlocked }}
      accessibilityLabel={label}
      disabled={isBlocked}
      onPress={onPress}
      pressScale={0.99}
      className={cn(
        'h-[52px] w-full items-center justify-center rounded-[14px] border',
        isPrimary ? 'border-ink bg-ink' : 'border-line-firm bg-transparent',
        isBlocked && isPrimary && 'border-hairline bg-hairline',
        isBlocked && !isPrimary && 'border-hairline',
        className,
      )}
    >
      <Text
        style={{ fontFamily: sans.medium, letterSpacing: 0.1 }}
        className={cn(
          'text-[15px]',
          isPrimary ? 'text-paper' : 'text-ink',
          isBlocked && 'text-ink-faint',
        )}
      >
        {loading ? (loadingLabel ?? label) : label}
      </Text>
    </Tappable>
  );
}

interface TextLinkProps {
  label: string;
  onPress: () => void;
  tone?: 'accent' | 'muted';
  className?: string;
}

/** Quiet inline text action, e.g. "Skip this" or "I'd rather type". */
export function TextLink({ label, onPress, tone = 'accent', className }: TextLinkProps) {
  return (
    <Tappable
      accessibilityRole="link"
      accessibilityLabel={label}
      onPress={onPress}
      pressScale={1}
      className={cn('min-h-11 items-center justify-center px-2', className)}
    >
      <Text
        style={{ fontFamily: sans.regular }}
        className={cn('text-[14px]', tone === 'accent' ? 'text-plum' : 'text-ink-faint')}
      >
        {label}
      </Text>
    </Tappable>
  );
}
