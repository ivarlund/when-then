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
	SliderThumb,
	Typography,
	Tooltip,
} from "@mui/material";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import CountdownTimer from "@/components/countdownTimer";
import Fireworks from "@/components/fireworks";
import Setup from "@/components/setup";
import * as reducers from "@/slices/gameSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/reducers";
import { Question } from "@/data/types";
import { useEffect, useState } from "react";
import {
	getYearDisplayText,
	getWinningTeamIndex,
} from "@/helpers/helperFunctions";

function QuestionAnsweredAlert({
	correctAnswer,
	answerCorrect,
	description,
	resetQuestion,
}: {
	correctAnswer: number;
	answerCorrect: boolean;
	description: string;
	resetQuestion: () => void;
}) {
	return (
		<Alert
			sx={{
				mb: 3,
				bgcolor: answerCorrect ? "success.light" : "warning.light",
			}}
			variant="filled"
			action={
				<Button
					color="inherit"
					variant="outlined"
					size="large"
					onClick={resetQuestion}
				>
					OK!
				</Button>
			}
		>
			<AlertTitle>
				{(answerCorrect
					? "Great job, that is correct!"
					: "Too bad that is wrong!") +
					" " +
					correctAnswer}
			</AlertTitle>
			{description}
		</Alert>
	);
}

function CustomThumb(props: any) {
	const { children, ...other } = props;
	return (
		<SliderThumb sx={{ height: 28, width: 28 }} {...other}>
			{children}
			<ArrowCircleDownIcon
				sx={{ color: "secondary.light" }}
				fontSize="large"
			/>
		</SliderThumb>
	);
}

function CustomMark(props: any) {
	const { children, ...other } = props;
	return (
		<SliderThumb sx={{ height: 10, width: 10 }} {...other}>
			{children}
		</SliderThumb>
	);
}

function TimeLine({
	timeline,
	stateTimeline,
	active,
	onChange,
}: {
	timeline: Question[];
	stateTimeline: Question[];
	active: boolean;
	onChange: (newValue: number) => void;
}) {
	const marks = reducers.selectGetMarks(timeline);
	useEffect(() => {
		if (active) {
			onChange(marks[0].value);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [active]);

	return (
		<Box sx={{ p: 2, mb: 2 }}>
			<Divider sx={{ pt: 2 }} />
			<Box sx={{ px: 2, pt: 3 }}>
				{timeline.length > 0 && (
					<Slider
						slots={{ thumb: CustomThumb, mark: CustomMark }}
						marks={marks}
						track={false}
						step={null}
						min={0}
						max={timeline.length}
						disabled={!active}
						onChange={(event, value) => {
							const answerValue = marks[value as number].value;
							onChange(answerValue);
						}}
					/>
				)}
				<Stepper activeStep={timeline.length} alternativeLabel>
					{timeline.map((question) => {
						const pointLocked = !stateTimeline.some(
							(q: Question) => q.id === question.id
						);
						return (
							<Step
								key={question.id}
								sx={{
									"& .MuiStepLabel-root .Mui-completed": {
										color: pointLocked ? "green" : "orange",
									},
									"& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel":
										{
											color: "#2E3440",
											marginTop: 0.5,
										},
								}}
							>
								<Tooltip arrow title={question.description}>
									<Slide
										timeout={1000}
										direction="right"
										in={true}
										unmountOnExit
									>
										<StepLabel>
											<Box>
												{getYearDisplayText(
													question.answer
												)}
											</Box>
											<Box>{question.question}</Box>
										</StepLabel>
									</Slide>
								</Tooltip>
							</Step>
						);
					})}
				</Stepper>
			</Box>
		</Box>
	);
}

function TeamComponent({
	active,
	timerRunning,
	time,
	team,
	teamColor,
	points,
	canAnswerQuestion,
	timeline,
	stateTimeline,
	setTime,
	answerQuestion,
	stopTimer,
	onChange,
}: {
	active: boolean;
	timerRunning: boolean;
	time: number;
	team: string;
	teamColor: string;
	points: number;
	canAnswerQuestion: boolean;
	timeline: Question[];
	stateTimeline: Question[];
	setTime: (newValue: number) => void;
	answerQuestion: () => void;
	stopTimer: () => void;
	onChange: (newValue: number) => void;
}) {
	return (
		<Card
			key={team}
			sx={{ mb: 1, outline: active ? "2px solid green" : "" }}
		>
			<Box
				sx={{ display: "flex", justifyContent: "space-around", pt: 1 }}
			>
				{active && timerRunning && time > -1 && (
					<CountdownTimer time={time} setTime={setTime} />
				)}
			</Box>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					px: 1,
					pt: 1,
				}}
			>
				<Chip
					key={team}
					sx={{
						mb: 1,
						justifyContent: "space-between",
						backgroundColor: teamColor,
						outline: active ? "2px solid green" : "",
					}}
					variant={active ? "filled" : "outlined"}
					avatar={<Avatar>{points}</Avatar>}
					label={team}
				/>
				<Button
					variant="contained"
					disabled={canAnswerQuestion}
					onClick={() => {
						answerQuestion();
						stopTimer();
					}}
				>
					Answer
				</Button>
			</Box>
			<TimeLine
				stateTimeline={stateTimeline}
				active={active}
				timeline={timeline}
				onChange={onChange}
			/>
		</Card>
	);
}

