import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import { Provider } from "react-redux";
import store from "@/store";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Container } from "@mui/system";
import { Button, createTheme, ThemeProvider } from "@mui/material";
import { useState } from "react";
import RulesDrawer from "@/components/rulesDrawer";
import Header from "@/components/header";
import Head from "next/head";

const theme = createTheme({
	palette: {
		primary: {
			dark: "#4B6789",
			main: "#5E81AC",
			light: "#81A1C1"
		},
		secondary: {
			dark: "#A89164",
			main: "#d3b67d",
			light: "#EBCB8B"
		},
		text: {
			primary: "#2E3440",
			secondary: "#434C5E"
		}
	}
});

export default function App({ Component, pageProps }: AppProps) {
	// Why the heck did i put the rulesdrawer here?
	const [rulesDrawerOpen, setRulesDrawerOpen] = useState(false);

	return (
		<>
			<Provider store={store}>
				<Head>
					<title>When then</title>
					<meta name="description" content="Well, when then?" />
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1"
					/>
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<ThemeProvider theme={theme}>
					<RulesDrawer
						isOpen={rulesDrawerOpen}
						setIsOpen={setRulesDrawerOpen}
					/>
					<Header title="When then?">
						<Button
							sx={{ my: 2, color: "#F2F8F2" }}
							onClick={() => setRulesDrawerOpen(true)}
							variant="outlined"
						>
							Show rules
						</Button>
					</Header>
					<Container>
						<Component {...pageProps} />
					</Container>
				</ThemeProvider>
			</Provider>
			<Analytics />
		</>
	);
}
