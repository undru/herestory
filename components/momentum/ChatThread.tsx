import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  AccessibilityInfo,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { ArrowUp, Mic, Square } from 'lucide-react-native';

import { TextLink } from '@/components/momentum/ActionButton';
import { StepHeader } from '@/components/momentum/StepShell';
import { Tappable } from '@/components/momentum/Tappable';
import { BodyStrong, Caption } from '@/components/momentum/Type';
import { AnimatedView } from '@/components/ui/primitives/AnimatedView';
import { LinearGradient } from '@/components/ui/primitives/LinearGradient';
import { SafeAreaView } from '@/components/ui/primitives/SafeAreaView';
import type { RecorderState } from '@/hooks/useRecorder';
import { GRADIENT_END, GRADIENT_START, sans, usePalette } from '@/lib/theme';
import { cn, formatDuration } from '@/lib/utils';

/*
 * The shared chat thread: guide messages on the left, hers on the right on the
 * brand gradient, quick replies under the latest question and a composer docked
 * above the keyboard.
 */

export type ChatMessage =
  | {
      id: string;
      from: 'guide';
      text: string;
      /** Small line under the bubble, e.g. a question's hint. */
      caption?: string;
    }
  | {
      id: string;
      from: 'her';
      text: string;
      /** A quiet line instead of a bubble, e.g. "Skipped". */
      muted?: boolean;
      /** Set for a voice note: its length in seconds. */
      voiceSeconds?: number;
      /** A small action under the bubble, e.g. "Add to this". */
      action?: { label: string; onPress: () => void };
    };

/** How long the typing indicator shows before each new guide message. */
const TYPING_DELAY_MS = 500;

/**
 * How many messages are on screen. Guide messages from `revealFrom` on arrive
 * one at a time; her own messages never wait. Reduce motion shows everything.
 */
function useArrivals(messages: ChatMessage[], revealFrom: number) {
  const reduceMotion = useReducedMotion();
  const [arrived, setArrived] = useState(revealFrom);

  let shown = reduceMotion ? messages.length : Math.min(arrived, messages.length);
  while (shown < messages.length && messages[shown]?.from === 'her') shown += 1;
  const waiting = shown < messages.length;

  useEffect(() => {
    if (!waiting) return undefined;
    const timer = setTimeout(() => setArrived(shown + 1), TYPING_DELAY_MS);
    return () => clearTimeout(timer);
  }, [shown, waiting]);

  return { shown, waiting };
}

/** Reads new guide messages aloud on native. On web, the log role's live region does it. */
function useAnnouncements(messages: ChatMessage[], shown: number, revealFrom: number) {
  const announced = useRef(Math.min(revealFrom, shown));

  useEffect(() => {
    if (shown <= announced.current) {
      announced.current = Math.min(announced.current, shown);
      return;
    }
    const arrivals = messages
      .slice(announced.current, shown)
      .flatMap((message) => (message.from === 'guide' ? [message.text] : []));
    announced.current = shown;
    if (Platform.OS !== 'web' && arrivals.length > 0) {
      AccessibilityInfo.announceForAccessibility(arrivals.join(' '));
    }
  }, [messages, shown]);
}

function TypingDot({ phase, offset }: { phase: SharedValue<number>; offset: number }) {
  const style = useAnimatedStyle(() => {
    const distance = Math.abs(((phase.get() - offset + 1) % 1) - 0.5) * 2;
    return { opacity: 0.35 + 0.65 * distance };
  });
  return <AnimatedView className="bg-ink-faint h-2 w-2 rounded-full" style={style} />;
}

function TypingIndicator() {
  const reduceMotion = useReducedMotion();
  const phase = useSharedValue(0.5);

  useEffect(() => {
    if (reduceMotion) return undefined;
    phase.set(0);
    phase.set(withRepeat(withTiming(1, { duration: 1100, easing: Easing.linear }), -1, false));
    return () => cancelAnimation(phase);
  }, [phase, reduceMotion]);

  return (
    <View
      accessible
      accessibilityLabel="The guide is typing"
      className="bg-bubble mr-auto h-[54px] flex-row items-center gap-1.5 rounded-[24px] px-5"
    >
      <TypingDot phase={phase} offset={0} />
      <TypingDot phase={phase} offset={0.2} />
      <TypingDot phase={phase} offset={0.4} />
    </View>
  );
}

