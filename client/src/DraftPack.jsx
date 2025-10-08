import { Box, Typography, Grid } from '@mui/material';
import CardHover from './CardHover';
import StartButton from './StartButton';

export default function DraftPack({ setName, title, packNum, pickNum, handleStartDraft, draftStarted, draftingLeaders, currentPack, packIndex, handlePopoverClose, handlePopoverOpen, pickCard, anchorEl, hoveredCard, isLoading }) {
    //Styles
    const styles = {
        packBox: {
            width: !draftStarted || draftingLeaders ? '95%' : {xs: '95%', sm: '70%'},
            m: '1rem auto 5rem auto',
            p: '0.5rem',
            background: 'linear-gradient(to right, rgba(31, 202, 255, 0.2), rgba(31, 202, 255, 0.3), rgba(31, 202, 255, 0.2))',
            borderRadius: '5px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            minHeight: !draftStarted ? '10rem' : draftingLeaders ? '100%' : '90vh',
        },
        pack: {
            maxWidth: draftingLeaders ? '95%' : {sm: '90%', md: '70%'},
            height: '100%',
            mt: '0.3rem',
            display: 'flex',
            justifyContent: draftingLeaders ? 'center' : 'flex-start',
            backdropFilter: draftStarted && 'brightness(0.7)',
            borderRadius: '5px',
            p: draftStarted && '0.5rem',
            filter: isLoading ? 'blur(2px)' : 'blur(0)',
        },
        card: {
            width: '100%',
            borderRadius: '10px',
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
                    <Typography variant='h4' component='h4' sx={{ position: 'absolute', top: '1rem' }}>{setName}</Typography>
                    <StartButton isLoading={isLoading} onClick={() => handleStartDraft()}>Start Draft</StartButton>
                </>
            }
            {draftStarted &&
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <Typography variant='h5' component='h3' sx={{ mr: '1rem' }}>Pack: {packNum}</Typography>
                        <Typography variant='h5' component='h3' sx={{ ml: '1rem' }}>Pick: {pickNum}</Typography>
                    </Box>
                </Box>
            }
            {draftStarted &&
                    <Grid container spacing={draftingLeaders ? 3 : {xs: 0.3, sm: 1}} sx={styles.pack}>
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
            }
        </Box>
    );
}
