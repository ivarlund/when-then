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
    teams: {
        'Team 1' :{
            score: 0,
            timeline: []
        },
        'Team 2' : {
            score: 0,
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

function pushToTimeline(state: State) {
    state.activeQuestion && state.timeline.push(state.activeQuestion);
    state.timeline.sort((a, b) => (a.answer - b.answer));
    return state;
}

function setShouldShowAnswer(state: State, shouldShowAnswer: boolean) {
    state.shouldShowAnswer = shouldShowAnswer;
    return state;
}

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        makeQuestionUsed(state, action: PayloadAction<Question>) {
            state = deprecateQuestion(action.payload, state);
        },
        updateShouldShowAnswer(state, action: PayloadAction<boolean>) {
            state = setShouldShowAnswer(state, action.payload);
        },
        changeGuess(state, action: PayloadAction<number>) {
            state = setGuess(state, action.payload);
        },
        changeActiveQuestion(state, action: PayloadAction<Question>) {
            state = setActiveQuestion(state, action.payload);
        },
        getNewActiveQuestion(state) {
            state = setActiveQuestion(state, selectRandomQuestion(state))
        },
        resetAndDeprecateActiveQuestion(state) {
            if (state.activeQuestion !== null) {
                state = deprecateQuestion(state.activeQuestion, state);
            }
            state = setActiveQuestion(state, null);
        },
        answerQuestion(state) {
            setShouldShowAnswer(state, true);
            if (selectGetAnswerCorrect(state)) {
                state = pushToTimeline(state);
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
        // return answerCorrect;
        return true;
    }
);

export const {
    answerQuestion,
    makeQuestionUsed,
    updateShouldShowAnswer,
    changeGuess,
    changeActiveQuestion,
    getNewActiveQuestion,
    resetAndDeprecateActiveQuestion
} = gameSlice.actions;

export default gameSlice.reducer;