function GuideBubble({ text, caption }: { text: string; caption?: string }) {
  return (
    <View
      accessible
      accessibilityLabel={caption ? `Guide: ${text} ${caption}` : `Guide: ${text}`}
      className="mr-auto max-w-[88%]"
    >
      <View className="bg-bubble rounded-[24px] px-5 py-3.5">
        <BodyStrong className="text-[18px] leading-[26px]">{text}</BodyStrong>
      </View>
      {caption ? <Caption className="mt-1.5 px-2">{caption}</Caption> : null}
    </View>
  );
}

function HerBubble({ message }: { message: Extract<ChatMessage, { from: 'her' }> }) {
  const palette = usePalette();
  const { text, muted, voiceSeconds, action } = message;

  if (muted) {
    return (
      <View accessible accessibilityLabel={`You: ${text}`} className="ml-auto px-2 py-1">
        <Caption>{text}</Caption>
      </View>
    );
  }

  const label =
    voiceSeconds === undefined
      ? `You: ${text}`
      : `You, voice note, ${formatDuration(voiceSeconds)}: ${text}`;

  return (
    <View className="ml-auto max-w-[88%] items-end">
      <View accessible accessibilityLabel={label}>
        <LinearGradient
          colors={palette.gradient}
          start={GRADIENT_START}
          end={GRADIENT_END}
          className="overflow-hidden rounded-[24px] px-5 py-3.5"
        >
          {voiceSeconds === undefined ? null : (
            <View className="mb-1.5 flex-row items-center gap-2">
              <Mic size={15} color={palette.onBrand} strokeWidth={1.8} />
              <Text style={{ fontFamily: sans.semibold }} className="text-on-brand text-[14px]">
                {formatDuration(voiceSeconds)}
              </Text>
            </View>
          )}
          <BodyStrong className="text-on-brand text-[18px] leading-[26px]">{text}</BodyStrong>
        </LinearGradient>
      </View>
      {action ? <TextLink label={action.label} onPress={action.onPress} /> : null}
    </View>
  );
}

interface ChatMessageListProps {
  messages: ChatMessage[];
  /** Shows the typing indicator after the last message. */
  typing?: boolean;
}

/** The messages alone, in order. Read-only threads use this inside a StepShell. */
export function ChatMessageList({ messages, typing = false }: ChatMessageListProps) {
  return (
    <View role="log" className="gap-3">
      {messages.map((message) =>
        message.from === 'guide' ? (
          <GuideBubble key={message.id} text={message.text} caption={message.caption} />
        ) : (
          <HerBubble key={message.id} message={message} />
        ),
      )}
      {typing ? <TypingIndicator /> : null}
    </View>
  );
}

interface ChatThreadProps {
  /** 0 to 1, or null to hide the bar. */
  progress?: number | null;
  onBack?: () => void;
  /** Shown above the messages and not part of the conversation, e.g. a challenge card. */
  header?: ReactNode;
  messages: ChatMessage[];
  /** Guide messages from this index on arrive one at a time when the thread opens. */
  revealFrom?: number;
  /** Keeps the typing indicator after the last message, e.g. while a card is built. */
  typing?: boolean;
  /** Under the latest message, once it has arrived. */
  quickReplies?: ReactNode;
  /** Docked at the bottom, above the keyboard. */
  composer?: ReactNode;
}

