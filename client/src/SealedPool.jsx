import { List, ListItem, Box, Typography, } from '@mui/material';
import CardHover from './CardHover';
import StartButton from './StartButton';

export default function SealedPool({ handlePopoverClose, handlePopoverOpen, setName, anchorEl, hoveredCard, isLoading, moveToDeck, handleStartSealedBuild, sealedStarted, sealedLeaderPool, sealedCardPool }) {
    const sortedSealedCardPool = [...sealedCardPool].sort((a, b) => a.cardObj?.cardData?.Number - b.cardObj?.cardData?.Number);

    //Styles
    const styles = {
        packBox: {
            position: 'relative',
            width: '60%',
            height: '100%',
            m: '5rem auto 5rem auto',
            p: '0.5rem',
            background: 'linear-gradient(to right, rgba(31, 202, 255, 0.2), rgba(31, 202, 255, 0.3), rgba(31, 202, 255, 0.2))',
            borderRadius: '5px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            minHeight: '20rem',
        },
        pack: {
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            backdropFilter: sealedStarted && 'brightness(0.7)',
            borderRadius: '5px',
            p: sealedStarted && '1rem',
            justifyContent: 'center',
            filter: isLoading ? 'blur(2px)' : 'blur(0)',
        },
        packLeaders: {
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            backdropFilter: sealedStarted && 'brightness(0.7)',
            borderRadius: '5px',
            p: sealedStarted && '1rem',
            justifyContent: 'center',
            filter: isLoading ? 'blur(2px)' : 'blur(0)',
        },
        card: {
            width: '15%',
            p: '0rem',
            transition: 'transform 0.3s ease-in-out',
        },
        cardLeaders: {
            width: '20%',
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
        }
    }

    return (
        <Box sx={styles.packBox} >
            {!sealedStarted &&
                <>
                    <Typography variant='h2' component='h4' sx={{ mb: '1rem', position: 'absolute', top: '0' }}>{setName}</Typography>
                    <StartButton isLoading={isLoading} onClick={() => handleStartSealedBuild()}>Start Sealed Build</StartButton>
                </>
            }
            {sealedStarted &&
                <Box sx={{ width: '100%' }}>
                    <Typography variant='h3' component='h2' sx={{ mb: '1rem', display: 'flex', justifyContent: 'center' }}>Leaders</Typography>
                </Box>
            }
            {sealedStarted &&
                <Box sx={{ position: 'relative', width: '100%' }}>
                    <List sx={styles.packLeaders}>
                        {sealedLeaderPool.flat().map((card) => {
                            const cardId = `card-id-${card.id}`;
                            return (
                                <ListItem
                                    aria-owns={open ? 'mouse-over-popover' : undefined}
                                    aria-haspopup="true"
                                    onMouseEnter={(e) => handlePopoverOpen(e, card)}
                                    onMouseLeave={handlePopoverClose}
                                    key={cardId}
                                    onClick={() => moveToDeck(card.id)}
                                    sx={styles.cardLeaders}>
                                    <Box component='img' src={card.cardObj?.cardData?.FrontArt} id={cardId} sx={styles.cardImage} />
                                </ListItem>
                            )
                        })}
                    </List>
                    <Typography variant='h3' component='p' sx={styles.loading}>Loading Sealed Pool...</Typography>
                </Box>
            }
            {sealedStarted &&
                <Box sx={{ width: '100%' }}>
                    <Typography variant='h3' component='h2' sx={{ mb: '1rem', display: 'flex', justifyContent: 'center' }}>Cards</Typography>
                </Box>
            }
            {sealedStarted &&
                <List sx={styles.pack}>
                    {sortedSealedCardPool.flat().map((card) => {
                        const cardId = `card-id-${card.id}`;
                        return (
                            <ListItem
                                aria-owns={open ? 'mouse-over-popover' : undefined}
                                aria-haspopup="true"
                                onMouseEnter={(e) => handlePopoverOpen(e, card)}
                                onMouseLeave={handlePopoverClose}
                                key={cardId}
                                onClick={() => moveToDeck(card.id)}
                                sx={styles.card}>
                                <Box component='img' src={card.cardObj?.cardData?.FrontArt} id={cardId} sx={styles.cardImage} />
                            </ListItem>
                        )
                    })}
                </List>
            }
            <CardHover
                anchorEl={anchorEl}
                hoveredCard={hoveredCard}
                onHoverClose={handlePopoverClose} />
        </Box>
    );
}
