import "@/styles/globals.css"
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux';
import store from '../store';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Container } from '@mui/system';
import { Box, Button, createTheme, Drawer, Paper, ThemeProvider, Typography } from '@mui/material';
import GamesIcon from '@mui/icons-material/Games';
import { useState } from "react";

const theme = createTheme({
	palette: {
		primary: {
			dark: "#4B6789",
			main: "#5E81AC",
			light: "#81A1C1",
		},
		secondary: {
			dark: "#A89164",
			main: "#d3b67d",
			light: "#EBCB8B",
		},
		text: {
			primary: '#2E3440',
			secondary: '#434C5E'
		}
	}
});

export default function App({ Component, pageProps }: AppProps) {
	const [rulesDrawerOpen, setRulesDrawerOpen] = useState(false);

	function toggleDrawer(open: boolean) {
		return (event: React.KeyboardEvent | React.MouseEvent) => {
			if (event.type === 'keydown' &&
				((event as React.KeyboardEvent).key === 'Tab' ||
					(event as React.KeyboardEvent).key === 'Shift')) {
				return;
			}

			setRulesDrawerOpen(open);
		};
	}

	return (
		<Provider store={store} >
			<ThemeProvider theme={theme}>
				{/* <Paper square > */}
				<Drawer anchor="top" variant="temporary" open={rulesDrawerOpen} onClose={toggleDrawer(false)}>
					<Paper sx={{ p: 2, bgcolor: '#ECEFF4' }} square>
						<Typography variant="h6">Spelets mål</Typography>
						<Typography>
							Att bli först med att samla på sig 10st frågekort genom att placera händelser, personer, platser och prylar i rätt ordning i förhållande till de kort som man redan har framför sig.
						</Typography>
						<Typography variant="h6">
							Spelets gång
						</Typography>
						<Typography>
							En av spelarna slår den färgade tärningen och spelaren till vänster läser upp frågan från det översta kortet av den kategori som motsvaras av färgen. Nu ska den aktive spelaren försöka placera kortet tidsmässigt korrekt i förhållande till de kort som man redan har på sin tidslinje (både ovanför och under tidlåset).
						</Typography>
						<Typography>
							Lyckas en spelare placera frågekortet korrekt på sin tidslinje så behåller personen kortet framför sig – ovanför sitt tidlås. Vill spelaren försöka svara rätt på ytterligare en fråga så slår denne tärningen igen.
						</Typography>
						<Typography>
							Om en spelare placerar frågekortet fel så förlorar denne samtliga kort som ligger ovanför tidlåset. Spelaren till vänster om frågeläsaren får därefter en chans att placera kortet rätt efter sin egen tidslinje. Spelet fortsätter därefter som vanligt med att nästa spelare i turordningen får slå tärningen och försöka placera åtminstone ett frågekort.
						</Typography>
						<Typography>
							När en spelare väljer att avsluta sin tur och inte längre vill försöka placera fler frågor, tar denne samtliga av sina frågekort som ligger ovanför tidlåset och placerar dessa under låset istället. Turen går därefter vidare till nästa person i medsols ordning.
						</Typography>
						<Typography>
							Den spelare som blir först med att samla 10st frågekort under sitt tidlås har vunnit.
						</Typography>
					</Paper>
				</Drawer>
				<Paper sx={{
					px: 2,
					display: 'flex',
					justifyContent: 'space-between',
					bgcolor: 'primary.light',
				}} elevation={3} square>
					<Box
						onClick={function () {
							location.href = '/'
						}}
						sx={{
							px: 0.75,
							zIndex: 1,
							display: 'flex',
							flexDirection: 'row',
							height: 70,
							alignItems: 'center',
							':hover': {
								cursor: 'pointer'
							}
						}}>
						<GamesIcon
							sx={{
								pr: 2,
								color: 'secondary.light',
								fontSize: 35
							}}
						/>
						<Typography variant="h4"
							sx={{
								color: '#F2F8F2',
								':hover': {
									color: '#C1C6C1'
								}
							}}>
							{'When, then?'.toUpperCase()}
						</Typography>
					</Box>
					<Button sx={{ my: 2, color: '#F2F8F2' }} onClick={toggleDrawer(true)} variant="outlined">
						Show rules
					</Button>
				</Paper>
				<Container>
					<Component {...pageProps} />
				</Container>
				{/* </Paper> */}
			</ThemeProvider>
		</Provider>
	)
}
