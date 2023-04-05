import { Box, Paper, Typography } from "@mui/material"
import GamesIcon from '@mui/icons-material/Games';

export default function Header({ title, children }: { title: string, children?: React.ReactNode }) {
    return (
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
                    {title.toUpperCase()}
                </Typography>
            </Box>
            {children}
        </Paper>
    )
}