import { Box, Button, Card, Slider, Stack, Typography } from "@mui/material";

export default function YearSelector({
	disabled,
	handleChange,
	changeValue,
	value,
	minValue,
	maxValue,
}: {
	disabled: boolean;
	handleChange: (event: Event, newGuess: number | number[]) => void;
	changeValue: (change: number) => void;
	value: number;
	minValue: number;
	maxValue: number;
}) {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				py: 2,
			}}
		>
			<Box sx={{ display: "flex", justifyContent: "center" }}>
				<Card sx={{ p: 1, width: 237 }} variant="outlined">
					<Typography align="center" variant="h2">
						{value < 0
							? value.toString().substring(1) + " BC"
							: value}
					</Typography>
				</Card>
			</Box>
			<Stack
				spacing={2}
				direction="row"
				sx={{ mb: 1 }}
				alignItems="center"
			>
				<Button
					sx={{ fontSize: "1.5rem" }}
					disabled={disabled}
					variant="outlined"
					onClick={() => changeValue(value - 1)}
				>
					-
				</Button>
				<Typography sx={{ px: 2, whiteSpace: "nowrap" }}>
					{minValue.toString().substring(1) + " BC"}
				</Typography>
				<Slider
					disabled={disabled}
					aria-label="Volume"
					value={value as number}
					onChange={handleChange}
					min={minValue}
					max={maxValue}
				/>
				<Typography sx={{ px: 2, whiteSpace: "nowrap" }}>
					{maxValue + " AD"}
				</Typography>
				<Button
					sx={{ fontSize: "1.5rem" }}
					disabled={disabled}
					variant="outlined"
					onClick={() => changeValue(value + 1)}
				>
					+
				</Button>
			</Stack>
		</Box>
	);
}
