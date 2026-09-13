/**
 * The matching boundary. Onboarding state and screens only use
 * `matchingProvider`; they never see scenarios, signals or prompt text.
 *
 * To go live, write a provider that sends the `MatchRequest` to an
 * authenticated API and resolves a `MatchResponse`, then point
 * `matchingProvider` at it. Nothing else needs to change.
 */
import {
  DEMO_MATCH_RESPONSES,
  DEMO_SCENARIO_SIGNALS,
  DEMO_SCENARIO_TIE_ORDER,
  type DemoScenarioId,
} from '@/data/demo-match-responses';
import {
  DEEPENING_QUESTIONS,
  DESTINATION_SUGGESTIONS,
  MOMENT_CARD_DRAFT,
  type MomentCardData,
  type SampleProfileId,
} from '@/data/mock';

/** Everything private she shared during onboarding. Skipped fields are blank. */
export interface MatchRequest {
  /** Selected feeling option ids. */
  feelings: string[];
  location: string;
  origin: string;
  languages: string[];
  /** Conversation answers by question id, typed or transcribed. */
  answers: Record<string, string>;
  momentCard: MomentCardData;
  destination: string;
}

export interface MatchResult {
  profileId: SampleProfileId;
  /** Short, user-facing reason. Never a score, a tag or her own words. */
  reason: string;
}

export interface MatchResponse {
  /** Best match first. */
  results: MatchResult[];
}

export interface MatchingProvider {
  findMatches: (request: MatchRequest) => Promise<MatchResponse>;
}

export const MOCK_MATCH_LATENCY_MS = 900;

const normalize = (text: string) =>
  text
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Whole-word or whole-phrase match, so "leader" does not match "leadership". */
function containsPhrase(text: string, phrase: string): boolean {
  return new RegExp(`(^|[^a-z'])${escapeRegExp(normalize(phrase))}($|[^a-z'])`).test(text);
}

/**
 * Text she wrote herself. The demo recorder's scripted transcripts, the
 * untouched starting moment card and the destination suggestions are fixed
 * demo copy, so they never choose a scenario.
 */
function ownWords(request: MatchRequest): string {
  const parts = DEEPENING_QUESTIONS.map((question) =>
    [question.mockTranscript, question.mockFollowUp].reduce(
      (answer, scripted) => answer.split(scripted).join(' '),
      request.answers[question.id] ?? '',
    ),
  );

  const card = request.momentCard;
  if (card.quote !== MOMENT_CARD_DRAFT.quote) parts.push(card.quote);
  if (card.whereYouAre !== MOMENT_CARD_DRAFT.whereYouAre) parts.push(card.whereYouAre);
  parts.push(...card.inTheWay.filter((chip) => !MOMENT_CARD_DRAFT.inTheWay.includes(chip)));
  parts.push(...card.whatYouBring.filter((chip) => !MOMENT_CARD_DRAFT.whatYouBring.includes(chip)));

  const destination = normalize(request.destination);
  if (!DESTINATION_SUGGESTIONS.some((suggestion) => normalize(suggestion) === destination)) {
    parts.push(request.destination);
  }

  return normalize(parts.join(' '));
}

/**
 * Picks a demo scenario. The feelings and destination she chose count first,
 * then keywords in her own words; ties follow DEMO_SCENARIO_TIE_ORDER. No
 * signal at all gives the stable default.
 */
export function selectDemoScenario(request: MatchRequest): DemoScenarioId {
  const destination = normalize(request.destination);
  const text = ownWords(request);

  let best: { id: DemoScenarioId; chosen: number; written: number } = {
    id: 'default',
    chosen: 0,
    written: 0,
  };

  for (const id of DEMO_SCENARIO_TIE_ORDER) {
    const signals = DEMO_SCENARIO_SIGNALS[id];
    const chosen =
      request.feelings.filter((feeling) => signals.feelings.includes(feeling)).length +
      (signals.destinations.some((option) => normalize(option) === destination) ? 1 : 0);
    const written = signals.keywords.filter((keyword) => containsPhrase(text, keyword)).length;

    if (chosen > best.chosen || (chosen === best.chosen && written > best.written)) {
      best = { id, chosen, written };
    }
  }

  return best.id;
}

/** Local stand-in for the future AI API: brief latency, then a scripted response. */
export const mockMatchingProvider: MatchingProvider = {
  findMatches: async (request) => {
    await new Promise<void>((resolve) => {
      setTimeout(resolve, MOCK_MATCH_LATENCY_MS);
    });
    const { results } = DEMO_MATCH_RESPONSES[selectDemoScenario(request)];
    return { results: results.map((result) => ({ ...result })) };
  },
};

/** The provider the app uses. Replace this with the real implementation. */
export const matchingProvider: MatchingProvider = mockMatchingProvider;
