import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import {
  DEEPENING_QUESTIONS,
  MAX_FEELINGS,
  type AnonymizedCard,
  type LifeAreaId,
  type Mentor,
  type MentorChallenge,
  type MomentCardData,
} from '@/data/mock';
import {
  acceptChallenge,
  buildAnonymizedCard,
  declineChallenge,
  fetchMentorChallenge,
  findMatches,
  generateMomentCard,
  parseProfessionalContext,
  saveMomentCard,
  sendMentorRequest,
  sendVoiceReply,
  type ProfessionalContextInput,
  type RecordingResult,
} from '@/lib/api';

export type MenteeStep =
  | 'feeling'
  | 'lifeArea'
  | 'context'
  | 'deepening'
  | 'moment'
  | 'destination'
  | 'matching'
  | 'matches'
  | 'sent';

/** Progress bar positions. 'sent' sits at the end of the flow. */
export const STEP_ORDER: MenteeStep[] = [
  'feeling',
  'lifeArea',
  'context',
  'deepening',
  'moment',
  'destination',
  'matching',
  'matches',
];

export type MentorStage = 'inbox' | 'reply' | 'sent' | 'declined';

interface MomentumState {
  /* mentee flow */
  step: MenteeStep;
  progress: number;
  feelings: string[];
  feelingNote: string;
  lifeArea: LifeAreaId | null;
  professionalContext: ProfessionalContextInput;
  contextChips: string[];
  isParsingContext: boolean;
  deepeningIndex: number;
  answers: Record<string, string>;
  momentCard: MomentCardData | null;
  isGeneratingCard: boolean;
  destination: string;
  matches: Mentor[];
  isMatching: boolean;
  selectedMentorId: string | null;
  anonymizedCard: AnonymizedCard | null;
  isSending: boolean;
  /* mentor inbox */
  mentorStage: MentorStage;
  challenge: MentorChallenge | null;
  isLoadingChallenge: boolean;
  isSendingReply: boolean;
  replyDurationSeconds: number;
}

interface MomentumActions {
  toggleFeeling: (id: string) => void;
  setFeelingNote: (value: string) => void;
  continueFromFeeling: () => void;
  chooseLifeArea: (id: LifeAreaId) => void;
  continueFromLifeArea: () => void;
  setProfessionalField: <K extends keyof ProfessionalContextInput>(
    key: K,
    value: ProfessionalContextInput[K],
  ) => void;
  submitProfessionalContext: () => Promise<void>;
  removeContextChip: (chip: string) => void;
  skipProfessionalContext: () => void;
  goToDeepening: () => void;
  setAnswer: (questionId: string, value: string) => void;
  advanceDeepening: () => Promise<void>;
  updateMomentCard: (patch: Partial<MomentCardData>) => void;
  commitMomentCard: () => Promise<void>;
  confirmMomentCard: () => void;
  rejectMomentCard: () => void;
  setDestination: (value: string) => void;
  appendDestinationSuggestion: (value: string) => void;
  startMatching: () => void;
  runMatching: () => Promise<void>;
  selectMentor: (mentorId: string) => Promise<void>;
  clearSelectedMentor: () => void;
  sendRequest: () => Promise<void>;
  goBack: () => void;
  loadChallenge: () => Promise<void>;
  openReply: () => Promise<void>;
  dismissChallenge: () => Promise<void>;
  submitVoiceReply: (recording: RecordingResult) => Promise<void>;
  resetAll: () => void;
}

type MomentumContextValue = MomentumState & { actions: MomentumActions };

const EMPTY_PROFESSIONAL_CONTEXT: ProfessionalContextInput = {
  description: '',
  uploadedFileName: null,
  linkedInUrl: '',
};

const MomentumContext = createContext<MomentumContextValue | null>(null);

