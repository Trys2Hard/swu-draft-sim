import { Box, Button } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LZString from 'lz-string';

/** Raw Set_Number as stored on the card (no variant → base number folding). */
function cardToRawId(card) {
  const set = card?.cardData?.Set;
  const num = card?.cardData?.Number;
  if (!set || num == null) return null;
  return `${set}_${num.toString().padStart(3, '0')}`;
}

export default function CopySealedPool({
  deckLeaders,
  sortedDeckCards,
  sideboardCards,
  leaderPacks,
  /** Raw pool cards from state (not display-sorted; keeps true Set/Number). */
  cardPacks,
  base,
  onSnackbar,
}) {
  const handleCopyJson = () => {
    const flatLeaderPacks = leaderPacks.flat();
    const leaderCountMap = new Map();
    for (const card of flatLeaderPacks) {
      const id = cardToRawId(card);
      if (!id) continue;
      leaderCountMap.set(id, (leaderCountMap.get(id) || 0) + 1);
    }

    const combinedLeaders = Array.from(leaderCountMap, ([id, count]) => ({
      id,
      count,
    }));

    // Pool: use `cardPacks` from state, not sorted display list (which adjusts foil/hyperspace numbers).
    const poolCountMap = new Map();
    for (const card of cardPacks?.flat() || []) {
      const id = cardToRawId(card);
      if (!id) continue;
      poolCountMap.set(id, (poolCountMap.get(id) || 0) + 1);
    }

    const combinedPoolCards = Array.from(poolCountMap, ([id, count]) => ({
      id,
      count,
    }));

    // Built deck (leaders + cards on the deck) — optional; restored on import
    const builtLeaderCountMap = new Map();
    for (const card of deckLeaders || []) {
      const id = cardToRawId(card);
      if (!id) continue;
      builtLeaderCountMap.set(id, (builtLeaderCountMap.get(id) || 0) + 1);
    }
    const combinedBuiltLeaders = Array.from(builtLeaderCountMap, ([id, count]) => ({
      id,
      count,
    }));

    const builtDeckCountMap = new Map();
    for (const card of sortedDeckCards || []) {
      const id = cardToRawId(card);
      if (!id) continue;
      builtDeckCountMap.set(id, (builtDeckCountMap.get(id) || 0) + 1);
    }
    const combinedBuiltDeckCards = Array.from(builtDeckCountMap, ([id, count]) => ({
      id,
      count,
    }));

    // Process sideboard
    const sideboardCountMap = new Map();
    if (sideboardCards) {
      for (const card of sideboardCards) {
        const id = cardToRawId(card);
        if (!id) continue;
        sideboardCountMap.set(id, (sideboardCountMap.get(id) || 0) + 1);
      }
    }
    const combinedSideboard = Array.from(sideboardCountMap, ([id, count]) => ({
      id,
      count,
    }));

    // For sealed pools, keep all leaders as an array (unlike constructed decks which use single leader)
    const jsonCardData = {
      metadata: {
        name: leaderPacks ? 'SWUDraftSim Sealed Pool' : 'SWUDraftSim Deck',
        author: 'Unknown',
      },
      leader: combinedLeaders,
      base: {
        id: base,
        count: 1,
      },
      deck: combinedPoolCards,
      sideboard: combinedSideboard,
    };

    if (combinedBuiltLeaders.length > 0 || combinedBuiltDeckCards.length > 0) {
      jsonCardData.builtDeckLeaders = combinedBuiltLeaders;
      jsonCardData.builtDeckCards = combinedBuiltDeckCards;
    }

    // Encode and create deck link
    const jsonString = JSON.stringify(jsonCardData);
    const compressed = LZString.compressToEncodedURIComponent(jsonString);

    const deckLink = `${window.location.origin}?deck=${compressed}`;

    navigator.clipboard.writeText(deckLink);

    if (onSnackbar) {
      // For sealed pools, leaders are automatically included, so only warn if none exist
      if (!jsonCardData?.leader?.length || jsonCardData.leader.length === 0) {
        onSnackbar(
          'Copied Sealed Pool Link to Clipboard (No Leaders Found)',
          'warning',
        );
      } else if (!jsonCardData?.base?.id) {
        onSnackbar(
          'Copied Sealed Pool Link to Clipboard (No Base Selected)',
          'warning',
        );
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
    <Box
      sx={{
        color: 'white',
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%',
      }}
    >
      <Button
        variant="contained"
        sx={styles.copyJsonButton}
        onClick={handleCopyJson}
        startIcon={<ContentCopyIcon />}
      >
        Sealed Pool Link
      </Button>
    </Box>
  );
}
