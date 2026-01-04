import { Box, Button } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';

export default function ClearDeck({
  deckCards,
  setDeckCards,
  cardPacks,
  setCardPacks,
}) {
  const handleClick = () => {
    setCardPacks((prev) => [...prev, deckCards]);
    setDeckCards([]);
  };

  //Styles
  const styles = {
    clearDeckButton: {
      fontSize: '0.8rem',
      backgroundColor: 'rgba(65, 65, 65, 1)',
      borderRadius: '5px',
      mt: '0.5rem',
      mr: '0.5rem',
      p: '0.4rem 0.6rem',
      '&:hover': {
        filter: 'brightness(1.2)',
      },
    },
  };

  return (
    <Box>
      {cardPacks && (
        <Button
          variant="contained"
          sx={styles.clearDeckButton}
          onClick={handleClick}
          startIcon={<RestoreIcon />}
        >
          Clear
        </Button>
      )}
    </Box>
  );
}
