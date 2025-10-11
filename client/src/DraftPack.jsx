import { Box, Typography, Grid, createTheme, ThemeProvider } from '@mui/material';
import CardHover from './CardHover';
import StartButton from './StartButton';

export default function DraftPack({ setName, title, packNum, pickNum, handleStartDraft, draftStarted, draftingLeaders, currentPack, packIndex, handlePopoverClose, handlePopoverOpen, pickCard, anchorEl, hoveredCard, isLoading }) {
    const theme = createTheme({
        breakpoints: {
            values: {
                xs: 0,
                sm: 600,
                md: 725,
                lg: 900,
                xl: 960,
                xxl: 1050,
            },
        },
    });

    //Styles
    const styles = {
        packBox: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: !draftStarted && 'center',
            width: !draftStarted ? '16rem' : '100%',
            minHeight: !draftStarted ? '22rem' : draftingLeaders ? '100%' : '110vh',
            m: '1rem auto 5rem auto',
            backgroundImage: !draftStarted ? 'url(/lof_box_crop.png)' : 'url(/lof_box_wide.png)',
            backgroundSize: 'cover',
            backgroundPosition: draftingLeaders ? 'center 90%' : 'center top',
            backgroundRepeat: 'no-repeat',
            color: 'white',
            borderRadius: !draftStarted ? '10px' : '0px',
            boxShadow: '-4px 4px 8px black',
        },
        pack: {
            display: 'flex',
            justifyContent: draftingLeaders ? 'center' : 'flex-start',
            width: draftingLeaders ? '100%' : { xs: '95%', sm: '80%', md: '65%', lg: '60%', xl: '55%', xxl: '50%' },
            maxHeight: '92vh',
            mt: '0.5rem',
            p: draftStarted && { xs: '0.5rem', md: '1rem' },
            filter: isLoading ? 'blur(2px)' : 'blur(0)',
        },
        card: {
            width: '100%',
            borderRadius: '4%',
            transition: 'transform 0.3s ease-in-out',
            '&: hover': {
                cursor: 'pointer',
                outline: '2px solid rgb(61, 178, 255)',
            },
        },
        loading: {
            position: 'absolute',
            display: isLoading ? 'block' : 'none',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textShadow: '2px 2px 3px black',
        },
    };

    return (
        <Box sx={styles.packBox}>
            {!draftStarted &&
                <>
                    <Box component='img' src='./public/lof_logo.png' sx={{ position: 'absolute', bottom: '0', width: '100%', backgroundColor: 'rgba(0, 0, 0, 1)', borderRadius: '0 0 10px 10px' }} />
                    <StartButton isLoading={isLoading} onClick={() => handleStartDraft()}>Start Draft</StartButton>
                </>
            }
            {draftStarted &&
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <Typography variant='h5' component='h3' sx={{ mr: '1rem', mt: '3rem' }}>Pack: {packNum}</Typography>
                        <Typography variant='h5' component='h3' sx={{ ml: '1rem', mt: '3rem' }}>Pick: {pickNum}</Typography>
                    </Box>
                </Box>
            }
            {draftStarted &&
                <ThemeProvider theme={theme}>
                    <Grid container spacing={draftingLeaders ? 3 : 1} sx={styles.pack}>
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
                        <Typography variant='h3' component='p' sx={styles.loading}>Loading...</Typography>
                    </Grid>
                </ThemeProvider>
            }
        </Box>
    );
}
