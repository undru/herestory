import { useState } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';

import { Overline } from '@/components/momentum/Type';
import { sans, usePalette } from '@/lib/theme';
import { cn } from '@/lib/utils';

interface TextFieldProps extends Omit<TextInputProps, 'className' | 'style'> {
  label?: string;
  /** Renders a taller multiline field. */
  textarea?: boolean;
  className?: string;
}

/** White input with a fine lilac-gray outline that turns cobalt on focus. No shadows. */
export function TextField({ label, textarea = false, className, ...rest }: TextFieldProps) {
  const palette = usePalette();
  const [focused, setFocused] = useState(false);
  return (
    <View>
      {label ? <Overline className="mb-2">{label}</Overline> : null}
      <TextInput
        {...rest}
        multiline={textarea}
        textAlignVertical={textarea ? 'top' : 'center'}
        placeholderTextColor={palette.inkFaint}
        onFocus={(event) => {
          setFocused(true);
          rest.onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          rest.onBlur?.(event);
        }}
        style={{ fontFamily: sans.regular }}
        className={cn(
          'bg-paper text-ink rounded-[20px] border px-[18px] text-[16px] leading-[24px]',
          focused ? 'border-brand' : 'border-line-firm',
          textarea ? 'min-h-[132px] py-[16px]' : 'h-14 py-0',
          className,
        )}
      />
    </View>
  );
}
