import { Box, Typography, List, ListItem } from '@mui/material';

const styles = {
    deck: {
        color: 'white',
        backgroundColor: 'rgba(55, 55, 55, 1)',
        width: '80%',
        height: '100%',
        m: '0 auto 0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: '5px',
    },
    leaders: {
        display: 'flex',
        justifyContent: 'center',
    },
    leaderCards: {
        width: '20%',
        m: '0.2rem',
        p: '0',
    },
    cards: {
        display: 'flex',
        flexWrap: 'wrap',

    },
    nonLeaderCards: {
        width: '10%',
        m: '0.2rem',
        p: '0',
    },
    cardImage: {
        width: '100%',
        borderRadius: '10px',
    }
};

export default function Deck({ deckLeaders, deckCards }) {
    return (
        <Box sx={styles.deck}>
            <Typography variant='h3' component='h2' sx={{ mb: '1rem' }}>Deck</Typography>
            <Typography variant='h4' component='h3' sx={{ mb: '1rem' }}>Leaders</Typography>

            <List sx={styles.leaders}>
                {deckLeaders.map((card) => {
                    return (
                        <ListItem key={card.id} sx={styles.leaderCards}>
                            <Box component='img' src={card.FrontArt} sx={styles.cardImage}></Box>
                        </ListItem>
                    )
                })}
            </List>

            <Typography variant='h4' component='h3' sx={{ mb: '1rem' }}>Cards</Typography>

            <List sx={styles.cards}>
                {deckCards.map((card) => {
                    return (
                        <ListItem key={card.id} sx={styles.nonLeaderCards}>
                            <Box component='img' src={card.FrontArt} sx={styles.cardImage}></Box>
                        </ListItem>
                    )
                })}
            </List>
        </Box>
    );
};
