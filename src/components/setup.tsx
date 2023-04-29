import {
	Box,
	Button,
	Card,
	Checkbox,
	FormControlLabel,
	IconButton,
	MenuItem,
	Select,
	SelectChangeEvent,
	TextField,
	Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/reducers";
import DeleteIcon from "@mui/icons-material/Delete";
import * as reducers from "@/slices/configSlice";
import { addTeamMap } from "@/slices/gameSlice";
import AddIcon from "@mui/icons-material/Add";
import { TeamOptions, Teams } from "@/data/types";

const colorMap: { [key: string]: string } = {
	"#BF616A": "Red",
	"#D08770": "Orange",
	"#EBCB8B": "Yellow",
	"#A3BE8C": "Green",
	"#B48EAD": "Purple",
	"#88C0D0": "Blue",
	"#CA69AE": "Pink",
};

export default function Setup() {
	const state = useSelector((state: RootState) => state.setup);
	const dispatch = useDispatch();

	const addTeamOnClick = () => {
		const teamIndex = state.teams.length + 1;
		dispatch(
			reducers.addTeam({ name: "Team " + teamIndex, color: "default" })
		);
	};

	function removeTeamOnClick(index: number) {
		dispatch(reducers.removeTeam(index));
	}

	function handleTeamNameChange(
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
		index: number
	) {
		const newTeamName = event.target.value;
		dispatch(reducers.updateTeamName({ index: index, name: newTeamName }));
	}

	function handleTeamColorChange(
		event: SelectChangeEvent<string>,
		index: number
	) {
		const newTeamColor = event.target.value;
		dispatch(
			reducers.updateTeamColor({ index: index, color: newTeamColor })
		);
	}

	function handleAiChange(event: React.ChangeEvent<HTMLInputElement>) {
		dispatch(reducers.updateEnableAi(event.target.checked));
	}

	// Should probably be moved to a selector
	function colorTaken(color: string) {
		return state.teams.some((team) => team.color === color);
	}

	// Should probably be moved to a selector
	function nameTaken(name: string) {
		const nameCount = state.teams.filter(
			(team) => team.name === name
		).length;
		return nameCount > 1;
	}

	function handleSubmit() {
		if (
			state.teams.length === 0 ||
			state.teams.some((team) => team.name === "") ||
			nameTaken("")
		) {
			return;
		}
		const teamsMap = state.teams.reduce((map: Teams, team: TeamOptions) => {
			const { name, color } = team;
			map[name.toLowerCase()] = { timeline: [], color };
			return map;
		}, {});
		dispatch(addTeamMap(teamsMap));
	}

	return (
		<>
			<Card sx={{ p: 2, my: 1 }}>
				<Typography align="center" variant="h4">
					Welcome to when-then
				</Typography>
				<Typography sx={{ py: 2 }} variant="h5">
					How many teams are playing?
				</Typography>
				<Box
					sx={{ display: "flex", flexDirection: "column" }}
					component="form"
					onSubmit={(event) => {
						event.preventDefault();
						handleSubmit();
					}}
				>
					<Box sx={{ mb: 1 }}>
						<FormControlLabel
							control={
								<Checkbox
									// disabled
									checked={state.enableAi}
									onChange={handleAiChange}
								/>
							}
							label="Enable epic AI question features"
						/>
						{/* <FormHelperText sx={{ mt: 0 }}>
                            This epic and tremendously experience-improving feature is only available to our premium members
                        </FormHelperText> */}
					</Box>
					<Box>
						<Button
							startIcon={<AddIcon />}
							disabled={state.teams.length >= 6}
							onClick={addTeamOnClick}
							variant="outlined"
						>
							Add team
						</Button>
					</Box>
					{state.teams.map((team, index) => (
						<Box key={index} sx={{ mt: 1, display: "flex" }}>
							<TextField
								sx={{ mr: 0.5, width: "50%" }}
								size="small"
								error={nameTaken(team.name)}
								helperText={
									nameTaken(team.name)
										? "Duplicate name!"
										: ""
								}
								variant="outlined"
								value={team.name}
								placeholder="Enter a team name"
								onChange={(event) =>
									handleTeamNameChange(event, index)
								}
							/>
							<Select
								sx={{
									width: "50%",
									height: "100%",
									backgroundColor: team.color,
									borderRadius: "4px",
								}}
								size="small"
								value={team.color}
								onChange={(event) =>
									handleTeamColorChange(event, index)
								}
								renderValue={(value) => {
									if (value === "default") {
										return <em>Select a color</em>;
									}
									return <em>{colorMap[value]}</em>;
								}}
							>
								<MenuItem value="default">
									<em>Select a color</em>
								</MenuItem>
								{Object.keys(colorMap).map((color) => (
									<MenuItem
										key={color}
										disabled={colorTaken(color)}
										sx={{ backgroundColor: color }}
										value={color}
									>
										{colorMap[color]}
									</MenuItem>
								))}
							</Select>
							<Box>
								<IconButton
									sx={{ ml: 1 }}
									onClick={() => removeTeamOnClick(index)}
								>
									<DeleteIcon />
								</IconButton>
							</Box>
						</Box>
					))}
					<Button
						fullWidth
						color="success"
						variant="contained"
						sx={{ mt: 1 }}
						type="submit"
					>
						Start game
					</Button>
				</Box>
			</Card>
		</>
	);
}
