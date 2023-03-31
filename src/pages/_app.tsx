import type { AppProps } from 'next/app'
import { Provider } from 'react-redux';
import store from '../store';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Container } from '@mui/system';
import { createTheme, ThemeProvider } from '@mui/material';

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

	return (
		<Provider store={store} >
			<ThemeProvider theme={theme}>
				<Container>
					<Component {...pageProps} />
				</Container>
			</ThemeProvider>
		</Provider>
	)
}
