import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { FadeInRight } from 'react-native-reanimated';
import { ArrowLeft } from 'lucide-react-native';

import { AnimatedView } from '@/components/ui/primitives/AnimatedView';
import { SafeAreaView } from '@/components/ui/primitives/SafeAreaView';
import { Body, Headline, Overline } from '@/components/momentum/Type';
import { ProgressBar } from '@/components/momentum/ProgressBar';
import { Tappable } from '@/components/momentum/Tappable';
import { INK_SOFT } from '@/lib/theme';

interface StepShellProps {
  /** 0 to 1, or null to hide the bar. */
  progress?: number | null;
  onBack?: () => void;
  /** Changing this replays the slide transition. */
  transitionKey: string;
  eyebrow?: string;
  headline?: string;
  intro?: string;
  children?: ReactNode;
  /** Full-width bottom action area. */
  footer?: ReactNode;
  /** Overlay rendered above everything, e.g. the confirmation sheet. */
  overlay?: ReactNode;
  /** Centers content vertically for calm, single-element screens. */
  centered?: boolean;
}

/**
 * One question per screen: progress bar, optional back control, slide-in
 * content, and a full-width button docked at the bottom.
 */
export function StepShell({
  progress = null,
  onBack,
  transitionKey,
  eyebrow,
  headline,
  intro,
  children,
  footer,
  overlay,
  centered = false,
}: StepShellProps) {
  return (
    <SafeAreaView className="bg-paper flex-1" edges={['top', 'bottom']}>
      {progress === null ? <View className="h-[2px]" /> : <ProgressBar value={progress} />}

      <View className="h-12 flex-row items-center px-3">
        {onBack ? (
          <Tappable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            className="h-11 w-11 items-center justify-center rounded-full"
            onPress={onBack}
          >
            <ArrowLeft size={20} color={INK_SOFT} strokeWidth={1.6} />
          </Tappable>
        ) : null}
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: 32,
            flexGrow: centered ? 1 : undefined,
            justifyContent: centered ? 'center' : undefined,
          }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <AnimatedView key={transitionKey} entering={FadeInRight.duration(320)}>
            {eyebrow ? <Overline className="mb-4">{eyebrow}</Overline> : null}
            {headline ? <Headline>{headline}</Headline> : null}
            {intro ? <Body className="mt-4">{intro}</Body> : null}
            {children ? <View className={headline || intro ? 'mt-9' : ''}>{children}</View> : null}
          </AnimatedView>
        </ScrollView>

        {footer ? <View className="px-6 pt-4 pb-3">{footer}</View> : null}
      </KeyboardAvoidingView>

      {overlay}
    </SafeAreaView>
  );
}
