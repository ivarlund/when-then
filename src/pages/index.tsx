import Head from 'next/head'
import { Inter } from 'next/font/google'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/reducers';
import * as reducers from '@/slices/gameSlice';
import { Typography, Box, Button, Card, Stack, Slider, AlertTitle, Alert, ButtonGroup, Stepper, Step, StepLabel, Tooltip, StepContent, StepIcon, Slide } from '@mui/material';
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
 * 	- Functionality for changing team score
 * Game
 * 	- Functionality for starting game
 * 	- Functionality for ending game
 * 	- Functionality for starting round
 * 	- Functionality for ending round
 * 	- Functionality for starting timer ( 30 seconds? )
 * 	- A question is answered correctly if the guess is placed correctly on the timeline
 *  - If question is incorrectly answered all points for the round are lost
 * 		- Display committed/uncomitted points
 * 	- First to 10 points wins
 * 	- Each team get a question at the games start as a starting point
 * 
 * 
 */

function CustomStepIcon(props: any) {
	const { active, completed } = props;
	console.log(props)
	return (
		<StepIcon
			sx={{ color: 'green' }}
			{...props}
		/>
	);
}

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
			<Box sx={{ display: 'flex', justifyContent: 'center' }}><Typography variant="h2">{value}</Typography></Box>
			<Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
				<Button sx={{ fontSize: '1.5rem' }} disabled={disabled} variant="outlined" onClick={() =>
					changeValue(value, -1)
				}>-</Button>
				<Typography sx={{ px: 2 }}>{minValue}</Typography>
				<Slider disabled={disabled} aria-label="Volume" value={value} onChange={handleChange}
					min={minValue} max={maxValue} />
				<Typography sx={{ px: 2 }}>{maxValue}</Typography>
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
			<Button color="primary" variant="contained" size="large" onClick={() =>
				resetQuestion()
			}>
				Next question
			</Button>
		}>
			<AlertTitle>Great job, that is correct!</AlertTitle>
			{description}
		</Alert>
		: <Alert variant="filled" severity="warning" sx={{ mb: 3, width: '100%' }} action={
			<Button color="primary" variant="contained" size="large" onClick={() =>
				resetQuestion()
			}>
				Next question
			</Button>
		}>
			<AlertTitle>Too bad, that is wrong!</AlertTitle>
			{description}
		</Alert>
}

function TimeLine({ timeline }: { timeline: Question[] }) {
	return (
		<Box sx={{ width: '100%' }}>
			<Stepper activeStep={timeline.length} alternativeLabel>
				{timeline.map((question) => (
					<Step key={question.id} sx={{
						'& .MuiStepLabel-root .Mui-completed': {
							color: 'green',
						},
						'& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel': {
							color: '#2E3440', marginTop: 1
						}
					}}>
						<Tooltip arrow title={question.question + ' - ' + question.description}>
							<Slide direction="right" in={true}>
								<StepLabel>
									<Box>
										{question.answer}
									</Box>
								</StepLabel>
							</Slide>
						</Tooltip>
					</Step>
				))}
			</Stepper>
		</Box>
	)
}

export default function Home() {
	const state = useSelector((state: RootState) => state.game);
	const dispatch = useDispatch();

	function handleChange(event: Event, newGuess: number | number[]) {
		dispatch(reducers.changeGuess(newGuess as number));
	}

	function changeValue(currentValue: number, change: number) {
		dispatch(reducers.changeGuess(currentValue + change));
	}

	function getNewQuestion() {
		dispatch(reducers.getNewActiveQuestion());
	}

	function resetQuestion() {
		dispatch(reducers.resetAndDeprecateActiveQuestion());
		dispatch(reducers.updateShouldShowAnswer(false));
	}

	function answerQuestion() {
		dispatch(reducers.answerQuestion());
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
				<Box sx={{ p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
					{state.activeQuestion
						? <Typography variant="h6">{state.activeQuestion.question}</Typography>
						: <Button onClick={getNewQuestion} sx={{ width: '100px' }} color="primary" disabled={state.freshQuestions.length === 0} variant="contained">Show question</Button>
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
						<Button variant="outlined" disabled={!state.activeQuestion || state.shouldShowAnswer} onClick={resetQuestion}>
							Pass
						</Button>
						<Button variant="contained" disabled={!state.activeQuestion || state.shouldShowAnswer} onClick={answerQuestion}>
							Answer
						</Button>
					</ButtonGroup>
				</Box>
				{Object.keys(state.teams).map((team) => {
					return <>
						<Typography>{team}</Typography>
						<TimeLine timeline={state.teams[team].timeline} />
					</>
				})
				}
				<TimeLine timeline={state.timeline} />
			</Card>
		</>
	)
}
