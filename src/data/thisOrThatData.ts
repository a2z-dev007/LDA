export interface ThisOrThatQuestion {
  id: string;
  category: string;
  options: {
    text: string;
    emoji: string;
  }[];
}

export const thisOrThatQuestions: ThisOrThatQuestion[] = [
  {
    id: 'tot_1',
    category: 'FOR OUR NEXT TRIP TOGETHER...',
    options: [
      { text: 'Beach & do nothing', emoji: '🏖️' },
      { text: 'Trek & explore', emoji: '🏔️' },
    ],
  },
  {
    id: 'tot_2',
    category: 'ON A QUIET SUNDAY...',
    options: [
      { text: 'Slow morning at home', emoji: '☕' },
      { text: 'Spontaneous day out', emoji: '🚗' },
    ],
  },
];
