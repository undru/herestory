/**
 * Demo fixture: the pre-scripted match responses behind the mock matching
 * provider in lib/matching.ts.
 *
 * This file is the future AI-integration seam. Today the mock provider picks
 * one scenario below from broad signals in onboarding and returns its scripted
 * response. A real implementation replaces only that provider with an
 * authenticated API call that returns the same `MatchResponse` shape; this
 * fixture can then be deleted. Nothing here is a real person, a score, or
 * model output, and none of it is shown to the person except the reasons.
 */
import type { MatchResponse } from '@/lib/matching';

export type DemoScenarioId =
  | 'visibility'
  | 'leadership'
  | 'return'
  | 'burnout'
  | 'confidence'
  | 'default';

export type SignalScenarioId = Exclude<DemoScenarioId, 'default'>;

export interface DemoScenarioSignals {
  /** Feeling option ids (FEELING_OPTIONS in data/mock.ts) that point here. */
  feelings: string[];
  /** Destination suggestions (DESTINATION_SUGGESTIONS) that point here. */
  destinations: string[];
  /** Words and phrases looked for in text she wrote herself. */
  keywords: string[];
}

/** When scenarios score the same, the earlier one wins. */
export const DEMO_SCENARIO_TIE_ORDER: SignalScenarioId[] = [
  'visibility',
  'confidence',
  'leadership',
  'return',
  'burnout',
];

export const DEMO_SCENARIO_SIGNALS: Record<SignalScenarioId, DemoScenarioSignals> = {
  /* Aura first: excellent at delivery, stalled on being seen and sponsored. */
  visibility: {
    feelings: ['doing-well-stuck', 'looking-for-spark'],
    destinations: ['Make my work visible to leadership'],
    keywords: [
      'visibility',
      'visible',
      'upward communication',
      'executive stakeholder',
      'executive stakeholders',
      'sponsor',
      'sponsorship',
      'self-advocacy',
      'self advocacy',
      'strategic narrative',
      'director',
      'make my work visible',
      'make my work legible',
      'legible to leadership',
      'advocate for myself',
      'seat at the table',
      'passed over',
      'promoted past me',
      'plateau',
      'plateaued',
    ],
  },
  /* Petra first: leadership, advancement, visibility, workplace bias. */
  leadership: {
    feelings: ['ready-for-change', 'curious-next'],
    destinations: ['Back into leadership, on my terms'],
    keywords: [
      'leadership',
      'leader',
      'promotion',
      'promoted',
      'senior',
      'advance',
      'advancement',
      'visibility',
      'visible',
      'overlooked',
      'recognition',
      'bias',
      'sexism',
      'boys’ club',
      'ceiling',
    ],
  },
  /* Renate first: return to work, parenting, workload, boundaries. */
  return: {
    feelings: ['starting-over', 'in-between'],
    destinations: ['Something of my own'],
    keywords: [
      'return',
      'returning',
      'back to work',
      'going back',
      'coming back',
      'maternity',
      'parental leave',
      'kids',
      'children',
      'baby',
      'mom',
      'mum',
      'parenting',
      'workload',
      'hours',
      'overtime',
      'boundary',
      'boundaries',
    ],
  },
  /* Sabine first: burnout, identity, pressure, belonging. */
  burnout: {
    feelings: ['running-on-empty', 'not-myself', 'holding-together'],
    destinations: ['Out of this industry'],
    keywords: [
      'burnout',
      'burned out',
      'burnt out',
      'burning out',
      'exhausted',
      'tired',
      'drained',
      'identity',
      'disappearing',
      'pressure',
      'perfect',
      'belong',
      'belonging',
      'lonely',
    ],
  },
  /* Annemarie first: manager, confidence, capability, self-advocacy. */
  confidence: {
    feelings: ['quietly-panicking', 'done-pretending'],
    destinations: ['Same job, different me'],
    keywords: [
      'manager',
      'boss',
      'confidence',
      'confident',
      'capable',
      'not good enough',
      'imposter',
      'impostor',
      'doubt',
      'self-doubt',
      'speak up',
      'push back',
      'take up space',
    ],
  },
};

/** The ordered top three for each scenario, with the reason shown on each card. */
export const DEMO_MATCH_RESPONSES: Record<DemoScenarioId, MatchResponse> = {
  visibility: {
    results: [
      {
        profileId: 'mara',
        reason:
          'She made the same transition: promoted for being excellent at delivery, then learning to make her work visible, find sponsors, and build a case for the next role.',
      },
      {
        profileId: 'petra',
        reason:
          'Her story is about putting herself forward after years of proving herself, and staying in the conversation when the room gets uncomfortable.',
      },
      {
        profileId: 'annemarie',
        reason:
          'She knows the self-advocacy work beneath a visibility problem: taking up space before someone else decides your work is smaller than it is.',
      },
    ],
  },
  leadership: {
    results: [
      {
        profileId: 'petra',
        reason:
          'If you’re weighing whether to go for more, her story is about asking for the bigger role and how people reacted.',
      },
      {
        profileId: 'annemarie',
        reason:
          'Her story is about being told she isn’t enough, the voice that often shows up when you aim higher.',
      },
      {
        profileId: 'renate',
        reason:
          'Her story is about fighting for her place at work, then asking whether it’s the right place.',
      },
    ],
  },
  return: {
    results: [
      {
        profileId: 'renate',
        reason:
          'If you’re thinking about coming back, her story starts right after she fought her way back to work.',
      },
      {
        profileId: 'sabine',
        reason:
          'Her story is about doing everything right and still feeling stretched thin, at home and at work.',
      },
      {
        profileId: 'petra',
        reason: 'Her story is about putting her hand up at work after years of proving herself.',
      },
    ],
  },
  burnout: {
    results: [
      {
        profileId: 'sabine',
        reason:
          'If work has been wearing you down, her story is about doing everything right and still feeling like she’s disappearing.',
      },
      {
        profileId: 'renate',
        reason: 'Her story is about long days spent on work that doesn’t feel like hers.',
      },
      {
        profileId: 'annemarie',
        reason: 'Her story is about slowly starting to believe the doubts other people put on her.',
      },
    ],
  },
  confidence: {
    results: [
      {
        profileId: 'annemarie',
        reason:
          'If someone at work has made you doubt yourself, her story is about a manager who did that to her.',
      },
      {
        profileId: 'petra',
        reason:
          'Her story is about speaking up for herself at work, even when the room went quiet.',
      },
      {
        profileId: 'sabine',
        reason: 'Her story is about holding herself to every standard at once.',
      },
    ],
  },
  /* Sparse or skipped answers. */
  default: {
    results: [
      {
        profileId: 'sabine',
        reason:
          'Her story starts where many women here start: doing everything right and still feeling lost.',
      },
      {
        profileId: 'petra',
        reason: 'Her story is about wanting more at work and saying so out loud.',
      },
      {
        profileId: 'renate',
        reason: 'Her story is about getting her career back, then asking what it’s for.',
      },
    ],
  },
};
