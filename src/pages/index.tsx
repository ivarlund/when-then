import Head from 'next/head'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/reducers';
import * as reducers from '@/slices/gameSlice';
import { Typography, Box, Button, Card, Stack, Slider, AlertTitle, Alert, ButtonGroup, Stepper, Step, StepLabel, Tooltip, Slide, Chip, Avatar, TextField, Switch } from '@mui/material';
import { Question, Mark } from '../data/types';
import { useEffect, useState } from 'react';

/**
 * TODO
 * 
 * Code
 *  - Put text in a separate json file in /data CHECK
 *  - Break up code into smaller components
 * 
 * UI
 * 	- Change UI to show BC/AD
 * 	- Add input for guess
 *  - Make mobile friendly
 *  - Add green border to current team timeline CHECK
 * Teams
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
 * 	- A question is answered correctly if the guess is placed correctly on the timeline CHECK
 *  - If question is incorrectly answered all points for the round are lost CHECK
 * 		- Display committed/uncomitted points CHECK
 * 	- First to 10 points wins
 * 	- Each team get a question at the games start as a starting point CHECK
 * 
 * Rule-modal
 * 	- make a modal that shows the rules and can be toggled CHECK
 */

function YearSelector({ disabled, handleChange, changeValue, value, minValue, maxValue }: {
	disabled: boolean,
	handleChange: (event: Event, newGuess: number | number[]) => void,
	changeValue: (change: number) => void,
	value: number,
	minValue: number,
	maxValue: number
}) {

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 2 }}>
			<Box sx={{ display: 'flex', justifyContent: 'center' }}>
				<Card sx={{ p: 1, width: 237 }} variant="outlined">
					<Typography align="center" variant="h2">{value < 0 ? value.toString().substring(1) + ' BC' : value}</Typography>
				</Card>
			</Box>
			<Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
				<Button sx={{ fontSize: '1.5rem' }} disabled={disabled} variant="outlined" onClick={() =>
					changeValue(value - 1)
				}>-</Button>
				<Typography sx={{ px: 2, whiteSpace: 'nowrap' }}>{minValue.toString().substring(1) + ' BC'}</Typography>
				<Slider disabled={disabled} aria-label="Volume" value={value as number} onChange={handleChange}
					min={minValue} max={maxValue} />
				<Typography sx={{ px: 2, whiteSpace: 'nowrap' }}>{maxValue + ' AD'}</Typography>
				<Button sx={{ fontSize: '1.5rem' }} disabled={disabled} variant="outlined" onClick={() =>
					changeValue(value + 1)
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
		<Alert variant="filled" severity="success" sx={{ mb: 3, width: '100%', bgcolor: 'success.light' }} action={
			<Button color="inherit" variant="outlined" size="large" onClick={() =>
				resetQuestion()
			}>
				Next question
			</Button>
		}>
			<AlertTitle>Great job, that is correct!</AlertTitle>
			{description}
		</Alert>
		: <Alert variant="filled" severity="warning" sx={{ mb: 3, width: '100%', bgcolor: 'warning.light' }} action={
			<Button color="inherit" variant="outlined" onClick={() =>
				resetQuestion()
			}>
				Next question
			</Button>
		}>
			<AlertTitle>Too bad, that is wrong!</AlertTitle>
			{description}
		</Alert>
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

function TimeLine({ timeline, stateTimeline, team, activeTeam, onChange }: { timeline: Question[], team: string, activeTeam: string | null, stateTimeline: Question[], onChange: (newValue: number) => void }) {

	return (
		<Card key={team} sx={{ p: 2, my: 2, outline: team === activeTeam ? '2px solid green' : '' }}>
			<Typography>{team}</Typography>
			<Box sx={{ px: 2 }}>
				{timeline.length > 0 &&
					<Slider
						marks={getMarks(timeline)}
						track={false}
						step={null}
						min={0}
						max={timeline.length}
						disabled={team !== activeTeam}
						onChange={(event, value) => {
							const answerValue = getMarks(timeline)[value as number].answer;
							onChange(answerValue)
						}}
					/>}
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
												{question.answer < 0 ? question.answer.toString().substring(1) + ' BC' : question.answer}
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
		</Card>
	)
}


function CountdownTimer({ time, setTime }: { time: number, setTime: (number: any) => void }) {
	let outlineColor;

	if (time < 10) {
		outlineColor = 'red'
	} else if (time < 20) {
		outlineColor = 'orange'
	} else {
		outlineColor = 'green'
	}

	useEffect(() => {
		const intervalId = setInterval(() => {
			setTime((prevTime: number) => prevTime - 1);
		}, 1000);

		return () => clearInterval(intervalId);
	}, [setTime]);

	useEffect(() => {
		const intervalId = setInterval(() => {
			if (time === 0) {
				clearInterval(intervalId);
			}
		}, 1000);

		return () => clearInterval(intervalId);
	}, [time]);

	return (
		<Box>
			<Card variant="outlined" sx={{ outline: '2px solid ' + outlineColor }}>
				<Typography variant="h6" align="center" width={40}>{time}</Typography>
			</Card>
		</Box>
	)
}

export default function Home() {
	const state = useSelector((state: RootState) => state.game);
	const dispatch = useDispatch();
	const [time, setTime] = useState<number>(30);
	const [timerRunning, setTimerRunning] = useState(false);

	useEffect(() => {
		if (time === 0 && timerRunning) {
			stopTimer();
			dispatch(reducers.answerQuestion(state.activeTeam!));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [time]);

	function handleChange(event: Event, newGuess: number | number[]) {
		dispatch(reducers.updateGuess(newGuess as number));
	}

	function stopTimer() {
		setTimerRunning(false);
		setTime(30);
	}

	function changeValue(newValue: number) {
		dispatch(reducers.updateGuess(newValue));
	}

	function getNewQuestion() {
		dispatch(reducers.getNewActiveQuestion());
	}

	function resetQuestion() {
		dispatch(reducers.resetAndDeprecateActiveQuestion());
		dispatch(reducers.updateShouldShowAnswer(false));
	}

	function answerQuestion() {
		dispatch(reducers.answerQuestion(state.activeTeam!));
	}

	function toggleRound() {
		// For an arbitrary amount of teams, after the amount of rounds is greater than the amount of teams
		// the round number minus the amount of teams will be the index of the team that should be active
		if (state.activeTeam === null) {
			const nextTeam = state.round % 2 === 0 ? Object.keys(state.teams)[1] : Object.keys(state.teams)[0];
			dispatch(reducers.updateActiveTeam(nextTeam));
			if (state.teams[nextTeam].timeline.length === 0) {
				dispatch(reducers.updateTimelineWithInitialQuestion(nextTeam));
			}
		} else {
			dispatch(reducers.updateActiveTeam(null));
			dispatch(reducers.incrementRound());
			setTimerRunning(false);
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
			<Card sx={{ p: 2, my: 2 }}>
				<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
					<Button sx={{ width: 130 }} disabled={!!state.activeQuestion} variant="outlined" onClick={toggleRound}>
						{state.activeTeam ? 'End round' : 'Start round'}
					</Button>
					{timerRunning && (time > -1) && <CountdownTimer time={time} setTime={setTime} />}
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
				<Box sx={{ p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 150 }}>
					{state.activeQuestion
						? <Typography variant="h6">{state.activeQuestion.question}</Typography>
						: <Button
							onClick={function () {
								setTimerRunning(true);
								getNewQuestion();
							}}
							sx={{ width: 'auto' }}
							color="primary"
							disabled={state.freshQuestions.length === 0 || !state.activeTeam}
							variant="contained">
							Show question
						</Button>
					}
					{state.activeQuestion && state.shouldShowAnswer &&
						<QuestionAnsweredAlert
							answerCorrect={reducers.selectAnswerCorrect(state)}
							description={state.activeQuestion.description}
							resetQuestion={resetQuestion}
						/>
					}
				</Box>
				{/* <YearSelector disabled={state.shouldShowAnswer} handleChange={handleChange} changeValue={changeValue} value={state.guess} minValue={-3000} maxValue={2023} /> */}
				<Box sx={{ display: 'flex', justifyContent: 'end' }}>
					<Button
						variant="contained"
						disabled={!state.activeQuestion || state.shouldShowAnswer || !state.activeTeam}
						onClick={function () {
							answerQuestion();
							stopTimer();
						}}>
						Answer
					</Button>
				</Box>
			</Card>
			{Object.keys(state.teams).map((team) => {
				return (
					// <Card key={team} sx={{ p: 2, my: 2, outline: team === state.activeTeam ? '2px solid green' : '' }}>
					// 	<Typography>{team}</Typography>
					<TimeLine key={team} stateTimeline={state.timeline} team={team} activeTeam={state.activeTeam} timeline={state.teams[team].timeline} onChange={changeValue} />
					// </Card>
				)
			})}
		</>
	)
}
