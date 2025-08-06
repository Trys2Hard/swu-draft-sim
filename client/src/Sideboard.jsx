import { Box, Typography, List, ListItem } from '@mui/material';
import CardHover from './CardHover';
import useCardHoverPopover from './useCardHoverPopover';

export default function Sideboard({ sideboardLeaders, sideboardCards }) {
    const { anchorEl, hoveredCard, handlePopoverOpen, handlePopoverClose } = useCardHoverPopover('');

    // const sortedDeckCards = [...deckCards].sort((a, b) => a.cardObj?.cardData?.Number - b.cardObj?.cardData?.Number);

    console.log(sideboardLeaders)

    //Styles
    const styles = {
        sideboard: {
            color: 'white',
            backgroundColor: 'rgba(31, 202, 255, 0.5)',
            width: '60%',
            height: '100%',
            m: '5rem auto 0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: '5px',
            p: '0.5rem',
        },
        leaders: {
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            backdropFilter: sideboardLeaders.length > 0 && 'brightness(0.7)',
            borderRadius: '5px',
            gap: '1rem',
        },
        leaderCards: {
            width: '20%',
            p: '0',
        },
        cards: {
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            backdropFilter: sideboardCards.length > 0 && 'brightness(0.7)',
            borderRadius: '5px',
            gap: '0.5rem',
        },
        nonLeaderCards: {
            width: '13%',
            m: '0',
            p: '0',
        },
        cardImage: {
            width: '100%',
            borderRadius: '10px',
        }
    };

    return (
        <Box sx={styles.sideboard}>
            <Typography variant='h3' component='h2' sx={{ mb: '1rem' }}>Sideboard</Typography>
            {sideboardLeaders.length > 0 && <Typography variant='h4' component='h3'>Leaders</Typography>}

            <List sx={styles.leaders}>
                {sideboardLeaders.map((card) => {
                    const labelId = `card-id-${card.id}`;
                    return (
                        <ListItem
                            aria-owns={open ? 'mouse-over-popover' : undefined}
                            aria-haspopup="true"
                            onMouseEnter={(e) => handlePopoverOpen(e, card)}
                            onMouseLeave={handlePopoverClose}
                            key={labelId}
                            sx={styles.leaderCards}>
                            <Box component='img' src={card.cardObj?.cardData?.FrontArt} id={labelId} sx={styles.cardImage}></Box>
                        </ListItem>
                    )
                })}
            </List>

            {sideboardCards.length > 0 && <Typography variant='h4' component='h3' sx={{ mt: '1rem' }}>Cards</Typography>}

            <List sx={styles.cards}>
                {sideboardCards.map((card) => {
                    const labelId = `card-id-${card.id}`;
                    return (
                        <ListItem
                            aria-owns={open ? 'mouse-over-popover' : undefined}
                            aria-haspopup="true"
                            onMouseEnter={(e) => handlePopoverOpen(e, card)}
                            onMouseLeave={handlePopoverClose} key={labelId} sx={styles.nonLeaderCards}>
                            <Box component='img' src={card.cardObj?.cardData?.FrontArt} id={labelId} sx={styles.cardImage}></Box>
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
