import { Box, Typography, List, ListItem, Button } from '@mui/material';
import DefaultButton from './DefaultButton';

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
                            <DefaultButton value={set} onClick={handleSetChange}>{set}</DefaultButton>
                        </ListItem>
                    )
                })}
            </List>
        </Box >
    )
}
