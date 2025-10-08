import { Box, Typography, List, ListItem, Button } from '@mui/material';
import CardHover from './CardHover';
import useCardHoverPopover from './useCardHoverPopover';
import CopyJsonButton from './CopyJsonButton';

export default function Deck({ deckLeaders, deckCards, setDeckLeaders, setDeckCards, setSideboardLeaders, setSideboardCards, setLeaderPacks, setCardPacks }) {
    const { anchorEl, hoveredCard, handlePopoverOpen, handlePopoverClose } = useCardHoverPopover('');

    const sortedDeckCards = [...deckCards].sort((a, b) => a.cardObj?.cardData?.Cost - b.cardObj?.cardData?.Cost);

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
        if (!addCard) return;

        addCard((prev) => [...prev, pickedCard]);
    }

    function moveToSealedPool(id) {
        handlePopoverClose();

        let pickedCard = deckLeaders.find((card) => card.id === id) || deckCards.find((card) => card.id === id);
        if (!pickedCard) return;

        const isLeader = pickedCard.cardObj?.cardData?.Type === 'Leader';

        const stateToUpdate = isLeader ? deckLeaders : deckCards;
        const setStateToUpdate = isLeader ? setDeckLeaders : setDeckCards;

        const updatedDeck = stateToUpdate.filter((card) => card.id !== id);
        setStateToUpdate(updatedDeck)

        const addCard = isLeader ? setLeaderPacks : setCardPacks;
        if (!addCard) return;

        addCard((prev) => [...prev, pickedCard]);
    }

    //Styles
    const styles = {
        deck: {
            color: 'white',
            background: 'linear-gradient(to right, rgba(31, 202, 255, 0.2), rgba(31, 202, 255, 0.3), rgba(31, 202, 255, 0.2))',
            width: '95%',
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
                outline: '2px solid rgb(61, 178, 255)',
            },
        },
    };

    return (
        <>
            <Box sx={styles.deck}>
                <Typography variant='h4' component='h2' sx={{ mb: '1rem' }}>Deck</Typography>
                {deckLeaders.length > 0 && <Typography variant='h4' component='h3' sx={{ mb: '0.5rem' }}>Leaders</Typography>}

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
                                onClick={() => { moveToSideboard(card.id); moveToSealedPool(card.id) }}>
                                <Box component='img' src={card.cardObj?.cardData?.FrontArt} id={labelId} sx={styles.cardImage} />
                            </ListItem>
                        )
                    })}
                </List>

                {deckCards.length > 0 && <Typography variant='h4' component='h3' sx={{ m: '1rem auto 0.5rem auto' }}>Cards</Typography>}

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
                                onClick={() => { moveToSideboard(card.id); moveToSealedPool(card.id) }}>
                                <Box component='img' src={card.cardObj?.cardData?.FrontArt} id={labelId} sx={styles.cardImage} />
                            </ListItem>
                        )
                    })}
                    <CardHover
                        anchorEl={anchorEl}
                        hoveredCard={hoveredCard}
                        onHoverClose={handlePopoverClose} />
                </List>
                <CopyJsonButton
                    deckLeaders={deckLeaders}
                    sortedDeckCards={sortedDeckCards} />
            </Box>
        </>
    );
}
