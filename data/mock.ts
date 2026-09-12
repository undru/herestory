/**
 * All mock content for Momentum lives here so copy can be changed in one place.
 * Nothing in this file talks to a network — see lib/api.ts for the async layer.
 */

/* ---------------------------------------------------------------- welcome */

export const WELCOME_HEADLINE =
  'Somewhere out there is a woman who has already been where you are.';
export const WELCOME_SUBHEAD =
  'Tell me where that is. It takes about two minutes, and nobody sees your name.';

/* ---------------------------------------------------------------- step 1 */

export const FEELING_HEADLINE = 'It starts with how you feel.';
export const FEELING_INTRO =
  'Before we talk careers, let’s talk about you — how does work feel right now?';
export const FEELING_HELPER = 'Choose up to 5 feelings';

export type FeelingGroupId = 'difficult' | 'uncertain' | 'curious' | 'positive';

export interface FeelingGroup {
  id: FeelingGroupId;
  label: string;
}

export interface FeelingOption {
  id: string;
  label: string;
  group: FeelingGroupId;
}

export const MAX_FEELINGS = 5;

/** Display order of the feeling groups. */
export const FEELING_GROUPS: FeelingGroup[] = [
  { id: 'difficult', label: 'Difficult / heavy' },
  { id: 'uncertain', label: 'Uncertain / in-between' },
  { id: 'curious', label: 'Curious / open' },
  { id: 'positive', label: 'Positive / forward-leaning' },
];

export const FEELING_OPTIONS: FeelingOption[] = [
  { id: 'not-myself', label: 'Not myself lately', group: 'difficult' },
  { id: 'holding-together', label: 'Holding it together', group: 'difficult' },
  { id: 'running-on-empty', label: 'Running on empty', group: 'difficult' },
  { id: 'quietly-panicking', label: 'Quietly panicking', group: 'difficult' },
  { id: 'done-pretending', label: 'Done pretending', group: 'difficult' },
  { id: 'figuring-it-out', label: 'Figuring it out', group: 'uncertain' },
  { id: 'in-between', label: 'Somewhere in between', group: 'uncertain' },
  { id: 'waiting-for-sign', label: 'Waiting for a sign', group: 'uncertain' },
  { id: 'starting-over', label: 'Starting over', group: 'uncertain' },
  { id: 'curious-next', label: 'Curious what’s next', group: 'curious' },
  { id: 'open-to-anything', label: 'Open to anything', group: 'curious' },
  { id: 'looking-for-spark', label: 'Looking for a spark', group: 'curious' },
  { id: 'excited-to-connect', label: 'Excited to connect', group: 'positive' },
  { id: 'ready-for-change', label: 'Ready for a change', group: 'positive' },
  { id: 'hopeful-again', label: 'Hopeful again', group: 'positive' },
];

/* ---------------------------------------------------------------- step 2 */

export type LifeAreaId = 'professional' | 'personal' | 'both';

export interface LifeAreaOption {
  id: LifeAreaId;
  title: string;
  subtitle: string;
}

export const LIFE_AREA_OPTIONS: LifeAreaOption[] = [
  { id: 'professional', title: 'Work', subtitle: 'Your career, your role, what comes next' },
  { id: 'personal', title: 'Life', subtitle: 'Health, family, the ground under you' },
  { id: 'both', title: 'Both, tangled together', subtitle: 'Usually the honest answer' },
];

/* ---------------------------------------------------------------- step 3 */

export const WORK_LIFE_PLACEHOLDER = 'Your role, how long, what you were known for';

/* ---------------------------------------------------------------- step 4 */

export interface DeepeningQuestion {
  id: string;
  headline: string;
  /** Shown under the mic while idle. */
  hint: string;
  /** Placeholder transcript used by the mocked recorder. */
  mockTranscript: string;
  /** Used by the mocked recorder when she adds to an answer she already gave. */
  mockFollowUp: string;
}

