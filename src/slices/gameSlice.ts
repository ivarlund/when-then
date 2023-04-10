import { createSelector, createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import questions from '../data/questions.json';
import { Question, State, Mark } from '../data/types';

// TODO Kan förmodligen göra det mycket effektivare genom att bara ha en array med frågor och sedan ha en boolean som säger om den är använd eller inte
// eller ha ett objekt med frågor och en array med id:n på de som är använda

const initialQuestions: Question[] = questions;

const initialState: State = {
    freshQuestions: initialQuestions,
    guess: 0,
    activeQuestion: null,
    shouldShowAnswer: false,
    answerCorrect: false,
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

function deprecateQuestion(state: State, question: Question) {
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

// Should probably only have one function for pushing to timeline?
function pushActiveQuestionToTimeline(state: State, teamKey: string) {
    state.teams[teamKey].timeline.push(state.activeQuestion!);
    state.teams[teamKey].timeline.sort((a, b) => (a.answer - b.answer));
    return state;
}

function pushInitialQuestionToTimeline(state: State, teamKey: string) {
    const question = selectRandomQuestion(state);
    state.teams[teamKey].timeline.push(question);
    state = deprecateQuestion(state, question);
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

function getMarks(timeline: Question[]) {
	let marks: Mark[] = [];
	timeline.forEach((question, index) => {
		if (index === 0) {
			marks.push({
				value: index,
				answer: question.answer - 1,
				label: question.answer + ' <'
			})
		}
		if (index === timeline.length - 1) {
			marks.push({
				value: index + 1,
				answer: question.answer + 1,
				label: '> ' + question.answer
			});
		} else {
			marks.push({
				value: index + 1,
				answer: question.answer + 1,
				label: question.answer + ' < > ' + timeline[index + 1].answer
			});
		}
	});

	return marks;
}

function getAnswerCorrect(guess: number, currentQuestion: Question, currentTimeline: Question[]) {
    let temporaryTimeline = currentTimeline;;
    temporaryTimeline = temporaryTimeline.concat(currentQuestion).sort(
        (a, b) => (a.answer - b.answer)
    );

    const index = temporaryTimeline.findIndex(q => q.id === currentQuestion.id);
    const previous = temporaryTimeline[index - 1] && temporaryTimeline[index - 1].answer;
    const next = temporaryTimeline[index + 1] && temporaryTimeline[index + 1].answer;
    if (!!previous && !!next) {
        return guess >= previous && guess <= next;
    } else if (!!previous && !next) {
        return guess >= previous;
    } else if (!previous && !!next) {
        return guess <= next;
    }
}

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        updateQuestionUsed(state, action: PayloadAction<Question>) {
            state = deprecateQuestion(state, action.payload);
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
                state = deprecateQuestion(state, state.activeQuestion);
            }
            state = setActiveQuestion(state, null);
        },
        updateTimelineWithInitialQuestion(state, action: PayloadAction<string>) {
            state = pushInitialQuestionToTimeline(state, action.payload);
        },
        answerQuestion(state, action: PayloadAction<string>) {
            setShouldShowAnswer(state, true);
            const answerCorrect = selectGetAnswerCorrect(state)
            if (answerCorrect) {
                state = pushActiveQuestionToTimeline(state, action.payload);
                state.timeline.push(state.activeQuestion!);
                state.answerCorrect = true;
            } else if (!answerCorrect) {
                const teamArray = state.teams[action.payload]?.timeline;
                state.teams[action.payload].timeline = teamArray.filter((question) => !state.timeline.some(
                    (otherQuestion) => question.id === otherQuestion.id
                ));
                state = setActiveTeam(state, null);
                state.timeline = [];
                state.round += 1;
                state.answerCorrect = false;
            }
        }
    }
})

// TODO Läs på om hur syntaxen för dessa borde se ut - ska logiken ligga i första eller andra funktionen?
export const selectRandomQuestion = createSelector(
    (state: State) => state.freshQuestions,
    (freshQuestions) => {
        const randomIndex = Math.floor(Math.random() * freshQuestions.length);
        return freshQuestions[randomIndex];
    }
);

export const selectGetAnswerCorrect = createSelector(
    (state: State) => state,
    (state) => {
        return state.activeQuestion && state.activeTeam
        ? getAnswerCorrect(state.guess, state.activeQuestion!, state.teams[state.activeTeam!].timeline)
        : false
    }
);

export const selectAnswerCorrect = createSelector(
    (state: State) => state.answerCorrect,
    (answerCorrect) => {
        return answerCorrect;
    }
);

export const selectGetMarks = createSelector(
    (timeline: Question[]) => timeline,
    (timeline) => {
        return getMarks(timeline);
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
    updateTimelineWithInitialQuestion,
    incrementRound,
    resetAndDeprecateActiveQuestion
} = gameSlice.actions;

export default gameSlice.reducer;
