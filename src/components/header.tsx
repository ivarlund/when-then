import {
	Backdrop,
	Box,
	Button,
	CircularProgress,
	Paper,
	TextField,
	Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import * as reducers from "@/slices/gameSlice";

import GamesIcon from "@mui/icons-material/Games";
import { useState } from "react";
import { parseQuestions, getGPTQuery } from "@/helpers/helperFunctions";
import { RootState } from "@/reducers";

const data = (category: string) => ({
	method: "POST",
	headers: {
		"Content-Type": "application/json",
	},
	body: JSON.stringify({
		model: "gpt-3.5-turbo",
		messages: [
			{
				role: "user",
				content: getGPTQuery(category),
			},
		],
		temperature: 0.7,
	}),
});
const apiEndpoint = "/api/questionGenerator";

export default function Header({
	title,
	children,
}: {
	title: string;
	children?: React.ReactNode;
}) {
	const setupState = useSelector((state: RootState) => state.setup);
	const dispatch = useDispatch();
	const [isCalling, setIsCalling] = useState<boolean>(false);
	const [category, setCategory] = useState<string>("Movies");

	// TODO Need a cooler way to do this. I dont find it necessary to
	// wrap the fetch api but I probably want to generalize it in some way
	function fetchGPTQuestions() {
		setIsCalling(true);
		fetch(apiEndpoint, data(category))
			.then((res) => {
				res.json().then((response) => {
					const parsedQuestions = parseQuestions(
						response.choices[0].message.content
					);
					dispatch(reducers.updateFreshQuestions(parsedQuestions));
				});
			})
			.catch((err) => console.log(err))
			.finally(() => {
				setIsCalling(false);
			});
	}

	return (
		<Paper
			sx={{
				px: 2,
				display: "flex",
				justifyContent: "space-between",
				bgcolor: "primary.light",
			}}
			elevation={3}
			square
		>
			<Box
				sx={{
					px: 0.75,
					zIndex: 1,
					display: "flex",
					flexDirection: "row",
					minHeight: 70,
					alignItems: "center",
					":hover": {
						cursor: "pointer",
					},
				}}
				onClick={() => (location.href = "/")}
			>
				<GamesIcon
					sx={{
						pr: 2,
						color: "secondary.light",
						fontSize: 35,
					}}
				/>
				<Typography
					sx={{
						color: "#F2F8F2",
						":hover": {
							color: "#C1C6C1",
						},
					}}
					variant="h4"
				>
					{title.toUpperCase()}
				</Typography>
			</Box>
			{setupState.enableAi && (
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
					}}
				>
					<TextField
						size="small"
						label="Category"
						value={category}
						onChange={(e) => setCategory(e.target.value)}
					/>
					<Button
						sx={{
							color: "#F2F8F2",
							ml: 0.5,
						}}
						variant="outlined"
						disabled={isCalling}
						onClick={fetchGPTQuestions}
					>
						FETCH
					</Button>
				</Box>
			)}
			{isCalling && (
				<Backdrop
					sx={{
						color: "#fff",
						zIndex: (theme) => theme.zIndex.drawer + 1,
						display: "flex",
						flexDirection: "column",
					}}
					open
				>
					<Typography variant="h6" align="center">
						Optimizing hyperparameter-algorithms and neural networks
						for the ultimate trivia experience.
					</Typography>
					<CircularProgress
						sx={{ py: 2 }}
						size="4rem"
						color="inherit"
					/>
					<Typography variant="h6">Please wait</Typography>
				</Backdrop>
			)}
			{children}
		</Paper>
	);
}
