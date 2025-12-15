import { Box, Button } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LZString from 'lz-string';

export default function CopySealedPool({
    sortedDeckCards,
    sideboardCards,
    leaderPacks,
    sortedCardPacks,
    base,
    onSnackbar
}) {

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

        const combinedLeaders = Array.from(
            leaderCountMap,
            ([id, count]) => ({ id, count })
        );

        const deckCountMap = [];
        for (const card of sortedDeckCards || sortedCardPacks) {
            const set = card?.cardData?.Set;
            const num = card?.cardData?.Number;
            if (!set || !num) continue;
            const id = `${set}_${num}`;
            deckCountMap.push({ id, count: 1 });
        }

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
            deck: deckCountMap,
            sideboard: combinedSideboard,
        };

        // 🔽🔽🔽 NEW: ENCODE + CREATE DECK LINK 🔽🔽🔽
        const jsonString = JSON.stringify(jsonCardData);
        const compressed = LZString.compressToEncodedURIComponent(jsonString);

        const deckLink = `${window.location.origin}?deck=${compressed}`;

        navigator.clipboard.writeText(deckLink);
        // 🔼🔼🔼 END NEW SECTION 🔼🔼🔼

        if (onSnackbar) {
            if (!jsonCardData?.leader[0]?.id || jsonCardData?.leader?.id === 'undefined_undefined') {
                onSnackbar('Copied Sealed Pool Link to Clipboard (No Leader Selected)', 'warning');
            } else if (!jsonCardData?.base?.id) {
                onSnackbar('Copied Sealed Pool Link to Clipboard (No Base Selected)', 'warning');
            } else {
                onSnackbar('Copied Sealed Pool Link to Clipboard', 'success');
            }
        }
    };

    //Styles
    const styles = {
        copyJsonButton: {
            width: '100%',
            background: 'none',
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none' },
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
                Sealed Pool Link
            </Button>
        </Box>
    );
}
