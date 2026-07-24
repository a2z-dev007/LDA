export interface ThisOrThatQuestion {
  id: string;
  category: string;
  prompt: string;
  options: {
    text: string;
    emoji: string;
    subtext: string;
  }[];
  coupleCard: string;
}

export interface IntentionSet {
  word: string;
  intro: string;
  questions: ThisOrThatQuestion[];
}

export const thisOrThatSets: Record<string, IntentionSet> = {
  Patient: {
    word: 'Patient',
    intro: '"You chose patience today. These 3 rounds are about how you and your partner give each other space — and whether they\'d say the same."',
    questions: [
      {
        id: 'patient_1',
        category: 'When I\'m waiting...',
        prompt: '"When I\'m waiting for my partner to come around on something important to me…"',
        options: [
          { text: 'I give it time without saying more', emoji: '🌊', subtext: 'If it matters, they\'ll get there' },
          { text: 'I say it one more time clearly', emoji: '🗣️', subtext: 'I need to know they heard me' },
        ],
        coupleCard: '"You wait in silence. They wait by speaking. Both of you are being patient — just differently."',
      },
      {
        id: 'patient_2',
        category: 'Taking longer to process...',
        prompt: '"When my partner is taking longer to process something emotionally…"',
        options: [
          { text: 'I give them space', emoji: '🤫', subtext: 'Hovering makes it worse' },
          { text: 'I check in gently', emoji: '🫂', subtext: 'I\'d rather interrupt than leave them alone' },
        ],
        coupleCard: '"You give space. They come closer. Between you — no one is ever really alone."',
      },
      {
        id: 'patient_3',
        category: 'Slow, quiet patch...',
        prompt: '"When things between us are going through a slow, quiet patch…"',
        options: [
          { text: 'I trust it', emoji: '🌱', subtext: 'Every relationship has seasons' },
          { text: 'I name it', emoji: '💬', subtext: 'Silence that isn\'t named feels like distance' },
        ],
        coupleCard: '"You trust the quiet. They can\'t rest until it\'s named. You\'ve been okay all along — you just needed different proof."',
      },
    ],
  },
  Present: {
    word: 'Present',
    intro: '"You chose presence today. These 3 rounds are about what \'being there\' actually means to you — and whether your partner would say the same thing."',
    questions: [
      {
        id: 'present_1',
        category: 'Phones at home...',
        prompt: '"On a weeknight at home together, phones should be…"',
        options: [
          { text: 'In another room', emoji: '📵', subtext: 'This time belongs to us' },
          { text: 'Around, but I\'m with you', emoji: '📲', subtext: 'Trust, not rules' },
        ],
        coupleCard: '"You need the phone gone. They just need you looking at them. You want the same thing — you just set different rules for it."',
      },
      {
        id: 'present_2',
        category: 'Feeling close...',
        prompt: '"The kind of time together that makes me feel genuinely close…"',
        options: [
          { text: 'Doing nothing together', emoji: '🛋️', subtext: 'Parallel presence. No plan needed.' },
          { text: 'Doing something together', emoji: '🚶', subtext: 'I feel closest when we\'re moving in the same direction' },
        ],
        coupleCard: '"You feel close by being still together. They feel close by doing something together. Both of you are saying — I just want us."',
      },
      {
        id: 'present_3',
        category: 'Mentally somewhere else...',
        prompt: '"When I\'m physically with my partner but mentally somewhere else…"',
        options: [
          { text: 'Don\'t call it out', emoji: '🙏', subtext: 'I know. I\'m trying. I just need a minute.' },
          { text: 'Gently bring me back', emoji: '👋', subtext: 'I\'d rather be caught than drift further away' },
        ],
        coupleCard: '"You want space to come back on your own. They want a gentle pull. Either way — you both want to be together."',
      },
    ],
  },
  Honest: {
    word: 'Honest',
    intro: '"You chose honesty today. These 3 rounds are about how you and your partner tell the hard truth — and whether you\'d do it the same way."',
    questions: [
      {
        id: 'honest_1',
        category: 'Genuinely hurt...',
        prompt: '"When something my partner did genuinely hurt me and I haven\'t said it yet…"',
        options: [
          { text: 'I\'ll bring it up later', emoji: '⏳', subtext: 'Timing is part of honesty' },
          { text: 'I say it the same day', emoji: '💬', subtext: 'Sitting on it makes it heavier' },
        ],
        coupleCard: '"You wait for the right moment. They\'d have already started the conversation. You\'re both trying to protect the same thing."',
      },
      {
        id: 'honest_2',
        category: '"Are you okay?"...',
        prompt: '"When my partner asks \'are you okay?\' and I genuinely am not…"',
        options: [
          { text: 'I say I\'m fine for now', emoji: '🙂', subtext: 'I can\'t be honest until I figure it out' },
          { text: '"Not really"', emoji: '🤍', subtext: 'They deserve to know, even without words' },
        ],
        coupleCard: '"You protect them from the messy version. They trust them with the messy version. Both of you love carefully."',
      },
      {
        id: 'honest_3',
        category: 'Hardest to be honest...',
        prompt: '"The thing I find genuinely hardest to be honest with my partner about…"',
        options: [
          { text: 'What I actually need', emoji: '🫀', subtext: 'My needs feel like a burden sometimes' },
          { text: 'Things that bother me', emoji: '😶', subtext: 'I keep choosing peace over truth' },
        ],
        coupleCard: '"You\'re both holding something back. The fact that you both answered the same thing? That\'s where to start."',
      },
    ],
  },
  Warm: {
    word: 'Warm',
    intro: '"You chose warmth today. These 3 rounds are about how love shows up in the small moments — and whether your partner would recognise themselves in your answers."',
    questions: [
      {
        id: 'warm_1',
        category: 'Showing warmth...',
        prompt: '"The way I naturally show warmth to my partner on a regular day…"',
        options: [
          { text: 'Small touches', emoji: '🤏', subtext: 'My hands say it before my mouth does' },
          { text: 'Words of affirmation', emoji: '🗣️', subtext: 'If I feel it, I want them to hear it' },
        ],
        coupleCard: '"You reach. They say. Both of you are giving love — the other person just has to notice which language it comes in."',
      },
      {
        id: 'warm_2',
        category: 'On a hard day...',
        prompt: '"When my partner is having a hard day, the warmth they need from me is probably…"',
        options: [
          { text: 'Just be near', emoji: '☕', subtext: 'Presence is the warmth' },
          { text: 'Help them do things', emoji: '🛠️', subtext: 'Love is showing up and actually doing something' },
        ],
        coupleCard: '"You offer presence. They offer action. What you both want is to feel less alone — and you give that to each other in completely different ways."',
      },
      {
        id: 'warm_3',
        category: 'Feeling most loved...',
        prompt: '"I feel most loved when my partner…"',
        options: [
          { text: 'Remembers small things', emoji: '🧠', subtext: '"You mentioned this once…" That\'s it for me.' },
          { text: 'Small public touches', emoji: '🤗', subtext: 'The "you\'re mine and I\'m not hiding it" kind' },
        ],
        coupleCard: '"You want to be remembered. They want to be held. You\'ve been giving each other exactly what you need — even if you didn\'t know the other one needed it too."',
      },
    ],
  },
  Playful: {
    word: 'Playful',
    intro: '"You chose playful today. These 3 rounds are about how you two have fun — and whether your partner\'s version of fun looks like yours."',
    questions: [
      {
        id: 'playful_1',
        category: 'Version I miss most...',
        prompt: '"The version of us I miss most is…"',
        options: [
          { text: 'Laughing at nothing', emoji: '😂', subtext: 'When everything was funnier together' },
          { text: 'Everything felt like adventure', emoji: '🗺️', subtext: 'When we were still surprising each other' },
        ],
        coupleCard: '"You miss the laughs. They miss the adventures. What you both miss is the version of yourselves when you weren\'t so busy."',
      },
      {
        id: 'playful_2',
        category: 'Breaking tension...',
        prompt: '"The best way to break a tense moment between us is…"',
        options: [
          { text: 'Something ridiculous', emoji: '🤡', subtext: 'Humour has saved us more than honesty' },
          { text: 'Calling it out', emoji: '🕊️', subtext: 'Name the tension, then let it go' },
        ],
        coupleCard: '"You use laughter as repair. They use words. Somehow — it always works."',
      },
      {
        id: 'playful_3',
        category: 'Keeping it fun...',
        prompt: '"Keeping a long relationship fun means…"',
        options: [
          { text: 'Protecting in-jokes', emoji: '🧩', subtext: 'We have a whole world that belongs to only us' },
          { text: 'Still trying new things', emoji: '🎢', subtext: 'Fun has to be chosen, not assumed' },
        ],
        coupleCard: '"You protect what\'s already ours. They keep adding to it. That\'s how the inside jokes survive the years."',
      },
    ],
  },
  Open: {
    word: 'Open',
    intro: '"You chose openness today. These 3 rounds are about the walls we keep up — and whether our partners see the same ones."',
    questions: [
      {
        id: 'open_1',
        category: 'Hardest to show...',
        prompt: '"The part of me I find hardest to show my partner…"',
        options: [
          { text: 'My real fears', emoji: '😨', subtext: 'I don\'t want to feel small in front of them' },
          { text: 'What I actually need', emoji: '🙋', subtext: 'My needs feel like a burden sometimes' },
        ],
        coupleCard: '"You hide your fears. They hide their needs. You\'ve both been protecting each other from exactly what you both need to hear."',
      },
      {
        id: 'open_2',
        category: 'Opening up...',
        prompt: '"When my partner opens up about something vulnerable, I…"',
        options: [
          { text: 'Hold the space', emoji: '👂', subtext: 'The most important thing is quiet attention' },
          { text: 'Share something back', emoji: '🔄', subtext: 'Vulnerability should go both ways' },
        ],
        coupleCard: '"You hold the space. They fill it with more. Together you\'ve built a place where both of you are safe."',
      },
      {
        id: 'open_3',
        category: 'Being truly open...',
        prompt: '"Being truly open in our relationship means letting them see me…"',
        options: [
          { text: 'On the days I\'m not okay', emoji: '😔', subtext: 'Not performing okayness when falling apart' },
          { text: 'Telling them everything', emoji: '🗝️', subtext: 'The deeper version of my story' },
        ],
        coupleCard: '"You want them to see you at your worst. They want them to know their whole story. You\'re both asking for the same thing: to be known completely."',
      },
    ],
  },
  Gentle: {
    word: 'Gentle',
    intro: '"You chose gentleness today. These 3 rounds are about care under pressure — how you and your partner are soft with each other when it matters most."',
    questions: [
      {
        id: 'gentle_1',
        category: 'Frustrated looks like...',
        prompt: '"When I\'m frustrated with my partner, gentle looks like…"',
        options: [
          { text: 'Saying nothing for now', emoji: '🔇', subtext: 'I don\'t want to say something I\'ll regret' },
          { text: 'Saying it softly', emoji: '🌱', subtext: 'Naming it is gentler than holding it' },
        ],
        coupleCard: '"You go quiet to protect them. They speak softly to protect you. You\'re both being careful with the same thing."',
      },
      {
        id: 'gentle_2',
        category: 'Struggling...',
        prompt: '"When my partner is struggling, the gentlest thing I can do is…"',
        options: [
          { text: 'Ask what they need', emoji: '🫧', subtext: 'My help might not be the help they need' },
          { text: 'Notice small things', emoji: '👀', subtext: 'Paying attention before they have to say it' },
        ],
        coupleCard: '"You ask what they need. They already noticed. Both of you are paying attention — just in different ways."',
      },
      {
        id: 'gentle_3',
        category: 'Underrated gentle act...',
        prompt: '"The most underrated gentle act in our relationship is…"',
        options: [
          { text: 'Not bringing up old fights', emoji: '🚫', subtext: 'Every fight deserves its own conversation' },
          { text: 'Saying "I hear you"', emoji: '👂', subtext: 'Being heard first changes everything' },
        ],
        coupleCard: '"You protect them from the past. They protect them from feeling unheard. You\'ve both figured out the same thing from different directions."',
      },
    ],
  },
  Brave: {
    word: 'Brave',
    intro: '"You chose brave today. These 3 rounds are about courage in a relationship — the quiet kind, the loud kind, and the kind neither of you has tried yet."',
    questions: [
      {
        id: 'brave_1',
        category: 'The conversation...',
        prompt: '"The conversation we keep almost having but haven\'t fully had yet…"',
        options: [
          { text: 'Wait until I\'m ready', emoji: '⏳', subtext: 'Brave doesn\'t mean reckless' },
          { text: 'Bring it up now', emoji: '🚀', subtext: 'Brave means going first even when scary' },
        ],
        coupleCard: '"You need to feel ready. They just go. Between you — the conversation always happens eventually. The question is who starts it."',
      },
      {
        id: 'brave_2',
        category: 'Want more brave...',
        prompt: '"The brave thing I want more of from us as a couple…"',
        options: [
          { text: 'More emotional honesty', emoji: '🫀', subtext: 'I\'d rather know than be comfortable' },
          { text: 'Taking real chances', emoji: '🌍', subtext: 'We play it safe. I want us to bet on us.' },
        ],
        coupleCard: '"Your brave is emotional. Theirs is physical. Together you\'ve covered both kinds of risk."',
      },
      {
        id: 'brave_3',
        category: 'Brave means...',
        prompt: '"In our relationship, brave ultimately means…"',
        options: [
          { text: 'Staying and working', emoji: '🏠', subtext: 'Staying when it\'s easier to go silent' },
          { text: 'Saying the hard thing', emoji: '🔊', subtext: 'Not editing yourself to keep the peace' },
        ],
        coupleCard: '"You stay. They speak. The relationship needs both kinds of brave — and you each brought one."',
      },
    ],
  },
};

export const defaultThisOrThatQuestions: ThisOrThatQuestion[] = thisOrThatSets.Present.questions;
