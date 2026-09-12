/**
 * All mock content for Momentum lives here so copy can be changed in one place.
 * Nothing in this file talks to a network — see lib/api.ts for the async layer.
 */

/* ---------------------------------------------------------------- step 1 */

export interface FeelingOption {
  id: string;
  label: string;
  /** "Something else" reveals a free-text input. */
  revealsInput?: boolean;
}

export const MAX_FEELINGS = 2;

export const FEELING_OPTIONS: FeelingOption[] = [
  { id: 'lost', label: 'Lost' },
  { id: 'stuck', label: 'Stuck' },
  { id: 'unsure', label: 'Unsure' },
  { id: 'overlooked', label: 'Overlooked' },
  { id: 'anxious', label: 'Anxious' },
  { id: 'restless', label: 'Restless' },
  { id: 'burned-out', label: 'Burned out' },
  { id: 'ready-but-scared', label: 'Ready but scared' },
  { id: 'something-else', label: 'Something else', revealsInput: true },
];

/* ---------------------------------------------------------------- step 2 */

export type LifeAreaId = 'professional' | 'personal' | 'both';

export interface LifeAreaOption {
  id: LifeAreaId;
  title: string;
  subtitle: string;
}

export const LIFE_AREA_OPTIONS: LifeAreaOption[] = [
  {
    id: 'professional',
    title: 'Professional',
    subtitle: 'Work, title, money, the room you are not in yet.',
  },
  {
    id: 'personal',
    title: 'Personal',
    subtitle: 'Home, health, care, who you are outside a job.',
  },
  {
    id: 'both',
    title: 'A bit of both',
    subtitle: 'One is quietly pulling on the other.',
  },
];

/* ---------------------------------------------------------------- step 3 */

/** Fake "parsed CV" summary chips shown after the professional context step. */
export const PARSED_CONTEXT_CHIPS: string[] = [
  'Marketing',
  '8 years',
  'Team lead',
  'Career break 3 years',
  'Manages 6 people',
  'No P&L yet',
];

/* ---------------------------------------------------------------- step 4 */

export interface DeepeningQuestion {
  id: string;
  headline: string;
  /** Shown under the mic while idle. */
  hint: string;
  /** Placeholder transcript used by the mocked recorder. */
  mockTranscript: string;
}

export const DEEPENING_QUESTIONS: DeepeningQuestion[] = [
  {
    id: 'urgency',
    headline: 'What changed recently that made this feel urgent?',
    hint: 'One thing. The one you keep replaying.',
    mockTranscript:
      'They restructured the team in March and gave the lead role to someone I trained. I said congratulations, and then I sat in my car for twenty minutes before driving home.',
  },
  {
    id: 'tried',
    headline: 'What have you already tried?',
    hint: 'Even the things that did not work.',
    mockTranscript:
      'I rewrote my CV, applied to eleven roles, finished a course on strategic leadership. I asked two senior people for coffee. One answered, and it was lovely and it went nowhere.',
  },
  {
    id: 'unsaid',
    headline: "What is the part you can't say out loud at work?",
    hint: 'No one here knows your name.',
    mockTranscript:
      'That I am tired of being the reliable one. That I want the thing they keep handing to people who are louder than me, and I am angry that I have to want it quietly.',
  },
];

/* ---------------------------------------------------------------- step 5 */

export interface MomentCardData {
  quote: string;
  whereYouAre: string;
  inTheWay: string[];
  whatYouBring: string[];
}

/** The moment card the fake model "hears" from the answers above. */
export const MOMENT_CARD_DRAFT: MomentCardData = {
  quote: 'I keep being the person who trains the people who get promoted.',
  whereYouAre: 'Eleven years in, one step behind where you thought you would be.',
  inTheWay: [
    'Read as reliable, not ready',
    'No one senior in your corner',
    'Waiting to be offered it',
  ],
  whatYouBring: ['You build people', 'Eleven years of memory', 'You stay when it is hard'],
};

/* ---------------------------------------------------------------- step 6 */

export const DESTINATION_PLACEHOLDER = 'In a year from now, I want to...';

