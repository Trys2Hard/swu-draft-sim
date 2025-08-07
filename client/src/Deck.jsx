import { Box, Typography, List, ListItem } from '@mui/material';
import CardHover from './CardHover';
import useCardHoverPopover from './useCardHoverPopover';
import Sideboard from './Sideboard';
import { useState } from 'react';

export default function Deck({ deckLeaders, deckCards, setDeckLeaders, setDeckCards }) {
    const { anchorEl, hoveredCard, handlePopoverOpen, handlePopoverClose } = useCardHoverPopover('');

    const [sideboardLeaders, setSideboardLeaders] = useState([]);
    const [sideboardCards, setSideboardCards] = useState([]);

    const sortedDeckCards = [...deckCards].sort((a, b) => a.cardObj?.cardData?.Number - b.cardObj?.cardData?.Number);

    function moveToSideboard(id) {
        handlePopoverClose();

        let pickedCard = deckLeaders.find((card) => card.id === id) || deckCards.find((card) => card.id === id);
        if (!pickedCard) return;

        const isLeader = pickedCard.cardObj?.cardData?.Type === 'Leader';

        const stateToUpdate = isLeader ? deckLeaders : deckCards;
        const setStateToUpdate = isLeader ? setDeckLeaders : setDeckCards;

        const updatedDeck = stateToUpdate.filter((card) => card.id !== id);
        setStateToUpdate(updatedDeck)

        const addCard = isLeader ? setSideboardLeaders : setSideboardCards;

        addCard((prev) => [...prev, pickedCard]);
    }

    //Styles
    const styles = {
        deck: {
            color: 'white',
            backgroundColor: 'rgba(31, 202, 255, 0.5)',
            width: '60%',
            height: '100%',
            m: '0 auto 0 auto',
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
            backdropFilter: deckLeaders.length > 0 && 'brightness(0.7)',
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
            backdropFilter: deckCards.length > 0 && 'brightness(0.7)',
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
                outline: '3px solid rgb(61, 178, 255)',
            },
        }
    };

    return (
        <>
            <Box sx={styles.deck}>
                <Typography variant='h3' component='h2' sx={{ mb: '1rem' }}>Deck</Typography>
                {deckLeaders.length > 0 && <Typography variant='h4' component='h3'>Leaders</Typography>}

                <List sx={styles.leaders}>
                    {deckLeaders.map((card) => {
                        const labelId = `card-id-${card.id}`;
                        return (
                            <ListItem
                                aria-owns={open ? 'mouse-over-popover' : undefined}
                                aria-haspopup="true"
                                onMouseEnter={(e) => handlePopoverOpen(e, card)}
                                onMouseLeave={handlePopoverClose}
                                key={labelId}
                                sx={styles.leaderCards}
                                onClick={() => moveToSideboard(card.id)}>
                                <Box component='img' src={card.cardObj?.cardData?.FrontArt} id={labelId} sx={styles.cardImage}></Box>
                            </ListItem>
                        )
                    })}
                </List>

                {deckCards.length > 0 && <Typography variant='h4' component='h3' sx={{ mt: '1rem' }}>Cards</Typography>}

                <List sx={styles.cards}>
                    {sortedDeckCards.map((card) => {
                        const labelId = `card-id-${card.id}`;
                        return (
                            <ListItem
                                aria-owns={open ? 'mouse-over-popover' : undefined}
                                aria-haspopup="true"
                                onMouseEnter={(e) => handlePopoverOpen(e, card)}
                                onMouseLeave={handlePopoverClose}
                                key={labelId}
                                sx={styles.nonLeaderCards}
                                onClick={() => moveToSideboard(card.id)}>
                                <Box component='img' src={card.cardObj?.cardData?.FrontArt} id={labelId} sx={styles.cardImage} />
                            </ListItem>
                        )
                    })}
                    <CardHover
                        anchorEl={anchorEl}
                        hoveredCard={hoveredCard}
                        onHoverClose={handlePopoverClose} />
                </List>
            </Box >
            <Sideboard
                sideboardLeaders={sideboardLeaders}
                setSideboardLeaders={setSideboardLeaders}
                setSideboardCards={setSideboardCards}
                sideboardCards={sideboardCards}
                setDeckLeaders={setDeckLeaders}
                setDeckCards={setDeckCards} />
        </>
    );
};
