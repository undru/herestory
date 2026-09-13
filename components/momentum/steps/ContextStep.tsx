import { useState } from 'react';
import { Text, View } from 'react-native';
import { getDocumentAsync } from 'expo-document-picker';
import { FileText, LockKeyhole } from 'lucide-react-native';

import { ActionButton, TextLink } from '@/components/momentum/ActionButton';
import { StepShell } from '@/components/momentum/StepShell';
import { Body, Caption, Overline } from '@/components/momentum/Type';
import {
  CV_MIME_TYPES,
  CV_PICK_FAILED,
  LINKEDIN_COMING_SOON,
  PROFILE_CONTEXT_HEADLINE,
  PROFILE_CONTEXT_SUBHEAD,
  PROFILE_CONTEXT_TRUST,
} from '@/data/mock';
import { useMomentum } from '@/lib/momentum-context';
import { sans, usePalette } from '@/lib/theme';

/**
 * Profile context: why background helps matching, a CV picker, and an honest
 * LinkedIn placeholder. Only the picked file's name is kept, for this session.
 */
export function ContextStep() {
  const { cvFileName, progress, actions } = useMomentum();
  const palette = usePalette();
  const [showLinkedInNotice, setShowLinkedInNotice] = useState(false);
  const [pickFailed, setPickFailed] = useState(false);

  const pickCv = async () => {
    setPickFailed(false);
    try {
      const result = await getDocumentAsync({
        type: CV_MIME_TYPES,
        copyToCacheDirectory: false,
        multiple: false,
      });
      const asset = result.canceled ? undefined : result.assets[0];
      if (asset) {
        actions.setCvFileName(asset.name);
        setShowLinkedInNotice(false);
      }
    } catch {
      setPickFailed(true);
    }
  };

  return (
    <StepShell
      transitionKey="context"
      progress={progress}
      onBack={actions.goBack}
      eyebrow="2 of 6"
      headline={PROFILE_CONTEXT_HEADLINE}
      intro={PROFILE_CONTEXT_SUBHEAD}
      footer={
        <View>
          {cvFileName ? (
            <ActionButton label="Continue" onPress={actions.continueFromWorkLife} />
          ) : (
            <>
              <ActionButton label="Connect LinkedIn" onPress={() => setShowLinkedInNotice(true)} />
              <ActionButton
                className="mt-2.5"
                variant="secondary"
                label="Upload CV instead"
                onPress={() => void pickCv()}
              />
            </>
          )}
          <TextLink
            className="mt-1"
            label="Skip for now"
            tone="muted"
            onPress={actions.skipWorkLife}
          />
          <View className="border-hairline mt-2 flex-row items-start gap-2 border-t pt-3">
            <View className="pt-[3px]">
              <LockKeyhole size={13} color={palette.inkFaint} />
            </View>
            <Caption className="flex-1">{PROFILE_CONTEXT_TRUST}</Caption>
          </View>
        </View>
      }
    >
      <View className="gap-3">
        {cvFileName ? (
          <View>
            <Overline>Your CV</Overline>
            <View className="border-line-firm mt-2 flex-row items-center gap-3 rounded-[20px] border py-1 pr-1 pl-4">
              <FileText size={18} color={palette.inkSoft} strokeWidth={1.6} />
              <Text
                numberOfLines={1}
                ellipsizeMode="middle"
                style={{ fontFamily: sans.medium }}
                className="text-ink flex-1 text-[15px]"
              >
                {cvFileName}
              </Text>
              <TextLink label="Replace file" onPress={() => void pickCv()} />
            </View>
          </View>
        ) : null}

        {showLinkedInNotice && !cvFileName ? (
          <View
            role="alert"
            accessibilityLiveRegion="polite"
            className="border-line-firm rounded-[20px] border px-4 py-3"
          >
            <Body className="text-ink">{LINKEDIN_COMING_SOON}</Body>
          </View>
        ) : null}

        {pickFailed ? (
          <View
            role="alert"
            accessibilityLiveRegion="polite"
            className="border-line-firm rounded-[20px] border px-4 py-3"
          >
            <Body className="text-ink">{CV_PICK_FAILED}</Body>
          </View>
        ) : null}
      </View>
    </StepShell>
  );
}
