import { useState, useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import LeaderFlipButton from './LeaderFlipButton';
import CircularProgress from '@mui/material/CircularProgress';

export default function LeaderCardContainer({
  deckLeaders,
  moveToSideboard,
  moveToSealedPool,
  handlePopoverOpen,
  handlePopoverClose,
  moveToDeck,
  leaderPacks,
  sealedStarted,
  draftStarted,
  currentPack,
  packIndex,
  pickCard,
  draftingLeaders,
  isLoading,
  layout,
  sideboardLeaders,
  sealedImportStarted,
}) {
  const [flippedLeaders, setFlippedLeaders] = useState({});
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    leaderPacks?.length
      ? setLeaders(leaderPacks.flat())
      : deckLeaders?.length
        ? setLeaders(deckLeaders)
        : sideboardLeaders?.length
          ? setLeaders(sideboardLeaders)
          : setLeaders(currentPack?.[packIndex] || []);
  }, [leaderPacks, deckLeaders, currentPack, packIndex, sideboardLeaders]);

  const handleFlipLeader = (id) => {
    setFlippedLeaders((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  //Styles
  const styles = {
    leaders: {
      position: 'relative',
      height: currentPack && draftingLeaders ? '100vh' : '100%',
      minHeight: currentPack && isLoading ? '50vh' : '0',
      width:
        leaderPacks || deckLeaders || sideboardLeaders
          ? '100%'
          : { xs: '100%', md: '900px' },
      display: 'flex',
      alignItems: currentPack && !draftingLeaders ? 'flex-start' : 'center',
      justifyContent: currentPack && !draftingLeaders ? 'flex-start' : 'center',
      mt: '0.5rem',
      mb: '0.5rem',
      p: '0.5rem',
      borderBottom: currentPack ? 'none' : '2px solid white',
    },
    leaderCardContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    leaderCard: {
      width: '100%',
      borderRadius: '5%',
      cursor: 'pointer',
      filter: isLoading ? 'blur(2px)' : 'blur(0)',
      '&: hover': {
        outline: '2px solid rgba(61, 178, 255, 1)',
        boxShadow: '0 0 18px rgba(61, 178, 255, 1)',
      },
    },
    loading: {
      position: 'absolute',
      top: currentPack ? '48%' : '40%',
      left: '50%',
      transform: currentPack
        ? 'translate(-50%, -48%)'
        : 'translate(-50%, -40%)',
      zIndex: 1,
    },
  };

  return (
    <>
      <Grid
        container
        spacing={draftStarted && draftingLeaders ? 2 : 1}
        sx={styles.leaders}
      >
        {isLoading && (
          <Box sx={styles.loading}>
            <CircularProgress size={70} color="white" />
          </Box>
        )}
        {(sealedStarted || draftStarted || sealedImportStarted) &&
          leaders.map((card) => {
            const cardId = `card-id-${card.id}`;
            const isFlipped = flippedLeaders[card.id];
            return (
              <Grid
                size={
                  currentPack && !draftingLeaders
                    ? layout
                    : leaderPacks || deckLeaders || sideboardLeaders
                      ? { xs: 4, md: 2 }
                      : 3.5
                }
                key={cardId}
                id={cardId}
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                sx={styles.leaderCardContainer}
              >
                <Box
                  component="img"
                  src={
                    isFlipped ? card.cardData?.BackArt : card.cardData?.FrontArt
                  }
                  alt={card.cardData?.Name}
                  onClick={() => {
                    moveToDeck && moveToDeck(card.id);
                    moveToSideboard && moveToSideboard(card.id);
                    moveToSealedPool && moveToSealedPool(card.id);
                    pickCard && pickCard(card.id);
                  }}
                  onMouseEnter={(e) => handlePopoverOpen(e, card)}
                  onMouseLeave={handlePopoverClose}
                  sx={{
                    ...styles.leaderCard,
                    width: isFlipped ? '65%' : '100%',
                  }}
                />
                {(draftingLeaders ||
                  deckLeaders ||
                  leaderPacks ||
                  sideboardLeaders) && (
                  <LeaderFlipButton
                    id={card.id}
                    flippedLeaders={flippedLeaders}
                    handleFlipLeader={handleFlipLeader}
                  />
                )}
              </Grid>
            );
          })}
      </Grid>
    </>
  );
}
