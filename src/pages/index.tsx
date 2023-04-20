import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/reducers';
import * as reducers from '@/slices/gameSlice';
import { Typography, Box, Button, Card, Stack, Slider, AlertTitle, Alert, ButtonGroup, Stepper, Step, StepLabel, Tooltip, Slide, Chip, Avatar, TextField, Switch, SliderThumb, CardHeader, Divider, SliderMark } from '@mui/material';
import { Question } from '../data/types';
import { useEffect, useState } from 'react';
import { getYearDisplayText } from '../helpers/helperFunctions';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import AddIcon from '@mui/icons-material/Add';
import Fireworks from '../components/fireworks';

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
 * 	- Functionality for adding teams  CHECK
 * 	- Functionality for removing teams
 * 	- Functionality for changing team names CHECK
 * 	- Functionality for changing team colors
 * 	- Functionality for changing team score CHECK
 * Game
 * 	- Functionality for starting game
 * 	- Functionality for ending game
 * 	- Functionality for starting round CHECK
 * 	- Functionality for ending round CHECK
 * 	- Functionality for starting timer ( 30 seconds? ) CHECK
 * 	- A question is answered correctly if the guess is placed correctly on the timeline CHECK
 *  - If question is incorrectly answered all points for the round are lost CHECK
 * 		- Display committed/uncomitted points CHECK
 * 	- First to 10 points wins
 * 	- Each team get a question at the games start as a starting point CHECK
 * 
 * Rule-modal
 * 	- make a modal that shows the rules and can be toggled CHECK
 */

function QuestionAnsweredAlert({ answerCorrect, description, resetQuestion }: {
	answerCorrect: boolean | undefined,
	description: string,
	resetQuestion: () => void
}) {
	return answerCorrect
		? <Alert variant="filled" severity="success" sx={{ mb: 3, bgcolor: 'success.light' }}
			action={
				<Button color="inherit" variant="outlined" size="large" onClick={() => resetQuestion()}>
					OK!
				</Button>
			}>
			<AlertTitle>Great job, that is correct!</AlertTitle>
			{description}
		</Alert>
		: <Alert variant="filled" severity="warning" sx={{ mb: 3, width: '100%', bgcolor: 'warning.light' }}
			action={
				<Button color="inherit" variant="outlined" onClick={() => resetQuestion()}>
					Next question
				</Button>
			}>
			<AlertTitle>Too bad, that is wrong!</AlertTitle>
			{description}
		</Alert>
}

function CustomThumb(props: any) {
	const { children, ...other } = props;
	return (
		<SliderThumb sx={{ height: 28, width: 28 }} {...other}>
			{children}
			<ArrowCircleDownIcon sx={{ color: 'secondary.light' }} fontSize='large' />
		</SliderThumb>
	);
}

function CustomMark(props: any) {
	const { children, ...other } = props
	return (
		<SliderThumb sx={{ height: 10, width: 10 }} {...other}>
			{children}
		</SliderThumb>
	);
}

