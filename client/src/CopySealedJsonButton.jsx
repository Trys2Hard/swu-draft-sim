import { Box, Button } from '@mui/material';

export default function CopySealedJsonButton({ sortedCardPacks }) {

    const handleCopyJson = () => {
        const deckCountMap = new Map();

        for (const card of sortedCardPacks) {
            const set = card?.cardObj?.cardData?.Set;
            const num = card?.cardObj?.cardData?.Number;
            if (!set || !num) continue;
            const id = `${set}_${num}`;
            deckCountMap.set(id, (deckCountMap.get(id) || 0) + 1);
        }

        const combinedDeck = Array.from(deckCountMap, ([id, count]) => ({ id, count }));

        const jsonCardData = {
            metadata: {
                name: "Imported SWUDraftSim Sealed Pool",
                author: "Anonymous",
            },
            leader: {
                id: "LOF_008",
                count: 1,
            },
            base: {
                id: "LOF_021",
                count: 1,
            },
            deck: combinedDeck,
        };
        navigator.clipboard.writeText(JSON.stringify(jsonCardData, null, 2));
    };

    //Styles
    const styles = {
        copyJsonButton: {
            fontSize: '0.8rem',
            backgroundColor: 'rgba(65, 65, 65, 1)',
            borderRadius: '5px',
            mt: '0.5rem',
            p: '0.2rem 0.4rem',
            '&:hover': {
                filter: 'brightness(1.2)',
            },
        },
    };

    return (
        <Box sx={{ color: "white", display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <Button variant='contained' sx={styles.copyJsonButton} onClick={handleCopyJson}>Copy Json</Button>
        </Box>
    );
}