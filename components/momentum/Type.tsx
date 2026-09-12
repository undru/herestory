import { Text, type TextProps } from 'react-native';

import { sans, serif } from '@/lib/theme';
import { cn } from '@/lib/utils';

type TypeProps = TextProps & { className?: string };

/** Editorial serif, largest size. Used for calm, centered hero lines. */
export function Display({ className, style, ...rest }: TypeProps) {
  return (
    <Text
      {...rest}
      style={[{ fontFamily: serif.light, letterSpacing: -0.4 }, style]}
      className={cn('text-ink text-[30px] leading-[37px]', className)}
    />
  );
}

/** One-question-per-screen headline. */
export function Headline({ className, style, ...rest }: TypeProps) {
  return (
    <Text
      {...rest}
      style={[{ fontFamily: serif.light, letterSpacing: -0.27 }, style]}
      className={cn('text-ink text-[27px] leading-[33px]', className)}
    />
  );
}

export function Title({ className, style, ...rest }: TypeProps) {
  return (
    <Text
      {...rest}
      style={[{ fontFamily: serif.regular, letterSpacing: -0.1 }, style]}
      className={cn('text-ink text-[20px] leading-[26px]', className)}
    />
  );
}

/** Her own words, always serif italic. */
export function Quote({ className, style, ...rest }: TypeProps) {
  return (
    <Text
      {...rest}
      style={[{ fontFamily: serif.lightItalic, fontStyle: 'italic' }, style]}
      className={cn('text-ink text-[18px] leading-[25px]', className)}
    />
  );
}

export function Body({ className, style, ...rest }: TypeProps) {
  return (
    <Text
      {...rest}
      style={[{ fontFamily: sans.regular }, style]}
      className={cn('text-ink-soft text-[14px] leading-[22px]', className)}
    />
  );
}

export function BodyStrong({ className, style, ...rest }: TypeProps) {
  return (
    <Text
      {...rest}
      style={[{ fontFamily: sans.medium }, style]}
      className={cn('text-ink text-[15px] leading-[22px]', className)}
    />
  );
}

/** Small sentence-case label: step eyebrows and card field names. */
export function Overline({ className, style, ...rest }: TypeProps) {
  return (
    <Text
      {...rest}
      style={[{ fontFamily: sans.regular, letterSpacing: 0.1 }, style]}
      className={cn('text-ink-faint text-[12px] leading-[16px]', className)}
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
