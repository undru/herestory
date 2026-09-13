import { useState, type ReactNode } from 'react';
import { View } from 'react-native';

import { ActionButton } from '@/components/momentum/ActionButton';
import { ChatThread, Composer, type ChatMessage } from '@/components/momentum/ChatThread';
import { PillChip } from '@/components/momentum/PillChip';
import { Caption } from '@/components/momentum/Type';
import {
  DEEPENING_QUESTIONS,
  DESTINATION_PLACEHOLDER,
  DESTINATION_SUGGESTIONS,
  LANGUAGE_OPTIONS,
  LANGUAGES_HEADLINE,
  LANGUAGES_SUBHEAD,
  LOCATION_HEADLINE,
  LOCATION_PLACEHOLDER,
  LOCATION_SUBHEAD,
  ORIGIN_HEADLINE,
  ORIGIN_PLACEHOLDER,
  ORIGIN_SUBHEAD,
  PROFILE_DETAIL_SKIPPED,
  type DeepeningQuestion,
} from '@/data/mock';
import { useMockRecorder, type RecorderState } from '@/hooks/useRecorder';
import { useMomentum } from '@/lib/momentum-context';
import { formatDuration } from '@/lib/utils';

/*
 * One continuous guide thread for the mentee: profile details (location,
 * origin, languages), the four conversation questions with the closing line,
 * and destination. The screens in between are not part of the thread, but
 * everything she said before them is still shown above.
 */

const CLOSING_LINE = 'Thanks for being open with me. Give us a moment to put this together.';
const DESTINATION_HEADLINE = 'Where do you want to go from here?';
const MAX_LANGUAGE_LENGTH = 40;

type Momentum = ReturnType<typeof useMomentum>;

const guide = (id: string, text: string, caption?: string): ChatMessage => ({
  id,
  from: 'guide',
  text,
  caption,
});

const detailAnswer = (id: string, text: string): ChatMessage =>
  text ? { id, from: 'her', text } : { id, from: 'her', text: PROFILE_DETAIL_SKIPPED, muted: true };

interface GuideThread {
  messages: ChatMessage[];
  /** Index of the first message of the question she is on now. */
  currentFrom: number;
}

/**
 * The thread up to where she is. The flow is linear, so every question before
 * the current step has been answered or skipped.
 */
function buildThread(
  { step, location, origin, languages, deepeningIndex, answers }: Momentum,
  addTo: ((questionId: string) => void) | null,
): GuideThread {
  const messages: ChatMessage[] = [];
  const ask = (...items: ChatMessage[]) => {
    const from = messages.length;
    messages.push(...items);
    return from;
  };

  const details = [
    {
      step: 'location',
      questions: [guide('location', LOCATION_HEADLINE), guide('location-why', LOCATION_SUBHEAD)],
      answer: location.trim(),
    },
    {
      step: 'origin',
      questions: [guide('origin', ORIGIN_HEADLINE), guide('origin-why', ORIGIN_SUBHEAD)],
      answer: origin.trim(),
    },
    {
      step: 'languages',
      questions: [
        guide('languages', LANGUAGES_HEADLINE),
        guide('languages-why', LANGUAGES_SUBHEAD),
      ],
      answer: languages.join(', '),
    },
  ];
  for (const detail of details) {
    const from = ask(...detail.questions);
    if (step === detail.step) return { messages, currentFrom: from };
    messages.push(detailAnswer(`${detail.step}-answer`, detail.answer));
  }

  const inConversation = step === 'deepening';
  for (let index = 0; index < DEEPENING_QUESTIONS.length; index += 1) {
    const question = DEEPENING_QUESTIONS[index];
    if (!question) break;
    const from = ask(guide(question.id, question.headline, question.hint));
    if (inConversation && !addTo && index === deepeningIndex) {
      return { messages, currentFrom: from };
    }
    messages.push({
      id: `${question.id}-answer`,
      from: 'her',
      text: (answers[question.id] ?? '').trim(),
      action: addTo ? { label: 'Add to this', onPress: () => addTo(question.id) } : undefined,
    });
  }
  if (inConversation) return { messages, currentFrom: messages.length };

  const closing = ask(guide('closing', CLOSING_LINE));
  if (step !== 'destination') return { messages, currentFrom: closing };
  return { messages, currentFrom: ask(guide('destination', DESTINATION_HEADLINE)) };
}

