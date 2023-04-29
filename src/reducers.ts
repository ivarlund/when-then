import { combineReducers } from "@reduxjs/toolkit";
import gameReducer from "./slices/gameSlice";
import setupReducer from "./slices/configSlice";

const rootReducer = combineReducers({
	game: gameReducer,
	setup: setupReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;