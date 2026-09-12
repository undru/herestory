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
  const [typing, setTyping] = useState(false);
  const answer = answers[question.id] ?? '';

  const recorder = useMockRecorder(question.id, {
    onResult: (result) => {
      actions.setAnswer(question.id, result.transcript);
      setTyping(true);
    },
  });

  const isLast = index === DEEPENING_QUESTIONS.length - 1;

  return (
    <StepShell
      transitionKey={`deepening-${question.id}`}
      progress={progress}
      onBack={actions.goBack}
      eyebrow={`Question ${index + 1} of ${DEEPENING_QUESTIONS.length}`}
      headline={question.headline}
      footer={
        <ActionButton
          label={isLast ? 'That is everything' : 'Continue'}
          disabled={answer.trim().length === 0 || recorder.state === 'transcribing'}
          onPress={() => void actions.advanceDeepening()}
        />
      }
    >
      <View className="items-center">
        <MicButton state={recorder.state} seconds={recorder.seconds} onPress={recorder.toggle} />
        <Caption className="mt-3 max-w-[280px] text-center">{question.hint}</Caption>

        {typing ? null : (
          <TextLink className="mt-6" label="I'd rather type" onPress={() => setTyping(true)} />
        )}
      </View>

      {typing ? (
        <View className="mt-8">
          <TextField
            label={recorder.state === 'done' ? 'What I heard' : 'In your own words'}
            textarea
            autoFocus={recorder.state !== 'done'}
            placeholder="Start anywhere."
            value={answer}
            onChangeText={(value) => actions.setAnswer(question.id, value)}
          />
          <Caption className="mt-3">Change anything that is not quite it.</Caption>
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
