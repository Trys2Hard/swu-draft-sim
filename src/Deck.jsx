import { Box, Typography } from '@mui/material';

const styles = {
    deck: {
        border: '2px dashed blue',
        width: '80%',
        height: '100%',
        m: '0 auto 0 auto',
    },
    card: {
        border: '1px dashed green',
    },
};

export default function Deck({ deckLeaders, deckCards }) {
    return (
        <Box sx={styles.deck}>
            <Typography variant='h3' component='h2'>Deck</Typography>
            <Box>
                <Typography variant='h4' component='h3'>Leaders</Typography>
                {deckLeaders.map((card) => {
                    return <Box key={card.id} sx={styles.card}>{card.name}</Box>
                })}
            </Box>
            <Box>
                <Typography variant='h4' component='h3'>Cards</Typography>
                {deckCards.map((card) => {
                    return <Box key={card.id} sx={styles.card}>{card.name}</Box>
                })}
            </Box>
        </Box>
    );
};