const recorderStatus = (state: RecorderState, seconds: number) =>
  state === 'recording' ? formatDuration(seconds) : 'Writing it down';

/** Location or origin: typed, never detected. Sending saves it and moves on. */
function DetailComposer({ detail }: { detail: 'location' | 'origin' }) {
  const { location, origin, actions } = useMomentum();
  const isLocation = detail === 'location';
  const value = isLocation ? location : origin;

  return (
    <Composer
      value={value}
      onChangeText={isLocation ? actions.setLocation : actions.setOrigin}
      placeholder={isLocation ? LOCATION_PLACEHOLDER : ORIGIN_PLACEHOLDER}
      accessibilityLabel={isLocation ? 'City and country' : 'Origin or nationality, optional'}
      autoCorrect={false}
      canSend={value.trim().length > 0}
      onSend={actions.continueProfileDetail}
    />
  );
}

function SkipReply() {
  const { actions } = useMomentum();
  return (
    <View className="flex-row">
      <PillChip label="Skip for now" onPress={actions.skipProfileDetail} />
    </View>
  );
}

/** Any number of languages; "Other" adds ones that are not listed. No fluency levels. */
function LanguageReplies({
  otherOpen,
  onToggleOther,
}: {
  otherOpen: boolean;
  onToggleOther: () => void;
}) {
  const { languages, actions } = useMomentum();
  const customLanguages = languages.filter((label) => !LANGUAGE_OPTIONS.includes(label));

  const toggleLanguage = (label: string) => {
    actions.setLanguages(
      languages.includes(label)
        ? languages.filter((item) => item !== label)
        : [...languages, label],
    );
  };

  return (
    <View>
      <View className="flex-row flex-wrap gap-2">
        {LANGUAGE_OPTIONS.map((label) => (
          <PillChip
            key={label}
            label={label}
            selected={languages.includes(label)}
            onPress={() => toggleLanguage(label)}
          />
        ))}
        {customLanguages.map((label) => (
          <PillChip
            key={label}
            label={label}
            selected
            onRemove={() => actions.setLanguages(languages.filter((item) => item !== label))}
          />
        ))}
        <PillChip label="Other" selected={otherOpen} onPress={onToggleOther} />
      </View>
      <View className="mt-3">
        <SkipReply />
      </View>
    </View>
  );
}

function LanguagesFooter({ otherOpen }: { otherOpen: boolean }) {
  const { languages, actions } = useMomentum();
  const [draft, setDraft] = useState('');

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
    <View className="gap-3">
      {otherOpen ? (
        <Composer
          value={draft}
          onChangeText={setDraft}
          placeholder="e.g. Twi"
          accessibilityLabel="Another language"
          sendLabel="Add"
          maxLength={MAX_LANGUAGE_LENGTH}
          autoCorrect={false}
          canSend={draft.trim().length > 0}
          onSend={addDraft}
        />
      ) : null}
      <ActionButton
        label="Send"
        disabled={languages.length === 0}
        onPress={actions.continueProfileDetail}
      />
    </View>
  );
}

/** The question she is on: speak or type, change the transcript, then send. */
function AnswerComposer({ question }: { question: DeepeningQuestion }) {
  const { answers, actions } = useMomentum();
  const answer = answers[question.id] ?? '';
  const hasAnswer = answer.trim().length > 0;

  const recorder = useMockRecorder(question.id, {
    continuing: hasAnswer,
    onResult: (result) => actions.appendAnswer(question.id, result.transcript),
  });
  const isBusy = recorder.state === 'recording' || recorder.state === 'transcribing';

  return (
    <Composer
      multiline
      value={answer}
      onChangeText={(value) => actions.setAnswer(question.id, value)}
      placeholder="Start anywhere."
      accessibilityLabel="Your answer"
      canSend={hasAnswer && !isBusy}
      onSend={() => void actions.advanceDeepening()}
      recorder={{
        state: recorder.state,
        status: recorderStatus(recorder.state, recorder.seconds),
        onToggle: recorder.toggle,
      }}
    />
  );
}