export const DESTINATION_SUGGESTIONS: string[] = [
  'Back into leadership',
  'Out of my industry',
  'Start something of my own',
  'Same job, different me',
];

/* ---------------------------------------------------------------- step 7 */

export const MATCHING_LINES: string[] = [
  'Reading your moment.',
  'Looking for women who have been here.',
  'Found three.',
];

/* ---------------------------------------------------------------- step 8 */

export interface Mentor {
  id: string;
  firstName: string;
  age: number;
  /** Internal label for her lived transition. Never shown as a company. */
  transition: string;
  quote: string;
  whyHer: [string, string];
  availability: string;
}

export const MENTORS: Mentor[] = [
  {
    id: 'adaeze',
    firstName: 'Adaeze',
    age: 41,
    transition: 'Returned to leadership after parental leave',
    quote:
      'I came back from leave on four days a week and everyone treated it as a demotion I had chosen for myself. It took two years and one very direct conversation to get the room back.',
    whyHer: [
      'She also trained the person who was promoted over her, and asked for the role out loud the next time.',
      'She rebuilt a leadership case after time away, which is the gap you are carrying into the conversation.',
    ],
    availability: 'Has 30 minutes this week',
  },
  {
    id: 'marta',
    firstName: 'Marta',
    age: 44,
    transition: 'Changed industry at 42',
    quote:
      'At forty-two I stopped explaining my CV and started explaining what I could actually do. The first three people said no. The fourth one asked me to start in a month.',
    whyHer: [
      'She left an industry that had stopped promoting her, without starting over at the bottom.',
      'She knows the eleven-applications silence you described, and what finally broke it for her.',
    ],
    availability: 'Has 30 minutes this week',
  },
  {
    id: 'priya',
    firstName: 'Priya',
    age: 38,
    transition: 'Left corporate to found a company',
    quote:
      'I was the safest pair of hands on the floor, which is a beautiful way of saying nobody imagined me in charge. So I went and put myself in charge.',
    whyHer: [
      'She was the reliable one too, and used that reputation as leverage instead of waiting for it to be noticed.',
      'She can tell you honestly whether you want your own thing, or you want the role you were owed.',
    ],
    availability: 'Has 30 minutes this week',
  },
];

/* --------------------------------------------------- anonymized handover */

export interface AnonymizedCard {
  label: string;
  quote: string;
  herChallenge: string;
  whatSheNeeds: string;
  whatSheBrings: string;
}

export const ANONYMIZED_PREVIEW: AnonymizedCard = {
  label: 'MEET HER CHALLENGE',
  quote: MOMENT_CARD_DRAFT.quote,
  herChallenge: 'Passed over for a lead role she had already been doing, twice.',
  whatSheNeeds: 'One honest read on whether to ask again or leave.',
  whatSheBrings: 'Eleven years of memory and a team that follows her.',
};

export const CONFIRM_SHEET_LINE = 'She will see your challenge, not your name.';

export const SENT_HEADLINE = "She'll get back to you today.";

/* ------------------------------------------------------------ /mentor */

export interface MentorChallenge extends AnonymizedCard {
  id: string;
  whyYou: string;
  timeAsk: string;
}

export const MENTOR_CHALLENGE: MentorChallenge = {
  id: 'challenge-1',
  label: 'MEET HER CHALLENGE',
  quote: MOMENT_CARD_DRAFT.quote,
  herChallenge: 'Passed over for a lead role she had already been doing, twice.',
  whatSheNeeds: 'One honest read on whether to ask again or leave.',
  whatSheBrings: 'Eleven years of memory and a team that follows her.',
  whyYou: 'You waited to be offered it once, and then you stopped waiting.',
  timeAsk: 'She asked for 30 minutes this week.',
};

export const MENTOR_REPLY_PROMPT = 'Say hello. 30 seconds is enough.';

export const MENTOR_REPLY_SECONDS = 30;

export const MENTOR_REPLY_MOCK_TRANSCRIPT =
  'Hi. I read your card twice, because the first line was mine four years ago. Here is what I wish someone had told me before I walked into that meeting.';

export const MENTOR_SENT_LINE = "She'll hear this in a few minutes.";
