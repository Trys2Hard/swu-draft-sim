import { Box, Typography, List, ListItem } from '@mui/material';
import CardHover from './CardHover';
import useCardHoverPopover from './useCardHoverPopover';

export default function Sideboard({ sideboardLeaders, sideboardCards, setDeckLeaders, setDeckCards, setSideboardLeaders, setSideboardCards }) {
    const { anchorEl, hoveredCard, handlePopoverOpen, handlePopoverClose } = useCardHoverPopover('');

    const sortedSideboardCards = [...sideboardCards].sort((a, b) => a.cardObj?.cardData?.Number - b.cardObj?.cardData?.Number);

    function moveToDeck(id) {
        handlePopoverClose();

        let pickedCard = sideboardLeaders.find((card) => card.id === id) || sideboardCards.find((card) => card.id === id);
        if (!pickedCard) return;

        const isLeader = pickedCard.cardObj?.cardData?.Type === 'Leader';

        const stateToUpdate = isLeader ? sideboardLeaders : sideboardCards;
        const setStateToUpdate = isLeader ? setSideboardLeaders : setSideboardCards;

        const updatedSideboard = stateToUpdate.filter((card) => card.id !== id);
        setStateToUpdate(updatedSideboard)

        const addCard = isLeader ? setDeckLeaders : setDeckCards;

        addCard((prev) => [...prev, pickedCard]);
    }

    //Styles
    const styles = {
        sideboard: {
            color: 'white',
            background: 'linear-gradient(to right, rgba(31, 202, 255, 0.2), rgba(31, 202, 255, 0.3), rgba(31, 202, 255, 0.2))',
            width: '95%',
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
            '&: hover': {
                cursor: 'pointer',
                outline: '2px solid rgb(61, 178, 255)',
            },
        }
    };

    return (
        <Box sx={styles.sideboard}>
            <Typography variant='h4' component='h2' sx={{ mb: '1rem' }}>Sideboard</Typography>
            {sideboardLeaders.length > 0 && <Typography variant='h4' component='h3' sx={{ mb: '0.5rem' }}>Leaders</Typography>}

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
                            sx={styles.leaderCards}
                            onClick={() => moveToDeck(card.id)}>
                            <Box component='img' src={card.cardObj?.cardData?.FrontArt} id={labelId} sx={styles.cardImage}></Box>
                        </ListItem>
                    )
                })}
            </List>

            {sideboardCards.length > 0 && <Typography variant='h4' component='h3' sx={{ m: '1rem auto 0.5rem auto' }}>Cards</Typography>}

            <List sx={styles.cards}>
                {sortedSideboardCards.map((card) => {
                    const labelId = `card-id-${card.id}`;
                    return (
                        <ListItem
                            aria-owns={open ? 'mouse-over-popover' : undefined}
                            aria-haspopup="true"
                            onMouseEnter={(e) => handlePopoverOpen(e, card)}
                            onMouseLeave={handlePopoverClose}
                            key={labelId}
                            sx={styles.nonLeaderCards}
                            onClick={() => moveToDeck(card.id)}>
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
}
