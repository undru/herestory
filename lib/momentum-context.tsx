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
  type Mentor,
  type MentorChallenge,
  type MomentCardData,
} from '@/data/mock';
import {
  acceptChallenge,
  confirmConversationTime,
  declineChallenge,
  fetchMentorChallenge,
  findMatches,
  generateMomentCard,
  offerAvailability,
  saveMomentCard,
  sendHelpReply,
  sendMentorRequest,
  sendTextReply,
  sendVoiceReply,
  type RecordingResult,
} from '@/lib/api';

export type MenteeStep =
  | 'welcome'
  | 'feeling'
  | 'context'
  | 'location'
  | 'origin'
  | 'languages'
  | 'conversationIntro'
  | 'deepening'
  | 'moment'
  | 'destination'
  | 'matching'
  | 'matches'
  | 'redaction'
  | 'sent'
  | 'helpOffer'
  | 'helpAnswer'
  | 'finish'
  /* Screens outside the mockup flow, opened from the "Other screens" list. */
  | 'extras'
  | 'signal'
  | 'answer'
  | 'connected'
  | 'chat'
  | 'book'
  | 'booked'
  | 'people';

/** Screens reached only from the "Other screens" list. */
export const EXTRA_STEPS: MenteeStep[] = [
  'signal',
  'answer',
  'connected',
  'chat',
  'book',
  'booked',
  'people',
];

/** Progress bar positions: empty on welcome, full once the mentors appear. */
const PROGRESS_ORDER: MenteeStep[] = [
  'welcome',
  'feeling',
  'context',
  'location',
  'origin',
  'languages',
  'conversationIntro',
  'deepening',
  'moment',
  'destination',
  'matching',
  'matches',
];

const AFTER_MATCHES: MenteeStep[] = ['redaction', 'sent', 'helpOffer', 'helpAnswer', 'finish'];

/** The profile-detail mini-flow after profile context, in order. */
const NEXT_PROFILE_DETAIL: Partial<Record<MenteeStep, MenteeStep>> = {
  location: 'origin',
  origin: 'languages',
  languages: 'conversationIntro',
};

export type MentorStage =
  | 'handoff'
  | 'notification'
  | 'inbox'
  | 'reply'
  | 'offer'
  | 'done'
  | 'declined';

/** Where the back arrow leads. Deepening questions step back one at a time first. */
function previousStep(step: MenteeStep): MenteeStep | null {
  switch (step) {
    case 'context':
      return 'feeling';
    case 'location':
      return 'context';
    case 'origin':
      return 'location';
    case 'languages':
      return 'origin';
    case 'conversationIntro':
      return 'languages';
    case 'deepening':
      return 'conversationIntro';
    case 'moment':
      return 'deepening';
    case 'destination':
      return 'moment';
    case 'matches':
      return 'destination';
    case 'redaction':
      return 'matches';
    case 'helpAnswer':
      return 'helpOffer';
    case 'extras':
      return 'finish';
    case 'answer':
      return 'signal';
    case 'chat':
      return 'connected';
    case 'book':
      return 'chat';
    case 'people':
      return 'booked';
    default:
      return null;
  }
}

const sameAnswers = (a: Record<string, string>, b: Record<string, string>) =>
  DEEPENING_QUESTIONS.every((question) => (a[question.id] ?? '') === (b[question.id] ?? ''));

interface MomentumState {
  /* mentee flow */
  step: MenteeStep;
  progress: number;
  feelings: string[];
  workLife: string;
  /** Name of the CV she picked this session. The file itself is never uploaded or read. */
  cvFileName: string | null;
  /* Private, in-session profile details. Not shown publicly or used for matching yet. */
  location: string;
  origin: string;
  languages: string[];
  deepeningIndex: number;
  answers: Record<string, string>;
  momentCard: MomentCardData | null;
  isGeneratingCard: boolean;
  /** Card generation failed; the answers are kept for a retry. */
  cardError: boolean;
  destination: string;
  matches: Mentor[];
  isMatching: boolean;
  /** The open mentor card, and later the mentor she asked. */
  selectedMentorId: string | null;
  selectedMentor: Mentor | null;
  isSending: boolean;
  /** Whether she answered the woman one step behind, or skipped. */
  helped: boolean;
  /* mentor inbox */
  mentorStage: MentorStage;
  challenge: MentorChallenge | null;
  isLoadingChallenge: boolean;
  isSendingReply: boolean;
  replyDurationSeconds: number;
  offeredSlot: string | null;
  bookedSlot: string | null;
}

