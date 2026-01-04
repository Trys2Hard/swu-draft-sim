import { Box, Typography, Grid } from '@mui/material';
import CardHover from './CardHover';
import { useCardHoverPopover } from '../Hooks/useCardHoverPopover';
import CopyJsonButton from './CopyJsonButton';
import SelectBase from '../SealedPage/Components/SelectBase';
import { useState } from 'react';
import CustomSnackbar from './CustomSnackbar';
import LeaderCardContainer from './LeaderCardContainer/LeaderCardContainer';

export default function Deck({
  deckLeaders,
  deckCards,
  setDeckLeaders,
  setDeckCards,
  setSideboardLeaders,
  setSideboardCards,
  sideboardCards,
  setLeaderPacks,
  setCardPacks,
  draftStarted,
  sealedStarted,
  base,
  setBase,
  currentSet,
  sealedImportStarted,
}) {
  const { anchorEl, hoveredCard, handlePopoverOpen, handlePopoverClose } =
    useCardHoverPopover();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');
  const [snackbarStatus, setSnackbarStatus] = useState('success');

  const sortedDeckCards = [...deckCards].sort(
    (a, b) =>
      (a.cardData?.Cost ?? 0) - (b.cardData?.Cost ?? 0) ||
      a.cardData?.Name?.localeCompare(b.cardData?.Name),
  );
  const deckNum = sortedDeckCards.length;

  const handleSnackbar = (text, status) => {
    setSnackbarText(text);
    setSnackbarStatus(status);
    setSnackbarOpen(true);
  };

  function moveToSideboard(id) {
    handlePopoverClose();

    let pickedCard =
      deckLeaders.find((card) => card.id === id) ||
      deckCards.find((card) => card.id === id);
    if (!pickedCard) return;

    const isLeader = pickedCard.cardData?.Type === 'Leader';

    const stateToUpdate = isLeader ? deckLeaders : deckCards;
    const setStateToUpdate = isLeader ? setDeckLeaders : setDeckCards;

    const updatedDeck = stateToUpdate.filter((card) => card.id !== id);
    setStateToUpdate(updatedDeck);

    const addCard = isLeader ? setSideboardLeaders : setSideboardCards;
    if (!addCard) return;

    addCard((prev) => [...prev, pickedCard]);
  }

  function moveToSealedPool(id) {
    handlePopoverClose();

    let pickedCard =
      deckLeaders.find((card) => card.id === id) ||
      deckCards.find((card) => card.id === id);
    if (!pickedCard) return;

    const isLeader = pickedCard.cardData?.Type === 'Leader';

    const stateToUpdate = isLeader ? deckLeaders : deckCards;
    const setStateToUpdate = isLeader ? setDeckLeaders : setDeckCards;

    const updatedDeck = stateToUpdate.filter((card) => card.id !== id);
    setStateToUpdate(updatedDeck);

    const addCard = isLeader ? setLeaderPacks : setCardPacks;
    if (!addCard) return;

    addCard((prev) => [...prev, pickedCard]);
  }

  const leaderAspectColorMap = {
    Vigilance: 'rgba(101, 146, 182, 1), rgba(101, 146, 182, 0.7)',
    Aggression: 'rgba(179, 128, 128, 1), rgba(179, 128, 128, 0.7)',
    Command: 'rgba(162, 216, 173, 1), rgba(162, 216, 173, 0.7)',
    Cunning: 'rgba(204, 204, 140, 1), rgba(204, 204, 140, 0.7)',
  };

  const deckAspectColorMap = {
    Vigilance: 'rgba(101, 146, 182, 0.7), rgba(101, 146, 182, 1)',
    Aggression: 'rgba(179, 128, 128, 0.7), rgba(179, 128, 128, 1)',
    Command: 'rgba(162, 216, 173, 0.7), rgba(162, 216, 173, 1)',
    Cunning: 'rgba(204, 204, 140, 0.7), rgba(204, 204, 140, 1)',
  };

  const aspects = deckLeaders[0]?.cardData?.Aspects || [];
  const leaderColor =
    leaderAspectColorMap[aspects.find((a) => leaderAspectColorMap[a])];

  const deckCardAspects = deckCards
    .flatMap((card) => card?.cardData?.Aspects || [])
    .filter((a) => a !== 'Heroism' && a !== 'Villainy');

  // Count all aspects
  const aspectCounts = Object.entries(
    deckCardAspects.reduce((acc, aspect) => {
      acc[aspect] = (acc[aspect] || 0) + 1;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]); // Sort by count descending

  // Get most repeated (and possibly second)
  const [mostRepeatedAspect] = aspectCounts[0] || [null, 0];
  let deckColor = deckAspectColorMap[mostRepeatedAspect];

  // 🧠 If leaderColor matches deckColor, pick the second most repeated aspect instead
  if (deckColor === leaderColor && aspectCounts.length > 1) {
    const [secondMostAspect] = aspectCounts[1];
    deckColor = deckAspectColorMap[secondMostAspect] || deckColor;
  }

  //Styles
  const styles = {
    deck: {
      position: 'relative',
      height: '100%',
      display:
        !draftStarted && !sealedStarted && !sealedImportStarted
          ? 'none'
          : 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      m: '1rem auto 0 auto',
      color: 'white',
      background:
        leaderColor && deckColor
          ? `linear-gradient(to bottom right, ${leaderColor}, ${deckColor})`
          : 'rgba(29, 64, 77, 1)',
    },
    header: {
      width: '100%',
      height: { xs: '7rem', sm: '4rem' },
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(29, 64, 77, 1)',
    },
    headerRight: {
      position: { xs: 'static', sm: 'absolute' },
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      top: '0.7rem',
      right: '1rem',
    },
    cardCount: {
      ml: '1rem',
      color:
        deckNum === 30
          ? 'rgba(19, 235, 19, 1)'
          : deckNum > 30
            ? 'rgba(233, 233, 12, 1)'
            : 'rgba(255, 0, 0, 1)',
    },
    nonLeaderCard: {
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
    <Box sx={styles.deck}>
      <Box sx={styles.header}>
        <Typography
          variant="h4"
          component="h2"
          sx={{ mb: { xs: '0.8rem', sm: '0' } }}
        >
          Deck
        </Typography>
        <Box sx={styles.headerRight}>
          <SelectBase base={base} setBase={setBase} currentSet={currentSet} />
          <Typography variant="h5" component="p" sx={styles.cardCount}>
            {deckNum}/30
          </Typography>
        </Box>
      </Box>

      <Box sx={{ width: '100%', p: '0.5rem' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <LeaderCardContainer
            deckLeaders={deckLeaders}
            moveToSideboard={moveToSideboard}
            moveToSealedPool={moveToSealedPool}
            handlePopoverOpen={handlePopoverOpen}
            handlePopoverClose={handlePopoverClose}
            draftStarted={draftStarted}
            sealedStarted={sealedStarted}
            sealedImportStarted={sealedImportStarted}
          />
        </Box>

        <Grid
          container
          spacing={{ xs: 0.2, sm: 0.4, lg: 0.8, xl: 1 }}
          sx={{ width: '100%' }}
        >
          {sortedDeckCards.map((card) => {
            const labelId = `card-id-${card.id}`;
            return (
              <Grid
                size={{ xs: 2, md: 1.2 }}
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={(e) => handlePopoverOpen(e, card)}
                onMouseLeave={handlePopoverClose}
                key={labelId}
                onClick={() => {
                  moveToSideboard(card.id);
                  moveToSealedPool(card.id);
                }}
              >
                <Box
                  component="img"
                  src={card.cardData?.FrontArt}
                  id={labelId}
                  sx={styles.nonLeaderCard}
                />
              </Grid>
            );
          })}
          <CardHover
            anchorEl={anchorEl}
            hoveredCard={hoveredCard}
            onHoverClose={handlePopoverClose}
          />
        </Grid>
        <Box
          sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}
        >
          <CopyJsonButton
            deckLeaders={deckLeaders}
            sortedDeckCards={sortedDeckCards}
            sideboardCards={sideboardCards}
            base={base}
            setBase={setBase}
            onSnackbar={handleSnackbar}
          >
            JSON
          </CopyJsonButton>
        </Box>
      </Box>
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarText}
        severity={snackbarStatus}
        onClose={() => setSnackbarOpen(false)}
      />
    </Box>
  );
}
