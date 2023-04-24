export interface Question {
    id: number;
    question: string;
    answer: number;
    description: string;
}
export interface Team {
    timeline: Question[];
    color: string;
}

export interface Mark {
	value: number;
	answer: number;
}
export interface Teams {
    [key: string]: Team;
}

export interface TeamOptions {
    name: string,
    color: string
}

export interface GameState {
    freshQuestions: Question[];
    guess: number;
    activeQuestion: Question | null;
    activeTeam: string | null;
    round: number;
    shouldShowAnswer: boolean;
    answerCorrect: boolean;
    teams: Teams;
    timeline: Question[];
}

export interface SetupState {
    teams: TeamOptions[];
    enableAi: boolean;
}
