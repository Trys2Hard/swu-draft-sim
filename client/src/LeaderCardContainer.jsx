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
}) {
  const [flippedLeaders, setFlippedLeaders] = useState({});
  const [leaders, setLeaders] = useState(leaderPacks);

  useEffect(() => {
    leaderPacks ? setLeaders(leaderPacks.flat()) : setLeaders(deckLeaders);
  }, [leaderPacks, deckLeaders]);

  const handleFlipLeader = (id) => {
    setFlippedLeaders((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  //Styles
  const styles = {
    leaders: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      mb: '0.5rem',
      pb: '0.5rem',
      borderBottom: '2px solid white',
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
              size={{ xs: 4, md: 3, lg: 2.5, xl: 2 }}
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
                }}
                onMouseEnter={(e) => handlePopoverOpen(e, card)}
                onMouseLeave={handlePopoverClose}
                sx={{
                  ...styles.leaderCard,
                  width: isFlipped ? '55%' : '100%',
                }}
              />
              <LeaderFlipButton
                id={card.id}
                flippedLeaders={flippedLeaders}
                handleFlipLeader={handleFlipLeader}
              />
            </Grid>
          );
        })}
    </Grid>
  );
}
