/**
 * Profile & history storage: a small, versioned snapshot model kept in
 * AsyncStorage on this device only. Nothing is synced, shared or uploaded.
 *
 * Screens and onboarding state only use `historyRepository` and the pure
 * helpers below. To move to authenticated backend storage later, reimplement
 * `historyRepository`; the `LocalHistory` shape can stay as it is.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SAMPLE_PROFILES, type SampleProfileId } from '@/data/mock';

export const HISTORY_STORAGE_KEY = 'herestory.history';
export const HISTORY_VERSION = 1;
/** Older entries beyond this are dropped so local storage stays small. */
export const MAX_HISTORY_ENTRIES = 20;

/** Private onboarding details as she last gave them. Blank or null when skipped. */
export interface ProfileSnapshot {
  location: string;
  origin: string;
  languages: string[];
  /** Feeling option ids. */
  feelings: string[];
  destination: string;
  /** File name only. The CV itself is never stored or read. */
  cvFileName: string | null;
}

export interface ConversationSnapshot {
  id: string;
  /** Epoch milliseconds, from this device's clock. */
  completedAt: number;
  /** Typed or transcribed answer text by question id. Never audio. */
  answers: Record<string, string>;
}

export interface MatchBatchSnapshot {
  id: string;
  /** Epoch milliseconds, from this device's clock. */
  matchedAt: number;
  /** Returned order, best match first. */
  results: { profileId: SampleProfileId; reason: string }[];
}

export interface LocalHistory {
  version: typeof HISTORY_VERSION;
  profile: ProfileSnapshot | null;
  /** Newest first. */
  conversations: ConversationSnapshot[];
  /** Newest first. */
  matchBatches: MatchBatchSnapshot[];
}

export const EMPTY_HISTORY: LocalHistory = {
  version: HISTORY_VERSION,
  profile: null,
  conversations: [],
  matchBatches: [],
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

function parseProfile(value: unknown): ProfileSnapshot | null {
  if (!isRecord(value)) return null;
  const { location, origin, languages, feelings, destination, cvFileName } = value;
  if (
    typeof location !== 'string' ||
    typeof origin !== 'string' ||
    typeof destination !== 'string' ||
    !isStringArray(languages) ||
    !isStringArray(feelings) ||
    (cvFileName !== null && typeof cvFileName !== 'string')
  ) {
    return null;
  }
  return { location, origin, languages, feelings, destination, cvFileName };
}

function isConversation(value: unknown): value is ConversationSnapshot {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.completedAt === 'number' &&
    isRecord(value.answers) &&
    Object.values(value.answers).every((answer) => typeof answer === 'string')
  );
}

function isMatchBatch(value: unknown): value is MatchBatchSnapshot {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.matchedAt === 'number' &&
    Array.isArray(value.results) &&
    value.results.every(
      (result) =>
        isRecord(result) &&
        typeof result.reason === 'string' &&
        SAMPLE_PROFILES.some((profile) => profile.id === result.profileId),
    )
  );
}

/** Unreadable data or another version starts fresh; malformed entries are skipped. */
function parseHistory(raw: string | null): LocalHistory {
  if (!raw) return EMPTY_HISTORY;
  try {
    const value: unknown = JSON.parse(raw);
    if (!isRecord(value) || value.version !== HISTORY_VERSION) return EMPTY_HISTORY;
    return {
      version: HISTORY_VERSION,
      profile: parseProfile(value.profile),
      conversations: Array.isArray(value.conversations)
        ? value.conversations.filter(isConversation)
        : [],
      matchBatches: Array.isArray(value.matchBatches)
        ? value.matchBatches.filter(isMatchBatch)
        : [],
    };
  } catch {
    return EMPTY_HISTORY;
  }
}

/** Newest first, one entry per id, capped. */
function newestFirst<T extends { id: string }>(items: T[], time: (item: T) => number): T[] {
  const unique = items.filter(
    (item, index) => items.findIndex((other) => other.id === item.id) === index,
  );
  return unique.sort((a, b) => time(b) - time(a)).slice(0, MAX_HISTORY_ENTRIES);
}

export function withConversation(
  history: LocalHistory,
  profile: ProfileSnapshot,
  conversation: ConversationSnapshot,
): LocalHistory {
  return {
    ...history,
    profile,
    conversations: newestFirst(
      [conversation, ...history.conversations],
      (item) => item.completedAt,
    ),
  };
}

export function withMatchBatch(
  history: LocalHistory,
  profile: ProfileSnapshot,
  batch: MatchBatchSnapshot,
): LocalHistory {
  return {
    ...history,
    profile,
    matchBatches: newestFirst([batch, ...history.matchBatches], (item) => item.matchedAt),
  };
}

/** Combines the stored copy with anything saved before it finished loading. */
export function mergeHistories(stored: LocalHistory, current: LocalHistory): LocalHistory {
  return {
    version: HISTORY_VERSION,
    profile: current.profile ?? stored.profile,
    conversations: newestFirst(
      [...current.conversations, ...stored.conversations],
      (item) => item.completedAt,
    ),
    matchBatches: newestFirst(
      [...current.matchBatches, ...stored.matchBatches],
      (item) => item.matchedAt,
    ),
  };
}

export const historyRepository = {
  load: async (): Promise<LocalHistory> =>
    parseHistory(await AsyncStorage.getItem(HISTORY_STORAGE_KEY)),
  save: async (history: LocalHistory): Promise<void> => {
    await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  },
  clear: async (): Promise<void> => {
    await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
  },
};
