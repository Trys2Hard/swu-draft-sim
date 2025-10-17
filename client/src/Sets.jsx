import { Box, Typography, List, ListItem, Button } from '@mui/material';

export default function Sets({ cardSet, handleSetChange }) {
const cardSets = ['lof', 'sec'];

//Styles
const styles = {
    cardSets: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
    },
    cardSetButton: {
        color: 'inherit',
        borderRadius: '20px',
        backgroundColor: 'rgba(31, 202, 255, 0.3)',
        transition: 'all 0.3s',
        '&:hover': {
            backgroundColor: 'rgba(31, 202, 255, 0.5)',
        },
    },
};

    return (
        <Box sx={styles.cardSets}>
            <Typography variant='h5' component='h2'>Sets:</Typography>
            <List>
                {cardSets.map((cardSet) => {
                    return (
                        <ListItem key={cardSet}>
                            <Button variant="contained" value={cardSet} onClick={handleSetChange} sx={styles.cardSetButton}>{cardSet}</Button>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );
}
