import { Backdrop, Box, Button, CircularProgress, Paper, TextField, Typography } from "@mui/material"
import { useDispatch, useSelector } from "react-redux";
import * as reducers from "@/slices/gameSlice";

import GamesIcon from "@mui/icons-material/Games";
import { useState } from "react";
import { parseQuestions } from "@/helpers/helperFunctions";
import { RootState } from "@/reducers";

export default function Header({ title, children }: { title: string, children?: React.ReactNode }) {
    const setupState = useSelector((state: RootState) => state.setup);
    const dispatch = useDispatch();
    const [isCalling, setIsCalling] = useState<boolean>(false);
    const [category, setCategory] = useState<string>('Movies');
    
    // This fetching logic should be moved outside to a logics file
    function fetchGPTQuestions() {
        setIsCalling(true);
        fetch("/api/questionGenerator", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{
                    role: "user",
                    content: `\"Generate 10 questions ${'about ' + category} in the following format: {\"id\": <unique_id>,\"question\": \"In what year was <random_event>?\",\"answer\": <random_year>,\"description\": \"<random_event> took place in <random_year>.\"}\"`
                }],
                temperature: 0.7
            })
        })
            .then(async res => {
                if (res.status === 200) {
                    const questions = await res.json();
                    const parsedQuestions = parseQuestions(questions.choices[0].message.content);
                    console.log('INDEX', questions.choices[0].message.content);
                    console.log('PARSED', parsedQuestions);
                    dispatch(reducers.updateFreshQuestions(parsedQuestions));
                }
                setIsCalling(false);
            })
            .catch(err => {
                setIsCalling(false);
                console.log(err)
            });
    
    }

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
                    minHeight: 70,
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
            {setupState.enableAi &&
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextField size="small" label="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
                    <Button variant="text" sx={{ color: '#F2F8F2' }} disabled={isCalling} onClick={fetchGPTQuestions}>FETCH</Button>
                </Box>
            }
            {isCalling && (
                <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, display: 'flex', flexDirection: 'column' }} open>
                    <Typography variant="h6" align="center">
                        Optimizing hyperparameter-algorithms and neural networks for the ultimate trivia experience.
                    </Typography>
                    <CircularProgress sx={{ py: 2 }} size="4rem" color="inherit" />
                    <Typography variant="h6">
                        Please wait
                    </Typography>
                </Backdrop>
            )}
            {children}
        </Paper>
    )
}