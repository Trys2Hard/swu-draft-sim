import { List, ListItem, Box, } from '@mui/material';
import CardHover from './CardHover';

export default function CurrentPack({ draftStarted, draftingLeaders, currentPack, packIndex, handlePopoverClose, handlePopoverOpen, pickCard, anchorEl, hoveredCard }) {
    const styles = {
        pack: {
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            gap: draftingLeaders ? '1rem' : '0.5rem',
            backdropFilter: draftStarted && 'brightness(0.7)',
            borderRadius: '5px',
            p: draftStarted && '1rem',
            justifyContent: 'center',
        },
        card: {
            width: draftingLeaders ? '20%' : '15%',
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
    };

    return (
        <List sx={styles.pack}>
            {currentPack[packIndex]?.map((card) => {
                const cardId = `card-id-${card.id}`;
                return (
                    <ListItem
                        aria-owns={open ? 'mouse-over-popover' : undefined}
                        aria-haspopup="true"
                        onMouseEnter={(e) => handlePopoverOpen(e, card)}
                        onMouseLeave={handlePopoverClose}
                        key={cardId}
                        onClick={() => pickCard(card.id)}
                        sx={styles.card}>
                        <Box component='img' src={card.cardObj?.cardData?.FrontArt} id={cardId} sx={styles.cardImage}></Box>
                    </ListItem>
                );
            })}
            <CardHover
                anchorEl={anchorEl}
                hoveredCard={hoveredCard}
                onHoverClose={handlePopoverClose} />
        </List>
    )
}