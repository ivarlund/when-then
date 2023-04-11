export interface Question {
    id: number;
    question: string;
    answer: number;
    description: string;
}
export interface Team {
    timeline: Question[];
}

export interface Mark {
	value: number;
	answer: number;
	// label: string;
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
    answerCorrect: boolean;
    teams: Teams;
    timeline: Question[];
}
