import Head from 'next/head'
import { useState } from 'react';
import { Inter } from 'next/font/google'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/reducers';
import * as reducers from '@/slices/gameSlice';
import { Typography, Box, Button, Card, Stack, Slider, AlertTitle, Alert, ButtonGroup, Stepper, Step, StepLabel, Tooltip, StepContent, StepIcon, Slide, Chip, Avatar, Skeleton } from '@mui/material';
import { Question } from '../data/types';

/**
 * TODO
 * 
 * UI
 * 	- Change UI to show BC/AD
 * 	- Add input for guess
 * Teams
 * 	- Decide on using array or object for teams (object is probably better, will be looking up by id a lot)
 * 	- Functionality for adding teams
 * 	- Functionality for removing teams
 * 	- Functionality for changing team names
 * 	- Functionality for changing team colors
 * 	- Functionality for changing team score CHECK
 * Game
 * 	- Functionality for starting game
 * 	- Functionality for ending game
 * 	- Functionality for starting round CHECK
 * 	- Functionality for ending round CHECK
 * 	- Functionality for starting timer ( 30 seconds? )
 * 	- A question is answered correctly if the guess is placed correctly on the timeline
 *  - If question is incorrectly answered all points for the round are lost CHECK
 * 		- Display committed/uncomitted points CHECK
 * 	- First to 10 points wins
 * 	- Each team get a question at the games start as a starting point
 * 
 */

function YearSelector({ disabled, handleChange, changeValue, value, minValue, maxValue }: {
	disabled: boolean,
	handleChange: (event: Event, newGuess: number | number[]) => void,
	changeValue: (currentValue: number, change: number) => void,
	value: number,
	minValue: number,
	maxValue: number
}) {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 2 }}>
			<Box sx={{ display: 'flex', justifyContent: 'center' }}>
				<Typography variant="h2">{value < 0 ? 'BC ' + value.toString().substring(1) : 'AD ' + value}</Typography>
			</Box>
			<Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
				<Button sx={{ fontSize: '1.5rem' }} disabled={disabled} variant="outlined" onClick={() =>
					changeValue(value, -1)
				}>-</Button>
				<Typography sx={{ px: 2, whiteSpace: 'nowrap' }}>{minValue.toString().substring(1) + ' BC'}</Typography>
				<Slider disabled={disabled} aria-label="Volume" value={value} onChange={handleChange}
					min={minValue} max={maxValue} />
				<Typography sx={{ px: 2, whiteSpace: 'nowrap' }}>{maxValue + ' AD'}</Typography>
				<Button sx={{ fontSize: '1.5rem' }} disabled={disabled} variant="outlined" onClick={() =>
					changeValue(value, 1)
				}>+</Button>
			</Stack>
		</Box>
	)
}

function QuestionAnsweredAlert({ answerCorrect, description, resetQuestion }: {
	answerCorrect: boolean | undefined,
	description: string,
	resetQuestion: () => void
}) {
	return answerCorrect ?
		<Alert variant="filled" severity="success" sx={{ mb: 3, width: '100%' }} action={
			<Box sx={{ display: 'flex', alignItems: 'center', height: '100%', pb: '4px' }}>
				<Button color="inherit" variant="outlined" size="large" onClick={() =>
					resetQuestion()
				}>
					Next question
				</Button>
			</Box>
		}>
			<AlertTitle>Great job, that is correct!</AlertTitle>
			{description}
		</Alert>
		: <Alert variant="filled" severity="warning" sx={{ mb: 3, width: '100%' }} action={
			<Box sx={{ display: 'flex', alignItems: 'center', height: '100%', pb: '4px' }}>
				<Button color="inherit" variant="outlined" onClick={() =>
					resetQuestion()
				}>
					Next question
				</Button>
			</Box>
		}>
			<AlertTitle>Too bad, that is wrong!</AlertTitle>
			{description}
		</Alert>
}

