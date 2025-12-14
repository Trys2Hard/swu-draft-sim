import { useState } from 'react';

export function useCopyJson({
    deckLeaders,
    sortedDeckCards,
    sideboardCards,
    leaderPacks,
    sortedCardPacks,
    base,
}) {
    const [open, setOpen] = useState(false);
    const [snackbarText, setSnackbarText] = useState('Copied JSON to Clipboard');
    const [snackbarStatus, setSnackbarStatus] = useState('success');

    const handleCopyJson = () => {
        setOpen(true);

        const deckCountMap = new Map();
        for (const card of sortedDeckCards || sortedCardPacks) {
            const set = card?.cardData?.Set;
            let num = card?.cardData?.Number;
            if (!set || !num) continue;

            if (num >= 537 && num <= 774) num = (num - 510).toString();
            else if (num >= 767 && num <= 1004) num = (num - 740).toString();

            num = num.padStart(3, '0');
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

        const jsonCardData = {
            metadata: {
                name: leaderPacks ? 'SWUDraftSim Sealed Pool' : 'SWUDraftSim Deck',
                author: 'Unknown',
            },
            leader: {
                id: leaderPacks
                    ? `${leaderPacks.flat()[0]?.cardData?.Set}_${leaderPacks.flat()[0]?.cardData?.Number}`
                    : `${deckLeaders[0]?.cardData?.Set}_${deckLeaders[0]?.cardData?.Number}`,
                count: 1,
            },
            base: { id: base, count: 1 },
            deck: combinedDeck,
            sideboard: Array.from(sideboardCountMap, ([id, count]) => ({ id, count })),
        };

        navigator.clipboard.writeText(JSON.stringify(jsonCardData, null, 2));

        if (!jsonCardData.leader.id?.includes('_')) {
            setSnackbarStatus('warning');
            setSnackbarText('Copied JSON. No Leader Selected.');
        } else if (!jsonCardData.base.id) {
            setSnackbarStatus('warning');
            setSnackbarText('Copied JSON. No Base Selected.');
        } else {
            setSnackbarStatus('success');
            setSnackbarText('Copied JSON to Clipboard');
        }
    };

    return {
        handleCopyJson,
        snackbar: { open, setOpen, snackbarText, snackbarStatus },
    };
}
