import Head from 'next/head'
import { Inter } from 'next/font/google'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/reducers';
import * as reducers from '@/slices/gameSlice';
import { Typography, Box, Button, Card, Stack, Slider, AlertTitle, Alert, ButtonGroup, Stepper, Step, StepLabel, Tooltip, StepContent } from '@mui/material';
import { Question } from '../data/types';
const inter = Inter({ subsets: ['latin'] })

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
			<Stepper activeStep={timeline.length}>
				{timeline.map((question) => (
					<Step key={question.id}>
						<Tooltip title={question.question + ' - ' + question.description}>
							<StepLabel>
								<Box>
									<Box>
										{question.answer}
									</Box>
									{/* <Box>
									{question.question}
								</Box> */}
								</Box>
							</StepLabel>
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
				{state.timeline.length > 0 && <TimeLine timeline={state.timeline} />}
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
			</Card>
		</>
	)
}
