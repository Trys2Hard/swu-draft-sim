import { Box, Button } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useCopyJson } from '../../Hooks/useCopyJson';

export default function CopySealedPool({
  deckLeaders,
  sortedDeckCards,
  sideboardCards,
  sealedPoolRemainingCards,
  leaderPacks,
  sortedCardPacks,
  base,
  normalCards,
  onSnackbar,
}) {
  const { handleCopyJson } = useCopyJson({
    deckLeaders,
    sortedDeckCards,
    sideboardCards,
    sealedPoolRemainingCards,
    leaderPacks,
    sortedCardPacks,
    base,
    normalCards,
  });

  const handleExport = async () => {
    const result = await handleCopyJson();

    if (result && onSnackbar) {
      onSnackbar(result.text, result.status);
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
        onClick={handleExport}
        startIcon={<ContentCopyIcon />}
      >
        Sealed Pool JSON
      </Button>
    </Box>
  );
}
