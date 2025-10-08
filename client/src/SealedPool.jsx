import { List, ListItem, Box, Typography, } from '@mui/material';
import CardHover from './CardHover';
import StartButton from './StartButton';

export default function SealedPool({ handlePopoverClose, handlePopoverOpen, setName, anchorEl, hoveredCard, moveToDeck, handleStartSealedBuild, sealedStarted, leaderPacks, cardPacks }) {
    const sortedCardPacks = [...cardPacks].flat().sort((a, b) => a.cardObj?.cardData?.Number - b.cardObj?.cardData?.Number);

    //Styles
    const styles = {
        packBox: {
            position: 'relative',
            width: '95%',
            height: '100%',
            m: '1rem auto 5rem auto',
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
                outline: '2px solid rgb(61, 178, 255)',
            },
        },
        loading: {
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
                    <Typography variant='h4' component='h4' sx={{ position: 'absolute', top: '1rem' }}>{setName}</Typography>
                    <StartButton onClick={() => handleStartSealedBuild()}>Start Sealed</StartButton>
                </>
            }
            {sealedStarted &&
                <Box sx={{ width: '100%' }}>
                    <Typography variant='h4' component='h2' sx={{ mb: '0.5rem', display: 'flex', justifyContent: 'center' }}>Leaders</Typography>
                </Box>
            }
            {sealedStarted &&
                <Box sx={{ position: 'relative', width: '100%' }}>
                    <List sx={styles.packLeaders}>
                        {leaderPacks.flat().map((card) => {
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
                </Box>
            }
            {sealedStarted &&
                <Box sx={{ width: '100%' }}>
                    <Typography variant='h4' component='h2' sx={{ m: '1rem auto 0.5rem auto', display: 'flex', justifyContent: 'center' }}>Cards</Typography>
                </Box>
            }
            {sealedStarted &&
                <List sx={styles.pack}>
                    {sortedCardPacks.flat().map((card) => {
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
