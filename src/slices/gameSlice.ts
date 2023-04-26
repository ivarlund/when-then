import { createSelector, createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import questions from "../data/questions.json";
import { Question, GameState, Mark } from "../data/types";

const initialQuestions: Question[] = questions;

const initialState: GameState = {
    freshQuestions: initialQuestions,
    guess: 0,
    activeQuestion: null,
    shouldShowAnswer: false,
    answerCorrect: false,
    activeTeam: null,
    round: 1,
    teams: {},
    timeline: []
};

function deprecateQuestion(state: GameState, question: Question) {
    const index = state.freshQuestions.findIndex(q => q.id === question.id)
    state.freshQuestions.splice(index, 1)
    return state;
}

function setGuess(state: GameState, guess: number) {
    state.guess = guess;
    return state;
}

function setActiveQuestion(state: GameState, question: Question | null) {
    state.activeQuestion = question;
    return state;
}

// Should probably only have one function for pushing to timeline?
function pushActiveQuestionToTimeline(state: GameState, teamKey: string) {
    state.teams[teamKey].timeline.push(state.activeQuestion!);
    state.teams[teamKey].timeline.sort((a, b) => (a.answer - b.answer));
    return state;
}

function pushInitialQuestionToTimeline(state: GameState, teamKey: string) {
    const question = selectRandomQuestion(state);
    state.teams[teamKey].timeline.push(question);
    state = deprecateQuestion(state, question);
    return state;
}

function setShouldShowAnswer(state: GameState, shouldShowAnswer: boolean) {
    state.shouldShowAnswer = shouldShowAnswer;
    return state;
}

function setActiveTeam(state: GameState, teamName: string | null) {
    state.activeTeam = teamName;
    return state;
}

function getMarks(timeline: Question[]) {
	let marks: Mark[] = [];
	timeline.forEach((question, index) => {
		if (index === 0) {
			marks.push({
				value: index,
				answer: question.answer - 1
			})
		}
        // Can probably remove this if
		if (index === timeline.length - 1) {
			marks.push({
				value: index + 1,
				answer: question.answer + 1
			});
		} else {
			marks.push({
				value: index + 1,
				answer: question.answer + 1
			});
		}
	});

	return marks;
}

function getAnswerCorrect(guess: number, currentQuestion: Question, currentTimeline: Question[]) {
    let temporaryTimeline = currentTimeline;
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

export const selectRandomQuestion = createSelector(
    (state: GameState) => state.freshQuestions,
    (freshQuestions) => {
        const randomIndex = Math.floor(Math.random() * freshQuestions.length);
        return freshQuestions[randomIndex];
    }
);

export const selectGetAnswerCorrect = createSelector(
    (state: GameState) => state,
    (state) => {
        return state.activeQuestion && state.activeTeam
        ? getAnswerCorrect(state.guess, state.activeQuestion!, state.teams[state.activeTeam!].timeline)
        : false
    }
);

export const selectAnswerCorrect = createSelector(
    (state: GameState) => state.answerCorrect,
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

export const selectGetTeams = createSelector(
    (state: GameState) => state.teams,
    (teams) => {
        return Object.keys(teams);
    }
);

const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        addTeam(state, action: PayloadAction<string>) {
            state.teams[action.payload] = {
                timeline: [],
                color: 'gray'
            };
        },
        addTeamMap(state, action: PayloadAction<{[key: string]: {timeline: Question[], color: string}}>) {
            state.teams = action.payload;
        },
        updateFreshQuestions(state, action: PayloadAction<Question[]>) {
            state.freshQuestions = action.payload;
        },
        updateQuestionUsed(state, action: PayloadAction<Question>) {
            state = deprecateQuestion(state, action.payload);
        },
        updateShouldShowAnswer(state, action: PayloadAction<boolean>) {
            state = setShouldShowAnswer(state, action.payload);
        },
        updateGuess(state, action: PayloadAction<number>) {
            state = setGuess(state, action.payload);
        },
        updateActiveTeam(state, action: PayloadAction<string | null>) {
            state = setActiveTeam(state, action.payload);
            state.timeline = [];
        },
        updateActiveQuestion(state) {
            state = setActiveQuestion(state, selectRandomQuestion(state));
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
});

export const {
    updateGuess,
    updateActiveTeam,
    updateQuestionUsed,
    updateFreshQuestions,
    updateShouldShowAnswer,
    updateTimelineWithInitialQuestion,
    addTeam,
    addTeamMap,
    answerQuestion,
    incrementRound,
    updateActiveQuestion,
    resetAndDeprecateActiveQuestion
} = gameSlice.actions;

export default gameSlice.reducer;
