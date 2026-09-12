import { useState } from 'react';
import { View } from 'react-native';

import { ActionButton, TextLink } from '@/components/momentum/ActionButton';
import { PillChip } from '@/components/momentum/PillChip';
import { StepShell } from '@/components/momentum/StepShell';
import { TextField } from '@/components/momentum/TextField';
import {
  LANGUAGE_OPTIONS,
  LANGUAGES_HEADLINE,
  LANGUAGES_SUBHEAD,
  LOCATION_HEADLINE,
  LOCATION_PLACEHOLDER,
  LOCATION_SUBHEAD,
  ORIGIN_HEADLINE,
  ORIGIN_PLACEHOLDER,
  ORIGIN_SUBHEAD,
} from '@/data/mock';
import { useMomentum } from '@/lib/momentum-context';

/*
 * Profile details after profile context: where she is, where she is from, and
 * the languages she speaks. Every screen can be skipped; answers stay private.
 */

const MAX_LANGUAGE_LENGTH = 40;

function DetailFooter({ canContinue }: { canContinue: boolean }) {
  const { actions } = useMomentum();
  return (
    <View>
      <ActionButton
        label="Continue"
        disabled={!canContinue}
        onPress={actions.continueProfileDetail}
      />
      <TextLink
        className="mt-1"
        label="Skip for now"
        tone="muted"
        onPress={actions.skipProfileDetail}
      />
    </View>
  );
}

/** Typed, never detected: no location permission. */
export function LocationStep() {
  const { location, progress, actions } = useMomentum();
  const hasAnswer = location.trim().length > 0;

  return (
    <StepShell
      transitionKey="location"
      progress={progress}
      onBack={actions.goBack}
      eyebrow="2 of 6 · detail 1 of 3"
      headline={LOCATION_HEADLINE}
      intro={LOCATION_SUBHEAD}
      footer={<DetailFooter canContinue={hasAnswer} />}
    >
      <TextField
        label="City and country"
        accessibilityLabel="City and country"
        placeholder={LOCATION_PLACEHOLDER}
        value={location}
        onChangeText={actions.setLocation}
        autoCorrect={false}
        returnKeyType="next"
        onSubmitEditing={() => {
          if (hasAnswer) actions.continueProfileDetail();
        }}
      />
    </StepShell>
  );
}

/** Open-ended on purpose: no categories, flags or country validation. */
export function OriginStep() {
  const { origin, progress, actions } = useMomentum();
  const hasAnswer = origin.trim().length > 0;

  return (
    <StepShell
      transitionKey="origin"
      progress={progress}
      onBack={actions.goBack}
      eyebrow="2 of 6 · detail 2 of 3"
      headline={ORIGIN_HEADLINE}
      intro={ORIGIN_SUBHEAD}
      footer={<DetailFooter canContinue={hasAnswer} />}
    >
      <TextField
        label="Origin or nationality (optional)"
        accessibilityLabel="Origin or nationality, optional"
        placeholder={ORIGIN_PLACEHOLDER}
        value={origin}
        onChangeText={actions.setOrigin}
        autoCorrect={false}
        returnKeyType="next"
        onSubmitEditing={() => {
          if (hasAnswer) actions.continueProfileDetail();
        }}
      />
    </StepShell>
  );
}

/** Any number of languages; "Other" adds ones that are not listed. No fluency levels. */
export function LanguagesStep() {
  const { languages, progress, actions } = useMomentum();
  const customLanguages = languages.filter((label) => !LANGUAGE_OPTIONS.includes(label));
  const [otherOpen, setOtherOpen] = useState(customLanguages.length > 0);
  const [draft, setDraft] = useState('');

  const toggleLanguage = (label: string) => {
    actions.setLanguages(
      languages.includes(label)
        ? languages.filter((item) => item !== label)
        : [...languages, label],
    );
  };

  const addDraft = () => {
    const name = draft.trim().replace(/\s+/g, ' ');
    if (!name) return;
    // Typing a listed or already-added language selects that one instead of a duplicate.
    const existing = [...LANGUAGE_OPTIONS, ...languages].find(
      (label) => label.toLowerCase() === name.toLowerCase(),
    );
    const label = existing ?? name;
    if (!languages.includes(label)) actions.setLanguages([...languages, label]);
    setDraft('');
  };

  return (
    <StepShell
      transitionKey="languages"
      progress={progress}
      onBack={actions.goBack}
      eyebrow="2 of 6 · detail 3 of 3"
      headline={LANGUAGES_HEADLINE}
      intro={LANGUAGES_SUBHEAD}
      footer={<DetailFooter canContinue={languages.length > 0} />}
    >
      <View className="flex-row flex-wrap gap-2">
        {LANGUAGE_OPTIONS.map((label) => (
          <PillChip
            key={label}
            label={label}
            selected={languages.includes(label)}
            onPress={() => toggleLanguage(label)}
          />
        ))}
        <PillChip label="Other" selected={otherOpen} onPress={() => setOtherOpen(!otherOpen)} />
      </View>

      {otherOpen ? (
        <View className="mt-5 flex-row items-end gap-2">
          <View className="flex-1">
            <TextField
              label="Another language"
              accessibilityLabel="Another language"
              placeholder="e.g. Twi"
              value={draft}
              maxLength={MAX_LANGUAGE_LENGTH}
              onChangeText={setDraft}
              autoCorrect={false}
              returnKeyType="done"
              submitBehavior="submit"
              onSubmitEditing={addDraft}
            />
          </View>
          <TextLink className="h-[50px]" label="Add" onPress={addDraft} />
        </View>
      ) : null}

      {customLanguages.length > 0 ? (
        <View className="mt-4 flex-row flex-wrap gap-2">
          {customLanguages.map((label) => (
            <PillChip
              key={label}
              label={label}
              selected
              onRemove={() => actions.setLanguages(languages.filter((item) => item !== label))}
            />
          ))}
        </View>
      ) : null}
    </StepShell>
  );
}
