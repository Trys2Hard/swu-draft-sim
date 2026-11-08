import { Box, Button } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LZString from 'lz-string';
import { useCopyJson } from '../../Hooks/useCopyJson';

/** Convert a card to its Normal Set_Number ID. */
function cardToRawId(card, cardToId) {
  return cardToId(card);
}

export default function CopySealedPool({
  deckLeaders,
  sortedDeckCards,
  sideboardCards,
  leaderPacks,
  cardPacks,
  base,
  normalCards,
  onSnackbar,
}) {
  const { cardToId } = useCopyJson({
    deckLeaders,
    sortedDeckCards,
    sideboardCards,
    leaderPacks,
    base,
    normalCards,
  });

  const handleCopyLink = async () => {
    // Count cards while converting variant IDs to Normal IDs.
    const countCards = (cards) => {
      const countMap = new Map();

      for (const card of cards || []) {
        const id = cardToRawId(card, cardToId);

        if (!id) continue;

        countMap.set(id, (countMap.get(id) || 0) + 1);
      }

      return Array.from(countMap, ([id, count]) => ({
        id,
        count,
      })).sort((a, b) => {
        const numberA = Number(a.id.split('_')[1]);
        const numberB = Number(b.id.split('_')[1]);

        return numberA - numberB;
      });
    };

    // All sealed pool leaders.
    const combinedLeaders = countCards(leaderPacks?.flat() || []);

    // Entire original sealed pool, not the display-sorted cards.
    const combinedPoolCards = countCards(cardPacks?.flat() || []);

    // Built deck leaders.
    const combinedBuiltLeaders = countCards(deckLeaders || []);

    // Built deck cards.
    const combinedBuiltDeckCards = countCards(sortedDeckCards || []);

    // Sideboard cards.
    const combinedSideboard = countCards(sideboardCards || []);

    const jsonCardData = {
      metadata: {
        name: 'SWUDraftSim Sealed Pool',
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

    // Preserve the built deck for restoration when importing.
    if (combinedBuiltLeaders.length > 0 || combinedBuiltDeckCards.length > 0) {
      jsonCardData.builtDeckLeaders = combinedBuiltLeaders;
      jsonCardData.builtDeckCards = combinedBuiltDeckCards;
    }

    // Compress JSON and create the shareable link.
    const jsonString = JSON.stringify(jsonCardData);
    const compressed = LZString.compressToEncodedURIComponent(jsonString);

    const deckLink = `${window.location.origin}?deck=${compressed}`;

    try {
      await navigator.clipboard.writeText(deckLink);
    } catch (error) {
      console.error('Failed to copy sealed pool link:', error);

      onSnackbar?.('Failed to Copy Sealed Pool Link', 'error');
      return;
    }

    if (!combinedLeaders.length) {
      onSnackbar?.('Copied Sealed Pool Link (No Leaders Found)', 'warning');
    } else if (!base) {
      onSnackbar?.('Copied Sealed Pool Link (No Base Selected)', 'warning');
    } else {
      onSnackbar?.('Copied Sealed Pool Link to Clipboard', 'success');
    }
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
        variant='contained'
        sx={{
          width: '100%',
          background: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
          display: 'flex',
          justifyContent: 'flex-start',
        }}
        onClick={handleCopyLink}
        startIcon={<ContentCopyIcon />}
      >
        Sealed Pool Link
      </Button>
    </Box>
  );
}
