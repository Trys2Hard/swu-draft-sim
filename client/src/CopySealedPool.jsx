import { Box, Button } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function CopySealedPool({ sortedDeckCards, sideboardCards, leaderPacks, sortedCardPacks, base, onSnackbar }) {
    const handleCopyJson = () => {
        const flatLeaderPacks = leaderPacks.flat();

        const leaderCountMap = new Map();
        for (const card of flatLeaderPacks) {
            const set = card?.cardData?.Set;
            const num = card?.cardData?.Number;
            if (!set || !num) continue;
            const id = `${set}_${num}`;
            leaderCountMap.set(id, (leaderCountMap.get(id) || 0) + 1);
        }
        const combinedLeaders = Array.from(leaderCountMap, ([id, count]) => ({ id, count }));

        const deckCountMap = new Map();
        for (const card of sortedDeckCards || sortedCardPacks) {
            const set = card?.cardData?.Set;
            let num = card?.cardData?.Number;

            if (!set || !num) continue;

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

            const id = `${set}_${num}`;
            deckCountMap.set(id, (deckCountMap.get(id) || 0) + 1);
        }
        const combinedDeck = Array.from(deckCountMap, ([id, count]) => ({ id, count }));

        const sideboardCountMap = new Map();
        if (sideboardCards) {
            for (const card of sideboardCards) {
                const set = card?.cardData?.Set;
                const num = card?.cardData?.Number;
                if (!set || !num) continue;
                const id = `${set}_${num}`;
                sideboardCountMap.set(id, (sideboardCountMap.get(id) || 0) + 1);
            }
        }
        const combinedSideboard = Array.from(sideboardCountMap, ([id, count]) => ({ id, count }));

        const jsonCardData = {
            metadata: {
                name: leaderPacks ? 'SWUDraftSim Sealed Pool' : 'SWUDraftSim Deck',
                author: "Unknown",
            },
            leader: combinedLeaders,
            base: {
                id: base,
                count: 1,
            },
            deck: combinedDeck,
            sideboard: combinedSideboard,
        };

        navigator.clipboard.writeText(JSON.stringify(jsonCardData, null, 2));

        if (onSnackbar) {
            if (!jsonCardData.leader.id || jsonCardData?.leader?.id === 'undefined_undefined') {
                onSnackbar('Copied JSON to Clipboard. No Leader Selected.', 'warning');
            } else if (!jsonCardData?.base?.id) {
                onSnackbar('Copied JSON to Clipboard. No Base Selected.', 'warning');
            } else {
                onSnackbar('Copied JSON to Clipboard', 'success');
            }
        }
    };

    //Styles
    const styles = {
        copyJsonButton: {
            width: '100%',
            background: 'none',
            boxShadow: 'none',
            '&:hover': {
                boxShadow: 'none',
            },
            display: 'flex',
            justifyContent: 'flex-start',
        },
    };

    return (
        <Box sx={{ color: "white", display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <Button
                variant='contained'
                sx={styles.copyJsonButton}
                onClick={handleCopyJson}
                startIcon={<ContentCopyIcon />}
            >
                All Leaders
            </Button>
        </Box>
    );
}