/** Adds to one earlier answer without replacing it. */
function AddToComposer({ question, onSent }: { question: DeepeningQuestion; onSent: () => void }) {
  const { actions } = useMomentum();
  const [draft, setDraft] = useState('');

  const recorder = useMockRecorder(question.id, {
    continuing: true,
    onResult: (result) =>
      setDraft((current) =>
        current.trim() ? `${current.trimEnd()} ${result.transcript}` : result.transcript,
      ),
  });
  const isBusy = recorder.state === 'recording' || recorder.state === 'transcribing';

  return (
    <View className="gap-2">
      <Caption numberOfLines={1} className="px-2">
        {question.headline}
      </Caption>
      <Composer
        multiline
        value={draft}
        onChangeText={setDraft}
        placeholder="Add to it by typing or speaking again. Nothing you said is lost."
        accessibilityLabel={`Add to your answer: ${question.headline}`}
        canSend={draft.trim().length > 0 && !isBusy}
        onSend={() => {
          actions.appendAnswer(question.id, draft.trim());
          setDraft('');
          onSent();
        }}
        recorder={{
          state: recorder.state,
          status: recorderStatus(recorder.state, recorder.seconds),
          onToggle: recorder.toggle,
        }}
      />
    </View>
  );
}

function DestinationComposer() {
  const { destination, actions } = useMomentum();
  return (
    <Composer
      multiline
      value={destination}
      onChangeText={actions.setDestination}
      placeholder={DESTINATION_PLACEHOLDER}
      canSend={destination.trim().length > 0}
      onSend={actions.startMatching}
    />
  );
}

function DestinationReplies() {
  const { destination, actions } = useMomentum();
  return (
    <View className="flex-row flex-wrap gap-2">
      {DESTINATION_SUGGESTIONS.map((suggestion) => (
        <PillChip
          key={suggestion}
          label={suggestion}
          selected={destination === suggestion}
          onPress={() => actions.setDestination(suggestion)}
        />
      ))}
    </View>
  );
}

/**
 * Renders the thread for location, origin, languages, the conversation, the
 * closing line while the moment card is built, and destination.
 */
export function GuideThreadStep() {
  const momentum = useMomentum();
  const { step, progress, languages, deepeningIndex, momentCard, cardError, actions } = momentum;
  // Once a card was built (or failed), the conversation reopens to add to her answers.
  const isAdding = step === 'deepening' && (momentCard !== null || cardError);
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [otherOpen, setOtherOpen] = useState(() =>
    languages.some((label) => !LANGUAGE_OPTIONS.includes(label)),
  );

  const { messages, currentFrom } = buildThread(momentum, isAdding ? setAddingTo : null);

  let quickReplies: ReactNode = null;
  let composer: ReactNode = null;

  switch (step) {
    case 'location':
    case 'origin':
      quickReplies = <SkipReply />;
      composer = <DetailComposer key={step} detail={step} />;
      break;
    case 'languages':
      quickReplies = (
        <LanguageReplies otherOpen={otherOpen} onToggleOther={() => setOtherOpen(!otherOpen)} />
      );
      composer = <LanguagesFooter otherOpen={otherOpen} />;
      break;
    case 'deepening': {
      if (isAdding) {
        const question = DEEPENING_QUESTIONS.find((item) => item.id === addingTo);
        composer = (
          <View className="gap-3">
            {question ? (
              <AddToComposer
                key={question.id}
                question={question}
                onSent={() => setAddingTo(null)}
              />
            ) : null}
            <ActionButton label="Continue" onPress={() => void actions.finishConversation()} />
          </View>
        );
        break;
      }
      const question = DEEPENING_QUESTIONS[deepeningIndex] ?? DEEPENING_QUESTIONS[0];
      if (question) composer = <AnswerComposer key={question.id} question={question} />;
      break;
    }
    case 'destination':
      quickReplies = <DestinationReplies />;
      composer = <DestinationComposer />;
      break;
    default:
      break;
  }

  return (
    <ChatThread
      progress={progress}
      onBack={step === 'moment' ? undefined : actions.goBack}
      messages={messages}
      revealFrom={currentFrom}
      typing={step === 'moment'}
      quickReplies={quickReplies}
      composer={composer}
    />
  );
}
