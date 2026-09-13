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
  { id: 'doing-well-stuck', label: 'Doing well, but stuck', group: 'uncertain' },
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

/**
 * Inserted by the demo mic on location, origin and destination. Matches Aura's
 * CV in test-fixtures/cvs/aura-the-plateau-cv.pdf. No audio is recorded.
 */
export const PROFILE_MOCK_TRANSCRIPTS: Record<string, string> = {
  location: 'Hamburg, Germany',
  origin: 'German',
  destination:
    'In a year from now, I want to be on a real path to Director, with leadership seeing the strategic value of what my team delivers, not just a calm operations person keeping things running.',
};

/** Posted in the chat thread when she skips a profile detail. */
export const PROFILE_DETAIL_SKIPPED = 'Skipped';

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
      "Honestly? I watched someone five years younger than me get the Director role I thought was mine. And I didn't even fight for it — I just... accepted it, the way I always do. I told myself I was being professional. But driving home that day, I realized I've been doing that for years. Just absorbing things instead of asking for what I want. I think I signed up because I'm tired of finding out later how I actually feel.",
    mockFollowUp:
      "On paper everything is fine. My site hits its targets and my reviews are good. That's what makes it so hard to say out loud that something is wrong.",
  },
  {
    id: 'ask-anyone',
    headline:
      'If you could get advice from anyone in your field, what would you actually ask them?',
    hint: 'The real question, not the polite one.',
    mockTranscript:
      "I wouldn't ask them how to do the job better — I've run a 240-person site for six years, I know how to do the job. I'd ask them how they got people above them to actually notice. Like, did you ask for it? Did you just get lucky? Because I don't even know if that's a skill you can learn at 40, or if I missed the window.",
    mockFollowUp:
      'I never went to university. I did my Ausbildung, started as a logistics coordinator, and got promoted fast because I fixed things. Nobody ever taught me how to make a case for myself upward.',
  },
  {
    id: 'proud-moment',
    headline: 'What’s a moment in your career you’re proud of, but maybe don’t talk about much?',
    hint: 'It doesn’t have to be a big one.',
    mockTranscript:
      "There was a stretch during the labour shortages, a couple of years ago, when a new distribution centre opened nearby and we lost almost a third of our floor staff in a few weeks. Everyone assumed we'd miss dispatches for our clients — even I assumed that. But I rebuilt the whole shift structure and cross-trained people across functions in about a week, and we didn't miss a single one. Nobody outside my team really knows how close it was. I never told anyone above me, because it felt like just... doing my job. But looking back, I think that was the best work I've ever done.",
    mockFollowUp:
      'Same with the warehouse move in 2021 and the ERP migration. Leadership remembers them as things that went smoothly, not as things I made go smoothly. They see a calm operations person, not someone to sponsor into a bigger role.',
  },
  {
    id: 'five-years-ago',
    headline: 'What do you wish someone had told you five years ago?',
    hint: 'Whatever comes to mind first.',
    mockTranscript:
      "That being good at your job isn't the same as being seen for it. I really believed if I just kept delivering, someone would eventually notice and hand me the next step. Nobody tells you that you're supposed to ask. I wish someone had just said it plainly: it's not enough to do the work quietly — you have to say what you did, out loud, to the right people. I spent five years not knowing that was even a gap.",
    mockFollowUp:
      "The funny thing is, at my last job I built the KPI dashboard that let leadership see the site's numbers every day. I never once thought about whether they could see me. I still want a Director role; I just don't know how to tell the story of what I've done.",
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
  quote:
    "I've hit a ceiling that has nothing to do with my competence and everything to do with visibility — I don't know how to advocate for myself to leadership, and I've never had to before.",
  whereYouAre: 'Six years as a Senior Operations Manager, and plateaued',
  inTheWay: ['Visibility', 'Self-advocacy', 'Strategic narrative'],
  whatYouBring: ['14 years in operations', 'Calm through disruption', 'A team that stayed'],
};

/* ---------------------------------------------------------------- step 5 */

export const DESTINATION_PLACEHOLDER = 'In a year from now, I want to…';

export const DESTINATION_SUGGESTIONS: string[] = [
  'Make my work visible to leadership',
  'Back into leadership, on my terms',
  'Out of this industry',
  'Something of my own',
  'Same job, different me',
  "I don't know",
];

/* ---------------------------------------------------------------- matching */

export const MATCHING_LINES: string[] = [
  'Reading your moment.',
  'Looking for women who have been here.',
  'Found three.',
];

