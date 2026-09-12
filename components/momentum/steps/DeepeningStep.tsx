import { useState } from 'react';
import { View } from 'react-native';

import { ActionButton, TextLink } from '@/components/momentum/ActionButton';
import { Caption } from '@/components/momentum/Type';
import { MicButton } from '@/components/momentum/MicButton';
import { StepShell } from '@/components/momentum/StepShell';
import { TextField } from '@/components/momentum/TextField';
import { DEEPENING_QUESTIONS, type DeepeningQuestion } from '@/data/mock';
import { useMockRecorder } from '@/hooks/useRecorder';
import { useMomentum } from '@/lib/momentum-context';

interface QuestionViewProps {
  question: DeepeningQuestion;
  index: number;
}

function QuestionView({ question, index }: QuestionViewProps) {
  const { answers, progress, actions } = useMomentum();
  const answer = answers[question.id] ?? '';
  const hasAnswer = answer.trim().length > 0;
  // Coming back to add more: show what she already said instead of hiding it behind the mic.
  const [returning] = useState(hasAnswer);
  const [typing, setTyping] = useState(hasAnswer);

  const recorder = useMockRecorder(question.id, {
    continuing: hasAnswer,
    onResult: (result) => {
      actions.appendAnswer(question.id, result.transcript);
      setTyping(true);
    },
  });

  const fieldLabel =
    recorder.state === 'done'
      ? 'What I heard'
      : returning
        ? 'Your answer so far'
        : 'In your own words';

  return (
    <StepShell
      transitionKey={`deepening-${question.id}`}
      progress={progress}
      onBack={actions.goBack}
      eyebrow={`4 of 7 · question ${index + 1} of ${DEEPENING_QUESTIONS.length}`}
      headline={question.headline}
      footer={
        <ActionButton
          label="Continue"
          disabled={!hasAnswer || recorder.state === 'transcribing'}
          onPress={() => void actions.advanceDeepening()}
        />
      }
    >
      <View className="items-center">
        <MicButton
          state={recorder.state}
          seconds={recorder.seconds}
          onPress={recorder.toggle}
          idleLabel={hasAnswer ? 'Tap to add more' : 'Tap to speak'}
        />
        {returning ? null : (
          <Caption className="mt-3 max-w-[280px] text-center">{question.hint}</Caption>
        )}

        {typing ? null : (
          <TextLink className="mt-6" label="I'd rather type" onPress={() => setTyping(true)} />
        )}
      </View>

      {typing ? (
        <View className="mt-8">
          <TextField
            label={fieldLabel}
            textarea
            autoFocus={!returning && recorder.state !== 'done'}
            placeholder="Start anywhere."
            value={answer}
            onChangeText={(value) => actions.setAnswer(question.id, value)}
          />
          <Caption className="mt-3">
            {returning
              ? 'Add to it by typing or speaking again. Nothing you said is lost.'
              : 'Change anything that is not quite it.'}
          </Caption>
        </View>
      ) : null}
    </StepShell>
  );
}

export function DeepeningStep() {
  const { deepeningIndex } = useMomentum();
  const question = DEEPENING_QUESTIONS[deepeningIndex] ?? DEEPENING_QUESTIONS[0];

  // Remounting per question resets the recorder timer and typing toggle.
  return <QuestionView key={question.id} question={question} index={deepeningIndex} />;
}
