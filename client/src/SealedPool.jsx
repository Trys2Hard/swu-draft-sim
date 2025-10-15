import { Box, Grid } from '@mui/material';
import CardHover from './CardHover';
import StartButton from './StartButton';

export default function SealedPool({ handlePopoverClose, handlePopoverOpen, setName, anchorEl, hoveredCard, moveToDeck, handleStartSealedBuild, sealedStarted, leaderPacks, cardPacks }) {
    const sortedCardPacks = [...cardPacks].flat().sort((a, b) => a.cardObj?.cardData?.Number - b.cardObj?.cardData?.Number);

    //Styles
    const styles = {
        sealedPool: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: !sealedStarted ? 'center' : 'flex-start',
            width: !sealedStarted ? '281.5px' : {xs: '100%', md: '900px'},
            minHeight: !sealedStarted ? '478.5px' : '100vh',
            backgroundImage: !sealedStarted ? 'url(/LOF_box_art_card.jpg)' : 'none',
            backgroundSize: !sealedStarted ? 'contain' : 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
            m: '1rem auto 2rem auto',
            backgroundColor: sealedStarted ? 'rgba(31, 202, 255, 0.2)' : 'none',
            p: '0.5rem',
            color: 'white',
            borderRadius: !sealedStarted ? '10px' : {xs: '0px', md: '10px'},
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
                outline: '2px solid rgb(61, 178, 255)',
            },
        },
        nonLeaderCard: {
            width: '100%',
            borderRadius: '5%',
            cursor: 'pointer',
            '&: hover': {
                outline: '2px solid rgb(61, 178, 255)',
            },
        },
    };

    return (
        <Box sx={styles.sealedPool} >
            {!sealedStarted &&
                    <StartButton onClick={() => handleStartSealedBuild()}>Start Sealed</StartButton>
            }

        <Box sx={styles.sealedContent}>
            {sealedStarted &&
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
            }

            {sealedStarted &&
                <Grid container spacing={1} sx={{width: '100%'}}>
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
            }
            <CardHover
                anchorEl={anchorEl}
                hoveredCard={hoveredCard}
                onHoverClose={handlePopoverClose} />
                </Box>
        </Box>
    );
}
