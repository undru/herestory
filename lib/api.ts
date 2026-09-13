/**
 * The only async boundary in the app.
 *
 * Every function here is a fake: it waits FAKE_LATENCY_MS and resolves with
 * mock data. To go live, replace the body of a function with a fetch() call —
 * the signatures and return types are meant to stay exactly as they are.
 */
import {
  DEEPENING_QUESTIONS,
  MENTOR_CHALLENGE,
  MENTOR_REPLY_MOCK_TRANSCRIPT,
  MOMENT_CARD_DRAFT,
  PROFILE_MOCK_TRANSCRIPTS,
  SAMPLE_PROFILES,
  type MentorChallenge,
  type MomentCardData,
  type ProfileMatch,
} from '@/data/mock';
import { matchingProvider, type MatchRequest } from '@/lib/matching';

export const FAKE_LATENCY_MS = 900;

const wait = (ms: number = FAKE_LATENCY_MS) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

/* ------------------------------------------------------------------ recording */

export interface RecordingSession {
  id: string;
  /** Deepening question id, 'location', 'origin', 'destination', or 'mentor-reply'. */
  promptId: string;
  /** True when she is adding to an answer she already gave. */
  continuing: boolean;
  startedAt: number;
}

export interface RecordingResult {
  session: RecordingSession;
  durationSeconds: number;
  transcript: string;
}

/** Begins a (mocked) voice capture. Wire this to a real voice API later. */
export async function startRecording(
  promptId: string,
  options: { continuing?: boolean } = {},
): Promise<RecordingSession> {
  await wait(120);
  return {
    id: `rec-${promptId}-${Date.now()}`,
    promptId,
    continuing: options.continuing ?? false,
    startedAt: Date.now(),
  };
}

/** Ends a (mocked) voice capture and returns the transcript. */
export async function stopRecording(session: RecordingSession): Promise<RecordingResult> {
  await wait();
  const question = DEEPENING_QUESTIONS.find((item) => item.id === session.promptId);
  const transcript = question
    ? session.continuing
      ? question.mockFollowUp
      : question.mockTranscript
    : (PROFILE_MOCK_TRANSCRIPTS[session.promptId] ?? MENTOR_REPLY_MOCK_TRANSCRIPT);
  return {
    session,
    durationSeconds: Math.max(1, Math.round((Date.now() - session.startedAt) / 1000)),
    transcript,
  };
}

/* --------------------------------------------------------------- moment card */

export interface MomentInput {
  feelings: string[];
  /** A few lines about her work life, or empty if she skipped it. */
  workLife: string;
  answers: Record<string, string>;
}

/** Step 4: turns her answers into the moment card. */
export async function generateMomentCard(_input: MomentInput): Promise<MomentCardData> {
  await wait();
  return {
    ...MOMENT_CARD_DRAFT,
    inTheWay: [...MOMENT_CARD_DRAFT.inTheWay],
    whatYouBring: [...MOMENT_CARD_DRAFT.whatYouBring],
  };
}

/** Step 4: persists her edits to the moment card. */
export async function saveMomentCard(card: MomentCardData): Promise<MomentCardData> {
  await wait();
  return card;
}

/* ------------------------------------------------------------------ matching */

/**
 * Matching: asks the matching provider (lib/matching.ts) for her top three and
 * pairs each returned profile id with its sample profile. The provider owns the
 * latency; unknown ids are dropped.
 */
export async function findMatches(request: MatchRequest): Promise<ProfileMatch[]> {
  const response = await matchingProvider.findMatches(request);
  return response.results.flatMap((result) => {
    const profile = SAMPLE_PROFILES.find((item) => item.id === result.profileId);
    return profile ? [{ ...profile, reason: result.reason }] : [];
  });
}

/* ------------------------------------------------------------------- request */

export interface MentorRequest {
  requestId: string;
  mentorId: string;
  sentAt: number;
}

/** "Before it goes": sends the redacted message to the chosen mentor. */
export async function sendMentorRequest(
  mentorId: string,
  _message: string,
): Promise<MentorRequest> {
  await wait();
  return { requestId: `req-${mentorId}-${Date.now()}`, mentorId, sentAt: Date.now() };
}

/** "Tell her the one thing you know": her answer to the woman one step behind. */
export async function sendHelpReply(text: string): Promise<{ replyId: string; text: string }> {
  await wait();
  return { replyId: `help-${Date.now()}`, text };
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

export async function sendTextReply(
  challengeId: string,
  text: string,
): Promise<{ replyId: string; challengeId: string; text: string }> {
  await wait();
  return { replyId: `reply-${challengeId}-${Date.now()}`, challengeId, text };
}

export async function offerAvailability(
  challengeId: string,
  slot: string | null,
): Promise<{ challengeId: string; slot: string | null }> {
  await wait();
  return { challengeId, slot };
}

export async function sendConversationMessage(
  text: string,
): Promise<{ messageId: string; text: string }> {
  await wait(300);
  return { messageId: `message-${Date.now()}`, text };
}

export async function confirmConversationTime(
  slot: string,
): Promise<{ slot: string; confirmedAt: number }> {
  await wait();
  return { slot, confirmedAt: Date.now() };
}
