import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import questions from '../data/questions.json';
import { Question, State } from '../data/types';

// TODO Kan förmodligen göra det mycket effektivare genom att bara ha en array med frågor och sedan ha en boolean som säger om den är använd eller inte
// eller ha ett objekt med frågor och en array med id:n på de som är använda

const initialQuestions: Question[] = questions;

const initialState: State = {
    freshQuestions: initialQuestions,
    guess: -488,
    activeQuestion: null,
    shouldShowAnswer: false,
    activeTeam: null,
    round: 1,
    teams: {
        'Team 1': {
            timeline: []
        },
        'Team 2': {
            timeline: []
        }
    },
    timeline: []
};

function deprecateQuestion(question: Question, state: State) {
    const index = state.freshQuestions.findIndex(q => q.id === question.id)
    state.freshQuestions.splice(index, 1)
    return state;
}

function setGuess(state: State, guess: number) {
    state.guess = guess;
    return state;
}

function setActiveQuestion(state: State, question: Question | null) {
    state.activeQuestion = question;
    return state;
}

function pushToTimeline(state: State, teamKey: string) {
    state.teams[teamKey].timeline.push(state.activeQuestion!);
    state.teams[teamKey].timeline.sort((a, b) => (a.answer - b.answer));
    return state;
}

function setShouldShowAnswer(state: State, shouldShowAnswer: boolean) {
    state.shouldShowAnswer = shouldShowAnswer;
    return state;
}

function setActiveTeam(state: State, teamName: string | null) {
    state.activeTeam = teamName;
    return state;
}

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        updateQuestionUsed(state, action: PayloadAction<Question>) {
            state = deprecateQuestion(action.payload, state);
        },
        updateShouldShowAnswer(state, action: PayloadAction<boolean>) {
            state = setShouldShowAnswer(state, action.payload);
        },
        updateGuess(state, action: PayloadAction<number>) {
            state = setGuess(state, action.payload);
        },
        updateActiveQuestion(state, action: PayloadAction<Question>) {
            state = setActiveQuestion(state, action.payload);
        },
        updateActiveTeam(state, action: PayloadAction<string | null>) {
            state = setActiveTeam(state, action.payload);
            state.timeline = [];
        },
        getNewActiveQuestion(state) {
            state = setActiveQuestion(state, selectRandomQuestion(state))
        },
        incrementRound(state) {
            state.round += 1;
        },
        resetAndDeprecateActiveQuestion(state) {
            if (state.activeQuestion !== null) {
                state = deprecateQuestion(state.activeQuestion, state);
            }
            state = setActiveQuestion(state, null);
        },
        answerQuestion(state, action: PayloadAction<string>) {
            setShouldShowAnswer(state, true);
            if (selectGetAnswerCorrect(state)) {
                state = pushToTimeline(state, action.payload);
                state.timeline.push(state.activeQuestion!);
            } else if (!selectGetAnswerCorrect(state)) {
                const teamArray = state.teams[action.payload].timeline;
                state.teams[action.payload].timeline = teamArray.filter((question) => !state.timeline.some((otherQuestion) => question.id === otherQuestion.id))
                updateActiveTeam(null);
                incrementRound();
            }
        }
    }
})

export const selectRandomQuestion = createSelector(
    (state: State) => state.freshQuestions,
    (freshQuestions) => {
        const randomIndex = Math.floor(Math.random() * freshQuestions.length);
        return freshQuestions[randomIndex];
    }
);
export const selectGetAnswerCorrect = createSelector(
    (state: State) => state.guess === state.activeQuestion?.answer,
    (answerCorrect) => {
        return answerCorrect;
        // return true;
    }
);

export const {
    answerQuestion,
    updateQuestionUsed,
    updateShouldShowAnswer,
    updateGuess,
    updateActiveQuestion,
    updateActiveTeam,
    getNewActiveQuestion,
    incrementRound,
    resetAndDeprecateActiveQuestion
} = gameSlice.actions;

export default gameSlice.reducer;
