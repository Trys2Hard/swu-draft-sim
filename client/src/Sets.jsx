import { Box, Typography, List, ListItem, Button } from '@mui/material';

const styles = {
    sets: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        mt: '0.5rem',
    },
    setButton: {
        backgroundColor: 'rgba(73, 73, 73, 1)',
        borderRadius: '6px',
        '&:hover': {
            filter: 'brightness(1.2)',
        }
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
                            <Button variant='contained' sx={styles.setButton} value={set} onClick={handleSetChange}>{set}</Button>
                        </ListItem>
                    )
                })}
            </List>
        </Box >
    )
}