/** A full-screen chat thread that keeps the newest message in view. */
export function ChatThread({
  progress = null,
  onBack,
  header,
  messages,
  revealFrom = messages.length,
  typing = false,
  quickReplies,
  composer,
}: ChatThreadProps) {
  const reduceMotion = useReducedMotion();
  const scrollRef = useRef<ScrollView>(null);
  const { shown, waiting } = useArrivals(messages, revealFrom);
  useAnnouncements(messages, shown, revealFrom);

  // A frame later, once the newest content has laid out. On web a smooth scroll is cut
  // short by the next message arriving, so it jumps there instead.
  const scrollToNewest = () => {
    requestAnimationFrame(() =>
      scrollRef.current?.scrollToEnd({ animated: Platform.OS !== 'web' && !reduceMotion }),
    );
  };

  return (
    <SafeAreaView className="bg-paper flex-1" edges={['top', 'bottom']}>
      <StepHeader progress={progress} onBack={onBack} />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        <ScrollView
          ref={scrollRef}
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToNewest}
          onLayout={scrollToNewest}
        >
          {header ? <View className="mb-5">{header}</View> : null}
          <ChatMessageList messages={messages.slice(0, shown)} typing={waiting || typing} />
          {quickReplies && !waiting ? <View className="mt-4">{quickReplies}</View> : null}
        </ScrollView>

        {composer ? <View className="px-4 pt-3 pb-3">{composer}</View> : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

interface ComposerRecorder {
  state: RecorderState;
  /** Shown in place of the text field while recording or transcribing, e.g. the timer. */
  status: string;
  onToggle: () => void;
}

interface ComposerProps {
  value: string;
  onChangeText: (value: string) => void;
  onSend: () => void;
  canSend: boolean;
  placeholder?: string;
  accessibilityLabel?: string;
  /** Accessible name of the send button. */
  sendLabel?: string;
  /** A taller field for longer answers. */
  multiline?: boolean;
  maxLength?: number;
  autoCorrect?: boolean;
  /** Adds a mic button that drives this recorder. */
  recorder?: ComposerRecorder;
}

/** Text field and send, plus an optional mic. */
export function Composer({
  value,
  onChangeText,
  onSend,
  canSend,
  placeholder,
  accessibilityLabel,
  sendLabel = 'Send',
  multiline = false,
  maxLength,
  autoCorrect,
  recorder,
}: ComposerProps) {
  const palette = usePalette();
  const [focused, setFocused] = useState(false);
  const isRecording = recorder?.state === 'recording';
  const isListening = isRecording || recorder?.state === 'transcribing';

  return (
    <View
      className={cn(
        'bg-paper flex-row items-end gap-1.5 rounded-[28px] border py-1.5 pr-1.5 pl-[18px]',
        focused ? 'border-brand' : 'border-line-firm',
      )}
    >
      {isListening ? (
        <View
          role="status"
          accessibilityLiveRegion="polite"
          className={cn('flex-1 flex-row items-center gap-2', multiline ? 'h-[104px]' : 'h-11')}
        >
          {isRecording ? <View className="bg-brand h-2 w-2 rounded-full" /> : null}
          <Text style={{ fontFamily: sans.medium }} className="text-ink text-[16px]">
            {recorder?.status}
          </Text>
        </View>
      ) : (
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          accessibilityLabel={accessibilityLabel ?? placeholder}
          placeholderTextColor={palette.inkFaint}
          multiline={multiline}
          maxLength={maxLength}
          autoCorrect={autoCorrect}
          textAlignVertical={multiline ? 'top' : 'center'}
          returnKeyType={multiline ? 'default' : 'send'}
          submitBehavior={multiline ? 'newline' : 'submit'}
          onSubmitEditing={() => {
            if (!multiline && canSend) onSend();
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ fontFamily: sans.regular }}
          className={cn(
            'text-ink flex-1 text-[16px] leading-[24px]',
            multiline ? 'h-[104px] py-[10px]' : 'h-11 py-0',
          )}
        />
      )}

      {recorder ? (
        <Tappable
          accessibilityRole="button"
          accessibilityLabel={isRecording ? 'Stop recording' : 'Start recording'}
          accessibilityState={{ busy: recorder.state === 'transcribing' }}
          disabled={recorder.state === 'transcribing'}
          onPress={recorder.onToggle}
          pressScale={0.95}
          className={cn(
            'h-11 w-11 items-center justify-center rounded-full',
            isRecording && 'bg-brand',
          )}
        >
          {isRecording ? (
            <Square size={14} color={palette.paper} fill={palette.paper} strokeWidth={1} />
          ) : (
            <Mic
              size={21}
              color={recorder.state === 'transcribing' ? palette.inkFaint : palette.brand}
              strokeWidth={1.6}
            />
          )}
        </Tappable>
      ) : null}

      <Tappable
        accessibilityRole="button"
        accessibilityLabel={sendLabel}
        accessibilityState={{ disabled: !canSend }}
        disabled={!canSend}
        onPress={onSend}
        pressScale={0.95}
        className={cn(
          'h-11 w-11 items-center justify-center overflow-hidden rounded-full',
          !canSend && 'bg-bubble',
        )}
      >
        {canSend ? (
          <LinearGradient
            pointerEvents="none"
            colors={palette.gradient}
            start={GRADIENT_START}
            end={GRADIENT_END}
            className="absolute inset-0"
          />
        ) : null}
        <ArrowUp size={20} color={canSend ? palette.onBrand : palette.inkFaint} strokeWidth={2} />
      </Tappable>
    </View>
  );
}
