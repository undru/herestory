import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';

import {
  DEEPENING_QUESTIONS,
  MAX_FEELINGS,
  type MentorChallenge,
  type MomentCardData,
  type ProfileMatch,
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
import {
  EMPTY_HISTORY,
  historyRepository,
  mergeHistories,
  withConversation,
  withMatchBatch,
  type LocalHistory,
  type ProfileSnapshot,
} from '@/lib/history-repository';

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
  | 'matched'
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

const AFTER_MATCHES: MenteeStep[] = [
  'redaction',
  'sent',
  'helpOffer',
  'helpAnswer',
  'finish',
  'matched',
];

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

/** Where the back arrow leads. A chat thread steps back to the screen before it, not per message. */
function previousStep(step: MenteeStep): MenteeStep | null {
  switch (step) {
    case 'context':
      return 'feeling';
    case 'location':
    case 'origin':
    case 'languages':
      return 'context';
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
      return 'matched';
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
  /* Private, in-session profile details. Never shown publicly; sent to matching. */
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
  matches: ProfileMatch[];
  isMatching: boolean;
  /** The open mentor card, and later the mentor she asked. */
  selectedMentorId: string | null;
  selectedMentor: ProfileMatch | null;
  isSending: boolean;
  /** Whether she answered the woman one step behind, or skipped. */
  helped: boolean;
  /** Profile & history saved on this device. Empty until loaded. */
  history: LocalHistory;
  isHistoryLoaded: boolean;
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
  /** On to the moment card, rebuilding it only if her answers changed. */
  finishConversation: () => Promise<void>;
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
  /** From the closing screen to the last one: who she is matched with. */
  openMatched: () => void;
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
  /** Deletes the Profile & history saved on this device. */
  clearHistory: () => Promise<void>;
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
  const [matches, setMatches] = useState<ProfileMatch[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [helped, setHelped] = useState(false);
  const [history, setHistory] = useState<LocalHistory>(EMPTY_HISTORY);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);
  /** Latest history, so saves in quick succession build on each other. */
  const historyRef = useRef<LocalHistory>(EMPTY_HISTORY);
  /** One conversation entry per run: confirming the card again replaces it. */
  const runIdRef = useRef<string | null>(null);

  useEffect(() => {
    let active = true;
    void historyRepository
      .load()
      .catch(() => EMPTY_HISTORY)
      .then((stored) => {
        if (!active) return;
        const merged = mergeHistories(stored, historyRef.current);
        historyRef.current = merged;
        setHistory(merged);
        setIsHistoryLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const updateHistory = useCallback((update: (current: LocalHistory) => LocalHistory) => {
    const next = update(historyRef.current);
    historyRef.current = next;
    setHistory(next);
    // If the device refuses the write, the history still shows for this session.
    void historyRepository.save(next).catch(() => undefined);
  }, []);

  const [mentorStage, setMentorStage] = useState<MentorStage>('handoff');
  const [challenge, setChallenge] = useState<MentorChallenge | null>(null);
  const [isLoadingChallenge, setIsLoadingChallenge] = useState(false);
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replyDurationSeconds, setReplyDurationSeconds] = useState(0);
  const [offeredSlot, setOfferedSlot] = useState<string | null>(null);
  const [bookedSlot, setBookedSlot] = useState<string | null>(null);

  const startJourney = useCallback(() => {
    runIdRef.current = `run-${Date.now()}`;
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

  const finishConversation = useCallback(async () => {
    setStep('moment');
    // Nothing new was added: keep the card, including any edits she made on it.
    if (momentCard && cardAnswers && sameAnswers(cardAnswers, answers)) {
      setCardError(false);
      return;
    }
    await buildCard(answers);
  }, [answers, buildCard, cardAnswers, momentCard]);

  const advanceDeepening = useCallback(async () => {
    if (deepeningIndex < DEEPENING_QUESTIONS.length - 1) {
      setDeepeningIndex(deepeningIndex + 1);
      return;
    }
    await finishConversation();
  }, [deepeningIndex, finishConversation]);

  const updateMomentCard = useCallback((patch: Partial<MomentCardData>) => {
    setMomentCard((current) => (current ? { ...current, ...patch } : current));
  }, []);

  const commitMomentCard = useCallback(async () => {
    if (!momentCard) return;
    await saveMomentCard(momentCard);
  }, [momentCard]);

  const profileSnapshot = useMemo<ProfileSnapshot>(
    () => ({ location, origin, languages, feelings, destination, cvFileName }),
    [cvFileName, destination, feelings, languages, location, origin],
  );

  /** "That's me": the conversation is complete, so it is saved to her history. */
  const confirmMomentCard = useCallback(() => {
    runIdRef.current ??= `run-${Date.now()}`;
    const conversationId = `conversation-${runIdRef.current}`;
    updateHistory((current) =>
      withConversation(current, profileSnapshot, {
        id: conversationId,
        completedAt: Date.now(),
        answers: Object.fromEntries(
          DEEPENING_QUESTIONS.map((question) => [question.id, (answers[question.id] ?? '').trim()]),
        ),
      }),
    );
    setStep('destination');
  }, [answers, profileSnapshot, updateHistory]);

  /** Every question is already in the thread, so the progress bar stays on the last one. */
  const addToAnswers = useCallback(() => {
    setDeepeningIndex(DEEPENING_QUESTIONS.length - 1);
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
      const found = await findMatches({
        feelings,
        location,
        origin,
        languages,
        answers,
        momentCard,
        destination,
      });
      setMatches(found);
      setSelectedMentorId(found[0]?.id ?? null);
      if (found.length > 0) {
        const matchedAt = Date.now();
        updateHistory((current) =>
          withMatchBatch(current, profileSnapshot, {
            id: `matches-${matchedAt}`,
            matchedAt,
            results: found.map((match) => ({ profileId: match.id, reason: match.reason })),
          }),
        );
      }
      setStep('matches');
    } finally {
      setIsMatching(false);
    }
  }, [
    answers,
    destination,
    feelings,
    languages,
    location,
    momentCard,
    origin,
    profileSnapshot,
    updateHistory,
  ]);

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

  const openMatched = useCallback(() => setStep('matched'), []);
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
    const previous = previousStep(step);
    if (previous) setStep(previous);
  }, [step]);

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

  const clearHistory = useCallback(async () => {
    historyRef.current = EMPTY_HISTORY;
    setHistory(EMPTY_HISTORY);
    try {
      await historyRepository.clear();
    } catch {
      // Already cleared on screen; the next successful save overwrites storage.
    }
  }, []);

  /** Clears this run's answers. Saved history is kept unless clearHistory is called. */
  const resetAll = useCallback(() => {
    runIdRef.current = null;
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
      finishConversation,
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
      openMatched,
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
      clearHistory,
    }),
    [
      acceptConnection,
      addToAnswers,
      advanceDeepening,
      appendAnswer,
      askMentor,
      chooseAvailability,
      clearHistory,
      commitMomentCard,
      confirmBooking,
      confirmMomentCard,
      confirmRedaction,
      continueFromFeeling,
      continueFromWorkLife,
      continueProfileDetail,
      dismissChallenge,
      finishConversation,
      goBack,
      loadChallenge,
      offerHelp,
      openBooking,
      openChat,
      openExtras,
      openHelpOffer,
      openMatched,
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
      history,
      isHistoryLoaded,
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
      history,
      isGeneratingCard,
      isHistoryLoaded,
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
