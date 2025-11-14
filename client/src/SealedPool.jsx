import { Box, Grid, Typography } from '@mui/material';
import CardHover from './CardHover';
import StartCard from './StartCard';
import CopyJsonButton from './CopyJsonButton';

export default function SealedPool({ handlePopoverClose, handlePopoverOpen, anchorEl, hoveredCard, moveToDeck, handleStartSealedBuild, sealedStarted, leaderPacks, cardPacks, currentSet, isLoading }) {
    const sortedCardPacks = [...cardPacks].flat().sort((a, b) => a.cardObj?.cardData?.Number - b.cardObj?.cardData?.Number);

    //Styles
    const styles = {
        sealedPool: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            minHeight: '100vh',
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
            m: '1rem auto 0 auto',
            backgroundColor: 'rgba(31, 202, 255, 0.2)',
            p: '0.5rem',
            color: 'white',
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
            position: 'relative',
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
        loading: {
            position: 'absolute',
            display: isLoading ? 'block' : 'none',
            fontSize: { xs: '2rem', sm: '3rem', md: '3.5rem' },
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -80%)',
            textShadow: '2px 2px 3px black',
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
                <StartCard cardSet={currentSet} handleStartDraft={handleStartSealedBuild}>
                    Start Sealed
                </StartCard>
            }

            {sealedStarted &&
                <Box sx={styles.sealedPool} >
                    <Typography variant='h4' component='h2' sx={{ mb: '1rem', width: '100%', borderBottom: '2px solid white', textAlign: 'center' }}>Sealed Pool</Typography>
                    <Box sx={styles.sealedContent}>
                        <Grid container spacing={{ xs: 0.2, sm: 0.4, lg: 0.8, xl: 1 }} sx={styles.leaders}>
                            <Typography component='p' sx={styles.loading}>Loading...</Typography>
                            {leaderPacks.flat().map((card) => {
                                const cardId = `card-id-${card.id}`;
                                return (
                                    <Grid
                                        size={{ xs: 4, md: 2 }}
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

                        <Grid container spacing={{ xs: 0.2, sm: 0.4, lg: 0.8, xl: 1 }} sx={{ width: '100%' }}>
                            {sortedCardPacks.flat().map((card) => {
                                const cardId = `card-id-${card.id}`;
                                return (
                                    <Grid
                                        size={{ xs: 2, md: 1.2 }}
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
                    {/* <CopySealedJsonButton leaderPacks={leaderPacks} sortedCardPacks={sortedCardPacks} /> */}
                    <CopyJsonButton
                        leaderPacks={leaderPacks}
                        cardPacks={cardPacks} />
                </Box>
            }
        </>
    );
}
