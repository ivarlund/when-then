import {
	Card,
	Container,
	Divider,
	Drawer,
	Paper,
	Typography,
} from "@mui/material";

export default function RulesDrawer({
	isOpen,
	setIsOpen,
}: {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
}) {
	function toggleDrawer(open: boolean) {
		return (event: React.KeyboardEvent | React.MouseEvent) => {
			if (
				event.type === "keydown" &&
				((event as React.KeyboardEvent).key === "Tab" ||
					(event as React.KeyboardEvent).key === "Shift")
			) {
				return;
			}
			setIsOpen(open);
		};
	}

	return (
		<Drawer
			anchor="top"
			variant="temporary"
			open={isOpen}
			onClose={toggleDrawer(false)}
		>
			<Paper sx={{ p: 2, bgcolor: "#ECEFF4" }} square>
				<Container>
					<Card sx={{ px: 3, py: 2 }} variant="outlined">
						<Typography variant="h6">Goal of the game</Typography>
						<Typography>
							To be the first to collect 10 question cards by placing events, people, places, and objects in the correct order relative to the cards already in front of you.
						</Typography>
						<Divider sx={{ my: 2 }} />
						<Typography variant="h6">Gameplay</Typography>
						<Typography gutterBottom>
							One of the players rolls the colored die, and the player to the left reads the question from the top card of the category corresponding to the color. Now, the active player tries to place the card in the correct chronological order relative to the cards already on their timeline (both above and below the timeline).
						</Typography>
						<Typography gutterBottom>
							If a player successfully places the question card correctly on their timeline, they keep the card in front of them, above their timeline. If the player wants to try to answer another question correctly, they roll the die again.
						</Typography>
						<Typography gutterBottom>
							If a player places the question card incorrectly, they lose all the cards above their timeline. The player to the left of the question reader then gets a chance to place the card correctly according to their own timeline. The game continues as usual with the next player in turn rolling the die and attempting to place at least one question card.
						</Typography>
						<Typography gutterBottom>
							When a player chooses to end their turn and no longer wants to attempt placing more questions, they take all their question cards above the timeline and place them under the lock instead. The turn then passes to the next person in clockwise order.
						</Typography>
						<Typography>
							The player who collects 10 question cards under their timeline first wins.
						</Typography>
					</Card>
				</Container>
			</Paper>
		</Drawer>
	);
}
