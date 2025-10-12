import { List, ListItem, Box, Typography, Button } from '@mui/material';
import CardHover from './CardHover';
import StartButton from './StartButton';

export default function DraftPack({ setName, title, packNum, pickNum, handleStartDraft, draftStarted, draftingLeaders, currentPack, packIndex, handlePopoverClose, handlePopoverOpen, pickCard, anchorEl, hoveredCard, isLoading, handleFlipLeader, flippedLeaders }) {
    //Styles
    const styles = {
        packBox: {
            position: 'relative',
            width: '60%',
            minHeight: '20rem',
            m: '1rem auto 5rem auto',
            p: '0.5rem',
            background: 'linear-gradient(to right, rgba(31, 202, 255, 0.2), rgba(31, 202, 255, 0.3), rgba(31, 202, 255, 0.2))',
            borderRadius: '5px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
        },
        pack: {
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            gap: draftingLeaders ? '1rem' : '0.5rem',
            backdropFilter: draftStarted && 'brightness(0.7)',
            borderRadius: '5px',
            p: draftStarted && '1rem',
            justifyContent: 'center',
            filter: isLoading ? 'blur(2px)' : 'blur(0)',
        },
        cardContainer: {
            display: 'flex',
            flexDirection: 'column',
            width: draftingLeaders ? '30%' : '15%',
            alignItems: 'center',
            justifyContent: 'center',
        },
        card: {
            p: '0rem',
            transition: 'transform 0.3s ease-in-out',
        },
        cardImage: {
            width: '100%',
            borderRadius: '10px',
            '&: hover': {
                cursor: 'pointer',
                outline: '3px solid rgb(61, 178, 255)',
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
        flipButton: {
            m: '1rem',
            backgroundColor: 'rgba(73, 73, 73, 1)',
            borderRadius: '5px',
            '&:hover': {
                filter: 'brightness(1.1)',
            },
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
                <Box sx={{ width: '100%' }}>
                    <Typography variant='h4' component='h2' sx={{ mb: '0.5rem', display: 'flex', justifyContent: 'center' }}>{title}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <Typography variant='h5' component='h3' sx={{ mb: '1rem', mr: '1rem' }}>Pack: {packNum}</Typography>
                        <Typography variant='h5' component='h3' sx={{ mb: '1rem', ml: '1rem' }}>Pick: {pickNum}</Typography>
                    </Box>
                </Box>
            }
            {draftStarted &&
                <Box sx={{ position: 'relative', width: '100%' }}>
                    <List sx={styles.pack}>
                        {currentPack[packIndex]?.map((card) => {
                            const cardId = `card-id-${card.id}`;
                            const isFlipped = flippedLeaders[card.id];
                            return (
                                <Box sx={styles.cardContainer}>
                                    <ListItem
                                        aria-owns={open ? 'mouse-over-popover' : undefined}
                                        aria-haspopup="true"
                                        onMouseEnter={(e) => handlePopoverOpen(e, card)}
                                        onMouseLeave={handlePopoverClose}
                                        key={cardId}
                                        onClick={() => pickCard(card.id)}
                                        sx={styles.card}>
                                        <Box component='img' src={isFlipped ? card.cardObj?.cardData?.BackArt : card.cardObj?.cardData?.FrontArt} id={cardId} sx={styles.cardImage}></Box>
                                    </ListItem>
                                    {draftingLeaders && <Button variant='contained' sx={styles.flipButton} onClick={() => handleFlipLeader(card.id)}>Flip</Button>}
                                </Box>
                            );
                        })}
                        <CardHover
                            anchorEl={anchorEl}
                            hoveredCard={hoveredCard}
                            onHoverClose={handlePopoverClose} />
                    </List>
                    <Typography variant='h3' component='p' sx={styles.loading}>Loading...</Typography>
                </Box>
            }
        </Box>
    );
}
