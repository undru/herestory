import { Text, type TextProps } from 'react-native';

import { sans, serif } from '@/lib/theme';
import { cn } from '@/lib/utils';

type TypeProps = TextProps & { className?: string };

/** Editorial serif, largest size. Used for the moment card quote and hero lines. */
export function Display({ className, style, ...rest }: TypeProps) {
  return (
    <Text
      {...rest}
      style={[{ fontFamily: serif.medium, letterSpacing: -0.6 }, style]}
      className={cn('text-ink text-[34px] leading-[42px]', className)}
    />
  );
}

/** One-question-per-screen headline. */
export function Headline({ className, style, ...rest }: TypeProps) {
  return (
    <Text
      {...rest}
      style={[{ fontFamily: serif.medium, letterSpacing: -0.4 }, style]}
      className={cn('text-ink text-[28px] leading-[36px]', className)}
    />
  );
}

export function Title({ className, style, ...rest }: TypeProps) {
  return (
    <Text
      {...rest}
      style={[{ fontFamily: serif.medium, letterSpacing: -0.2 }, style]}
      className={cn('text-ink text-[20px] leading-[27px]', className)}
    />
  );
}

/** Her own words, always serif italic. */
export function Quote({ className, style, ...rest }: TypeProps) {
  return (
    <Text
      {...rest}
      style={[{ fontFamily: serif.italic, fontStyle: 'italic' }, style]}
      className={cn('text-ink text-[23px] leading-[34px]', className)}
    />
  );
}

export function Body({ className, style, ...rest }: TypeProps) {
  return (
    <Text
      {...rest}
      style={[{ fontFamily: sans.regular }, style]}
      className={cn('text-ink-soft text-[15px] leading-[23px]', className)}
    />
  );
}

export function BodyStrong({ className, style, ...rest }: TypeProps) {
  return (
    <Text
      {...rest}
      style={[{ fontFamily: sans.medium }, style]}
      className={cn('text-ink text-[15px] leading-[23px]', className)}
    />
  );
}

/** Small uppercase section label. */
export function Overline({ className, style, ...rest }: TypeProps) {
  return (
    <Text
      {...rest}
      style={[{ fontFamily: sans.medium, letterSpacing: 1.8 }, style]}
      className={cn('text-ink-faint text-[11px] leading-[14px] uppercase', className)}
    />
  );
}

export function Caption({ className, style, ...rest }: TypeProps) {
  return (
    <Text
      {...rest}
      style={[{ fontFamily: sans.regular }, style]}
      className={cn('text-ink-faint text-[13px] leading-[19px]', className)}
    />
  );
}