export function MomentumProvider({ children }: PropsWithChildren) {
  const [step, setStep] = useState<MenteeStep>('feeling');
  const [feelings, setFeelings] = useState<string[]>([]);
  const [feelingNote, setFeelingNote] = useState('');
  const [lifeArea, setLifeArea] = useState<LifeAreaId | null>(null);
  const [professionalContext, setProfessionalContext] = useState<ProfessionalContextInput>(
    EMPTY_PROFESSIONAL_CONTEXT,
  );
  const [contextChips, setContextChips] = useState<string[]>([]);
  const [isParsingContext, setIsParsingContext] = useState(false);
  const [deepeningIndex, setDeepeningIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [momentCard, setMomentCard] = useState<MomentCardData | null>(null);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const [destination, setDestinationValue] = useState('');
  const [matches, setMatches] = useState<Mentor[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);
  const [anonymizedCard, setAnonymizedCard] = useState<AnonymizedCard | null>(null);
  const [isSending, setIsSending] = useState(false);

  const [mentorStage, setMentorStage] = useState<MentorStage>('inbox');
  const [challenge, setChallenge] = useState<MentorChallenge | null>(null);
  const [isLoadingChallenge, setIsLoadingChallenge] = useState(false);
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replyDurationSeconds, setReplyDurationSeconds] = useState(0);

  const toggleFeeling = useCallback((id: string) => {
    setFeelings((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= MAX_FEELINGS) return [current[current.length - 1], id];
      return [...current, id];
    });
  }, []);

  const chooseLifeArea = useCallback((id: LifeAreaId) => {
    setLifeArea(id);
  }, []);

  const continueFromFeeling = useCallback(() => {
    setStep('lifeArea');
  }, []);

  const continueFromLifeArea = useCallback(() => {
    setStep(lifeArea === 'personal' ? 'deepening' : 'context');
  }, [lifeArea]);

  const setProfessionalField = useCallback(
    <K extends keyof ProfessionalContextInput>(key: K, value: ProfessionalContextInput[K]) => {
      setProfessionalContext((current) => ({ ...current, [key]: value }));
    },
    [],
  );

  const submitProfessionalContext = useCallback(async () => {
    setIsParsingContext(true);
    try {
      const chips = await parseProfessionalContext(professionalContext);
      setContextChips(chips);
    } finally {
      setIsParsingContext(false);
    }
  }, [professionalContext]);

  const removeContextChip = useCallback((chip: string) => {
    setContextChips((current) => current.filter((item) => item !== chip));
  }, []);

  const goToDeepening = useCallback(() => {
    setStep('deepening');
  }, []);

  const skipProfessionalContext = useCallback(() => {
    setContextChips([]);
    setProfessionalContext(EMPTY_PROFESSIONAL_CONTEXT);
    setStep('deepening');
  }, []);

  const setAnswer = useCallback((questionId: string, value: string) => {
    setAnswers((current) => ({ ...current, [questionId]: value }));
  }, []);

  const buildCard = useCallback(
    async (currentAnswers: Record<string, string>) => {
      setIsGeneratingCard(true);
      try {
        const card = await generateMomentCard({
          feelings,
          feelingNote,
          lifeArea,
          contextChips,
          answers: currentAnswers,
        });
        setMomentCard(card);
      } finally {
        setIsGeneratingCard(false);
      }
    },
    [contextChips, feelingNote, feelings, lifeArea],
  );

  const advanceDeepening = useCallback(async () => {
    if (deepeningIndex < DEEPENING_QUESTIONS.length - 1) {
      setDeepeningIndex((current) => current + 1);
      return;
    }
    setStep('moment');
    await buildCard(answers);
  }, [answers, buildCard, deepeningIndex]);

  const updateMomentCard = useCallback((patch: Partial<MomentCardData>) => {
    setMomentCard((current) => (current ? { ...current, ...patch } : current));
  }, []);

  const commitMomentCard = useCallback(async () => {
    if (!momentCard) return;
    await saveMomentCard(momentCard);
  }, [momentCard]);

  const confirmMomentCard = useCallback(() => {
    setStep('destination');
  }, []);

  const rejectMomentCard = useCallback(() => {
    setDeepeningIndex(0);
    setStep('deepening');
  }, []);

  const setDestination = useCallback((value: string) => {
    setDestinationValue(value);
  }, []);

  const appendDestinationSuggestion = useCallback((value: string) => {
    setDestinationValue((current) => {
      const trimmed = current.trimEnd();
      if (trimmed.length === 0) return value;
      if (trimmed.toLowerCase().includes(value.toLowerCase())) return current;
      const separator = /[.,;]$/.test(trimmed) ? ' ' : ', ';
      return `${trimmed}${separator}${value}`;
    });
  }, []);

  const startMatching = useCallback(() => {
    setStep('matching');
  }, []);

  const runMatching = useCallback(async () => {
    if (!momentCard) return;
    setIsMatching(true);
    try {
      const found = await findMatches({ card: momentCard, destination });
      setMatches(found);
      setStep('matches');
    } finally {
      setIsMatching(false);
    }
  }, [destination, momentCard]);

  const selectMentor = useCallback(
    async (mentorId: string) => {
      setSelectedMentorId(mentorId);
      if (!momentCard) return;
      const preview = await buildAnonymizedCard(momentCard);
      setAnonymizedCard(preview);
    },
    [momentCard],
  );

  const clearSelectedMentor = useCallback(() => {
    setSelectedMentorId(null);
  }, []);

  const sendRequest = useCallback(async () => {
    if (!selectedMentorId || !anonymizedCard) return;
    setIsSending(true);
    try {
      await sendMentorRequest(selectedMentorId, anonymizedCard);
      setSelectedMentorId(null);
      setStep('sent');
    } finally {
      setIsSending(false);
    }
  }, [anonymizedCard, selectedMentorId]);

  const goBack = useCallback(() => {
    setStep((current) => {
      switch (current) {
        case 'lifeArea':
          return 'feeling';
        case 'context':
          return 'lifeArea';
        case 'deepening':
          if (deepeningIndex > 0) {
            setDeepeningIndex((index) => index - 1);
            return current;
          }
          return lifeArea === 'personal' ? 'lifeArea' : 'context';
        case 'moment':
          return 'deepening';
        case 'destination':
          return 'moment';
        case 'matches':
          return 'destination';
        default:
          return current;
      }
    });
  }, [deepeningIndex, lifeArea]);

  const loadChallenge = useCallback(async () => {
    setIsLoadingChallenge(true);
    try {
      const incoming = await fetchMentorChallenge();
      setChallenge(incoming);
    } finally {
      setIsLoadingChallenge(false);
    }
  }, []);

  const openReply = useCallback(async () => {
    setMentorStage('reply');
    if (challenge) {
      await acceptChallenge(challenge.id);
    }
  }, [challenge]);

  const dismissChallenge = useCallback(async () => {
    setMentorStage('declined');
    if (challenge) {
      await declineChallenge(challenge.id);
    }
  }, [challenge]);

  const submitVoiceReply = useCallback(
    async (recording: RecordingResult) => {
      setIsSendingReply(true);
      try {
        const receipt = await sendVoiceReply(challenge?.id ?? 'challenge-1', recording);
        setReplyDurationSeconds(receipt.durationSeconds);
        setMentorStage('sent');
      } finally {
        setIsSendingReply(false);
      }
    },
    [challenge?.id],
  );

  const resetAll = useCallback(() => {
    setStep('feeling');
    setFeelings([]);
    setFeelingNote('');
    setLifeArea(null);
    setProfessionalContext(EMPTY_PROFESSIONAL_CONTEXT);
    setContextChips([]);
    setDeepeningIndex(0);
    setAnswers({});
    setMomentCard(null);
    setDestinationValue('');
    setMatches([]);
    setSelectedMentorId(null);
    setAnonymizedCard(null);
    setMentorStage('inbox');
    setChallenge(null);
    setReplyDurationSeconds(0);
  }, []);

  const progress = useMemo(() => {
    const index = STEP_ORDER.indexOf(step);
    if (step === 'sent') return 1;
    if (index < 0) return 0;
    if (step === 'deepening') {
      const within = (deepeningIndex + 1) / (DEEPENING_QUESTIONS.length + 1);
      return (index + within) / STEP_ORDER.length;
    }
    return (index + 1) / STEP_ORDER.length;
  }, [deepeningIndex, step]);

  const actions = useMemo<MomentumActions>(
    () => ({
      toggleFeeling,
      setFeelingNote,
      continueFromFeeling,
      chooseLifeArea,
      continueFromLifeArea,
      setProfessionalField,
      submitProfessionalContext,
      removeContextChip,
      skipProfessionalContext,
      goToDeepening,
      setAnswer,
      advanceDeepening,
      updateMomentCard,
      commitMomentCard,
      confirmMomentCard,
      rejectMomentCard,
      setDestination,
      appendDestinationSuggestion,
      startMatching,
      runMatching,
      selectMentor,
      clearSelectedMentor,
      sendRequest,
      goBack,
      loadChallenge,
      openReply,
      dismissChallenge,
      submitVoiceReply,
      resetAll,
    }),
    [
      advanceDeepening,
      appendDestinationSuggestion,
      chooseLifeArea,
      clearSelectedMentor,
      commitMomentCard,
      confirmMomentCard,
      continueFromFeeling,
      continueFromLifeArea,
      dismissChallenge,
      goBack,
      goToDeepening,
      loadChallenge,
      openReply,
      rejectMomentCard,
      removeContextChip,
      resetAll,
      runMatching,
      selectMentor,
      sendRequest,
      setAnswer,
      setDestination,
      setProfessionalField,
      skipProfessionalContext,
      startMatching,
      submitProfessionalContext,
      submitVoiceReply,
      toggleFeeling,
      updateMomentCard,
    ],
  );

  const value = useMemo<MomentumContextValue>(
    () => ({
      step,
      progress,
      feelings,
      feelingNote,
      lifeArea,
      professionalContext,
      contextChips,
      isParsingContext,
      deepeningIndex,
      answers,
      momentCard,
      isGeneratingCard,
      destination,
      matches,
      isMatching,
      selectedMentorId,
      anonymizedCard,
      isSending,
      mentorStage,
      challenge,
      isLoadingChallenge,
      isSendingReply,
      replyDurationSeconds,
      actions,
    }),
    [
      actions,
      anonymizedCard,
      answers,
      challenge,
      contextChips,
      deepeningIndex,
      destination,
      feelingNote,
      feelings,
      isGeneratingCard,
      isLoadingChallenge,
      isMatching,
      isParsingContext,
      isSending,
      isSendingReply,
      lifeArea,
      matches,
      mentorStage,
      momentCard,
      professionalContext,
      progress,
      replyDurationSeconds,
      selectedMentorId,
      step,
    ],
  );

  return <MomentumContext.Provider value={value}>{children}</MomentumContext.Provider>;
}

export function useMomentum(): MomentumContextValue {
  const context = useContext(MomentumContext);
  if (!context) {
    throw new Error('useMomentum must be used inside MomentumProvider');
  }
  return context;
}
