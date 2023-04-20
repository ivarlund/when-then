import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/reducers";
import * as reducers from "@/slices/gameSlice";
import {
	AlertTitle,
	Alert,
	Avatar,
	Box,
	Button,
	Card,
	Chip,
	Divider,
	Slider,
	Stepper,
	Step,
	StepLabel,
	Slide,
	Typography,
	SliderThumb,
	Tooltip,
	TextField
} from "@mui/material";
import { Question } from "../data/types";
import { useEffect, useState } from "react";
import { getYearDisplayText } from "../helpers/helperFunctions";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import AddIcon from "@mui/icons-material/Add";
import Fireworks from "../components/fireworks";
import CountdownTimer from "@/components/countdownTimer";

function QuestionAnsweredAlert({ answerCorrect, description, resetQuestion }: {
	answerCorrect: boolean | undefined,
	description: string,
	resetQuestion: () => void
}) {
	return (
		answerCorrect
			? <Alert variant="filled" severity="success" sx={{ mb: 3, bgcolor: 'success.light' }}
				action={
					<Button color="inherit" variant="outlined" size="large" onClick={resetQuestion}>
						OK!
					</Button>
				}>
				<AlertTitle>Great job, that is correct!</AlertTitle>
				{description}
			</Alert>
			: <Alert variant="filled" severity="warning" sx={{ mb: 3, width: '100%', bgcolor: 'warning.light' }}
				action={
					<Button color="inherit" variant="outlined" onClick={resetQuestion}>
						Next question
					</Button>
				}>
				<AlertTitle>Too bad, that is wrong!</AlertTitle>
				{description}
			</Alert>
	);
}

function CustomThumb(props: any) {
	const { children, ...other } = props;
	return (
		<SliderThumb sx={{ height: 28, width: 28 }} {...other}>
			{children}
			<ArrowCircleDownIcon sx={{ color: 'secondary.light' }} fontSize="large" />
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

function TimeLine({ timeline, stateTimeline, active, onChange }: {
	timeline: Question[],
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
	);
}

function AddTeamComponent({ newTeam, shouldShowError, onChange, onClick }: {
	newTeam: string,
	shouldShowError: boolean
	onChange: (newValue: string) => void,
	onClick: () => void,
}) {
	return (
		<Box sx={{ display: 'flex' }}>
			<TextField sx={{ mr: 0.5 }}
				value={newTeam}
				onChange={(e) => onChange(e.target.value)}
				label="New team"
				size="small"
				variant="outlined"
				error={shouldShowError}
				helperText={shouldShowError && 'Team name already exists'}
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

	const winner = Object.keys(state.teams).some((team) => state.teams[team].timeline.length === 10);
	const noTeams = reducers.selectGetTeams(state).length === 0;
	const noQuestions = state.freshQuestions.length === 0;

	useEffect(() => {
		if (time === 0 && timerRunning) {
			stopTimer();
			dispatch(reducers.answerQuestion(state.activeTeam!));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [time]);

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

	function addTeam() {
		if (!reducers.selectGetTeams(state).includes(newTeam) && newTeam !== '') {
			dispatch(reducers.addTeam(newTeam));
		}
		setNewTeam('');
	}

	function toggleRound() {
		if (state.activeTeam === null) {
			let nextTeam = "";
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
			<Card sx={{ p: 2, my: 1 }}>
				{winner && <Fireworks />}
				<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
					<Box sx={{ width: 130 }}>
						<Button disabled={!!state.activeQuestion || noTeams} variant="outlined" onClick={toggleRound}>
							{state.activeTeam ? 'End round' : 'Start round'}
						</Button>
					</Box>
					<Box>
						<AddTeamComponent newTeam={newTeam} onChange={setNewTeam} onClick={addTeam} shouldShowError={!!reducers.selectGetTeams(state).includes(newTeam)} />
					</Box>
				</Box>
				<Box sx={{
					pt: 2,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center'
				}}>
					{state.activeQuestion
						? <Typography variant="h6">{state.activeQuestion.question}</Typography>
						: <Button
							onClick={() => {
								setTimerRunning(true);
								getNewQuestion();
							}}
							sx={{ width: 'auto' }}
							color="primary"
							disabled={noQuestions || !state.activeTeam}
							variant="contained">
							Show question
						</Button>}
					{state.activeQuestion && state.shouldShowAnswer &&
						<QuestionAnsweredAlert
							answerCorrect={reducers.selectAnswerCorrect(state)}
							description={state.activeQuestion.description}
							resetQuestion={resetQuestion}
						/>}
				</Box>
			</Card>
			{reducers.selectGetTeams(state)
				.sort((a, b) => (a === state.activeTeam ? -1 : b === state.activeTeam ? 1 : 0))
				.map(team => (
					<Card key={team} sx={{ mb: 1, outline: state.activeTeam === team ? '2px solid green' : '' }}>
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
								onClick={() => {
									answerQuestion();
									stopTimer();
								}}>
								Answer
							</Button>
						</Box>
						<TimeLine
							stateTimeline={state.timeline}
							active={state.activeTeam === team}
							timeline={state.teams[team].timeline}
							onChange={changeValue}
						/>
					</Card>
				))}
		</>
	)
}
