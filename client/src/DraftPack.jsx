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
            width: !draftStarted ? '16rem' : '100%',
            m: '1rem auto 5rem auto',
            background: 'rgba(31, 203, 255, 0.15)',
            borderRadius: !draftStarted ? '5px' : '0px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: !draftStarted && 'center',
            color: 'white',
            minHeight: !draftStarted ? '22rem' : draftingLeaders ? '100%' : '110vh',
        },
        pack: {
            width: draftingLeaders ? '100%' : {xs: '95%', sm: '80%', md: '65%', lg:'60%', xl: '55%', xxl: '50%'},
            maxHeight: '92vh',
            mt: '0.3rem',
            display: 'flex',
            justifyContent: draftingLeaders ? 'center' : 'flex-start',
            p: draftStarted && {xs: '0.5rem', md: '1rem'},
            filter: isLoading ? 'blur(2px)' : 'blur(0)',
        },
        card: {
            width: '100%',
            borderRadius: draftingLeaders ? '4%' : '4px',
            transition: 'transform 0.3s ease-in-out',
            '&: hover': {
                cursor: 'pointer',
                outline: '2px solid rgb(61, 178, 255)',
            },
        },
        loading: {
            display: isLoading ? 'block' : 'none',
            position: 'absolute',
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
                    <Typography variant='h5' component='h4' sx={{ position: 'absolute', top: '1rem' }}>{setName}</Typography>
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
                                        sx={styles.card}/>
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