export const DEEPENING_QUESTIONS: DeepeningQuestion[] = [
  {
    id: 'why-now',
    headline: 'So tell me — what’s going on in your career right now that made you sign up today?',
    hint: 'Whatever tipped it, big or small.',
    mockTranscript:
      "My return date came through last week. Six weeks. And my old team got split in two while I was away, so I don't really know what I'm going back to.",
    mockFollowUp: 'And nobody has asked me what I actually want to come back to.',
  },
  {
    id: 'ask-anyone',
    headline:
      'If you could get advice from anyone in your field, what would you actually ask them?',
    hint: 'The real question, not the polite one.',
    mockTranscript:
      'How she walked back into a leadership role after years away without spending the first year apologising for it.',
    mockFollowUp: 'And whether she negotiated, or just took what she was offered.',
  },
  {
    id: 'proud-moment',
    headline: 'What’s a moment in your career you’re proud of, but maybe don’t talk about much?',
    hint: 'It doesn’t have to be a big one.',
    mockTranscript:
      'Right before my leave, I rebuilt a team that was about to be shut down. It happened so close to leaving that I never really mention it.',
    mockFollowUp: 'Somewhere along the way it started to feel like it belonged to someone else.',
  },
  {
    id: 'five-years-ago',
    headline: 'What do you wish someone had told you five years ago?',
    hint: 'Whatever comes to mind first.',
    mockTranscript: "That I didn't have to earn my place back by saying yes to everything.",
    mockFollowUp: "And that it's fine to want something different from what I wanted before.",
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
  quote: 'I want to go back to work without going back to the woman I was.',
  whereYouAre: 'Returning to leadership after three years away',
  inTheWay: ['Confidence', 'Negotiation', 'Who you are now'],
  whatYouBring: ['Curiosity', 'Resilience', 'Eight years of it'],
};

/* ---------------------------------------------------------------- step 6 */

export const DESTINATION_PLACEHOLDER = 'In a year from now, I want to…';

export const DESTINATION_SUGGESTIONS: string[] = [
  'Back into leadership, on my terms',
  'Out of this industry',
  'Something of my own',
  'Same job, different me',
];

/* ---------------------------------------------------------------- matching */

export const MATCHING_LINES: string[] = [
  'Reading your moment.',
  'Looking for women who have been here.',
  'Found three.',
];

/* ---------------------------------------------------------------- step 7 */

export interface Mentor {
  id: string;
  firstName: string;
  age: number;
  /** One line about her lived transition. Never a company or job title. */
  transition: string;
  quote: string;
  whyHer: string;
  availability: string;
}

export const MENTORS: Mentor[] = [
  {
    id: 'katrin',
    firstName: 'Katrin',
    age: 48,
    transition: 'Back to leadership after two kids',
    quote: 'I rebuilt my career after two kids, and I did not go back to who I was.',
    whyHer: 'She re-entered leadership after a three-year break, and negotiated the title back.',
    availability: 'Has 30 minutes this week',
  },
  {
    id: 'miriam',
    firstName: 'Miriam',
    age: 52,
    transition: 'Changed industry at 42',
    quote:
      'At forty-two I stopped explaining my CV and started explaining what I could actually do.',
    whyHer:
      'She came back from a long break into a different field, without starting over at the bottom.',
    availability: 'Has 30 minutes next week',
  },
  {
    id: 'sofia',
    firstName: 'Sofia',
    age: 44,
    transition: 'Left corporate, started her own thing',
    quote: 'I was the safest pair of hands on the floor, so I went and put myself in charge.',
    whyHer:
      'She asked herself whether she wanted the old job back or something of her own, and can tell you what she found.',
    availability: 'Has 30 minutes this week',
  },
];

/* ------------------------------------------------------------ before it goes */

export interface RedactedDetail {
  original: string;
  safe: string;
}

export type RedactionPart = string | RedactedDetail;

/** What she wrote, split so each identifying detail can be swapped out or put back. */
export const REDACTION_PARTS: RedactionPart[] = [
  'I go back to ',
  { original: 'Otto', safe: 'my employer' },
  ' in six weeks, to the ',
  { original: 'forty-person team', safe: 'large team' },
  ' I used to run, and ',
  { original: 'Stefan', safe: 'my manager' },
  ' already gave half of it to someone else.',
];

/* ------------------------------------------------------- one step ahead */

/** The one woman shown after sending: someone a little further behind. */
export const HELP_REQUEST = {
  quote: "I go back in six weeks and I've told nobody I'm terrified.",
  whatSheNeeds: 'Someone one step ahead, not ten.',
};

export const HELP_ANSWER_PLACEHOLDER = 'What helped you, even a little?';

export const MENTOR_FIRST_REPLY = {
  delay: '2 hours later',
  text: "Six weeks is enough time. Call me Thursday and we'll write down what you're actually asking for.",
};

/* ------------------------------------------------------------ /mentor */

export interface AnonymizedCard {
  label: string;
  quote: string;
  herChallenge: string;
  whatSheNeeds: string;
  whatSheBrings: string;
}

export interface MentorChallenge extends AnonymizedCard {
  id: string;
  whyYou: string;
  timeAsk: string;
}

export const MENTOR_CHALLENGE: MentorChallenge = {
  id: 'challenge-1',
  label: 'Her challenge, not her name',
  quote: MOMENT_CARD_DRAFT.quote,
  herChallenge: 'Going back to leadership after three years away, and half her old team is gone.',
  whatSheNeeds: 'One honest conversation before her first day back.',
  whatSheBrings: 'Eight years of leading people, and a clearer idea of who she is now.',
  whyYou: 'You came back after a long break once, and asked for the role out loud.',
  timeAsk: 'She asked for 30 minutes this week.',
};

export const MENTOR_REPLY_PROMPT = 'Say hello. 30 seconds is enough.';

export const MENTOR_REPLY_SECONDS = 30;

export const MENTOR_REPLY_MOCK_TRANSCRIPT =
  'Hi. I read your card twice, because the first line was mine four years ago. Here is what I wish someone had told me before I walked into that meeting.';

/* -------------------------------------- other screens (outside the mockup) */

export const MENTOR_TEXT_REPLY =
  "You don't know me, but what you wrote took me straight back to my own first week. Six weeks is more time than it feels like. Write down the version of the job you'd actually say yes to before you talk to anyone. You've got this more than you think.";

export const AVAILABILITY_SLOTS = [
  'Thursday, 12:30 · 30 min',
  'Thursday, 20:00 · 30 min',
  'Saturday, 09:00 · 30 min',
] as const;

export interface ConversationMessage {
  id: string;
  from: 'mentor' | 'mentee';
  text: string;
}

export const CONVERSATION_MESSAGES: ConversationMessage[] = [
  {
    id: 'm1',
    from: 'mentor',
    text: "Hi Lena. I'm really glad you accepted. Reading what you wrote took me straight back.",
  },
  {
    id: 'm2',
    from: 'mentor',
    text: "I sat in the car outside the office on my first day back and couldn't make myself go in. Nobody tells you about that bit.",
  },
  {
    id: 'm3',
    from: 'mentee',
    text: "Thank you for writing to me. I've read your message about four times.",
  },
  {
    id: 'm4',
    from: 'mentor',
    text: "Bring the messy version on Thursday. That's the useful one.",
  },
];

export const PEOPLE = [
  {
    name: 'Katrin Weber',
    context: 'about going back after leave',
    status: 'Talking Thursday, 12:30',
  },
  {
    name: 'Sofia Lang',
    context: 'about starting something of your own',
    status: 'New answer, unread',
  },
  {
    name: 'A woman six weeks behind you',
    context: 'about her first week back',
    status: 'You helped · she wrote back yesterday',
  },
  { name: 'Miriam Vogel', context: 'about changing industry', status: 'Quiet since March' },
] as const;
