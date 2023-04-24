import AddIcon from "@mui/icons-material/Add";
import { Box, Button, TextField } from "@mui/material";

// DEPRECATED using setup.tsx instead
export function AddTeamComponent({ newTeam, shouldShowError, onChange, onClick }: {
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