import { Box, Grid } from '@mui/material';
import CardHover from './CardHover';
import StartCard from './StartCard';
import CopySealedJsonButton from './CopySealedJsonButton';

export default function SealedPool({ handlePopoverClose, handlePopoverOpen, anchorEl, hoveredCard, moveToDeck, handleStartSealedBuild, sealedStarted, leaderPacks, cardPacks, cardSet }) {
    const sortedCardPacks = [...cardPacks].flat().sort((a, b) => a.cardObj?.cardData?.Number - b.cardObj?.cardData?.Number);

    //Styles
    const styles = {
        sealedPool: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: { xs: '100%', md: '900px' },
            minHeight: '100vh',
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
            m: '1rem auto 0 auto',
            backgroundColor: 'rgba(31, 202, 255, 0.2)',
            p: '0.5rem',
            color: 'white',
            borderRadius: { xs: '0px', md: '10px' },
            boxShadow: '-4px 4px 8px black',
        },
        sealedContent: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
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
            {!sealedStarted &&
                <StartCard cardSet={cardSet} handleStartDraft={handleStartSealedBuild}>
                    Start Sealed
                </StartCard>
            }

            {sealedStarted &&
                <Box sx={styles.sealedPool} >
                    <Box sx={styles.sealedContent}>
                        <Grid container spacing={2} sx={styles.leaders}>
                            {leaderPacks.flat().map((card) => {
                                const cardId = `card-id-${card.id}`;
                                return (
                                    <Grid
                                        size={4}
                                        aria-owns={open ? 'mouse-over-popover' : undefined}
                                        aria-haspopup="true"
                                        onMouseEnter={(e) => handlePopoverOpen(e, card)}
                                        onMouseLeave={handlePopoverClose}
                                        key={cardId}
                                        onClick={() => moveToDeck(card.id)}
                                        sx={styles.cardLeaders}>
                                        <Box component='img' src={card.cardObj?.cardData?.FrontArt} id={cardId} sx={styles.leaderCard} />
                                    </Grid>
                                )
                            })}
                        </Grid>

                        <Grid container spacing={1} sx={{ width: '100%' }}>
                            {sortedCardPacks.flat().map((card) => {
                                const cardId = `card-id-${card.id}`;
                                return (
                                    <Grid
                                        size={2}
                                        aria-owns={open ? 'mouse-over-popover' : undefined}
                                        aria-haspopup="true"
                                        onMouseEnter={(e) => handlePopoverOpen(e, card)}
                                        onMouseLeave={handlePopoverClose}
                                        key={cardId}
                                        onClick={() => moveToDeck(card.id)}>
                                        <Box component='img' src={card.cardObj?.cardData?.FrontArt} id={cardId} sx={styles.nonLeaderCard} />
                                    </Grid>
                                )
                            })}
                        </Grid>
                        <CardHover
                            anchorEl={anchorEl}
                            hoveredCard={hoveredCard}
                            onHoverClose={handlePopoverClose} />
                    </Box>
                    <CopySealedJsonButton leaderPacks={leaderPacks} sortedCardPacks={sortedCardPacks} />
                </Box>
            }
        </>
    );
}
