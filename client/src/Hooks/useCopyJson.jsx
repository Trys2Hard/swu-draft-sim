export function useCopyJson({
  deckLeaders,
  sortedDeckCards,
  sideboardCards,
  leaderPacks,
  sortedCardPacks,
  base,
}) {
  const handleCopyJson = () => {
    // Process deck cards
    const deckCountMap = new Map();
    for (const card of sortedDeckCards || sortedCardPacks) {
      const set = card?.cardData?.Set;
      let num = card?.cardData?.Number;
      if (!set || !num) continue;

      if (num >= 537 && num <= 774) num = (num - 510).toString();
      else if (num >= 767 && num <= 1004) num = (num - 740).toString();

      num = num.toString().padStart(3, '0');
      const id = `${set}_${num}`;
      deckCountMap.set(id, (deckCountMap.get(id) || 0) + 1);
    }

    const combinedDeck = Array.from(deckCountMap, ([id, count]) => ({
      id,
      count,
    }));

    // Process sideboard cards
    const sideboardCountMap = new Map();
    if (sideboardCards) {
      for (const card of sideboardCards) {
        const set = card?.cardData?.Set;
        let num = card?.cardData?.Number;
        if (!set || !num) continue;

        if (num >= 537 && num <= 774) num = (num - 510).toString();
        else if (num >= 767 && num <= 1004) num = (num - 740).toString();

        num = num.toString().padStart(3, '0');
        const id = `${set}_${num}`;
        sideboardCountMap.set(id, (sideboardCountMap.get(id) || 0) + 1);
      }
    }

    const combinedSideboard = Array.from(sideboardCountMap, ([id, count]) => ({
      id,
      count,
    }));

    // Process leader (no number transformation needed - leaders are never over 020)
    let leaderSet, leaderNum;

    if (leaderPacks) {
      const firstLeader = leaderPacks.flat()[0];
      leaderSet = firstLeader?.cardData?.Set;
      leaderNum = firstLeader?.cardData?.Number;
    } else {
      leaderSet = deckLeaders?.[0]?.cardData?.Set;
      leaderNum = deckLeaders?.[0]?.cardData?.Number;
    }

    let leaderId = 'undefined_undefined';
    if (leaderSet && leaderNum) {
      leaderNum = leaderNum.toString().padStart(3, '0');
      leaderId = `${leaderSet}_${leaderNum}`;
    }

    const jsonCardData = {
      metadata: {
        name: leaderPacks ? 'SWUDraftSim Sealed Pool' : 'SWUDraftSim Deck',
        author: 'Unknown',
      },
      leader: {
        id: leaderId,
        count: 1,
      },
      base: { id: base, count: 1 },
      deck: combinedDeck,
      sideboard: combinedSideboard,
    };

    navigator.clipboard.writeText(JSON.stringify(jsonCardData, null, 2));

    if (
      !jsonCardData?.leader?.id ||
      jsonCardData?.leader?.id === 'undefined_undefined'
    ) {
      return {
        text: 'Copied JSON to Clipboard (No Leader Selected)',
        status: 'warning',
      };
    } else if (!jsonCardData.base.id) {
      return {
        text: 'Copied JSON to Clipboard (No Base Selected)',
        status: 'warning',
      };
    } else {
      return {
        text: 'Copied JSON to Clipboard',
        status: 'success',
      };
    }
  };

  return {
    handleCopyJson,
  };
}