/* ---------------------------------------------------------------- step 6 */

export type SampleProfileId = 'mara' | 'petra' | 'renate' | 'sabine' | 'annemarie';

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
    id: 'mara',
    firstName: 'Mara',
    age: 47,
    title: 'The Visibility Shift',
    story:
      'I was promoted quickly because I was the person who could fix things. Then I hit the point where strong work stayed invisible, and had to learn how to turn it into a strategic story, find sponsors, and ask for the room I wanted.',
    themes: ['visibility', 'sponsorship', 'self-advocacy', 'strategic narrative', 'advancement'],
  },
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
  'I have run operations at ',
  { original: 'Nordfracht', safe: 'my company' },
  ' for six years, through ',
  { original: 'the 2021 warehouse relocation', safe: 'a site move' },
  ' and a systems migration, with ',
  { original: '240 people', safe: 'a large team' },
  ' depending on it. Someone five years younger got the Director role I thought was mine, and I still don’t know how to make my work visible to leadership.',
];

/* ------------------------------------------------------- one step ahead */

/** The one woman shown after sending: someone a little further behind. */
export const HELP_REQUEST = {
  quote:
    "We're moving the warehouse while a new system is rolling out, and I feel like I'm the only one who doesn't know what she's doing.",
  whatSheNeeds: 'Someone who has kept a team steady through operational change.',
};

export const HELP_ANSWER_PLACEHOLDER = 'What helped you, even a little?';

/** Inserted by the demo mic on "Tell her the one thing you know". No audio is recorded. */
export const HELP_ANSWER_MOCK_TRANSCRIPT =
  "When we moved sites, I stopped trying to have every answer myself. I asked the team what they needed first, kept one ten-minute check-in each morning, and said out loud when I didn't know yet. That was enough to keep everyone steady.";

/** A scripted first reply on the closing screen. Sample copy: no scheduling or availability. */
export const MENTOR_FIRST_REPLY = {
  delay: 'Sample reply',
  text: 'What you wrote sounded familiar. Start by writing down the three outcomes leadership should know you made possible. That is not boasting; it is the beginning of your strategic story.',
};

/** Who she is matched with on the last screen of the flow. */
export const MATCHED_MENTOR = {
  name: 'Michelle Obama',
  initials: 'MO',
  description: 'Lawyer, author of Becoming, and former First Lady of the United States.',
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
  quote:
    "We're moving the warehouse while a new system is rolling out, and I feel like I'm letting everyone down.",
  herChallenge:
    'Managing a team through a warehouse move, a systems migration, and a staffing gap.',
  whatSheNeeds: 'One honest conversation with someone who has led through operational chaos.',
  whatSheBrings: 'She is asking clear questions before the pressure turns into isolation.',
  whyYou:
    'You have navigated three simultaneous crises — a relocation, a systems migration, and prolonged staffing disruption — without losing your team. That is rare and teachable.',
  timeAsk: 'She asked for 30 minutes this week.',
};

export const MENTOR_REPLY_PROMPT = 'Say hello. 30 seconds is enough.';

export const MENTOR_REPLY_SECONDS = 30;

export const MENTOR_REPLY_MOCK_TRANSCRIPT =
  "Hi. I have been through the kind of changes you're carrying. You do not have to hold every answer alone; let’s work out what your team needs first.";

/* -------------------------------------- other screens (outside the mockup) */

export const MENTOR_TEXT_REPLY =
  "You don't know me, but what you wrote took me straight back to the point where I realised my work was not speaking for itself. Write down the three outcomes only you made possible, then decide what you want leadership to see next. You have more of a case than it feels like.";

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
    text: "Hi Aura. I'm really glad you accepted. Reading what you wrote took me straight back.",
  },
  {
    id: 'm2',
    from: 'mentor',
    text: 'I used to think strong delivery would speak for itself. Learning to name its strategic value changed what became possible.',
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
    name: 'Mara Keller',
    context: 'about making work visible to leadership',
    status: 'Talking Thursday, 12:30',
  },
  {
    name: 'Sofia Lang',
    context: 'about starting something of your own',
    status: 'New answer, unread',
  },
  {
    name: 'A woman three years behind you',
    context: 'about leading through operational change',
    status: 'You helped · she wrote back yesterday',
  },
  { name: 'Miriam Vogel', context: 'about changing industry', status: 'Quiet since March' },
] as const;
