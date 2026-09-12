/**
 * The only async boundary in the app.
 *
 * Every function here is a fake: it waits FAKE_LATENCY_MS and resolves with
 * mock data. To go live, replace the body of a function with a fetch() call —
 * the signatures and return types are meant to stay exactly as they are.
 */
import {
  ANONYMIZED_PREVIEW,
  DEEPENING_QUESTIONS,
  MENTOR_CHALLENGE,
  MENTOR_REPLY_MOCK_TRANSCRIPT,
  MENTORS,
  MOMENT_CARD_DRAFT,
  PARSED_CONTEXT_CHIPS,
  type AnonymizedCard,
  type LifeAreaId,
  type Mentor,
  type MentorChallenge,
  type MomentCardData,
} from '@/data/mock';

export const FAKE_LATENCY_MS = 900;

const wait = (ms: number = FAKE_LATENCY_MS) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

/* ------------------------------------------------------- professional context */

export interface ProfessionalContextInput {
  /** Pasted CV or free-text description of her work life. */
  description: string;
  /** Filename only — the mock never parses the file. */
  uploadedFileName: string | null;
  linkedInUrl: string;
}

/** Step 3: returns the chips shown as "Did I get that right?". */
export async function parseProfessionalContext(input: ProfessionalContextInput): Promise<string[]> {
  await wait();
  const hasAnything =
    input.description.trim().length > 0 ||
    input.uploadedFileName !== null ||
    input.linkedInUrl.trim().length > 0;
  return hasAnything ? PARSED_CONTEXT_CHIPS.slice(0, 5) : [];
}

/* ------------------------------------------------------------------ recording */

export interface RecordingSession {
  id: string;
  /** Deepening question id, or 'mentor-reply' for the mentor voice note. */
  promptId: string;
  startedAt: number;
}

export interface RecordingResult {
  session: RecordingSession;
  durationSeconds: number;
  transcript: string;
}

/** Begins a (mocked) voice capture. Wire this to a real voice API later. */
export async function startRecording(promptId: string): Promise<RecordingSession> {
  await wait(120);
  return {
    id: `rec-${promptId}-${Date.now()}`,
    promptId,
    startedAt: Date.now(),
  };
}

/** Ends a (mocked) voice capture and returns the transcript. */
export async function stopRecording(session: RecordingSession): Promise<RecordingResult> {
  await wait();
  const question = DEEPENING_QUESTIONS.find((item) => item.id === session.promptId);
  const transcript = question?.mockTranscript ?? MENTOR_REPLY_MOCK_TRANSCRIPT;
  return {
    session,
    durationSeconds: Math.max(1, Math.round((Date.now() - session.startedAt) / 1000)),
    transcript,
  };
}

/* --------------------------------------------------------------- moment card */

export interface MomentInput {
  feelings: string[];
  feelingNote: string;
  lifeArea: LifeAreaId | null;
  contextChips: string[];
  answers: Record<string, string>;
}

/** Step 5: turns her answers into the moment card. */
export async function generateMomentCard(_input: MomentInput): Promise<MomentCardData> {
  await wait();
  return {
    ...MOMENT_CARD_DRAFT,
    inTheWay: [...MOMENT_CARD_DRAFT.inTheWay],
    whatYouBring: [...MOMENT_CARD_DRAFT.whatYouBring],
  };
}

/** Step 5: persists her edits to the moment card. */
export async function saveMomentCard(card: MomentCardData): Promise<MomentCardData> {
  await wait();
  return card;
}

/* ------------------------------------------------------------------ matching */

export interface MatchInput {
  card: MomentCardData;
  destination: string;
}

/** Step 7: returns the three mentors shown in step 8. */
export async function findMatches(_input: MatchInput): Promise<Mentor[]> {
  await wait();
  return MENTORS;
}

/* ------------------------------------------------------------------- request */

/** Step 8: the anonymized card a mentor will receive. */
export async function buildAnonymizedCard(card: MomentCardData): Promise<AnonymizedCard> {
  await wait(300);
  return { ...ANONYMIZED_PREVIEW, quote: card.quote };
}

export interface MentorRequest {
  requestId: string;
  mentorId: string;
  sentAt: number;
}

/** Step 8: sends the 30 minute ask. */
export async function sendMentorRequest(
  mentorId: string,
  _card: AnonymizedCard,
): Promise<MentorRequest> {
  await wait();
  return { requestId: `req-${mentorId}-${Date.now()}`, mentorId, sentAt: Date.now() };
}

/* -------------------------------------------------------------- mentor inbox */

/** /mentor: the single incoming challenge. */
export async function fetchMentorChallenge(): Promise<MentorChallenge> {
  await wait();
  return MENTOR_CHALLENGE;
}

export async function acceptChallenge(challengeId: string): Promise<{ challengeId: string }> {
  await wait();
  return { challengeId };
}

export async function declineChallenge(challengeId: string): Promise<{ challengeId: string }> {
  await wait();
  return { challengeId };
}

export interface VoiceReplyReceipt {
  replyId: string;
  challengeId: string;
  durationSeconds: number;
}

/** /mentor: sends the 30 second voice note. */
export async function sendVoiceReply(
  challengeId: string,
  recording: RecordingResult,
): Promise<VoiceReplyReceipt> {
  await wait();
  return {
    replyId: `reply-${challengeId}-${Date.now()}`,
    challengeId,
    durationSeconds: recording.durationSeconds,
  };
}
