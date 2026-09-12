import { useState } from 'react';
import { View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Check, Paperclip } from 'lucide-react-native';

import { ActionButton, TextLink } from '@/components/momentum/ActionButton';
import { Body, Caption, Overline } from '@/components/momentum/Type';
import { PillChip } from '@/components/momentum/PillChip';
import { StepShell } from '@/components/momentum/StepShell';
import { Tappable } from '@/components/momentum/Tappable';
import { TextField } from '@/components/momentum/TextField';
import { useMomentum } from '@/lib/momentum-context';
import { INK_FAINT, TERRACOTTA } from '@/lib/theme';

function Divider() {
  return (
    <View className="flex-row items-center gap-4">
      <View className="bg-hairline h-[1px] flex-1" />
      <Caption>or</Caption>
      <View className="bg-hairline h-[1px] flex-1" />
    </View>
  );
}

export function ContextStep() {
  const { professionalContext, contextChips, isParsingContext, progress, actions } = useMomentum();
  const [pickerError, setPickerError] = useState<string | null>(null);

  const hasInput =
    professionalContext.description.trim().length > 0 ||
    professionalContext.uploadedFileName !== null ||
    professionalContext.linkedInUrl.trim().length > 0;

  const pickPdf = async () => {
    setPickerError(null);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: false,
        multiple: false,
      });
      if (result.canceled) return;
      const asset = result.assets[0];
      if (asset) {
        actions.setProfessionalField('uploadedFileName', asset.name);
      }
    } catch {
      setPickerError('That file could not be opened. Try another one.');
    }
  };

  if (contextChips.length > 0) {
    return (
      <StepShell
        transitionKey="context-review"
        progress={progress}
        onBack={actions.goBack}
        headline="Here is what I picked up."
        footer={<ActionButton label="Continue" onPress={actions.goToDeepening} />}
      >
        <View className="flex-row flex-wrap gap-3">
          {contextChips.map((chip) => (
            <PillChip
              key={chip}
              label={chip}
              tone="quiet"
              onRemove={() => actions.removeContextChip(chip)}
            />
          ))}
        </View>
        <Caption className="mt-7">Did I get that right? Tap a chip to remove it.</Caption>
      </StepShell>
    );
  }

  return (
    <StepShell
      transitionKey="context"
      progress={progress}
      onBack={actions.goBack}
      headline="Give me a sense of your work life."
      intro="Only so the women I show you have stood somewhere similar."
      footer={
        <View>
          <ActionButton
            label="That is enough"
            disabled={!hasInput}
            loading={isParsingContext}
            loadingLabel="Reading it…"
            onPress={() => void actions.submitProfessionalContext()}
          />
          <TextLink
            className="mt-2"
            label="Skip for now"
            tone="muted"
            onPress={actions.skipProfessionalContext}
          />
        </View>
      }
    >
      <View className="gap-6">
        <TextField
          label="Paste your CV or a short description"
          textarea
          placeholder="What you do, how long, what you are known for"
          value={professionalContext.description}
          onChangeText={(value) => actions.setProfessionalField('description', value)}
        />

        <Divider />

        <View>
          <Overline className="mb-3">Upload a PDF</Overline>
          <Tappable
            accessibilityRole="button"
            accessibilityLabel="Choose a PDF"
            onPress={() => void pickPdf()}
            className="border-hairline bg-paper-raised h-[52px] flex-row items-center justify-between rounded-2xl border px-4"
          >
            <Body className={professionalContext.uploadedFileName ? 'text-ink' : undefined}>
              {professionalContext.uploadedFileName ?? 'Choose a file'}
            </Body>
            {professionalContext.uploadedFileName ? (
              <Check size={18} color={TERRACOTTA} strokeWidth={1.8} />
            ) : (
              <Paperclip size={18} color={INK_FAINT} strokeWidth={1.6} />
            )}
          </Tappable>
          {professionalContext.uploadedFileName ? (
            <Caption className="mt-2">
              Accepted. I will not read anything you did not paste.
            </Caption>
          ) : null}
          {pickerError ? <Caption className="text-terracotta mt-2">{pickerError}</Caption> : null}
        </View>

        <Divider />

        <TextField
          label="LinkedIn URL"
          placeholder="linkedin.com/in/…"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          value={professionalContext.linkedInUrl}
          onChangeText={(value) => actions.setProfessionalField('linkedInUrl', value)}
        />
      </View>
    </StepShell>
  );
}
