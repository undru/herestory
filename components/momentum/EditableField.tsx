import { useState } from 'react';
import { TextInput, View } from 'react-native';

import { Body, Quote } from '@/components/momentum/Type';
import { Tappable } from '@/components/momentum/Tappable';
import { INK_FAINT, sans, serif } from '@/lib/theme';
import { cn } from '@/lib/utils';

interface EditableFieldProps {
  value: string;
  onChange: (value: string) => void;
  accessibilityLabel: string;
  placeholder?: string;
  /** 'quote' is the large serif italic line, 'line' is body copy. */
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
        placeholderTextColor={INK_FAINT}
        accessibilityLabel={accessibilityLabel}
        style={
          isQuote ? { fontFamily: serif.italic, fontStyle: 'italic' } : { fontFamily: sans.regular }
        }
        className={cn(
          'border-terracotta bg-paper text-ink rounded-xl border px-3 py-2',
          isQuote ? 'text-[23px] leading-[34px]' : 'text-[15px] leading-[23px]',
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
      className="rounded-xl px-3 py-2"
    >
      {isQuote ? (
        <Quote>{value || placeholder}</Quote>
      ) : (
        <Body className="text-ink">{value || placeholder}</Body>
      )}
      <View className="bg-hairline mt-2 h-[1px] w-10" />
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
        placeholderTextColor={INK_FAINT}
        style={{ fontFamily: sans.regular, minWidth: 96 }}
        className="border-terracotta bg-paper text-ink min-h-11 rounded-full border px-[18px] text-[15px]"
      />
    );
  }

  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={`${accessibilityLabel}: ${value}. Tap to edit.`}
      onPress={() => setEditing(true)}
      pressScale={0.97}
      className="border-hairline bg-paper min-h-11 justify-center rounded-full border px-[18px] py-[11px]"
    >
      <Body className="text-ink">{value}</Body>
    </Tappable>
  );
}
