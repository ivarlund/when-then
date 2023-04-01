export interface Question {
    id: number;
    question: string;
    answer: number;
    description: string;
}
export interface Team {
    timeline: Question[];
}

interface Teams {
    [key: string]: Team;
}
export interface State {
    freshQuestions: Question[];
    guess: number;
    activeQuestion: Question | null;
    activeTeam: string | null;
    round: number;
    shouldShowAnswer: boolean;
    teams: Teams;
    timeline: Question[];
}
