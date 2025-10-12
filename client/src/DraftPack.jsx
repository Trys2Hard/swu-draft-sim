import { Box, Typography, Grid } from '@mui/material';
import CardHover from './CardHover';
import StartButton from './StartButton';

export default function DraftPack({ setName, title, packNum, pickNum, handleStartDraft, draftStarted, draftingLeaders, currentPack, packIndex, handlePopoverClose, handlePopoverOpen, pickCard, anchorEl, hoveredCard, isLoading }) {
    //Styles
    const styles = {
        packBox: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: !draftStarted ? 'center' : 'flex-start',
            width: !draftStarted ? '16rem' : '100%',
            height: !draftStarted ? '22rem' : '100vh',
            m: '1rem auto 5rem auto',
            backgroundImage: !draftStarted ? 'url(/lof_box_crop.png)' : 'url(/lof_box_wide.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
            color: 'white',
            borderRadius: !draftStarted ? '10px' : '0px',
            boxShadow: '-4px 4px 8px black',
        },
        pack: {
            display: 'flex',
            alignItems: draftingLeaders ? 'center' : 'flex-start',
            width: draftingLeaders ? { xs: '100%', md: '75%', lg: '60%' } : { xs: '100%', md: '900px' },
            height: draftingLeaders && '100vh',
            mt: '0.5rem',
            p: draftStarted && '0.5rem',
        },
        card: {
            width: '100%',
            borderRadius: '5%',
            '&: hover': {
                cursor: 'pointer',
                outline: '2px solid rgba(61, 178, 255, 1)',
                boxShadow: '0 0 18px rgba(61, 178, 255, 1)',
            },
        },
        loading: {
            position: 'absolute',
            display: isLoading ? 'block' : 'none',
            fontSize: { xs: '2rem', md: '2.5rem' },
            top: '100%',
            right: { xs: '-10%', md: '-20%' },
            zIndex: '2',
            textShadow: '2px 2px 3px black',
        },
        packInfo: {
            mt: '1rem',
            boxShadow: '-2px 2px 5px black',
            backgroundColor: 'rgba(73, 73, 73, 1)',
            textShadow: '2px 2px 3px black',
            p: '0.5rem 0.8rem 0.5rem 0.8rem',
            borderRadius: '10px',
            fontSize: { xs: '1rem', md: '1.2rem' },
        },
        startDraftImage: {
            position: 'absolute',
            bottom: '0',
            width: '100%',
            backgroundColor: 'rgba(0, 0, 0, 1)',
            borderRadius: '0 0 10px 10px',
        },
    };

    return (
        <Box sx={styles.packBox}>
            {!draftStarted &&
                <>
                    <Box component='img' src='./public/lof_logo.png' sx={styles.startDraftImage} />
                    <StartButton isLoading={isLoading} onClick={() => handleStartDraft()}>Start Draft</StartButton>
                </>
            }
            {draftStarted &&
                <Box sx={{ position: 'relative' }}>
                    <Typography variant='h5' component='h3' sx={styles.packInfo}>Pack {packNum} / Pick {pickNum}</Typography>
                    <Typography component='p' sx={styles.loading}>Loading...</Typography>
                </Box>
            }
            {draftStarted &&
                <Box sx={styles.pack}>
                    <Grid container spacing={draftingLeaders ? 3 : 1} sx={{ filter: isLoading ? 'blur(2px)' : 'blur(0)', width: '100%' }} >
                        {currentPack[packIndex]?.map((card) => {
                            const cardId = `card-id-${card.id}`;
                            return (
                                <Grid
                                    size={draftingLeaders ? 4 : 2.4}
                                    key={cardId}
                                    id={cardId}
                                    aria-owns={open ? 'mouse-over-popover' : undefined}
                                    aria-haspopup="true"
                                    onMouseEnter={(e) => handlePopoverOpen(e, card)}
                                    onMouseLeave={handlePopoverClose}
                                    onClick={() => pickCard(card.id)}
                                    sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                                    <Box
                                        component="img"
                                        src={card.cardObj?.cardData?.FrontArt}
                                        alt={card.cardObj?.cardData?.Name}
                                        sx={styles.card} />
                                </Grid>
                            );
                        })}
                        <CardHover
                            anchorEl={anchorEl}
                            hoveredCard={hoveredCard}
                            onHoverClose={handlePopoverClose} />
                    </Grid>
                </Box>
            }
        </Box>
    );
}
