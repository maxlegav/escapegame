export interface Exercise {
  number: number;
  question: string;
  solution: string;
  answer: string;
}

export interface GMATChallenge {
  id: string;
  title: string;
  description: string;
  exercises: Exercise[];
  finalQuestion: string;
  finalAnswer: string;
  nextPath: string;
}

export interface Challenge {
  id: string;
  question: string;
  answer: string;
  hint?: string;
  nextPath: string;
  caseSensitive?: boolean;
}

export interface ChallengePageProps {
  challenge: Challenge;
}
