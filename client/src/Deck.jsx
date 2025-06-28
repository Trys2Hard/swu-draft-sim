import { Box, Typography, List, ListItem } from '@mui/material';
import CardHover from './CardHover';
import useCardHoverPopover from './useCardHoverPopover';

export default function Deck({ deckLeaders, deckCards }) {
    const { anchorEl, hoveredCard, handlePopoverOpen, handlePopoverClose } = useCardHoverPopover('');

    //Styles
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
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
        },
        leaderCards: {
            width: '20%',
            m: '0.2rem',
            p: '0',
        },
        cards: {
            width: '100%',
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

    return (
        <Box sx={styles.deck}>
            <Typography variant='h3' component='h2' sx={{ mb: '1rem' }}>Deck</Typography>
            <Typography variant='h4' component='h3' sx={{ mb: '1rem' }}>Leaders</Typography>

            <List sx={styles.leaders}>
                {deckLeaders.map((card) => {
                    const labelId = `card-id-${card._id}`;
                    return (
                        <ListItem
                            aria-owns={open ? 'mouse-over-popover' : undefined}
                            aria-haspopup="true"
                            onMouseEnter={(e) => handlePopoverOpen(e, card)}
                            onMouseLeave={handlePopoverClose} key={card.id} sx={styles.leaderCards}>
                            <Box component='img' src={card.FrontArt} id={labelId} sx={styles.cardImage}></Box>
                        </ListItem>
                    )
                })}
            </List>

            <Typography variant='h4' component='h3' sx={{ mb: '1rem' }}>Cards</Typography>

            <List sx={styles.cards}>
                {deckCards.map((card) => {
                    const labelId = `card-id-${card._id}`;
                    return (
                        <ListItem
                            aria-owns={open ? 'mouse-over-popover' : undefined}
                            aria-haspopup="true"
                            onMouseEnter={(e) => handlePopoverOpen(e, card)}
                            onMouseLeave={handlePopoverClose} key={card.id} sx={styles.nonLeaderCards}>
                            <Box component='img' src={card.FrontArt} id={labelId} sx={styles.cardImage}></Box>
                        </ListItem>
                    )
                })}
                <CardHover
                    anchorEl={anchorEl}
                    hoveredCard={hoveredCard}
                    onHoverClose={handlePopoverClose} />
            </List>
        </Box>
    );
};
