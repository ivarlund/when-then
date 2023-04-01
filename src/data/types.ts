export interface Question {
    id: number;
    question: string;
    answer: number;
    description: string;
}
export interface Team {
    score: number;
    timeline: Question[];
}

interface Teams {
    [key: string]: Team;
}
export interface State {
    freshQuestions: Question[];
    guess: number;
    activeQuestion: Question | null;
    shouldShowAnswer: boolean;
    teams: Teams;
    timeline: Question[];
}
