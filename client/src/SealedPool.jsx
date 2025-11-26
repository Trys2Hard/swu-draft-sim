import { Box, Grid, Typography } from '@mui/material';
import CardHover from './CardHover';
import StartCard from './StartCard';
import CopyJsonButton from './CopyJsonButton';
import SelectBase from './SelectBase';

export default function SealedPool({ handlePopoverClose, handlePopoverOpen, anchorEl, hoveredCard, moveToDeck, handleStartSealedBuild, sealedStarted, leaderPacks, cardPacks, currentSet, isLoading, base, setBase }) {
    const sortedCardPacks = [...cardPacks].flat().sort((a, b) => a.cardObj?.cardData?.Number - b.cardObj?.cardData?.Number);

    //Styles
    const styles = {
        sealedPool: {
            position: 'relative',
            minHeight: '100vh',
            color: 'white',
            backgroundColor: 'rgba(29, 64, 77, 1)',
        },
        header: {
            width: '100%',
            height: { xs: '7rem', sm: '4rem' },
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'center',
        },
        sealedContent: {
            position: 'relative',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: '0.5rem',
        },
        leaders: {
            position: 'relative',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            mb: '1rem',
            pb: '0.5rem',
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
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -80%)',
            fontSize: { xs: '2rem', sm: '3rem', md: '3.5rem' },
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
                    <Box sx={styles.header}>
                        <Typography variant='h4' component='h2' sx={{ mb: { xs: '0.8rem', sm: '0' } }}>Sealed Pool</Typography>
                        <Box sx={{ position: { xs: 'static', sm: 'absolute' }, top: '0.7rem', right: '1rem' }}>
                            <SelectBase base={base} setBase={setBase} currentSet={currentSet} />
                        </Box>
                    </Box>

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
                        <CopyJsonButton
                            leaderPacks={leaderPacks}
                            cardPacks={cardPacks}
                            base={base}
                            setBase={setBase} />
                    </Box>

                </Box>
            }
        </>
    );
}
