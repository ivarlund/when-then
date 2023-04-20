import { Box, Card, Typography } from "@mui/material";
import { useEffect } from "react";

export default function CountdownTimer({ time, setTime }: {
	time: number,
	setTime: (number: any) => void
}) {
	let outlineColor;

	if (time < 10) {
		outlineColor = 'red';
	} else if (time < 20) {
		outlineColor = 'orange';
	} else {
		outlineColor = 'green';
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