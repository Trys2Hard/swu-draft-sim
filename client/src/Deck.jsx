import { Box, Typography, Grid } from '@mui/material';
import CardHover from './CardHover';
import useCardHoverPopover from './useCardHoverPopover';
import CopyJsonButton from './CopyJsonButton';

export default function Deck({ deckLeaders, deckCards, setDeckLeaders, setDeckCards, setSideboardLeaders, setSideboardCards, setLeaderPacks, setCardPacks, draftStarted, sealedStarted }) {
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
            backgroundColor: 'rgba(31, 202, 255, 0.2)',
            width: { xs: '100%', md: '900px' },
            height: '100%',
            m: '1rem auto 0 auto',
            display: !draftStarted && !sealedStarted ? 'none' : 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: { md: '0', lg: '10px' },
            p: '0.5rem',
        },
        leaders: {
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
        },
        leaderCard: {
            width: '100%',
            borderRadius: '5%',
            cursor: 'pointer',
            '&: hover': {
                outline: '2px solid rgba(61, 178, 255, 1)',
                boxShadow: '0 0 18px rgba(61, 178, 255, 1)',
            },
        },
        nonLeaderCard: {
            width: '100%',
            borderRadius: '5%',
            cursor: 'pointer',
            '&: hover': {
                outline: '2px solid rgba(61, 178, 255, 1)',
                boxShadow: '0 0 18px rgba(61, 178, 255, 1)',
            },
        },
    };

    return (
        <>
            <Box sx={styles.deck}>
                <Typography variant='h4' component='h2' sx={{ mb: '1rem', width: '90%', borderBottom: '2px solid white', textAlign: 'center' }}>Deck</Typography>
                <Grid container spacing={3} sx={styles.leaders}>
                    {deckLeaders.map((card) => {
                        const labelId = `card-id-${card.id}`;
                        return (
                            <Grid
                                size={4}
                                aria-owns={open ? 'mouse-over-popover' : undefined}
                                aria-haspopup="true"
                                onMouseEnter={(e) => handlePopoverOpen(e, card)}
                                onMouseLeave={handlePopoverClose}
                                key={labelId}
                                onClick={() => { moveToSideboard(card.id); moveToSealedPool(card.id) }}>
                                <Box component='img' src={card.cardObj?.cardData?.FrontArt} id={labelId} sx={styles.leaderCard} />
                            </Grid>
                        )
                    })}
                </Grid>

                <Grid container spacing={1} sx={{ width: '100%' }}>
                    {sortedDeckCards.map((card) => {
                        const labelId = `card-id-${card.id}`;
                        return (
                            <Grid
                                size={2}
                                aria-owns={open ? 'mouse-over-popover' : undefined}
                                aria-haspopup="true"
                                onMouseEnter={(e) => handlePopoverOpen(e, card)}
                                onMouseLeave={handlePopoverClose}
                                key={labelId}
                                onClick={() => { moveToSideboard(card.id); moveToSealedPool(card.id) }}>
                                <Box component='img' src={card.cardObj?.cardData?.FrontArt} id={labelId} sx={styles.nonLeaderCard} />
                            </Grid>
                        )
                    })}
                    <CardHover
                        anchorEl={anchorEl}
                        hoveredCard={hoveredCard}
                        onHoverClose={handlePopoverClose} />
                </Grid>
                <CopyJsonButton
                    deckLeaders={deckLeaders}
                    sortedDeckCards={sortedDeckCards} />
            </Box>
        </>
    );
}