function TimeLine({ timeline, stateTimeline }: { timeline: Question[], stateTimeline: Question[] }) {
	return (
		<Box sx={{ width: '100%' }}>
			<Stepper activeStep={timeline.length} alternativeLabel>
				{timeline.map((question) => {
					let pointLocked = !stateTimeline.some((q: Question) => q.id === question.id)
					return (
						<Step key={question.id} sx={{
							'& .MuiStepLabel-root .Mui-completed': {
								color: pointLocked ? 'green' : 'orange',
							},
							'& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel': {
								color: '#2E3440', marginTop: 1
							}
						}}>
							<Tooltip arrow title={question.description}>
								<Slide timeout={1000} direction="right" in={true} unmountOnExit>
									<StepLabel>
										<Box>
											{question.answer}
										</Box>
										<Box>
											{question.question}
										</Box>
									</StepLabel>
								</Slide>
							</Tooltip>
						</Step>
					)
				})}
			</Stepper>
		</Box>
	)
}

export default function Home() {
	const state = useSelector((state: RootState) => state.game);
	const dispatch = useDispatch();

	function handleChange(event: Event, newGuess: number | number[]) {
		dispatch(reducers.updateGuess(newGuess as number));
	}

	function changeValue(currentValue: number, change: number) {
		dispatch(reducers.updateGuess(currentValue + change));
	}

	function getNewQuestion() {
		dispatch(reducers.getNewActiveQuestion());
	}

	function resetQuestion() {
		dispatch(reducers.resetAndDeprecateActiveQuestion());
		dispatch(reducers.updateShouldShowAnswer(false));
	}

	function answerQuestion() {
		state.activeTeam && dispatch(reducers.answerQuestion(state.activeTeam));
	}

	function toggleRound() {
		// For an arbitrary amount of teams, after the amount of rounds is greater than the amount of teams
		// the round number minus the amount of teams will be the index of the team that should be active
		if (state.activeTeam === null) {
			const nextTeam = state.round % 2 === 0 ? Object.keys(state.teams)[1] : Object.keys(state.teams)[0];
			dispatch(reducers.updateActiveTeam(nextTeam));
		} else {
			dispatch(reducers.updateActiveTeam(null));
			dispatch(reducers.incrementRound());
		}
	}

	return (
		<>
			<Head>
				<title>When then</title>
				<meta name="description" content="Well, when then?" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Card sx={{ p: 2, my: 2 }} elevation={3}>
				<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
					<Button variant="outlined" onClick={toggleRound}>
						{state.activeTeam ? 'End round' : 'Start round'}
					</Button>
					<Box sx={{ display: 'flex', flexDirection: 'column' }}>
						{Object.keys(state.teams).map((team) => {
							return (
								<Chip key={team}
									sx={{ mb: 1 }}
									color={state.activeTeam === team ? 'success' : 'default'}
									variant={state.activeTeam === team ? 'filled' : 'outlined'}
									avatar={<Avatar>{state.teams[team].timeline.length}</Avatar>}
									label={team}
								/>)
						})}
					</Box>
				</Box>
				<Box sx={{ p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 170 }}>
					{state.activeQuestion
						? <Typography variant="h6">{state.activeQuestion.question}</Typography>
						: <Button onClick={getNewQuestion}
							sx={{ width: 'auto' }}
							color="primary"
							disabled={state.freshQuestions.length === 0}
							variant="contained">
							Show question
						</Button>
					}
					{state.activeQuestion && state.shouldShowAnswer &&
						<QuestionAnsweredAlert
							answerCorrect={reducers.selectGetAnswerCorrect(state)}
							description={state.activeQuestion.description}
							resetQuestion={resetQuestion}
						/>
					}
				</Box>
				<YearSelector disabled={state.shouldShowAnswer} handleChange={handleChange} changeValue={changeValue} value={state.guess} minValue={-3000} maxValue={2023} />
				<Box sx={{ display: 'flex', justifyContent: 'end' }}>
					<ButtonGroup>
						<Button variant="outlined" disabled={!state.activeQuestion || state.shouldShowAnswer || !state.activeTeam} onClick={resetQuestion}>
							Pass
						</Button>
						<Button variant="contained" disabled={!state.activeQuestion || state.shouldShowAnswer || !state.activeTeam} onClick={answerQuestion}>
							Answer
						</Button>
					</ButtonGroup>
				</Box>
			</Card>
			{Object.keys(state.teams).map((team) => {
				return (
					<Card key={team} sx={{ p: 2, my: 2 }} elevation={3}>
						<Typography>{team}</Typography>
						<TimeLine stateTimeline={state.timeline} timeline={state.teams[team].timeline} />
					</Card>
				)
			})}
		</>
	)
}
