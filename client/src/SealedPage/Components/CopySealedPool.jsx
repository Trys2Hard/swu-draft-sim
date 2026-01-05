import { Box, Button } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LZString from 'lz-string';

export default function CopySealedPool({
  sortedDeckCards,
  sideboardCards,
  leaderPacks,
  sortedCardPacks,
  base,
  onSnackbar,
}) {
  const handleCopyJson = () => {
    // Process leaders
    const flatLeaderPacks = leaderPacks.flat();
    const leaderCountMap = new Map();
    for (const card of flatLeaderPacks) {
      const set = card?.cardData?.Set;
      let num = card?.cardData?.Number;
      if (!set || !num) continue;

      // Apply number transformation
      if (num >= 537 && num <= 774) num = (num - 510).toString();
      else if (num >= 767 && num <= 1004) num = (num - 740).toString();

      num = num.toString().padStart(3, '0');
      const id = `${set}_${num}`;
      leaderCountMap.set(id, (leaderCountMap.get(id) || 0) + 1);
    }

    const combinedLeaders = Array.from(leaderCountMap, ([id, count]) => ({
      id,
      count,
    }));

    // Process deck - FIX: Use Map instead of array
    const deckCountMap = new Map();
    for (const card of sortedDeckCards || sortedCardPacks) {
      const set = card?.cardData?.Set;
      let num = card?.cardData?.Number;
      if (!set || !num) continue;

      // Apply number transformation
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

    // Process sideboard
    const sideboardCountMap = new Map();
    if (sideboardCards) {
      for (const card of sideboardCards) {
        const set = card?.cardData?.Set;
        let num = card?.cardData?.Number;
        if (!set || !num) continue;

        // Apply number transformation
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
      deck: combinedDeck,
      sideboard: combinedSideboard,
    };

    // Encode and create deck link
    const jsonString = JSON.stringify(jsonCardData);
    const compressed = LZString.compressToEncodedURIComponent(jsonString);

    const deckLink = `${window.location.origin}?deck=${compressed}`;

    navigator.clipboard.writeText(deckLink);

    if (onSnackbar) {
      if (
        !jsonCardData?.leader?.id ||
        jsonCardData?.leader?.id === 'undefined_undefined'
      ) {
        onSnackbar(
          'Copied Sealed Pool Link to Clipboard (No Leader Selected)',
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
