import { Box, Typography, List, ListItem, Button } from '@mui/material';
import StartButton from './StartButton';

const styles = {
    sets: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        mt: '0.5rem',
    },
};

export default function Sets({ sets, handleSetChange }) {
    return (
        <Box sx={styles.sets}>
            <Typography variant='h4' component='h2'>Sets:</Typography>
            <List>
                {sets.map((set) => {
                    return (
                        <ListItem key={set}>
                            <StartButton value={set} onClick={handleSetChange}>{set}</StartButton>
                        </ListItem>
                    )
                })}
            </List>
        </Box >
    )
}
