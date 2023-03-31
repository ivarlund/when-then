export interface Question {
    id: number;
    question: string;
    answer: number;
    description: string;
}

export interface State {
    freshQuestions: Question[];
    guess: number;
    activeQuestion: Question | null;
    shouldShowAnswer: boolean;
    timeline: Question[];
}