interface MomentumActions {
  startJourney: () => void;
  toggleFeeling: (id: string) => void;
  continueFromFeeling: () => void;
  setWorkLife: (value: string) => void;
  continueFromWorkLife: () => void;
  /** Moves on without a CV or work-life answer. */
  skipWorkLife: () => void;
  setCvFileName: (name: string | null) => void;
  setLocation: (value: string) => void;
  setOrigin: (value: string) => void;
  setLanguages: (labels: string[]) => void;
  /** Location, background and languages: on to the next screen. */
  continueProfileDetail: () => void;
  /** Clears the current profile-detail answer and moves on. */
  skipProfileDetail: () => void;
  /** From the conversation intro to the first question. */
  startConversation: () => void;
  setAnswer: (questionId: string, value: string) => void;
  /** Adds a new recording to the end of what she already said. */
  appendAnswer: (questionId: string, text: string) => void;
  advanceDeepening: () => Promise<void>;
  updateMomentCard: (patch: Partial<MomentCardData>) => void;
  commitMomentCard: () => Promise<void>;
  confirmMomentCard: () => void;
  /** "Not quite": back to the questions with every answer kept. */
  addToAnswers: () => void;
  /** Builds the moment card again from the same answers after a failure. */
  retryMomentCard: () => Promise<void>;
  setDestination: (value: string) => void;
  startMatching: () => void;
  runMatching: () => Promise<void>;
  openMentor: (mentorId: string) => void;
  askMentor: (mentorId: string) => void;
  confirmRedaction: (message: string) => Promise<void>;
  openHelpOffer: () => void;
  offerHelp: () => void;
  skipHelp: () => void;
  sendHelp: (text: string) => Promise<void>;
  openExtras: () => void;
  previewStep: (step: MenteeStep) => void;
  previewMentorStage: (stage: MentorStage) => void;
  openSignal: () => void;
  viewAnswer: () => void;
  acceptConnection: () => void;
  openChat: () => void;
  openBooking: () => void;
  confirmBooking: (slot: string) => Promise<void>;
  openPeople: () => void;
  goBack: () => void;
  openMentorNotification: () => void;
  openMentorInbox: () => void;
  loadChallenge: () => Promise<void>;
  openReply: () => Promise<void>;
  dismissChallenge: () => Promise<void>;
  submitVoiceReply: (recording: RecordingResult) => Promise<void>;
  submitTextReply: (text: string) => Promise<void>;
  chooseAvailability: (slot: string | null) => Promise<void>;
  resetAll: () => void;
}

type MomentumContextValue = MomentumState & { actions: MomentumActions };

const MomentumContext = createContext<MomentumContextValue | null>(null);

