import { ConfigState, TeamOptions } from "@/data/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ConfigState = {
	teams: [
		{
			color: "default",
			name: "Team 1",
		},
		{
			color: "default",
			name: "Team 2",
		},
	],
	enableAi: false,
	isCallingService: false,
};

const configSlice = createSlice({
	name: "setup",
	initialState,
	reducers: {
		addTeam(state, action: PayloadAction<TeamOptions>) {
			const newTeam = {
				...action.payload,
				timeline: [],
			};
			state.teams.push(newTeam);
		},
		removeTeam(state, action: PayloadAction<number>) {
			state.teams = state.teams.filter(
				(team, index) => index !== action.payload
			);
			// state.teams = state.teams.splice(action.payload, 1);
		},
		updateTeamName(
			state,
			action: PayloadAction<{ index: number; name: string }>
		) {
			const { index, name } = action.payload;
			state.teams[index] = { ...state.teams[index], name };
		},
		updateTeamColor(
			state,
			action: PayloadAction<{ index: number; color: string }>
		) {
			const { index, color } = action.payload;
			state.teams[index] = { ...state.teams[index], color };
		},
		updateEnableAi(state, action: PayloadAction<boolean>) {
			state.enableAi = action.payload;
		},
		updateIsCallingService(state, action: PayloadAction<boolean>) {
			state.isCallingService = action.payload;
		},
	},
});

export const {
	addTeam,
	removeTeam,
	updateTeamName,
	updateTeamColor,
	updateEnableAi,
} = configSlice.actions;

export default configSlice.reducer;
