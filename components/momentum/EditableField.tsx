import { useState } from 'react';
import { TextInput } from 'react-native';

import { Body, Quote } from '@/components/momentum/Type';
import { Tappable } from '@/components/momentum/Tappable';
import { sans, serif, usePalette } from '@/lib/theme';
import { cn } from '@/lib/utils';

interface EditableFieldProps {
  value: string;
  onChange: (value: string) => void;
  accessibilityLabel: string;
  placeholder?: string;
  /** 'quote' is the serif italic line, 'line' is body copy. */
  variant?: 'quote' | 'line';
}

/** Tap the text to edit it in place. Blur commits. */
export function EditableField({
  value,
  onChange,
  accessibilityLabel,
  placeholder,
  variant = 'line',
}: EditableFieldProps) {
  const palette = usePalette();
  const [editing, setEditing] = useState(false);
  const isQuote = variant === 'quote';

  if (editing) {
    return (
      <TextInput
        autoFocus
        multiline
        value={value}
        onChangeText={onChange}
        onBlur={() => setEditing(false)}
        placeholder={placeholder}
        placeholderTextColor={palette.inkFaint}
        accessibilityLabel={accessibilityLabel}
        style={
          isQuote
            ? { fontFamily: serif.lightItalic, fontStyle: 'italic' }
            : { fontFamily: sans.regular }
        }
        className={cn(
          'border-plum text-ink -mx-2 rounded-lg border bg-transparent px-2 py-1',
          isQuote ? 'text-[18px] leading-[25px]' : 'text-[14px] leading-[21px]',
        )}
      />
    );
  }

  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={`${accessibilityLabel}. Tap to edit.`}
      onPress={() => setEditing(true)}
      pressScale={1}
      className="-mx-2 rounded-lg px-2 py-1"
    >
      {isQuote ? (
        <Quote>{value ? `“${value}”` : placeholder}</Quote>
      ) : (
        <Body className="text-ink leading-[21px]">{value || placeholder}</Body>
      )}
    </Tappable>
  );
}

interface EditableChipProps {
  value: string;
  onChange: (value: string) => void;
  accessibilityLabel: string;
}

/** Chip whose text can be rewritten in place. */
export function EditableChip({ value, onChange, accessibilityLabel }: EditableChipProps) {
  const palette = usePalette();
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <TextInput
        autoFocus
        value={value}
        onChangeText={onChange}
        onBlur={() => setEditing(false)}
        onSubmitEditing={() => setEditing(false)}
        accessibilityLabel={accessibilityLabel}
        placeholderTextColor={palette.inkFaint}
        style={{ fontFamily: sans.regular, minWidth: 96 }}
        className="border-plum text-ink min-h-10 rounded-full border bg-transparent px-[14px] text-[14px]"
      />
    );
  }

  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={`${accessibilityLabel}: ${value}. Tap to edit.`}
      onPress={() => setEditing(true)}
      pressScale={0.97}
      className="border-line-firm min-h-10 justify-center rounded-full border px-[14px] py-[8px]"
    >
      <Body className="text-ink leading-[20px]">{value}</Body>
    </Tappable>
  );
}