export function MomentumProvider({ children }: PropsWithChildren) {
  const [step, setStep] = useState<MenteeStep>('welcome');
  const [feelings, setFeelings] = useState<string[]>([]);
  const [workLife, setWorkLife] = useState('');
  const [cvFileName, setCvFileName] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [origin, setOrigin] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);
  const [deepeningIndex, setDeepeningIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [momentCard, setMomentCard] = useState<MomentCardData | null>(null);
  /** The answers the current moment card was built from. */
  const [cardAnswers, setCardAnswers] = useState<Record<string, string> | null>(null);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const [cardError, setCardError] = useState(false);
  const [destination, setDestinationValue] = useState('');
  const [matches, setMatches] = useState<Mentor[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [helped, setHelped] = useState(false);

  const [mentorStage, setMentorStage] = useState<MentorStage>('handoff');
  const [challenge, setChallenge] = useState<MentorChallenge | null>(null);
  const [isLoadingChallenge, setIsLoadingChallenge] = useState(false);
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replyDurationSeconds, setReplyDurationSeconds] = useState(0);
  const [offeredSlot, setOfferedSlot] = useState<string | null>(null);
  const [bookedSlot, setBookedSlot] = useState<string | null>(null);

  const startJourney = useCallback(() => {
    setStep('feeling');
  }, []);

  const toggleFeeling = useCallback((id: string) => {
    setFeelings((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= MAX_FEELINGS) return current;
      return [...current, id];
    });
  }, []);

  const continueFromFeeling = useCallback(() => {
    setStep('context');
  }, []);

  const continueFromWorkLife = useCallback(() => {
    setStep('location');
  }, []);

  const skipWorkLife = useCallback(() => {
    setWorkLife('');
    setCvFileName(null);
    setStep('location');
  }, []);

  const startConversation = useCallback(() => {
    setDeepeningIndex(0);
    setStep('deepening');
  }, []);

  const continueProfileDetail = useCallback(() => {
    const next = NEXT_PROFILE_DETAIL[step];
    if (next) setStep(next);
  }, [step]);

  const skipProfileDetail = useCallback(() => {
    if (step === 'location') setLocation('');
    if (step === 'origin') setOrigin('');
    if (step === 'languages') setLanguages([]);
    const next = NEXT_PROFILE_DETAIL[step];
    if (next) setStep(next);
  }, [step]);

  const setAnswer = useCallback((questionId: string, value: string) => {
    setAnswers((current) => ({ ...current, [questionId]: value }));
  }, []);

  const appendAnswer = useCallback((questionId: string, text: string) => {
    setAnswers((current) => {
      const previous = (current[questionId] ?? '').trimEnd();
      return { ...current, [questionId]: previous ? `${previous} ${text}` : text };
    });
  }, []);

  const buildCard = useCallback(
    async (currentAnswers: Record<string, string>) => {
      setIsGeneratingCard(true);
      setCardError(false);
      try {
        const card = await generateMomentCard({
          feelings,
          workLife,
          answers: currentAnswers,
        });
        setMomentCard(card);
        setCardAnswers(currentAnswers);
      } catch {
        setCardError(true);
      } finally {
        setIsGeneratingCard(false);
      }
    },
    [feelings, workLife],
  );

  const advanceDeepening = useCallback(async () => {
    if (deepeningIndex < DEEPENING_QUESTIONS.length - 1) {
      setDeepeningIndex(deepeningIndex + 1);
      return;
    }
    setStep('moment');
    // Nothing new was added: keep the card, including any edits she made on it.
    if (momentCard && cardAnswers && sameAnswers(cardAnswers, answers)) {
      setCardError(false);
      return;
    }
    await buildCard(answers);
  }, [answers, buildCard, cardAnswers, deepeningIndex, momentCard]);

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

  const addToAnswers = useCallback(() => {
    setDeepeningIndex(0);
    setStep('deepening');
  }, []);

  const retryMomentCard = useCallback(async () => {
    await buildCard(answers);
  }, [answers, buildCard]);

  const setDestination = useCallback((value: string) => {
    setDestinationValue(value);
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
      setSelectedMentorId(found[0]?.id ?? null);
      setStep('matches');
    } finally {
      setIsMatching(false);
    }
  }, [destination, momentCard]);

  const openMentor = useCallback((mentorId: string) => {
    setSelectedMentorId(mentorId);
  }, []);

  const askMentor = useCallback((mentorId: string) => {
    setSelectedMentorId(mentorId);
    setStep('redaction');
  }, []);

  const confirmRedaction = useCallback(
    async (message: string) => {
      if (!selectedMentorId) return;
      setIsSending(true);
      try {
        await sendMentorRequest(selectedMentorId, message);
        setStep('sent');
      } finally {
        setIsSending(false);
      }
    },
    [selectedMentorId],
  );

  const openHelpOffer = useCallback(() => setStep('helpOffer'), []);
  const offerHelp = useCallback(() => setStep('helpAnswer'), []);

  const skipHelp = useCallback(() => {
    setHelped(false);
    setStep('finish');
  }, []);

  const sendHelp = useCallback(async (text: string) => {
    if (!text.trim()) return;
    setIsSending(true);
    try {
      await sendHelpReply(text.trim());
      setHelped(true);
      setStep('finish');
    } finally {
      setIsSending(false);
    }
  }, []);

  const openExtras = useCallback(() => setStep('extras'), []);
  const previewStep = useCallback((next: MenteeStep) => setStep(next), []);
  const previewMentorStage = useCallback((stage: MentorStage) => setMentorStage(stage), []);

  const openSignal = useCallback(() => setStep('signal'), []);
  const viewAnswer = useCallback(() => setStep('answer'), []);
  const acceptConnection = useCallback(() => setStep('connected'), []);
  const openChat = useCallback(() => setStep('chat'), []);
  const openBooking = useCallback(() => setStep('book'), []);
  const confirmBooking = useCallback(async (slot: string) => {
    await confirmConversationTime(slot);
    setBookedSlot(slot);
    setStep('booked');
  }, []);
  const openPeople = useCallback(() => setStep('people'), []);

  const openMentorNotification = useCallback(() => setMentorStage('notification'), []);
  const openMentorInbox = useCallback(() => setMentorStage('inbox'), []);

  const goBack = useCallback(() => {
    if (step === 'deepening' && deepeningIndex > 0) {
      setDeepeningIndex(deepeningIndex - 1);
      return;
    }
    const previous = previousStep(step);
    if (previous) setStep(previous);
  }, [deepeningIndex, step]);

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
        setMentorStage('offer');
      } finally {
        setIsSendingReply(false);
      }
    },
    [challenge?.id],
  );

  const submitTextReply = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      setIsSendingReply(true);
      try {
        await sendTextReply(challenge?.id ?? 'challenge-1', text.trim());
        setMentorStage('offer');
      } finally {
        setIsSendingReply(false);
      }
    },
    [challenge?.id],
  );

  const chooseAvailability = useCallback(
    async (slot: string | null) => {
      setIsSendingReply(true);
      try {
        const receipt = await offerAvailability(challenge?.id ?? 'challenge-1', slot);
        setOfferedSlot(receipt.slot);
        setMentorStage('done');
      } finally {
        setIsSendingReply(false);
      }
    },
    [challenge?.id],
  );

  const resetAll = useCallback(() => {
    setStep('welcome');
    setFeelings([]);
    setWorkLife('');
    setCvFileName(null);
    setLocation('');
    setOrigin('');
    setLanguages([]);
    setDeepeningIndex(0);
    setAnswers({});
    setMomentCard(null);
    setCardAnswers(null);
    setCardError(false);
    setDestinationValue('');
    setMatches([]);
    setSelectedMentorId(null);
    setHelped(false);
    setMentorStage('handoff');
    setChallenge(null);
    setReplyDurationSeconds(0);
    setOfferedSlot(null);
    setBookedSlot(null);
  }, []);

  const progress = useMemo(() => {
    if (AFTER_MATCHES.includes(step)) return 1;
    const index = PROGRESS_ORDER.indexOf(step);
    if (index < 0) return 0;
    const extraQuestions = DEEPENING_QUESTIONS.length - 1;
    const total = PROGRESS_ORDER.length - 1 + extraQuestions;
    const deepeningAt = PROGRESS_ORDER.indexOf('deepening');
    const offset = step === 'deepening' ? deepeningIndex : index > deepeningAt ? extraQuestions : 0;
    return (index + offset) / total;
  }, [deepeningIndex, step]);

  const selectedMentor = useMemo(
    () => matches.find((mentor) => mentor.id === selectedMentorId) ?? null,
    [matches, selectedMentorId],
  );

  const actions = useMemo<MomentumActions>(
    () => ({
      startJourney,
      toggleFeeling,
      continueFromFeeling,
      setWorkLife,
      continueFromWorkLife,
      skipWorkLife,
      setCvFileName,
      setLocation,
      setOrigin,
      setLanguages,
      continueProfileDetail,
      skipProfileDetail,
      startConversation,
      setAnswer,
      appendAnswer,
      advanceDeepening,
      updateMomentCard,
      commitMomentCard,
      confirmMomentCard,
      addToAnswers,
      retryMomentCard,
      setDestination,
      startMatching,
      runMatching,
      openMentor,
      askMentor,
      confirmRedaction,
      openHelpOffer,
      offerHelp,
      skipHelp,
      sendHelp,
      openExtras,
      previewStep,
      previewMentorStage,
      openSignal,
      viewAnswer,
      acceptConnection,
      openChat,
      openBooking,
      confirmBooking,
      openPeople,
      goBack,
      openMentorNotification,
      openMentorInbox,
      loadChallenge,
      openReply,
      dismissChallenge,
      submitVoiceReply,
      submitTextReply,
      chooseAvailability,
      resetAll,
    }),
    [
      acceptConnection,
      addToAnswers,
      advanceDeepening,
      appendAnswer,
      askMentor,
      chooseAvailability,
      commitMomentCard,
      confirmBooking,
      confirmMomentCard,
      confirmRedaction,
      continueFromFeeling,
      continueFromWorkLife,
      continueProfileDetail,
      dismissChallenge,
      goBack,
      loadChallenge,
      offerHelp,
      openBooking,
      openChat,
      openExtras,
      openHelpOffer,
      openMentor,
      openMentorInbox,
      openMentorNotification,
      openPeople,
      openReply,
      openSignal,
      previewMentorStage,
      previewStep,
      resetAll,
      retryMomentCard,
      runMatching,
      sendHelp,
      setAnswer,
      setDestination,
      skipHelp,
      skipProfileDetail,
      skipWorkLife,
      startConversation,
      startJourney,
      startMatching,
      submitTextReply,
      submitVoiceReply,
      toggleFeeling,
      updateMomentCard,
      viewAnswer,
    ],
  );

  const value = useMemo<MomentumContextValue>(
    () => ({
      step,
      progress,
      feelings,
      workLife,
      cvFileName,
      location,
      origin,
      languages,
      deepeningIndex,
      answers,
      momentCard,
      isGeneratingCard,
      cardError,
      destination,
      matches,
      isMatching,
      selectedMentorId,
      selectedMentor,
      isSending,
      helped,
      mentorStage,
      challenge,
      isLoadingChallenge,
      isSendingReply,
      replyDurationSeconds,
      offeredSlot,
      bookedSlot,
      actions,
    }),
    [
      actions,
      answers,
      bookedSlot,
      cardError,
      challenge,
      cvFileName,
      deepeningIndex,
      destination,
      feelings,
      helped,
      isGeneratingCard,
      isLoadingChallenge,
      isMatching,
      isSending,
      isSendingReply,
      languages,
      location,
      matches,
      mentorStage,
      momentCard,
      offeredSlot,
      origin,
      progress,
      replyDurationSeconds,
      selectedMentor,
      selectedMentorId,
      step,
      workLife,
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
