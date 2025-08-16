import { Box, Typography, List, ListItem, Button } from '@mui/material';

//Styles
const styles = {
    sets: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        mt: '0.5rem',
    },
    setButton: {
        color: 'inherit',
        borderRadius: '20px',
        backgroundColor: 'rgba(31, 202, 255, 0.3)',
        transition: 'all 0.3s',
        '&:hover': {
            backgroundColor: 'rgba(31, 202, 255, 0.5)',
        },
    },
};

export default function Sets({ sets, handleSetChange }) {
    return (
        <Box sx={styles.sets}>
            <Typography variant='h5' component='h2'>Sets:</Typography>
            <List>
                {sets.map((set) => {
                    return (
                        <ListItem key={set}>
                            <Button variant="contained" value={set} onClick={handleSetChange} sx={styles.setButton}>{set}</Button>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );
}
