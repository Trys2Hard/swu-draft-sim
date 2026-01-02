import { useState, useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import LeaderFlipButton from './LeaderFlipButton';

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
}) {
  const [flippedLeaders, setFlippedLeaders] = useState({});
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    leaderPacks?.length
      ? setLeaders(leaderPacks.flat())
      : deckLeaders?.length
        ? setLeaders(deckLeaders)
        : setLeaders(currentPack?.[packIndex] || []);
  }, [leaderPacks, deckLeaders, currentPack, packIndex]);

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
      width: leaderPacks ? '100%' : { xs: '100%', md: '900px' },
      display: 'flex',
      alignItems: currentPack && !draftingLeaders ? 'flex-start' : 'center',
      justifyContent: currentPack && !draftingLeaders ? 'flex-start' : 'center',
      mt: '0.5rem',
      mb: '0.5rem',
      p: '0.5rem',
      filter: isLoading ? 'blur(2px)' : 'blur(0)',
      borderBottom: currentPack ? 'none' : '2px solid white',
      border: isLoading ? '1px solid red' : '2px dashed green',
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
      '&: hover': {
        outline: '2px solid rgba(61, 178, 255, 1)',
        boxShadow: '0 0 18px rgba(61, 178, 255, 1)',
      },
    },
  };

  return (
    <Grid container spacing={2} sx={styles.leaders}>
      {/* add sealed import */}
      {(sealedStarted || draftStarted) &&
        leaders.map((card) => {
          const cardId = `card-id-${card.id}`;
          const isFlipped = flippedLeaders[card.id];
          return (
            <Grid
              size={
                currentPack && !draftingLeaders ? 2.4 : leaderPacks ? 2 : 3.5
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
                  width: isFlipped ? '55%' : '100%',
                }}
              />
              {(draftingLeaders || deckLeaders || leaderPacks) && (
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
  );
}