export default function Home() {
	const state = useSelector((state: RootState) => state.game);
	const dispatch = useDispatch();
	const [time, setTime] = useState<number>(30);
	const [timerRunning, setTimerRunning] = useState(false);

	const winner = getWinningTeamIndex(state.teams);
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

	function handleUpdateGuess(newValue: number) {
		dispatch(reducers.updateGuess(newValue));
	}

	function getNewActiveQuestion() {
		dispatch(reducers.updateActiveQuestion());
	}

	function resetQuestion() {
		dispatch(reducers.resetAndDeprecateActiveQuestion());
		dispatch(reducers.updateShouldShowAnswer(false));
	}

	function answerQuestion() {
		dispatch(reducers.answerQuestion(state.activeTeam!));
	}

	// Maybe move this to the reducer?
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

	return noTeams ? (
		<Setup />
	) : (
		<>
			<Card sx={{ p: 2, my: 1 }}>
				{winner > -1 && (
					<Fireworks
						winnerTeamName={reducers.selectGetTeams(state)[winner]}
					/>
				)}
				<Box sx={{ display: "flex", justifyContent: "space-between" }}>
					<Box sx={{ width: 130 }}>
						<Button
							disabled={!!state.activeQuestion || noTeams}
							variant="outlined"
							onClick={toggleRound}
						>
							{state.activeTeam ? "End round" : "Start round"}
						</Button>
					</Box>
				</Box>
				<Box
					sx={{
						pt: 2,
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					{state.activeQuestion ? (
						<Typography variant="h6">
							{state.activeQuestion.question}
						</Typography>
					) : (
						<Button
							onClick={() => {
								setTimerRunning(true);
								getNewActiveQuestion();
							}}
							sx={{ width: "auto" }}
							color="primary"
							disabled={noQuestions || !state.activeTeam}
							variant="contained"
						>
							Show question
						</Button>
					)}
					{state.activeQuestion && state.shouldShowAnswer && (
						<QuestionAnsweredAlert
							correctAnswer={state.activeQuestion.answer}
							answerCorrect={reducers.selectAnswerCorrect(state)}
							description={state.activeQuestion.description}
							resetQuestion={resetQuestion}
						/>
					)}
				</Box>
			</Card>
			{reducers
				.selectGetTeams(state)
				.sort((a, b) =>
					a === state.activeTeam ? -1 : b === state.activeTeam ? 1 : 0
				)
				.map((team) => (
					// This can probably be cleaned up a bit
					<TeamComponent
						key={team}
						active={state.activeTeam === team}
						timerRunning={timerRunning}
						time={time}
						setTime={setTime}
						team={team}
						teamColor={state.teams[team].color}
						points={state.teams[team].timeline.length}
						canAnswerQuestion={
							!state.activeQuestion ||
							state.shouldShowAnswer ||
							!(state.activeTeam === team)
						}
						answerQuestion={answerQuestion}
						stopTimer={stopTimer}
						stateTimeline={state.timeline}
						timeline={state.teams[team].timeline}
						onChange={handleUpdateGuess}
					/>
				))}
		</>
	);
}
