import { Box, Typography, Grid } from '@mui/material';
import CardHover from './CardHover';
import useCardHoverPopover from './useCardHoverPopover';

export default function Sideboard({ sideboardLeaders, sideboardCards, setDeckLeaders, setDeckCards, setSideboardLeaders, setSideboardCards, draftStarted }) {
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
        deck: {
            color: 'white',
            backgroundColor: 'rgba(90, 90, 90, 1)',
            m: '1rem auto 0 auto',
            display: !draftStarted ? 'none' : 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: '0.5rem',
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
                <Typography variant='h4' component='h2' sx={{ mb: '1rem', width: '100%', borderBottom: '2px solid white', textAlign: 'center' }}>Sideboard</Typography>
                <Grid container spacing={{ xs: 0.2, sm: 0.4, lg: 0.8, xl: 1 }} sx={styles.leaders}>
                    {sideboardLeaders.map((card) => {
                        const labelId = `card-id-${card.id}`;
                        return (
                            <Grid
                                size={{ xs: 4, md: 2 }}
                                aria-owns={open ? 'mouse-over-popover' : undefined}
                                aria-haspopup="true"
                                onMouseEnter={(e) => handlePopoverOpen(e, card)}
                                onMouseLeave={handlePopoverClose}
                                key={labelId}
                                onClick={() => { moveToDeck(card.id) }}>
                                <Box component='img' src={card.cardObj?.cardData?.FrontArt} id={labelId} sx={styles.leaderCard} />
                            </Grid>
                        )
                    })}
                </Grid>

                <Grid container spacing={{ xs: 0.2, sm: 0.4, lg: 0.8, xl: 1 }} sx={{ width: '100%' }}>
                    {sortedSideboardCards.map((card) => {
                        const labelId = `card-id-${card.id}`;
                        return (
                            <Grid
                                size={{ xs: 2, md: 1.2 }}
                                aria-owns={open ? 'mouse-over-popover' : undefined}
                                aria-haspopup="true"
                                onMouseEnter={(e) => handlePopoverOpen(e, card)}
                                onMouseLeave={handlePopoverClose}
                                key={labelId}
                                onClick={() => { moveToDeck(card.id) }}>
                                <Box component='img' src={card.cardObj?.cardData?.FrontArt} id={labelId} sx={styles.nonLeaderCard} />
                            </Grid>
                        )
                    })}
                    <CardHover
                        anchorEl={anchorEl}
                        hoveredCard={hoveredCard}
                        onHoverClose={handlePopoverClose} />
                </Grid>
            </Box>
        </>
    );
}
