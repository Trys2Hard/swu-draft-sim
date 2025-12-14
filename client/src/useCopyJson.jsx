export function useCopyJson({
    deckLeaders,
    sortedDeckCards,
    sideboardCards,
    leaderPacks,
    sortedCardPacks,
    base,
}) {
    const handleCopyJson = () => {
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
                let num = card?.cardData?.Number;
                if (!set || !num) continue;

                if (num >= 537 && num <= 774) num = (num - 510).toString();
                else if (num >= 767 && num <= 1004) num = (num - 740).toString();

                num = num.padStart(3, '0');
                const id = `${set}_${num}`;
                sideboardCountMap.set(id, (sideboardCountMap.get(id) || 0) + 1);
            }
        }

        const combinedSideboard = Array.from(sideboardCountMap, ([id, count]) => ({ id, count }));

        const jsonCardData = {
            metadata: {
                name: leaderPacks ? 'SWUDraftSim Sealed Pool' : 'SWUDraftSim Deck',
                author: 'Unknown',
            },
            leader: {
                id: leaderPacks
                    ? `${leaderPacks.flat()[0]?.cardData?.Set}_${leaderPacks.flat()[0]?.cardData?.Number}`
                    : `${deckLeaders?.[0]?.cardData?.Set}_${deckLeaders?.[0]?.cardData?.Number}`,
                count: 1,
            },
            base: { id: base, count: 1 },
            deck: combinedDeck,
            sideboard: combinedSideboard,
        };

        navigator.clipboard.writeText(JSON.stringify(jsonCardData, null, 2));

        if (!jsonCardData?.leader?.id || jsonCardData?.leader?.id === 'undefined_undefined') {
            return {
                text: 'Copied JSON to Clipboard. No Leader Selected.',
                status: 'warning'
            };
        } else if (!jsonCardData.base.id) {
            return {
                text: 'Copied JSON to Clipboard. No Base Selected.',
                status: 'warning'
            };
        } else {
            return {
                text: 'Copied JSON to Clipboard',
                status: 'success'
            };
        }
    };

    return {
        handleCopyJson,
    };
}
