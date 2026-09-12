import { TextInput, View, type TextInputProps } from 'react-native';

import { Overline } from '@/components/momentum/Type';
import { INK_FAINT, sans } from '@/lib/theme';
import { cn } from '@/lib/utils';

interface TextFieldProps extends Omit<TextInputProps, 'className' | 'style'> {
  label?: string;
  /** Renders a taller multiline field. */
  textarea?: boolean;
  className?: string;
}

/** Paper-coloured input with a hairline border. No shadows, no focus glow. */
export function TextField({ label, textarea = false, className, ...rest }: TextFieldProps) {
  return (
    <View>
      {label ? <Overline className="mb-3">{label}</Overline> : null}
      <TextInput
        {...rest}
        multiline={textarea}
        textAlignVertical={textarea ? 'top' : 'center'}
        placeholderTextColor={INK_FAINT}
        style={{ fontFamily: sans.regular }}
        className={cn(
          'border-hairline bg-paper-raised text-ink rounded-2xl border px-4 text-[16px] leading-[24px]',
          textarea ? 'min-h-[132px] py-4' : 'h-[52px] py-0',
          className,
        )}
      />
    </View>
  );
}
