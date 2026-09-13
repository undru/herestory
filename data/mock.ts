/**
 * All mock content for Momentum lives here so copy can be changed in one place.
 * Nothing in this file talks to a network — see lib/api.ts for the async layer.
 */

/* ---------------------------------------------------------------- welcome */

export const WELCOME_HEADLINE =
  'Somewhere out there is a woman who has already been where you are.';
export const WELCOME_SUBHEAD =
  'Find your professional network of women and help raise other women up.';

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

export const PROFILE_CONTEXT_HEADLINE = 'Let’s understand your world.';
export const PROFILE_CONTEXT_SUBHEAD =
  'Upload your CV or LinkedIn so we can match you with someone who’s actually walked your path.';
export const PROFILE_CONTEXT_TRUST =
  'This shapes your matches — it’s never shown publicly without your permission.';
export const LINKEDIN_COMING_SOON =
  'Connecting LinkedIn is coming soon. For now, upload your CV or skip for now.';
export const CV_PICK_FAILED = 'We couldn’t open your files. Try again, or skip for now.';

/** CV formats the picker accepts: PDF, DOC, DOCX and plain text. */
export const CV_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];

export const LOCATION_HEADLINE = 'Where are you based?';
export const LOCATION_SUBHEAD =
  'This helps us connect you with women in similar time zones and markets.';
export const LOCATION_PLACEHOLDER = 'e.g. Berlin, Germany';

export const ORIGIN_HEADLINE = 'Where are you from, originally?';
export const ORIGIN_SUBHEAD =
  'Shared background often means shared context — we’ll use this to find common ground, not to categorize you.';
export const ORIGIN_PLACEHOLDER = 'e.g. Accra, Ghana or Ghanaian';

export const LANGUAGES_HEADLINE = 'What languages do you speak?';
export const LANGUAGES_SUBHEAD =
  'So conversations can happen in whatever language feels most natural.';

/** Starting language chips, alphabetised. "Other" adds anything not listed. */
export const LANGUAGE_OPTIONS = [
  'Arabic',
  'Bengali',
  'Dutch',
  'English',
  'French',
  'German',
  'Hindi',
  'Italian',
  'Japanese',
  'Korean',
  'Mandarin Chinese',
  'Polish',
  'Portuguese',
  'Russian',
  'Spanish',
  'Swahili',
  'Turkish',
  'Ukrainian',
];

/* ---------------------------------------------------------------- step 3 */

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

/* ---------------------------------------------------------------- step 4 */

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

/* ---------------------------------------------------------------- step 5 */

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

/* ---------------------------------------------------------------- step 6 */

export type SampleProfileId = 'petra' | 'renate' | 'sabine' | 'annemarie';

/** A sample profile for the demo. Not a real person, and never shown as available. */
export interface SampleProfile {
  id: SampleProfileId;
  firstName: string;
  age: number;
  /** A short title for her story. Never a company or job title. */
  title: string;
  story: string;
  /** Broad themes for future matching. Never shown. */
  themes: string[];
}

export const SAMPLE_PROFILES: SampleProfile[] = [
  {
    id: 'petra',
    firstName: 'Petra',
    age: 38,
    title: 'The Ceiling',
    story:
      'After 15 years proving myself in a boys’ club, I finally put my hand up for the leadership role — and watched my mentor go cold and my colleagues go silent, like I’d asked for too much.',
    themes: ['leadership', 'advancement', 'workplace bias', 'visibility', 'self-advocacy'],
  },
  {
    id: 'renate',
    firstName: 'Renate',
    age: 44,
    title: 'The Return',
    story:
      'I fought to get my career back after having kids, and now I’m burning 12 hours a day on work that isn’t mine — wondering if this is really what I came back for.',
    themes: ['return to work', 'parenting', 'burnout', 'boundaries', 'workload'],
  },
  {
    id: 'sabine',
    firstName: 'Sabine',
    age: 34,
    title: 'The Checklist',
    story:
      'Good grades, good job, good mom, good home — I did everything right, so why does it feel like I’m disappearing or burning out?',
    themes: ['burnout', 'identity', 'parenting', 'work-life pressure', 'belonging'],
  },
  {
    id: 'annemarie',
    firstName: 'Annemarie',
    age: 29,
    title: 'The Shrinking',
    story:
      'My manager tells me I’m not capable and not doing enough, and I was raised to never take up space — so instead of pushing back, I’ve started to believe him.',
    themes: [
      'confidence',
      'manager relationship',
      'self-advocacy',
      'visibility',
      'workplace pressure',
    ],
  },
];

/** A sample profile as matched for her, with the reason from the match response. */
export interface ProfileMatch extends SampleProfile {
  reason: string;
}

export const MATCHES_DEMO_NOTE = 'These are sample profiles for this demo.';

/* ------------------------------------------------------ profile & history */

export const PROFILE_HISTORY_TITLE = 'Profile & history';
export const PROFILE_PRIVACY_NOTE = 'Private to you — never shown on your public profile.';
export const PROFILE_NOT_ADDED = 'Not added yet';
export const PROFILE_HISTORY_EMPTY =
  'Your profile, conversations and matches will appear here after your first match.';

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

/** A scripted first reply on the closing screen. Sample copy: no scheduling or availability. */
export const MENTOR_FIRST_REPLY = {
  delay: 'Sample reply',
  text: 'What you wrote sounded familiar. Before anything else, write down what you actually want to ask for. The rest gets easier from there.',
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
