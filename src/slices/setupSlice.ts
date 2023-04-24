import { SetupState, TeamOptions } from "@/data/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: SetupState = {
    teams: [{
        color: "default",
        name: "Team 1",
    },
    {
        color: "default",
        name: "Team 2",
    },
    ],
    enableAi: false
}

const setupSlice = createSlice({
    name: "setup",
    initialState,
    reducers: {
        addTeam(state, action: PayloadAction<TeamOptions>) {
            const newTeam = {
                ...action.payload,
                timeline: []
            };
            state.teams.push(newTeam);
        },
        removeTeam(state, action: PayloadAction<number>) {
            state.teams = state.teams.filter((team, index) => index !== action.payload);
        },
        updateTeamName(state, action: PayloadAction<{ index: number, name: string }>) {
            const { index, name } = action.payload;
            state.teams[index] = { ...state.teams[index], name };
        },
        updateTeamColor(state, action: PayloadAction<{ index: number, color: string }>) {
            const { index, color } = action.payload;
            state.teams[index] = { ...state.teams[index], color };
        },
        updateEnableAi(state, action: PayloadAction<boolean>) {
            state.enableAi = action.payload;
        }
    }
});

export const {
    addTeam,
    removeTeam,
    updateTeamName,
    updateTeamColor,
    updateEnableAi
} = setupSlice.actions;

export default setupSlice.reducer;