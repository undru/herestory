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

/** Transparent input with a firm outline. No shadows, no focus glow. */
export function TextField({ label, textarea = false, className, ...rest }: TextFieldProps) {
  const palette = usePalette();
  return (
    <View>
      {label ? <Overline className="mb-2">{label}</Overline> : null}
      <TextInput
        {...rest}
        multiline={textarea}
        textAlignVertical={textarea ? 'top' : 'center'}
        placeholderTextColor={palette.inkFaint}
        style={{ fontFamily: sans.regular }}
        className={cn(
          'border-line-firm text-ink rounded-[14px] border bg-transparent px-[14px] text-[15px] leading-[24px]',
          textarea ? 'min-h-[132px] py-[13px]' : 'h-[50px] py-0',
          className,
        )}
      />
    </View>
  );
}
