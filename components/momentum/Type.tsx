import { Text, type TextProps } from 'react-native';

import { sans } from '@/lib/theme';
import { cn } from '@/lib/utils';

type TypeProps = TextProps & { className?: string };

/** Largest size. Used for calm, centered hero lines. */
export function Display({ className, style, ...rest }: TypeProps) {
  return (
    <Text
      {...rest}
      style={[{ fontFamily: sans.semibold, letterSpacing: -0.6 }, style]}
      className={cn('text-ink text-[30px] leading-[36px]', className)}
    />
  );
}

/** One-question-per-screen headline. */
export function Headline({ className, style, ...rest }: TypeProps) {
  return (
    <Text
      {...rest}
      style={[{ fontFamily: sans.semibold, letterSpacing: -0.5 }, style]}
      className={cn('text-ink text-[28px] leading-[34px]', className)}
    />
  );
}

export function Title({ className, style, ...rest }: TypeProps) {
  return (
    <Text
      {...rest}
      style={[{ fontFamily: sans.semibold, letterSpacing: -0.2 }, style]}
      className={cn('text-ink text-[20px] leading-[26px]', className)}
    />
  );
}

/** Her own words, at conversation size. */
export function Quote({ className, style, ...rest }: TypeProps) {
  return (
    <Text
      {...rest}
      style={[{ fontFamily: sans.regular, letterSpacing: -0.1 }, style]}
      className={cn('text-ink text-[18px] leading-[27px]', className)}
    />
  );
}

export function Body({ className, style, ...rest }: TypeProps) {
  return (
    <Text
      {...rest}
      style={[{ fontFamily: sans.regular }, style]}
      className={cn('text-ink-soft text-[16px] leading-[24px]', className)}
    />
  );
}

export function BodyStrong({ className, style, ...rest }: TypeProps) {
  return (
    <Text
      {...rest}
      style={[{ fontFamily: sans.medium }, style]}
      className={cn('text-ink text-[16px] leading-[24px]', className)}
    />
  );
}

/** Small sentence-case label: step eyebrows and card field names. */
export function Overline({ className, style, ...rest }: TypeProps) {
  return (
    <Text
      {...rest}
      style={[{ fontFamily: sans.regular }, style]}
      className={cn('text-ink-faint text-[14px] leading-[20px]', className)}
    />
  );
}

export function Caption({ className, style, ...rest }: TypeProps) {
  return (
    <Text
      {...rest}
      style={[{ fontFamily: sans.regular }, style]}
      className={cn('text-ink-faint text-[14px] leading-[20px]', className)}
    />
  );
}
