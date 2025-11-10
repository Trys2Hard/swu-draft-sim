import { Box, Typography, Grid } from '@mui/material';
import CardHover from './CardHover';
import useCardHoverPopover from './useCardHoverPopover';
import CopyJsonButton from './CopyJsonButton';

export default function Deck({ deckLeaders, deckCards, setDeckLeaders, setDeckCards, setSideboardLeaders, setSideboardCards, sideboardCards, setLeaderPacks, setCardPacks, draftStarted, sealedStarted }) {
    const { anchorEl, hoveredCard, handlePopoverOpen, handlePopoverClose } = useCardHoverPopover('');

    const sortedDeckCards = [...deckCards].sort((a, b) => a.cardObj?.cardData?.Cost - b.cardObj?.cardData?.Cost);
    const deckNum = sortedDeckCards.length;

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

    const leaderAspectColorMap = {
        Vigilance: 'rgba(101, 146, 182, 1), rgba(101, 146, 182, 0.7)',
        Aggression: 'rgba(216, 146, 146, 1), rgba(216, 146, 146,  0.7)',
        Command: 'rgba(162, 216, 173, 1), rgba(162, 216, 173, 0.7)',
        Cunning: 'rgba(242, 217, 127, 1), rgba(242, 217, 127, 0.7)',
    };

    const deckAspectColorMap = {
        Vigilance: 'rgba(101, 146, 182, 0.7), rgba(101, 146, 182, 1)',
        Aggression: 'rgba(216, 146, 146, 0.7), rgba(216, 146, 146,  1)',
        Command: 'rgba(162, 216, 173, 0.7), rgba(162, 216, 173, 1)',
        Cunning: 'rgba(242, 217, 127, 0.7), rgba(242, 217, 127, 1)',
    };

    const aspects = deckLeaders[0]?.cardObj?.cardData?.Aspects || [];
    const leaderColor = leaderAspectColorMap[aspects.find(a => leaderAspectColorMap[a])];

    const deckCardAspects = deckCards
        .flatMap(card => card?.cardObj?.cardData?.Aspects || [])
        .filter(a => a !== 'Heroism' && a !== 'Villainy');

    // Count all aspects
    const aspectCounts = Object.entries(
        deckCardAspects.reduce((acc, aspect) => {
            acc[aspect] = (acc[aspect] || 0) + 1;
            return acc;
        }, {})
    ).sort((a, b) => b[1] - a[1]); // Sort by count descending

    // Get most repeated (and possibly second)
    const [mostRepeatedAspect] = aspectCounts[0] || [null, 0];
    let deckColor = deckAspectColorMap[mostRepeatedAspect];

    // 🧠 If leaderColor matches deckColor, pick the second most repeated aspect instead
    if (deckColor === leaderColor && aspectCounts.length > 1) {
        const [secondMostAspect] = aspectCounts[1];
        deckColor = deckAspectColorMap[secondMostAspect] || deckColor;
    }

    //Styles
    const styles = {
        deck: {
            position: 'relative',
            color: 'white',
            background: leaderColor && deckColor ? `linear-gradient(to bottom right, ${leaderColor}, ${deckColor})` : 'rgba(31, 202, 255, 0.2)',
            height: '100%',
            m: '1rem auto 0 auto',
            display: !draftStarted && !sealedStarted ? 'none' : 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: '0.5rem',
        },
        deckNum: {
            position: 'absolute',
            right: '2rem',
            top: '0.7rem',
            color: deckNum === 30 ? 'rgba(19, 235, 19, 1)' : deckNum > 30 ? 'rgba(233, 233, 12, 1)' : 'rgba(228, 9, 9, 1)',
            border: '1px solid rgba(61, 178, 255, 0.5)',
            borderRadius: '10px',
            p: '0 0.6rem 0 0.6rem',
            backgroundColor: 'rgba(58, 58, 58, 1)',
        },
        leaders: {
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            pb: '0.5rem',
            mb: '1rem',
            borderBottom: '2px solid white',
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
                <Typography variant='h4' component='h2' sx={{ mb: '1rem', width: '100%', borderBottom: '2px solid white', textAlign: 'center' }}>Deck</Typography>
                <Typography variant='h5' component='p' sx={styles.deckNum}>{deckNum}/30</Typography>
                <Grid container spacing={{ xs: 0.2, sm: 0.4, lg: 0.8, xl: 1 }} sx={styles.leaders}>
                    {deckLeaders.map((card) => {
                        const labelId = `card-id-${card.id}`;
                        return (
                            <Grid
                                size={{ xs: 4, md: 2 }}
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

                <Grid container spacing={{ xs: 0.2, sm: 0.4, lg: 0.8, xl: 1 }} sx={{ width: '100%' }}>
                    {sortedDeckCards.map((card) => {
                        const labelId = `card-id-${card.id}`;
                        return (
                            <Grid
                                size={{ xs: 2, md: 1.2 }}
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
                    sortedDeckCards={sortedDeckCards}
                    sideboardCards={sideboardCards} />
            </Box>
        </>
    );
}