function TimeLine({ timeline, stateTimeline, team, active, onChange }: {
	timeline: Question[],
	team: string,
	active: boolean,
	stateTimeline: Question[],
	onChange: (newValue: number) => void
}) {
	const marks = reducers.selectGetMarks(timeline);

	return (
		<Box sx={{ p: 2, mb: 2 }}>
			<Divider sx={{ pt: 2 }} />
			<Box sx={{ px: 2, pt: 3 }}>
				{timeline.length > 0 &&
					<Slider
						slots={{ thumb: CustomThumb, mark: CustomMark }}
						marks={marks}
						track={false}
						step={null}
						min={0}
						max={timeline.length}
						disabled={!active}
						onChange={(event, value) => {
							const answerValue = marks[value as number].answer;
							onChange(answerValue)
						}}
					/>
				}
				<Stepper activeStep={timeline.length} alternativeLabel>
					{timeline.map((question) => {
						const pointLocked = !stateTimeline.some((q: Question) => q.id === question.id)
						return (
							<Step key={question.id} sx={{
								'& .MuiStepLabel-root .Mui-completed': {
									color: pointLocked ? 'green' : 'orange',
								},
								'& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel': {
									color: '#2E3440', marginTop: 0.5
								}
							}}>
								<Tooltip arrow title={question.description}>
									<Slide timeout={1000} direction="right" in={true} unmountOnExit>
										<StepLabel>
											<Box>
												{getYearDisplayText(question.answer)}
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
		</Box>
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

function AddTeamComponent({ newTeam, onChange, onClick }: {
	newTeam: string,
	onChange: (newValue: string) => void,
	onClick: () => void
}) {
	return (
		<Box sx={{ display: 'flex' }}>
			<TextField sx={{ mr: 0.5 }}
				value={newTeam}
				onChange={(e) => onChange(e.target.value)}
				label="New team"
				size="small"
				variant="outlined"
				onKeyPress={(e) => {
					if (e.key === 'Enter') {
						onClick();
					}
				}}
			/>
			<Button variant="contained" size="small" endIcon={<AddIcon />} onClick={onClick}>Add</Button>
		</Box>
	)
}

export default function Home() {
	const state = useSelector((state: RootState) => state.game);
	const dispatch = useDispatch();
	const [time, setTime] = useState<number>(30);
	const [timerRunning, setTimerRunning] = useState(false);
	const [newTeam, setNewTeam] = useState<string>('');

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
		if (state.activeTeam === null) {
			let nextTeam = '';
			// Can't use the reducers.selectGetTeams(state) here because it memoizes the state 
			// and doesn't update when the state changes so it saves the previously sorted list from render
			const teams = Object.keys(state.teams);
			const totalTeams = teams.length;

			const activeTeamIndex = (state.round - 1) % totalTeams;
			nextTeam = teams[activeTeamIndex];
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
			<Card sx={{
				p: 2,
				mt: 1
			}}>
				{Object.keys(state.teams).some((team) => state.teams[team].timeline.length === 10) && <Fireworks />}
				<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
					<Box sx={{ width: 130 }}>
						<Button disabled={!!state.activeQuestion || reducers.selectGetTeams(state).length === 0} variant="outlined" onClick={toggleRound}>
							{state.activeTeam ? 'End round' : 'Start round'}
						</Button>
					</Box>
					<Box>
						<AddTeamComponent newTeam={newTeam} onChange={setNewTeam} onClick={() => {
							if (!reducers.selectGetTeams(state).includes(newTeam) && newTeam !== '') {
								dispatch(reducers.addTeam(newTeam));
							}
							setNewTeam('');
						}} />
					</Box>
				</Box>
				<Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
					{state.activeQuestion ? <Typography variant="h6">{state.activeQuestion.question}</Typography> : <Button
						onClick={function () {
							setTimerRunning(true);
							getNewQuestion();
						}}
						sx={{ width: 'auto' }}
						color="primary"
						disabled={state.freshQuestions.length === 0 || !state.activeTeam}
						variant="contained">
						Show question
					</Button>}
					{state.activeQuestion && state.shouldShowAnswer &&
						<QuestionAnsweredAlert
							answerCorrect={reducers.selectAnswerCorrect(state)}
							description={state.activeQuestion.description}
							resetQuestion={resetQuestion}
						/>
					}
				</Box>
			</Card>
			{reducers.selectGetTeams(state)
				.sort((a, b) => (a === state.activeTeam ? -1 : b === state.activeTeam ? 1 : 0))
				.map(team => (
					<Card key={team} sx={{ mt: 1, outline: state.activeTeam === team ? '2px solid green' : '' }}>
						<Box sx={{ display: 'flex', justifyContent: 'space-around', pt: 1 }}>
							{state.activeTeam === team && timerRunning && (time > -1) && <CountdownTimer time={time} setTime={setTime} />}
						</Box>
						<Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1, pt: 1 }}>
							<Chip key={team}
								sx={{ mb: 1, justifyContent: 'space-between' }}
								color={state.activeTeam === team ? 'success' : 'default'}
								variant={state.activeTeam === team ? 'filled' : 'outlined'}
								avatar={<Avatar>{state.teams[team].timeline.length}</Avatar>}
								label={team}
							/>
							<Button
								variant="contained"
								disabled={!state.activeQuestion || state.shouldShowAnswer || !(state.activeTeam === team)}
								onClick={function () {
									answerQuestion();
									stopTimer();
								}}>
								Answer
							</Button>
						</Box>
						<TimeLine
							stateTimeline={state.timeline}
							team={team}
							active={state.activeTeam === team}
							timeline={state.teams[team].timeline}
							onChange={changeValue}
						/>
					</Card>
				))
			}
		</>
	)
}
