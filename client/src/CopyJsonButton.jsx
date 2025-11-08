import { Box, Button } from '@mui/material';

export default function CopyJsonButton({ deckLeaders, sortedDeckCards, sideboardCards }) {

    const handleCopyJson = () => {
        const deckCountMap = new Map();
        for (const card of sortedDeckCards) {
            const set = card?.cardObj?.cardData?.Set;
            let num = card?.cardObj?.cardData?.Number;
            if (num >= 537 && num <= 774) {
                num = (num - 510).toString();
            } else if (num >= 767 && num <= 1004) {
                num = (num - 740).toString();
            }
            if (num.length === 2) {
                num = '0' + num;
            } else if (num.length === 1) {
                num = '00' + num;
            }
            console.log(num, num.length, typeof num)
            if (!set || !num) continue;
            const id = `${set}_${num}`;
            deckCountMap.set(id, (deckCountMap.get(id) || 0) + 1);
        }
        const combinedDeck = Array.from(deckCountMap, ([id, count]) => ({ id, count }));

        const sideboardCountMap = new Map();
        if (sideboardCards) {
            for (const card of sideboardCards) {
                const set = card?.cardObj?.cardData?.Set;
                const num = card?.cardObj?.cardData?.Number;
                if (!set || !num) continue;
                const id = `${set}_${num}`;
                sideboardCountMap.set(id, (sideboardCountMap.get(id) || 0) + 1);
            }
        }
        const combinedSideboard = Array.from(sideboardCountMap, ([id, count]) => ({ id, count }));

        const jsonCardData = {
            metadata: {
                name: "Imported SWUDraftSim Deck",
                author: "Anonymous",
            },
            leader: {
                id: `${deckLeaders[0].cardObj.cardData.Set}_${deckLeaders[0].cardObj.cardData.Number}`,
                count: 1,
            },
            base: {
                id: "SEC_023",
                count: 1,
            },
            deck: combinedDeck,
            sideboard: combinedSideboard,
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
