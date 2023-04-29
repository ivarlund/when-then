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
						<Typography variant="h6">Spelets mål</Typography>
						<Typography>
							Att bli först med att samla på sig 10st frågekort
							genom att placera händelser, personer, platser och
							prylar i rätt ordning i förhållande till de kort som
							man redan har framför sig.
						</Typography>
						<Divider sx={{ my: 2 }} />
						<Typography variant="h6">Spelets gång</Typography>
						<Typography gutterBottom>
							En av spelarna slår den färgade tärningen och
							spelaren till vänster läser upp frågan från det
							översta kortet av den kategori som motsvaras av
							färgen. Nu ska den aktive spelaren försöka placera
							kortet tidsmässigt korrekt i förhållande till de
							kort som man redan har på sin tidslinje (både
							ovanför och under tidlåset).
						</Typography>
						<Typography gutterBottom>
							Lyckas en spelare placera frågekortet korrekt på sin
							tidslinje så behåller personen kortet framför sig –
							ovanför sitt tidlås. Vill spelaren försöka svara
							rätt på ytterligare en fråga så slår denne tärningen
							igen.
						</Typography>
						<Typography gutterBottom>
							Om en spelare placerar frågekortet fel så förlorar
							denne samtliga kort som ligger ovanför tidlåset.
							Spelaren till vänster om frågeläsaren får därefter
							en chans att placera kortet rätt efter sin egen
							tidslinje. Spelet fortsätter därefter som vanligt
							med att nästa spelare i turordningen får slå
							tärningen och försöka placera åtminstone ett
							frågekort.
						</Typography>
						<Typography gutterBottom>
							När en spelare väljer att avsluta sin tur och inte
							längre vill försöka placera fler frågor, tar denne
							samtliga av sina frågekort som ligger ovanför
							tidlåset och placerar dessa under låset istället.
							Turen går därefter vidare till nästa person i
							medsols ordning.
						</Typography>
						<Typography>
							Den spelare som blir först med att samla 10st
							frågekort under sitt tidlås har vunnit.
						</Typography>
					</Card>
				</Container>
			</Paper>
		</Drawer>
	);
}
