import { Text } from 'react-native';

import { Tappable } from '@/components/momentum/Tappable';
import { LinearGradient } from '@/components/ui/primitives/LinearGradient';
import { GRADIENT_END, GRADIENT_START, sans, usePalette } from '@/lib/theme';
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

/**
 * Full-width bottom action. Gradient pill for primary, white with a fine
 * lilac-gray outline for secondary. Disabled primaries drop the gradient.
 */
export function ActionButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  loadingLabel,
  className,
}: ActionButtonProps) {
  const palette = usePalette();
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
        'h-16 w-full items-center justify-center overflow-hidden border',
        isPrimary ? 'rounded-full border-transparent' : 'border-line-firm bg-paper rounded-[22px]',
        isBlocked && 'border-hairline',
        isBlocked && isPrimary && 'bg-bubble',
        className,
      )}
    >
      {isPrimary && !isBlocked ? (
        <LinearGradient
          pointerEvents="none"
          colors={palette.gradient}
          start={GRADIENT_START}
          end={GRADIENT_END}
          className="absolute inset-0"
        />
      ) : null}
      <Text
        style={{ fontFamily: sans.semibold }}
        className={cn(
          'text-[17px] leading-[22px]',
          isPrimary ? 'text-on-brand' : 'text-ink',
          isBlocked && 'text-ink-soft',
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
        style={{ fontFamily: sans.medium }}
        className={cn('text-[15px]', tone === 'accent' ? 'text-brand' : 'text-ink-faint')}
      >
        {label}
      </Text>
    </Tappable>
  );
}
